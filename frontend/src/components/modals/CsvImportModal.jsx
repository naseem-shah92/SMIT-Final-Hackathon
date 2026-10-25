import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function CsvImportModal({ isOpen, onClose }) {
  const { employees, setEmployees, addAuditLog, currentUser, orgSettings } = useApp();

  const defaultCsv = `code,name,email,department,designation,basic_salary,joining_date
SAY-201,Naveed Ali,naveed@saylani.org,Core Platform Engineering,Senior DevOps Engineer,150000,2026-01-15
SAY-202,Sana Mir,sana@saylani.org,Design & Experience,UI/UX Product Designer,125000,2026-02-01
SAY-999,Test Invalid,invalid-email,Unregistered Department,Staff Member,-5000,not-a-date`;

  const [csvContent, setCsvContent] = useState(defaultCsv);
  const [report, setReport] = useState(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  if (!isOpen) return null;

  const handleRunDryRun = () => {
    const lines = csvContent.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length <= 1) {
      setReport({
        validRows: [],
        errors: [{ row: 1, field: 'file', reason: 'CSV is empty or missing headers' }]
      });
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const headerMap = {};
    headers.forEach((h, i) => { headerMap[h] = i; });

    const requiredFields = ['code', 'name', 'email', 'department', 'designation', 'basic_salary', 'joining_date'];
    const validRows = [];
    const errors = [];

    const existingCodes = new Set(employees.map(e => e.id.toLowerCase()));
    const existingEmails = new Set(employees.map(e => e.email.toLowerCase()));
    const knownDepts = new Set((orgSettings?.departments || ['Core Platform Engineering', 'Human Resources', 'Executive Infrastructure', 'Design & Experience']).map(d => d.toLowerCase()));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

    for (let i = 1; i < lines.length; i++) {
      const rowNum = i + 1;
      const vals = lines[i].split(',').map(v => v.trim());
      if (vals.every(v => v === '')) continue;

      const code = vals[headerMap['code']] || '';
      const name = vals[headerMap['name']] || '';
      const email = vals[headerMap['email']] || '';
      const dept = vals[headerMap['department']] || '';
      const desig = vals[headerMap['designation']] || '';
      const basic = Number(vals[headerMap['basic_salary']]) || 0;
      const joinDate = vals[headerMap['joining_date']] || '';

      let hasRowErr = false;

      // Required check
      for (const req of requiredFields) {
        if (!vals[headerMap[req]]) {
          errors.push({ row: rowNum, field: req, reason: `${req} is required and cannot be empty` });
          hasRowErr = true;
        }
      }

      // Unique code
      if (existingCodes.has(code.toLowerCase())) {
        errors.push({ row: rowNum, field: 'code', reason: `Employee code '${code}' already enrolled` });
        hasRowErr = true;
      }

      // Email format & uniqueness
      if (!emailRegex.test(email)) {
        errors.push({ row: rowNum, field: 'email', reason: `Invalid email address syntax '${email}'` });
        hasRowErr = true;
      } else if (existingEmails.has(email.toLowerCase())) {
        errors.push({ row: rowNum, field: 'email', reason: `Email '${email}' is already registered` });
        hasRowErr = true;
      }

      // Known Dept
      if (dept && !knownDepts.has(dept.toLowerCase())) {
        errors.push({ row: rowNum, field: 'department', reason: `Department '${dept}' not recognized in company directory` });
        hasRowErr = true;
      }

      // Salary > 0
      if (basic <= 0) {
        errors.push({ row: rowNum, field: 'basic_salary', reason: `Basic salary must be greater than 0 (got: ${basic})` });
        hasRowErr = true;
      }

      // ISO Date
      if (joinDate && !isoDateRegex.test(joinDate)) {
        errors.push({ row: rowNum, field: 'joining_date', reason: `Date must be YYYY-MM-DD format (got: '${joinDate}')` });
        hasRowErr = true;
      }

      if (!hasRowErr) {
        validRows.push({
          id: code,
          name,
          email,
          dept,
          role: desig,
          status: 'Active',
          basicSalary: basic,
          grossSalary: Math.round(basic * 1.5),
          joiningDate: joinDate,
          phone: '+92 300 0000000',
          sickLeaveBalance: 8,
          casualLeaveBalance: 10,
          annualLeaveBalance: 14
        });
      }
    }

    setReport({ validRows, errors });
  };

  const handleEnrollValid = () => {
    if (!report || report.validRows.length === 0) return;
    setIsEnrolling(true);
    setTimeout(() => {
      setEmployees(prev => [...prev, ...report.validRows]);
      addAuditLog(
        currentUser.name,
        'CSV_BULK_ENROLLMENT',
        'Employees',
        null,
        { count: report.validRows.length },
        `Enrolled ${report.validRows.length} employees via CSV dry-run batch import.`
      );
      setIsEnrolling(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl border border-surface-container max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-secondary text-[24px]">upload_file</span>
            <div>
              <h3 className="font-bold text-base text-on-surface">CSV Bulk Import with Dry-Run Validation</h3>
              <p className="text-xs text-on-surface-variant">Checks required fields, unique email/code, salary &gt; 0, and ISO dates</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Paste CSV Data (or test with pre-filled sample):
            </label>
            <textarea
              rows={5}
              value={csvContent}
              onChange={e => setCsvContent(e.target.value)}
              className="w-full text-xs font-mono p-3 rounded-lg border border-surface-container bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleRunDryRun}
              type="button"
              className="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-bold text-xs hover:bg-secondary-container transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">fact_check</span>
              <span>Execute Dry-Run Analysis</span>
            </button>

            {report && (
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  ✓ {report.validRows.length} Valid Row(s)
                </span>
                {report.errors.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold">
                    ✕ {report.errors.length} Error(s) Detected
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Validation Report Table */}
          {report && (
            <div className="space-y-3 pt-2 border-t border-surface-container">
              {report.errors.length > 0 ? (
                <div>
                  <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
                    Dry-Run Error Report (Rejected Rows):
                  </h4>
                  <div className="border border-rose-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-rose-50 text-rose-900 font-bold border-b border-rose-200">
                        <tr>
                          <th className="px-3 py-2">Row #</th>
                          <th className="px-3 py-2">Field</th>
                          <th className="px-3 py-2">Reason for Rejection</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-rose-100 bg-white">
                        {report.errors.map((err, idx) => (
                          <tr key={idx} className="hover:bg-rose-50/50">
                            <td className="px-3 py-2 font-mono font-bold text-rose-600">Row {err.row}</td>
                            <td className="px-3 py-2 font-mono text-on-surface">{err.field}</td>
                            <td className="px-3 py-2 text-rose-700">{err.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>100% of tested rows passed all enterprise schema constraints!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container"
          >
            Cancel
          </button>

          <button
            onClick={handleEnrollValid}
            disabled={!report || report.validRows.length === 0 || isEnrolling}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
              report && report.validRows.length > 0 && !isEnrolling
                ? 'bg-primary text-on-primary hover:bg-primary-container cursor-pointer'
                : 'bg-surface-container text-outline cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">group_add</span>
            <span>{isEnrolling ? 'Enrolling...' : `Enroll ${report?.validRows?.length || 0} Valid Employees`}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
