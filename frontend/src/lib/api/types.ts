export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type FetchOptions = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export async function toResult<T>(response: Response): Promise<T> {
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  // fetch resolves on 4xx/5xx, so every caller would need its own ok-check.
  // Throwing here means callers only handle the happy path.
  if (!response.ok) {
    throw new ApiError(
      response.status,
      body?.error?.message ?? response.statusText,
      body?.error?.code,
    );
  }

  return body as T;
}
