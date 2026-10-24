import { SetupService } from '../services/setup.service.js';

export class SetupController {
  static async getSettings(req, res, next) {
    try {
      const settings = await SetupService.getSettings();
      return res.status(200).json({ success: true, settings });
    } catch (err) {
      next(err);
    }
  }

  static async updateSettings(req, res, next) {
    try {
      const updated = await SetupService.updateSettings(req.body, req.user);
      return res.status(200).json({
        success: true,
        message: 'Organization settings updated',
        settings: updated
      });
    } catch (err) {
      next(err);
    }
  }

  static async getDepartments(req, res, next) {
    try {
      const departments = await SetupService.getDepartments();
      return res.status(200).json({ success: true, departments });
    } catch (err) {
      next(err);
    }
  }

  static async createDepartment(req, res, next) {
    try {
      const dept = await SetupService.createDepartment(req.body, req.user);
      return res.status(201).json({ success: true, department: dept });
    } catch (err) {
      next(err);
    }
  }

  static async getDesignations(req, res, next) {
    try {
      const { department_id } = req.query;
      const designations = await SetupService.getDesignations(department_id);
      return res.status(200).json({ success: true, designations });
    } catch (err) {
      next(err);
    }
  }

  static async createDesignation(req, res, next) {
    try {
      const desig = await SetupService.createDesignation(req.body, req.user);
      return res.status(201).json({ success: true, designation: desig });
    } catch (err) {
      next(err);
    }
  }

  static async getHolidays(req, res, next) {
    try {
      const holidays = await SetupService.getHolidays();
      return res.status(200).json({ success: true, holidays });
    } catch (err) {
      next(err);
    }
  }

  static async createHoliday(req, res, next) {
    try {
      const holiday = await SetupService.createHoliday(req.body, req.user);
      return res.status(201).json({ success: true, holiday });
    } catch (err) {
      next(err);
    }
  }
}
