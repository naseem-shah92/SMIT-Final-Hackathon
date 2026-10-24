import { Router } from 'express';
import aiRoutes from './ai.routes.js';
import analyticsRoutes from './analytics.routes.js';
import attendanceRoutes from './attendance.routes.js';
import auditRoutes from './audit.routes.js';
import authRoutes from './auth.routes.js';
import commsRoutes from './comms.routes.js';
import employeeRoutes from './employee.routes.js';
import leaveRoutes from './leave.routes.js';
import payrollRoutes from './payroll.routes.js';
import setupRoutes from './setup.routes.js';

const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    system: 'Saylani HCM Lite Enterprise Backend API',
    modules: ['M1-Auth', 'M2-Setup', 'M3-Employees', 'M4-Attendance', 'M5-Leave', 'M6-Payroll', 'M7-Analytics', 'M8-AI', 'M9-Audit']
  });
});

// Mount modular sub-routers
apiRouter.use('/auth', authRoutes);
apiRouter.use('/setup', setupRoutes);
apiRouter.use('/employees', employeeRoutes);
apiRouter.use('/attendance', attendanceRoutes);
apiRouter.use('/leave', leaveRoutes);
apiRouter.use('/payroll', payrollRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/comms', commsRoutes);
apiRouter.use('/audit', auditRoutes);
apiRouter.use('/ai', aiRoutes);

export default apiRouter;
