import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { formatKRW } from '../../lib/format';
import { Icon } from './Icon';

interface CartDrawerProps {
  readonly freeShippingThreshold?: number;
}

export function CartDrawer({ freeShippingThreshold = 30_000 }: CartDrawerProps) {
  const { cart, cartTotal, cartOpen, closeCart, setQuantity, removeLine, checkout } = useShop();
  const [busy, setBusy] = useState(false);

  if (!cartOpen) return null;

  const remaining = Math.max(0, freeShippingThreshold - cartTotal);

  const handleCheckout = async () => {
    setBusy(true);
    await checkout();
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="장바구니">
      <button type="button" aria-label="닫기" className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={closeCart} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-xl flex flex-col">
        <header className="flex items-center justify-between p-space-lg pb-space-md">
          <div className="flex items-center gap-2">
            <Icon name="shopping_bag" className="text-primary text-2xl" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">트레이너 가방</h2>
            <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm">{cart.length}</span>
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={closeCart}
            className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface-variant hover:text-primary flex items-center justify-center"
          >
            <Icon name="close" className="text-xl" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-space-lg flex flex-col gap-space-sm">
          {cart.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-space-sm text-on-surface-variant">
              <Icon name="shopping_bag" className="text-5xl text-outline-variant" />
              <p className="font-body-md text-body-md">가방이 비어 있어요.</p>
              <Link
                to="/products"
                onClick={closeCart}
                className="px-5 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md font-bold"
              >
                굿즈 구경하러 가기
              </Link>
            </div>
          )}
          {cart.map((line) => (
            <div key={line.id} className="flex gap-space-sm p-space-sm rounded-lg bg-surface-container-lowest shadow-sm">
              <Link to={`/products/${line.product_slug}`} onClick={closeCart} className="w-20 h-20 rounded overflow-hidden shrink-0 bg-surface-container-low">
                <img src={line.image_url} alt={line.product_name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col">
                <Link
                  to={`/products/${line.product_slug}`}
                  onClick={closeCart}
                  className="font-label-md text-label-md font-bold text-on-surface line-clamp-2 hover:text-primary transition-colors"
                >
                  {line.product_name}
                </Link>
                {line.option_summary && <span className="font-label-sm text-label-sm text-outline mt-0.5">{line.option_summary}</span>}
                <div className="mt-auto pt-1 flex items-center justify-between">
                  <div className="flex items-center rounded-full bg-surface-container-low p-0.5">
                    <button
                      type="button"
                      aria-label="수량 줄이기"
                      onClick={() => setQuantity(line.id, line.quantity - 1)}
                      disabled={line.quantity <= 1}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container-high text-on-surface disabled:opacity-40"
                    >
                      <Icon name="remove" className="text-sm" />
                    </button>
                    <span className="w-7 text-center font-label-md text-label-md font-bold text-on-surface">{line.quantity}</span>
                    <button
                      type="button"
                      aria-label="수량 늘리기"
                      onClick={() => setQuantity(line.id, line.quantity + 1)}
                      disabled={line.quantity >= Math.min(99, line.stock)}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container-high text-on-surface disabled:opacity-40"
                    >
                      <Icon name="add" className="text-sm" />
                    </button>
                  </div>
                  <span className="font-label-lg text-label-lg text-on-surface font-extrabold">{formatKRW(line.line_total)}원</span>
                </div>
              </div>
              <button
                type="button"
                aria-label="삭제"
                onClick={() => removeLine(line.id)}
                className="self-start w-7 h-7 rounded-full text-outline hover:text-primary flex items-center justify-center"
              >
                <Icon name="delete" className="text-lg" />
              </button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <footer className="p-space-lg flex flex-col gap-space-sm bg-surface-container-low">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed font-label-sm text-label-sm">
              <Icon name="local_shipping" className="text-base text-secondary" />
              <span>
                {remaining > 0 ? `${formatKRW(remaining)}원 더 담으면 무료배송!` : '무료배송 조건을 채웠어요 🎉'}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-label-lg text-label-lg text-on-surface font-bold">총 상품 금액</span>
              <span className="font-headline-md text-headline-md text-primary font-extrabold">{formatKRW(cartTotal)}원</span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={busy}
              className="h-12 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg font-extrabold hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(255,90,95,0.4)] disabled:opacity-60"
            >
              <Icon name="20mp" className="text-2xl" />
              <span>{busy ? '주문 접수 중...' : '주문하기 ⚡'}</span>
            </button>
            <p className="font-label-sm text-label-sm text-outline text-center">결제 연동 전 단계로, 주문은 "결제 대기" 상태로 접수됩니다.</p>
          </footer>
        )}
      </aside>
    </div>
  );
}
