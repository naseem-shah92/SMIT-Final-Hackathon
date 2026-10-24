import { AnalyticsService } from '../services/analytics.service.js';

export class AnalyticsController {
  static async getAdminAnalytics(req, res, next) {
    try {
      const data = await AnalyticsService.getAdminAnalytics(req.query);
      return res.status(200).json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  }

  static async getHRAnalytics(req, res, next) {
    try {
      const data = await AnalyticsService.getHRAnalytics(req.query);
      return res.status(200).json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  }

  static async getEmployeeAnalytics(req, res, next) {
    try {
      const employeeId = req.user.employee_id;
      const data = await AnalyticsService.getEmployeeAnalytics(employeeId);
      return res.status(200).json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  }
}
