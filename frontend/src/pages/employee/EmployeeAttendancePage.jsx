import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function EmployeeAttendancePage() {
  const {
    currentUser,
    attendance,
    markCheckIn,
    markCheckOut,
    requestAttendanceCorrection,
    setIsBiometricCheckinOpen
  } = useApp();

  const [proposedTime, setProposedTime] = useState('09:05 AM');
  const [reason, setReason] = useState('Biometric camera queue lag in lobby');
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);

  const myRecords = attendance.filter(a => a.empId === currentUser?.empId);
  const myToday = myRecords.find(a => a.date === '2026-10-24');

  const handleCorrectionSubmit = (e) => {
    e.preventDefault();
    if (!myToday) return;
    requestAttendanceCorrection(myToday.id, proposedTime, reason);
    setShowCorrectionForm(false);
    alert('Attendance correction request submitted to HR inbox with reason!');
  };

  return (
    <div className="flex flex-col w-full">
      <div className="px-8 py-6 space-y-6 max-w-[1280px] mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                Time &amp; Labor · Attendance Clock
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-data-tabular">
                Check-in/out, Camera &amp; Corrections
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              Attendance, Camera Check-In &amp; Corrections
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBiometricCheckinOpen(true)}
              className="h-10 px-4 bg-secondary text-on-secondary hover:bg-secondary-container rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              <span>Open Camera Check-In</span>
            </button>
          </div>
        </div>

        {/* Real-time Status Card */}
        <div className="p-6 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <div>
              <span className="text-xs uppercase font-bold text-secondary">Today: 24 October 2026</span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-0.5">
                Current Shift Status: {myToday ? myToday.status : 'No Check-In Recorded'}
              </h3>
            </div>
            {myToday && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-surface-container text-on-surface">
                Source: {myToday.source}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-surface-container-low rounded-lg">
              <span className="text-outline block">Check-In Time</span>
              <strong className="text-base text-on-surface font-data-tabular">{myToday?.checkIn || '--'}</strong>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg">
              <span className="text-outline block">Check-Out Time</span>
              <strong className="text-base text-on-surface font-data-tabular">{myToday?.checkOut || '--'}</strong>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg">
              <span className="text-outline block">Hours Logged</span>
              <strong className="text-base text-on-surface font-data-tabular">{myToday?.hoursLogged || 0} Hours</strong>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              {!myToday || myToday.checkIn === '--' ? (
                <button
                  onClick={() => markCheckIn('web')}
                  className="h-9 px-4 bg-on-tertiary-container text-on-tertiary rounded-lg font-bold text-xs shadow-xs"
                >
                  Mark Web Check-In
                </button>
              ) : myToday.checkOut === '--' ? (
                <button
                  onClick={markCheckOut}
                  className="h-9 px-4 bg-primary text-on-primary rounded-lg font-bold text-xs shadow-xs"
                >
                  Mark Check-Out
                </button>
              ) : (
                <span className="text-xs text-on-tertiary-container font-bold">Shift Completed</span>
              )}
            </div>

            {myToday && myToday.status === 'Late' && (
              <button
                onClick={() => setShowCorrectionForm(!showCorrectionForm)}
                className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
                <span>Request Attendance Correction with Reason</span>
              </button>
            )}
          </div>

          {/* Attendance Correction Form (Checklist #11) */}
          {showCorrectionForm && (
            <form onSubmit={handleCorrectionSubmit} className="mt-4 p-4 rounded-xl bg-surface-container-high border border-surface-container space-y-3 text-xs animate-in fade-in">
              <h4 className="font-bold text-on-surface">Request Attendance Correction (HR Approval Required)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-on-surface-variant mb-1 font-semibold">Proposed Check-In Time</label>
                  <input
                    type="text"
                    value={proposedTime}
                    onChange={e => setProposedTime(e.target.value)}
                    className="w-full h-8 px-2.5 rounded bg-surface border border-outline-variant text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-on-surface-variant mb-1 font-semibold">Reason for Correction</label>
                  <input
                    type="text"
                    required
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="State justification for correction..."
                    className="w-full h-8 px-2.5 rounded bg-surface border border-outline-variant text-on-surface"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowCorrectionForm(false)} className="h-8 px-3 rounded text-on-surface-variant">Cancel</button>
                <button type="submit" className="h-8 px-4 bg-secondary text-on-secondary rounded font-bold">Submit to HR</button>
              </div>
            </form>
          )}

        </div>

        {/* Attendance Calendar & History (Checklist #10) */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container overflow-hidden">
          <div className="p-space-lg border-b border-surface-container">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              My Attendance History
            </h3>
            <p className="text-xs text-on-surface-variant">
              Every day stamped by server. Only you can read your records (Employee Data-Scope Guard).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low border-b border-surface-container text-on-surface-variant font-label-sm uppercase">
                <tr>
                  <th className="p-space-md">Date</th>
                  <th className="p-space-md">Check-In</th>
                  <th className="p-space-md">Check-Out</th>
                  <th className="p-space-md">Hours Logged</th>
                  <th className="p-space-md">Calculated Status</th>
                  <th className="p-space-md">Verification Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container font-body-sm">
                {myRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-surface-container-low/50">
                    <td className="p-space-md font-bold text-on-surface font-data-tabular">{rec.date}</td>
                    <td className="p-space-md font-data-tabular">{rec.checkIn}</td>
                    <td className="p-space-md font-data-tabular">{rec.checkOut}</td>
                    <td className="p-space-md font-data-tabular">{rec.hoursLogged}h</td>
                    <td className="p-space-md">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        rec.status === 'Present'
                          ? 'bg-surface-container text-on-tertiary-container'
                          : rec.status === 'Late'
                          ? 'bg-surface-container-high text-secondary border border-surface-container'
                          : 'bg-error-container text-on-error-container'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="p-space-md text-outline uppercase text-[10px]">{rec.source}</td>
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
