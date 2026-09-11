const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

export const API_BASE_URL = `${BASE_URL}/api`;

/** An API call that came back with a non-2xx status. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    signal,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  // 204 responses carry no body, so there is nothing to parse.
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

/** Nest's exception filter returns `{ message }`, sometimes as a list of validation errors. */
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload: unknown = await response.json();
    if (payload && typeof payload === 'object' && 'message' in payload) {
      const { message } = payload as { message: unknown };
      if (Array.isArray(message)) return message.join(', ');
      if (typeof message === 'string') return message;
    }
  } catch {
    // Fall through to the generic message below.
  }
  return `Request failed with status ${response.status}.`;
}
