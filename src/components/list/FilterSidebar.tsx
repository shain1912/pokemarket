import { useEffect, useState } from 'react';
import { TYPE_FILTERS } from '../../data/site';
import { PRICE_MAX, PRICE_MIN } from '../../lib/api';
import { formatKRW } from '../../lib/format';
import type { FormFacet, ProductFilters } from '../../lib/types';
import { Icon } from '../common/Icon';

interface FilterSidebarProps {
  readonly filters: ProductFilters;
  readonly formFacets: FormFacet[];
  readonly onToggleType: (slug: string) => void;
  readonly onToggleForm: (form: string) => void;
  readonly onMaxPrice: (value: number) => void;
  readonly onSameDay: (on: boolean) => void;
  readonly onFreeShipping: (on: boolean) => void;
  readonly onReset: () => void;
}

const CHECKBOX_CLASS = 'w-4 h-4 rounded accent-primary cursor-pointer';

export function FilterSidebar({
  filters,
  formFacets,
  onToggleType,
  onToggleForm,
  onMaxPrice,
  onSameDay,
  onFreeShipping,
  onReset,
}: FilterSidebarProps) {
  // 슬라이더는 드래그 중에는 로컬 값만 바꾸고, 놓을 때 한 번만 쿼리를 갱신한다
  const [draftPrice, setDraftPrice] = useState(filters.maxPrice);
  useEffect(() => setDraftPrice(filters.maxPrice), [filters.maxPrice]);
  const commitPrice = () => draftPrice !== filters.maxPrice && onMaxPrice(draftPrice);

  return (
    <aside className="lg:col-span-3 flex flex-col gap-space-md">
      <div className="rounded-lg bg-surface-container-low p-space-md shadow-sm flex flex-col gap-space-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-on-surface">
            <Icon name="tune" className="text-primary text-xl" />
            <span className="font-headline-sm text-headline-sm">필터 탐색</span>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="font-label-sm text-label-sm text-outline hover:text-primary transition-colors flex items-center gap-0.5"
          >
            <Icon name="restart_alt" className="text-sm" />
            초기화
          </button>
        </div>

        <div className="flex flex-col gap-space-sm">
          <span className="font-label-lg text-label-lg text-on-surface flex items-center justify-between">
            포켓몬 속성 / 타입
            <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">{TYPE_FILTERS.length}종</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {TYPE_FILTERS.map((type) => {
              const active = filters.types.includes(type.slug);
              const activeClass =
                type.slug === 'electric'
                  ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm'
                  : 'bg-primary-fixed text-on-primary-fixed shadow-sm';
              return (
                <button
                  key={type.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onToggleType(type.slug)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-label-md text-label-md transition-all hover:scale-105 active:scale-95 ${
                    active ? activeClass : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                  }`}
                >
                  <span>{type.emoji}</span>
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {formFacets.length > 0 && (
          <div className="flex flex-col gap-space-sm">
            <span className="font-label-lg text-label-lg text-on-surface">굿즈 형태</span>
            <div className="flex flex-col gap-2">
              {formFacets.map((facet) => (
                <label
                  key={facet.form}
                  className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-surface-container transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className={CHECKBOX_CLASS}
                      checked={filters.forms.includes(facet.form)}
                      onChange={() => onToggleForm(facet.form)}
                    />
                    <span className="font-body-sm text-body-sm text-on-surface">{facet.label}</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-outline">{facet.count}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-lg text-label-lg text-on-surface">가격대</span>
            <span className="font-label-sm text-label-sm text-primary font-bold">
              {formatKRW(PRICE_MIN)}원 ~ {formatKRW(draftPrice)}원{draftPrice >= PRICE_MAX ? '+' : ''}
            </span>
          </div>
          <input
            type="range"
            aria-label="최대 가격"
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface-container-highest accent-primary"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={5000}
            value={draftPrice}
            onChange={(e) => setDraftPrice(Number(e.target.value))}
            onMouseUp={commitPrice}
            onTouchEnd={commitPrice}
            onKeyUp={commitPrice}
          />
          <div className="flex justify-between font-label-sm text-label-sm text-outline px-0.5">
            <span>1만원 이하</span>
            <span>10만원 이상</span>
          </div>
        </div>

        <div className="flex flex-col gap-space-sm">
          <span className="font-label-lg text-label-lg text-on-surface">배송 혜택</span>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
              <input type="checkbox" className={CHECKBOX_CLASS} checked={filters.sameDay} onChange={(e) => onSameDay(e.target.checked)} />
              <span className="inline-flex items-center gap-1 font-body-sm text-body-sm text-on-surface font-semibold">
                <span className="w-2 h-2 rounded-full bg-tertiary" />
                당일 몬스터볼 특급배송 🚀
              </span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
              <input
                type="checkbox"
                className={CHECKBOX_CLASS}
                checked={filters.freeShipping}
                onChange={(e) => onFreeShipping(e.target.checked)}
              />
              <span className="font-body-sm text-body-sm text-on-surface">무료배송 상품만 보기</span>
            </label>
          </div>
        </div>

        <div className="p-space-sm rounded-lg bg-secondary-fixed/50 flex items-center gap-space-sm">
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
            <Icon name="redeem" className="text-xl" />
          </div>
          <div className="flex flex-col text-on-secondary-fixed">
            <span className="font-label-sm text-label-sm font-bold">인형 2개 이상 구매 시</span>
            <span className="font-label-sm text-label-sm opacity-90">포켓볼 세탁망 100% 증정</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
