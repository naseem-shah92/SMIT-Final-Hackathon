import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/rbac.middleware.js';

const router = Router();

// Admin Company-Level KPIs & Distributions
router.get('/admin', authenticate, authorize('admin'), AnalyticsController.getAdminAnalytics);

// HR People Operations KPIs & Daily Telemetry
router.get('/hr', authenticate, authorize('hr', 'admin'), AnalyticsController.getHRAnalytics);

// Employee Self-Service Telemetry
router.get('/employee', authenticate, authorize('employee'), AnalyticsController.getEmployeeAnalytics);

export default router;
