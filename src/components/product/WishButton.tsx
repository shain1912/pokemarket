import type { MouseEvent } from 'react';
import { useShop } from '../../context/ShopContext';
import type { Product } from '../../lib/types';
import { Icon } from '../common/Icon';

interface WishButtonProps {
  readonly product: Pick<Product, 'id' | 'name' | 'short_name'>;
  readonly className: string;
  readonly iconClass?: string;
}

/** 찜 상태에 따라 하트가 채워지는 토글 버튼. 위치·크기는 className 으로 받는다 */
export function WishButton({ product, className, iconClass = 'text-xl' }: WishButtonProps) {
  const { isWished, toggleWish } = useShop();
  const wished = isWished(product.id);

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    void toggleWish(product);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={wished}
      aria-label={wished ? '찜 해제' : '찜하기'}
      className={`${className} ${wished ? 'text-primary' : ''}`}
    >
      <Icon name="favorite" filled={wished} className={iconClass} />
    </button>
  );
}
