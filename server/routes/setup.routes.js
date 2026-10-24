import { Router } from 'express';
import { SetupController } from '../controllers/setup.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/rbac.middleware.js';
import { validateOrgSettings } from '../validators/setup.validator.js';

const router = Router();

// Settings: Admin manages, HR views, Employee has no access
router.get('/settings', authenticate, authorize('admin', 'hr'), SetupController.getSettings);
router.patch('/settings', authenticate, authorize('admin'), validateOrgSettings, SetupController.updateSettings);

// Departments
router.get('/departments', authenticate, authorize('admin', 'hr'), SetupController.getDepartments);
router.post('/departments', authenticate, authorize('admin'), SetupController.createDepartment);

// Designations
router.get('/designations', authenticate, authorize('admin', 'hr'), SetupController.getDesignations);
router.post('/designations', authenticate, authorize('admin'), SetupController.createDesignation);

// Public Holidays
router.get('/holidays', authenticate, authorize('admin', 'hr'), SetupController.getHolidays);
router.post('/holidays', authenticate, authorize('admin'), SetupController.createHoliday);

export default router;
