import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AddEmployeeModal() {
  const { isAddEmployeeOpen, setIsAddEmployeeOpen, addEmployee } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Frontend Engineer',
    dept: 'Core Platform Engineering',
    basicSalary: 80000
  });

  if (!isAddEmployeeOpen) return null;

  const basic = Number(formData.basicSalary) || 0;
  const gross = Math.round(basic * 1.5);
  const hra = Math.round(basic * 0.4);
  const med = Math.round(basic * 0.1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill out Name and Email.');
      return;
    }
    addEmployee(formData);
    setIsAddEmployeeOpen(false);
    setFormData({
      name: '',
      email: '',
      role: 'Frontend Engineer',
      dept: 'Core Platform Engineering',
      basicSalary: 80000
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-lg border border-surface-container-high overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-space-lg py-space-md bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[22px]">person_add</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Register New Employee (M3)
            </h3>
          </div>
          <button
            onClick={() => setIsAddEmployeeOpen(false)}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-space-lg space-y-space-md">
          
          <div className="grid grid-cols-2 gap-space-md">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Farhan Tariq"
                className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-on-surface font-body-sm text-body-sm focus:border-secondary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                Work Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="farhan.t@acme.corp"
                className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-on-surface font-body-sm text-body-sm focus:border-secondary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-space-md">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                Department
              </label>
              <select
                value={formData.dept}
                onChange={e => setFormData({ ...formData, dept: e.target.value })}
                className="w-full h-9 px-2 rounded-lg bg-surface border border-outline-variant text-on-surface font-body-sm text-body-sm focus:border-secondary focus:outline-none"
              >
                <option value="Core Platform Engineering">Core Platform Engineering</option>
                <option value="Executive Infrastructure">Executive Infrastructure</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Design & Experience">Design & Experience</option>
                <option value="Finance & Operations">Finance & Operations</option>
              </select>
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                Designation / Job Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. QA Automation Engineer"
                className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-on-surface font-body-sm text-body-sm focus:border-secondary focus:outline-none"
              />
            </div>
          </div>

          {/* Salary Formula Box */}
          <div className="p-space-md bg-surface-container-low rounded-xl border border-surface-container-high space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-label-sm text-label-sm text-on-surface font-bold uppercase tracking-wider">
                Base Basic Salary (PKR)
              </label>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                Gross Rule: 1.5 × Basic
              </span>
            </div>
            
            <input
              type="number"
              min="10000"
              step="5000"
              value={formData.basicSalary}
              onChange={e => setFormData({ ...formData, basicSalary: e.target.value })}
              className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-data-tabular text-data-tabular font-bold focus:border-secondary focus:outline-none"
            />

            <div className="pt-2 border-t border-surface-container flex items-center justify-between text-xs">
              <div className="text-on-surface-variant">
                <span>HRA (40%): <strong>PKR {hra.toLocaleString()}</strong></span> · 
                <span className="ml-1">Med (10%): <strong>PKR {med.toLocaleString()}</strong></span>
              </div>
              <div className="font-bold text-on-tertiary-container font-data-tabular">
                Gross: PKR {gross.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Temporary Password Notice (Section 2 rule) */}
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-container text-[11px] text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-secondary shrink-0 mt-0.5">info</span>
            <span>
              Registration will automatically create the user account with a temporary password. The employee will be prompted to change it upon first sign-in.
            </span>
          </div>

          {/* Modal Actions */}
          <div className="pt-space-sm flex items-center justify-end gap-space-sm border-t border-surface-container">
            <button
              type="button"
              onClick={() => setIsAddEmployeeOpen(false)}
              className="h-9 px-space-md rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-space-md bg-secondary text-on-secondary hover:bg-secondary-container rounded-lg font-label-md text-label-md font-bold transition-all shadow-xs"
            >
              Confirm & Create Login
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
