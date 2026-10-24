import { AttendanceService } from '../services/attendance.service.js';

export class AttendanceController {
  static async checkIn(req, res, next) {
    try {
      const employeeId = req.user.employee_id || req.body.employee_id;
      const result = await AttendanceService.checkIn(employeeId, req.body, req.user);
      return res.status(201).json({
        success: true,
        message: `Check-in recorded at ${result.check_in} (Status: ${result.status})`,
        attendance: result
      });
    } catch (err) {
      next(err);
    }
  }

  static async checkOut(req, res, next) {
    try {
      const employeeId = req.user.employee_id || req.body.employee_id;
      const result = await AttendanceService.checkOut(employeeId, req.user);
      return res.status(200).json({
        success: true,
        message: `Check-out recorded at ${result.check_out} (Duration: ${result.work_hours}h, Status: ${result.status})`,
        attendance: result
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAttendance(req, res, next) {
    try {
      // Scoping: If role is employee, enforce self filter
      let employeeId = req.query.employeeId;
      if (req.user.role === 'employee') {
        employeeId = req.user.employee_id;
      }

      const result = await AttendanceService.getAttendance({
        ...req.query,
        employeeId
      });
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async requestCorrection(req, res, next) {
    try {
      const employeeId = req.user.employee_id;
      const correction = await AttendanceService.requestCorrection({
        ...req.body,
        employeeId
      }, req.user);
      return res.status(201).json({
        success: true,
        message: 'Attendance correction submitted for HR approval',
        correction
      });
    } catch (err) {
      next(err);
    }
  }

  static async decideCorrection(req, res, next) {
    try {
      const { id } = req.params;
      const result = await AttendanceService.decideCorrection(id, req.body, req.user);
      return res.status(200).json({
        success: true,
        message: `Correction request has been ${result.status}`,
        correction: result
      });
    } catch (err) {
      next(err);
    }
  }

  static async getCorrections(req, res, next) {
    try {
      let employeeId = req.query.employeeId;
      if (req.user.role === 'employee') {
        employeeId = req.user.employee_id;
      }
      const corrections = await AttendanceService.getCorrections({
        employeeId,
        status: req.query.status
      });
      return res.status(200).json({ success: true, corrections });
    } catch (err) {
      next(err);
    }
  }
}
