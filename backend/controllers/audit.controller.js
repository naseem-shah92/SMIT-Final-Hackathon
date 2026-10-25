import { AuditService } from '../services/audit.service.js';

export class AuditController {
  static async getLogs(req, res, next) {
    try {
      const result = await AuditService.getLogs(req.query);
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}
