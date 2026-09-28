import { API_URL, ApiError, toResult, type FetchOptions } from './types';

// Access token lives in memory, never localStorage — an injected script can read
// localStorage, and the refresh token is already httpOnly for the same reason.
let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function refreshAccessToken(): Promise<string | null> {
  // Single-flight: several requests can 401 at once, but only one refresh runs
  // and the rest await its result. Otherwise parallel refreshes race and all but
  // one end up using a rotated-out token.
  refreshPromise ??= (async () => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) return null;

      const data = (await response.json()) as { accessToken: string };
      accessToken = data.accessToken;
      return accessToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function request(path: string, options: FetchOptions, token: string | null) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

export async function clientFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  let response = await request(path, options, accessToken);

  if (response.status === 401) {
    const fresh = await refreshAccessToken();
    if (!fresh) {
      accessToken = null;
      throw new ApiError(401, 'Session expired');
    }
    response = await request(path, options, fresh);
  }

  return toResult<T>(response);
}

export const api = {
  get: <T>(path: string) => clientFetch<T>(path),
  post: <T>(path: string, body?: unknown, headers?: HeadersInit) =>
    clientFetch<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}), headers }),
  patch: <T>(path: string, body?: unknown) =>
    clientFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string) => clientFetch<T>(path, { method: 'DELETE' }),
};
