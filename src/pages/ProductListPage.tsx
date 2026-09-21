import { useState } from 'react';
import { StatusMessage } from '../components/common/StatusMessage';
import { CategoryHeader, type ListHeading } from '../components/list/CategoryHeader';
import { FilterSidebar } from '../components/list/FilterSidebar';
import { Pagination } from '../components/list/Pagination';
import { SortBar, type ViewMode } from '../components/list/SortBar';
import { CatalogCard } from '../components/product/CatalogCard';
import { useShop } from '../context/ShopContext';
import { TAG_LABELS } from '../data/site';
import { useAsync } from '../hooks/useAsync';
import { useProductFilters } from '../hooks/useProductFilters';
import { PAGE_SIZE, fetchCategories, fetchCharacters, fetchFormFacets, fetchProducts } from '../lib/api';
import type { Category, Character, ProductFilters } from '../lib/types';

interface ProductListPageProps {
  readonly initialView?: ViewMode;
}

/** 현재 범위 조건(카테고리·캐릭터·태그·검색 등)에 맞는 상단 제목 */
function resolveHeading(filters: ProductFilters, categories: Category[], characters: Character[]): ListHeading {
  if (filters.wishlistOnly) {
    return { emoji: '❤️', name: '찜한 굿즈', description: '트레이너님이 찜해 둔 포켓몬 굿즈를 모아봤어요.' };
  }
  if (filters.q) {
    return { emoji: '🔍', name: `'${filters.q}' 검색 결과`, description: '찾으시는 굿즈가 없다면 다른 키워드로 검색해 보세요.' };
  }
  const category = categories.find((c) => c.slug === filters.category);
  if (category) {
    return { emoji: category.emoji ?? '🛍️', name: category.name, nameEn: category.name_en, description: category.description ?? '' };
  }
  const character = characters.find((c) => c.slug === filters.character);
  if (character) {
    return {
      emoji: character.badge_emoji ?? '✨',
      name: `${character.name} 굿즈`,
      description: `${character.name}와(과) 함께하는 굿즈만 모았어요. 최애 포켓몬으로 일상을 채워보세요!`,
    };
  }
  const tag = filters.tag ? TAG_LABELS[filters.tag] : undefined;
  if (tag) return tag;
  if (filters.sale) {
    return { emoji: '🎁', name: '이벤트/혜택', description: '지금 할인 중인 굿즈만 모았어요. 혜택이 끝나기 전에 잡으세요!' };
  }
  if (filters.sort === 'new') {
    return { emoji: '🆕', name: '신규 입고', description: '포케마켓에 막 도착한 따끈따끈한 신상 굿즈.' };
  }
  return {
    emoji: '🛍️',
    name: '전체 카테고리',
    nameEn: 'All Goods',
    description: '포케마켓의 모든 포켓몬 라이프스타일 굿즈를 한눈에 둘러보세요.',
  };
}

export function ProductListPage({ initialView = 'grid' }: ProductListPageProps) {
  const { filters, toggleType, toggleForm, setMaxPrice, setSameDay, setFreeShipping, setSort, setPage, resetRefinements } =
    useProductFilters();
  const { wishlistIds } = useShop();
  const [view, setView] = useState<ViewMode>(initialView);

  const { data: lookups } = useAsync(() => Promise.all([fetchCategories(), fetchCharacters()]), []);
  const { data: formFacets } = useAsync(() => fetchFormFacets(filters), [filters.category, filters.character]);

  // 찜 목록 보기일 때만 찜 변경에 반응해 다시 불러온다
  const wishKey = filters.wishlistOnly ? wishlistIds.join(',') : '';
  const { data: result, loading, error, reload } = useAsync(() => fetchProducts(filters, wishlistIds), [filters, wishKey]);

  const heading = resolveHeading(filters, lookups?.[0] ?? [], lookups?.[1] ?? []);
  const items = result?.items ?? [];

  const handlePage = (page: number) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-7xl mx-auto w-full px-margin pb-space-xl pt-space-md">
        <CategoryHeader heading={heading} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <FilterSidebar
            filters={filters}
            formFacets={formFacets ?? []}
            onToggleType={toggleType}
            onToggleForm={toggleForm}
            onMaxPrice={setMaxPrice}
            onSameDay={setSameDay}
            onFreeShipping={setFreeShipping}
            onReset={resetRefinements}
          />

          <div className="lg:col-span-9 flex flex-col gap-space-md">
            <SortBar total={result?.total ?? 0} sort={filters.sort} view={view} onSort={setSort} onView={setView} />

            {error ? (
              <StatusMessage icon="cloud_off" title="굿즈를 불러오지 못했어요" body={error} action={{ label: '다시 시도', onClick: reload }} />
            ) : !result ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
                {Array.from({ length: PAGE_SIZE }, (_, i) => (
                  <div key={i} className="rounded-lg bg-surface-container-low aspect-[3/4] animate-pulse" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <StatusMessage
                icon="search_off"
                title="조건에 맞는 굿즈가 없어요"
                body="필터를 조금 풀어 보거나 다른 카테고리를 둘러보세요."
                action={{ label: '필터 초기화', onClick: resetRefinements }}
              />
            ) : (
              <div
                className={`transition-opacity ${loading ? 'opacity-60' : ''} ${
                  view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md' : 'flex flex-col gap-space-md'
                }`}
              >
                {items.map((product) => (
                  <CatalogCard key={product.id} product={product} layout={view} />
                ))}
              </div>
            )}

            {result && result.total > 0 && (
              <Pagination page={filters.page} pageSize={PAGE_SIZE} total={result.total} onPage={handlePage} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
