import { Router } from 'express';
import { LeaveController } from '../controllers/leave.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/rbac.middleware.js';
import { scopeGuard } from '../middlewares/scope.middleware.js';
import { validateLeaveApply, validateLeaveDecision } from '../validators/leave.validator.js';

const router = Router();

// Apply for leave (enforces working days only, overlap = 422, over-balance = 422)
router.post('/apply', authenticate, validateLeaveApply, LeaveController.apply);

// Cancel own pending leave
router.post('/:id/cancel', authenticate, LeaveController.cancel);

// HR Approve or reject leave with comment
router.patch('/:id/decision', authenticate, authorize('hr', 'admin'), validateLeaveDecision, LeaveController.decide);

// Get leave balances
router.get('/balance', authenticate, scopeGuard, LeaveController.getBalance);

// Get leave requests list
router.get('/', authenticate, scopeGuard, LeaveController.getRequests);

export default router;
