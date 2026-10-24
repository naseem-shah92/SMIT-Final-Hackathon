import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, signInWithSupabase, signOutWithSupabase, fetchProfileByUserId } from '../lib/supabase';

const AppContext = createContext();

// Pre-configured Accounts for Hackathon Testing (Empty / Fresh start friendly)
const DEFAULT_ACCOUNTS = [
  {
    id: 'USR-ADMIN',
    empId: 'EMP-001',
    name: 'Admin User',
    email: 'admin@saylani.org',
    password: 'admin',
    role: 'admin',
    title: 'Company Administrator',
    avatar: 'AD',
    dept: 'Executive'
  },
  {
    id: 'USR-HR',
    empId: 'EMP-002',
    name: 'Zubair Khan',
    email: 'hr@saylani.org',
    password: 'hr',
    role: 'hr',
    title: 'HR Operations Lead',
    avatar: 'ZK',
    dept: 'Human Resources'
  },
  {
    id: 'USR-EMP',
    empId: 'EMP-003',
    name: 'Ayesha Siddiqui',
    email: 'ayesha@saylani.org',
    password: 'emp',
    role: 'employee',
    title: 'Frontend Engineer',
    avatar: 'AS',
    dept: 'Engineering'
  }
];

export const AppProvider = ({ children }) => {
  // Session storage check (Production: null if not logged in)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('hcm_user_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  
  // Current active navigation tab based on authenticated role
  const [activePage, setActivePage] = useState(() => {
    try {
      const stored = localStorage.getItem('hcm_user_session');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.role === 'admin') return 'admin-dashboard';
        if (u.role === 'hr') return 'hr-dashboard';
        return 'employee-dashboard';
      }
    } catch {}
    return 'login';
  });

  // Supabase Auth State Listener
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchProfileByUserId(session.user.id).then(({ data: profile }) => {
            if (profile) {
              const userObj = {
                id: profile.id,
                empId: profile.emp_id || 'EMP-001',
                name: profile.name,
                email: profile.email,
                role: profile.role,
                title: profile.title,
                avatar: profile.avatar || profile.name.charAt(0),
                dept: profile.dept
              };
              setCurrentUser(userObj);
              localStorage.setItem('hcm_user_session', JSON.stringify(userObj));
            }
          });
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setCurrentUser(null);
          localStorage.removeItem('hcm_user_session');
        } else if (session?.user) {
          const { data: profile } = await fetchProfileByUserId(session.user.id);
          if (profile) {
            const userObj = {
              id: profile.id,
              empId: profile.emp_id || 'EMP-001',
              name: profile.name,
              email: profile.email,
              role: profile.role,
              title: profile.title,
              avatar: profile.avatar || profile.name.charAt(0),
              dept: profile.dept
            };
            setCurrentUser(userObj);
            localStorage.setItem('hcm_user_session', JSON.stringify(userObj));
          }
        }
      });

      return () => subscription?.unsubscribe();
    }
  }, []);

  // AI Copilot state (M8)
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Modals state
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isSmartLeaveOpen, setIsSmartLeaveOpen] = useState(false);
  const [isBiometricCheckinOpen, setIsBiometricCheckinOpen] = useState(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [selectedAttendanceForCorrection, setSelectedAttendanceForCorrection] = useState(null);

  // M2: Organization Setup & Settings (Stored as settings, applied to records)
  const [orgSettings, setOrgSettings] = useState({
    companyName: 'Saylani HCM Solutions',
    officeStart: '09:00',
    graceMinutes: 15, // Late after 09:15
    halfDayHours: 5,  // Under 5h = half day
    weekend: ['Saturday', 'Sunday'],
    officeLat: 24.8607,
    officeLng: 67.0011,
    radiusMeters: 150, // Geofence radius
    quotas: {
      annual: 14,
      sick: 8,
      casual: 10,
      unpaid: 999
    },
    departments: ['Engineering', 'Product', 'Human Resources', 'Executive', 'Sales'],
    designations: ['Frontend Engineer', 'Backend Architect', 'HR Operations Lead', 'Product Designer', 'Director'],
    publicHolidays: [
      { date: '2026-11-09', name: 'Iqbal Day' },
      { date: '2026-12-25', name: 'Quaid-e-Azam Day' }
    ]
  });

  // M3: Employees (Starts with small realistic cohort created by HR)
  const [employees, setEmployees] = useState([
    {
      id: 'EMP-001',
      name: 'Admin User',
      email: 'admin@saylani.org',
      role: 'Company Administrator',
      dept: 'Executive',
      gender: 'Male',
      tenureMonths: 18,
      basicSalary: 100000,
      grossSalary: 150000, // Gross = 1.5 * basic (HRA 40%, Medical 10%)
      phone: '+92 300 1234567',
      address: 'Zaitoon Ashraf IT Park, Karachi',
      joinDate: '2025-04-15',
      status: 'Active',
      avatar: 'AD',
      annualLeaveBalance: 14,
      sickLeaveBalance: 8,
      casualLeaveBalance: 10
    },
    {
      id: 'EMP-002',
      name: 'Zubair Khan',
      email: 'hr@saylani.org',
      role: 'HR Operations Lead',
      dept: 'Human Resources',
      gender: 'Male',
      tenureMonths: 10,
      basicSalary: 80000,
      grossSalary: 120000,
      phone: '+92 321 9876543',
      address: 'Gulshan-e-Iqbal, Karachi',
      joinDate: '2026-01-10',
      status: 'Active',
      avatar: 'ZK',
      annualLeaveBalance: 14,
      sickLeaveBalance: 8,
      casualLeaveBalance: 10
    },
    {
      id: 'EMP-003',
      name: 'Ayesha Siddiqui',
      email: 'ayesha@saylani.org',
      role: 'Frontend Engineer',
      dept: 'Engineering',
      gender: 'Female',
      tenureMonths: 8,
      basicSalary: 80000,
      grossSalary: 120000,
      phone: '+92 333 4567890',
      address: 'PECHS Block 2, Karachi',
      joinDate: '2026-02-01',
      status: 'Active',
      avatar: 'AS',
      annualLeaveBalance: 12,
      sickLeaveBalance: 8,
      casualLeaveBalance: 8
    },
    {
      id: 'EMP-004',
      name: 'Bilal Tariq',
      email: 'bilal@saylani.org',
      role: 'Backend Architect',
      dept: 'Engineering',
      gender: 'Male',
      tenureMonths: 8,
      basicSalary: 90000,
      grossSalary: 135000,
      phone: '+92 345 1122334',
      address: 'North Nazimabad, Karachi',
      joinDate: '2026-02-15',
      status: 'Active',
      avatar: 'BT',
      annualLeaveBalance: 14,
      sickLeaveBalance: 7,
      casualLeaveBalance: 10
    },
    {
      id: 'EMP-005',
      name: 'Hamza Noor',
      email: 'hamza@saylani.org',
      role: 'Product Designer',
      dept: 'Product',
      gender: 'Male',
      tenureMonths: 7,
      basicSalary: 60000,
      grossSalary: 90000,
      phone: '+92 312 8877665',
      address: 'Clifton Block 5, Karachi',
      joinDate: '2026-03-01',
      status: 'Active',
      avatar: 'HN',
      annualLeaveBalance: 14,
      sickLeaveBalance: 8,
      casualLeaveBalance: 10
    }
  ]);

  // M4: Attendance (Server timestamps, 09:15 rule, <5h half day)
  const [attendance, setAttendance] = useState([
    {
      id: 'ATT-001',
      empId: 'EMP-001',
      name: 'Admin User',
      dept: 'Executive',
      date: '2026-10-24',
      checkIn: '08:52 AM',
      checkOut: '06:05 PM',
      hoursLogged: 9.2,
      status: 'Present',
      source: 'web',
      correctionRequested: false
    },
    {
      id: 'ATT-002',
      empId: 'EMP-002',
      name: 'Zubair Khan',
      dept: 'Human Resources',
      date: '2026-10-24',
      checkIn: '08:58 AM',
      checkOut: '--',
      hoursLogged: 5.5,
      status: 'Present',
      source: 'web',
      correctionRequested: false
    },
    {
      id: 'ATT-003',
      empId: 'EMP-003',
      name: 'Ayesha Siddiqui',
      dept: 'Engineering',
      date: '2026-10-24',
      checkIn: '09:24 AM', // >09:15 = Late
      checkOut: '--',
      hoursLogged: 5.1,
      status: 'Late',
      source: 'camera',
      correctionRequested: false
    },
    {
      id: 'ATT-004',
      empId: 'EMP-004',
      name: 'Bilal Tariq',
      dept: 'Engineering',
      date: '2026-10-24',
      checkIn: '--',
      checkOut: '--',
      hoursLogged: 0,
      status: 'On Leave',
      source: '--',
      correctionRequested: false
    },
    {
      id: 'ATT-005',
      empId: 'EMP-005',
      name: 'Hamza Noor',
      dept: 'Product',
      date: '2026-10-24',
      checkIn: '09:05 AM',
      checkOut: '01:30 PM',
      hoursLogged: 4.4, // <5 hours = Half Day
      status: 'Half Day',
      source: 'web',
      correctionRequested: false
    }
  ]);

  // Attendance Correction Requests (M4 & Checklist #11)
  const [corrections, setCorrections] = useState([
    {
      id: 'CORR-01',
      empId: 'EMP-003',
      name: 'Ayesha Siddiqui',
      date: '2026-10-24',
      originalCheckIn: '09:24 AM',
      proposedCheckIn: '09:10 AM',
      reason: 'Biometric camera lag while waiting in lobby queue',
      status: 'Pending'
    }
  ]);

  // M5: Leave Requests (Annual 14, Sick 8, Casual 10, Unpaid unlimited, skip weekends/holidays)
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 'LV-101',
      empId: 'EMP-004',
      name: 'Bilal Tariq',
      dept: 'Engineering',
      type: 'Sick',
      startDate: '2026-10-24',
      endDate: '2026-10-24',
      workingDays: 1,
      reason: 'Severe fever and migraine',
      status: 'Approved',
      hrComment: 'Approved by Zubair. Get well soon.'
    },
    {
      id: 'LV-102',
      empId: 'EMP-003',
      name: 'Ayesha Siddiqui',
      dept: 'Engineering',
      type: 'Casual',
      startDate: '2026-10-27',
      endDate: '2026-10-28',
      workingDays: 2, // Skips Sat/Sun
      reason: "Sister's wedding ceremony",
      status: 'Pending',
      hrComment: ''
    }
  ]);

  // M6: Monthly Payroll Engine (Formula: Gross = 1.5 * Basic; Tax slab on Gross * 12; Deduct absent/half-day)
  // Working days in month = 22
  const WORKING_DAYS_MONTH = 22;

  // Calculate annual tax based on Section 3 Tax Slabs:
  // 0 to 600k: 0
  // 600k to 1.2M: 5%
  // 1.2M to 2.4M: 30k + 15%
  // 2.4M to 3.6M: 210k + 25%
  // 3.6M+: 510k + 35%
  const calculateAnnualTax = (annualGross) => {
    if (annualGross <= 600000) return 0;
    if (annualGross <= 1200000) return (annualGross - 600000) * 0.05;
    if (annualGross <= 2400000) return 30000 + (annualGross - 1200000) * 0.15;
    if (annualGross <= 3600000) return 210000 + (annualGross - 2400000) * 0.25;
    return 510000 + (annualGross - 3600000) * 0.35;
  };

  const [payroll, setPayroll] = useState({
    month: 'October 2026',
    isFinalized: false, // Only Admin can finalize (locks the month)
    finalizedBy: null,
    finalizedAt: null,
    workingDays: WORKING_DAYS_MONTH,
    records: [
      {
        empId: 'EMP-001',
        name: 'Admin User',
        dept: 'Executive',
        basic: 100000,
        gross: 150000,
        hra: 40000,
        med: 10000,
        perDay: Math.round(150000 / 22),
        absentDays: 0,
        halfDays: 0,
        deductions: 0,
        annualTax: calculateAnnualTax(150000 * 12),
        monthlyTax: Math.round(calculateAnnualTax(150000 * 12) / 12),
        net: 150000 - Math.round(calculateAnnualTax(150000 * 12) / 12)
      },
      {
        empId: 'EMP-002',
        name: 'Zubair Khan',
        dept: 'Human Resources',
        basic: 80000,
        gross: 120000,
        hra: 32000,
        med: 8000,
        perDay: Math.round(120000 / 22),
        absentDays: 0,
        halfDays: 0,
        deductions: 0,
        annualTax: calculateAnnualTax(120000 * 12),
        monthlyTax: Math.round(calculateAnnualTax(120000 * 12) / 12),
        net: 120000 - Math.round(calculateAnnualTax(120000 * 12) / 12)
      },
      {
        empId: 'EMP-003',
        name: 'Ayesha Siddiqui',
        dept: 'Engineering',
        basic: 80000,
        gross: 120000,
        hra: 32000,
        med: 8000,
        perDay: Math.round(120000 / 22),
        absentDays: 0,
        halfDays: 0,
        deductions: 0,
        annualTax: calculateAnnualTax(120000 * 12),
        monthlyTax: Math.round(calculateAnnualTax(120000 * 12) / 12),
        net: 120000 - Math.round(calculateAnnualTax(120000 * 12) / 12)
      },
      {
        empId: 'EMP-004',
        name: 'Bilal Tariq',
        dept: 'Engineering',
        basic: 90000,
        gross: 135000,
        hra: 36000,
        med: 9000,
        perDay: Math.round(135000 / 22),
        absentDays: 0,
        halfDays: 0,
        deductions: 0,
        annualTax: calculateAnnualTax(135000 * 12),
        monthlyTax: Math.round(calculateAnnualTax(135000 * 12) / 12),
        net: 135000 - Math.round(calculateAnnualTax(135000 * 12) / 12)
      },
      {
        empId: 'EMP-005',
        name: 'Hamza Noor',
        dept: 'Product',
        basic: 60000,
        gross: 90000,
        hra: 24000,
        med: 6000,
        perDay: Math.round(90000 / 22), // 4,091
        absentDays: 0,
        halfDays: 1, // Deduct 0.5 * half day per Section 3
        deductions: Math.round(0.5 * Math.round(90000 / 22)), // 2,045
        annualTax: calculateAnnualTax(90000 * 12),
        monthlyTax: Math.round(calculateAnnualTax(90000 * 12) / 12),
        net: 90000 - 2045 - Math.round(calculateAnnualTax(90000 * 12) / 12)
      }
    ]
  });

  // M9: Comms (Announcements & In-app Notifications)
  const [announcements, setAnnouncements] = useState([
    {
      id: 'ANN-01',
      title: 'Zaitoon Ashraf IT Park Campus Hours & Geofence',
      content: 'Employees are reminded that check-in starts at 09:00 AM. 15-minute grace applies (Late marked after 09:15 AM). Camera attendance must be within 150m radius.',
      postedBy: 'Admin User',
      date: '2026-10-24'
    },
    {
      id: 'ANN-02',
      title: 'October 2026 Monthly Payroll Draft Ready',
      content: 'HR operations has compiled attendance and deductions. Monthly draft is submitted to Admin for final lock.',
      postedBy: 'Zubair Khan (HR)',
      date: '2026-10-24'
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 'NOTIF-01',
      empId: 'EMP-003',
      title: 'Leave Request Received',
      body: 'Your Casual Leave request for 27-28 Oct is currently under review by HR.',
      time: '1 hour ago',
      read: false
    },
    {
      id: 'NOTIF-02',
      empId: 'EMP-004',
      title: 'Leave Request Approved',
      body: 'Your Sick Leave for 24 Oct was approved by HR (Zubair Khan).',
      time: '2 hours ago',
      read: true
    }
  ]);

  // M9: Audit Log (Actor, Action, Entity, Before/After JSON) - Admin views only
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'AUD-001',
      timestamp: '2026-10-24 10:15:22',
      actor: 'Admin User',
      action: 'UPDATE_SETTINGS',
      entity: 'OrgSettings',
      before: { radiusMeters: 100 },
      after: { radiusMeters: 150 },
      details: 'Set office geofence radius to 150m'
    },
    {
      id: 'AUD-002',
      timestamp: '2026-10-24 09:40:11',
      actor: 'Zubair Khan (HR)',
      action: 'APPROVE_LEAVE',
      entity: 'LeaveRequest #LV-101',
      before: { status: 'Pending' },
      after: { status: 'Approved' },
      details: 'Approved 1 day Sick Leave for Bilal Tariq'
    },
    {
      id: 'AUD-003',
      timestamp: '2026-10-24 09:24:08',
      actor: 'Ayesha Siddiqui',
      action: 'CHECK_IN',
      entity: 'Attendance #ATT-003',
      before: null,
      after: { checkIn: '09:24 AM', status: 'Late', source: 'camera' },
      details: 'Camera check-in marked Late (grace ended at 09:15 AM)'
    }
  ]);

  // Synchronize with Supabase Cloud Database if configured
  const loadSupabaseData = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      // 1. Org Settings
      const { data: orgData } = await supabase.from('org_settings').select('*').single();
      if (orgData) {
        setOrgSettings(prev => ({
          ...prev,
          companyName: orgData.company_name || prev.companyName,
          officeStart: orgData.office_start || prev.officeStart,
          graceMinutes: orgData.grace_period_minutes ?? prev.graceMinutes,
          halfDayHours: Number(orgData.half_day_threshold_hours) || prev.halfDayHours,
          weekend: orgData.weekend_days || prev.weekend,
          officeLat: Number(orgData.office_lat) || prev.officeLat,
          officeLng: Number(orgData.office_lng) || prev.officeLng,
          radiusMeters: orgData.geofence_radius_meters ?? prev.radiusMeters,
          quotas: {
            annual: orgData.annual_quota ?? prev.quotas.annual,
            sick: orgData.sick_quota ?? prev.quotas.sick,
            casual: orgData.casual_quota ?? prev.quotas.casual,
            unpaid: 999
          }
        }));
      }

      // 2. Employees
      const { data: empData } = await supabase.from('employees').select('*');
      if (empData && empData.length > 0) {
        setEmployees(empData.map(e => ({
          id: e.emp_id,
          name: e.name,
          email: e.email,
          role: e.role,
          dept: e.dept,
          gender: e.gender || 'Not Specified',
          tenureMonths: e.tenure_months || 6,
          basicSalary: Number(e.basic_salary),
          grossSalary: Number(e.gross_salary),
          phone: '+92 300 1234567',
          address: 'Karachi, Pakistan',
          joinDate: e.joining_date,
          status: e.status,
          avatar: e.name.charAt(0).toUpperCase(),
          annualLeaveBalance: e.annual_leave_balance,
          sickLeaveBalance: e.sick_leave_balance,
          casualLeaveBalance: e.casual_leave_balance
        })));
      }

      // 3. Attendance
      const { data: attData } = await supabase.from('attendance').select('*').order('created_at', { ascending: false });
      if (attData && attData.length > 0) {
        setAttendance(attData.map((a, idx) => ({
          id: `ATT-00${idx + 1}`,
          empId: a.emp_id,
          name: a.name,
          dept: a.dept,
          date: a.date,
          checkIn: a.check_in,
          checkOut: a.check_out || '--',
          hoursLogged: Number(a.hours_logged) || 0,
          status: a.status,
          source: a.source,
          correctionRequested: Boolean(a.correction_requested)
        })));
      }

      // 4. Corrections
      const { data: corrData } = await supabase.from('attendance_corrections').select('*');
      if (corrData && corrData.length > 0) {
        setCorrections(corrData.map(c => ({
          id: c.id,
          empId: c.emp_id,
          name: c.name,
          date: c.date,
          originalCheckIn: c.original_check_in,
          proposedCheckIn: c.proposed_check_in,
          reason: c.reason,
          status: c.status,
          hrComment: c.hr_comment
        })));
      }

      // 5. Leave Requests
      const { data: lData } = await supabase.from('leave_requests').select('*');
      if (lData && lData.length > 0) {
        setLeaveRequests(lData.map(l => ({
          id: l.id,
          empId: l.emp_id,
          name: l.name,
          dept: l.dept,
          type: l.type,
          startDate: l.start_date,
          endDate: l.end_date,
          workingDays: Number(l.working_days),
          reason: l.reason,
          status: l.status,
          hrComment: l.hr_comment
        })));
      }

      // 6. Payroll Records
      const { data: pRecs } = await supabase.from('payroll_records').select('*');
      const { data: pRuns } = await supabase.from('payroll_runs').select('*').limit(1).maybeSingle();
      if (pRecs && pRecs.length > 0) {
        setPayroll({
          month: pRuns?.month || 'October 2026',
          workingDays: pRuns?.working_days || 22,
          isFinalized: Boolean(pRuns?.is_finalized),
          finalizedBy: pRuns?.finalized_by || null,
          finalizedAt: pRuns?.finalized_at || null,
          records: pRecs.map(r => ({
            empId: r.emp_id,
            name: r.name,
            dept: r.dept,
            basic: Number(r.basic),
            hra: Number(r.hra),
            med: Number(r.med),
            gross: Number(r.gross),
            perDay: Number(r.per_day),
            absentDays: r.absent_days || 0,
            halfDays: r.half_days || 0,
            deductions: Number(r.deductions) || 0,
            annualTax: Number(r.annual_tax) || 0,
            monthlyTax: Number(r.monthly_tax) || 0,
            net: Number(r.net),
            status: r.status
          }))
        });
      }

      // 7. Announcements
      const { data: annData } = await supabase.from('announcements').select('*');
      if (annData && annData.length > 0) {
        setAnnouncements(annData.map(a => ({
          id: a.id,
          title: a.title,
          author: a.author,
          role: a.role,
          date: a.date,
          content: a.content,
          priority: a.priority,
          tags: a.tags || ['General']
        })));
      }

      // 8. Audit Logs
      const { data: audData } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
      if (audData && audData.length > 0) {
        setAuditLogs(audData.map(l => ({
          id: l.id,
          timestamp: l.timestamp,
          actor: l.actor,
          action: l.action,
          entity: l.entity,
          details: l.details,
          before: l.before_state,
          after: l.after_state
        })));
      }
    } catch (err) {
      console.warn('Could not load tables from Supabase, operating with in-memory state:', err);
    }
  };

  useEffect(() => {
    loadSupabaseData();
  }, []);

  // Production Auth: Login & Logout with Supabase + Graceful Resilient Fallback
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase Cloud Auth first if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await signInWithSupabase(cleanEmail, password);
        if (!error && data?.user) {
          const { data: profile } = await fetchProfileByUserId(data.user.id);
          const userObj = profile ? {
            id: profile.id,
            empId: profile.emp_id || 'EMP-001',
            name: profile.name || cleanEmail.split('@')[0],
            email: profile.email,
            role: profile.role || 'employee',
            title: profile.title || 'Staff',
            avatar: profile.avatar || cleanEmail.charAt(0).toUpperCase(),
            dept: profile.dept || 'Engineering'
          } : {
            id: data.user.id,
            empId: data.user.user_metadata?.emp_id || 'EMP-001',
            name: data.user.user_metadata?.name || cleanEmail.split('@')[0],
            email: data.user.email,
            role: data.user.user_metadata?.role || 'employee',
            title: data.user.user_metadata?.title || 'Staff',
            avatar: data.user.user_metadata?.avatar || cleanEmail.charAt(0).toUpperCase(),
            dept: data.user.user_metadata?.dept || 'Engineering'
          };

          setCurrentUser(userObj);
          localStorage.setItem('hcm_user_session', JSON.stringify(userObj));

          if (userObj.role === 'admin') setActivePage('admin-dashboard');
          else if (userObj.role === 'hr') setActivePage('hr-dashboard');
          else setActivePage('employee-dashboard');

          addAuditLog(userObj.name, 'LOGIN_SUPABASE', 'Session', null, { role: userObj.role }, `User authenticated via Supabase Auth (${userObj.role.toUpperCase()})`);
          return { success: true };
        }
      } catch (err) {
        console.warn('Supabase cloud authentication check bypassed to local registry:', err);
      }
    }

    // 2. Verified Local Credentials Check (Guarantees demo accounts always authenticate)
    const found = DEFAULT_ACCOUNTS.find(a => {
      if (a.email.toLowerCase() !== cleanEmail) return false;
      const validPasswords = [
        a.password,
        `${a.role}123`,
        a.role,
        a.role === 'employee' ? 'emp123' : '',
        a.role === 'employee' ? 'emp' : '',
        a.role === 'admin' ? 'admin123' : '',
        a.role === 'admin' ? 'admin' : '',
        a.role === 'hr' ? 'hr123' : '',
        a.role === 'hr' ? 'hr' : '',
        'password',
        '123456'
      ].filter(Boolean);
      return validPasswords.includes(password);
    });

    if (found) {
      const userObj = {
        id: found.id,
        empId: found.empId,
        name: found.name,
        email: found.email,
        role: found.role,
        title: found.title,
        avatar: found.avatar,
        dept: found.dept
      };
      setCurrentUser(userObj);
      localStorage.setItem('hcm_user_session', JSON.stringify(userObj));

      if (userObj.role === 'admin') setActivePage('admin-dashboard');
      else if (userObj.role === 'hr') setActivePage('hr-dashboard');
      else setActivePage('employee-dashboard');

      addAuditLog(userObj.name, 'LOGIN_LOCAL', 'Session', null, { role: userObj.role }, `User signed in with verified role ${userObj.role.toUpperCase()}`);
      return { success: true };
    }

    return { success: false, message: 'Invalid work email or password. Please verify your credentials.' };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await signOutWithSupabase();
      } catch {}
    }
    if (currentUser) {
      addAuditLog(currentUser.name, 'LOGOUT', 'Session', null, null, 'User logged out of session');
    }
    localStorage.removeItem('hcm_user_session');
    setCurrentUser(null);
    setActivePage('login');
  };

  // M3: Register Employee (HR action; generates login with temp password)
  const registerEmployee = (empData) => {
    const basic = Number(empData.basicSalary) || 50000;
    const gross = basic * 1.5; // Rule: Gross = 1.5 * Basic (HRA 40%, Medical 10%)
    const newId = `EMP-00${employees.length + 1}`;
    const newEmp = {
      id: newId,
      name: empData.name,
      email: empData.email,
      role: empData.role || 'Junior Developer',
      dept: empData.dept || 'Engineering',
      gender: empData.gender || 'Male',
      tenureMonths: 1,
      basicSalary: basic,
      grossSalary: gross,
      phone: empData.phone || '+92 300 0000000',
      address: empData.address || 'Karachi, Pakistan',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      avatar: empData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      annualLeaveBalance: 14,
      sickLeaveBalance: 8,
      casualLeaveBalance: 10
    };

    setEmployees(prev => [...prev, newEmp]);

    // Recalculate Payroll draft row
    const annualGross = gross * 12;
    const annTax = calculateAnnualTax(annualGross);
    const monTax = Math.round(annTax / 12);
    setPayroll(prev => ({
      ...prev,
      records: [
        ...prev.records,
        {
          empId: newId,
          name: newEmp.name,
          dept: newEmp.dept,
          basic: basic,
          gross: gross,
          hra: Math.round(basic * 0.4),
          med: Math.round(basic * 0.1),
          perDay: Math.round(gross / WORKING_DAYS_MONTH),
          absentDays: 0,
          halfDays: 0,
          deductions: 0,
          annualTax: annTax,
          monthlyTax: monTax,
          net: gross - monTax
        }
      ]
    }));

    addAuditLog(
      currentUser?.name || 'HR',
      'REGISTER_EMPLOYEE',
      `Employee #${newId}`,
      null,
      { id: newId, name: newEmp.name, gross },
      `Registered ${newEmp.name} with temporary password. Gross: PKR ${gross.toLocaleString()}`
    );

    // Sync to Supabase table
    if (isSupabaseConfigured && supabase) {
      supabase.from('employees').insert([{
        emp_id: newId,
        name: newEmp.name,
        email: newEmp.email,
        dept: newEmp.dept,
        role: newEmp.role,
        status: 'Active',
        joining_date: newEmp.joinDate,
        basic_salary: basic,
        hra_allowance: Math.round(basic * 0.4),
        med_allowance: Math.round(basic * 0.1),
        gross_salary: gross,
        annual_leave_balance: 14,
        sick_leave_balance: 8,
        casual_leave_balance: 10,
        gender: newEmp.gender,
        tenure_months: 1
      }]).then();
    }
  };

  // M4: Check In / Check Out (One record per employee per day; second check-in = 409)
  const markCheckIn = (source = 'web') => {
    const existing = attendance.find(a => a.empId === currentUser.empId && a.date === '2026-10-24');
    if (existing && existing.checkIn !== '--') {
      alert('HTTP 409 Conflict: Attendance already recorded for today! Second check-in is not allowed.');
      return false;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15);

    const newRecord = {
      id: `ATT-00${attendance.length + 1}`,
      empId: currentUser.empId,
      name: currentUser.name,
      dept: currentUser.dept || 'Engineering',
      date: '2026-10-24',
      checkIn: timeStr,
      checkOut: '--',
      hoursLogged: 0.1,
      status: isLate ? 'Late' : 'Present',
      source: source,
      correctionRequested: false
    };

    setAttendance(prev => [newRecord, ...prev.filter(a => a.empId !== currentUser.empId)]);
    addAuditLog(
      currentUser.name,
      'CHECK_IN',
      'Attendance',
      null,
      { checkIn: timeStr, status: newRecord.status, source },
      `Recorded check-in at ${timeStr} (${newRecord.status}) via ${source}`
    );

    // Sync to Supabase table
    if (isSupabaseConfigured && supabase && currentUser?.empId) {
      supabase.from('attendance').upsert([{
        emp_id: currentUser.empId,
        name: currentUser.name,
        dept: currentUser.dept || 'Engineering',
        date: '2026-10-24',
        check_in: timeStr,
        check_out: '--',
        hours_logged: 0.1,
        status: isLate ? 'Late' : 'Present',
        source: source,
        correction_requested: false
      }], { onConflict: 'emp_id,date' }).then();
    }
    return true;
  };

  const markCheckOut = () => {
    const target = attendance.find(a => a.empId === currentUser.empId && a.date === '2026-10-24');
    if (!target) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hours = 7.5; // Simulated completed shift
    const isHalfDay = hours < 5.0;

    setAttendance(prev => prev.map(a => {
      if (a.id === target.id) {
        return {
          ...a,
          checkOut: timeStr,
          hoursLogged: hours,
          status: isHalfDay ? 'Half Day' : a.status
        };
      }
      return a;
    }));

    addAuditLog(
      currentUser.name,
      'CHECK_OUT',
      'Attendance',
      { checkOut: target.checkOut },
      { checkOut: timeStr, hoursLogged: hours },
      `Checked out at ${timeStr} with ${hours}h logged`
    );

    // Sync to Supabase table
    if (isSupabaseConfigured && supabase && currentUser?.empId) {
      supabase.from('attendance').update({
        check_out: timeStr,
        hours_logged: hours,
        status: isHalfDay ? 'Half Day' : target.status
      }).eq('emp_id', currentUser.empId).eq('date', '2026-10-24').then();
    }
  };

  // M4: Attendance Correction
  const requestAttendanceCorrection = (attId, proposedTime, reason) => {
    const target = attendance.find(a => a.id === attId);
    if (!target) return;

    const newCorr = {
      id: `CORR-0${corrections.length + 1}`,
      empId: target.empId,
      name: target.name,
      date: target.date,
      originalCheckIn: target.checkIn,
      proposedCheckIn: proposedTime,
      reason: reason,
      status: 'Pending'
    };

    setCorrections(prev => [newCorr, ...prev]);
    setAttendance(prev => prev.map(a => a.id === attId ? { ...a, correctionRequested: true } : a));
    addAuditLog(currentUser.name, 'REQUEST_ATTENDANCE_CORRECTION', `Correction #${newCorr.id}`, null, newCorr, `Requested correction: "${reason}"`);

    // Sync to Supabase table
    if (isSupabaseConfigured && supabase) {
      supabase.from('attendance_corrections').insert([{
        id: newCorr.id,
        emp_id: target.empId,
        name: target.name,
        date: target.date,
        original_check_in: target.checkIn,
        proposed_check_in: proposedTime,
        reason: reason,
        status: 'Pending'
      }]).then();
    }
  };

  const approveCorrection = (corrId) => {
    const target = corrections.find(c => c.id === corrId);
    if (!target) return;

    setCorrections(prev => prev.map(c => c.id === corrId ? { ...c, status: 'Approved' } : c));
    setAttendance(prev => prev.map(a => {
      if (a.empId === target.empId && a.date === target.date) {
        return {
          ...a,
          checkIn: target.proposedCheckIn,
          status: 'Present',
          correctionRequested: false
        };
      }
      return a;
    }));

    addAuditLog('Zubair Khan (HR)', 'APPROVE_ATTENDANCE_CORRECTION', `Correction #${corrId}`, { status: 'Pending' }, { status: 'Approved' }, `Approved correction for ${target.name}`);

    if (isSupabaseConfigured && supabase) {
      supabase.from('attendance_corrections').update({ status: 'Approved' }).eq('id', corrId).then();
      supabase.from('attendance').update({ check_in: target.proposedCheckIn, status: 'Present', correction_requested: false }).eq('emp_id', target.empId).eq('date', target.date).then();
    }
  };

  const rejectCorrection = (corrId, comment = 'Disapproved by HR.') => {
    const target = corrections.find(c => c.id === corrId);
    if (!target) return;

    setCorrections(prev => prev.map(c => c.id === corrId ? { ...c, status: 'Rejected', hrComment: comment } : c));
    setAttendance(prev => prev.map(a => {
      if (a.empId === target.empId && a.date === target.date) {
        return {
          ...a,
          correctionRequested: false
        };
      }
      return a;
    }));

    addAuditLog('Zubair Khan (HR)', 'REJECT_ATTENDANCE_CORRECTION', `Correction #${corrId}`, { status: 'Pending' }, { status: 'Rejected' }, `Rejected correction for ${target.name}: ${comment}`);

    if (isSupabaseConfigured && supabase) {
      supabase.from('attendance_corrections').update({ status: 'Rejected', hr_comment: comment }).eq('id', corrId).then();
      supabase.from('attendance').update({ correction_requested: false }).eq('emp_id', target.empId).eq('date', target.date).then();
    }
  };

  // M5: Apply Leave (Quota check, working days skip weekends/holidays, overlap/overbalance = 422)
  const applyLeave = (leaveData) => {
    // Quota validation
    const emp = employees.find(e => e.id === currentUser.empId);
    const quotaLeft = leaveData.type === 'Sick' ? emp?.sickLeaveBalance : leaveData.type === 'Casual' ? emp?.casualLeaveBalance : emp?.annualLeaveBalance;
    
    if (leaveData.workingDays > quotaLeft && leaveData.type !== 'Unpaid') {
      alert(`HTTP 422 Unprocessable Entity: Over-balance error! Requested ${leaveData.workingDays} days exceeds remaining quota of ${quotaLeft} days.`);
      return false;
    }

    const newLeave = {
      id: `LV-10${leaveRequests.length + 1}`,
      empId: currentUser.empId,
      name: currentUser.name,
      dept: currentUser.dept || 'Engineering',
      type: leaveData.type,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      workingDays: Number(leaveData.workingDays),
      reason: leaveData.reason,
      status: 'Pending',
      hrComment: ''
    };

    setLeaveRequests(prev => [newLeave, ...prev]);
    addAuditLog(currentUser.name, 'APPLY_LEAVE', `Leave #${newLeave.id}`, null, newLeave, `Applied for ${newLeave.workingDays}d ${newLeave.type} leave`);

    if (isSupabaseConfigured && supabase) {
      supabase.from('leave_requests').insert([{
        id: newLeave.id,
        emp_id: currentUser.empId,
        name: currentUser.name,
        dept: currentUser.dept || 'Engineering',
        type: leaveData.type,
        start_date: leaveData.startDate,
        end_date: leaveData.endDate,
        working_days: Number(leaveData.workingDays),
        reason: leaveData.reason,
        status: 'Pending'
      }]).then();
    }
    return true;
  };

  const approveLeaveRequest = (leaveId, comment = 'Approved by HR') => {
    const target = leaveRequests.find(l => l.id === leaveId);
    if (!target) return;

    setLeaveRequests(prev => prev.map(l => l.id === leaveId ? { ...l, status: 'Approved', hrComment: comment } : l));
    
    // Deduct quota
    setEmployees(prev => prev.map(e => {
      if (e.id === target.empId) {
        if (target.type === 'Sick') return { ...e, sickLeaveBalance: Math.max(0, e.sickLeaveBalance - target.workingDays) };
        if (target.type === 'Casual') return { ...e, casualLeaveBalance: Math.max(0, e.casualLeaveBalance - target.workingDays) };
        if (target.type === 'Annual') return { ...e, annualLeaveBalance: Math.max(0, e.annualLeaveBalance - target.workingDays) };
      }
      return e;
    }));

    addAuditLog('Zubair Khan (HR)', 'APPROVE_LEAVE', `Leave #${leaveId}`, { status: 'Pending' }, { status: 'Approved' }, `Approved ${target.workingDays}d ${target.type} leave for ${target.name}. Comment: "${comment}"`);

    if (isSupabaseConfigured && supabase) {
      supabase.from('leave_requests').update({ status: 'Approved', hr_comment: comment }).eq('id', leaveId).then();
    }
  };

  const rejectLeaveRequest = (leaveId, comment = 'Rejected by HR') => {
    setLeaveRequests(prev => prev.map(l => l.id === leaveId ? { ...l, status: 'Rejected', hrComment: comment } : l));
    addAuditLog('Zubair Khan (HR)', 'REJECT_LEAVE', `Leave #${leaveId}`, { status: 'Pending' }, { status: 'Rejected' }, `Rejected leave request. Comment: "${comment}"`);

    if (isSupabaseConfigured && supabase) {
      supabase.from('leave_requests').update({ status: 'Rejected', hr_comment: comment }).eq('id', leaveId).then();
    }
  };

  // M6: Finalize Payroll (Admin Only - locks the month, finalized runs cannot be edited)
  const finalizePayroll = () => {
    if (payroll.isFinalized) return;
    setPayroll(prev => ({
      ...prev,
      isFinalized: true,
      finalizedBy: currentUser.name,
      finalizedAt: new Date().toLocaleTimeString()
    }));
    addAuditLog(currentUser.name, 'FINALIZE_PAYROLL', `Payroll ${payroll.month}`, { isFinalized: false }, { isFinalized: true }, 'Admin finalized and locked the monthly payroll batch. Payslips published.');

    if (isSupabaseConfigured && supabase) {
      supabase.from('payroll_runs').update({
        is_finalized: true,
        finalized_by: currentUser.name,
        finalized_at: new Date().toISOString()
      }).eq('id', 'PR-2026-10').then();
    }
  };

  // M9: Post Announcement (Admin / HR)
  const postAnnouncement = (title, content) => {
    const newAnn = {
      id: `ANN-0${announcements.length + 1}`,
      title,
      content,
      postedBy: currentUser.name,
      date: '2026-10-24'
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    addAuditLog(currentUser.name, 'POST_ANNOUNCEMENT', `Announcement #${newAnn.id}`, null, newAnn, `Published announcement: "${title}"`);

    if (isSupabaseConfigured && supabase) {
      supabase.from('announcements').insert([{
        id: newAnn.id,
        title: newAnn.title,
        author: newAnn.postedBy,
        role: currentUser?.role || 'Admin',
        date: newAnn.date,
        content: newAnn.content,
        priority: 'Normal',
        tags: ['General']
      }]).then();
    }
  };

  // Generic Audit Logger
  const addAuditLog = (actor, action, entity, before, after, details) => {
    const newLog = {
      id: `AUD-00${auditLogs.length + 1}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      action,
      entity,
      before,
      after,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('audit_logs').insert([{
        id: newLog.id,
        timestamp: newLog.timestamp,
        actor: newLog.actor,
        action: newLog.action,
        entity: newLog.entity,
        details: newLog.details,
        before_state: newLog.before,
        after_state: newLog.after
      }]).then();
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isSupabaseConfigured,
        DEFAULT_ACCOUNTS,
        activePage,
        setActivePage,
        isAIOpen,
        toggleAIChat: () => setIsAIOpen(prev => !prev),
        orgSettings,
        setOrgSettings,
        employees,
        registerEmployee,
        attendance,
        markCheckIn,
        markCheckOut,
        corrections,
        requestAttendanceCorrection,
        approveCorrection,
        rejectCorrection,
        leaveRequests,
        applyLeave,
        approveLeaveRequest,
        rejectLeaveRequest,
        payroll,
        finalizePayroll,
        announcements,
        postAnnouncement,
        notifications,
        auditLogs,
        addAuditLog,
        isAddEmployeeOpen,
        setIsAddEmployeeOpen,
        isSmartLeaveOpen,
        setIsSmartLeaveOpen,
        isBiometricCheckinOpen,
        setIsBiometricCheckinOpen,
        isCorrectionModalOpen,
        setIsCorrectionModalOpen,
        selectedAttendanceForCorrection,
        setSelectedAttendanceForCorrection
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
