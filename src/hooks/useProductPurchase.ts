import { useEffect, useMemo, useState } from 'react';
import type { ProductFull, ProductOption } from '../lib/types';

export interface OptionGroup {
  key: string;
  label: string;
  options: ProductOption[];
}

/** 상세 페이지 구매 박스의 옵션·수량·금액 계산 */
export function useProductPurchase(product: ProductFull) {
  const groups = useMemo<OptionGroup[]>(() => {
    const map = new Map<string, OptionGroup>();
    for (const option of product.options) {
      const group = map.get(option.group_key) ?? { key: option.group_key, label: option.group_label, options: [] };
      group.options.push(option);
      map.set(option.group_key, group);
    }
    return [...map.values()];
  }, [product.options]);

  const defaults = useMemo(
    () => Object.fromEntries(groups.map((g) => [g.key, (g.options.find((o) => o.is_default) ?? g.options[0]).id])),
    [groups],
  );

  const [selected, setSelected] = useState<Record<string, number>>(defaults);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelected(defaults);
    setQuantity(1);
  }, [defaults]);

  const selectedOptions = groups
    .map((g) => g.options.find((o) => o.id === selected[g.key]))
    .filter((o): o is ProductOption => Boolean(o));
  const unitPrice = product.price + selectedOptions.reduce((sum, o) => sum + o.price_delta, 0);
  const maxQuantity = Math.max(1, Math.min(99, product.stock));

  return {
    groups,
    selected,
    select: (groupKey: string, optionId: number) => setSelected((prev) => ({ ...prev, [groupKey]: optionId })),
    selectedOptionIds: selectedOptions.map((o) => o.id),
    summary: selectedOptions.map((o) => o.name).join(' / '),
    quantity,
    changeQuantity: (delta: number) => setQuantity((q) => Math.min(maxQuantity, Math.max(1, q + delta))),
    unitPrice,
    total: unitPrice * quantity,
    rewardCoins: Math.floor(unitPrice * 0.03),
    soldOut: product.stock <= 0,
  };
}
