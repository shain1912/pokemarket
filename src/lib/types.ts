export interface Category {
  id: number;
  slug: string;
  name: string;
  name_en: string | null;
  emoji: string | null;
  description: string | null;
  sort_order: number;
}

export type CharacterTone = 'yellow' | 'beige' | 'mint' | 'pink' | 'rose' | 'aqua';

export interface Character {
  id: number;
  slug: string;
  name: string;
  type_label: string;
  item_count: number;
  image_url: string;
  badge_emoji: string | null;
  tone: CharacterTone;
  sort_order: number;
}

export type BadgeTone = 'primary' | 'primary-soft' | 'secondary' | 'tertiary' | 'neutral';

export interface ProductFeature {
  point: string;
  tone: 'primary' | 'secondary' | 'tertiary';
  icon: string;
  title: string;
  body: string;
  note: string;
  image: string;
}

export interface ProductDetailContent {
  main_image?: string;
  type_tag?: { icon: string; text: string };
  rank_label?: string;
  exclusive_label?: string;
  satisfaction?: number;
  qna_count?: number;
  rating_breakdown?: { label: string; percent: number }[];
  story?: { eyebrow: string; title: string; highlight?: string; body: string; image: string };
  features_title?: string;
  features?: ProductFeature[];
  specs?: { label: string; value: string; highlight?: boolean }[];
  size_guide?: {
    basis: string;
    items: { size: string; name: string; use: string; scale: 'sm' | 'lg' }[];
    tip: string;
  };
  cross_sell?: { badge: string; perk: string; title: string; body: string };
}

export interface Product {
  id: number;
  slug: string;
  category_id: number;
  character_id: number | null;
  name: string;
  short_name: string | null;
  subtitle: string | null;
  sub_category: string | null;
  form: string | null;
  form_label: string | null;
  types: string[];
  type_label: string | null;
  price: number;
  original_price: number | null;
  discount_percent: number;
  rating: number;
  review_count: number;
  sales_count: number;
  stock: number;
  image_url: string;
  badge_text: string | null;
  badge_tone: BadgeTone | null;
  same_day_shipping: boolean;
  free_shipping: boolean;
  tags: string[];
  detail: ProductDetailContent;
  created_at: string;
}

export interface ProductImage {
  id: number;
  url: string;
  label: string | null;
  sort_order: number;
}

export interface ProductOption {
  id: number;
  group_key: string;
  group_label: string;
  name: string;
  description: string | null;
  price_delta: number;
  badge_text: string | null;
  is_default: boolean;
  sort_order: number;
}

export interface ProductFull extends Product {
  category: Pick<Category, 'slug' | 'name'>;
  images: ProductImage[];
  options: ProductOption[];
}

export interface RelatedProduct {
  product: Product;
  badge_text: string | null;
  badge_tone: BadgeTone | null;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: string | null;
  author_name: string;
  author_level: number | null;
  handle: string | null;
  rating: number;
  content: string;
  option_text: string | null;
  tags: string[];
  photo_url: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface CommunityReview extends Review {
  product: Pick<Product, 'slug' | 'short_name' | 'name'>;
}

export interface Banner {
  id: number;
  kind: 'hero' | 'curation';
  tone: 'primary' | 'secondary';
  icon: string | null;
  eyebrow: string | null;
  tag_text: string | null;
  title: string;
  title_highlight: string | null;
  body: string | null;
  cta_label: string | null;
  cta_href: string | null;
  promo_text: string | null;
  promo_highlight: string | null;
  image_url: string;
  image_badge_top: string | null;
  image_badge_bottom: string | null;
}

export interface Profile {
  id: string;
  display_name: string;
  level: number;
  coins: number;
  avatar_url: string | null;
}

export interface CartLine {
  id: number;
  product_id: number;
  product_slug: string;
  product_name: string;
  image_url: string;
  option_summary: string;
  quantity: number;
  stock: number;
  unit_price: number;
  line_total: number;
}

export type SortKey = 'popular' | 'new' | 'price' | 'reviews';

export interface ProductFilters {
  category: string | null;
  character: string | null;
  tag: string | null;
  sale: boolean;
  wishlistOnly: boolean;
  q: string;
  types: string[];
  forms: string[];
  maxPrice: number;
  sameDay: boolean;
  freeShipping: boolean;
  sort: SortKey;
  page: number;
}

export interface FormFacet {
  form: string;
  label: string;
  count: number;
}
