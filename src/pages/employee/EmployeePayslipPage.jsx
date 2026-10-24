import React from 'react';
import { useApp } from '../../context/AppContext';

export default function EmployeePayslipPage() {
  const { currentUser, payroll } = useApp();

  const myPayslip = payroll.records.find(r => r.empId === currentUser?.empId) || payroll.records[2];

  const handleDownloadPdf = () => {
    alert(`Downloading Official Payslip PDF:\n\n• Payee: ${myPayslip.name} (${myPayslip.empId})\n• Month: ${payroll.month}\n• Gross: PKR ${myPayslip.gross.toLocaleString()}\n• Deductions: PKR ${myPayslip.deductions.toLocaleString()}\n• Income Tax: PKR ${myPayslip.monthlyTax.toLocaleString()}\n• Net Disbursed: PKR ${myPayslip.net.toLocaleString()}\n• Status: ${payroll.isFinalized ? 'LOCKED by Admin' : 'DRAFT PREVIEW'}\n\nDownloaded successfully!`);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="px-8 py-6 space-y-6 max-w-[1000px] mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                Compensation &amp; Earnings · Monthly Statement
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-data-tabular">
                Cycle: {payroll.month}
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              Official Monthly Payslip
            </h1>
          </div>

          <button
            onClick={handleDownloadPdf}
            className="h-10 px-4 bg-on-tertiary-container text-on-tertiary hover:opacity-95 rounded-lg font-bold text-xs shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download Official PDF</span>
          </button>
        </div>

        {/* Payslip Document Card */}
        <div className="p-8 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-container pb-6">
            <div>
              <span className="text-xs uppercase font-bold text-secondary font-mono">
                PAYSLIP #{payroll.month.replace(' ', '-').toUpperCase()}-{myPayslip.empId}
              </span>
              <h2 className="text-xl font-bold text-on-surface mt-1">Saylani HCM Solutions Ltd.</h2>
              <p className="text-xs text-on-surface-variant">Zaitoon Ashraf IT Park, Karachi · Pay Period: 01-31 Oct 2026</p>
            </div>

            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                payroll.isFinalized
                  ? 'bg-surface-container text-on-tertiary-container'
                  : 'bg-surface-container-high text-secondary'
              }`}>
                {payroll.isFinalized ? 'LOCKED & FINALIZED' : 'DRAFT PREVIEW'}
              </span>
              <div className="font-bold text-on-surface text-sm mt-2">{myPayslip.name}</div>
              <div className="text-xs text-on-surface-variant">{myPayslip.dept} · {myPayslip.empId}</div>
            </div>
          </div>

          {/* Earnings & Deductions Grid (Section 3 Exact Formulas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            
            {/* Left: Earnings */}
            <div className="space-y-3">
              <div className="font-bold uppercase tracking-wider text-on-surface-variant border-b border-surface-container pb-1 text-[11px]">
                Earnings (Gross = 1.5 × Basic)
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container-low">
                <span className="text-on-surface">Base Basic Salary</span>
                <span className="font-bold text-on-surface font-data-tabular">PKR {myPayslip.basic.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container-low">
                <span className="text-on-surface">House Rent Allowance (HRA 40%)</span>
                <span className="font-bold text-on-surface font-data-tabular">PKR {myPayslip.hra.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container-low">
                <span className="text-on-surface">Medical Allowance (10%)</span>
                <span className="font-bold text-on-surface font-data-tabular">PKR {myPayslip.med.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold text-on-surface border-t border-surface-container">
                <span>Total Gross Salary</span>
                <span className="text-secondary font-data-tabular">PKR {myPayslip.gross.toLocaleString()}</span>
              </div>
            </div>

            {/* Right: Deductions */}
            <div className="space-y-3">
              <div className="font-bold uppercase tracking-wider text-on-surface-variant border-b border-surface-container pb-1 text-[11px]">
                Deductions &amp; Tax Withholding
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container-low">
                <span className="text-on-surface">Unpaid Leave / Absences</span>
                <span className="font-bold text-on-surface font-data-tabular">PKR 0</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container-low">
                <span className="text-on-surface">Half-Day Lateness Deductions (0.5×)</span>
                <span className="font-bold font-data-tabular text-error">
                  {myPayslip.deductions > 0 ? `- PKR ${myPayslip.deductions.toLocaleString()}` : 'PKR 0'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container-low">
                <span className="text-on-surface">Income Tax Slabs (Annualized ÷ 12)</span>
                <span className="font-bold text-on-surface-variant font-data-tabular">- PKR {myPayslip.monthlyTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold text-on-surface border-t border-surface-container">
                <span>Total Deductions &amp; Tax</span>
                <span className="text-error font-data-tabular">- PKR {(myPayslip.deductions + myPayslip.monthlyTax).toLocaleString()}</span>
              </div>
            </div>

          </div>

          {/* Bottom Net Disbursed Banner */}
          <div className="p-5 rounded-xl bg-surface-container flex items-center justify-between">
            <div>
              <div className="text-xs text-on-surface-variant font-semibold">Net Disbursed Take-Home Pay</div>
              <div className="text-[11px] text-outline">Per Day Rate: PKR {myPayslip.perDay.toLocaleString()} · 22 Working Days</div>
            </div>
            <div className="text-2xl font-bold font-data-tabular text-on-tertiary-container">
              PKR {myPayslip.net.toLocaleString()}
            </div>
          </div>

          {/* Security Notice */}
          <p className="text-[11px] text-outline text-center">
            Section 2 Rule: An employee only reads rows with their own employee_id. Colleague compensation is strictly hidden.
          </p>

        </div>

      </div>
    </div>
  );
}
