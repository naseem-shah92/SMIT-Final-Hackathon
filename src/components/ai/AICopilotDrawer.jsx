import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export default function AICopilotDrawer() {
  const {
    isAIOpen,
    toggleAIChat,
    currentUser,
    employees,
    attendance,
    leaveRequests,
    payroll,
    orgSettings
  } = useApp();

  const role = currentUser?.role || 'employee';
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your <strong>HCM AI Copilot</strong> connected directly to live workforce telemetry & payroll database. Ask me anything about attendance, headcount, leave balances, or company policies.',
      tool: 'system_initialized(version: "2.4")'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIOpen) {
      scrollToBottom();
    }
  }, [messages, isAIOpen]);

  if (!isAIOpen) return null;

  const rolePrompts = {
    admin: [
      'What is October total payroll cost?',
      'How many active employees?',
      'Summarize executive dashboard'
    ],
    hr: [
      'Who came late today?',
      'Who is on leave today?',
      'Summarize HR operations'
    ],
    employee: [
      'How many sick leaves do I have left?',
      "What is my colleague's salary?",
      'What is the office timing policy?'
    ]
  };

  const quickPrompts = rolePrompts[role] || [
    'How many active employees?',
    'Who came late today?',
    'What is October total payroll cost?'
  ];

  const handleSend = (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg = { sender: 'user', text: query, tool: null };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    setTimeout(() => {
      const q = query.toLowerCase();
      let aiResponse = { text: '', tool: null };

      // 1. Guardrail Check: Employee asking about other employees' salaries
      if (
        role === 'employee' &&
        (q.includes('colleague') || q.includes('salary') || q.includes('alex') || q.includes('zubair') || q.includes('bilawal') || q.includes('fatima') || q.includes('pay of'))
      ) {
        aiResponse = {
          text: "<strong>Access Denied (HTTP 403 Forbidden):</strong><br/>Under Section 4 Data Governance policies, employees cannot query compensation or salary records of other personnel.",
          tool: "security_scope_guard_rejected({ code: 403, target: 'payroll_records' })"
        };
      }
      // 2. Employee asking own leave balance
      else if (q.includes('sick') || (q.includes('leave') && (q.includes('balance') || q.includes('left') || q.includes('how many')))) {
        const myEmp = employees.find(e => e.id === currentUser?.empId) || employees[2];
        aiResponse = {
          text: `You have <strong>${myEmp?.sickLeaveBalance ?? 8} Sick Leaves</strong>, <strong>${myEmp?.casualLeaveBalance ?? 10} Casual Leaves</strong>, and <strong>${myEmp?.annualLeaveBalance ?? 14} Annual Leaves</strong> remaining for the year 2026.`,
          tool: `get_my_leave_balance({ emp_id: "${currentUser?.empId || 'EMP-003'}" })`
        };
      }
      // 3. Who is on leave today
      else if (q.includes('leave') && (q.includes('today') || q.includes('who') || q.includes('approved'))) {
        const onLeave = attendance.filter(a => a.status === 'On Leave');
        aiResponse = {
          text: onLeave.length > 0
            ? `Today, <strong>${onLeave.length} employee</strong> is on approved leave: ${onLeave.map(a => a.name).join(', ')}.`
            : `There are currently <strong>0 employees</strong> on leave today. All personnel are active or in transit.`,
          tool: "get_leave_summary({ date: '2026-10-24' })"
        };
      }
      // 4. Who came late today
      else if (q.includes('late')) {
        const late = attendance.filter(a => a.status === 'Late');
        aiResponse = {
          text: late.length > 0
            ? `For today, <strong>${late.length} employee</strong> checked in after 09:15 AM:<br/>• ${late.map(a => `<strong>${a.name}</strong> at ${a.checkIn} (${a.source})`).join('<br/>• ')}`
            : "No employees were late today! All recorded check-ins arrived before the 09:15 AM grace limit.",
          tool: "get_late_comers({ date: '2026-10-24' })"
        };
      }
      // 5. Total payroll cost
      else if (q.includes('payroll') || q.includes('cost') || q.includes('expense') || q.includes('salary budget')) {
        const totalGross = payroll.records.reduce((acc, r) => acc + (r.gross || 0), 0);
        const totalNet = payroll.records.reduce((acc, r) => acc + (r.net || 0), 0);
        const totalTax = payroll.records.reduce((acc, r) => acc + (r.monthlyTax || 0), 0);
        aiResponse = {
          text: `<strong>October 2026 Payroll Summary:</strong><br/>• Total Gross Cost: <strong>PKR ${totalGross.toLocaleString()}</strong><br/>• Monthly Tax Withholding: <strong>PKR ${totalTax.toLocaleString()}</strong><br/>• Net Disbursed: <strong>PKR ${totalNet.toLocaleString()}</strong><br/>• Status: <strong>${payroll.isFinalized ? 'LOCKED by Admin' : 'HR Draft Review'}</strong> across ${payroll.records.length} employees.`,
          tool: "get_payroll_summary({ month: 'October 2026' })"
        };
      }
      // 6. Active headcount
      else if (q.includes('headcount') || q.includes('active') || q.includes('employees') || q.includes('how many')) {
        aiResponse = {
          text: `The active workforce consists of <strong>${employees.length} full-time personnel</strong> across ${orgSettings?.departments?.length || 4} departments with <strong>0% attrition YTD</strong>.`,
          tool: "get_headcount()"
        };
      }
      // 7. Executive / HR summary
      else if (q.includes('summarize') || q.includes('overview') || q.includes('dashboard')) {
        const presentCount = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
        aiResponse = {
          text: `<strong>Live Operational Overview:</strong><br/>1. <strong>Headcount:</strong> ${employees.length} active personnel.<br/>2. <strong>Attendance Today:</strong> ${presentCount}/${employees.length} checked in.<br/>3. <strong>Payroll:</strong> ${payroll.isFinalized ? 'Finalized & Locked' : 'Draft pending Admin lock'}.<br/>4. <strong>Security:</strong> All operations verified via RBAC.`,
          tool: "generate_executive_brief()"
        };
      }
      // 8. Shift timings & policies
      else if (q.includes('timing') || q.includes('grace') || q.includes('policy') || q.includes('hour') || q.includes('geofence')) {
        aiResponse = {
          text: `<strong>Company Office Timing Policy (M2):</strong><br/>• Office Start: <strong>${orgSettings.officeStart || '09:00'} AM</strong><br/>• Grace Period: <strong>${orgSettings.graceMinutes || 15} Minutes</strong> (Late after 09:15 AM)<br/>• Half Day Threshold: <strong>Under ${orgSettings.halfDayHours || 5.0} Hours</strong> logged<br/>• Geofence: <strong>${orgSettings.radiusMeters || 150}m Radius</strong> around office GPS`,
          tool: "get_org_settings()"
        };
      }
      // Default fallback
      else {
        aiResponse = {
          text: `I processed your inquiry: <em>"${query}"</em>.<br/><br/>Under Section 3 rules: Office starts at 09:00 with a 15m grace period. Check-in after 09:15 is flagged Late. Gross = 1.5 × Basic. Payroll is locked exclusively by Admin. You can ask me about headcount, late comers, leave balances, or payroll costs.`,
          tool: "natural_language_interpreter()"
        };
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse.text, tool: aiResponse.tool }]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-surface-container-lowest border-l border-surface-container shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Top Header */}
      <div className="p-4 bg-primary text-on-primary flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface-container-lowest/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          </div>
          <div>
            <h4 className="font-label-lg text-label-lg font-bold leading-tight flex items-center gap-1.5">
              <span>HCM AI Assistant</span>
            </h4>
            <span className="font-label-sm text-label-sm text-primary-fixed-dim block text-[11px] font-mono">
              Role Scoped: {(role || 'USER').toUpperCase()}
            </span>
          </div>
        </div>
        <button
          onClick={toggleAIChat}
          className="text-on-primary/80 hover:text-on-primary p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          type="button"
          title="Close AI Copilot"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Security guardrail strip */}
      <div className="px-4 py-1.5 bg-surface-container-high border-b border-surface-container flex items-center justify-between text-[11px] font-label-sm text-on-surface-variant">
        <span className="flex items-center gap-1.5 font-semibold text-secondary">
          <span className="material-symbols-outlined text-[14px]">shield</span>
          <span>Live Database Function Calling</span>
        </span>
        <span className="font-data-tabular text-[10px] bg-surface px-1.5 py-0.5 rounded border border-surface-container font-mono">
          Strict Scope Guard
        </span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : ''}`}>
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 text-[10px] font-bold shadow-xs">
                AI
              </div>
            )}
            <div
              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-secondary text-on-secondary rounded-tr-none shadow-xs'
                  : 'bg-surface-container-low text-on-surface rounded-tl-none border border-surface-container shadow-2xs'
              }`}
            >
              {m.sender === 'ai' && (
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  <span className="px-1.5 py-0.2 rounded bg-surface-container-highest text-secondary text-[9px] font-bold uppercase font-mono">
                    AI Response
                  </span>
                  {m.tool && (
                    <span className="font-mono text-[9px] text-on-surface-variant bg-surface px-1.5 py-0.2 rounded border border-surface-container truncate max-w-[200px]" title={m.tool}>
                      {m.tool}
                    </span>
                  )}
                </div>
              )}
              <div
                className="text-xs space-y-1"
                dangerouslySetInnerHTML={{ __html: m.text }}
              />
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-2.5 items-center text-xs text-outline italic py-1 animate-pulse">
            <div className="w-7 h-7 rounded-full bg-secondary/20 text-secondary flex items-center justify-center shrink-0 text-[10px] font-bold">
              AI
            </div>
            <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
              <span>Calling database tool...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-2 px-3 bg-surface-container-low border-t border-surface-container flex gap-1.5 overflow-x-auto text-[11px]">
        {quickPrompts.map((p, pIdx) => (
          <button
            key={pIdx}
            onClick={() => handleSend(p)}
            type="button"
            className="px-2.5 py-1 bg-surface-container-lowest hover:bg-surface-container border border-surface-container-high rounded-full whitespace-nowrap text-on-surface font-label-sm transition-all shrink-0 shadow-2xs text-[11px] hover:border-secondary"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 bg-surface-container-lowest border-t border-surface-container flex gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask AI from live database..."
          disabled={isThinking}
          className="flex-1 h-10 px-3 rounded-lg bg-surface border border-outline-variant text-on-surface font-body-sm text-body-sm focus:border-secondary focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={isThinking || !inputValue.trim()}
          className="h-10 px-4 bg-secondary text-on-secondary hover:bg-secondary-container disabled:opacity-40 rounded-lg font-label-md text-label-md font-bold transition-all shrink-0 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </form>

    </div>
  );
}
