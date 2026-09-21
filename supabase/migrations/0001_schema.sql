-- 포케마켓 스키마: 카탈로그(공개 읽기) + 회원 데이터(본인만 접근)

-- ---------------------------------------------------------------------------
-- 카탈로그
-- ---------------------------------------------------------------------------
create table public.categories (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  name_en text,
  emoji text,
  description text,
  sort_order int not null default 0
);

create table public.characters (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  type_label text not null,
  item_count int not null default 0,
  image_url text not null,
  badge_emoji text,
  tone text not null default 'neutral',
  sort_order int not null default 0
);

create table public.products (
  id bigint generated always as identity primary key,
  slug text not null unique,
  category_id bigint not null references public.categories (id),
  character_id bigint references public.characters (id) on delete set null,
  name text not null,
  short_name text,
  subtitle text,
  sub_category text,
  form text,
  form_label text,
  types text[] not null default '{}',
  type_label text,
  price int not null check (price >= 0),
  original_price int check (original_price is null or original_price > price),
  discount_percent int generated always as (
    case
      when original_price is null then 0
      else round((original_price - price) * 100.0 / original_price)::int
    end
  ) stored,
  rating numeric(2, 1) not null default 0 check (rating between 0 and 5),
  review_count int not null default 0,
  sales_count int not null default 0,
  stock int not null default 100 check (stock >= 0),
  image_url text not null,
  badge_text text,
  badge_tone text,
  same_day_shipping boolean not null default false,
  free_shipping boolean not null default false,
  tags text[] not null default '{}',
  detail jsonb not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index products_category_id_idx on public.products (category_id);
create index products_character_id_idx on public.products (character_id);
create index products_sales_count_idx on public.products (sales_count desc);
create index products_types_idx on public.products using gin (types);
create index products_tags_idx on public.products using gin (tags);

create table public.product_images (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products (id) on delete cascade,
  url text not null,
  label text,
  sort_order int not null default 0
);
create index product_images_product_id_idx on public.product_images (product_id);

create table public.product_options (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products (id) on delete cascade,
  group_key text not null,
  group_label text not null,
  name text not null,
  description text,
  price_delta int not null default 0,
  badge_text text,
  is_default boolean not null default false,
  sort_order int not null default 0
);
create index product_options_product_id_idx on public.product_options (product_id);

create table public.related_products (
  product_id bigint not null references public.products (id) on delete cascade,
  related_product_id bigint not null references public.products (id) on delete cascade,
  badge_text text,
  badge_tone text,
  sort_order int not null default 0,
  primary key (product_id, related_product_id),
  check (product_id <> related_product_id)
);
create index related_products_related_product_id_idx on public.related_products (related_product_id);

create table public.banners (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('hero', 'curation')),
  tone text not null default 'primary',
  icon text,
  eyebrow text,
  tag_text text,
  title text not null,
  title_highlight text,
  body text,
  cta_label text,
  cta_href text,
  promo_text text,
  promo_highlight text,
  image_url text not null,
  image_badge_top text,
  image_badge_bottom text,
  sort_order int not null default 0,
  is_active boolean not null default true
);

-- ---------------------------------------------------------------------------
-- 회원
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  level int not null default 1,
  coins int not null default 3000 check (coins >= 0),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  author_name text not null,
  author_level int,
  handle text,
  rating int not null check (rating between 1 and 5),
  content text not null check (char_length(content) between 5 and 1000),
  option_text text,
  tags text[] not null default '{}',
  photo_url text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);
create index reviews_product_id_idx on public.reviews (product_id, created_at desc);
create index reviews_user_id_idx on public.reviews (user_id);

create table public.wishlists (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  product_id bigint not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);
create index wishlists_product_id_idx on public.wishlists (product_id);

create table public.cart_items (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  product_id bigint not null references public.products (id) on delete cascade,
  option_ids bigint[] not null default '{}',
  quantity int not null check (quantity between 1 and 99),
  created_at timestamptz not null default now(),
  unique (user_id, product_id, option_ids)
);
create index cart_items_product_id_idx on public.cart_items (product_id);

create table public.orders (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  items_amount int not null,
  shipping_fee int not null default 0,
  total_amount int not null,
  reward_coins int not null default 0,
  created_at timestamptz not null default now()
);
create index orders_user_id_idx on public.orders (user_id, created_at desc);

create table public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders (id) on delete cascade,
  product_id bigint references public.products (id) on delete set null,
  product_name text not null,
  option_summary text not null default '',
  unit_price int not null,
  quantity int not null check (quantity > 0)
);
create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_product_id_idx on public.order_items (product_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.characters enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_options enable row level security;
alter table public.related_products enable row level security;
alter table public.banners enable row level security;
alter table public.profiles enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlists enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "catalog read" on public.categories for select to anon, authenticated using (true);
create policy "catalog read" on public.characters for select to anon, authenticated using (true);
create policy "catalog read" on public.products for select to anon, authenticated using (is_active);
create policy "catalog read" on public.product_images for select to anon, authenticated using (true);
create policy "catalog read" on public.product_options for select to anon, authenticated using (true);
create policy "catalog read" on public.related_products for select to anon, authenticated using (true);
create policy "catalog read" on public.banners for select to anon, authenticated using (is_active);
create policy "reviews read" on public.reviews for select to anon, authenticated using (true);

create policy "own profile read" on public.profiles for select to authenticated
  using (id = (select auth.uid()));
create policy "own profile update" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "own review insert" on public.reviews for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "own review delete" on public.reviews for delete to authenticated
  using (user_id = (select auth.uid()));

create policy "own wishlist read" on public.wishlists for select to authenticated
  using (user_id = (select auth.uid()));
create policy "own wishlist insert" on public.wishlists for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "own wishlist delete" on public.wishlists for delete to authenticated
  using (user_id = (select auth.uid()));

create policy "own cart read" on public.cart_items for select to authenticated
  using (user_id = (select auth.uid()));
create policy "own cart insert" on public.cart_items for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "own cart update" on public.cart_items for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "own cart delete" on public.cart_items for delete to authenticated
  using (user_id = (select auth.uid()));

create policy "own orders read" on public.orders for select to authenticated
  using (user_id = (select auth.uid()));
create policy "own order items read" on public.order_items for select to authenticated
  using (exists (
    select 1 from public.orders o
    where o.id = order_items.order_id and o.user_id = (select auth.uid())
  ));

-- 클라이언트가 바꿀 수 있는 컬럼만 허용 (코인·레벨·추천 여부 등은 서버만 변경)
revoke update on public.profiles from anon, authenticated;
grant update (display_name, avatar_url) on public.profiles to authenticated;

revoke insert, update on public.reviews from anon, authenticated;
grant insert (product_id, rating, content, option_text, tags) on public.reviews to authenticated;

revoke update on public.cart_items from anon, authenticated;
grant update (quantity) on public.cart_items to authenticated;
