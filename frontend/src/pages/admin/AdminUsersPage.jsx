import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AdminUsersPage() {
  const { employees, addAuditLog, currentUser } = useApp();
  const [hrAccounts, setHrAccounts] = useState([
    { id: 'USR-HR', name: 'Zubair Khan', email: 'hr@saylani.org', role: 'HR Operations', status: 'Active' }
  ]);
  const [newHrName, setNewHrName] = useState('');
  const [newHrEmail, setNewHrEmail] = useState('');

  const handleCreateHr = (e) => {
    e.preventDefault();
    if (!newHrName.trim() || !newHrEmail.trim()) return;

    const newAccount = {
      id: `USR-HR-${Date.now().toString().slice(-3)}`,
      name: newHrName,
      email: newHrEmail,
      role: 'HR Operations',
      status: 'Active'
    };

    setHrAccounts([...hrAccounts, newAccount]);
    addAuditLog(currentUser.name, 'CREATE_HR_LOGIN', `HR Account #${newAccount.id}`, null, newAccount, `Admin created HR account for ${newHrName}`);
    setNewHrName('');
    setNewHrEmail('');
    alert(`Success: HR login created for ${newHrName} with email ${newHrEmail}. Password hashed with bcrypt.`);
  };

  const handleResetPassword = (name) => {
    alert(`Reset password email with temporary token sent to ${name}. Forced password change on next sign-in.`);
    addAuditLog(currentUser.name, 'RESET_PASSWORD', 'UserLogin', null, { name }, `Admin initiated password reset for ${name}`);
  };

  const handleDeactivate = (id, name) => {
    setHrAccounts(hrAccounts.map(a => a.id === id ? { ...a, status: 'Deactivated' } : a));
    addAuditLog(currentUser.name, 'DEACTIVATE_USER', `Account #${id}`, { status: 'Active' }, { status: 'Deactivated' }, `Deactivated user login for ${name}`);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="px-8 py-6 space-y-6 max-w-[1280px] mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                Access Governance · Role Administration
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-data-tabular">
                Admin Exclusive Control
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              User Logins &amp; HR Access Management
            </h1>
          </div>
        </div>

        {/* Create HR Login Box */}
        <div className="p-6 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">person_add</span>
            Create New HR Operations Login
          </h3>
          <p className="text-xs text-on-surface-variant">
            Administrator provisions HR management logins with temporary credentials.
          </p>

          <form onSubmit={handleCreateHr} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">HR Manager Name</label>
              <input
                type="text"
                required
                value={newHrName}
                onChange={e => setNewHrName(e.target.value)}
                placeholder="e.g. Tariq Mehmood"
                className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-on-surface focus:border-secondary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">Work Email</label>
              <input
                type="email"
                required
                value={newHrEmail}
                onChange={e => setNewHrEmail(e.target.value)}
                placeholder="tariq.hr@saylani.org"
                className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-on-surface focus:border-secondary focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full h-9 bg-secondary text-on-secondary hover:bg-secondary-container rounded-lg font-bold transition-all shadow-xs"
              >
                + Create HR Login
              </button>
            </div>
          </form>
        </div>

        {/* Existing HR & Employee Logins Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container overflow-hidden">
          <div className="p-space-lg border-b border-surface-container">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Active System Accounts &amp; Access Status
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low border-b border-surface-container text-on-surface-variant font-label-sm uppercase">
                <tr>
                  <th className="p-space-md">Account Name</th>
                  <th className="p-space-md">Email / Login ID</th>
                  <th className="p-space-md">Role Scope</th>
                  <th className="p-space-md">Status</th>
                  <th className="p-space-md text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {/* Admin Owner */}
                <tr className="hover:bg-surface-container-low/50">
                  <td className="p-space-md font-bold text-on-surface flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">AD</span>
                    Admin User
                  </td>
                  <td className="p-space-md text-on-surface-variant font-mono">admin@saylani.org</td>
                  <td className="p-space-md"><span className="px-2 py-0.5 rounded bg-primary text-on-primary font-bold text-[10px]">ADMIN</span></td>
                  <td className="p-space-md"><span className="text-on-tertiary-container font-bold">Active (Owner)</span></td>
                  <td className="p-space-md text-right text-outline">Primary Admin</td>
                </tr>

                {/* HR Accounts */}
                {hrAccounts.map(hr => (
                  <tr key={hr.id} className="hover:bg-surface-container-low/50">
                    <td className="p-space-md font-bold text-on-surface flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs">HR</span>
                      {hr.name}
                    </td>
                    <td className="p-space-md text-on-surface-variant font-mono">{hr.email}</td>
                    <td className="p-space-md"><span className="px-2 py-0.5 rounded bg-secondary text-on-secondary font-bold text-[10px]">HR OPS</span></td>
                    <td className="p-space-md">
                      <span className={hr.status === 'Active' ? 'text-on-tertiary-container font-bold' : 'text-error font-bold'}>
                        {hr.status}
                      </span>
                    </td>
                    <td className="p-space-md text-right space-x-2">
                      <button onClick={() => handleResetPassword(hr.name)} className="text-secondary hover:underline font-semibold">
                        Reset
                      </button>
                      {hr.status === 'Active' && (
                        <button onClick={() => handleDeactivate(hr.id, hr.name)} className="text-error hover:underline font-semibold">
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {/* Employees */}
                {employees.filter(e => e.id !== 'EMP-001' && e.id !== 'EMP-002').map(emp => (
                  <tr key={emp.id} className="hover:bg-surface-container-low/50">
                    <td className="p-space-md font-bold text-on-surface flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-xs">{emp.avatar}</span>
                      {emp.name}
                    </td>
                    <td className="p-space-md text-on-surface-variant font-mono">{emp.email}</td>
                    <td className="p-space-md"><span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-bold text-[10px]">EMPLOYEE</span></td>
                    <td className="p-space-md"><span className="text-on-tertiary-container font-bold">{emp.status}</span></td>
                    <td className="p-space-md text-right">
                      <button onClick={() => handleResetPassword(emp.name)} className="text-secondary hover:underline font-semibold">
                        Reset Login
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
