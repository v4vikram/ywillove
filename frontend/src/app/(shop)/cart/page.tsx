import type { Metadata } from 'next';
import { CartView } from '@/features/cart/components/cart-view';

export const metadata: Metadata = {
  title: 'Cart',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl">Cart</h1>
      <CartView />
    </section>
  );
}
