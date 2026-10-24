import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/rbac.middleware.js';

const router = Router();

// Immutable Audit Log: Admin only
router.get('/', authenticate, authorize('admin'), AuditController.getLogs);

export default router;
