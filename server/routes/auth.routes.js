import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/rbac.middleware.js';
import { validateChangePassword, validateCreateHR, validateLogin } from '../validators/auth.validator.js';

const router = Router();

// Public login
router.post('/login', validateLogin, AuthController.login);

// Authenticated session check
router.get('/me', authenticate, AuthController.getMe);

// Self password change (Employees & HR on first sign-in)
router.post('/change-password', authenticate, validateChangePassword, AuthController.changePassword);

// Admin-only user management
router.post('/create-hr', authenticate, authorize('admin'), validateCreateHR, AuthController.createHR);
router.patch('/users/:userId/status', authenticate, authorize('admin'), AuthController.toggleStatus);

export default router;
