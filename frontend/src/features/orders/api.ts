import { api } from '@/lib/api/client';
import type { Order } from './types';

export const getMyOrders = () => api.get<{ orders: Order[] }>('/orders').then((r) => r.orders);

export const getOrder = (orderNumber: string) =>
  api.get<{ order: Order }>(`/orders/${orderNumber}`).then((r) => r.order);

export const getAllOrders = (query = '') =>
  api.get<{ orders: Order[] }>(`/orders/admin/all${query}`).then((r) => r.orders);
