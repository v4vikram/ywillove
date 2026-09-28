'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Stars } from '@/features/review/components/stars';
import type { RecentReview } from '@/features/review/types';
import { revalidateReviews } from '../actions';
import { approveReview, listPendingReviews } from '../api';

export function AdminReviews() {
  const [reviews, setReviews] = useState<RecentReview[] | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    listPendingReviews()
      .then(setReviews)
      .catch(() => setReviews([]));
  }, []);

  function handleApprove(review: RecentReview) {
    startTransition(async () => {
      try {
        await approveReview(review.id);
        await revalidateReviews();
        setReviews((current) => current?.filter((r) => r.id !== review.id) ?? null);
        toast.success('Review published');
      } catch {
        toast.error('Could not approve the review');
      }
    });
  }

  return (
    <>
      <h1 className="text-2xl">Reviews to approve</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Reviews stay hidden until approved, and only verified buyers can post one.
      </p>

      {!reviews ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : !reviews.length ? (
        <p className="mt-8 text-sm text-muted-foreground">Nothing waiting.</p>
      ) : (
        <ul className="mt-8 divide-y border-y">
          {reviews.map((review) => (
            <li key={review.id} className="flex flex-wrap items-start justify-between gap-6 py-5">
              <div className="max-w-xl">
                <Stars rating={review.rating} />
                {review.body ? <p className="mt-2 text-sm leading-relaxed">{review.body}</p> : null}
                <p className="mt-2 text-xs text-muted-foreground">
                  {review.user.name} on{' '}
                  <Link href={`/products/${review.product.slug}`} className="underline underline-offset-2">
                    {review.product.title}
                  </Link>
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleApprove(review)}
                disabled={isPending}
                className="border border-foreground bg-foreground px-6 py-2.5 text-sm text-background transition-opacity hover:opacity-85 disabled:opacity-50"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
