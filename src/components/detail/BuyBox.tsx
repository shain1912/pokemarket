import { useShop } from '../../context/ShopContext';
import { useProductPurchase, type OptionGroup } from '../../hooks/useProductPurchase';
import { formatCount, formatKRW, tomorrowWeekday } from '../../lib/format';
import type { ProductFull } from '../../lib/types';
import { Icon } from '../common/Icon';
import { Stars } from '../common/Stars';
import { WishButton } from '../product/WishButton';

interface BuyBoxProps {
  readonly product: ProductFull;
}

export function BuyBox({ product }: BuyBoxProps) {
  const { addToCart, openCart } = useShop();
  const purchase = useProductPurchase(product);
  const { detail } = product;

  const handleAdd = () => addToCart(product, purchase.selectedOptionIds, purchase.quantity);
  const handleBuyNow = async () => {
    if (await handleAdd()) openCart();
  };

  return (
    <div className="lg:col-span-5 flex flex-col gap-space-md p-space-lg rounded-lg bg-surface-container-lowest shadow-sm">
      <div className="flex items-center gap-space-xs flex-wrap">
        {detail.rank_label && (
          <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-bold">
            {detail.rank_label}
          </span>
        )}
        {(product.tags.includes('limited') || product.stock <= 20) && (
          <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold flex items-center gap-1">
            <Icon name="hourglass_top" className="text-xs" />
            한정수량 {formatCount(product.stock)}개 남음
          </span>
        )}
        {detail.exclusive_label && (
          <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
            {detail.exclusive_label}
          </span>
        )}
      </div>

      <div>
        <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">{product.name}</h1>
        {product.subtitle && <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{product.subtitle}</p>}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 py-space-xs px-space-sm rounded bg-surface-container-low">
        <div className="flex items-center gap-1.5">
          <Stars rating={product.rating} sizeClass="text-lg" />
          <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold ml-1">{product.rating.toFixed(1)}</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">/ 5.0</span>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
          {detail.satisfaction && (
            <>
              <span className="font-bold text-primary">만족도 {detail.satisfaction}%</span>
              <span>·</span>
            </>
          )}
          <a className="underline hover:text-primary" href="#tab-reviews">
            리뷰 {formatCount(product.review_count)}건
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-1 pb-space-sm">
        {product.original_price && (
          <div className="flex items-baseline gap-2">
            <span className="font-display-lg text-display-lg text-primary font-extrabold tracking-tight">{product.discount_percent}%</span>
            <span className="line-through text-outline font-body-lg text-body-lg">{formatKRW(product.original_price)}원</span>
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <span className="font-display-lg text-display-lg text-on-surface font-extrabold tracking-tight">{formatKRW(purchase.unitPrice)}</span>
          <span className="font-headline-sm text-headline-sm text-on-surface">원</span>
        </div>
        <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed font-label-sm text-label-sm">
          <Icon name="monetization_on" className="text-base text-secondary" />
          <span>
            트레이너 구매 시 <strong>{formatKRW(purchase.rewardCoins)} 포케코인 (3%)</strong> 적립 혜택
          </span>
        </div>
      </div>

      <div className="p-space-md rounded bg-surface-container-low flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary font-label-sm text-label-sm font-bold flex items-center gap-1">
              <Icon name="bolt" className="text-xs" />
              {product.same_day_shipping ? '포케 특급배송' : '포케 안심배송'}
            </span>
            <span className="font-label-md text-label-md text-tertiary font-bold">
              {product.free_shipping ? '무료배송' : '3만원 이상 무료배송'}
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-outline">CJ대한통운</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface">
          {product.same_day_shipping ? (
            <>
              오늘 <strong>오후 3시 이전 주문 시 내일({tomorrowWeekday()}) 도착 보장 ⚡</strong>
            </>
          ) : (
            <>
              결제 완료 후 <strong>평균 2일 이내 도착</strong>
            </>
          )}
        </p>
        <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
          <Icon name="info" className="text-xs text-outline" />
          <span>도서산간 지역도 안심 포장 안전 배송</span>
        </div>
      </div>

      {purchase.groups.map((group) => (
        <OptionGroupPicker key={group.key} group={group} selectedId={purchase.selected[group.key]} basePrice={product.price} onSelect={purchase.select} />
      ))}

      <div className="p-space-sm rounded bg-surface-container-low flex items-center justify-between mt-space-xs">
        <div className="flex flex-col min-w-0">
          <span className="font-label-md text-label-md font-bold text-on-surface truncate">{purchase.summary || '단일 상품'}</span>
          <span className="font-label-sm text-label-sm text-outline">
            {product.free_shipping ? '배송비 무료' : '3만원 이상 배송비 무료'} · 개별 포장
          </span>
        </div>
        <div className="flex items-center rounded-full bg-surface-container-lowest p-1 shadow-sm shrink-0">
          <button
            type="button"
            aria-label="수량 줄이기"
            onClick={() => purchase.changeQuantity(-1)}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container-high text-on-surface active:scale-95 transition-all"
          >
            <Icon name="remove" className="text-sm" />
          </button>
          <span className="w-8 text-center font-label-md text-label-md font-bold text-on-surface">{purchase.quantity}</span>
          <button
            type="button"
            aria-label="수량 늘리기"
            onClick={() => purchase.changeQuantity(1)}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container-high text-on-surface active:scale-95 transition-all"
          >
            <Icon name="add" className="text-sm" />
          </button>
        </div>
      </div>

      <div className="flex items-baseline justify-between pt-space-sm">
        <span className="font-label-lg text-label-lg text-on-surface font-bold">총 상품 금액</span>
        <div className="flex items-baseline gap-1">
          <span className="font-headline-lg text-headline-lg text-primary font-extrabold">{formatKRW(purchase.total)}</span>
          <span className="font-headline-sm text-headline-sm text-primary font-bold">원</span>
        </div>
      </div>

      <div className="flex items-center gap-space-sm pt-space-xs">
        <WishButton
          product={product}
          iconClass="text-2xl"
          className="p-3.5 rounded-full bg-surface-container-low hover:bg-primary-fixed text-outline hover:text-primary transition-all flex items-center justify-center shrink-0 shadow-sm active:scale-95"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={purchase.soldOut}
          className="flex-1 py-3.5 px-4 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-lg text-label-lg font-bold hover:bg-secondary-fixed-dim transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 disabled:opacity-50"
        >
          <Icon name="shopping_bag" className="text-xl" />
          <span className="whitespace-nowrap">{purchase.soldOut ? '품절' : '장바구니 담기'}</span>
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={purchase.soldOut}
          className="flex-[1.4] py-3.5 px-6 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg font-extrabold hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(255,90,95,0.4)] active:scale-95 disabled:opacity-50"
        >
          <Icon name="20mp" className="text-2xl" />
          <span className="whitespace-nowrap">바로 잡기 (구매) ⚡</span>
        </button>
      </div>
    </div>
  );
}

interface OptionGroupPickerProps {
  readonly group: OptionGroup;
  readonly selectedId: number;
  readonly basePrice: number;
  readonly onSelect: (groupKey: string, optionId: number) => void;
}

/** 옵션 그룹 하나. 추가금이 있는 그룹은 가격이 보이는 카드형, 없으면 라디오형 */
function OptionGroupPicker({ group, selectedId, basePrice, onSelect }: OptionGroupPickerProps) {
  const priced = group.options.some((o) => o.price_delta !== 0);

  return (
    <div className="flex flex-col gap-2 pt-space-xs" role="radiogroup" aria-label={group.label}>
      <span className="font-label-md text-label-md text-on-surface font-bold">{group.label}</span>
      <div className="grid grid-cols-2 gap-space-sm">
        {group.options.map((option) => {
          const active = option.id === selectedId;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(group.key, option.id)}
              className={`p-space-sm rounded text-left flex flex-col gap-1 transition-all border-2 ${
                active ? 'bg-surface-container border-primary-container' : 'bg-surface-container-low border-transparent hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span className="flex items-center gap-1.5 min-w-0">
                  <span className="font-label-md text-label-md font-bold text-on-surface truncate">{option.name}</span>
                  {option.badge_text && (
                    <span className="px-1.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm shrink-0">
                      {option.badge_text}
                    </span>
                  )}
                </span>
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    active ? 'bg-primary-container' : 'bg-surface-container-highest'
                  }`}
                >
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest" />}
                </span>
              </div>
              {option.description && <span className="font-label-sm text-label-sm text-on-surface-variant">{option.description}</span>}
              {priced && (
                <span className={`font-label-sm text-label-sm font-bold ${option.price_delta === 0 ? 'text-primary' : 'text-secondary'}`}>
                  {option.price_delta === 0 ? `${formatKRW(basePrice)}원` : `+${formatKRW(option.price_delta)}원`}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
