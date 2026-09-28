import Link from 'next/link';
import { Stars } from './stars';
import type { RecentReview } from '../types';

// Renders nothing until real reviews exist — a "what customers say" heading over an
// empty row reads worse than no section at all.
export function ReviewWall({ reviews }: { reviews: RecentReview[] }) {
  if (!reviews.length) return null;

  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <h2 className="mb-8 text-xl sm:text-2xl">What people are saying</h2>

        <div className="grid gap-px border bg-border sm:grid-cols-3">
          {reviews.map((review) => (
            <figure key={review.id} className="flex flex-col justify-between gap-6 bg-background p-8">
              <div>
                <Stars rating={review.rating} />
                {review.body ? (
                  <blockquote className="mt-4 text-sm leading-relaxed">{review.body}</blockquote>
                ) : null}
              </div>

              <figcaption className="text-xs">
                <span className="text-muted-foreground">{review.user.name} on </span>
                <Link href={`/products/${review.product.slug}`} className="underline underline-offset-2">
                  {review.product.title}
                </Link>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
