import { PayrollService } from '../services/payroll.service.js';

export class PayrollController {
  static async createDraft(req, res, next) {
    try {
      const result = await PayrollService.createDraft(req.body, req.user);
      return res.status(201).json({
        success: true,
        message: `Payroll draft calculated for ${result.run.month_key}`,
        ...result
      });
    } catch (err) {
      next(err);
    }
  }

  static async finalize(req, res, next) {
    try {
      const { id } = req.params;
      const finalized = await PayrollService.finalizePayroll(id, req.user);
      return res.status(200).json({
        success: true,
        message: 'Payroll locked and finalized. Disbursements registered.',
        run: finalized
      });
    } catch (err) {
      next(err);
    }
  }

  static async getRuns(req, res, next) {
    try {
      const runs = await PayrollService.getRuns();
      return res.status(200).json({ success: true, runs });
    } catch (err) {
      next(err);
    }
  }

  static async getPayslip(req, res, next) {
    try {
      const { id } = req.params;
      const payslip = await PayrollService.getPayslip(id, req.user);
      return res.status(200).json({ success: true, payslip });
    } catch (err) {
      next(err);
    }
  }

  static async getMyPayslips(req, res, next) {
    try {
      const employeeId = req.user.employee_id;
      const payslips = await PayrollService.getEmployeePayslips(employeeId);
      return res.status(200).json({ success: true, payslips });
    } catch (err) {
      next(err);
    }
  }
}
