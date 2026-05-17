import { API_URL, api, type ApiResponse, unwrap } from '@/lib/api';
import type { AuthResponse } from '@/types/auth';

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type SeedAdminPayload = RegisterPayload & {
  seedKey: string;
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', payload);
  return unwrap(response);
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', payload);
  return unwrap(response);
}

export async function seedAdmin(payload: SeedAdminPayload): Promise<AuthResponse> {
  const { seedKey, ...body } = payload;
  const response = await fetch(`${API_URL}/auth/seed-admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-seed-key': seedKey
    },
    body: JSON.stringify(body)
  });

  const data = (await response.json()) as ApiResponse<AuthResponse>;

  if (!response.ok || !data.success) {
    throw new Error(data.success ? 'Seed admin failed' : data.error.message);
  }

  return data.data;
}
