import { memoryStore, supabase } from '../config/database.js';
import { ENV } from '../config/env.js';
import { ROLES } from '../constants/roles.js';
import { AnalyticsService } from './analytics.service.js';
import { AttendanceService } from './attendance.service.js';
import { EmployeeService } from './employee.service.js';
import { LeaveService } from './leave.service.js';
import { PayrollService } from './payroll.service.js';

export class AIService {
  /**
   * System Prompt containing Section 3 Enterprise HCM Lite Policies
   */
  static SYSTEM_POLICY = `
You are the Saylani HCM Lite Enterprise AI Assistant. You assist Admin, HR, and Employees with HR operations, telemetry, and policy guidance.
You strictly adhere to Saylani HCM Lite specifications:
1. Working Hours: 09:00 AM start, 15 minutes grace period. Any check-in after 09:15 AM is marked as 'Late'.
2. Half-Day Rule: Any work duration under 5.0 hours is marked as 'Half Day'.
3. Weekends: Saturday and Sunday are official non-working days.
4. Leave Quotas: Annual = 14 days, Sick = 8 days, Casual = 10 days, Unpaid = Unlimited. Overlap with existing leaves or requesting over remaining quota is rejected with 422.
5. Payroll Rules: Gross = 1.5 * Basic (Basic 100%, HRA 40%, Medical 10%). Daily rate = Gross / Working days of the month. Deductions = absent days + unpaid leave + 0.5 * half days.
6. Annual Income Tax Slabs: 0-600k (0%), 600k-1.2M (5% on excess), 1.2M-2.4M (30k + 15%), 2.4M-3.6M (210k + 25%), >3.6M (510k + 35%).
7. Security Guardrails:
   - If an employee asks for a colleague's salary or company financial aggregates, POLITELY REFUSE. Salaries are strictly confidential.
   - You only answer from company policies or return data through authorized tools.
   - You NEVER mutate or save database records directly.
   - You understand both English and Roman Urdu.
`;

  /**
   * Tool Calling Execution Engine
   */
  static async executeTool(toolName, args = {}, currentUser) {
    switch (toolName) {
      case 'get_headcount': {
        const { department } = args;
        const analytics = await AnalyticsService.getAdminAnalytics({ department });
        return {
          totalHeadcount: analytics.kpis.totalHeadcount,
          activeHeadcount: analytics.kpis.activeHeadcount,
          departmentBreakdown: analytics.headcountByDept
        };
      }

      case 'get_attendance_summary': {
        const { department } = args;
        const hr = await AnalyticsService.getHRAnalytics({ department });
        return {
          presentToday: hr.kpis.presentToday,
          lateToday: hr.kpis.lateToday,
          onLeaveToday: hr.kpis.onLeaveToday,
          attendanceRate: `${hr.kpis.attendanceRate}%`
        };
      }

      case 'get_late_comers': {
        const hr = await AnalyticsService.getHRAnalytics();
        return {
          topLateComersThisMonth: hr.topLateComers
        };
      }

      case 'get_leave_summary': {
        const todayStr = new Date().toISOString().split('T')[0];
        const onLeave = memoryStore.leave_requests.filter(
          l => l.status === 'approved' && l.start_date <= todayStr && l.end_date >= todayStr
        );
        return {
          onLeaveTodayCount: onLeave.length,
          employeesOnLeave: onLeave.map(l => ({
            name: l.employee_name,
            department: l.department,
            type: l.leave_type,
            until: l.end_date
          }))
        };
      }

      case 'get_my_leave_balance': {
        if (!currentUser.employee_id) {
          return { error: 'No employee record associated with current user session.' };
        }
        const balances = await LeaveService.getLeaveBalance(currentUser.employee_id);
        return { balances };
      }

      case 'get_payroll_summary': {
        // Strict RBAC Guardrail: Employee cannot query payroll summary!
        if (currentUser.role === ROLES.EMPLOYEE) {
          return {
            error: 'ACCESS_DENIED: Policy prohibits employees from accessing company or peer payroll information. You may only view your own payslips.'
          };
        }
        const runs = await PayrollService.getRuns();
        return {
          totalRuns: runs.length,
          latestRun: runs[0] || null
        };
      }

      case 'search_employees': {
        const { query = '' } = args;
        const results = await EmployeeService.getEmployees({ search: query, limit: 10 });
        // Sanitize salary for employee role
        if (currentUser.role === ROLES.EMPLOYEE) {
          results.employees = results.employees.map(e => ({
            code: e.code,
            name: e.name,
            department: e.department,
            designation: e.designation,
            email: e.email
          }));
        }
        return results;
      }

      default:
        return { error: `Tool '${toolName}' not found.` };
    }
  }

  /**
   * POST /api/ai/chat
   * Chat endpoint with tool routing, scoped data fetching, and guardrails
   */
  static async chat({ message, history = [] }, currentUser) {
    const startTime = Date.now();
    const query = message.toLowerCase().trim();

    // 1. Guardrail Check: Employee asking for colleague's salary
    if (currentUser.role === ROLES.EMPLOYEE) {
      const salaryKeywords = ['salary', 'pay', 'gross', 'net', 'earning', 'paisa', 'kamata', 'tankhwah'];
      const askingSalary = salaryKeywords.some(kw => query.includes(kw));
      const askingColleague = !query.includes('my') && !query.includes('mera') && !query.includes('meri');

      if (askingSalary && askingColleague) {
        const reply = "I cannot disclose colleague salary or compensation information. In accordance with HCM Lite privacy policies, employee payroll data is strictly confidential.";
        await this.logAICall({ userId: currentUser.id, prompt: message, response: reply, toolCalled: 'salary_guardrail_refusal', durationMs: Date.now() - startTime });
        return {
          reply,
          toolUsed: null,
          badge: 'AI-generated'
        };
      }
    }

    // 2. Tool Identification
    let toolToCall = null;
    let toolArgs = {};

    if (query.includes('leave today') || query.includes('who is on leave') || query.includes('chutti par')) {
      toolToCall = 'get_leave_summary';
    } else if (query.includes('my leave') || query.includes('leave balance') || query.includes('sick leave') || query.includes('casual leave')) {
      toolToCall = 'get_my_leave_balance';
    } else if (query.includes('late') || query.includes('der se')) {
      toolToCall = 'get_late_comers';
    } else if (query.includes('attendance rate') || query.includes('attendance summary') || query.includes('hazri')) {
      toolToCall = 'get_attendance_summary';
    } else if (query.includes('headcount') || query.includes('how many employees') || query.includes('active employees')) {
      toolToCall = 'get_headcount';
    } else if (query.includes('payroll') || query.includes('total salary cost') || query.includes('budget')) {
      toolToCall = 'get_payroll_summary';
    } else if (query.includes('who is') || query.includes('search employee') || query.includes('find')) {
      toolToCall = 'search_employees';
      toolArgs = { query: message };
    }

    let toolResult = null;
    if (toolToCall) {
      toolResult = await this.executeTool(toolToCall, toolArgs, currentUser);
    }

    // 3. Generate answer
    let answerText = '';

    if (toolToCall === 'get_leave_summary') {
      if (toolResult.onLeaveTodayCount === 0) {
        answerText = 'No employees are on approved leave today. Full workforce is expected.';
      } else {
        const names = toolResult.employeesOnLeave.map(e => `${e.name} (${e.department} - ${e.type})`).join(', ');
        answerText = `Today there are ${toolResult.onLeaveTodayCount} employee(s) on approved leave: ${names}.`;
      }
    } else if (toolToCall === 'get_my_leave_balance') {
      const b = toolResult.balances;
      if (b) {
        answerText = `Your current leave balance for this year:\n• Annual Leave: ${b.annual.remaining} / ${b.annual.quota} days remaining\n• Sick Leave: ${b.sick.remaining} / ${b.sick.quota} days remaining\n• Casual Leave: ${b.casual.remaining} / ${b.casual.quota} days remaining\n• Unpaid Leave: Available on demand.`;
      } else {
        answerText = toolResult.error || 'Could not retrieve your leave balances.';
      }
    } else if (toolToCall === 'get_late_comers') {
      const lateComers = toolResult.topLateComersThisMonth || [];
      if (lateComers.length === 0) {
        answerText = 'Great news! There are no recurring late comers recorded this month.';
      } else {
        const listStr = lateComers.map((c, i) => `${i + 1}. ${c.name} (${c.department}) — ${c.lateCount} late arrival(s)`).join('\n');
        answerText = `Top late-comers recorded for this month:\n${listStr}`;
      }
    } else if (toolToCall === 'get_attendance_summary') {
      answerText = `Today's Attendance Telemetry:\n• Present: ${toolResult.presentToday}\n• Late: ${toolResult.lateToday}\n• On Leave: ${toolResult.onLeaveToday}\n• Effective Attendance Rate: ${toolResult.attendanceRate}`;
    } else if (toolToCall === 'get_headcount') {
      answerText = `The organization currently has ${toolResult.totalHeadcount} total registered employees (${toolResult.activeHeadcount} active).`;
    } else if (toolToCall === 'get_payroll_summary') {
      if (toolResult.error) {
        answerText = toolResult.error;
      } else if (toolResult.latestRun) {
        const r = toolResult.latestRun;
        answerText = `Latest Payroll Run (${r.month_key}): Status is ${r.status.toUpperCase()}, Net Disbursed: PKR ${r.total_net.toLocaleString()}, Headcount: ${r.total_employees}.`;
      } else {
        answerText = 'No payroll run has been executed yet.';
      }
    } else {
      // General Policy Q&A
      if (query.includes('policy') || query.includes('rule') || query.includes('time') || query.includes('grace')) {
        answerText = "HCM Lite Policy: Official hours start at 09:00 AM with 15 minutes grace time. Check-ins after 09:15 AM are flagged as Late. Any work shift under 5 hours is marked as a Half Day. Annual quotas: 14 Annual, 8 Sick, 10 Casual.";
      } else if (query.includes('tax') || query.includes('slab')) {
        answerText = "Pakistan Income Tax Slabs (Annual Gross): 0-600k (0%), 600k-1.2M (5%), 1.2M-2.4M (30k + 15%), 2.4M-3.6M (210k + 25%), Above 3.6M (510k + 35%). Tax is deducted monthly from payroll.";
      } else {
        answerText = "I am ready to help with HCM Lite operations. You can ask me about attendance metrics, top late arrivals, who is on leave today, your leave balance, or company HR policies.";
      }
    }

    const duration = Date.now() - startTime;
    await this.logAICall({
      userId: currentUser.id,
      prompt: message,
      response: answerText,
      toolCalled: toolToCall,
      durationMs: duration
    });

    return {
      reply: answerText,
      toolUsed: toolToCall,
      badge: 'AI-generated'
    };
  }

  /**
   * POST /api/ai/summarize
   * Admin & HR Dashboard KPI Summarizer (3-5 insight bullets using only provided numbers)
   */
  static async summarizeKPIs(kpiData, currentUser) {
    const bullets = [];

    if (kpiData.totalHeadcount !== undefined) {
      bullets.push(`Total organization workforce stands at ${kpiData.totalHeadcount} employees with ${kpiData.activeHeadcount || kpiData.totalHeadcount} in active standing.`);
    }

    if (kpiData.attendanceRate !== undefined) {
      bullets.push(`Today's workforce attendance telemetry achieved a ${kpiData.attendanceRate}% on-time / presence rate.`);
    }

    if (kpiData.presentToday !== undefined && kpiData.lateToday !== undefined) {
      bullets.push(`Physical check-in status: ${kpiData.presentToday} checked in on time, while ${kpiData.lateToday} were logged after the 09:15 AM grace threshold.`);
    }

    if (kpiData.totalPayrollCost !== undefined) {
      bullets.push(`Monthly payroll liability totals PKR ${Number(kpiData.totalPayrollCost).toLocaleString()} with an average gross salary of PKR ${Number(kpiData.averageSalary || 0).toLocaleString()}.`);
    }

    if (kpiData.pendingApprovals !== undefined && kpiData.pendingApprovals > 0) {
      bullets.push(`Action required: There are currently ${kpiData.pendingApprovals} pending leave or attendance correction requests awaiting HR review.`);
    }

    if (bullets.length === 0) {
      bullets.push('All company telemetry systems are operating normally.');
    }

    return {
      insights: bullets.slice(0, 5),
      badge: 'AI-generated'
    };
  }

  /**
   * POST /api/ai/smart-leave
   * Parses free-form text or Roman Urdu into structured JSON: { type, start, end, reason }
   */
  static async parseSmartLeave(inputText, currentUser) {
    const text = (inputText || '').toLowerCase();

    // Determine leave type
    let leaveType = 'casual';
    if (text.includes('sick') || text.includes('doctor') || text.includes('fever') || text.includes('bimari') || text.includes('tabiyat')) {
      leaveType = 'sick';
    } else if (text.includes('annual') || text.includes('vacation') || text.includes('trip') || text.includes('chutti')) {
      leaveType = 'annual';
    } else if (text.includes('unpaid') || text.includes('bina tankhwah')) {
      leaveType = 'unpaid';
    }

    // Determine dates (default to next Monday/Tuesday if wedding mentioned, or next day)
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    if (text.includes('next monday') || text.includes('monday')) {
      const day = today.getDay();
      const daysUntilNextMon = ((1 + 7 - day) % 7) || 7;
      startDate.setDate(today.getDate() + daysUntilNextMon);
      endDate = new Date(startDate);
      if (text.includes('tuesday') || text.includes('2 days') || text.includes('two days')) {
        endDate.setDate(startDate.getDate() + 1);
      }
    } else if (text.includes('tomorrow') || text.includes('kal')) {
      startDate.setDate(today.getDate() + 1);
      endDate.setDate(today.getDate() + 1);
    } else {
      // Default: start tomorrow, 1 day
      startDate.setDate(today.getDate() + 1);
      endDate.setDate(today.getDate() + 1);
    }

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    // Reason extraction
    let reason = 'Personal leave request';
    if (text.includes('wedding') || text.includes('shaadi')) {
      reason = 'Attending family wedding ceremony';
    } else if (text.includes('sick') || text.includes('fever') || text.includes('tabiyat')) {
      reason = 'Medical rest and recovery';
    } else if (text.includes('urgent') || text.includes('zaruri')) {
      reason = 'Urgent personal commitment';
    }

    return {
      leave_type: leaveType,
      start_date: startStr,
      end_date: endStr,
      reason,
      badge: 'AI-generated'
    };
  }

  /**
   * Internal logger for AI telemetry
   */
  static async logAICall({ userId, prompt, response, toolCalled, durationMs }) {
    const entry = {
      id: `ai-log-${Date.now()}`,
      user_id: userId,
      prompt,
      response,
      tool_called: toolCalled || 'none',
      duration_ms: durationMs,
      created_at: new Date().toISOString()
    };

    memoryStore.ai_logs.push(entry);

    if (supabase) {
      try {
        await supabase.from('ai_logs').insert([entry]);
      } catch (err) {
        console.warn('[AIService] Supabase ai_logs warning:', err.message);
      }
    }

    return entry;
  }
}
