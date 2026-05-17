import { Request, Response } from 'express';

import { ok } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { escapeCsv } from '../utils/csv';
import {
  LeadQuery,
  createLead as createLeadService,
  deleteLead as deleteLeadService,
  exportLeads as exportLeadsService,
  getLeadById as getLeadByIdService,
  listLeads as listLeadsService,
  updateLead as updateLeadService
} from '../services/leadService';

export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await createLeadService(req.body);
  res.status(201).json(ok(lead));
});

export const listLeads = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as LeadQuery;
  const { items, meta } = await listLeadsService(query);
  res.status(200).json(ok(items, meta));
});

export const getLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await getLeadByIdService(req.params.id);
  res.status(200).json(ok(lead));
});

export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await updateLeadService(req.params.id, req.body);
  res.status(200).json(ok(lead));
});

export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  await deleteLeadService(req.params.id);
  res.status(204).send();
});

export const exportLeads = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as LeadQuery;
  const leads = await exportLeadsService(query);

  const header = ['Name', 'Email', 'Status', 'Source', 'CreatedAt'];
  const rows = leads.map((lead) => [
    lead.name,
    lead.email,
    lead.status,
    lead.source,
    lead.createdAt
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(escapeCsv).join(','))
    .join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  res.status(200).send(csv);
});
