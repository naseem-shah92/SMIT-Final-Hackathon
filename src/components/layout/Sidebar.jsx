import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { currentUser, activePage, setActivePage, toggleAIChat } = useApp();

  if (!currentUser) return null;

  // Exact Section 8 Functionality Checklist Navigation
  const menuConfig = {
    admin: [
      {
        section: 'Executive Intelligence',
        items: [
          { id: 'admin-dashboard', label: 'Executive Dashboard', icon: 'analytics' },
          { id: 'admin-setup', label: 'Organization Settings', icon: 'tune' },
          { id: 'admin-users', label: 'User Access & Roles', icon: 'manage_accounts' }
        ]
      },
      {
        section: 'Governance & Compliance',
        items: [
          { id: 'admin-payroll', label: 'Payroll Governance', icon: 'lock_clock' },
          { id: 'admin-audit', label: 'Audit Ledger', icon: 'history' },
          { id: 'admin-announcements', label: 'Announcements', icon: 'campaign' }
        ]
      }
    ],
    hr: [
      {
        section: 'People Operations',
        items: [
          { id: 'hr-dashboard', label: 'Operations Dashboard', icon: 'dashboard' },
          { id: 'hr-employees', label: 'Workforce Directory', icon: 'badge' },
          { id: 'hr-attendance', label: 'Daily Attendance', icon: 'calendar_clock' },
          { id: 'hr-leave', label: 'Time-Off Approvals', icon: 'task_alt' }
        ]
      },
      {
        section: 'Payroll & Comms',
        items: [
          { id: 'hr-payroll', label: 'Monthly Payroll', icon: 'payments' },
          { id: 'hr-announcements', label: 'Announcements', icon: 'campaign' }
        ]
      }
    ],
    employee: [
      {
        section: 'Self-Service Hub',
        items: [
          { id: 'employee-dashboard', label: 'Personal Overview', icon: 'home' },
          { id: 'employee-attendance', label: 'Time Clock & Attendance', icon: 'photo_camera' },
          { id: 'employee-leave', label: 'Request Time-Off', icon: 'event_busy' },
          { id: 'employee-payslip', label: 'My Payslips', icon: 'receipt_long' },
          { id: 'employee-notifications', label: 'Notifications', icon: 'notifications' }
        ]
      }
    ]
  };

  const navGroups = menuConfig[currentUser.role] || menuConfig.admin;

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-low flex flex-col justify-between z-50 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-surface-container-high/40 select-none">
      
      {/* Top Brand Identity */}
      <div>
        <div className="h-16 px-gutter-desktop flex items-center justify-between bg-surface-container-low border-b border-surface-container-high/40 shrink-0">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-on-primary text-[20px]">hub</span>
            </div>
            <div>
              <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface block leading-tight">
                HCM Lite
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant block leading-tight text-[11px]">
                Enterprise Platform
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-data-tabular uppercase bg-surface-container-highest text-secondary border border-surface-container">
            {currentUser.role}
          </span>
        </div>

        {/* Dynamic Role Navigation Links */}
        <nav className="p-space-md space-y-space-lg overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-space-xs">
              <div className="px-space-md py-space-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                {group.section}
              </div>

              {group.items.map(item => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-space-md px-space-md py-space-sm rounded-lg transition-all text-left ${
                      isActive
                        ? 'bg-surface-container-high text-on-surface font-semibold shadow-2xs border-l-2 border-secondary'
                        : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-secondary' : 'text-on-surface-variant'}`}>
                      {item.icon}
                    </span>
                    <span className="font-label-lg text-label-lg">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Area: AI Assistant Trigger + Shift Specs */}
      <div className="p-space-md bg-surface-container shrink-0 border-t border-surface-container-high/40 space-y-2">
        
        {/* Bottom AI Copilot Quick Button */}
        <button
          onClick={toggleAIChat}
          className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-secondary border border-surface-container-high flex items-center justify-between text-xs font-bold transition-all shadow-2xs"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span>AI Copilot</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-ping"></span>
        </button>

        {/* Shift Timings Box */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-on-surface">
            <span>Shift Timings</span>
            <span className="font-data-tabular text-secondary">09:00 - 18:00</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-outline font-data-tabular">
            <span>Grace: 15 min</span>
            <span>Radius: 150m</span>
          </div>
        </div>

      </div>

    </aside>
  );
}
