import type { Metadata } from 'next';
import { RequireAuth } from '@/features/auth/components/require-auth';
import { OrderList } from '@/features/orders/components/order-list';

export const metadata: Metadata = {
  title: 'Your orders',
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl">Your orders</h1>
      <RequireAuth>
        <OrderList />
      </RequireAuth>
    </section>
  );
}
