import { memoryStore } from '../config/database.js';
import { DEFAULT_LEAVE_QUOTAS } from '../constants/leaveQuotas.js';

export class AnalyticsService {
  /**
   * Admin Dashboard Analytics: High-level organizational KPIs, financial summary, and department breakdowns.
   */
  static async getAdminAnalytics({ department = null, dateRange = null } = {}) {
    let employees = [...memoryStore.employees];
    if (department && department !== 'all') {
      employees = employees.filter(e => e.department.toLowerCase() === department.toLowerCase());
    }

    const totalHeadcount = employees.length;
    const activeHeadcount = employees.filter(e => e.status === 'active').length;

    // Attrition YTD formula: exits / avg headcount * 100
    const exitedCount = employees.filter(e => e.status === 'exited' || e.status === 'terminated').length;
    const avgHeadcount = Math.max(1, (activeHeadcount + totalHeadcount) / 2);
    const attritionRate = Number(((exitedCount / avgHeadcount) * 100).toFixed(2));

    // Payroll financials
    const totalPayrollCost = employees.reduce((sum, e) => sum + (Number(e.gross_salary) || 0), 0);
    const averageSalary = totalHeadcount > 0 ? Math.round(totalPayrollCost / totalHeadcount) : 0;

    // Headcount by department
    const deptHeadcount = {};
    const deptPayroll = {};
    employees.forEach(e => {
      const d = e.department || 'Unassigned';
      deptHeadcount[d] = (deptHeadcount[d] || 0) + 1;
      deptPayroll[d] = (deptPayroll[d] || 0) + (Number(e.gross_salary) || 0);
    });

    const headcountByDept = Object.keys(deptHeadcount).map(dept => ({
      department: dept,
      count: deptHeadcount[dept],
      payrollCost: deptPayroll[dept]
    }));

    // Tenure and Demographics
    const currentYear = new Date().getFullYear();
    const tenureDist = { 'Under 1 yr': 0, '1-2 yrs': 0, '2-5 yrs': 0, '5+ yrs': 0 };
    employees.forEach(e => {
      const joinYear = e.joining_date ? new Date(e.joining_date).getFullYear() : currentYear;
      const tenure = Math.max(0, currentYear - joinYear);
      if (tenure < 1) tenureDist['Under 1 yr']++;
      else if (tenure <= 2) tenureDist['1-2 yrs']++;
      else if (tenure <= 5) tenureDist['2-5 yrs']++;
      else tenureDist['5+ yrs']++;
    });

    // Recent Audit Feed
    const recentAudit = memoryStore.audit_logs.slice(0, 8);

    return {
      kpis: {
        totalHeadcount,
        activeHeadcount,
        attritionRate,
        totalPayrollCost,
        averageSalary
      },
      headcountByDept,
      tenureDistribution: Object.keys(tenureDist).map(k => ({ label: k, count: tenureDist[k] })),
      recentAuditFeed: recentAudit
    };
  }

  /**
   * HR Dashboard Analytics: Operational KPIs, daily attendance telemetry, absenteeism by department, leave breakdown.
   */
  static async getHRAnalytics({ department = null } = {}) {
    let employees = [...memoryStore.employees];
    if (department && department !== 'all') {
      employees = employees.filter(e => e.department.toLowerCase() === department.toLowerCase());
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const todayAttendance = memoryStore.attendance.filter(a => a.date === todayStr);

    let presentToday = 0;
    let lateToday = 0;
    let halfDayToday = 0;
    todayAttendance.forEach(a => {
      if (a.status === 'present') presentToday++;
      else if (a.status === 'late') lateToday++;
      else if (a.status === 'half_day') halfDayToday++;
    });

    // Active approved leaves today
    const onLeaveToday = memoryStore.leave_requests.filter(l => {
      if (l.status !== 'approved') return false;
      return l.start_date <= todayStr && l.end_date >= todayStr;
    }).length;

    // Pending approvals
    const pendingLeaves = memoryStore.leave_requests.filter(l => l.status === 'pending').length;
    const pendingCorrections = memoryStore.attendance_corrections.filter(c => c.status === 'pending').length;

    // Attendance Rate Formula: (present + late + missing_checkout + 0.5 * half_day) / (records - on_leave)
    const activeTotal = Math.max(1, employees.filter(e => e.status === 'active').length);
    const attendanceNumerator = presentToday + lateToday + (0.5 * halfDayToday);
    const denominator = Math.max(1, activeTotal - onLeaveToday);
    const attendanceRate = Number(((attendanceNumerator / denominator) * 100).toFixed(1));

    // Top 5 Late Comers this month
    const thisMonthPrefix = todayStr.substring(0, 7);
    const lateCounts = {};
    memoryStore.attendance
      .filter(a => a.date.startsWith(thisMonthPrefix) && (a.status === 'late' || a.check_in > '09:15'))
      .forEach(a => {
        lateCounts[a.employee_id] = (lateCounts[a.employee_id] || 0) + 1;
      });

    const topLateComers = Object.keys(lateCounts)
      .map(empId => {
        const emp = memoryStore.employees.find(e => e.id === empId);
        return {
          employee_id: empId,
          name: emp ? emp.name : 'Unknown Employee',
          department: emp ? emp.department : 'General',
          lateCount: lateCounts[empId]
        };
      })
      .sort((a, b) => b.lateCount - a.lateCount)
      .slice(0, 5);

    // Leave by Type breakdown
    const leaveByType = { annual: 0, sick: 0, casual: 0, unpaid: 0 };
    memoryStore.leave_requests
      .filter(l => l.status === 'approved')
      .forEach(l => {
        const t = (l.leave_type || '').toLowerCase();
        if (leaveByType[t] !== undefined) {
          leaveByType[t] += Number(l.working_days) || 1;
        }
      });

    return {
      kpis: {
        totalHeadcount: employees.length,
        presentToday,
        lateToday,
        onLeaveToday,
        pendingApprovals: pendingLeaves + pendingCorrections,
        attendanceRate: Math.min(100, attendanceRate)
      },
      topLateComers,
      leaveUtilization: Object.keys(leaveByType).map(k => ({
        type: k,
        days: leaveByType[k],
        quota: DEFAULT_LEAVE_QUOTAS[k] || 0
      }))
    };
  }

  /**
   * Employee Dashboard Analytics: Self-service hours, late tally, leave balance, recent payslip.
   */
  static async getEmployeeAnalytics(employeeId) {
    const todayStr = new Date().toISOString().split('T')[0];
    const thisMonthPrefix = todayStr.substring(0, 7);

    const attendances = memoryStore.attendance.filter(a => a.employee_id === employeeId);
    
    // Late count this month
    const lateCount = attendances.filter(
      a => a.date.startsWith(thisMonthPrefix) && (a.status === 'late' || a.check_in > '09:15')
    ).length;

    // Hours this week
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    const mondayStr = monday.toISOString().split('T')[0];

    const weekAttendance = attendances.filter(a => a.date >= mondayStr && a.date <= todayStr);
    const hoursThisWeek = weekAttendance.reduce((sum, a) => sum + (Number(a.work_hours) || 0), 0);

    // Latest payslip
    const latestPayslip = memoryStore.payroll_records
      .filter(r => r.employee_id === employeeId)
      .sort((a, b) => b.month_key.localeCompare(a.month_key))[0] || null;

    // Today's attendance status
    const todayRecord = attendances.find(a => a.date === todayStr) || null;

    return {
      kpis: {
        hoursThisWeek: Number(hoursThisWeek.toFixed(1)),
        targetHours: 40,
        lateCountMonth: lateCount,
        hasCheckedInToday: Boolean(todayRecord),
        todayCheckIn: todayRecord ? todayRecord.check_in : null,
        todayCheckOut: todayRecord ? todayRecord.check_out : null,
        todayStatus: todayRecord ? todayRecord.status : 'not_checked_in'
      },
      latestPayslip
    };
  }
}
