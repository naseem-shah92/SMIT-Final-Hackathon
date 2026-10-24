import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/rbac.middleware.js';
import { scopeGuard } from '../middlewares/scope.middleware.js';
import { validateCorrectionDecision, validateCorrectionRequest } from '../validators/attendance.validator.js';

const router = Router();

// Mark check-in (stamped by server, 1 record per employee per day, second check-in = 409)
router.post('/check-in', authenticate, AttendanceController.checkIn);

// Mark check-out (stamped by server, duration < 5h = half_day)
router.post('/check-out', authenticate, AttendanceController.checkOut);

// Attendance records list / daily board
router.get('/', authenticate, scopeGuard, AttendanceController.getAttendance);

// Attendance corrections
router.get('/corrections', authenticate, scopeGuard, AttendanceController.getCorrections);
router.post('/corrections', authenticate, authorize('employee'), validateCorrectionRequest, AttendanceController.requestCorrection);
router.patch('/corrections/:id', authenticate, authorize('hr', 'admin'), validateCorrectionDecision, AttendanceController.decideCorrection);

export default router;
