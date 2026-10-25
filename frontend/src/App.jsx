import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';

// Admin Pages (M7, M2, M1, M6, M9)
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminSetupPage from './pages/admin/AdminSetupPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminPayrollPage from './pages/admin/AdminPayrollPage';
import AdminAuditPage from './pages/admin/AdminAuditPage';

// HR Pages (M7, M3, M4, M5, M6)
import HRDashboardPage from './pages/hr/HRDashboardPage';
import HREmployeesPage from './pages/hr/HREmployeesPage';
import HRAttendancePage from './pages/hr/HRAttendancePage';
import HRLeavePage from './pages/hr/HRLeavePage';
import HRPayrollPage from './pages/hr/HRPayrollPage';

// Employee Pages (M7, M4, M5, M6)
import EmployeeDashboardPage from './pages/employee/EmployeeDashboardPage';
import EmployeeAttendancePage from './pages/employee/EmployeeAttendancePage';
import EmployeeLeavePage from './pages/employee/EmployeeLeavePage';
import EmployeePayslipPage from './pages/employee/EmployeePayslipPage';

// Common Comms (M9)
import AnnouncementsPage from './pages/common/AnnouncementsPage';

function MainRouter() {
  const { currentUser, activePage } = useApp();

  if (!currentUser) {
    return <LoginPage />;
  }

  const renderCurrentPage = () => {
    const role = currentUser.role;

    // Strict Role Guards: Prevent unauthorized URL/tab state access
    const isAdminRoute = activePage.startsWith('admin-');
    const isHrRoute = activePage.startsWith('hr-');
    const isEmployeeRoute = activePage.startsWith('employee-');

    if (isAdminRoute && role !== 'admin') {
      return role === 'hr' ? <HRDashboardPage /> : <EmployeeDashboardPage />;
    }
    if (isHrRoute && role !== 'hr' && role !== 'admin') {
      return <EmployeeDashboardPage />;
    }

    switch (activePage) {
      // Admin Routes
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      case 'admin-setup':
        return <AdminSetupPage />;
      case 'admin-users':
        return <AdminUsersPage />;
      case 'admin-payroll':
        return <AdminPayrollPage />;
      case 'admin-audit':
        return <AdminAuditPage />;
      case 'admin-announcements':
        return <AnnouncementsPage />;

      // HR Routes
      case 'hr-dashboard':
        return <HRDashboardPage />;
      case 'hr-employees':
        return <HREmployeesPage />;
      case 'hr-attendance':
        return <HRAttendancePage />;
      case 'hr-leave':
        return <HRLeavePage />;
      case 'hr-payroll':
        return <HRPayrollPage />;
      case 'hr-announcements':
        return <AnnouncementsPage />;

      // Employee Routes
      case 'employee-dashboard':
        return <EmployeeDashboardPage />;
      case 'employee-attendance':
        return <EmployeeAttendancePage />;
      case 'employee-leave':
        return <EmployeeLeavePage />;
      case 'employee-payslip':
        return <EmployeePayslipPage />;
      case 'employee-notifications':
        return <AnnouncementsPage />;

      default:
        if (role === 'admin') return <AdminDashboardPage />;
        if (role === 'hr') return <HRDashboardPage />;
        return <EmployeeDashboardPage />;
    }
  };

  return <AppLayout>{renderCurrentPage()}</AppLayout>;
}

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
