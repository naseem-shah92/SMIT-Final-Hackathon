import { Router } from 'express';
import { CommsController } from '../controllers/comms.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/rbac.middleware.js';

const router = Router();

// Announcements
router.get('/announcements', authenticate, CommsController.getAnnouncements);
router.post('/announcements', authenticate, authorize('admin', 'hr'), CommsController.postAnnouncement);

// In-app Notifications
router.get('/notifications', authenticate, CommsController.getNotifications);
router.patch('/notifications/:id/read', authenticate, CommsController.markNotificationRead);

export default router;
