-- 포케마켓 시드 데이터 (Stitch 디자인의 콘텐츠 기준)
-- 이미지 경로의 '@/' 는 맨 아래에서 Storage 공개 URL 로 치환된다.

insert into public.categories (slug, name, name_en, emoji, description, sort_order) values
  ('plush-cushions', '봉제인형 & 쿠션', 'Plush & Cushions', '🧸', '품에 쏙 안기는 말랑말랑 포켓몬 친구들을 만나보세요! 모든 인형은 안전 검증 원단으로 제작됩니다.', 1),
  ('stationery-fancy', '문구 & 팬시', 'Stationery & Fancy', '✏️', '책상 위를 포근하게 채워 줄 포켓몬 문구와 데스크테리어 굿즈를 만나보세요.', 2),
  ('kitchen-living', '키친 & 리빙', 'Kitchen & Living', '☕', '홈카페 테이블부터 침실 무드등까지, 일상 공간을 포켓몬과 함께 꾸며보세요.', 3),
  ('fashion-goods', '패션 & 잡화', 'Fashion & Goods', '🎒', '매일 들고 다니는 소품에 포켓몬 포인트를 더해보세요.', 4);

insert into public.characters (slug, name, type_label, item_count, image_url, badge_emoji, tone, sort_order) values
  ('pikachu', '피카츄', '전기타입', 142, '@/char-pikachu.jpg', '⚡', 'yellow', 1),
  ('eevee', '이브이', '노말타입', 98, '@/char-eevee.jpg', '🦊', 'beige', 2),
  ('snorlax', '잠만보', '수면타입', 64, '@/char-snorlax.jpg', '💤', 'mint', 3),
  ('ditto', '메타몽', '말랑이', 52, '@/char-ditto.jpg', '🟣', 'pink', 4),
  ('mew-togepi', '뮤 & 토게피', '요정친구', 43, '@/char-mew-togepi.jpg', '✨', 'rose', 5),
  ('squirtle-charmander', '꼬부기·파이리', '스타팅즈', 87, '@/char-squirtle-charmander.jpg', '💧', 'aqua', 6);

insert into public.products (
  slug, category_id, character_id, name, short_name, subtitle, sub_category, form, form_label,
  types, type_label, price, original_price, rating, review_count, sales_count, stock, image_url,
  badge_text, badge_tone, same_day_shipping, free_shipping, tags, created_at
)
select
  v.slug, c.id, ch.id, v.name, v.short_name, v.subtitle, v.sub_category, v.form, v.form_label,
  v.types, v.type_label, v.price, v.original_price, v.rating, v.review_count, v.sales_count, v.stock, v.image_url,
  v.badge_text, v.badge_tone, v.same_day, v.free_ship, v.tags, now() - make_interval(days => v.age_days)
from (values
  ('snorlax-nap-body-pillow', 'plush-cushions', 'snorlax', '[포케마켓 단독] 잠만보 낮잠 대형 쫀득 바디필로우 80cm', '잠만보 바디필로우', '쫀득한 모찌 극세사 원단으로 껴안는 순간 스르륵 잠에 빠져드는 마성의 수면 메이트', '대형 바디필로우', 'large-plush', '대형 안고자는 인형', array['normal'], '노말', 38000, 47500, 4.9, 1248, 12480, 150, '@/snorlax-pillow.jpg', null, null, true, true, array['limited', 'best'], 40),
  ('ditto-mochi-cushion', 'plush-cushions', 'ditto', '모찌모찌 메타몽 변신 모찌 쿠션 인형 (퍼플)', '메타몽 모찌쿠션', '찹쌀떡처럼 말랑한 촉감, 꾹 눌러도 천천히 돌아오는 힐링 모찌 쿠션', '모찌 시리즈', 'mochi-cushion', '쫀득 모찌 쿠션', array['normal'], '노말', 24000, null, 4.8, 892, 8920, 14, '@/ditto-mochi.jpg', '품절임박', 'primary', false, false, array[]::text[], 60),
  ('eevee-evolution-mood-lamp', 'kitchen-living', 'eevee', '이브이 진화트리 아크릴 무드등 스탠드 (USB 조절형)', '이브이 무드등', '이브이 진화 라인을 새긴 아크릴 플레이트에 은은한 웜톤 조명을 더한 감성 무드등', '인테리어 / 조명', 'lighting', '무드등 & 조명', array['normal'], '노말', 32000, 37600, 4.9, 643, 6430, 80, '@/eevee-lamp.jpg', '감성템', 'secondary', false, false, array['desk'], 25),
  ('pikachu-hip-airpods-case', 'fashion-goods', 'pikachu', '피카츄 엉덩이 실리콘 에어팟/버즈 케이스 (키링 포함)', '피카츄 에어팟케이스', '통통한 피카츄 뒷모습 그대로, 꼬리 키링이 포인트인 말랑 실리콘 케이스', '테크 액세서리', 'tech-accessory', '테크 액세서리', array['electric'], '전기', 16000, null, 4.7, 512, 5120, 200, '@/pikachu-airpods-case.jpg', null, null, false, true, array[]::text[], 30),
  ('pikachu-cheek-keyring', 'plush-cushions', 'pikachu', '피카츄 볼 찌부 봉제 키링 가방고리', '피카츄 찌부 키링', '말랑한 빨간 볼을 꾹 누르고 싶어지는 미니 봉제 키링', '미니 키링', 'keyring', '미니 가방고리 키링', array['electric'], '전기', 12000, null, 5.0, 1208, 4980, 300, '@/pikachu-keyring.jpg', 'BEST ⚡', 'secondary', false, false, array['best'], 50),
  ('ditto-pikachu-reversible', 'plush-cushions', 'ditto', '메타몽 변신 피카츄 2 in 1 리버서블 인형', '메타몽 리버서블', '뒤집으면 피카츄로 변신! 하나로 두 가지 매력을 즐기는 리버서블 인형', '변신 완구', 'toy', '움직이는 토이', array['normal'], '노말', 26000, null, 4.8, 455, 4550, 120, '@/ditto-reversible.jpg', '2 in 1 리버서블', 'tertiary', false, false, array[]::text[], 20),
  ('slowpoke-dazed-cushion', 'plush-cushions', null, '야돈 멍때리는 쿠션 (초극세사)', '야돈 쿠션', '멍한 표정이 매력 포인트, 초극세사 원단의 대형 쫀득 쿠션', '쫀득 쿠션', 'mochi-cushion', '쫀득 모찌 쿠션', array['water', 'psychic'], '물/에스퍼', 29000, 32000, 4.9, 680, 4100, 90, '@/slowpoke-cushion.jpg', null, null, true, false, array[]::text[], 35),
  ('togepi-happy-egg', 'plush-cushions', 'mew-togepi', '파스텔 토게피 해피 에그 인형', '토게피 인형', '파스텔 알껍질 속에 쏙 들어간 행복 가득 토게피 모찌 인형', '모찌 인형', 'mochi-cushion', '쫀득 모찌 쿠션', array['fairy'], '페어리', 22000, null, 4.7, 189, 3700, 70, '@/togepi-egg.jpg', null, null, false, false, array[]::text[], 12),
  ('vulpix-alola-twin-set', 'plush-cushions', null, '식스테일 & 알로라 식스테일 트윈 세트', '식스테일 트윈 세트', '불꽃과 얼음, 두 식스테일을 한 번에 만나는 한정 트윈 2종팩', '트윈 2종팩', 'large-plush', '대형 안고자는 인형', array['fire', 'ice'], '불꽃/얼음', 45000, 50000, 5.0, 312, 3300, 40, '@/vulpix-twin.jpg', '한정 트윈세트', 'primary-soft', false, true, array['limited'], 8),
  ('gengar-mini-pouch', 'plush-cushions', null, '팬텀 다크 퍼플 미니 파우치 인형', '팬텀 파우치', '장난기 가득한 팬텀 얼굴 그대로, 동전과 립밤이 쏙 들어가는 파우치 인형', '파우치형 인형', 'keyring', '미니 가방고리 키링', array['ghost', 'poison'], '고스트/독', 18000, null, 4.8, 521, 2900, 110, '@/gengar-pouch.jpg', null, null, true, false, array[]::text[], 18),
  ('eevee-friends-blanket-set', 'plush-cushions', 'eevee', '이브이 프렌즈 블랭킷 담요 세트', '이브이 블랭킷 세트', '돌돌 말린 이브이 롤쿠션을 펼치면 포근한 플리스 담요가 되는 2 in 1 세트', '쿠션 & 블랭킷', 'mochi-cushion', '쫀득 모찌 쿠션', array['normal'], '노말', 34000, 42000, 4.9, 740, 2500, 95, '@/eevee-blanket.jpg', '인기 기획전', 'secondary', false, true, array[]::text[], 5),
  ('snorlax-3d-sleep-eye-mask', 'fashion-goods', 'snorlax', '잠만보 3D 입체 암막 수면 안대', '잠만보 수면 안대', '눈두덩이를 누르지 않는 3D 입체 구조로 빛을 완벽 차단하는 폭신한 수면 안대', '수면 & 힐링', 'sleep', '수면 & 힐링', array['normal'], '노말', 14400, 16000, 4.8, 276, 2100, 180, '@/snorlax-eyemask.jpg', null, null, true, false, array[]::text[], 15),
  ('pikachu-ear-room-slippers', 'fashion-goods', 'pikachu', '피카츄 쫑긋귀 푹신 거실 룸슬리퍼', '피카츄 룸슬리퍼', '걸을 때마다 쫑긋 귀가 흔들리는 폭신한 실내용 룸슬리퍼', '홈웨어 & 슈즈', 'homewear', '홈웨어', array['electric'], '전기', 19800, 22000, 4.7, 198, 1800, 160, '@/pikachu-slipper.jpg', null, null, false, false, array[]::text[], 22),
  ('eevee-cozy-flannel-pajama-pants', 'fashion-goods', 'eevee', '이브이 코지 플란넬 이지 수면 바지', '이브이 수면 바지', '보들보들한 플란넬 원단에 이브이 패턴을 담은 이지 핏 수면 바지', '홈웨어 & 파자마', 'homewear', '홈웨어', array['normal'], '노말', 26100, 29000, 4.8, 164, 1500, 140, '@/eevee-pajama.jpg', null, null, false, false, array[]::text[], 28),
  ('snorlax-silicone-touch-lamp', 'kitchen-living', 'snorlax', '잠만보 말랑 실리콘 터치 무드등', '잠만보 무드등', '톡 건드리면 켜지는 말랑 실리콘 무드등, 은은한 골드빛으로 꿀잠 분위기 완성', '인테리어 & 조명', 'lighting', '무드등 & 조명', array['normal'], '노말', 22500, 25000, 4.8, 231, 1300, 130, '@/snorlax-moodlight.jpg', null, null, false, false, array['desk'], 10),
  ('pikachu-wireless-mouse-deskpad-set', 'stationery-fancy', 'pikachu', '열일하는 피카츄 무소음 무선 마우스 & 광폭 방수 장패드 세트', '피카츄 마우스 세트', '무소음 클릭 피카츄 마우스와 광폭 방수 장패드로 완성하는 포근한 데스크테리어', '데스크테리어', 'desk', '데스크 굿즈', array['electric'], '전기', 29000, null, 4.8, 320, 3000, 85, '@/curation-desk.jpg', null, null, true, false, array['desk'], 3),
  ('jigglypuff-ceramic-mug-plate-set', 'kitchen-living', null, '푸린 세라믹 머그 & 달콤 디저트 플레이트 에디션', '푸린 머그 세트', '부드러운 딸기우유빛 유약으로 완성한 수제 핸드메이드 도자기 머그와 티스푼 세트', '홈카페', 'tableware', '머그 & 플레이트', array['normal', 'fairy'], '노말/페어리', 27000, null, 4.9, 410, 2800, 60, '@/curation-homecafe.jpg', null, null, false, false, array['homecafe'], 2)
) as v (
  slug, cat, chr, name, short_name, subtitle, sub_category, form, form_label,
  types, type_label, price, original_price, rating, review_count, sales_count, stock, image_url,
  badge_text, badge_tone, same_day, free_ship, tags, age_days
)
join public.categories c on c.slug = v.cat
left join public.characters ch on ch.slug = v.chr;

-- 잠만보 바디필로우 상세 콘텐츠
update public.products
set detail = $json${
  "main_image": "@/snorlax-main.jpg",
  "type_tag": { "icon": "bedtime", "text": "노말 타입 · 낮잠 파트너" },
  "rank_label": "포케마켓 BEST 1위",
  "exclusive_label": "단독기획",
  "satisfaction": 99,
  "qna_count": 34,
  "rating_breakdown": [
    { "label": "5점 만점", "percent": 92 },
    { "label": "4점 추천", "percent": 7 },
    { "label": "3점 보통", "percent": 1 }
  ],
  "story": {
    "eyebrow": "POKÉMON RELAX LIFE",
    "title": "지친 하루 끝,\n잠만보의 폭신한 품으로 다이빙!",
    "highlight": "잠만보의 폭신한 품",
    "body": "피곤한 트레이너들을 위해 포케마켓이 오랜 시간 연구하여 완성한 프리미엄 수면 솔루션. 손끝을 감싸는 부드러운 극세사 모찌 터치감과 몸에 감기는 복원력으로 가장 안락한 수면 루틴을 선사합니다.",
    "image": "@/snorlax-story.jpg"
  },
  "features_title": "포케마켓만의 특별한 3가지 디테일",
  "features": [
    {
      "point": "POINT 01", "tone": "primary", "icon": "cached",
      "title": "마시멜로우처럼 쫀득한 모찌 극세사 솜",
      "body": "일반 솜과 달리 꺼짐 현상이 극히 적은 고밀도 모찌 마이크로화이버를 1,400g 꽉 채워 수개월 사용 후에도 쫀득한 복원력을 유지합니다.",
      "note": "형태 복원율 98.6% 시험 통과",
      "image": "@/snorlax-point-1.jpg"
    },
    {
      "point": "POINT 02", "tone": "secondary", "icon": "verified_user",
      "title": "포켓몬 정품 홀로그램 라이선스 태그",
      "body": "정식 라이선스 계약을 통해 생산된 100% 공식 굿즈입니다. 고유 시리얼 번호가 각인된 입체 홀로그램 라벨로 위조품 걱정 없이 소장하세요.",
      "note": "홀로그램 정품 넘버링 부여",
      "image": "@/snorlax-point-2.jpg"
    },
    {
      "point": "POINT 03", "tone": "tertiary", "icon": "local_laundry_service",
      "title": "겉감 지퍼 분리형 위생 세탁 구조",
      "body": "아이 피부에 닿아도 안전하도록 히든 콘실 지퍼를 채택했습니다. 겉 커버만 간편하게 쏙 분리하여 세탁기 울코스로 깨끗하게 관리할 수 있습니다.",
      "note": "세탁기 물세탁 안심 가능",
      "image": "@/snorlax-point-3.jpg"
    }
  ],
  "specs": [
    { "label": "품명 및 모델명", "value": "포케마켓 낮잠 쫀득 바디필로우 80cm" },
    { "label": "재질 및 소재", "value": "겉감: 폴리에스터 95%, 스판덱스 5% / 충전재: 모찌 마이크로화이버 100%" },
    { "label": "사이즈 / 무게", "value": "80 x 48 x 32 (cm) / 약 1,450g" },
    { "label": "제조국 / 수입원", "value": "대한민국 디자인 / (주)포케마켓 OEM" },
    { "label": "안전 인증", "value": "KC 어린이 공급자 적합성 안전확인 인증 완료", "highlight": true }
  ],
  "size_guide": {
    "basis": "키 165cm 트레이너 기준",
    "items": [
      { "size": "80cm", "name": "80cm (스탠다드)", "use": "낮잠/데스크용", "scale": "sm" },
      { "size": "120cm", "name": "120cm (점보)", "use": "침대 전신 바디필로우", "scale": "lg" }
    ],
    "tip": "1인 가구 원룸 또는 소파용은 80cm를, 침대 전신 수면용은 120cm를 추천합니다!"
  },
  "cross_sell": {
    "badge": "세트 구매 특별 혜택",
    "perk": "추가 10% OFF",
    "title": "잠만보와 함께 구매하면 꿀잠력 200% UP! ⚡",
    "body": "장바구니에 함께 담을 시 세트 할인 프로모션 코드가 자동 적용됩니다."
  }
}$json$::jsonb
where slug = 'snorlax-nap-body-pillow';

insert into public.product_images (product_id, url, label, sort_order)
select p.id, v.url, v.label, v.sort_order
from public.products p,
  (values
    ('@/snorlax-front.jpg', '전면', 1),
    ('@/snorlax-embroidery.jpg', '자수 디테일', 2),
    ('@/snorlax-size.jpg', '착용/사이즈', 3),
    ('@/snorlax-zipper.jpg', '지퍼 세탁 분리', 4)
  ) as v (url, label, sort_order)
where p.slug = 'snorlax-nap-body-pillow';

insert into public.product_options (product_id, group_key, group_label, name, description, price_delta, badge_text, is_default, sort_order)
select p.id, v.group_key, v.group_label, v.name, v.description, v.price_delta, v.badge_text, v.is_default, v.sort_order
from public.products p,
  (values
    ('size', '사이즈 선택', '80cm (기본)', '품에 쏙 감기는 표준 사이즈', 0, null, true, 1),
    ('size', '사이즈 선택', '120cm 점보', '온몸으로 껴안는 침대 메이트', 18000, null, false, 2),
    ('face', '잠만보 표정 옵션', '쿨쿨 자는 얼굴', '평온한 꿀잠 표정', 0, '인기', true, 3),
    ('face', '잠만보 표정 옵션', '얌얌 하품 얼굴', '귀여운 입 벌린 표정', 0, null, false, 4)
  ) as v (group_key, group_label, name, description, price_delta, badge_text, is_default, sort_order)
where p.slug = 'snorlax-nap-body-pillow';

insert into public.related_products (product_id, related_product_id, badge_text, badge_tone, sort_order)
select p.id, r.id, v.badge_text, v.badge_tone, v.sort_order
from public.products p,
  (values
    ('snorlax-3d-sleep-eye-mask', '함께 구매 1위', 'primary', 1),
    ('pikachu-ear-room-slippers', '세트 10%', 'secondary', 2),
    ('eevee-cozy-flannel-pajama-pants', '세트 10%', 'secondary', 3),
    ('snorlax-silicone-touch-lamp', '인기 소품', 'tertiary', 4)
  ) as v (slug, badge_text, badge_tone, sort_order)
join public.products r on r.slug = v.slug
where p.slug = 'snorlax-nap-body-pillow';

insert into public.reviews (product_id, author_name, author_level, handle, rating, content, option_text, tags, photo_url, is_featured, created_at)
select p.id, v.author_name, v.author_level, v.handle, 5, v.content, v.option_text, v.tags, v.photo_url, v.is_featured, now() - make_interval(days => v.age_days)
from (values
  ('snorlax-nap-body-pillow', '민지 트레이너', 18, null, '퇴근하고 안고 자면 진짜 기절각입니다... 솜이 싸구려 솜이 아니라 쫀득쫀득하게 착 감겨서 불면증 사라졌어요! 정품 택도 확실하고 커버 세탁되는 게 대박입니다 ㅠㅠ', '80cm / 쿨쿨 자는 얼굴 구매', array['모찌촉감대박', '지퍼세탁편함'], null, true, 2),
  ('snorlax-nap-body-pillow', '현우 트레이너', 24, null, '점보 120cm 샀는데 침대 반을 차지할 정도로 엄청 큽니다 ㅋㅋㅋ 다리 얹고 자기 딱 좋은 두께감이고 표정이 너무 멍청하게 귀여워서 보고만 있어도 힐링돼요. 배송도 하루만에 왔습니다!', '120cm 점보 / 얌얌 하품 구매', array['특급배송', '점보사이즈추천'], null, true, 5),
  ('snorlax-nap-body-pillow', '@snorlax_lover', null, '@snorlax_lover', '퇴근하고 누울 때마다 천국이에요... 쫀득쫀득해서 한 번 누우면 영원히 못 일어남 ㅠㅠ 배송도 하루만에 왔어요!', '90cm 특대형', array[]::text[], '@/review-snorlax.jpg', false, 7),
  ('eevee-evolution-mood-lamp', '@desk_trainer', null, '@desk_trainer', '실물이 진짜 깡패예요... 밤에 켜놓고 작업하면 힐링 그 자체! 이브이 꼬리 디테일까지 살아있어요 ✨', '웜화이트 스탠드', array[]::text[], '@/review-eevee-lamp.jpg', false, 8),
  ('ditto-mochi-cushion', '@ditto_squish', null, '@ditto_squish', '진짜 찹쌀떡 같은 말랑함... 친구 생일 선물로 줬는데 너무 귀여워서 제 것도 하나 더 샀습니다 💜', '오리지널 퍼플', array[]::text[], '@/review-ditto.jpg', false, 9),
  ('pikachu-hip-airpods-case', '@pika_spring', null, '@pika_spring', '가방에 달고 다니니까 다들 어디서 샀냐고 물어봐요 ㅋㅋㅋ 꼬리 키링이 킬포인트입니다 대만족!', '에어팟 프로 2세대', array[]::text[], '@/review-pikachu-case.jpg', false, 10)
) as v (slug, author_name, author_level, handle, content, option_text, tags, photo_url, is_featured, age_days)
join public.products p on p.slug = v.slug;

insert into public.banners (kind, tone, icon, eyebrow, tag_text, title, title_highlight, body, cta_label, cta_href, promo_text, promo_highlight, image_url, image_badge_top, image_badge_bottom, sort_order) values
  ('hero', 'primary', 'spa', '2024 SPRING SPECIAL', '선착순 홀로그램 스티커팩 증정', E'봄바람과 함께 찾아온\n포켓몬 스프링 피크닉 컬렉션 🌸', '포켓몬 스프링 피크닉', '포케마켓 한정판 벚꽃 피카츄 모찌 인형부터 이브이 보온 런치백 & 뮤 글라스 텀블러 세트 단독 론칭!', '컬렉션 보러가기', '/products?tag=limited', '론칭 기념 전품목 10% 즉시 페이백', '10% 즉시 페이백', '@/hero-spring-picnic.jpg', '한정수량 300개', '모찌 텍스처 100% 솜털 쿠션', 1),
  ('hero', 'primary', 'desktop_windows', 'DESKTERIOR WEEK', '데스크 굿즈 기획전', E'매일 앉는 책상 위에\n피카츄 데스크테리어 한 스푼 ⚡', '피카츄 데스크테리어', '무소음 클릭 피카츄 마우스와 쫀득한 이브이 손목 받침대로 매일 반복되는 업무를 포근하게 바꿔요.', '기획전 보러가기', '/products?tag=desk', '데스크 굿즈 당일 몬스터볼 특급배송', '특급배송', '@/curation-desk.jpg', '트레이너 추천', '무소음 클릭 · 광폭 방수 장패드', 2),
  ('hero', 'primary', 'coffee', 'HOME CAFE EDITION', '핸드메이드 도자기', E'포근한 오후를 채우는\n푸린 홈카페 에디션 ☕', '푸린 홈카페 에디션', '부드러운 딸기우유빛 유약으로 완성한 수제 핸드메이드 도자기 머그와 티스푼 세트.', '홈카페 에디션 구경하기', '/products?tag=homecafe', '머그 세트 구매 시 티스푼 증정', '티스푼 증정', '@/curation-homecafe.jpg', '수제 한정 제작', '딸기우유빛 유약 마감', 3),
  ('curation', 'secondary', 'desktop_windows', '데스크테리어 굿즈 기획전', null, E'열일하는 피카츄 무선 마우스 &\n광폭 방수 장패드 모음', null, '무소음 클릭 피카츄 마우스와 쫀득한 이브이 손목 받침대로 매일 반복되는 업무를 포근하게 바꿔요.', '기획전 상품 전체보기', '/products?tag=desk', null, null, '@/curation-desk.jpg', null, null, 1),
  ('curation', 'primary', 'coffee', '포근한 홈카페 굿즈', null, E'푸린 세라믹 머그 &\n달콤 디저트 플레이트 에디션', null, '부드러운 딸기우유빛 유약으로 완성한 수제 핸드메이드 도자기 머그와 티스푼 세트.', '홈카페 에디션 구경하기', '/products?tag=homecafe', null, null, '@/curation-homecafe.jpg', null, null, 2);

-- '@/' → Storage 공개 URL
do $$
declare
  v_prefix constant text := 'https://vtqfldzmfjkhhznczqwf.supabase.co/storage/v1/object/public/goods/';
begin
  update public.characters set image_url = replace(image_url, '@/', v_prefix);
  update public.products set image_url = replace(image_url, '@/', v_prefix),
                             detail = replace(detail::text, '@/', v_prefix)::jsonb;
  update public.product_images set url = replace(url, '@/', v_prefix);
  update public.reviews set photo_url = replace(photo_url, '@/', v_prefix) where photo_url is not null;
  update public.banners set image_url = replace(image_url, '@/', v_prefix);
end;
$$;
