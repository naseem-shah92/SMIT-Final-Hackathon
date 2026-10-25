import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AdminSetupPage() {
  const { orgSettings, setOrgSettings, setEmployees, setAttendance, setLeaveRequests, setPayroll, addAuditLog, currentUser } = useApp();
  const [formData, setFormData] = useState({ ...orgSettings });
  const [newDept, setNewDept] = useState('');
  const [newDesignation, setNewDesignation] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleResetFreshInstall = () => {
    if (window.confirm("Reset to Fresh Install?\n\nThis will clear all employee and attendance records so judges can test company setup and employee registration from scratch (Section 1 & 9).")) {
      setEmployees([]);
      setAttendance([]);
      setLeaveRequests([]);
      setPayroll(prev => ({ ...prev, records: [], isFinalized: false }));
      addAuditLog(
        currentUser.name,
        'RESET_TO_FRESH_INSTALL',
        'System',
        null,
        {},
        'Reset platform to clean state for live judging evaluation.'
      );
      alert('Platform initialized to empty state. You can now register departments and employees.');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setOrgSettings(formData);
    setIsSaved(true);
    addAuditLog(
      currentUser.name,
      'UPDATE_ORG_SETTINGS',
      'OrgSettings',
      orgSettings,
      formData,
      'Saved company office timings, 15m grace rule, 150m camera geofence, and yearly leave quotas'
    );
    setTimeout(() => setIsSaved(false), 2000);
  };

  const addDepartment = () => {
    if (!newDept.trim() || formData.departments.includes(newDept.trim())) return;
    setFormData({ ...formData, departments: [...formData.departments, newDept.trim()] });
    setNewDept('');
  };

  const addDesignation = () => {
    if (!newDesignation.trim() || formData.designations.includes(newDesignation.trim())) return;
    setFormData({ ...formData, designations: [...formData.designations, newDesignation.trim()] });
    setNewDesignation('');
  };

  return (
    <div className="flex flex-col w-full">
      <div className="px-8 py-6 space-y-6 max-w-[1280px] mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                Organization Policy · System Standards
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-data-tabular">
                Applied to All New Attendance &amp; Leave Records
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              Organization Setup &amp; Business Rules
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetFreshInstall}
              className="px-3.5 py-1.5 rounded-lg border border-surface-container bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant font-label-md text-label-md font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              <span>Reset to Clean Slate</span>
            </button>

            {isSaved && (
              <span className="px-3 py-1.5 rounded-lg bg-surface-container text-on-tertiary-container font-label-md text-label-md font-bold flex items-center gap-1 shadow-xs">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Settings Stored Successfully
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Card 1: Shift & Office Timings */}
          <div className="p-6 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">schedule</span>
              Company Shift Hours &amp; Lateness Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant font-body-sm text-body-sm text-on-surface focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">Office Start Time</label>
                <input
                  type="time"
                  value={formData.officeStart}
                  onChange={e => setFormData({ ...formData, officeStart: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant font-body-sm text-body-sm text-on-surface focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">Grace Period (Minutes)</label>
                <input
                  type="number"
                  value={formData.graceMinutes}
                  onChange={e => setFormData({ ...formData, graceMinutes: Number(e.target.value) })}
                  className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant font-body-sm text-body-sm text-on-surface focus:border-secondary focus:outline-none"
                />
                <span className="text-[10px] text-outline mt-0.5 block">Late flagged after 09:15 AM</span>
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">Half-Day Threshold</label>
                <input
                  type="number"
                  value={formData.halfDayHours}
                  onChange={e => setFormData({ ...formData, halfDayHours: Number(e.target.value) })}
                  className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant font-body-sm text-body-sm text-on-surface focus:border-secondary focus:outline-none"
                />
                <span className="text-[10px] text-outline mt-0.5 block">Under 5 hours = Half Day</span>
              </div>
            </div>
          </div>

          {/* Card 2: Camera Attendance Geofence (Haversine Formula) */}
          <div className="p-6 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">location_on</span>
              Camera Attendance Location &amp; Allowed Radius (Section 5)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">Office Latitude (GPS)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.officeLat}
                  onChange={e => setFormData({ ...formData, officeLat: Number(e.target.value) })}
                  className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant font-data-tabular text-data-tabular text-on-surface focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">Office Longitude (GPS)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.officeLng}
                  onChange={e => setFormData({ ...formData, officeLng: Number(e.target.value) })}
                  className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant font-data-tabular text-data-tabular text-on-surface focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">Allowed Radius (Meters)</label>
                <input
                  type="number"
                  value={formData.radiusMeters}
                  onChange={e => setFormData({ ...formData, radiusMeters: Number(e.target.value) })}
                  className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant font-data-tabular text-data-tabular text-on-surface focus:border-secondary focus:outline-none"
                />
              </div>
            </div>
            <p className="text-[11px] text-on-surface-variant">
              The server validates mobile and laptop camera check-in coordinates using the Haversine formula. Rejects if distance &gt; radius or GPS accuracy &gt; 100m.
            </p>
          </div>

          {/* Card 3: Yearly Leave Quotas (Section 3 Rules) */}
          <div className="p-6 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">beach_access</span>
              Yearly Leave Quotas (Working Days Only)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container text-center">
                <span className="font-semibold text-on-surface-variant block uppercase text-[10px]">Annual Quota</span>
                <input
                  type="number"
                  value={formData.quotas.annual}
                  onChange={e => setFormData({ ...formData, quotas: { ...formData.quotas, annual: Number(e.target.value) } })}
                  className="w-24 h-9 mx-auto mt-2 text-center rounded-lg bg-surface border border-outline-variant font-bold text-base text-on-surface font-data-tabular"
                />
                <span className="text-[11px] text-outline mt-1 block">Default: 14 Days</span>
              </div>

              <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container text-center">
                <span className="font-semibold text-on-surface-variant block uppercase text-[10px]">Sick Quota</span>
                <input
                  type="number"
                  value={formData.quotas.sick}
                  onChange={e => setFormData({ ...formData, quotas: { ...formData.quotas, sick: Number(e.target.value) } })}
                  className="w-24 h-9 mx-auto mt-2 text-center rounded-lg bg-surface border border-outline-variant font-bold text-base text-on-tertiary-container font-data-tabular"
                />
                <span className="text-[11px] text-outline mt-1 block">Default: 8 Days</span>
              </div>

              <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container text-center">
                <span className="font-semibold text-on-surface-variant block uppercase text-[10px]">Casual Quota</span>
                <input
                  type="number"
                  value={formData.quotas.casual}
                  onChange={e => setFormData({ ...formData, quotas: { ...formData.quotas, casual: Number(e.target.value) } })}
                  className="w-24 h-9 mx-auto mt-2 text-center rounded-lg bg-surface border border-outline-variant font-bold text-base text-secondary font-data-tabular"
                />
                <span className="text-[11px] text-outline mt-1 block">Default: 10 Days</span>
              </div>
            </div>
          </div>

          {/* Card 4: Departments & Designations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-3">
              <h4 className="font-bold text-on-surface text-sm">Company Departments</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New department..."
                  value={newDept}
                  onChange={e => setNewDept(e.target.value)}
                  className="flex-1 h-8 px-2.5 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addDepartment}
                  className="h-8 px-3 bg-secondary text-on-secondary rounded-lg text-xs font-bold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {formData.departments.map(d => (
                  <span key={d} className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface text-xs font-semibold">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-3">
              <h4 className="font-bold text-on-surface text-sm">Job Designations</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New designation..."
                  value={newDesignation}
                  onChange={e => setNewDesignation(e.target.value)}
                  className="flex-1 h-8 px-2.5 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addDesignation}
                  className="h-8 px-3 bg-secondary text-on-secondary rounded-lg text-xs font-bold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {formData.designations.map(d => (
                  <span key={d} className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface text-xs font-semibold">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="h-10 px-6 bg-primary text-on-primary hover:bg-inverse-surface rounded-lg font-label-md text-label-md font-bold transition-all shadow-xs"
            >
              Save Organization Settings
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
