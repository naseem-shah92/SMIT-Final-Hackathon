import { Router } from 'express';
import { PayrollController } from '../controllers/payroll.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/rbac.middleware.js';
import { scopeGuard } from '../middlewares/scope.middleware.js';
import { validatePayrollDraft } from '../validators/payroll.validator.js';

const router = Router();

// Draft calculation: HR prepares draft
router.post('/draft', authenticate, authorize('hr', 'admin'), validatePayrollDraft, PayrollController.createDraft);

// Finalize: Admin only locks the month
router.post('/:id/finalize', authenticate, authorize('admin'), PayrollController.finalize);

// List payroll runs
router.get('/runs', authenticate, authorize('admin', 'hr'), PayrollController.getRuns);

// Payslip retrieval: Admin/HR all, Employee own
router.get('/payslips/:id', authenticate, scopeGuard, PayrollController.getPayslip);

// Employee own payslips
router.get('/my-payslips', authenticate, authorize('employee'), PayrollController.getMyPayslips);

export default router;
