'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatPrice } from '@/lib/format';
import { getOrder } from '../api';
import { StatusBadge } from './status-badge';
import type { Order } from '../types';

export function OrderDetail({ orderNumber }: { orderNumber: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const justPlaced = useSearchParams().get('placed') === '1';

  useEffect(() => {
    getOrder(orderNumber)
      .then(setOrder)
      .catch(() => setNotFound(true));
  }, [orderNumber]);

  if (notFound) {
    return (
      <div className="py-16">
        <p className="text-sm text-muted-foreground">Order not found.</p>
        <Link href="/orders" className="mt-6 inline-block border border-foreground px-7 py-3 text-sm">
          All orders
        </Link>
      </div>
    );
  }

  if (!order) return <p className="py-16 text-sm text-muted-foreground">Loading order…</p>;

  const address = order.shippingAddress;

  return (
    <div className="py-8">
      {justPlaced ? (
        <p className="mb-8 border border-foreground p-4 text-sm">
          Thanks — your order is in. Payment confirmation can take a minute to land; this page
          updates once it does.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge kind="payment" status={order.paymentStatus} />
        <StatusBadge kind="fulfillment" status={order.fulfillmentStatus} />
      </div>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <div>
          <h2 className="eyebrow">Items</h2>
          <ul className="mt-4 divide-y border-y">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4 py-4 text-sm">
                <span>
                  {item.productName}
                  <span className="text-muted-foreground"> · {item.variantLabel} × {item.quantity}</span>
                </span>
                <span className="tabular-nums">
                  {formatPrice(Number(item.unitPrice) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex justify-between text-base">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        <aside className="text-sm">
          <h2 className="eyebrow">Delivery to</h2>
          <address className="mt-4 not-italic leading-relaxed text-muted-foreground">
            {[address.first_name, address.last_name].filter(Boolean).join(' ')}
            <br />
            {address.address1}
            {address.address2 ? <><br />{address.address2}</> : null}
            <br />
            {address.city}, {address.state} {address.zip}
            <br />
            {address.phone}
          </address>

          <p className="mt-8 eyebrow">Ordered</p>
          <p className="mt-2 text-muted-foreground">
            {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>

          <Link href="/contact" className="mt-8 inline-block text-sm underline underline-offset-2">
            Problem with this order?
          </Link>
        </aside>
      </div>
    </div>
  );
}
