'use server';

import { updateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/api/server';

// Admin writes go straight to the Express API, so the Next cache has no idea the
// catalog changed. updateTag (not revalidateTag) because the admin who just saved
// must see their own change, not stale-while-revalidate content.
export async function revalidateCatalog() {
  updateTag(CACHE_TAGS.products);
  updateTag(CACHE_TAGS.categories);
}

export async function revalidateReviews() {
  updateTag('reviews');
}
