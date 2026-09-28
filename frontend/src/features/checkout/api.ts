import { api } from '@/lib/api/client';
import type { PlacedOrder, ShippingAddress } from './types';

export function placeOrder(
  input: { email: string; shippingAddress: ShippingAddress },
  idempotencyKey: string,
) {
  // The key is generated once per checkout attempt and reused on retry, so a
  // double-click or a retried network call returns the original order.
  return api.post<PlacedOrder>('/orders', input, { 'Idempotency-Key': idempotencyKey });
}
