import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { BADGE_TONE_CLASSES } from '../../data/site';
import { formatCount, formatKRW } from '../../lib/format';
import type { Product } from '../../lib/types';
import { Icon } from '../common/Icon';
import { WishButton } from './WishButton';

interface CatalogCardProps {
  readonly product: Product;
  readonly layout?: 'grid' | 'list';
}

/** 좌상단 배지: 지정 배지가 우선, 없으면 15% 이상 할인일 때 할인율 */
function topBadge(product: Product): { text: string; tone: string } | null {
  if (product.badge_text) return { text: product.badge_text, tone: BADGE_TONE_CLASSES[product.badge_tone ?? 'primary'] };
  if (product.discount_percent >= 15) return { text: `${product.discount_percent}% OFF`, tone: BADGE_TONE_CLASSES.primary };
  return null;
}

export function CatalogCard({ product, layout = 'grid' }: CatalogCardProps) {
  const { addToCart } = useShop();
  const badge = topBadge(product);
  const isList = layout === 'list';
  const isElectric = product.types.includes('electric');
  const to = `/products/${product.slug}`;

  return (
    <article
      className={`group flex rounded-lg bg-surface-container-lowest p-space-sm shadow-sm hover:shadow-md transition-all duration-200 ${
        isList ? 'flex-row gap-space-md items-stretch' : 'flex-col'
      }`}
    >
      <Link
        to={to}
        className={`relative block aspect-square rounded-lg overflow-hidden shrink-0 ${
          isElectric ? 'bg-secondary-fixed/30' : 'bg-surface-container-low'
        } ${isList ? 'w-40' : 'w-full mb-space-sm'}`}
      >
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={product.image_url}
          alt={product.name}
          loading="lazy"
        />
        {badge && (
          <span className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold shadow-sm ${badge.tone}`}>
            {badge.text}
          </span>
        )}
        {product.same_day_shipping && (
          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-tertiary text-on-tertiary font-label-sm text-label-sm font-bold flex items-center gap-0.5">
            <Icon name="bolt" className="text-xs" />
            당일발송
          </span>
        )}
        <WishButton
          product={product}
          iconClass="text-lg"
          className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-surface-container-lowest/90 text-on-surface-variant hover:text-primary flex items-center justify-center backdrop-blur-sm transition-transform active:scale-90 shadow-sm"
        />
      </Link>

      <div className="flex flex-col flex-1 min-w-0 px-1">
        <div className="flex items-center gap-1.5 mb-1">
          {product.type_label && (
            <span
              className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold whitespace-nowrap ${
                isElectric ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container-high text-on-surface'
              }`}
            >
              {product.type_label}
            </span>
          )}
          <span className="font-label-sm text-label-sm text-outline truncate">{product.sub_category}</span>
        </div>
        <h2
          className={`font-label-lg text-label-lg text-on-surface font-bold group-hover:text-primary transition-colors ${
            isList ? 'line-clamp-2' : 'line-clamp-1'
          }`}
        >
          <Link to={to}>{product.name}</Link>
        </h2>
        {isList && product.subtitle && (
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">{product.subtitle}</p>
        )}
        <div className="flex items-center gap-1 mt-1 text-secondary font-label-sm text-label-sm">
          <Icon name="star" filled className="text-sm" />
          <span className="font-bold text-on-surface">{product.rating.toFixed(1)}</span>
          <span className="text-outline">({formatCount(product.review_count)})</span>
        </div>
        <div className="mt-auto pt-space-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline line-through min-h-4">
              {product.original_price ? `${formatKRW(product.original_price)}원` : ''}
            </span>
            <span
              className={`font-headline-sm text-headline-sm font-extrabold ${
                product.original_price ? 'text-primary' : 'text-on-surface'
              }`}
            >
              {formatKRW(product.price)}원
            </span>
          </div>
          <button
            type="button"
            onClick={() => addToCart(product)}
            title="장바구니 담기"
            aria-label={`${product.name} 장바구니 담기`}
            className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-sm shrink-0"
          >
            <Icon name="shopping_bag" className="text-xl" />
          </button>
        </div>
      </div>
    </article>
  );
}
