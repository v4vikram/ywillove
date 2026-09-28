'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { ApiError } from '@/lib/api/types';
import { subscribe } from '../api';

export function NewsletterForm({ source = 'homepage' }: { source?: string }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await subscribe(email, source);
        setDone(true);
        setEmail('');
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Something went wrong');
      }
    });
  }

  if (done) {
    return <p className="text-sm">You&apos;re on the list. Drop 02 lands in your inbox first.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <div className="flex border-b border-foreground">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="your@email.com"
          className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-2 py-3 text-sm uppercase tracking-[0.15em] transition-opacity hover:opacity-60 disabled:opacity-40"
        >
          {isPending ? '…' : 'Join'}
        </button>
      </div>

      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}

      <p className="mt-3 text-xs text-muted-foreground">
        Drop alerts only. Unsubscribe anytime —{' '}
        <Link href="/privacy" className="underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
