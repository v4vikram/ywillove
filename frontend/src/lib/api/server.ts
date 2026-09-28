import { cookies } from 'next/headers';
import { API_URL, toResult, type FetchOptions } from './types';

type ServerFetchOptions = FetchOptions & { forwardCookies?: boolean };

/**
 * Server Component fetch. Pass `next.revalidate` or `next.tags` to opt into the
 * framework cache — without one of those, nothing is cached.
 */
export async function serverFetch<T>(
  path: string,
  { forwardCookies = false, headers, ...options }: ServerFetchOptions = {},
): Promise<T> {
  const cookieHeader = forwardCookies ? (await cookies()).toString() : '';

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...headers,
    },
  });

  return toResult<T>(response);
}

export const CACHE_TAGS = {
  products: 'products',
  categories: 'categories',
} as const;
