-- ==============================================================================
-- HCM LITE: COMPLETE SUPABASE SEED DATA SCRIPT
-- Paste this into your Supabase Dashboard -> SQL Editor and click RUN.
-- This populates all tables: auth users, profiles, employees, attendance,
-- leave requests, corrections, payroll, announcements, and audit logs.
-- ==============================================================================

-- 1. Create Default Users in auth.users (Admin, HR, Employee)
-- Passwords are encrypted with bcrypt:
-- admin@saylani.org -> admin123
-- hr@saylani.org    -> hr123
-- ayesha@saylani.org-> emp123

DO $$
BEGIN
  -- Insert Admin in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@saylani.org') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      'a1111111-1111-1111-1111-111111111111',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'admin@saylani.org',
      crypt('admin123', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Admin User","role":"admin","title":"Company Administrator","dept":"Executive","emp_id":"EMP-001","avatar":"AD"}',
      NOW(),
      NOW()
    );
  END IF;

  -- Insert HR in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'hr@saylani.org') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      'b2222222-2222-2222-2222-222222222222',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'hr@saylani.org',
      crypt('hr123', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Zubair Khan","role":"hr","title":"HR Operations Lead","dept":"Human Resources","emp_id":"EMP-002","avatar":"ZK"}',
      NOW(),
      NOW()
    );
  END IF;

  -- Insert Employee in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ayesha@saylani.org') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      'c3333333-3333-3333-3333-333333333333',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'ayesha@saylani.org',
      crypt('emp123', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Ayesha Siddiqui","role":"employee","title":"Frontend Engineer","dept":"Engineering","emp_id":"EMP-003","avatar":"AS"}',
      NOW(),
      NOW()
    );
  END IF;
END $$;

-- 2. Populate public.profiles
INSERT INTO public.profiles (id, email, name, role, title, dept, emp_id, avatar)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'admin@saylani.org', 'Admin User', 'admin', 'Company Administrator', 'Executive', 'EMP-001', 'AD'),
  ('b2222222-2222-2222-2222-222222222222', 'hr@saylani.org', 'Zubair Khan', 'hr', 'HR Operations Lead', 'Human Resources', 'EMP-002', 'ZK'),
  ('c3333333-3333-3333-3333-333333333333', 'ayesha@saylani.org', 'Ayesha Siddiqui', 'employee', 'Frontend Engineer', 'Engineering', 'EMP-003', 'AS')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  title = EXCLUDED.title,
  dept = EXCLUDED.dept,
  emp_id = EXCLUDED.emp_id,
  avatar = EXCLUDED.avatar;

-- 3. Populate public.org_settings (Module M2)
INSERT INTO public.org_settings (
  id,
  company_name,
  office_start,
  grace_period_minutes,
  half_day_threshold_hours,
  weekend_days,
  office_lat,
  office_lng,
  geofence_radius_meters,
  annual_quota,
  sick_quota,
  casual_quota
) VALUES (
  1,
  'Saylani HCM Solutions Ltd.',
  '09:00',
  15,
  5.0,
  ARRAY['Saturday', 'Sunday'],
  24.8607,
  67.0011,
  150,
  14,
  8,
  10
) ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  office_start = EXCLUDED.office_start,
  grace_period_minutes = EXCLUDED.grace_period_minutes,
  half_day_threshold_hours = EXCLUDED.half_day_threshold_hours;

-- 4. Populate public.employees (Module M3: Directory & Salary 1.5x Basic)
INSERT INTO public.employees (
  emp_id, name, email, dept, role, status, joining_date,
  basic_salary, hra_allowance, med_allowance, gross_salary,
  annual_leave_balance, sick_leave_balance, casual_leave_balance, gender, tenure_months
) VALUES
  ('EMP-001', 'Admin User', 'admin@saylani.org', 'Executive', 'Company Administrator', 'Active', '2025-04-15', 100000, 40000, 10000, 150000, 14, 8, 10, 'Male', 18),
  ('EMP-002', 'Zubair Khan', 'hr@saylani.org', 'Human Resources', 'HR Operations Lead', 'Active', '2025-06-01', 80000, 32000, 8000, 120000, 14, 8, 10, 'Male', 16),
  ('EMP-003', 'Ayesha Siddiqui', 'ayesha@saylani.org', 'Core Platform Engineering', 'Frontend Engineer', 'Active', '2025-09-15', 80000, 32000, 8000, 120000, 12, 7, 9, 'Female', 13),
  ('EMP-004', 'Bilawal Sheikh', 'bilawal@saylani.org', 'Core Platform Engineering', 'Cloud Architect', 'Active', '2025-08-01', 90000, 36000, 9000, 135000, 10, 6, 8, 'Male', 14),
  ('EMP-005', 'Fatima Noor', 'fatima@saylani.org', 'Design & Experience', 'UI/UX Lead', 'Active', '2026-01-10', 60000, 24000, 6000, 90000, 14, 8, 10, 'Female', 9)
ON CONFLICT (emp_id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  gross_salary = EXCLUDED.gross_salary;

-- 5. Populate public.attendance (Module M4: Check-in, Lateness, Geofence)
INSERT INTO public.attendance (
  emp_id, name, dept, date, check_in, check_out, hours_logged, status, source, correction_requested
) VALUES
  ('EMP-001', 'Admin User', 'Executive', CURRENT_DATE, '08:52 AM', '--', 0.5, 'Present', 'Biometric Terminal #1', false),
  ('EMP-002', 'Zubair Khan', 'Human Resources', CURRENT_DATE, '09:05 AM', '--', 0.4, 'Present', 'Web Portal (Within 150m)', false),
  ('EMP-003', 'Ayesha Siddiqui', 'Core Platform Engineering', CURRENT_DATE, '09:24 AM', '--', 0.2, 'Late', 'Camera Biometrics', true),
  ('EMP-004', 'Bilawal Sheikh', 'Core Platform Engineering', CURRENT_DATE, '09:01 AM', '--', 0.4, 'Present', 'Mobile Geofence', false),
  ('EMP-005', 'Fatima Noor', 'Design & Experience', CURRENT_DATE, '08:58 AM', '--', 0.5, 'Present', 'Web Portal', false)
ON CONFLICT (emp_id, date) DO UPDATE SET
  check_in = EXCLUDED.check_in,
  status = EXCLUDED.status;

-- 6. Populate public.attendance_corrections (Module M4: Checklist #12)
INSERT INTO public.attendance_corrections (
  id, emp_id, name, date, original_check_in, proposed_check_in, reason, status, hr_comment
) VALUES
  ('CORR-01', 'EMP-003', 'Ayesha Siddiqui', CURRENT_DATE, '09:24 AM', '09:05 AM', 'Biometric queue in lobby was long and scanner delayed check-in log', 'Pending', NULL)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status;

-- 7. Populate public.leave_requests (Module M5: Leave Quotas & Approval Queue)
INSERT INTO public.leave_requests (
  id, emp_id, name, dept, type, start_date, end_date, working_days, reason, status, hr_comment
) VALUES
  ('LV-101', 'EMP-003', 'Ayesha Siddiqui', 'Core Platform Engineering', 'Casual', '2026-10-27', '2026-10-28', 2, 'Family wedding ceremony', 'Pending', NULL),
  ('LV-102', 'EMP-004', 'Bilawal Sheikh', 'Core Platform Engineering', 'Sick', '2026-10-20', '2026-10-21', 2, 'Severe seasonal flu with fever', 'Approved', 'Approved. Medical certificate submitted.')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status;

-- 8. Populate public.payroll_runs (Module M6: Monthly Payroll Engine)
INSERT INTO public.payroll_runs (
  id, month, year, working_days, is_finalized, finalized_by, finalized_at
) VALUES
  ('PR-2026-10', 'October 2026', 2026, 22, false, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- 9. Populate public.payroll_records (Module M6: Itemized Salary Breakdown)
INSERT INTO public.payroll_records (
  id, payroll_id, emp_id, name, dept, basic, hra, med, gross, per_day,
  absent_days, half_days, deductions, annual_tax, monthly_tax, net, status
) VALUES
  ('PRR-001', 'PR-2026-10', 'EMP-001', 'Admin User', 'Executive', 100000, 40000, 10000, 150000, 6818, 0, 0, 0, 120000, 10000, 140000, 'Draft'),
  ('PRR-002', 'PR-2026-10', 'EMP-002', 'Zubair Khan', 'Human Resources', 80000, 32000, 8000, 120000, 5455, 0, 0, 0, 66000, 5500, 114500, 'Draft'),
  ('PRR-003', 'PR-2026-10', 'EMP-003', 'Ayesha Siddiqui', 'Core Platform Engineering', 80000, 32000, 8000, 120000, 5455, 1, 0, 5455, 66000, 5500, 109045, 'Draft'),
  ('PRR-004', 'PR-2026-10', 'EMP-004', 'Bilawal Sheikh', 'Core Platform Engineering', 90000, 36000, 9000, 135000, 6136, 0, 1, 3068, 93000, 7750, 124182, 'Draft'),
  ('PRR-005', 'PR-2026-10', 'EMP-005', 'Fatima Noor', 'Design & Experience', 60000, 24000, 6000, 90000, 4091, 0, 0, 0, 24000, 2000, 88000, 'Draft')
ON CONFLICT (id) DO UPDATE SET
  net = EXCLUDED.net;

-- 10. Populate public.announcements (Module M9: Broadcasts)
INSERT INTO public.announcements (
  id, title, author, role, date, content, priority, tags
) VALUES
  ('ANN-01', 'SMIT Hackathon 2026 Project Showcase', 'Admin User', 'Company Administrator', '2026-10-24', 'Welcome judges and evaluators to the HCM Lite AI-assisted enterprise human capital management platform.', 'High', ARRAY['Hackathon', 'Showcase']),
  ('ANN-02', 'Quarterly System Performance Audit', 'Zubair Khan', 'HR Operations Lead', '2026-10-23', 'Office shift grace window ends strictly at 09:15 AM. Camera biometric stations are online.', 'Normal', ARRAY['Operations', 'Policy'])
ON CONFLICT (id) DO NOTHING;

-- 11. Populate public.audit_logs (Module M9: Checklist #25 Immutable Ledger)
INSERT INTO public.audit_logs (
  id, timestamp, actor, action, entity, details, before_state, after_state
) VALUES
  ('AUD-001', '2026-10-24 08:30:00', 'Admin User', 'UPDATE_ORG_SETTINGS', 'OrgSettings', 'Configured 09:00 shift with 15m grace and 150m geofence radius', '{"grace": 10}', '{"grace": 15}'),
  ('AUD-002', '2026-10-24 09:00:00', 'Zubair Khan', 'REGISTER_EMPLOYEE', 'Employee #EMP-003', 'Registered Ayesha Siddiqui with PKR 120,000 gross salary', NULL, '{"empId": "EMP-003", "gross": 120000}'),
  ('AUD-003', '2026-10-24 09:24:12', 'Ayesha Siddiqui', 'CHECK_IN', 'Attendance #EMP-003', 'Camera check-in marked Late at 09:24 AM (after grace 09:15 AM)', NULL, '{"checkIn": "09:24 AM", "status": "Late"}'),
  ('AUD-004', '2026-10-24 09:25:40', 'Ayesha Siddiqui', 'REQUEST_ATTENDANCE_CORRECTION', 'Correction #CORR-01', 'Requested correction to 09:05 AM citing queue lag', NULL, '{"proposed": "09:05 AM"}')
ON CONFLICT (id) DO NOTHING;
