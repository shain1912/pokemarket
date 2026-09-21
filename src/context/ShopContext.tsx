import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as api from '../lib/api';
import type { CartLine, Product } from '../lib/types';
import { useAuth } from './AuthContext';

interface ToastState {
  id: number;
  icon: string;
  message: string;
}

interface ShopContextValue {
  wishlistIds: number[];
  isWished: (productId: number) => boolean;
  toggleWish: (product: Pick<Product, 'id' | 'name' | 'short_name'>) => Promise<void>;
  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  addToCart: (
    product: Pick<Product, 'id' | 'name' | 'short_name'>,
    optionIds?: number[],
    quantity?: number,
  ) => Promise<boolean>;
  setQuantity: (lineId: number, quantity: number) => Promise<void>;
  removeLine: (lineId: number) => Promise<void>;
  checkout: () => Promise<void>;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toast: ToastState | null;
  showToast: (icon: string, message: string) => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

interface ShopProviderProps {
  readonly children: ReactNode;
}

export function ShopProvider({ children }: ShopProviderProps) {
  const { session, openAuth, refreshProfile } = useAuth();
  const userId = session?.user.id ?? null;

  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<number>();

  const showToast = useCallback((icon: string, message: string) => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), icon, message });
    toastTimer.current = window.setTimeout(() => setToast(null), 2500);
  }, []);

  const reloadCart = useCallback(async () => setCart(await api.fetchCart()), []);

  useEffect(() => {
    if (!userId) {
      setWishlistIds([]);
      setCart([]);
      return;
    }
    api.fetchWishlistIds().then(setWishlistIds).catch(console.error);
    reloadCart().catch(console.error);
  }, [userId, reloadCart]);

  /** 로그인이 필요한 동작 앞에 둔다. 비로그인이면 로그인 모달을 띄우고 false */
  const requireAuth = useCallback(() => {
    if (userId) return true;
    openAuth();
    showToast('lock', '로그인하면 찜과 장바구니를 쓸 수 있어요!');
    return false;
  }, [userId, openAuth, showToast]);

  const run = useCallback(
    async (action: () => Promise<void>) => {
      try {
        await action();
        return true;
      } catch (error) {
        showToast('error', error instanceof Error ? error.message : '문제가 발생했어요. 다시 시도해 주세요.');
        return false;
      }
    },
    [showToast],
  );

  const toggleWish = useCallback<ShopContextValue['toggleWish']>(
    async (product) => {
      if (!requireAuth()) return;
      const wished = wishlistIds.includes(product.id);
      // 낙관적 업데이트 후 실패 시 되돌린다
      setWishlistIds((ids) => (wished ? ids.filter((id) => id !== product.id) : [...ids, product.id]));
      const ok = await run(() => (wished ? api.removeWish(product.id) : api.addWish(product.id)));
      if (!ok) {
        setWishlistIds((ids) => (wished ? [...ids, product.id] : ids.filter((id) => id !== product.id)));
        return;
      }
      if (wished) showToast('heart_broken', '위시리스트에서 제외되었습니다.');
      else showToast('favorite', '관심 포켓몬 굿즈에 찜 완료! ❤️');
    },
    [requireAuth, wishlistIds, run, showToast],
  );

  const addToCart = useCallback<ShopContextValue['addToCart']>(
    async (product, optionIds = [], quantity = 1) => {
      if (!requireAuth()) return false;
      const ok = await run(async () => {
        await api.addToCart(product.id, optionIds, quantity);
        await reloadCart();
      });
      if (ok) showToast('check_circle', `[${product.short_name ?? product.name}] 가방에 쏙 담았습니다! ⚡`);
      return ok;
    },
    [requireAuth, run, reloadCart, showToast],
  );

  const setQuantity = useCallback<ShopContextValue['setQuantity']>(
    async (lineId, quantity) => {
      if (quantity < 1 || quantity > 99) return;
      await run(async () => {
        await api.updateCartQuantity(lineId, quantity);
        await reloadCart();
      });
    },
    [run, reloadCart],
  );

  const removeLine = useCallback<ShopContextValue['removeLine']>(
    async (lineId) => {
      await run(async () => {
        await api.removeCartItem(lineId);
        await reloadCart();
      });
    },
    [run, reloadCart],
  );

  const checkout = useCallback(async () => {
    const ok = await run(async () => {
      const orderId = await api.checkoutCart();
      await Promise.all([reloadCart(), refreshProfile()]);
      setCartOpen(false);
      showToast('celebration', `주문이 접수되었습니다! (주문번호 #${orderId})`);
    });
    if (!ok) await reloadCart().catch(console.error);
  }, [run, reloadCart, refreshProfile, showToast]);

  const value = useMemo<ShopContextValue>(
    () => ({
      wishlistIds,
      isWished: (productId) => wishlistIds.includes(productId),
      toggleWish,
      cart,
      cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
      cartTotal: cart.reduce((sum, line) => sum + line.line_total, 0),
      addToCart,
      setQuantity,
      removeLine,
      checkout,
      cartOpen,
      openCart: () => {
        if (requireAuth()) setCartOpen(true);
      },
      closeCart: () => setCartOpen(false),
      toast,
      showToast,
    }),
    [wishlistIds, toggleWish, cart, addToCart, setQuantity, removeLine, checkout, cartOpen, requireAuth, toast, showToast],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopContextValue {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop 은 ShopProvider 안에서만 사용할 수 있습니다.');
  return ctx;
}
