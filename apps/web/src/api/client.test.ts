import { afterEach, describe, expect, it, vi } from 'vitest';

import { API_BASE_URL, ApiError, apiFetch } from './client';

function mockFetch(response: Partial<Response> & { status: number }) {
  const fetchMock = vi.fn(async () => response as Response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('apiFetch', () => {
  it('targets the /api prefix the server mounts everything under', () => {
    expect(API_BASE_URL.endsWith('/api')).toBe(true);
  });

  it('parses a JSON body', async () => {
    mockFetch({ ok: true, status: 200, json: async () => ({ id: 'bets/1' }) });

    await expect(apiFetch<{ id: string }>('/bets/bets%2F1')).resolves.toEqual({ id: 'bets/1' });
  });

  it('returns undefined for a 204 without touching the body', async () => {
    const json = vi.fn();
    mockFetch({ ok: true, status: 204, json });

    await expect(apiFetch<void>('/bets/x', { method: 'DELETE' })).resolves.toBeUndefined();
    expect(json).not.toHaveBeenCalled();
  });

  it('flattens the array of validation messages Nest returns', async () => {
    mockFetch({
      ok: false,
      status: 400,
      json: async () => ({ message: ['stake must not be less than 0.01', 'odds is required'] }),
    });

    await expect(apiFetch('/bets', { method: 'POST', body: {} })).rejects.toThrow(
      'stake must not be less than 0.01, odds is required',
    );
  });

  it('surfaces the status code on failure', async () => {
    mockFetch({ ok: false, status: 404, json: async () => ({ message: 'Bet not found.' }) });

    await expect(apiFetch('/bets/nope')).rejects.toMatchObject(new ApiError(404, 'Bet not found.'));
  });

  it('falls back to a generic message when the error body is not JSON', async () => {
    mockFetch({
      ok: false,
      status: 502,
      json: async () => {
        throw new Error('not json');
      },
    });

    await expect(apiFetch('/bets')).rejects.toThrow('Request failed with status 502.');
  });

  it('only sets a JSON content type when there is a body', async () => {
    const fetchMock = mockFetch({ ok: true, status: 200, json: async () => ({}) });

    await apiFetch('/bets');

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/bets`,
      expect.objectContaining({ headers: undefined, body: undefined }),
    );
  });
});
