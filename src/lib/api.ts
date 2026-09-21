import { supabase } from './supabase';
import type {
  Banner,
  CartLine,
  Category,
  Character,
  CommunityReview,
  FormFacet,
  Product,
  ProductFilters,
  ProductFull,
  Profile,
  RelatedProduct,
  Review,
  SortKey,
} from './types';

export const PAGE_SIZE = 8;
export const PRICE_MIN = 10_000;
export const PRICE_MAX = 100_000;

// 클라이언트를 DB 타입 없이 쓰므로 응답 행은 호출부에서 지정한 앱 타입(lib/types)으로 본다
function unwrap<T>(result: { data: unknown; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data as T;
}

// ---------------------------------------------------------------------------
// 카탈로그
// ---------------------------------------------------------------------------
let categoriesCache: Promise<Category[]> | null = null;
let charactersCache: Promise<Character[]> | null = null;

export function fetchCategories(): Promise<Category[]> {
  categoriesCache ??= Promise.resolve(supabase.from('categories').select('*').order('sort_order')).then(
    (r) => unwrap<Category[]>(r),
  );
  return categoriesCache;
}

export function fetchCharacters(): Promise<Character[]> {
  charactersCache ??= Promise.resolve(supabase.from('characters').select('*').order('sort_order')).then(
    (r) => unwrap<Character[]>(r),
  );
  return charactersCache;
}

export async function fetchBanners(kind: Banner['kind']): Promise<Banner[]> {
  return unwrap<Banner[]>(await supabase.from('banners').select('*').eq('kind', kind).order('sort_order'));
}

export type RankingScope = 'all' | 'plush' | 'desk';

export async function fetchRanking(scope: RankingScope): Promise<Product[]> {
  let query = supabase.from('products').select('*').order('sales_count', { ascending: false }).limit(4);
  if (scope === 'plush') {
    const plush = (await fetchCategories()).find((c) => c.slug === 'plush-cushions');
    if (plush) query = query.eq('category_id', plush.id);
  }
  if (scope === 'desk') query = query.contains('tags', ['desk']);
  return unwrap<Product[]>(await query);
}

export async function fetchCommunityReviews(): Promise<CommunityReview[]> {
  return unwrap<CommunityReview[]>(
    await supabase
      .from('reviews')
      .select('*, product:products!inner(slug, short_name, name)')
      .not('photo_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(4),
  );
}

const SORT_COLUMNS: Record<SortKey, { column: string; ascending: boolean }> = {
  popular: { column: 'sales_count', ascending: false },
  new: { column: 'created_at', ascending: false },
  price: { column: 'price', ascending: true },
  reviews: { column: 'review_count', ascending: false },
};

/** 페이지네이션·정렬을 뺀, 목록과 패싯이 공유하는 조건 */
async function scopeIds(filters: Pick<ProductFilters, 'category' | 'character'>) {
  const [categories, characters] = await Promise.all([fetchCategories(), fetchCharacters()]);
  return {
    categoryId: filters.category ? (categories.find((c) => c.slug === filters.category)?.id ?? -1) : null,
    characterId: filters.character ? (characters.find((c) => c.slug === filters.character)?.id ?? -1) : null,
  };
}

export async function fetchProducts(
  filters: ProductFilters,
  wishlistIds: number[],
): Promise<{ items: Product[]; total: number }> {
  const { categoryId, characterId } = await scopeIds(filters);
  if (filters.wishlistOnly && wishlistIds.length === 0) return { items: [], total: 0 };

  const sort = SORT_COLUMNS[filters.sort];
  const from = (filters.page - 1) * PAGE_SIZE;

  let query = supabase.from('products').select('*', { count: 'exact' });
  if (categoryId !== null) query = query.eq('category_id', categoryId);
  if (characterId !== null) query = query.eq('character_id', characterId);
  if (filters.tag) query = query.contains('tags', [filters.tag]);
  if (filters.sale) query = query.gt('discount_percent', 0);
  if (filters.wishlistOnly) query = query.in('id', wishlistIds);
  if (filters.q) query = query.ilike('name', `%${filters.q.replace(/[%_]/g, '\\$&')}%`);
  if (filters.types.length) query = query.overlaps('types', filters.types);
  if (filters.forms.length) query = query.in('form', filters.forms);
  if (filters.maxPrice < PRICE_MAX) query = query.lte('price', filters.maxPrice);
  if (filters.sameDay) query = query.eq('same_day_shipping', true);
  if (filters.freeShipping) query = query.eq('free_shipping', true);

  const { data, error, count } = await query
    .order(sort.column, { ascending: sort.ascending })
    .order('id')
    .range(from, from + PAGE_SIZE - 1);
  if (error) throw new Error(error.message);
  return { items: (data ?? []) as Product[], total: count ?? 0 };
}

/** 사이드바 "형태" 필터 항목 — 현재 카테고리/캐릭터 범위의 상품에서 집계 */
export async function fetchFormFacets(filters: Pick<ProductFilters, 'category' | 'character'>): Promise<FormFacet[]> {
  const { categoryId, characterId } = await scopeIds(filters);
  let query = supabase.from('products').select('form, form_label').not('form', 'is', null);
  if (categoryId !== null) query = query.eq('category_id', categoryId);
  if (characterId !== null) query = query.eq('character_id', characterId);
  const rows = unwrap<{ form: string; form_label: string | null }[]>(await query);

  const facets = new Map<string, FormFacet>();
  for (const row of rows) {
    const facet = facets.get(row.form) ?? { form: row.form, label: row.form_label ?? row.form, count: 0 };
    facet.count += 1;
    facets.set(row.form, facet);
  }
  return [...facets.values()].sort((a, b) => b.count - a.count);
}

export async function fetchProductBySlug(slug: string): Promise<ProductFull | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(slug, name), images:product_images(*), options:product_options(*)')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const product = data as ProductFull;
  product.images.sort((a, b) => a.sort_order - b.sort_order);
  product.options.sort((a, b) => a.sort_order - b.sort_order);
  return product;
}

export async function fetchReviews(productId: number): Promise<Review[]> {
  return unwrap<Review[]>(
    await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(6),
  );
}

/** 지정된 연관 상품이 없으면 같은 카테고리 인기 상품으로 대체 */
export async function fetchRelated(product: Pick<Product, 'id' | 'category_id'>): Promise<RelatedProduct[]> {
  const rows = unwrap<{ badge_text: string | null; badge_tone: RelatedProduct['badge_tone']; product: Product }[]>(
    await supabase
      .from('related_products')
      .select('badge_text, badge_tone, product:products!related_products_related_product_id_fkey(*)')
      .eq('product_id', product.id)
      .order('sort_order'),
  );
  if (rows.length > 0) return rows;

  const fallback = unwrap<Product[]>(
    await supabase
      .from('products')
      .select('*')
      .eq('category_id', product.category_id)
      .neq('id', product.id)
      .order('sales_count', { ascending: false })
      .limit(4),
  );
  return fallback.map((p) => ({ product: p, badge_text: p.badge_text, badge_tone: p.badge_tone }));
}

// ---------------------------------------------------------------------------
// 회원 데이터 (RLS: 본인 행만)
// ---------------------------------------------------------------------------
export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw new Error(error.message);
  return data as Profile | null;
}

export async function fetchWishlistIds(): Promise<number[]> {
  const rows = unwrap<{ product_id: number }[]>(await supabase.from('wishlists').select('product_id'));
  return rows.map((r) => r.product_id);
}

export async function addWish(productId: number): Promise<void> {
  const { error } = await supabase.from('wishlists').insert({ product_id: productId });
  if (error && error.code !== '23505') throw new Error(error.message);
}

export async function removeWish(productId: number): Promise<void> {
  const { error } = await supabase.from('wishlists').delete().eq('product_id', productId);
  if (error) throw new Error(error.message);
}

export async function fetchCart(): Promise<CartLine[]> {
  return unwrap<CartLine[]>(await supabase.from('cart_items_detailed').select('*').order('created_at'));
}

export async function addToCart(productId: number, optionIds: number[], quantity: number): Promise<void> {
  const { error } = await supabase.rpc('add_to_cart', {
    p_product_id: productId,
    p_option_ids: optionIds,
    p_quantity: quantity,
  });
  if (error) throw new Error(error.message);
}

export async function updateCartQuantity(id: number, quantity: number): Promise<void> {
  const { error } = await supabase.from('cart_items').update({ quantity }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function removeCartItem(id: number): Promise<void> {
  const { error } = await supabase.from('cart_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function checkoutCart(): Promise<number> {
  const { data, error } = await supabase.rpc('checkout_cart');
  if (error) throw new Error(error.message);
  return data as number;
}

export async function createReview(input: {
  productId: number;
  rating: number;
  content: string;
  optionText: string | null;
}): Promise<void> {
  const { error } = await supabase.from('reviews').insert({
    product_id: input.productId,
    rating: input.rating,
    content: input.content,
    option_text: input.optionText,
  });
  if (error?.code === '23505') throw new Error('이미 이 상품에 리뷰를 작성하셨어요.');
  if (error) throw new Error(error.message);
}
