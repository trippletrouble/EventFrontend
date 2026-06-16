import type { ErrorResponseDto } from '@/types/common.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3100';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public errorBody: ErrorResponseDto,
  ) {
    super(errorBody.message);
    this.name = 'ApiError';
  }
}

/**
 * Generischer Fetch-Wrapper.
 * - credentials: 'include' (Session-Cookie)
 * - Content-Type: application/json bei Body
 * - 401 → redirect zu /login
 * - 204 → undefined
 * - !ok → ApiError
 */
export async function apiFetch<T>(
  path: string,
  options: Omit<RequestInit, 'body'> & { body?: unknown } = {},
): Promise<T> {
  const { body, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = { ...(customHeaders as Record<string, string>) };
  if (body !== undefined && body !== null) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && typeof window !== 'undefined') {
    window.location.href = '/login';
    throw new ApiError(401, { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' });
  }

  if (!res.ok) {
    const errorBody: ErrorResponseDto = await res.json().catch(() => ({
      statusCode: res.status, message: res.statusText, error: res.statusText,
    }));
    throw new ApiError(res.status, errorBody);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
