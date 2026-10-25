import { memoryStore, supabase } from '../config/database.js';
import { calculateEmployeeSalary } from '../utils/payrollCalculator.js';
import { getWorkingDaysInMonth } from '../utils/workingDays.js';
import { AuditService } from './audit.service.js';

export class PayrollService {
  /**
   * Generates or previews a monthly payroll draft.
   * HR action.
   */
  static async createDraft({ month, year }, currentUser) {
    const m = Number(month);
    const y = Number(year);
    const monthKey = `${y}-${String(m).padStart(2, '0')}`;

    // Check if finalized run already exists
    const existingRun = memoryStore.payroll_runs.find(r => r.month_key === monthKey);
    if (existingRun && existingRun.status === 'finalized') {
      const err = new Error(`Payroll for ${monthKey} has already been finalized and locked by Admin. It cannot be edited.`);
      err.statusCode = 409;
      throw err;
    }

    const activeEmployees = memoryStore.employees.filter(e => e.status === 'active');
    const holidays = memoryStore.holidays;
    const workingDays = getWorkingDaysInMonth(y, m, holidays);

    const records = [];
    let totalGross = 0;
    let totalDeductions = 0;
    let totalTax = 0;
    let totalNet = 0;

    for (const emp of activeEmployees) {
      // 1. Calculate attendance deductions in month
      const empAttendance = memoryStore.attendance.filter(a => {
        if (a.employee_id !== emp.id) return false;
        const [attY, attM] = a.date.split('-').map(Number);
        return attY === y && attM === m;
      });

      const halfDays = empAttendance.filter(a => a.status === 'half_day').length;

      // Unpaid leaves
      const empLeaves = memoryStore.leave_requests.filter(l => {
        if (l.employee_id !== emp.id || l.status !== 'approved' || l.leave_type !== 'unpaid') return false;
        const [lY, lM] = l.start_date.split('-').map(Number);
        return lY === y && lM === m;
      });
      const unpaidLeaveDays = empLeaves.reduce((sum, l) => sum + (l.working_days || 0), 0);

      // Absent days: expected working days minus recorded attendance minus approved leave
      const presentOrLate = empAttendance.filter(a => ['present', 'late', 'half_day'].includes(a.status)).length;
      const allApprovedLeaves = memoryStore.leave_requests.filter(l => {
        if (l.employee_id !== emp.id || l.status !== 'approved') return false;
        const [lY, lM] = l.start_date.split('-').map(Number);
        return lY === y && lM === m;
      }).reduce((sum, l) => sum + (l.working_days || 0), 0);

      const absentDays = Math.max(0, workingDays - presentOrLate - allApprovedLeaves);

      // Run salary calculation formula
      const breakdown = calculateEmployeeSalary({
        basicSalary: emp.basic_salary,
        year: y,
        month: m,
        absentDays,
        unpaidLeaveDays,
        halfDays,
        joiningDate: emp.joining_date,
        holidays
      });

      const record = {
        id: `pr-${Date.now()}-${emp.id}`,
        payroll_run_id: existingRun ? existingRun.id : `run-${Date.now()}`,
        employee_id: emp.id,
        employee_code: emp.code,
        employee_name: emp.name,
        department: emp.department,
        designation: emp.designation,
        month: m,
        year: y,
        month_key: monthKey,
        basic_salary: breakdown.basicSalary,
        hra: breakdown.allowances.hra,
        medical: breakdown.allowances.medical,
        gross_salary: breakdown.grossSalary,
        working_days: breakdown.workingDays,
        absent_days: breakdown.deductions.absentDays,
        half_days: breakdown.deductions.halfDays,
        unpaid_days: breakdown.deductions.unpaidLeaveDays,
        attendance_deductions: breakdown.deductions.attendanceDeduction,
        income_tax: breakdown.tax.monthlyTax,
        net_salary: breakdown.netPay,
        effective_tax_rate: breakdown.tax.effectiveRate,
        created_at: new Date().toISOString()
      };

      records.push(record);
      totalGross += record.gross_salary;
      totalDeductions += record.attendance_deductions;
      totalTax += record.income_tax;
      totalNet += record.net_salary;
    }

    const runId = existingRun ? existingRun.id : `run-${Date.now()}`;
    const draftRun = {
      id: runId,
      month_key: monthKey,
      month: m,
      year: y,
      total_employees: activeEmployees.length,
      total_gross: totalGross,
      total_deductions: totalDeductions,
      total_tax: totalTax,
      total_net: totalNet,
      status: 'draft',
      prepared_by: currentUser.name,
      prepared_at: new Date().toISOString()
    };

    // Update in-memory
    const runIdx = memoryStore.payroll_runs.findIndex(r => r.month_key === monthKey);
    if (runIdx >= 0) {
      memoryStore.payroll_runs[runIdx] = draftRun;
    } else {
      memoryStore.payroll_runs.push(draftRun);
    }

    // Replace records for this run
    memoryStore.payroll_records = memoryStore.payroll_records.filter(r => r.month_key !== monthKey);
    memoryStore.payroll_records.push(...records);

    await AuditService.log({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'CREATE_PAYROLL_DRAFT',
      entityType: 'PAYROLL_RUN',
      entityId: draftRun.id,
      afterState: draftRun
    });

    return {
      run: draftRun,
      records
    };
  }

  /**
   * Finalizes and locks payroll (Admin only action)
   */
  static async finalizePayroll(runId, adminUser) {
    const run = memoryStore.payroll_runs.find(r => r.id === runId);
    if (!run) {
      const err = new Error('Payroll run not found');
      err.statusCode = 404;
      throw err;
    }

    if (run.status === 'finalized') {
      const err = new Error('This payroll run is already finalized and locked');
      err.statusCode = 400;
      throw err;
    }

    run.status = 'finalized';
    run.finalized_by = adminUser.name;
    run.finalized_at = new Date().toISOString();

    if (supabase) {
      try {
        await supabase.from('payroll_runs').upsert([run]);
      } catch (err) {
        console.warn('[PayrollService] Supabase run sync warning:', err.message);
      }
    }

    await AuditService.log({
      actorId: adminUser.id,
      actorName: adminUser.name,
      actorRole: adminUser.role,
      action: 'FINALIZE_PAYROLL',
      entityType: 'PAYROLL_RUN',
      entityId: run.id,
      afterState: run
    });

    return run;
  }

  /**
   * Retrieves all payroll runs
   */
  static async getRuns() {
    return memoryStore.payroll_runs.sort((a, b) => b.month_key.localeCompare(a.month_key));
  }

  /**
   * Retrieves payslip for an employee
   */
  static async getPayslip(recordId, currentUser) {
    const record = memoryStore.payroll_records.find(
      r => r.id === recordId || (r.employee_id === recordId && r.month_key)
    );

    if (!record) {
      const err = new Error('Payslip record not found');
      err.statusCode = 404;
      throw err;
    }

    // Role check: Employee can only view their own payslip
    if (currentUser.role === 'employee' && record.employee_id !== currentUser.employee_id) {
      const err = new Error('Forbidden: Employees cannot view payslips of other team members');
      err.statusCode = 403;
      throw err;
    }

    return record;
  }

  /**
   * Retrieves all payslips for an employee
   */
  static async getEmployeePayslips(employeeId) {
    return memoryStore.payroll_records
      .filter(r => r.employee_id === employeeId)
      .sort((a, b) => b.month_key.localeCompare(a.month_key));
  }
}
