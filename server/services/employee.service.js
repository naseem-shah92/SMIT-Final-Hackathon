import bcrypt from 'bcryptjs';
import { memoryStore, supabase } from '../config/database.js';
import { ROLES } from '../constants/roles.js';
import { parseAndValidateEmployeeCSV } from '../utils/csvParser.js';
import { AuditService } from './audit.service.js';

export class EmployeeService {
  /**
   * Registers a new employee and provisions their login credentials.
   * HR action.
   */
  static async registerEmployee(data, currentUser) {
    const { code, name, email, department, designation, basic_salary, joining_date, phone, address } = data;

    // Check duplicate code or email
    const existingEmp = memoryStore.employees.find(
      e => e.code.toLowerCase() === code.toLowerCase() || e.email.toLowerCase() === email.toLowerCase()
    );
    if (existingEmp) {
      const err = new Error(`Employee with code '${code}' or email '${email}' already exists.`);
      err.statusCode = 409;
      throw err;
    }

    const employeeId = `emp-${Date.now()}`;
    const basic = Number(basic_salary) || 0;
    const gross = Math.round(basic * 1.5); // Gross = 1.5 * basic

    const newEmployee = {
      id: employeeId,
      code,
      name,
      email: email.toLowerCase().trim(),
      department,
      designation,
      basic_salary: basic,
      gross_salary: gross,
      joining_date,
      status: 'active',
      phone: phone || '',
      address: address || '',
      created_at: new Date().toISOString()
    };

    memoryStore.employees.push(newEmployee);

    // Provision user login with temporary password (emp123)
    const tempPassword = 'emp123';
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = {
      id: `user-${employeeId}`,
      name,
      email: newEmployee.email,
      password: hashedPassword,
      role: ROLES.EMPLOYEE,
      employee_id: employeeId,
      must_change_password: true,
      status: 'active',
      created_at: new Date().toISOString()
    };

    memoryStore.users.push(newUser);

    if (supabase) {
      try {
        await supabase.from('employees').insert([newEmployee]);
      } catch (err) {
        console.warn('[EmployeeService] Supabase employee sync warning:', err.message);
      }
    }

    await AuditService.log({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'REGISTER_EMPLOYEE',
      entityType: 'EMPLOYEE',
      entityId: employeeId,
      afterState: newEmployee
    });

    return {
      employee: newEmployee,
      provisionalLogin: {
        email: newEmployee.email,
        temporaryPassword: tempPassword,
        mustChangePassword: true
      }
    };
  }

  /**
   * Retrieves list of employees with server-side search, filtering, and pagination.
   */
  static async getEmployees({ search = '', department = '', status = '', page = 1, limit = 20, sort = 'name' } = {}) {
    let result = [...memoryStore.employees];

    if (search) {
      const term = search.toLowerCase().trim();
      result = result.filter(
        e =>
          e.name.toLowerCase().includes(term) ||
          e.email.toLowerCase().includes(term) ||
          e.code.toLowerCase().includes(term) ||
          e.designation.toLowerCase().includes(term)
      );
    }

    if (department && department !== 'all') {
      result = result.filter(e => e.department.toLowerCase() === department.toLowerCase());
    }

    if (status && status !== 'all') {
      result = result.filter(e => e.status.toLowerCase() === status.toLowerCase());
    }

    // Sort
    result.sort((a, b) => (a[sort] || '').toString().localeCompare((b[sort] || '').toString()));

    const total = result.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginated = result.slice(startIndex, startIndex + Number(limit));

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
      employees: paginated
    };
  }

  /**
   * Employee 360 Profile: Combines personal details, attendance stats, leave balances, and payslips
   */
  static async getEmployee360(employeeId) {
    const employee = memoryStore.employees.find(e => e.id === employeeId || e.code === employeeId);
    if (!employee) {
      const err = new Error('Employee not found');
      err.statusCode = 404;
      throw err;
    }

    // Related data aggregations
    const attendances = memoryStore.attendance.filter(a => a.employee_id === employee.id);
    const leaves = memoryStore.leave_requests.filter(l => l.employee_id === employee.id);
    const payslips = memoryStore.payroll_records.filter(p => p.employee_id === employee.id);

    return {
      profile: employee,
      salary_structure: {
        basic: employee.basic_salary,
        hra: Math.round(employee.basic_salary * 0.40),
        medical: Math.round(employee.basic_salary * 0.10),
        gross: employee.gross_salary
      },
      summary: {
        total_attendance_records: attendances.length,
        leaves_taken: leaves.filter(l => l.status === 'approved').reduce((acc, curr) => acc + (curr.working_days || 1), 0),
        total_payslips: payslips.length
      },
      recent_attendance: attendances.slice(-10),
      leave_history: leaves.slice(-5),
      recent_payslips: payslips.slice(-6)
    };
  }

  /**
   * Self-service update: Employee updates only phone and address
   */
  static async updateSelf(employeeId, { phone, address }, currentUser) {
    const employee = memoryStore.employees.find(e => e.id === employeeId);
    if (!employee) {
      const err = new Error('Employee record not found');
      err.statusCode = 404;
      throw err;
    }

    const beforeState = { phone: employee.phone, address: employee.address };
    if (phone !== undefined) employee.phone = phone;
    if (address !== undefined) employee.address = address;

    await AuditService.log({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'UPDATE_EMPLOYEE_SELF',
      entityType: 'EMPLOYEE',
      entityId: employeeId,
      beforeState,
      afterState: { phone: employee.phone, address: employee.address }
    });

    return employee;
  }

  /**
   * Dry-run CSV validation
   */
  static async dryRunCSV(csvText) {
    return parseAndValidateEmployeeCSV(csvText, memoryStore.employees, memoryStore.departments);
  }

  /**
   * Commits valid CSV rows to database
   */
  static async importFromCSV(validRows, currentUser) {
    const importedEmployees = [];

    for (const row of validRows) {
      try {
        const created = await this.registerEmployee(row, currentUser);
        importedEmployees.push(created.employee);
      } catch (err) {
        console.warn(`[CSV Import] Skipped row for ${row.email}:`, err.message);
      }
    }

    return {
      importedCount: importedEmployees.length,
      employees: importedEmployees
    };
  }

  /**
   * Generates CSV string for export
   */
  static async exportToCSV() {
    const headers = ['code', 'name', 'email', 'department', 'designation', 'basic_salary', 'gross_salary', 'joining_date', 'status', 'phone', 'address'];
    const rows = memoryStore.employees.map(e =>
      [
        e.code,
        `"${e.name}"`,
        e.email,
        `"${e.department}"`,
        `"${e.designation}"`,
        e.basic_salary,
        e.gross_salary,
        e.joining_date,
        e.status,
        `"${e.phone || ''}"`,
        `"${e.address || ''}"`
      ].join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  }
}
