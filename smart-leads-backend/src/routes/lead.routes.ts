import { Router } from 'express';
import { createLead, getLeads, getLead, updateLead, deleteLead } from '../controllers/lead.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Protect all routes in this file
router.use(protect);

// Standard Routes
router.route('/')
  .post(createLead)
  .get(getLeads);

router.route('/:id')
  .get(getLead)
  .put(updateLead)
  .delete(authorize('Admin'), deleteLead); // ONLY Admins can delete leads!

export default router;