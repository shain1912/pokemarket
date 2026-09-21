-- 가입 시 프로필 자동 생성 (신규 트레이너 3,000 포케코인은 profiles.coins 기본값)
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      '게스트'
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 리뷰 작성자 정보는 클라이언트 입력이 아니라 프로필에서 채운다
create function public.reviews_set_author()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
begin
  if v_uid is null then
    return new; -- 시드/서버 입력은 그대로 둔다
  end if;

  new.user_id := v_uid;
  new.is_featured := false;
  new.photo_url := null;
  new.handle := null;

  select p.display_name || ' 트레이너', p.level
    into new.author_name, new.author_level
  from public.profiles p
  where p.id = v_uid;

  if new.author_name is null then
    new.author_name := '트레이너';
  end if;
  return new;
end;
$$;

create trigger reviews_set_author
  before insert on public.reviews
  for each row execute function public.reviews_set_author();

-- 회원 리뷰가 등록되면 상품 평점/리뷰 수를 갱신
create function public.reviews_apply_rating()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.products p
  set rating = round(((p.rating * p.review_count + new.rating)::numeric / (p.review_count + 1)), 1),
      review_count = p.review_count + 1
  where p.id = new.product_id;
  return new;
end;
$$;

create trigger reviews_apply_rating
  after insert on public.reviews
  for each row
  when (new.user_id is not null)
  execute function public.reviews_apply_rating();

-- 장바구니 + 서버 계산 가격 (옵션 추가금 포함). security_invoker 로 RLS 적용
create view public.cart_items_detailed
with (security_invoker = on) as
select
  ci.id,
  ci.user_id,
  ci.product_id,
  ci.option_ids,
  ci.quantity,
  ci.created_at,
  p.slug as product_slug,
  p.name as product_name,
  p.image_url,
  p.stock,
  p.free_shipping,
  p.price + coalesce(o.delta, 0) as unit_price,
  (p.price + coalesce(o.delta, 0)) * ci.quantity as line_total,
  coalesce(o.summary, '') as option_summary
from public.cart_items ci
join public.products p on p.id = ci.product_id
left join lateral (
  select
    sum(po.price_delta)::int as delta,
    string_agg(po.name, ' / ' order by po.sort_order) as summary
  from public.product_options po
  where po.product_id = ci.product_id
    and po.id = any (ci.option_ids)
) o on true;

-- 장바구니 담기: 옵션 검증 + 미선택 그룹은 기본 옵션으로 채움 + 같은 구성은 수량 합산
create function public.add_to_cart(
  p_product_id bigint,
  p_option_ids bigint[] default '{}',
  p_quantity int default 1
)
returns public.cart_items
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_ids bigint[];
  v_row public.cart_items;
begin
  if v_uid is null then
    raise exception '로그인이 필요합니다' using errcode = '28000';
  end if;
  if p_quantity is null or p_quantity < 1 or p_quantity > 99 then
    raise exception '수량은 1~99 사이여야 합니다' using errcode = '22023';
  end if;
  if not exists (select 1 from public.products p where p.id = p_product_id and p.is_active) then
    raise exception '존재하지 않는 상품입니다' using errcode = '22023';
  end if;

  select coalesce(array_agg(distinct x), '{}')
    into v_ids
  from unnest(coalesce(p_option_ids, '{}')) as x;

  if exists (
    select 1 from unnest(v_ids) as x
    where not exists (
      select 1 from public.product_options po
      where po.id = x and po.product_id = p_product_id
    )
  ) then
    raise exception '이 상품에 없는 옵션입니다' using errcode = '22023';
  end if;

  if exists (
    select 1 from public.product_options po
    where po.id = any (v_ids)
    group by po.group_key
    having count(*) > 1
  ) then
    raise exception '옵션 그룹당 하나만 선택할 수 있습니다' using errcode = '22023';
  end if;

  -- 선택하지 않은 옵션 그룹은 기본값으로
  select coalesce(array_agg(id order by id), '{}')
    into v_ids
  from (
    select x as id from unnest(v_ids) as x
    union
    select d.id
    from public.product_options d
    where d.product_id = p_product_id
      and d.is_default
      and not exists (
        select 1 from public.product_options s
        where s.id = any (v_ids) and s.group_key = d.group_key
      )
  ) merged;

  insert into public.cart_items (user_id, product_id, option_ids, quantity)
  values (v_uid, p_product_id, v_ids, p_quantity)
  on conflict (user_id, product_id, option_ids)
  do update set quantity = least(99, public.cart_items.quantity + excluded.quantity)
  returning * into v_row;

  return v_row;
end;
$$;

-- 주문 생성: 금액은 전부 서버에서 계산, 재고 차감, 장바구니 비움
create function public.checkout_cart()
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_items_amount int;
  v_all_free boolean;
  v_shipping int;
  v_order_id bigint;
  v_short text;
begin
  if v_uid is null then
    raise exception '로그인이 필요합니다' using errcode = '28000';
  end if;

  perform 1 from public.cart_items ci where ci.user_id = v_uid for update;

  select sum(d.line_total)::int, bool_and(d.free_shipping)
    into v_items_amount, v_all_free
  from public.cart_items_detailed d
  where d.user_id = v_uid;

  if v_items_amount is null then
    raise exception '장바구니가 비어 있습니다' using errcode = '22023';
  end if;

  -- 동시 주문 대비: 대상 상품 행을 먼저 잠그고 재고 확인
  perform 1
  from public.products p
  where p.id in (select ci.product_id from public.cart_items ci where ci.user_id = v_uid)
  order by p.id
  for update;

  select p.name into v_short
  from public.products p
  join (
    select ci.product_id, sum(ci.quantity) as qty
    from public.cart_items ci
    where ci.user_id = v_uid
    group by ci.product_id
  ) need on need.product_id = p.id
  where p.stock < need.qty
  order by p.id
  limit 1;

  if v_short is not null then
    raise exception '재고가 부족합니다: %', v_short using errcode = '22023';
  end if;

  v_shipping := case when v_all_free or v_items_amount >= 30000 then 0 else 3000 end;

  insert into public.orders (user_id, items_amount, shipping_fee, total_amount, reward_coins)
  values (v_uid, v_items_amount, v_shipping, v_items_amount + v_shipping, floor(v_items_amount * 0.03)::int)
  returning id into v_order_id;

  insert into public.order_items (order_id, product_id, product_name, option_summary, unit_price, quantity)
  select v_order_id, d.product_id, d.product_name, d.option_summary, d.unit_price, d.quantity
  from public.cart_items_detailed d
  where d.user_id = v_uid
  order by d.created_at;

  update public.products p
  set stock = p.stock - need.qty,
      sales_count = p.sales_count + need.qty
  from (
    select ci.product_id, sum(ci.quantity)::int as qty
    from public.cart_items ci
    where ci.user_id = v_uid
    group by ci.product_id
  ) need
  where need.product_id = p.id;

  delete from public.cart_items ci where ci.user_id = v_uid;

  return v_order_id;
end;
$$;

-- 실행 권한: 트리거 함수는 직접 호출 금지, RPC 는 로그인 사용자만
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.reviews_set_author() from public, anon, authenticated;
revoke execute on function public.reviews_apply_rating() from public, anon, authenticated;
revoke execute on function public.add_to_cart(bigint, bigint[], int) from public, anon;
revoke execute on function public.checkout_cart() from public, anon;
grant execute on function public.add_to_cart(bigint, bigint[], int) to authenticated;
grant execute on function public.checkout_cart() to authenticated;

-- 뷰는 읽기 전용으로만 노출
revoke all on public.cart_items_detailed from anon, authenticated;
grant select on public.cart_items_detailed to authenticated;
