import React from 'react';
import { useApp } from '../../context/AppContext';

export default function AdminPayrollPage() {
  const { payroll, finalizePayroll } = useApp();

  const totalGross = payroll.records.reduce((acc, r) => acc + r.gross, 0);
  const totalDeductions = payroll.records.reduce((acc, r) => acc + r.deductions, 0);
  const totalTax = payroll.records.reduce((acc, r) => acc + r.monthlyTax, 0);
  const totalNet = payroll.records.reduce((acc, r) => acc + r.net, 0);

  return (
    <div className="flex flex-col w-full">
      <div className="px-8 py-6 space-y-6 max-w-[1680px] mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                Financial Governance · Monthly Disbursement
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-data-tabular">
                Cycle: {payroll.month} ({payroll.workingDays} Working Days)
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              Finalize Monthly Payroll &amp; Lock Month
            </h1>
          </div>

          <div>
            {payroll.isFinalized ? (
              <span className="px-4 py-2 rounded-lg bg-surface-container text-on-tertiary-container font-label-md text-label-md font-bold flex items-center gap-2 shadow-xs">
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>LOCKED &amp; FINALIZED (Immutable)</span>
              </span>
            ) : (
              <button
                onClick={finalizePayroll}
                className="h-10 px-5 bg-on-tertiary-container text-on-tertiary hover:opacity-95 transition-all rounded-lg font-label-md text-label-md font-bold flex items-center gap-2 shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Finalize &amp; Lock October 2026</span>
              </button>
            )}
          </div>
        </div>

        {/* Lock Status Alert */}
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
          payroll.isFinalized
            ? 'bg-surface-container border-on-tertiary-container/30 text-on-surface'
            : 'bg-surface-container-high border-secondary/30 text-on-surface'
        }`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[22px]">
              {payroll.isFinalized ? 'verified' : 'pending_actions'}
            </span>
            <div>
              <div className="font-bold text-sm">
                {payroll.isFinalized
                  ? `October 2026 payroll locked by ${payroll.finalizedBy} at ${payroll.finalizedAt}`
                  : 'Payroll draft prepared by HR (Zubair Khan). Review and lock to publish official payslips.'}
              </div>
              <div className="text-[11px] text-on-surface-variant">
                Finalized payroll batches are locked and permanently immutable.
              </div>
            </div>
          </div>
          <span className="font-mono font-bold text-xs">
            {payroll.isFinalized ? 'STATUS: LOCKED' : 'STATUS: DRAFT'}
          </span>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container shadow-xs">
            <span className="text-xs uppercase font-semibold text-on-surface-variant">Total Gross Pay</span>
            <div className="text-2xl font-bold font-data-tabular text-on-surface mt-1">
              PKR {totalGross.toLocaleString()}
            </div>
            <span className="text-[11px] text-outline font-semibold">1.5 × Basic Base</span>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container shadow-xs">
            <span className="text-xs uppercase font-semibold text-on-surface-variant">Attendance Deductions</span>
            <div className="text-2xl font-bold font-data-tabular text-error mt-1">
              - PKR {totalDeductions.toLocaleString()}
            </div>
            <span className="text-[11px] text-outline font-semibold">Absent + 0.5 × Half Days</span>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container shadow-xs">
            <span className="text-xs uppercase font-semibold text-on-surface-variant">Income Tax Slabs</span>
            <div className="text-2xl font-bold font-data-tabular text-on-surface-variant mt-1">
              PKR {totalTax.toLocaleString()}
            </div>
            <span className="text-[11px] text-outline font-semibold">Annualized Gross × 12</span>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container shadow-xs">
            <span className="text-xs uppercase font-semibold text-on-surface-variant">Net Payable Outflow</span>
            <div className="text-2xl font-bold font-data-tabular text-on-tertiary-container mt-1">
              PKR {totalNet.toLocaleString()}
            </div>
            <span className="text-[11px] text-on-tertiary-container font-semibold">
              {payroll.isFinalized ? 'Published to Employees' : 'Pending Final Lock'}
            </span>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low border-b border-surface-container text-on-surface-variant font-label-sm uppercase">
                <tr>
                  <th className="p-space-md">Employee</th>
                  <th className="p-space-md">Department</th>
                  <th className="p-space-md">Gross (1.5x Basic)</th>
                  <th className="p-space-md">Per Day Rate</th>
                  <th className="p-space-md">Deductions (Half/Absent)</th>
                  <th className="p-space-md">Tax Withholding</th>
                  <th className="p-space-md text-right">Net Salary</th>
                  <th className="p-space-md text-right">Payslip PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container font-body-sm">
                {payroll.records.map(r => (
                  <tr key={r.empId} className="hover:bg-surface-container-low/50">
                    <td className="p-space-md font-bold text-on-surface">{r.name}</td>
                    <td className="p-space-md text-on-surface-variant">{r.dept}</td>
                    <td className="p-space-md font-data-tabular text-on-surface font-semibold">PKR {r.gross.toLocaleString()}</td>
                    <td className="p-space-md font-data-tabular text-outline">PKR {r.perDay.toLocaleString()}</td>
                    <td className="p-space-md font-data-tabular font-semibold">
                      {r.deductions > 0 ? (
                        <span className="text-error">- PKR {r.deductions.toLocaleString()} (Half-Day)</span>
                      ) : (
                        <span className="text-outline">PKR 0</span>
                      )}
                    </td>
                    <td className="p-space-md font-data-tabular text-on-surface-variant">PKR {r.monthlyTax.toLocaleString()}</td>
                    <td className="p-space-md font-data-tabular font-bold text-on-tertiary-container text-right">
                      PKR {r.net.toLocaleString()}
                    </td>
                    <td className="p-space-md text-right">
                      <button
                        onClick={() => alert(`Official Payslip PDF for ${r.name}\nMonth: ${payroll.month}\nGross: PKR ${r.gross.toLocaleString()}\nNet: PKR ${r.net.toLocaleString()}\nStatus: ${payroll.isFinalized ? 'LOCKED' : 'DRAFT'}`)}
                        className="text-secondary hover:underline font-semibold"
                      >
                        Download PDF
                      </button>
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
