import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { apiFetch, apiClient, ApiError } from '@/services/api';
import * as navigate from '@/lib/navigate';

jest.mock('@/lib/navigate');

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100';

describe('apiFetch', () => {
  // --- Basic functionality ---

  it('makes a GET request and returns JSON', async () => {
    server.use(
      http.get(`${BASE_URL}/test`, () => HttpResponse.json({ ok: true })),
    );
    const result = await apiFetch<{ ok: boolean }>('/test');
    expect(result).toEqual({ ok: true });
  });

  it('sends JSON body for POST requests', async () => {
    server.use(
      http.post(`${BASE_URL}/test`, async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json(body, { status: 201 });
      }),
    );
    const result = await apiFetch<{ name: string }>('/test', {
      method: 'POST',
      body: { name: 'test' },
    });
    expect(result).toEqual({ name: 'test' });
  });

  it('returns undefined for 204 No Content', async () => {
    server.use(
      http.delete(`${BASE_URL}/test`, () => new HttpResponse(null, { status: 204 })),
    );
    const result = await apiFetch<void>('/test', { method: 'DELETE' });
    expect(result).toBeUndefined();
  });

  // --- Error normalisation ---

  it('throws ApiError with parsed error body on non-ok response', async () => {
    server.use(
      http.get(`${BASE_URL}/test`, () =>
        HttpResponse.json(
          { statusCode: 422, message: 'Validation failed', error: 'Unprocessable Entity' },
          { status: 422 },
        ),
      ),
    );
    await expect(apiFetch('/test')).rejects.toThrow(ApiError);
    await expect(apiFetch('/test')).rejects.toMatchObject({
      statusCode: 422,
      errorBody: { message: 'Validation failed' },
    });
  });

  it('normalises non-JSON error responses', async () => {
    server.use(
      http.get(`${BASE_URL}/test`, () => new HttpResponse('Server Error', { status: 500 })),
    );
    await expect(apiFetch('/test')).rejects.toMatchObject({
      statusCode: 500,
      errorBody: { statusCode: 500 },
    });
  });

  it('redirects to /login on 401', async () => {
    const navigateSpy = jest.mocked(navigate.navigateTo);

    server.use(
      http.get(`${BASE_URL}/test`, () => new HttpResponse(null, { status: 401 })),
    );
    await expect(apiFetch('/test')).rejects.toThrow(ApiError);
    expect(navigateSpy).toHaveBeenCalledWith('/login');
  });

  // --- Retry logic ---

  it('retries on 503 and succeeds on second attempt', async () => {
    let attempt = 0;
    server.use(
      http.get(`${BASE_URL}/retry-test`, () => {
        attempt++;
        if (attempt === 1) {
          return new HttpResponse(null, { status: 503 });
        }
        return HttpResponse.json({ attempt });
      }),
    );
    const result = await apiFetch<{ attempt: number }>('/retry-test', {}, {
      maxRetries: 2,
      baseDelayMs: 10, // fast for tests
    });
    expect(result).toEqual({ attempt: 2 });
    expect(attempt).toBe(2);
  });

  it('throws after exhausting all retry attempts', async () => {
    server.use(
      http.get(`${BASE_URL}/always-fail`, () => new HttpResponse(null, { status: 503 })),
    );
    await expect(
      apiFetch('/always-fail', {}, { maxRetries: 1, baseDelayMs: 10 }),
    ).rejects.toMatchObject({ statusCode: 503 });
  });

  it('does not retry non-retryable status codes', async () => {
    let attempts = 0;
    server.use(
      http.get(`${BASE_URL}/not-retryable`, () => {
        attempts++;
        return HttpResponse.json(
          { statusCode: 400, message: 'Bad Request', error: 'Bad Request' },
          { status: 400 },
        );
      }),
    );
    await expect(
      apiFetch('/not-retryable', {}, { maxRetries: 2, baseDelayMs: 10 }),
    ).rejects.toThrow(ApiError);
    expect(attempts).toBe(1);
  });

  it('skips retries when retryConfig is false', async () => {
    let attempts = 0;
    server.use(
      http.get(`${BASE_URL}/no-retry`, () => {
        attempts++;
        return new HttpResponse(null, { status: 503 });
      }),
    );
    await expect(apiFetch('/no-retry', {}, false)).rejects.toThrow(ApiError);
    expect(attempts).toBe(1);
  });

  it('retries on network errors', async () => {
    let attempt = 0;
    server.use(
      http.get(`${BASE_URL}/network-error`, () => {
        attempt++;
        if (attempt === 1) {
          return HttpResponse.error();
        }
        return HttpResponse.json({ recovered: true });
      }),
    );
    const result = await apiFetch<{ recovered: boolean }>('/network-error', {}, {
      maxRetries: 1,
      baseDelayMs: 10,
    });
    expect(result).toEqual({ recovered: true });
  });

  it('rethrows network error immediately when retryConfig is false', async () => {
    server.use(
      http.get(`${BASE_URL}/network-no-retry`, () => HttpResponse.error()),
    );
    await expect(apiFetch('/network-no-retry', {}, false)).rejects.not.toBeInstanceOf(ApiError);
  });

  it('rethrows network error after exhausting retries', async () => {
    server.use(
      http.get(`${BASE_URL}/network-always-fail`, () => HttpResponse.error()),
    );
    await expect(
      apiFetch('/network-always-fail', {}, { maxRetries: 1, baseDelayMs: 10 }),
    ).rejects.not.toBeInstanceOf(ApiError);
  });
});

// --- apiClient convenience methods ---

describe('apiClient', () => {
  it('apiClient.get makes GET request', async () => {
    server.use(
      http.get(`${BASE_URL}/items`, () => HttpResponse.json([1, 2, 3])),
    );
    const result = await apiClient.get<number[]>('/items');
    expect(result).toEqual([1, 2, 3]);
  });

  it('apiClient.post makes POST request with body', async () => {
    server.use(
      http.post(`${BASE_URL}/items`, async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json(body, { status: 201 });
      }),
    );
    const result = await apiClient.post<{ id: number }>('/items', { id: 1 });
    expect(result).toEqual({ id: 1 });
  });

  it('apiClient.patch makes PATCH request with body', async () => {
    server.use(
      http.patch(`${BASE_URL}/items/1`, async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json({ id: 1, ...(body as object) });
      }),
    );
    const result = await apiClient.patch<{ id: number; name: string }>('/items/1', { name: 'updated' });
    expect(result).toEqual({ id: 1, name: 'updated' });
  });

  it('apiClient.put makes PUT request with body', async () => {
    server.use(
      http.put(`${BASE_URL}/items/1`, async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json({ id: 1, ...(body as object) });
      }),
    );
    const result = await apiClient.put<{ id: number; name: string }>('/items/1', { name: 'replaced' });
    expect(result).toEqual({ id: 1, name: 'replaced' });
  });

  it('apiClient.delete makes DELETE request', async () => {
    server.use(
      http.delete(`${BASE_URL}/items/1`, () => new HttpResponse(null, { status: 204 })),
    );
    const result = await apiClient.delete<void>('/items/1');
    expect(result).toBeUndefined();
  });
});
