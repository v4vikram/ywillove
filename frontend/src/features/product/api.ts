import { CACHE_TAGS, serverFetch } from '@/lib/api/server';
import type { FetchOptions } from '@/lib/api/types';
import type { Category, Product, ProductFilters, ProductListResponse } from './types';

// Catalog is read far more than it changes, so it is cached and invalidated by tag
// when an admin writes a product, rather than expiring on a timer alone.
const catalogCache: FetchOptions = {
  next: { revalidate: 3600, tags: [CACHE_TAGS.products] },
};

export function getProducts(filters: ProductFilters = {}) {
  const query = new URLSearchParams(
    Object.entries(filters).filter(([, value]) => Boolean(value)) as [string, string][],
  );

  return serverFetch<ProductListResponse>(`/products?${query}`, catalogCache);
}

export function getProduct(slug: string) {
  return serverFetch<{ product: Product }>(`/products/${slug}`, catalogCache).then((r) => r.product);
}

export function getCategories() {
  return serverFetch<{ categories: Category[] }>('/categories', {
    next: { revalidate: 3600, tags: [CACHE_TAGS.categories] },
  }).then((r) => r.categories);
}
