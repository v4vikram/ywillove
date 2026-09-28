'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApiError } from '@/lib/api/types';
import { useCart } from '@/features/cart/cart-context';
import { useSession } from '../session-context';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const isLogin = mode === 'login';
  const { login, register } = useSession();
  const { mergeGuest } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const redirectTo = searchParams.get('next') ?? '/account';

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;

    startTransition(async () => {
      try {
        if (isLogin) {
          await login({ email: data.email, password: data.password });
        } else {
          await register({
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone || undefined,
          });
        }

        // Anything added while logged out moves onto the account's cart.
        await mergeGuest();
        router.push(redirectTo);
        router.refresh();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Something went wrong');
      }
    });
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:py-24">
      <h1 className="text-2xl">{isLogin ? 'Log in' : 'Create account'}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {isLogin ? 'Track orders and check out faster.' : 'One account, all your drops.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {!isLogin ? (
          <Field name="name" label="Name" type="text" required autoComplete="name" />
        ) : null}

        <Field name="email" label="Email" type="email" required autoComplete="email" />

        {!isLogin ? (
          <Field name="phone" label="Phone (optional)" type="tel" autoComplete="tel" />
        ) : null}

        <Field
          name="password"
          label="Password"
          type="password"
          required
          minLength={8}
          autoComplete={isLogin ? 'current-password' : 'new-password'}
        />

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full border border-foreground bg-foreground px-7 py-3.5 text-sm text-background transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {isPending ? 'Please wait…' : isLogin ? 'Log in' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <Link
          href={isLogin ? '/register' : '/login'}
          className="underline underline-offset-2 hover:opacity-60"
        >
          {isLogin ? 'Create one' : 'Log in'}
        </Link>
      </p>
    </div>
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
