type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

type ApiFailure = {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new Error(response.error.message || 'Request failed');
  }

  return response.data;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  const headers = new Headers(options.headers ?? {});

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as ApiResponse<T>) : null;

  if (payload) {
    return payload;
  }

  if (!response.ok) {
    return {
      success: false,
      error: {
        message: response.statusText || 'Request failed',
        code: String(response.status)
      }
    };
  }

  return { success: true, data: {} as T };
}

export const api = {
  get<T>(path: string) {
    return request<T>(path, { method: 'GET' });
  },
  post<T>(path: string, body?: unknown) {
    return request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) });
  },
  put<T>(path: string, body?: unknown) {
    return request<T>(path, { method: 'PUT', body: JSON.stringify(body ?? {}) });
  },
  delete<T>(path: string) {
    return request<T>(path, { method: 'DELETE' });
  }
};
