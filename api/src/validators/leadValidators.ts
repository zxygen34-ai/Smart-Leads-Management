import { z } from 'zod';

export const leadStatusEnum = z.enum(['New', 'Contacted', 'Qualified', 'Lost']);
export const leadSourceEnum = z.enum(['Website', 'Instagram', 'Referral']);

const leadIdParams = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id')
});

const leadBodySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  status: leadStatusEnum,
  source: leadSourceEnum
});

const updateLeadBodySchema = leadBodySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required'
  });

const listQuerySchema = z.object({
  status: leadStatusEnum.optional(),
  source: leadSourceEnum.optional(),
  search: z.string().trim().min(1).optional(),
  sort: z.enum(['latest', 'oldest']).optional(),
  page: z.coerce.number().int().min(1).optional()
});

export const createLeadSchema = z.object({ body: leadBodySchema });
export const updateLeadSchema = z.object({ params: leadIdParams, body: updateLeadBodySchema });
export const leadIdSchema = z.object({ params: leadIdParams });
export const listLeadsSchema = z.object({ query: listQuerySchema });
