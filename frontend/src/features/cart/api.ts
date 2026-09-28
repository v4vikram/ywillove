import { api } from '@/lib/api/client';
import type { Cart } from './types';

export const getCart = () => api.get<Cart>('/cart');

export const addToCart = (variantId: string, quantity = 1) =>
  api.post<Cart>('/cart/items', { variantId, quantity });

export const updateCartItem = (variantId: string, quantity: number) =>
  api.patch<Cart>(`/cart/items/${variantId}`, { quantity });

export const removeCartItem = (variantId: string) => api.delete<Cart>(`/cart/items/${variantId}`);

// Called right after login so anything added while logged out survives.
export const mergeGuestCart = () => api.post<Cart>('/cart/merge');
