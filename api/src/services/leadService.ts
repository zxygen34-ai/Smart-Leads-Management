import { FilterQuery, SortOrder } from 'mongoose';

import { ApiError } from '../middleware/errorHandler';
import { Lead, LeadDocument, LeadSource, LeadStatus } from '../models/Lead';

export type LeadInput = {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
};

export type LeadResponse = {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  updatedAt: Date;
};

export type LeadQuery = {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: 'latest' | 'oldest';
  page?: number;
};

const PAGE_LIMIT = 10;

function toLeadResponse(lead: LeadDocument): LeadResponse {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    status: lead.status,
    source: lead.source,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt
  };
}

function buildFilters(query: LeadQuery): FilterQuery<LeadDocument> {
  const filters: FilterQuery<LeadDocument> = {};

  if (query.status) {
    filters.status = query.status;
  }

  if (query.source) {
    filters.source = query.source;
  }

  if (query.search) {
    const search = query.search.trim();
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  return filters;
}

function buildSort(sort?: LeadQuery['sort']): Record<string, SortOrder> {
  return { createdAt: sort === 'oldest' ? 1 : -1 };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function ensureEmailUnique(email: string, excludeId?: string): Promise<void> {
  const query: FilterQuery<LeadDocument> = { email };

  if (excludeId) {
    query._id = { $ne: excludeId } as FilterQuery<LeadDocument>['_id'];
  }

  const existing = await Lead.exists(query);

  if (existing) {
    throw new ApiError('Lead email already exists', 409, 'DUPLICATE_EMAIL');
  }
}

function isDuplicateKeyError(error: unknown): boolean {
  return Boolean((error as { code?: number })?.code === 11000);
}

export async function listLeads(query: LeadQuery): Promise<{
  items: LeadResponse[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> {
  const filters = buildFilters(query);
  const page = query.page ?? 1;
  const skip = (page - 1) * PAGE_LIMIT;
  const sort = buildSort(query.sort);

  const [items, total] = await Promise.all([
    Lead.find(filters).sort(sort).skip(skip).limit(PAGE_LIMIT),
    Lead.countDocuments(filters)
  ]);

  const totalPages = Math.ceil(total / PAGE_LIMIT);

  return {
    items: items.map(toLeadResponse),
    meta: { page, limit: PAGE_LIMIT, total, totalPages }
  };
}

export async function exportLeads(query: LeadQuery): Promise<LeadResponse[]> {
  const filters = buildFilters(query);
  const sort = buildSort(query.sort);

  const items = await Lead.find(filters).sort(sort);

  return items.map(toLeadResponse);
}

export async function getLeadById(id: string): Promise<LeadResponse> {
  const lead = await Lead.findById(id);

  if (!lead) {
    throw new ApiError('Lead not found', 404, 'LEAD_NOT_FOUND');
  }

  return toLeadResponse(lead);
}

export async function createLead(input: LeadInput): Promise<LeadResponse> {
  const email = normalizeEmail(input.email);
  await ensureEmailUnique(email);

  try {
    const lead = await Lead.create({ ...input, email });
    return toLeadResponse(lead);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new ApiError('Lead email already exists', 409, 'DUPLICATE_EMAIL');
    }

    throw error;
  }
}

export async function updateLead(
  id: string,
  input: Partial<LeadInput>
): Promise<LeadResponse> {
  if (input.email) {
    const email = normalizeEmail(input.email);
    await ensureEmailUnique(email, id);
    input.email = email;
  }

  try {
    const lead = await Lead.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true
    });

    if (!lead) {
      throw new ApiError('Lead not found', 404, 'LEAD_NOT_FOUND');
    }

    return toLeadResponse(lead);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new ApiError('Lead email already exists', 409, 'DUPLICATE_EMAIL');
    }

    throw error;
  }
}

export async function deleteLead(id: string): Promise<void> {
  const lead = await Lead.findByIdAndDelete(id);

  if (!lead) {
    throw new ApiError('Lead not found', 404, 'LEAD_NOT_FOUND');
  }
}
