'use client';

import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';
import * as cartApi from './api';
import type { Cart } from './types';

type CartValue = {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  add: (variantId: string, quantity?: number) => Promise<void>;
  update: (variantId: string, quantity: number) => Promise<void>;
  remove: (variantId: string) => Promise<void>;
  refresh: () => Promise<void>;
  mergeGuest: () => Promise<void>;
};

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cartApi
      .getCart()
      .then(setCart)
      .catch(() => setCart(null))
      .finally(() => setIsLoading(false));
  }, []);

  const add = useCallback(async (variantId: string, quantity = 1) => {
    setCart(await cartApi.addToCart(variantId, quantity));
  }, []);

  const update = useCallback(async (variantId: string, quantity: number) => {
    setCart(await cartApi.updateCartItem(variantId, quantity));
  }, []);

  const remove = useCallback(async (variantId: string) => {
    setCart(await cartApi.removeCartItem(variantId));
  }, []);

  const refresh = useCallback(async () => {
    setCart(await cartApi.getCart().catch(() => null));
  }, []);

  const mergeGuest = useCallback(async () => {
    setCart(await cartApi.mergeGuestCart().catch(() => null));
  }, []);

  const value = useMemo(
    () => ({
      cart,
      isLoading,
      itemCount: cart?.items.reduce((total, line) => total + line.quantity, 0) ?? 0,
      add,
      update,
      remove,
      refresh,
      mergeGuest,
    }),
    [cart, isLoading, add, update, remove, refresh, mergeGuest],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const context = use(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
