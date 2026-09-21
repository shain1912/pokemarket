import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRICE_MAX, PRICE_MIN } from '../lib/api';
import type { ProductFilters, SortKey } from '../lib/types';

const SORT_KEYS: SortKey[] = ['popular', 'new', 'price', 'reviews'];
// 사이드바에서 바꾸는 값들. "초기화"는 이것들만 지운다 (카테고리·검색어 같은 범위 조건은 유지)
const REFINEMENT_KEYS = ['types', 'forms', 'maxPrice', 'sameDay', 'freeShipping'];

function parseList(value: string | null): string[] {
  return value ? value.split(',').filter(Boolean) : [];
}

/** 목록 페이지의 모든 필터 상태를 URL 쿼리스트링에 둔다 → 헤더 내비/공유 링크와 자연스럽게 연동 */
export function useProductFilters() {
  const [params, setParams] = useSearchParams();

  const filters = useMemo<ProductFilters>(() => {
    const sort = params.get('sort') as SortKey | null;
    const maxPrice = Number(params.get('maxPrice'));
    return {
      category: params.get('category'),
      character: params.get('character'),
      tag: params.get('tag'),
      sale: params.get('sale') === '1',
      wishlistOnly: params.get('wishlist') === '1',
      q: params.get('q')?.trim() ?? '',
      types: parseList(params.get('types')),
      forms: parseList(params.get('forms')),
      maxPrice: maxPrice >= PRICE_MIN && maxPrice <= PRICE_MAX ? maxPrice : PRICE_MAX,
      sameDay: params.get('sameDay') === '1',
      freeShipping: params.get('freeShipping') === '1',
      sort: sort && SORT_KEYS.includes(sort) ? sort : 'popular',
      page: Math.max(1, Number(params.get('page')) || 1),
    };
  }, [params]);

  const update = useCallback(
    (patch: Record<string, string | null>, options: { keepPage?: boolean } = {}) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(patch)) {
            if (value === null || value === '') next.delete(key);
            else next.set(key, value);
          }
          if (!options.keepPage) next.delete('page');
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const toggleInList = useCallback(
    (key: 'types' | 'forms', value: string) => {
      const current = filters[key];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      update({ [key]: next.join(',') });
    },
    [filters, update],
  );

  return {
    filters,
    toggleType: (slug: string) => toggleInList('types', slug),
    toggleForm: (form: string) => toggleInList('forms', form),
    setMaxPrice: (value: number) => update({ maxPrice: value >= PRICE_MAX ? null : String(value) }),
    setSameDay: (on: boolean) => update({ sameDay: on ? '1' : null }),
    setFreeShipping: (on: boolean) => update({ freeShipping: on ? '1' : null }),
    setSort: (sort: SortKey) => update({ sort: sort === 'popular' ? null : sort }),
    setPage: (page: number) => update({ page: page <= 1 ? null : String(page) }, { keepPage: true }),
    resetRefinements: () => update(Object.fromEntries(REFINEMENT_KEYS.map((key) => [key, null]))),
  };
}
