import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const { currentUser, logout } = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!currentUser) return null;

  const roleConfig = {
    admin: { label: 'Admin', color: 'bg-primary text-on-primary' },
    hr: { label: 'HR Ops', color: 'bg-secondary text-on-secondary' },
    employee: { label: 'Employee', color: 'bg-on-tertiary-container text-on-tertiary' }
  }[currentUser.role] || { label: 'User', color: 'bg-surface-container text-on-surface' };

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-md z-30 px-8 flex items-center justify-between border-b border-surface-container shadow-2xs">
      
      {/* Left: Search Bar */}
      <div className="flex items-center gap-4">
        <div className="w-80 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface border border-outline-variant/60 text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:border-secondary transition-all"
            placeholder="Search employees, policies, logs... (Cmd+K)"
            type="text"
          />
        </div>
      </div>

      {/* Right: Notifications & Authenticated User Profile */}
      <div className="flex items-center gap-4">
        
        {/* Notification Bell */}
        <button
          className="w-9 h-9 rounded-lg bg-surface hover:bg-surface-container flex items-center justify-center relative transition-colors border border-outline-variant/40"
          type="button"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"></span>
        </button>

        {/* User Account Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(prev => !prev)}
            className="flex items-center gap-3 p-1 pl-2.5 pr-2 rounded-xl hover:bg-surface transition-all border border-transparent hover:border-surface-container"
          >
            <div className="text-right hidden sm:block">
              <div className="flex items-center justify-end gap-1.5">
                <span className="font-label-md text-label-md text-on-surface font-bold leading-tight">
                  {currentUser.name}
                </span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold font-data-tabular uppercase ${roleConfig.color}`}>
                  {roleConfig.label}
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-outline block leading-tight text-[11px] mt-0.5">
                {currentUser.title || currentUser.dept}
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-xs font-data-tabular shadow-xs">
              {currentUser.avatar || currentUser.name?.charAt(0) || 'U'}
            </div>

            <span className="material-symbols-outlined text-outline text-[18px]">
              {isDropdownOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {/* Account Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container p-2 space-y-2 animate-in fade-in zoom-in-95 duration-150 z-50">
              
              <div className="p-3 bg-surface-container-low rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface text-xs">{currentUser.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-data-tabular ${roleConfig.color}`}>
                    {roleConfig.label}
                  </span>
                </div>
                <div className="text-[11px] text-outline font-data-tabular">{currentUser.email}</div>
                <div className="text-[10px] text-on-surface-variant font-medium pt-1 border-t border-surface-container flex items-center justify-between">
                  <span>ID: <strong className="font-mono">{currentUser.empId || 'EMP-001'}</strong></span>
                  <span>Dept: <strong>{currentUser.dept || 'Engineering'}</strong></span>
                </div>
              </div>

              {/* Security info */}
              <div className="px-2 py-1 text-[11px] text-outline flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-[14px] text-on-tertiary-container">verified_user</span>
                <span>Role verified via Supabase Auth</span>
              </div>

              {/* Sign Out Button */}
              <div className="border-t border-surface-container pt-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-error hover:bg-error-container/40 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Sign Out of Account</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

    </header>
  );
}
