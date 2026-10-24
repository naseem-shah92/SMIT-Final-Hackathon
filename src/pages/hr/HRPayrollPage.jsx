import React from 'react';
import { useApp } from '../../context/AppContext';

export default function HRPayrollPage() {
  const { payroll, finalizePayroll, currentUser } = useApp();

  const totalGross = payroll.records.reduce((acc, r) => acc + r.gross, 0);
  const totalDeductions = payroll.records.reduce((acc, r) => acc + r.deductions, 0);
  const totalTax = payroll.records.reduce((acc, r) => acc + (r.monthlyTax || 0), 0);
  const totalNet = payroll.records.reduce((acc, r) => acc + r.net, 0);

  return (
    <div className="flex flex-col w-full">
      <div className="px-8 py-6 space-y-6 max-w-[1680px] mx-auto w-full">
        
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                Compensation &amp; Disbursements · Monthly Run
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-data-tabular">
                Cycle: 01 Oct – 31 Oct 2026 ({payroll.workingDays} Working Days)
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              Monthly Payroll Run &amp; Tax Calculation Engine
            </h1>
          </div>

          <div className="flex items-center gap-space-sm">
            {payroll.isFinalized ? (
              <span className="px-4 py-2 bg-surface-container text-on-tertiary-container font-label-md text-label-md font-bold rounded-lg flex items-center gap-1.5 shadow-xs">
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Finalized &amp; Locked by Admin</span>
              </span>
            ) : currentUser?.role === 'admin' ? (
              <button
                onClick={finalizePayroll}
                className="h-10 px-space-lg bg-on-tertiary-container text-on-tertiary hover:opacity-95 transition-all rounded-lg font-label-md text-label-md font-bold flex items-center gap-space-xs shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Finalize &amp; Lock October 2026</span>
              </button>
            ) : (
              <span className="px-3 py-1.5 bg-surface-container-high text-secondary font-label-sm text-label-sm font-bold rounded-lg border border-surface-container flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                <span>HR Draft Mode (Lock reserved for Admin)</span>
              </span>
            )}
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Total Gross Payroll
            </span>
            <div className="font-headline-xl text-headline-xl font-bold text-on-surface mt-1 font-data-tabular">
              PKR {totalGross.toLocaleString()}
            </div>
            <span className="text-xs text-outline font-semibold">Rule: 1.5 × Basic Base</span>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Attendance Deductions
            </span>
            <div className="font-headline-xl text-headline-xl font-bold text-error mt-1 font-data-tabular">
              - PKR {totalDeductions.toLocaleString()}
            </div>
            <span className="text-xs text-outline font-semibold">Absent + 0.5 × Half Days</span>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Income Tax Withholding
            </span>
            <div className="font-headline-xl text-headline-xl font-bold text-on-surface-variant mt-1 font-data-tabular">
              PKR {totalTax.toLocaleString()}
            </div>
            <span className="text-xs text-outline font-semibold">Annual Tax Slabs Applied</span>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Net Payable Disbursements
            </span>
            <div className="font-headline-xl text-headline-xl font-bold text-on-tertiary-container mt-1 font-data-tabular">
              PKR {totalNet.toLocaleString()}
            </div>
            <span className="text-xs text-on-tertiary-container font-semibold">
              {payroll.isFinalized ? 'Ready for Bank Transfer' : 'Draft Estimate'}
            </span>
          </div>

        </div>

        {/* Calculation Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container overflow-hidden">
          <div className="p-space-lg border-b border-surface-container flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Employee-wise Compensation Breakdown
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Per Day rate = Gross ÷ 22 days. Unpaid absences and half-days automatically calculated.
              </p>
            </div>
            <span className="text-xs font-semibold text-secondary">
              Status: {payroll.isFinalized ? 'LOCKED (Immutable)' : 'DRAFT'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase">
                <tr>
                  <th className="p-space-md">Employee</th>
                  <th className="p-space-md">Gross Salary (1.5x)</th>
                  <th className="p-space-md">Per Day Rate</th>
                  <th className="p-space-md">Attendance Deductions</th>
                  <th className="p-space-md">Income Tax Slab</th>
                  <th className="p-space-md text-right">Net Payable</th>
                  <th className="p-space-md text-right">Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container font-body-sm text-body-sm">
                {payroll.records.map(rec => (
                  <tr key={rec.empId} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-space-md font-label-md text-label-md font-bold text-on-surface">
                      {rec.name}
                    </td>

                    <td className="p-space-md font-data-tabular text-data-tabular text-on-surface font-semibold">
                      PKR {rec.gross.toLocaleString()}
                    </td>

                    <td className="p-space-md font-data-tabular text-data-tabular text-outline">
                      PKR {rec.perDay.toLocaleString()}
                    </td>

                    <td className="p-space-md font-data-tabular text-data-tabular font-semibold">
                      {rec.deductions > 0 ? (
                        <span className="text-error">- PKR {rec.deductions.toLocaleString()}</span>
                      ) : (
                        <span className="text-outline">PKR 0</span>
                      )}
                    </td>

                    <td className="p-space-md font-data-tabular text-data-tabular text-on-surface-variant">
                      PKR {(rec.monthlyTax || 0).toLocaleString()}
                    </td>

                    <td className="p-space-md font-data-tabular text-data-tabular font-bold text-on-tertiary-container text-right">
                      PKR {rec.net.toLocaleString()}
                    </td>

                    <td className="p-space-md text-right">
                      <button
                        onClick={() => alert(`Official Payslip PDF for ${rec.name}\nMonth: October 2026\nGross: PKR ${rec.gross.toLocaleString()}\nNet: PKR ${rec.net.toLocaleString()}\n\nDownloaded successfully!`)}
                        className="text-secondary hover:text-secondary-container font-label-md text-label-md font-semibold inline-flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        <span>PDF</span>
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
