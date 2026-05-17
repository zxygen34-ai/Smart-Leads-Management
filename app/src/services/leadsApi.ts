import { API_URL, api, getAuthToken } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type { Lead, LeadFilters, LeadInput } from '@/types/lead';

export type LeadMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type LeadListResponse = {
  items: Lead[];
  meta: LeadMeta;
};

function buildQuery(filters: LeadFilters): string {
  const params = new URLSearchParams();

  if (filters.status) {
    params.set('status', filters.status);
  }

  if (filters.source) {
    params.set('source', filters.source);
  }

  if (filters.search) {
    params.set('search', filters.search);
  }

  if (filters.sort) {
    params.set('sort', filters.sort);
  }

  if (filters.page) {
    params.set('page', String(filters.page));
  }

  return params.toString();
}

export async function listLeads(filters: LeadFilters): Promise<LeadListResponse> {
  const query = buildQuery(filters);
  const response = await api.get<Lead[]>(`/leads${query ? `?${query}` : ''}`);

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to load leads');
  }

  const fallbackMeta: LeadMeta = {
    page: filters.page ?? 1,
    limit: 10,
    total: 0,
    totalPages: 0
  };

  return {
    items: response.data,
    meta: (response.meta as LeadMeta) ?? fallbackMeta
  };
}

export async function getLead(id: string): Promise<Lead> {
  const response = await api.get<Lead>(`/leads/${id}`);

  if (!response.success) {
    throw new Error(response.error.message || 'Lead not found');
  }

  return response.data;
}

export async function createLead(payload: LeadInput): Promise<Lead> {
  const response = await api.post<Lead>('/leads', payload);

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to create lead');
  }

  return response.data;
}

export async function updateLead(id: string, payload: LeadInput): Promise<Lead> {
  const response = await api.put<Lead>(`/leads/${id}`, payload);

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to update lead');
  }

  return response.data;
}

export async function deleteLead(id: string): Promise<void> {
  const response = await api.delete<void>(`/leads/${id}`);

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to delete lead');
  }
}

export async function exportLeadsCsv(filters: LeadFilters): Promise<Blob> {
  const query = buildQuery(filters);
  const token = getAuthToken();
  const headers = new Headers();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}/leads/export${query ? `?${query}` : ''}`, {
    headers
  });

  if (!response.ok) {
    throw new Error(getErrorMessage(await response.text(), 'Failed to export CSV'));
  }

  return response.blob();
}
