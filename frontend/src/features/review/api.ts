import { serverFetch } from '@/lib/api/server';
import type { FetchOptions } from '@/lib/api/types';
import type { ProductReviews, RecentReview } from './types';

// Matches the catalog TTL on purpose: a page takes the shortest revalidate of all
// its fetches, so a lower value here would silently shorten the whole homepage.
// Freshness comes from revalidateTag('reviews') on approval, not a tighter timer.
const reviewCache: FetchOptions = { next: { revalidate: 3600, tags: ['reviews'] } };

export function getRecentReviews(limit = 3) {
  return serverFetch<{ reviews: RecentReview[] }>(`/reviews/recent?limit=${limit}`, reviewCache)
    .then((r) => r.reviews)
    .catch(() => []);
}

export function getProductReviews(productId: string) {
  return serverFetch<ProductReviews>(`/products/${productId}/reviews`, reviewCache).catch(() => ({
    reviews: [],
    average: 0,
    count: 0,
  }));
}
