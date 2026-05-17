import { Router } from 'express';

import {
  createLead,
  deleteLead,
  exportLeads,
  getLead,
  listLeads,
  updateLead
} from '../controllers/leadController';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import {
  createLeadSchema,
  leadIdSchema,
  listLeadsSchema,
  updateLeadSchema
} from '../validators/leadValidators';

const router = Router();

router.use(requireAuth);

router.get('/', validateRequest(listLeadsSchema), listLeads);
router.get('/export', requireRole(['admin']), validateRequest(listLeadsSchema), exportLeads);
router.get('/:id', validateRequest(leadIdSchema), getLead);
router.post('/', requireRole(['admin', 'sales']), validateRequest(createLeadSchema), createLead);
router.put(
  '/:id',
  requireRole(['admin', 'sales']),
  validateRequest(updateLeadSchema),
  updateLead
);
router.delete('/:id', requireRole(['admin']), validateRequest(leadIdSchema), deleteLead);

export default router;
