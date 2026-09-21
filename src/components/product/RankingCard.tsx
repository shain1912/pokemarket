import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { BADGE_TONE_CLASSES } from '../../data/site';
import { formatCount, formatKRW } from '../../lib/format';
import type { Product } from '../../lib/types';
import { Icon } from '../common/Icon';
import { WishButton } from './WishButton';

interface RankingCardProps {
  readonly product: Product;
  readonly rank: number;
}

const IMAGE_TINTS = ['bg-tertiary-fixed/30', 'bg-primary-fixed/30', 'bg-secondary-fixed/30', 'bg-secondary-fixed/20'];

/** 이미지 좌하단 오버레이: 품절 임박이면 잔여수량, 많이 팔렸으면 누적 판매 */
function overlayText(product: Product): string | null {
  if (product.stock <= 20) return `잔여수량 ${product.stock}개`;
  if (product.sales_count >= 10_000) return `누적 판매 ${Math.floor(product.sales_count / 10_000)}만+`;
  return null;
}

export function RankingCard({ product, rank }: RankingCardProps) {
  const { addToCart } = useShop();
  const rankLabel = `BEST ${rank}위`;
  const overlay = overlayText(product);
  const shippingChip = product.same_day_shipping ? '당일발송' : product.free_shipping ? '무료배송' : null;
  const to = `/products/${product.slug}`;

  return (
    <div className="flex flex-col bg-surface-container-lowest rounded-lg p-space-sm shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
      <Link
        to={to}
        className={`relative block w-full aspect-square rounded overflow-hidden mb-space-sm ${IMAGE_TINTS[(rank - 1) % IMAGE_TINTS.length]}`}
      >
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={product.image_url}
          alt={product.name}
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {product.badge_text ? (
            <>
              <span
                className={`px-3 py-1 rounded-full font-label-sm text-label-sm font-bold shadow-sm ${BADGE_TONE_CLASSES[product.badge_tone ?? 'primary']}`}
              >
                {product.badge_text}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm font-label-sm text-label-sm font-bold ${
                  rank <= 2 ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {rankLabel}
              </span>
            </>
          ) : (
            <>
              <span
                className={`px-3 py-1 rounded-full font-label-sm text-label-sm font-bold shadow-sm ${
                  rank === 1 ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'
                }`}
              >
                {rankLabel}
              </span>
              {shippingChip && (
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-tertiary font-label-sm text-label-sm font-bold">
                  {shippingChip}
                </span>
              )}
            </>
          )}
        </div>
        <WishButton
          product={product}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
        />
        {overlay && (
          <div className="absolute bottom-2 left-2 bg-on-surface/80 backdrop-blur-sm text-surface px-2.5 py-1 rounded-full font-label-sm text-label-sm">
            {overlay}
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 px-1">
        <span className="font-label-sm text-label-sm text-outline mb-0.5">{product.sub_category}</span>
        <h3 className="font-body-lg text-body-lg text-on-surface font-bold line-clamp-2 mb-space-xs group-hover:text-primary transition-colors">
          <Link to={to}>{product.name}</Link>
        </h3>
        <div className="flex items-center gap-1.5 mb-space-sm text-on-surface-variant font-label-sm text-label-sm">
          <span className="flex items-center text-secondary font-bold">
            <Icon name="star" filled className="text-base" />
            {product.rating.toFixed(1)}
          </span>
          <span>·</span>
          <span>리뷰 {formatCount(product.review_count)}</span>
        </div>
        <div className="mt-auto pt-2 flex items-baseline gap-2 flex-wrap">
          {product.discount_percent > 0 && (
            <span className="font-headline-sm text-headline-sm text-primary font-extrabold">{product.discount_percent}%</span>
          )}
          <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
            {formatKRW(product.price)}
            <span className="text-sm font-normal">원</span>
          </span>
          {product.original_price && (
            <span className="font-body-sm text-body-sm text-outline line-through">{formatKRW(product.original_price)}원</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => addToCart(product)}
          className="w-full mt-space-sm py-2.5 rounded-full bg-surface-container-low text-on-surface font-label-md text-label-md font-bold hover:bg-primary-container hover:text-on-primary transition-colors flex items-center justify-center gap-1"
        >
          <Icon name="shopping_cart" className="text-lg" />
          <span>담기</span>
        </button>
      </div>
    </div>
  );
}
