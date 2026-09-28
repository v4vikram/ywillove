'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTransition } from 'react';
import { formatPrice } from '@/lib/format';
import { useCart } from '../cart-context';

export function CartView() {
  const { cart, isLoading, update, remove } = useCart();
  const [isPending, startTransition] = useTransition();

  if (isLoading) {
    return <p className="py-20 text-sm text-muted-foreground">Loading cart…</p>;
  }

  if (!cart?.items.length) {
    return (
      <div className="py-20">
        <p className="text-sm text-muted-foreground">Your cart is empty.</p>
        <Link
          href="/products"
          className="mt-6 inline-block border border-foreground px-7 py-3 text-sm transition-colors hover:bg-foreground hover:text-background"
        >
          Shop the drop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 py-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
      <ul className="divide-y border-y">
        {cart.items.map((line) => (
          <li key={line.variantId} className="flex gap-5 py-6">
            <Link
              href={`/products/${line.variant.product.slug}`}
              className="relative aspect-3/4 w-24 shrink-0 overflow-hidden bg-muted"
            >
              {line.variant.product.images?.[0] ? (
                <Image
                  src={line.variant.product.images[0]}
                  alt={line.variant.product.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : null}
            </Link>

            <div className="flex flex-1 flex-col justify-between">
              <div className="flex justify-between gap-4">
                <div>
                  <Link
                    href={`/products/${line.variant.product.slug}`}
                    className="text-sm hover:opacity-60"
                  >
                    {line.variant.product.title}
                  </Link>
                  <p className="mt-1 eyebrow">
                    {line.variant.size} / {line.variant.color}
                  </p>
                </div>
                <p className="text-sm tabular-nums">{formatPrice(line.lineTotal)}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center border">
                  <QtyButton
                    label="Decrease quantity"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        await update(line.variantId, line.quantity - 1);
                      })
                    }
                  >
                    −
                  </QtyButton>
                  <span className="min-w-10 text-center text-sm tabular-nums">{line.quantity}</span>
                  <QtyButton
                    label="Increase quantity"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        await update(line.variantId, line.quantity + 1);
                      })
                    }
                  >
                    +
                  </QtyButton>
                </div>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => startTransition(async () => { await remove(line.variantId); })}
                  className="text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <h2 className="eyebrow">Summary</h2>

        <dl className="mt-5 space-y-3 border-b pb-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(cart.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="text-muted-foreground">Calculated at checkout</dd>
          </div>
        </dl>

        <div className="mt-5 flex justify-between text-base">
          <span>Total</span>
          <span className="tabular-nums">{formatPrice(cart.subtotal)}</span>
        </div>

        <Link
          href="/checkout"
          className="mt-8 block border border-foreground bg-foreground px-7 py-3.5 text-center text-sm text-background transition-opacity hover:opacity-85"
        >
          Checkout
        </Link>

        <p className="mt-4 text-xs text-muted-foreground">
          Made to order — production starts once payment clears.
        </p>
      </aside>
    </div>
  );
}

function QtyButton({
  children,
  label,
  ...props
}: { label: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      {...props}
      className="px-3 py-2 text-sm transition-opacity hover:opacity-60 disabled:opacity-40"
    >
      {children}
    </button>
  );
}
