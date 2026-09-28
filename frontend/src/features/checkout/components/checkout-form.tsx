'use client';

import { useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/api/types';
import { formatPrice } from '@/lib/format';
import { site } from '@/lib/site';
import { useCart } from '@/features/cart/cart-context';
import { useSession } from '@/features/auth/session-context';
import { placeOrder } from '../api';
import type { PlacedOrder, ShippingAddress } from '../types';

export function CheckoutForm() {
  const { cart, isLoading, refresh } = useCart();
  const { user } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Held in a ref so a failed submit retries with the same key instead of
  // creating a second order.
  const idempotencyKey = useRef<string>('');

  function openRazorpay(order: PlacedOrder, email: string, phone: string) {
    const razorpay = new window.Razorpay({
      key: order.gatewayKeyId,
      amount: Math.round(Number(order.amount) * 100),
      currency: 'INR',
      name: site.name,
      description: `Order ${order.orderNumber}`,
      order_id: order.gatewayOrderId,
      prefill: { name: user?.name, email, contact: phone },
      theme: { color: '#000000' },
      handler: () => {
        // The browser's success callback is only a redirect cue — the order is
        // marked paid by the verified webhook, never by this.
        refresh();
        router.push(`/orders/${order.orderNumber}?placed=1`);
      },
      modal: {
        ondismiss: () => {
          setError('Payment cancelled. Your order is saved and still unpaid.');
          router.refresh();
        },
      },
    });

    razorpay.open();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const raw = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    const shippingAddress: ShippingAddress = {
      first_name: raw.first_name,
      last_name: raw.last_name,
      address1: raw.address1,
      address2: raw.address2,
      city: raw.city,
      state: raw.state,
      zip: raw.zip,
      country: 'IN',
      phone: raw.phone,
    };

    idempotencyKey.current ||= crypto.randomUUID();

    startTransition(async () => {
      try {
        const order = await placeOrder({ email: raw.email, shippingAddress }, idempotencyKey.current);

        if (typeof window.Razorpay !== 'function') {
          setError('Payment could not load. Check your connection and try again.');
          return;
        }

        openRazorpay(order, raw.email, raw.phone);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Could not place the order');
      }
    });
  }

  if (isLoading) return <p className="py-20 text-sm text-muted-foreground">Loading…</p>;

  if (!cart?.items.length) {
    return (
      <div className="py-20">
        <p className="text-sm text-muted-foreground">Nothing to check out.</p>
        <Link href="/products" className="mt-6 inline-block border border-foreground px-7 py-3 text-sm">
          Shop the drop
        </Link>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="grid gap-12 py-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="eyebrow">Delivery address</h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="first_name" label="First name" required autoComplete="given-name" />
            <Field name="last_name" label="Last name" autoComplete="family-name" />
          </div>

          <Field name="email" label="Email" type="email" required defaultValue={user?.email} autoComplete="email" />
          <Field name="phone" label="Phone" type="tel" required pattern="[0-9]{10}" defaultValue={user?.phone ?? ''} autoComplete="tel" />
          <Field name="address1" label="Address" required autoComplete="address-line1" />
          <Field name="address2" label="Apartment, landmark (optional)" autoComplete="address-line2" />

          <div className="grid gap-5 sm:grid-cols-3">
            <Field name="city" label="City" required autoComplete="address-level2" />
            <Field name="state" label="State" required autoComplete="address-level1" />
            <Field name="zip" label="PIN code" required pattern="[0-9]{6}" autoComplete="postal-code" />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <button
            type="submit"
            disabled={isPending}
            className="w-full border border-foreground bg-foreground px-7 py-3.5 text-sm text-background transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {isPending ? 'Placing order…' : `Pay ${formatPrice(cart.subtotal)}`}
          </button>

          <p className="text-xs text-muted-foreground">
            By paying you agree to our{' '}
            <Link href="/terms" className="underline underline-offset-2">terms</Link> and{' '}
            <Link href="/returns" className="underline underline-offset-2">returns policy</Link>.
          </p>
        </form>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <h2 className="eyebrow">Order</h2>

          <ul className="mt-5 space-y-4 border-b pb-5 text-sm">
            {cart.items.map((line) => (
              <li key={line.variantId} className="flex justify-between gap-4">
                <span>
                  {line.variant.product.title}
                  <span className="text-muted-foreground">
                    {' '}
                    · {line.variant.size}/{line.variant.color} × {line.quantity}
                  </span>
                </span>
                <span className="tabular-nums">{formatPrice(line.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex justify-between text-base">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(cart.subtotal)}</span>
          </div>
        </aside>
      </div>
    </>
  );
}

function Field({
  name,
  label,
  ...props
}: { name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow">
        {label}
      </label>
      <input
        id={name}
        name={name}
        {...props}
        className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm outline-none transition-colors focus:border-foreground"
      />
    </div>
  );
}
