import { Router } from 'express';
import multer from 'multer';
import { EmployeeController } from '../controllers/employee.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/rbac.middleware.js';
import { scopeGuard } from '../middlewares/scope.middleware.js';
import { validateEmployeeCreate, validateEmployeeSelfUpdate } from '../validators/employee.validator.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const router = Router();

// Employee directory with search, filter, and pagination
router.get('/', authenticate, scopeGuard, EmployeeController.getEmployees);

// Register employee (creates login): HR manages, Admin views
router.post('/', authenticate, authorize('admin', 'hr'), validateEmployeeCreate, EmployeeController.register);

// Employee 360 Profile: Admin/HR all, Employee own
router.get('/:id/360', authenticate, scopeGuard, EmployeeController.getEmployee360);

// Self-update: Employee edits phone and address only
router.patch('/me', authenticate, authorize('employee'), validateEmployeeSelfUpdate, EmployeeController.updateSelf);

// CSV Bulk Onboarding: Dry-run validation and Commit
router.post('/csv/dry-run', authenticate, authorize('hr', 'admin'), upload.single('file'), EmployeeController.dryRunCSV);
router.post('/csv/import', authenticate, authorize('hr', 'admin'), EmployeeController.importCSV);
router.get('/csv/export', authenticate, authorize('hr', 'admin'), EmployeeController.exportCSV);

export default router;
