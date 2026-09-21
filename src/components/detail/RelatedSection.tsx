import { useRef } from 'react';
import type { ProductDetailContent, RelatedProduct } from '../../lib/types';
import { Icon } from '../common/Icon';
import { CrossSellCard } from '../product/CrossSellCard';

interface RelatedSectionProps {
  readonly items: RelatedProduct[];
  readonly copy?: ProductDetailContent['cross_sell'];
}

const NAV_BUTTON_CLASS =
  'w-10 h-10 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center hover:bg-surface-container-high text-on-surface active:scale-95 transition-all';

export function RelatedSection({ items, copy }: RelatedSectionProps) {
  const railRef = useRef<HTMLDivElement>(null);
  if (items.length === 0) return null;

  const scroll = (direction: 1 | -1) =>
    railRef.current?.scrollBy({ left: direction * railRef.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <section className="mt-space-xl pt-space-lg">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-lg">
        <div>
          {copy && (
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                {copy.badge}
              </span>
              <span className="text-primary font-bold font-label-md text-label-md">{copy.perk}</span>
            </div>
          )}
          <h3 className="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg text-on-surface font-bold mt-1">
            {copy?.title ?? '함께 보면 좋은 포케 굿즈 ⚡'}
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {copy?.body ?? '같은 카테고리에서 트레이너들이 가장 많이 찾는 굿즈예요.'}
          </p>
        </div>
        <div className="flex items-center gap-space-xs">
          <button type="button" aria-label="이전" onClick={() => scroll(-1)} className={NAV_BUTTON_CLASS}>
            <Icon name="chevron_left" className="text-xl" />
          </button>
          <button type="button" aria-label="다음" onClick={() => scroll(1)} className={NAV_BUTTON_CLASS}>
            <Icon name="chevron_right" className="text-xl" />
          </button>
        </div>
      </div>
      <div ref={railRef} className="flex gap-gutter overflow-x-auto no-scrollbar snap-x pb-2 -mb-2">
        {items.map((item) => (
          <CrossSellCard key={item.product.id} item={item} />
        ))}
      </div>
    </section>
  );
}
