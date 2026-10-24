import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function HREmployeesPage() {
  const { employees, setIsAddEmployeeOpen, addAuditLog } = useApp();
  const [filterDept, setFilterDept] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = employees.filter(emp => {
    const matchesDept = filterDept === 'ALL' || emp.dept === filterDept;
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
                          emp.email.toLowerCase().includes(search.toLowerCase()) ||
                          emp.id.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleCsvDryRun = () => {
    alert("CSV Dry-Run Validation Report:\n\n• Row 1: Validated EMP-0991 (Naveed Ali) -> OK\n• Row 2: Validated EMP-0992 (Sana Mir) -> OK\n• Validation checks: unique code/email, valid ISO date, salary > 0, required fields.\n\nResult: 2 valid records ready for batch enrollment!");
    addAuditLog('Zubair Khan (HR)', 'CSV_DRY_RUN', 'Executed CSV import dry-run for 2 employee rows. Zero errors detected.');
  };

  return (
    <div className="flex flex-col w-full">
      <div className="px-8 py-6 space-y-6 max-w-[1680px] mx-auto w-full">
        
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                Workforce Management · Talent Directory
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-data-tabular">
                {employees.length} Enrolled Employees
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              Employee Directory &amp; Salary Structures
            </h1>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={handleCsvDryRun}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all shadow-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              <span>CSV Dry-Run Import</span>
            </button>

            <button
              onClick={() => setIsAddEmployeeOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container transition-all shadow-xs font-label-md text-label-md font-bold"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>+ Register Employee</span>
            </button>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'Core Platform Engineering', 'Human Resources', 'Executive Infrastructure', 'Design & Experience'].map(dept => (
              <button
                key={dept}
                onClick={() => setFilterDept(dept)}
                className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm whitespace-nowrap transition-all ${
                  filterDept === dept
                    ? 'bg-secondary text-on-secondary font-bold shadow-xs'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {dept === 'ALL' ? 'All Departments' : dept}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, ID or email..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface border border-outline-variant text-on-surface font-body-sm text-body-sm focus:border-secondary focus:outline-none"
            />
          </div>

        </div>

        {/* Directory Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase">
                <tr>
                  <th className="p-space-md">Employee</th>
                  <th className="p-space-md">Department</th>
                  <th className="p-space-md">Base Basic</th>
                  <th className="p-space-md">Gross Salary (1.5x)</th>
                  <th className="p-space-md">Leave Quotas</th>
                  <th className="p-space-md">Status</th>
                  <th className="p-space-md text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container font-body-sm text-body-sm">
                {filtered.map(emp => (
                  <tr key={emp.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-space-md">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-surface-container-high text-secondary flex items-center justify-center font-bold text-xs shadow-xs">
                          {emp.avatar}
                        </div>
                        <div>
                          <div className="font-label-md text-label-md font-bold text-on-surface">
                            {emp.name}
                          </div>
                          <div className="font-data-tabular text-data-tabular text-outline text-[11px]">
                            {emp.id} · {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-space-md">
                      <div className="font-semibold text-on-surface">{emp.role}</div>
                      <div className="text-xs text-on-surface-variant">{emp.dept}</div>
                    </td>

                    <td className="p-space-md font-data-tabular text-data-tabular text-on-surface font-semibold">
                      PKR {emp.basicSalary.toLocaleString()}
                    </td>

                    <td className="p-space-md font-data-tabular text-data-tabular text-on-tertiary-container font-bold">
                      PKR {emp.grossSalary.toLocaleString()}
                    </td>

                    <td className="p-space-md font-data-tabular text-data-tabular text-xs">
                      <span className="text-secondary font-semibold">{emp.annualLeaveBalance}d Ann</span> · 
                      <span className="text-on-tertiary-container font-semibold ml-1">{emp.sickLeaveBalance}d Sick</span> · 
                      <span className="text-on-surface-variant font-semibold ml-1">{emp.casualLeaveBalance}d Cas</span>
                    </td>

                    <td className="p-space-md">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-tertiary-container font-label-sm text-label-sm font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span>
                        Active
                      </span>
                    </td>

                    <td className="p-space-md text-right">
                      <button
                        onClick={() => alert(`Employee Details: ${emp.name}\nRole: ${emp.role}\nDepartment: ${emp.dept}\nGross: PKR ${emp.grossSalary.toLocaleString()}`)}
                        className="text-secondary hover:text-secondary-container font-label-md text-label-md font-semibold"
                      >
                        Details →
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
