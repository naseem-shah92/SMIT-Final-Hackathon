import { EmployeeService } from '../services/employee.service.js';

export class EmployeeController {
  static async register(req, res, next) {
    try {
      const result = await EmployeeService.registerEmployee(req.body, req.user);
      return res.status(201).json({
        success: true,
        message: 'Employee registered and provisional login created',
        ...result
      });
    } catch (err) {
      next(err);
    }
  }

  static async getEmployees(req, res, next) {
    try {
      const result = await EmployeeService.getEmployees(req.query);
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async getEmployee360(req, res, next) {
    try {
      const { id } = req.params;
      const result = await EmployeeService.getEmployee360(id);
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async updateSelf(req, res, next) {
    try {
      const employeeId = req.user.employee_id;
      const updated = await EmployeeService.updateSelf(employeeId, req.body, req.user);
      return res.status(200).json({
        success: true,
        message: 'Contact profile updated successfully',
        employee: updated
      });
    } catch (err) {
      next(err);
    }
  }

  static async dryRunCSV(req, res, next) {
    try {
      const csvText = req.body.csv || (req.file ? req.file.buffer.toString('utf-8') : '');
      const report = await EmployeeService.dryRunCSV(csvText);
      return res.status(200).json({ success: true, report });
    } catch (err) {
      next(err);
    }
  }

  static async importCSV(req, res, next) {
    try {
      const { validRows } = req.body;
      if (!Array.isArray(validRows) || validRows.length === 0) {
        return res.status(400).json({ success: false, error: 'validRows array is required' });
      }
      const result = await EmployeeService.importFromCSV(validRows, req.user);
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async exportCSV(req, res, next) {
    try {
      const csvContent = await EmployeeService.exportToCSV();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="saylani_workforce_directory.csv"');
      return res.status(200).send(csvContent);
    } catch (err) {
      next(err);
    }
  }
}
