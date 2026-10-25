import { memoryStore, supabase } from '../config/database.js';
import { DEFAULT_LEAVE_QUOTAS } from '../constants/leaveQuotas.js';
import { calculateWorkingDays } from '../utils/workingDays.js';
import { AuditService } from './audit.service.js';

export class LeaveService {
  /**
   * Calculates used leave days and remaining balances for an employee
   */
  static async getLeaveBalance(employeeId) {
    const approvedLeaves = memoryStore.leave_requests.filter(
      l => l.employee_id === employeeId && l.status === 'approved'
    );

    const used = {
      annual: 0,
      sick: 0,
      casual: 0,
      unpaid: 0
    };

    approvedLeaves.forEach(l => {
      const type = (l.leave_type || '').toLowerCase();
      if (used[type] !== undefined) {
        used[type] += Number(l.working_days) || 0;
      }
    });

    const quotas = DEFAULT_LEAVE_QUOTAS;

    return {
      annual: { quota: quotas.annual, used: used.annual, remaining: Math.max(0, quotas.annual - used.annual) },
      sick: { quota: quotas.sick, used: used.sick, remaining: Math.max(0, quotas.sick - used.sick) },
      casual: { quota: quotas.casual, used: used.casual, remaining: Math.max(0, quotas.casual - used.casual) },
      unpaid: { quota: 'Unlimited', used: used.unpaid, remaining: 'Unlimited' }
    };
  }

  /**
   * Applies for a leave request.
   * Business rules:
   * 1. Working days only (skips weekends and public holidays).
   * 2. Overlap check: Overlapping with an existing pending/approved leave returns 422.
   * 3. Quota check: Requesting more days than remaining quota returns 422.
   */
  static async applyLeave(data, currentUser) {
    const { leave_type, start_date, end_date, reason } = data;
    const employeeId = data.employee_id || currentUser.employee_id;

    const employee = memoryStore.employees.find(e => e.id === employeeId || e.code === employeeId);
    if (!employee) {
      const err = new Error('Employee not found');
      err.statusCode = 404;
      throw err;
    }

    // 1. Calculate working days
    const holidays = memoryStore.holidays;
    const requestedWorkingDays = calculateWorkingDays(start_date, end_date, holidays);

    if (requestedWorkingDays <= 0) {
      const err = new Error('Selected date range contains no working days (all days are weekends or official public holidays).');
      err.statusCode = 422;
      throw err;
    }

    // 2. Overlap check rule (overlap = 422)
    const existingActiveLeaves = memoryStore.leave_requests.filter(
      l => l.employee_id === employee.id && ['pending', 'approved'].includes(l.status)
    );

    const reqStart = new Date(start_date);
    const reqEnd = new Date(end_date);

    for (const ex of existingActiveLeaves) {
      const exStart = new Date(ex.start_date);
      const exEnd = new Date(ex.end_date);
      // Overlap condition: start <= exEnd && end >= exStart
      if (reqStart <= exEnd && reqEnd >= exStart) {
        const err = new Error(`Leave overlap error: You already have an active ${ex.status} ${ex.leave_type} leave from ${ex.start_date} to ${ex.end_date}.`);
        err.statusCode = 422;
        throw err;
      }
    }

    // 3. Balance quota check rule (over-balance = 422)
    const typeLower = leave_type.toLowerCase();
    if (typeLower !== 'unpaid') {
      const balances = await this.getLeaveBalance(employee.id);
      const remaining = balances[typeLower]?.remaining || 0;
      if (requestedWorkingDays > remaining) {
        const err = new Error(`Insufficient leave balance: You requested ${requestedWorkingDays} day(s), but only have ${remaining} day(s) remaining for ${leave_type} leave.`);
        err.statusCode = 422;
        throw err;
      }
    }

    const leaveRequest = {
      id: `leave-${Date.now()}`,
      employee_id: employee.id,
      employee_name: employee.name,
      employee_code: employee.code,
      department: employee.department,
      leave_type: typeLower,
      start_date,
      end_date,
      working_days: requestedWorkingDays,
      reason: reason || '',
      status: 'pending',
      created_at: new Date().toISOString()
    };

    memoryStore.leave_requests.push(leaveRequest);

    if (supabase) {
      try {
        await supabase.from('leave_requests').insert([leaveRequest]);
      } catch (err) {
        console.warn('[LeaveService] Supabase leave sync warning:', err.message);
      }
    }

    await AuditService.log({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'APPLY_LEAVE',
      entityType: 'LEAVE_REQUEST',
      entityId: leaveRequest.id,
      afterState: leaveRequest
    });

    return leaveRequest;
  }

  /**
   * Cancels a pending leave request (Employee self-service)
   */
  static async cancelLeave(leaveId, currentUser) {
    const leave = memoryStore.leave_requests.find(l => l.id === leaveId);
    if (!leave) {
      const err = new Error('Leave request not found');
      err.statusCode = 404;
      throw err;
    }

    if (leave.status !== 'pending') {
      const err = new Error(`Cannot cancel a leave that has already been ${leave.status}. Only pending requests can be cancelled.`);
      err.statusCode = 400;
      throw err;
    }

    leave.status = 'cancelled';
    leave.cancelled_at = new Date().toISOString();

    await AuditService.log({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'CANCEL_LEAVE',
      entityType: 'LEAVE_REQUEST',
      entityId: leave.id,
      afterState: leave
    });

    return leave;
  }

  /**
   * Approves or rejects a leave request with a mandatory or optional comment (HR)
   */
  static async decideLeave(leaveId, { status, hr_comment }, currentUser) {
    const leave = memoryStore.leave_requests.find(l => l.id === leaveId);
    if (!leave) {
      const err = new Error('Leave request not found');
      err.statusCode = 404;
      throw err;
    }

    const beforeState = { status: leave.status };
    leave.status = status; // 'approved' or 'rejected'
    leave.hr_comment = hr_comment || '';
    leave.decided_by = currentUser.name;
    leave.decided_at = new Date().toISOString();

    if (supabase) {
      try {
        await supabase.from('leave_requests').update(leave).eq('id', leave.id);
      } catch (err) {
        console.warn('[LeaveService] Supabase leave update warning:', err.message);
      }
    }

    await AuditService.log({
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: `LEAVE_${status.toUpperCase()}`,
      entityType: 'LEAVE_REQUEST',
      entityId: leave.id,
      beforeState,
      afterState: leave
    });

    return leave;
  }

  /**
   * Retrieves leave requests with scope filtering
   */
  static async getLeaveRequests({ employeeId = null, department = null, status = null, page = 1, limit = 50 } = {}) {
    let requests = [...memoryStore.leave_requests];

    if (employeeId) {
      requests = requests.filter(l => l.employee_id === employeeId);
    }

    if (department && department !== 'all') {
      requests = requests.filter(l => (l.department || '').toLowerCase() === department.toLowerCase());
    }

    if (status && status !== 'all') {
      requests = requests.filter(l => l.status === status);
    }

    requests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const total = requests.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginated = requests.slice(startIndex, startIndex + Number(limit));

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
      leaves: paginated
    };
  }
}
