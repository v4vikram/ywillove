'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import { getAllOrders } from '@/features/orders/api';
import type { Order } from '@/features/orders/types';
import { listPendingReviews, listProducts } from '../api';

type Stats = {
  orders: Order[];
  productCount: number;
  pendingReviews: number;
};

export function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      getAllOrders().catch(() => [] as Order[]),
      listProducts().then((r) => r.total).catch(() => 0),
      listPendingReviews().then((r) => r.length).catch(() => 0),
    ]).then(([orders, productCount, pendingReviews]) =>
      setStats({ orders, productCount, pendingReviews }),
    );
  }, []);

  if (!stats) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const paid = stats.orders.filter((order) => order.paymentStatus === 'paid');
  const revenue = paid.reduce((total, order) => total + Number(order.totalAmount), 0);
  const needsDispatch = paid.filter((order) => order.fulfillmentStatus === 'unfulfilled');

  return (
    <>
      <h1 className="text-2xl">Overview</h1>

      <dl className="mt-8 grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Paid orders" value={String(paid.length)} />
        <Stat label="Revenue" value={formatPrice(revenue)} />
        <Stat label="Products" value={String(stats.productCount)} />
        <Stat label="Reviews to approve" value={String(stats.pendingReviews)} />
      </dl>

      {needsDispatch.length ? (
        <p className="mt-8 border border-foreground p-4 text-sm">
          {needsDispatch.length} paid {needsDispatch.length === 1 ? 'order has' : 'orders have'} not
          reached the supplier.{' '}
          <Link href="/admin/orders" className="underline underline-offset-2">
            Review them
          </Link>
          .
        </p>
      ) : null}

      <section className="mt-12">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm hover:opacity-60">
            All orders
          </Link>
        </div>

        {stats.orders.length ? (
          <ul className="divide-y border-y text-sm">
            {stats.orders.slice(0, 5).map((order) => (
              <li key={order.id} className="flex justify-between gap-4 py-3">
                <Link href={`/orders/${order.orderNumber}`} className="hover:opacity-60">
                  {order.orderNumber}
                </Link>
                <span className="text-muted-foreground">{order.paymentStatus}</span>
                <span className="tabular-nums">{formatPrice(order.totalAmount)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        )}
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background p-6">
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-2 text-2xl tabular-nums">{value}</dd>
    </div>
  );
}
