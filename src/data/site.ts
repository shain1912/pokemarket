// DB 로 옮길 필요가 없는 고정 UI 문구와 디자인 토큰 매핑
import type { BadgeTone, CharacterTone, SortKey } from '../lib/types';

export const ANNOUNCEMENT =
  '⚡ 5만원 이상 구매 시 피카츄 미니 캔버스 토트백 증정! | 신규 트레이너 가입 시 3,000 포케코인 즉시 지급';

export const SEARCH_PLACEHOLDER = '잠만보 수면 안대, 이브이 인형 검색해 보세요!';

export const POPULAR_SEARCHES = [
  { label: '#피카츄', to: '/products?q=피카츄' },
  { label: '#이브이프렌즈', to: '/products?q=이브이' },
  { label: '#모찌인형', to: '/products?q=모찌' },
  { label: '#데스크테리어', to: '/products?tag=desk' },
];

/** key 는 현재 URL 의 "주요 조건"과 비교해 활성 탭을 정한다 (useNavKey 참고) */
export const NAV_ITEMS = [
  { label: '전체 카테고리', to: '/products', key: 'all' },
  { label: '신규 입고', to: '/products?sort=new', key: 'sort=new' },
  { label: '봉제인형 & 쿠션', to: '/products?category=plush-cushions', key: 'category=plush-cushions' },
  { label: '문구 & 팬시', to: '/products?category=stationery-fancy', key: 'category=stationery-fancy' },
  { label: '키친 & 리빙', to: '/products?category=kitchen-living', key: 'category=kitchen-living' },
  { label: '패션 & 잡화', to: '/products?category=fashion-goods', key: 'category=fashion-goods' },
  { label: '한정판 기획전', to: '/products?tag=limited', key: 'tag=limited' },
  { label: '이벤트/혜택', to: '/products?sale=1', key: 'sale=1' },
];

export const TAG_LABELS: Record<string, { name: string; emoji: string; description: string }> = {
  limited: { name: '한정판 기획전', emoji: '🌸', description: '수량이 정해진 한정판 굿즈만 모았어요. 품절 전에 만나보세요!' },
  desk: { name: '데스크테리어 굿즈', emoji: '🖥️', description: '책상 위 작업실을 포근하게 바꿔 줄 데스크 굿즈 모음.' },
  homecafe: { name: '홈카페 에디션', emoji: '☕', description: '따스한 홈카페 테이블을 완성하는 포켓몬 테이블웨어.' },
  best: { name: '베스트 굿즈', emoji: '🏆', description: '트레이너들이 가장 많이 찾는 인기 굿즈.' },
};

export const TYPE_FILTERS = [
  { slug: 'electric', label: '전기', emoji: '⚡' },
  { slug: 'normal', label: '노말', emoji: '⚪' },
  { slug: 'water', label: '물', emoji: '💧' },
  { slug: 'fire', label: '불꽃', emoji: '🔥' },
  { slug: 'grass', label: '풀', emoji: '🌿' },
  { slug: 'fairy', label: '페어리', emoji: '✨' },
  { slug: 'psychic', label: '에스퍼', emoji: '🔮' },
];

export const SORT_TABS: { key: SortKey; label: string }[] = [
  { key: 'popular', label: '인기순' },
  { key: 'new', label: '신상품순' },
  { key: 'price', label: '낮은가격순' },
  { key: 'reviews', label: '리뷰많은순' },
];

export const BADGE_TONE_CLASSES: Record<BadgeTone, string> = {
  primary: 'bg-primary-container text-on-primary',
  'primary-soft': 'bg-primary-fixed text-on-primary-fixed',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed',
  neutral: 'bg-surface-container-high text-on-surface',
};

export const CHARACTER_TONE_CLASSES: Record<CharacterTone, { ring: string; badge: string }> = {
  yellow: { ring: 'bg-secondary-fixed', badge: 'bg-secondary-container text-on-secondary-container' },
  beige: { ring: 'bg-surface-container-high', badge: 'bg-surface-container-highest text-on-surface' },
  mint: { ring: 'bg-tertiary-fixed-dim', badge: 'bg-tertiary text-on-tertiary' },
  pink: { ring: 'bg-primary-fixed', badge: 'bg-primary text-on-primary' },
  rose: { ring: 'bg-error-container', badge: 'bg-primary-container text-on-primary' },
  aqua: { ring: 'bg-tertiary-fixed', badge: 'bg-tertiary-container text-on-tertiary-container' },
};

export const HOME_TRUST_BADGES = [
  { icon: 'local_shipping', tone: 'bg-primary-fixed text-primary', title: '안심 번개 배송', body: '평일 15:00 이전 주문 시 당일 출고 원칙' },
  { icon: 'verified', tone: 'bg-secondary-fixed text-secondary', title: '100% 공식 정품 보증', body: '포켓몬코리아 라이선스 인증 홀로그램 부착' },
  { icon: 'loyalty', tone: 'bg-tertiary-fixed text-tertiary', title: '트레이너 멤버십 혜택', body: '구매할 때마다 쌓이는 베리 포인트 & 한정 굿즈' },
];

export const DETAIL_TRUST_BADGES = [
  { icon: 'verified', tone: 'bg-tertiary-fixed text-on-tertiary-fixed', title: '100% 정품 보증', body: '포켓몬 컴퍼니 인증' },
  { icon: 'local_shipping', tone: 'bg-secondary-fixed text-on-secondary-fixed', title: '안심 무료배송', body: '더스트백 이중 포장' },
  { icon: 'award_star', tone: 'bg-primary-fixed text-on-primary-fixed', title: 'KC 어린이 안전인증', body: '유해물질 불검출' },
];

export const SHIPPING_POLICY = [
  { label: '배송 안내', value: '평일 15시 이전 결제 완료 건은 당일 출고됩니다. 3만원 이상 또는 무료배송 상품은 배송비가 없고, 그 외에는 3,000원이 부과됩니다.' },
  { label: '교환 / 반품', value: '상품 수령 후 7일 이내 고객센터로 접수해 주세요. 단순 변심의 경우 왕복 배송비가 발생하며, 택 제거·세탁 후에는 교환/반품이 어렵습니다.' },
  { label: '불량 / 오배송', value: '수령 후 30일 이내 사진과 함께 접수해 주시면 포케마켓이 배송비를 부담하여 새 상품으로 교환해 드립니다.' },
];

export const FOOTER = {
  brand: '포케마켓 Poké Market',
  intro:
    '포켓몬 라이프스타일 굿즈 전문 부티크 스토어. 모든 트레이너들의 일상에 기분 좋은 포근함과 즐거움을 전해드립니다. 공식 라이선스 정품 보증과 세심한 안전 패키징으로 함께합니다.',
  chips: [
    { label: '공식 라이선스 인증', tone: 'bg-tertiary-fixed text-on-tertiary-fixed' },
    { label: '당일 안심 발송', tone: 'bg-secondary-fixed text-on-secondary-fixed' },
    { label: '트레이너 포인트 혜택', tone: 'bg-primary-fixed text-on-primary-fixed' },
  ],
  csTitle: '트레이너 고객센터',
  csPhone: '1588-0025',
  csLines: ['평일 09:30 ~ 18:00 (점심시간 12:30 ~ 13:30)', '주말 및 공휴일 트레이너 휴무', '포켓몬 문의: cs@pokemarket.kr'],
  guideTitle: '쇼핑 가이드 & 안내',
  guides: ['배송 및 주문조회 가이드', '교환 / 반품 / 환불 안내', '트레이너 등급별 베리 혜택', '포케코인 이용 규정'],
  business:
    '(주)포케마켓 | 대표자: 한지우 | 사업자등록번호: 214-88-00251 | 통신판매업신고: 제2024-서울강남-151호 | 개인정보관리책임자: 오박사',
  copyright: '© 2024 Poké Market Boutique. All rights reserved.',
};

export const DEFAULT_AVATAR = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/goods/avatar-default.jpg`;
