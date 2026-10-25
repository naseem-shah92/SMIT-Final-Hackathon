import React from 'react';
import { useApp } from '../../context/AppContext';

export default function HRAttendancePage() {
  const {
    attendance,
    corrections,
    approveCorrection,
    rejectCorrection
  } = useApp();

  const pendingCorrections = corrections.filter(c => c.status === 'Pending');

  return (
    <div className="flex flex-col w-full">
      <div className="px-8 py-6 space-y-6 max-w-[1680px] mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                Time &amp; Labor Operations · Daily Rosters
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-data-tabular">
                Shift: 09:00 - 18:00 · Grace Limit: 09:15 AM
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              Daily Attendance &amp; Shift Telemetry
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-surface-container font-label-md text-label-md text-on-surface flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
              <span>150m Geo-fenced · Camera Verified</span>
            </span>
          </div>
        </div>

        {/* Section 1: Attendance Correction Requests Queue (Module M4, Checklist #12) */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container overflow-hidden">
          <div className="p-space-lg border-b border-surface-container flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">pending_actions</span>
                Attendance Correction Requests
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Employees can submit check-in time correction requests with reasoning for HR review.
              </p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-data-tabular ${
              pendingCorrections.length > 0 ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-outline'
            }`}>
              {pendingCorrections.length} Pending Correction{pendingCorrections.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="divide-y divide-surface-container">
            {corrections.length === 0 ? (
              <div className="p-6 text-center text-xs text-outline font-body-sm">
                No attendance correction requests submitted.
              </div>
            ) : (
              corrections.map(corr => (
                <div key={corr.id} className="p-space-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-container-low/40 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-label-lg text-label-lg font-bold text-on-surface">{corr.name}</span>
                      <span className="font-mono text-xs text-outline">({corr.empId})</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-surface-container-high text-secondary border border-surface-container">
                        Date: {corr.date}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        corr.status === 'Approved'
                          ? 'bg-surface-container text-on-tertiary-container'
                          : corr.status === 'Rejected'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-surface-container-high text-secondary'
                      }`}>
                        {corr.status}
                      </span>
                    </div>

                    <div className="text-xs text-on-surface-variant flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span><strong>Original Log:</strong> <span className="text-error font-data-tabular">{corr.originalCheckIn}</span></span>
                      <span><strong>Proposed Time:</strong> <span className="text-on-tertiary-container font-data-tabular font-bold">{corr.proposedCheckIn}</span></span>
                      <span><strong>Reason:</strong> "{corr.reason}"</span>
                    </div>
                  </div>

                  {corr.status === 'Pending' ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => approveCorrection(corr.id)}
                        className="h-8 px-3.5 bg-secondary text-on-secondary hover:bg-secondary-container rounded-lg font-label-sm text-label-sm font-bold transition-all shadow-xs flex items-center gap-1"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">check</span>
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => rejectCorrection(corr.id)}
                        className="h-8 px-3.5 bg-surface-container hover:bg-error-container hover:text-on-error-container text-on-surface rounded-lg font-label-sm text-label-sm font-bold transition-all border border-surface-container-high"
                        type="button"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs font-bold text-on-tertiary-container flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>Resolved ({corr.status})</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 2: Daily Attendance Telemetry Board (Module M4, Checklist #10 & #11) */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container overflow-hidden">
          <div className="p-space-lg border-b border-surface-container flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">timer</span>
                Daily Attendance Roster
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Automated status rules: Late flagged after 09:15 AM. Under 5 hours logged recorded as Half Day.
              </p>
            </div>
            <span className="text-xs font-semibold text-outline font-data-tabular">Date: 24 October 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase">
                <tr>
                  <th className="p-space-md">Employee</th>
                  <th className="p-space-md">Check-In</th>
                  <th className="p-space-md">Check-Out</th>
                  <th className="p-space-md">Hours Logged</th>
                  <th className="p-space-md">Calculated Status</th>
                  <th className="p-space-md">Verification Source</th>
                  <th className="p-space-md text-right">Lateness / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container font-body-sm text-body-sm">
                {attendance.map(att => (
                  <tr key={att.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-space-md">
                      <div className="font-label-md text-label-md font-bold text-on-surface">{att.name}</div>
                      <div className="text-[11px] text-outline font-data-tabular">{att.dept} · {att.empId}</div>
                    </td>

                    <td className="p-space-md font-data-tabular text-data-tabular font-bold">
                      <span className={att.status === 'Late' ? 'text-secondary font-bold' : 'text-on-surface'}>
                        {att.checkIn}
                      </span>
                    </td>

                    <td className="p-space-md font-data-tabular text-data-tabular text-on-surface-variant">
                      {att.checkOut}
                    </td>

                    <td className="p-space-md font-data-tabular text-data-tabular text-on-surface">
                      {att.hoursLogged}h
                    </td>

                    <td className="p-space-md">
                      <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${
                        att.status === 'Present'
                          ? 'bg-surface-container text-on-tertiary-container'
                          : att.status === 'Late'
                          ? 'bg-surface-container-high text-secondary border border-surface-container'
                          : att.status === 'Half Day'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-surface-container text-outline'
                      }`}>
                        {att.status}
                      </span>
                    </td>

                    <td className="p-space-md text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                          {att.source.includes('Camera') ? 'photo_camera' : 'language'}
                        </span>
                        <span>{att.source}</span>
                      </span>
                    </td>

                    <td className="p-space-md text-right font-data-tabular text-xs">
                      {att.status === 'Late' ? (
                        <span className="text-secondary font-semibold">Arrived after 09:15 AM</span>
                      ) : att.status === 'Half Day' ? (
                        <span className="text-error font-semibold">&lt; 5.0h threshold</span>
                      ) : (
                        <span className="text-on-tertiary-container font-semibold">On Time (Grace OK)</span>
                      )}
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
