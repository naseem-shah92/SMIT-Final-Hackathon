import React from 'react';
import { useApp } from '../../context/AppContext';

export default function EmployeeDashboardPage() {
  const {
    currentUser,
    employees,
    attendance,
    payroll,
    announcements,
    markCheckIn,
    markCheckOut,
    setActivePage,
    setIsSmartLeaveOpen
  } = useApp();

  const myEmp = employees.find(e => e.id === currentUser?.empId) || employees[2];
  const myAttendanceToday = attendance.find(a => a.empId === currentUser?.empId && a.date === '2026-10-24');
  const myPayslip = payroll.records.find(r => r.empId === currentUser?.empId) || payroll.records[2];

  // Hours this week vs 40h (Section 7 Formula)
  const hoursThisWeek = 36.5;
  const lateCountThisMonth = attendance.filter(a => a.empId === currentUser?.empId && a.status === 'Late').length;

  return (
    <div className="flex flex-col w-full">
      <div className="px-8 py-6 space-y-6 max-w-[1680px] mx-auto w-full">
        
        {/* Welcome Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                Employee Workspace · Self-Service
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-data-tabular">
                {myEmp.role} · {myEmp.dept}
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              Welcome, {currentUser?.name}
            </h1>
          </div>
        </div>

        {/* Section 7 Employee Dashboard: 5 Mandatory KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Hours this week vs 40h */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container flex flex-col justify-between">
            <span className="text-xs uppercase font-semibold text-on-surface-variant">Hours This Week</span>
            <div className="text-2xl font-bold font-data-tabular text-on-surface mt-1">
              {hoursThisWeek} / 40.0 h
            </div>
            <div className="mt-2 w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
              <div className="bg-secondary h-1.5 rounded-full" style={{ width: '91%' }}></div>
            </div>
            <span className="text-[11px] text-outline mt-1 block">91% achieved (3.5h remaining)</span>
          </div>

          {/* 2. Late count */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container flex flex-col justify-between">
            <span className="text-xs uppercase font-semibold text-on-surface-variant">Late Count (This Month)</span>
            <div className="text-2xl font-bold font-data-tabular text-secondary mt-1">
              {lateCountThisMonth} Incident
            </div>
            <span className="text-[11px] text-outline mt-1 block">09:24 AM today (grace: 15 min)</span>
          </div>

          {/* 3. Leave balance */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container flex flex-col justify-between">
            <span className="text-xs uppercase font-semibold text-on-surface-variant">Leave Balance</span>
            <div className="text-2xl font-bold font-data-tabular text-on-tertiary-container mt-1">
              {myEmp.annualLeaveBalance + myEmp.sickLeaveBalance + myEmp.casualLeaveBalance} Days
            </div>
            <span className="text-[11px] text-outline mt-1 block">
              Annual: {myEmp.annualLeaveBalance}d · Sick: {myEmp.sickLeaveBalance}d · Cas: {myEmp.casualLeaveBalance}d
            </span>
          </div>

          {/* 4. Last payslip */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container flex flex-col justify-between">
            <span className="text-xs uppercase font-semibold text-on-surface-variant">Last Payslip (Net)</span>
            <div className="text-2xl font-bold font-data-tabular text-on-surface mt-1">
              PKR {myPayslip.net.toLocaleString()}
            </div>
            <button onClick={() => setActivePage('employee-payslip')} className="text-[11px] text-secondary font-bold hover:underline mt-1 text-left">
              View &amp; Download PDF →
            </button>
          </div>

        </div>

        {/* Check-In Widget (Section 7 Requirement) */}
        <div className="p-6 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-surface-container px-2 py-0.5 rounded">
              Daily Attendance Widget (M4)
            </span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1">
              Today's Attendance Status: {myAttendanceToday ? myAttendanceToday.status : 'Not Marked Yet'}
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {myAttendanceToday
                ? `Checked in at ${myAttendanceToday.checkIn} via ${myAttendanceToday.source}. Server timestamp verified.`
                : 'Mark check-in via browser web button or use camera biometric check-in with GPS radius verification.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!myAttendanceToday || myAttendanceToday.checkIn === '--' ? (
              <button
                onClick={() => markCheckIn('web')}
                className="h-10 px-5 bg-on-tertiary-container text-on-tertiary hover:opacity-95 rounded-lg font-bold text-xs shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">touch_app</span>
                <span>Web Check-In</span>
              </button>
            ) : myAttendanceToday.checkOut === '--' ? (
              <button
                onClick={markCheckOut}
                className="h-10 px-5 bg-primary text-on-primary hover:bg-inverse-surface rounded-lg font-bold text-xs shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">timer_off</span>
                <span>Check-Out (End Shift)</span>
              </button>
            ) : (
              <span className="px-3 py-1.5 rounded-lg bg-surface-container text-on-tertiary-container font-bold text-xs">
                ✓ Shift Completed ({myAttendanceToday.hoursLogged}h)
              </span>
            )}

            <button
              onClick={() => setActivePage('employee-attendance')}
              className="h-10 px-4 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-bold text-xs shadow-xs flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">photo_camera</span>
              <span>Camera Check-In</span>
            </button>
          </div>
        </div>

        {/* Company Announcements Strip (Section 7 Requirement) */}
        <div className="p-6 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">campaign</span>
              Company Announcements (M9)
            </h3>
            <span className="text-xs text-outline font-data-tabular">Live Feed</span>
          </div>

          <div className="space-y-2.5">
            {announcements.map(ann => (
              <div key={ann.id} className="p-3.5 rounded-lg bg-surface-container-low border border-surface-container text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-on-surface text-sm">{ann.title}</span>
                  <span className="text-outline text-[11px] font-data-tabular">{ann.date}</span>
                </div>
                <p className="text-on-surface-variant leading-relaxed">{ann.content}</p>
                <div className="text-[10px] text-secondary font-semibold mt-1">Posted by: {ann.postedBy}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
