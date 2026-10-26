import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function LoginPage() {
  const { login, isSupabaseConfigured } = useApp();
  const [email, setEmail] = useState('admin@saylani.org');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin');

  const demoAccounts = {
    admin: { email: 'admin@saylani.org', pass: 'admin123', label: 'Owner / Admin' },
    hr: { email: 'bilal@saylani.org', pass: 'hr123', label: 'HR Director' },
    employee: { email: 'ayesha@saylani.org', pass: 'emp123', label: 'Employee' }
  };

  const handleSelectRole = (roleKey) => {
    setSelectedRole(roleKey);
    setEmail(demoAccounts[roleKey].email);
    setPassword(demoAccounts[roleKey].pass);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white antialiased text-slate-800 font-sans selection:bg-sky-100 selection:text-sky-900">
      
      {/* ──────────────────────────────────────────────────────────
          LEFT COLUMN: Clean, High-Conversion SaaS Authentication
          ────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-18 bg-white min-h-screen overflow-y-auto">
        
        {/* Top Header Strip */}
        <div className="flex items-center justify-between w-full">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 font-extrabold text-lg">
              <span className="material-symbols-outlined text-[24px]">hub</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900">HCM</span>
              <span className="text-xl font-bold tracking-tight text-sky-600">Master Suite</span>
            </div>
          </div>

          {/* Cloud Badge / Theme Pill */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{isSupabaseConfigured ? 'Supabase Live' : 'System Ready'}</span>
            </div>
            <button
              type="button"
              className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
              title="Theme Toggle"
            >
              <span className="material-symbols-outlined text-[18px]">dark_mode</span>
            </button>
          </div>
        </div>

        {/* Center Authentication Form */}
        <div className="w-full max-w-md mx-auto my-auto py-8 space-y-6">
          
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Sign in to your company workspace.
            </p>
          </div>

          {/* Social Sign-in Button */}
          <button
            type="button"
            onClick={() => handleSelectRole('admin')}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center justify-center gap-3 transition-all shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              OR WITH EMAIL
            </span>
          </div>

          {/* Role Quick Selector Pills for Evaluation */}
          <div className="p-1 rounded-xl bg-slate-100 flex items-center gap-1 border border-slate-200/60">
            {Object.keys(demoAccounts).map((key) => {
              const active = selectedRole === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectRole(key)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {demoAccounts[key].label}
                </button>
              );
            })}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
              <span className="material-symbols-outlined text-[18px] shrink-0 text-rose-600">error</span>
              <span className="leading-tight">{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Work email</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-slate-400 text-[18px] absolute left-3.5 pointer-events-none">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to work email.'); }} className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-slate-400 text-[18px] absolute left-3.5 pointer-events-none">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Sign in Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-sky-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Authenticating...</span>
                </span>
              ) : (
                <>
                  <span>Sign in</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>

            {/* Magic Link Alternative */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => alert(`Magic sign-in token generated for ${email}. Access authorized.`)}
                className="text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors cursor-pointer"
              >
                Sign in with a magic link instead
              </button>
            </div>
          </form>

          {/* Bottom Onboarding Links */}
          <div className="text-center space-y-1.5 pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-600">
              New to HCM Master Suite?{' '}
              <a
                href="#signup"
                onClick={(e) => { e.preventDefault(); handleSelectRole('admin'); }}
                className="font-bold text-sky-600 hover:underline"
              >
                Create your company
              </a>
            </p>
            <p className="text-[11px] text-slate-400 leading-tight">
              Invited by your company? Sign up with the same email to join automatically.
            </p>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="w-full text-center lg:text-left text-[11px] text-slate-400 font-medium">
          © 2026 HCM Master Suite · Row-level security · Your data stays in your own Supabase project.
        </div>

      </div>

      {/* ──────────────────────────────────────────────────────────
          RIGHT COLUMN: Deep Enterprise Blue Hero & Floating Telemetry
          ────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 relative bg-gradient-to-br from-[#006097] via-[#004e80] to-[#00385f] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden min-h-[600px] lg:min-h-screen">
        
        {/* Subtle Background Pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        ></div>

        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Feature Pill */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold text-sky-100 shadow-sm">
            <span className="material-symbols-outlined text-[16px] text-sky-300">auto_awesome</span>
            <span>AI-native HR for growing companies</span>
          </div>
        </div>

        {/* Floating Telemetry Showcase Cards */}
        <div className="relative z-10 my-auto py-8 space-y-4">
          
          {/* Card 1: Payroll · October (Main Card) */}
          <div className="w-full max-w-md mx-auto bg-white text-slate-900 rounded-2xl p-5 shadow-2xl shadow-slate-950/25 border border-white/40 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Payroll · October</h4>
                  <p className="text-xs text-slate-500 font-medium">148 employees</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                Finance approved
              </span>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 py-4 text-center">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Gross</span>
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">18.4M</span>
              </div>
              <div className="border-x border-slate-100">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Tax</span>
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">1.2M</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Net</span>
                <span className="text-lg sm:text-xl font-extrabold text-emerald-700 font-mono">16.1M</span>
              </div>
            </div>

            {/* Approval Stepper Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
              <span>Prepared by payroll · approved by HR · approved by finance</span>
            </div>
          </div>

          {/* Staggered Row: Geofence Check-in & Leave Approved Pills */}
          <div className="w-full max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Card 2: Clocked in Geofence Pill */}
            <div className="bg-white text-slate-900 rounded-2xl p-3.5 shadow-xl shadow-slate-950/20 border border-white/40 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">location_on</span>
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">Clocked in 08:56</p>
                <p className="text-[11px] text-slate-500 font-medium">Inside office geofence · 42 m</p>
              </div>
            </div>

            {/* Card 3: Leave Approved Pill */}
            <div className="bg-white text-slate-900 rounded-2xl p-3.5 shadow-xl shadow-slate-950/20 border border-white/40 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">event_available</span>
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">Leave approved</p>
                <p className="text-[11px] text-slate-500 font-medium">Casual · 2 days</p>
              </div>
            </div>

          </div>

        </div>

        {/* Hero Copy & Role Tags Cloud */}
        <div className="relative z-10 space-y-4 max-w-xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white font-headline">
            People, attendance, payroll and talent. One secure workspace for every role.
          </h2>
          <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed font-normal">
            From the company owner to the newest employee, everyone sees exactly what their role allows — enforced in the database, not just the screen.
          </p>

          {/* Role Badges Cloud */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['Owner', 'HR Director', 'HR Manager', 'Payroll', 'Finance', 'Recruiter', 'Line Manager', 'Employee', 'Auditor'].map((roleName) => (
              <span
                key={roleName}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-[11px] font-semibold text-white backdrop-blur-xs transition-colors"
              >
                {roleName}
              </span>
            ))}
          </div>

          {/* Security & RBAC Trust Footer */}
          <div className="pt-2 flex items-center gap-2 text-xs font-medium text-sky-200">
            <span className="material-symbols-outlined text-[16px] text-sky-300">verified_user</span>
            <span>Row-level security · maker-checker payroll · immutable audit log</span>
          </div>
        </div>

      </div>

    </div>
  );
}
