# 포케마켓 Poké Market

Stitch 프로젝트 "포켓몬 굿즈샵 디자인"(ID `14012960422707141562`)의 3개 화면을 React로 옮기고, Supabase를 백엔드로 붙인 쇼핑몰입니다.

| 화면 | 경로 | Stitch 원본 |
| --- | --- | --- |
| 포케마켓 메인 홈 | `/` | `.stitch/designs/home.{html,png}` |
| 상품 탐색 및 목록 | `/products` | `.stitch/designs/list.{html,png}` |
| 상품 상세 페이지 | `/products/:slug` | `.stitch/designs/detail.{html,png}` |

## 실행

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 타입체크 + 프로덕션 빌드
```

`.env` 에 Supabase URL과 publishable key가 들어 있습니다(`.env.example` 참고). publishable key는 브라우저에 노출되어도 되는 키이며, 데이터 보호는 RLS가 담당합니다.

포트를 3000으로 고정한 이유: Supabase Auth의 기본 Site URL이 `http://localhost:3000` 이라 가입 인증 메일의 링크가 앱으로 돌아옵니다.

## 구조

```
src/
  lib/        supabase 클라이언트, api(모든 쿼리), 타입, 포맷터
  context/    AuthContext(세션·프로필), ShopContext(찜·장바구니·토스트)
  hooks/      useAsync, useProductFilters(URL 쿼리 = 필터 상태), useProductPurchase
  data/       DB로 옮길 필요 없는 고정 문구·토큰 매핑
  components/ layout · common · product · home · list · detail
  pages/      HomePage · ProductListPage · ProductDetailPage
supabase/
  migrations/ 0001_schema.sql, 0002_functions.sql  (원격 프로젝트에 적용된 것과 동일)
  seed.sql    디자인 콘텐츠 기반 시드
```

디자인 토큰(색·라운드·간격·타이포)은 Stitch HTML의 `tailwind.config` 를 `tailwind.config.js` 로 그대로 옮겼습니다.

## 백엔드 (Supabase 프로젝트 `pokemarket`, ref `vtqfldzmfjkhhznczqwf`, 서울 리전)

- **카탈로그(누구나 읽기)**: `categories`, `characters`, `products`, `product_images`, `product_options`, `related_products`, `banners`, `reviews`
- **회원 데이터(RLS로 본인 행만)**: `profiles`, `wishlists`, `cart_items`, `orders`, `order_items`
- **가격은 전부 서버 계산**: 장바구니는 `product_id + option_ids + quantity` 만 저장하고, 단가·합계는 `cart_items_detailed` 뷰(security_invoker)가 계산합니다.
- **RPC**
  - `add_to_cart(p_product_id, p_option_ids, p_quantity)` — 옵션 검증, 미선택 그룹은 기본 옵션, 같은 구성은 수량 합산
  - `checkout_cart()` — 재고 잠금·확인 → 주문/주문상품 생성 → 재고 차감 → 장바구니 비움. 결제 연동 전이라 주문은 `pending` 으로 생성되고, 적립 예정 코인은 `orders.reward_coins` 에 기록만 합니다.
- **트리거**: 가입 시 프로필 생성(3,000 코인), 리뷰 작성자 정보는 프로필에서 채움, 회원 리뷰 등록 시 상품 평점/리뷰 수 갱신
- **컬럼 권한**: 클라이언트는 `profiles` 의 이름/아바타, `cart_items` 의 수량, `reviews` 의 본문·별점만 쓸 수 있습니다(코인·레벨·추천 리뷰 플래그 등은 불가).
- **이미지**: 공개 Storage 버킷 `goods` (업로드 정책 없음 → 대시보드/서비스 키로만 업로드 가능)

### 대시보드에서 직접 정해야 하는 것

- **이메일 인증**: 기본값은 켜짐(가입 후 메일 링크 확인 필요). 로컬에서 빠르게 써 보려면 Authentication → Sign In / Providers → Email 의 *Confirm email* 을 끄면 됩니다.
- **게스트 로그인**: 로그인 모달의 "게스트로 둘러보기"는 *Anonymous sign-ins* 를 켜야 동작합니다.
