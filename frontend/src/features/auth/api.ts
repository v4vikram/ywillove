import { api, setAccessToken } from '@/lib/api/client';
import { API_URL } from '@/lib/api/types';
import type { LoginInput, RegisterInput, SessionResponse } from './types';

export async function login(input: LoginInput) {
  const session = await api.post<SessionResponse>('/auth/login', input);
  setAccessToken(session.accessToken);
  return session;
}

export async function register(input: RegisterInput) {
  const session = await api.post<SessionResponse>('/auth/register', input);
  setAccessToken(session.accessToken);
  return session;
}

export async function logout() {
  await api.post('/auth/logout');
  setAccessToken(null);
}

/**
 * Called once on mount. The access token only lives in memory, so a page refresh
 * always starts logged-out until the httpOnly refresh cookie is exchanged here.
 */
export async function restoreSession(): Promise<SessionResponse | null> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) return null;

    const session = (await response.json()) as SessionResponse;
    setAccessToken(session.accessToken);
    return session;
  } catch {
    return null;
  }
}
