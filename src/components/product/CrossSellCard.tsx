import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { BADGE_TONE_CLASSES } from '../../data/site';
import { formatKRW } from '../../lib/format';
import type { RelatedProduct } from '../../lib/types';
import { Icon } from '../common/Icon';
import { WishButton } from './WishButton';

interface CrossSellCardProps {
  readonly item: RelatedProduct;
}

export function CrossSellCard({ item }: CrossSellCardProps) {
  const { addToCart } = useShop();
  const { product } = item;
  const to = `/products/${product.slug}`;

  return (
    <div className="p-space-md rounded-lg bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm group transition-all hover:-translate-y-1 min-w-[240px] flex-1 snap-start">
      <Link to={to} className="relative block aspect-square rounded bg-surface-container-low overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          src={product.image_url}
          alt={product.name}
          loading="lazy"
        />
        {item.badge_text && (
          <span
            className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${BADGE_TONE_CLASSES[item.badge_tone ?? 'primary']}`}
          >
            {item.badge_text}
          </span>
        )}
        <WishButton
          product={product}
          iconClass="text-base"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur text-outline hover:text-primary flex items-center justify-center transition-colors"
        />
      </Link>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-label-sm text-label-sm text-outline">{product.sub_category}</span>
        <h4 className="font-label-lg text-label-lg font-bold text-on-surface group-hover:text-primary transition-colors truncate">
          <Link to={to}>{product.name}</Link>
        </h4>
      </div>
      <div className="flex items-baseline justify-between mt-auto pt-1">
        <div className="flex items-baseline gap-1">
          <span className="font-headline-sm text-headline-sm font-extrabold text-on-surface">{formatKRW(product.price)}</span>
          <span className="font-label-sm text-label-sm text-on-surface">원</span>
          {product.original_price && (
            <span className="line-through text-outline font-label-sm text-label-sm ml-1">{formatKRW(product.original_price)}원</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => addToCart(product)}
          title="담기"
          aria-label={`${product.name} 담기`}
          className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:opacity-90 transition-all shadow-sm active:scale-95"
        >
          <Icon name="add_shopping_cart" className="text-base" />
        </button>
      </div>
    </div>
  );
}
