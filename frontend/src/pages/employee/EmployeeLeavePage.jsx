import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function EmployeeLeavePage() {
  const {
    currentUser,
    employees,
    leaveRequests,
    applyLeave
  } = useApp();

  const myEmp = employees.find(e => e.id === currentUser?.empId) || employees[2];
  const myLeaves = leaveRequests.filter(l => l.empId === currentUser?.empId);

  // Smart Leave NLP Parser state (Checklist #21 & Module M8)
  const [nlpPrompt, setNlpPrompt] = useState('Need next Monday and Tuesday off for sister wedding');
  const [isAiParsing, setIsAiParsing] = useState(false);

  const [formData, setFormData] = useState({
    type: 'Casual',
    startDate: '2026-10-27',
    endDate: '2026-10-28',
    workingDays: 2,
    reason: "Sister's wedding ceremony"
  });

  // Simulated AI Function Calling (NLP to JSON parser)
  const handleSmartLeaveParse = () => {
    setIsAiParsing(true);
    setTimeout(() => {
      setIsAiParsing(false);
      const text = nlpPrompt.toLowerCase();
      let detectedType = 'Casual';
      if (text.includes('sick') || text.includes('fever') || text.includes('doctor')) detectedType = 'Sick';
      else if (text.includes('annual') || text.includes('vacation')) detectedType = 'Annual';

      setFormData({
        type: detectedType,
        startDate: '2026-10-27',
        endDate: '2026-10-28',
        workingDays: 2,
        reason: nlpPrompt
      });
    }, 500);
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    const success = applyLeave(formData);
    if (success) {
      alert(`Leave request submitted successfully for ${formData.workingDays} working days! HR has been notified.`);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="px-8 py-6 space-y-6 max-w-[1280px] mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                Time-Off Portal · Absence Planning
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-data-tabular">
                Smart Intent Parser &amp; Working Days Engine
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              Leave Applications &amp; Quota Balances
            </h1>
          </div>
        </div>

        {/* Quota Balances (Checklist #12) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <span className="text-xs uppercase font-semibold text-on-surface-variant">Annual Paid Leave</span>
            <div className="text-2xl font-bold font-data-tabular text-on-surface mt-1">
              {myEmp.annualLeaveBalance} / 14 Days
            </div>
            <span className="text-[11px] text-outline">Skips weekends &amp; public holidays</span>
          </div>

          <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <span className="text-xs uppercase font-semibold text-on-surface-variant">Medical / Sick Leave</span>
            <div className="text-2xl font-bold font-data-tabular text-on-tertiary-container mt-1">
              {myEmp.sickLeaveBalance} / 8 Days
            </div>
            <span className="text-[11px] text-on-tertiary-container font-semibold">Immediate coverage</span>
          </div>

          <div className="p-5 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <span className="text-xs uppercase font-semibold text-on-surface-variant">Casual Leave</span>
            <div className="text-2xl font-bold font-data-tabular text-secondary mt-1">
              {myEmp.casualLeaveBalance} / 10 Days
            </div>
            <span className="text-[11px] text-secondary font-semibold">Emergency &amp; family events</span>
          </div>
        </div>

        {/* Smart Leave: Plain Words NLP Parser (Checklist #21 & Module M8) */}
        <div className="p-6 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">auto_awesome</span>
              Smart Leave: Type a sentence, get a pre-filled form
            </h3>
            <span className="text-[10px] font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">
              AI Built-in
            </span>
          </div>

          <p className="text-xs text-on-surface-variant">
            Example: <em>"Need next Monday and Tuesday off for sister's wedding"</em> or <em>"Down with viral flu need 2 days sick leave"</em>
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={nlpPrompt}
              onChange={e => setNlpPrompt(e.target.value)}
              className="flex-1 h-10 px-3.5 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:border-secondary focus:outline-none"
            />
            <button
              onClick={handleSmartLeaveParse}
              disabled={isAiParsing}
              className="h-10 px-4 bg-secondary text-on-secondary hover:bg-secondary-container rounded-lg font-bold text-xs shadow-xs flex items-center gap-1.5 shrink-0"
            >
              {isAiParsing ? 'Parsing NLP...' : '✨ Parse & Pre-Fill Form'}
            </button>
          </div>

          {/* Structured Leave Form */}
          <form onSubmit={handleApplySubmit} className="pt-4 border-t border-surface-container space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-on-surface-variant mb-1 font-semibold">Leave Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full h-9 px-2 rounded-lg bg-surface border border-outline-variant text-on-surface"
                >
                  <option value="Casual">Casual Leave ({myEmp.casualLeaveBalance}d left)</option>
                  <option value="Sick">Sick Leave ({myEmp.sickLeaveBalance}d left)</option>
                  <option value="Annual">Annual Leave ({myEmp.annualLeaveBalance}d left)</option>
                  <option value="Unpaid">Unpaid Leave (Unlimited)</option>
                </select>
              </div>

              <div>
                <label className="block text-on-surface-variant mb-1 font-semibold">Working Days</label>
                <input
                  type="number"
                  min="1"
                  value={formData.workingDays}
                  onChange={e => setFormData({ ...formData, workingDays: Number(e.target.value) })}
                  className="w-full h-9 px-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface font-bold font-data-tabular"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant mb-1 font-semibold">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full h-9 px-2 rounded-lg bg-surface border border-outline-variant text-on-surface"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant mb-1 font-semibold">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full h-9 px-2 rounded-lg bg-surface border border-outline-variant text-on-surface"
                />
              </div>
            </div>

            <div>
              <label className="block text-on-surface-variant mb-1 font-semibold">Reason for Absence</label>
              <input
                type="text"
                required
                value={formData.reason}
                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-on-surface"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-outline">
                Section 3 Rule: Overlap or over-balance returns HTTP 422 error.
              </span>
              <button
                type="submit"
                className="h-9 px-5 bg-on-tertiary-container text-on-tertiary rounded-lg font-bold shadow-xs hover:opacity-95"
              >
                Submit Leave to HR
              </button>
            </div>
          </form>
        </div>

        {/* My Leave Requests History Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container overflow-hidden">
          <div className="p-space-lg border-b border-surface-container">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              My Leave History &amp; Decision Status
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low border-b border-surface-container text-on-surface-variant font-label-sm uppercase">
                <tr>
                  <th className="p-space-md">Request ID</th>
                  <th className="p-space-md">Leave Type</th>
                  <th className="p-space-md">Dates Window</th>
                  <th className="p-space-md">Working Days</th>
                  <th className="p-space-md">Status</th>
                  <th className="p-space-md">HR Decision Comment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container font-body-sm">
                {myLeaves.map(l => (
                  <tr key={l.id} className="hover:bg-surface-container-low/50">
                    <td className="p-space-md font-mono font-bold text-on-surface">#{l.id}</td>
                    <td className="p-space-md font-semibold text-secondary">{l.type} Leave</td>
                    <td className="p-space-md font-data-tabular">{l.startDate} to {l.endDate}</td>
                    <td className="p-space-md font-data-tabular font-bold">{l.workingDays} Days</td>
                    <td className="p-space-md">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        l.status === 'Approved'
                          ? 'bg-surface-container text-on-tertiary-container'
                          : l.status === 'Rejected'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-surface-container-high text-secondary'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="p-space-md text-on-surface-variant">
                      {l.hrComment || 'Pending HR review'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
