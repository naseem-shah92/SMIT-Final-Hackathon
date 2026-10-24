import { LeaveService } from '../services/leave.service.js';

export class LeaveController {
  static async apply(req, res, next) {
    try {
      const result = await LeaveService.applyLeave(req.body, req.user);
      return res.status(201).json({
        success: true,
        message: 'Leave request submitted successfully',
        leave: result
      });
    } catch (err) {
      next(err);
    }
  }

  static async cancel(req, res, next) {
    try {
      const { id } = req.params;
      const result = await LeaveService.cancelLeave(id, req.user);
      return res.status(200).json({
        success: true,
        message: 'Leave request cancelled',
        leave: result
      });
    } catch (err) {
      next(err);
    }
  }

  static async decide(req, res, next) {
    try {
      const { id } = req.params;
      const result = await LeaveService.decideLeave(id, req.body, req.user);
      return res.status(200).json({
        success: true,
        message: `Leave request has been ${result.status}`,
        leave: result
      });
    } catch (err) {
      next(err);
    }
  }

  static async getBalance(req, res, next) {
    try {
      let employeeId = req.query.employeeId || req.user.employee_id;
      if (req.user.role === 'employee') {
        employeeId = req.user.employee_id;
      }
      const balances = await LeaveService.getLeaveBalance(employeeId);
      return res.status(200).json({ success: true, balances });
    } catch (err) {
      next(err);
    }
  }

  static async getRequests(req, res, next) {
    try {
      let employeeId = req.query.employeeId;
      if (req.user.role === 'employee') {
        employeeId = req.user.employee_id;
      }
      const result = await LeaveService.getLeaveRequests({
        ...req.query,
        employeeId
      });
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}
