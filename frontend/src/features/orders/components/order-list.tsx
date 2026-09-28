'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import { getMyOrders } from '../api';
import { StatusBadge } from './status-badge';
import type { Order } from '../types';

export function OrderList() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  if (!orders) return <p className="py-16 text-sm text-muted-foreground">Loading orders…</p>;

  if (!orders.length) {
    return (
      <div className="py-16">
        <p className="text-sm text-muted-foreground">No orders yet.</p>
        <Link href="/products" className="mt-6 inline-block border border-foreground px-7 py-3 text-sm">
          Shop the drop
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-8 divide-y border-y">
      {orders.map((order) => (
        <li key={order.id} className="py-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <Link href={`/orders/${order.orderNumber}`} className="text-sm hover:opacity-60">
              {order.orderNumber}
            </Link>
            <span className="text-sm tabular-nums">{formatPrice(order.totalAmount)}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge kind="payment" status={order.paymentStatus} />
            <StatusBadge kind="fulfillment" status={order.fulfillmentStatus} />
            <span className="eyebrow">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
