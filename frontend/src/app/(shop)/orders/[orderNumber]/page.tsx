import type { Metadata } from 'next';
import { Suspense } from 'react';
import { OrderDetail } from '@/features/orders/components/order-detail';

export const metadata: Metadata = {
  title: 'Order',
  robots: { index: false, follow: false },
};

export default async function OrderPage(props: PageProps<'/orders/[orderNumber]'>) {
  const { orderNumber } = await props.params;

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl">Order {orderNumber}</h1>
      {/* No RequireAuth: a guest who checked out without an account still needs
          this page, and the backend only returns an order to its owner. */}
      <Suspense>
        <OrderDetail orderNumber={orderNumber} />
      </Suspense>
    </section>
  );
}
