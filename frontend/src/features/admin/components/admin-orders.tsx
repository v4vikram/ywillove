'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/format';
import { getAllOrders } from '@/features/orders/api';
import { StatusBadge } from '@/features/orders/components/status-badge';
import type { Order } from '@/features/orders/types';
import { dispatchOrder, retryFulfillment } from '../api';

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = useCallback(() => {
    getAllOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  useEffect(load, [load]);

  function handleDispatch(order: Order) {
    startTransition(async () => {
      try {
        await dispatchOrder(order.id);
        toast.success(`${order.orderNumber} sent to Qikink`);
        load();
      } catch {
        toast.error('Dispatch failed — check the supplier log');
      }
    });
  }

  function handleRetry() {
    startTransition(async () => {
      try {
        const { retried } = await retryFulfillment();
        toast.success(retried ? `Retried ${retried} stuck order(s)` : 'Nothing stuck');
        load();
      } catch {
        toast.error('Retry failed');
      }
    });
  }

  return (
    <>
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl">Orders</h1>
        <button
          type="button"
          onClick={handleRetry}
          disabled={isPending}
          className="border border-border px-6 py-2.5 text-sm hover:border-foreground disabled:opacity-50"
        >
          Retry failed dispatches
        </button>
      </div>

      {!orders ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : !orders.length ? (
        <p className="mt-8 text-sm text-muted-foreground">No orders yet.</p>
      ) : (
        <ul className="mt-8 divide-y border-y">
          {orders.map((order) => (
            <li key={order.id} className="py-5">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <Link href={`/orders/${order.orderNumber}`} className="text-sm hover:opacity-60">
                  {order.orderNumber}
                </Link>
                <span className="text-sm text-muted-foreground">{order.email}</span>
                <span className="text-sm tabular-nums">{formatPrice(order.totalAmount)}</span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge kind="payment" status={order.paymentStatus} />
                <StatusBadge kind="fulfillment" status={order.fulfillmentStatus} />

                {/* Dispatch normally fires automatically off the payment webhook.
                    This is the manual escape hatch for when that failed. */}
                {order.paymentStatus === 'paid' && order.fulfillmentStatus === 'unfulfilled' ? (
                  <button
                    type="button"
                    onClick={() => handleDispatch(order)}
                    disabled={isPending}
                    className="border border-foreground px-3 py-1 text-xs uppercase tracking-[0.12em] hover:bg-foreground hover:text-background disabled:opacity-50"
                  >
                    Send to Qikink
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
