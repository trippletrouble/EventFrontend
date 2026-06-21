import type { ErrorResponseDto, RetryConfig } from '@/types/common.types';
import { navigateTo } from '@/lib/navigate';

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

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 2,
  baseDelayMs: 500,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(status: number, config: RetryConfig): boolean {
  return config.retryableStatuses.includes(status);
}

async function parseErrorResponse(res: Response): Promise<ErrorResponseDto> {
  try {
    return await res.json();
  } catch {
    return {
      statusCode: res.status,
      message: res.statusText,
      error: res.statusText,
    };
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
  retryConfig: Partial<RetryConfig> | false = {},
): Promise<T> {
  const { body, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = { ...(customHeaders as Record<string, string>) };
  if (body !== undefined && body !== null) {
    headers['Content-Type'] = 'application/json';
  }

  const config: RetryConfig | null =
    retryConfig === false
      ? null
      : { ...DEFAULT_RETRY_CONFIG, ...retryConfig };

  const maxAttempts = config ? config.maxRetries + 1 : 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let res: Response;

    try {
      res = await fetch(`${BASE_URL}${path}`, {
        ...rest,
        headers,
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (error) {
      // Network error (no response) — retry if attempts remain
      if (config && attempt < maxAttempts) {
        await sleep(config.baseDelayMs * attempt);
        continue;
      }
      throw error;
    }

    if (res.status === 401) {
      navigateTo('/login');
      throw new ApiError(401, { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' });
    }

    if (!res.ok) {
      if (config && attempt < maxAttempts && isRetryable(res.status, config)) {
        await sleep(config.baseDelayMs * attempt);
        continue;
      }
      const errorBody = await parseErrorResponse(res);
      throw new ApiError(res.status, errorBody);
    }

    if (res.status === 204) return undefined as T;
    return res.json();
  }

  // Unreachable, but TypeScript needs it
  throw new Error('Retry loop exited unexpectedly');
}

export const apiClient = {
  get<T>(path: string, retryConfig?: Partial<RetryConfig> | false): Promise<T> {
    return apiFetch<T>(path, { method: 'GET' }, retryConfig);
  },

  post<T>(path: string, body?: unknown, retryConfig?: Partial<RetryConfig> | false): Promise<T> {
    return apiFetch<T>(path, { method: 'POST', body }, retryConfig ?? false);
  },

  put<T>(path: string, body?: unknown, retryConfig?: Partial<RetryConfig> | false): Promise<T> {
    return apiFetch<T>(path, { method: 'PUT', body }, retryConfig ?? false);
  },

  patch<T>(path: string, body?: unknown, retryConfig?: Partial<RetryConfig> | false): Promise<T> {
    return apiFetch<T>(path, { method: 'PATCH', body }, retryConfig ?? false);
  },

  delete<T>(path: string, retryConfig?: Partial<RetryConfig> | false): Promise<T> {
    return apiFetch<T>(path, { method: 'DELETE' }, retryConfig ?? false);
  },
} as const;
