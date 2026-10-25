import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function LoginPage() {
  const { login, isSupabaseConfigured } = useApp();
  const [email, setEmail] = useState('admin@saylani.org');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedDemo, setSelectedDemo] = useState('admin');

  const demoAccounts = {
    admin: { email: 'admin@saylani.org', pass: 'admin123', label: 'Admin', name: 'Admin User' },
    hr: { email: 'hr@saylani.org', pass: 'hr123', label: 'HR Lead', name: 'Zubair Khan' },
    employee: { email: 'ayesha@saylani.org', pass: 'emp123', label: 'Employee', name: 'Ayesha Siddiqui' }
  };

  const handleSelectDemo = (key) => {
    setSelectedDemo(key);
    setEmail(demoAccounts[key].email);
    setPassword(demoAccounts[key].pass);
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
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-between items-center py-10 px-4 antialiased text-slate-800">
      
      {/* Top Navbar */}
      <header className="w-full max-w-5xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-[20px]">hub</span>
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight font-headline">
              HCM Lite
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Enterprise Work Platform
            </span>
          </div>
        </div>

        <div>
          {isSupabaseConfigured ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Supabase Cloud</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>System Online</span>
            </span>
          )}
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="w-full max-w-[420px] bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
        
        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-headline">
            Sign in to your account
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Welcome back. Please enter your credentials to access your organization dashboard.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5 text-rose-600">error</span>
            <span className="leading-tight">{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Work email address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all placeholder:text-slate-400"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 pl-9 pr-10 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all placeholder:text-slate-400 font-mono text-xs"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                tabIndex={-1}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in</span>
            )}
          </button>
        </form>

        {/* Clean Demo Account Selector */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Demo accounts</span>
            <span className="text-slate-400 text-[11px] font-mono">{demoAccounts[selectedDemo].name}</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
            {Object.keys(demoAccounts).map((key) => {
              const acc = demoAccounts[key];
              const isSelected = selectedDemo === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectDemo(key)}
                  className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {acc.label}
                </button>
              );
            })}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 space-y-1">
        <p>© 2026 HCM Lite Solutions Ltd. All rights reserved.</p>
      </footer>

    </div>
  );
}
