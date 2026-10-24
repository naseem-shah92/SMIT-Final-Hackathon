-- ==============================================================================
-- HCM LITE: COMPLETE SUPABASE PRODUCTION DATABASE SCHEMA
-- Saylani Hackathon Challenge Brief (24 October 2026)
-- Modules: M1 Auth, M2 Org Setup, M3 Directory, M4 Attendance, M5 Leave,
--          M6 Payroll, M7 Dashboard, M8 Copilot, M9 Governance & Audit
-- ==============================================================================

-- 1. Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- TABLE: public.profiles (Extends auth.users with strict RBAC)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'hr', 'employee')),
  title TEXT DEFAULT 'Team Member',
  dept TEXT DEFAULT 'Engineering',
  emp_id TEXT UNIQUE,
  avatar TEXT DEFAULT 'U',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE: public.org_settings (Module M2: Shift, Grace, Geofence, Quotas)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.org_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name TEXT NOT NULL DEFAULT 'Saylani HCM Solutions Ltd.',
  office_start TEXT NOT NULL DEFAULT '09:00',
  grace_period_minutes INT NOT NULL DEFAULT 15,
  half_day_threshold_hours NUMERIC(3,1) NOT NULL DEFAULT 5.0,
  weekend_days TEXT[] DEFAULT ARRAY['Saturday', 'Sunday'],
  office_lat NUMERIC(10,6) DEFAULT 24.8607,
  office_lng NUMERIC(10,6) DEFAULT 67.0011,
  geofence_radius_meters INT DEFAULT 150,
  annual_quota INT DEFAULT 14,
  sick_quota INT DEFAULT 8,
  casual_quota INT DEFAULT 10,
  departments TEXT[] DEFAULT ARRAY['Core Platform Engineering', 'Human Resources', 'Executive Infrastructure', 'Design & Experience'],
  designations TEXT[] DEFAULT ARRAY['Software Engineer', 'Senior Engineer', 'HR Operations Lead', 'Company Administrator', 'Product Designer'],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE: public.employees (Module M3: Employee Directory 360 & Salary Structure)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emp_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  dept TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Terminated', 'Resigned')),
  joining_date DATE NOT NULL,
  basic_salary NUMERIC(12,2) NOT NULL CHECK (basic_salary > 0),
  hra_allowance NUMERIC(12,2) NOT NULL, -- 40% of basic
  med_allowance NUMERIC(12,2) NOT NULL, -- 10% of basic
  gross_salary NUMERIC(12,2) NOT NULL,  -- 1.5x basic
  annual_leave_balance INT DEFAULT 14,
  sick_leave_balance INT DEFAULT 8,
  casual_leave_balance INT DEFAULT 10,
  gender TEXT DEFAULT 'Not Specified',
  tenure_months INT DEFAULT 6,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE: public.attendance (Module M4: Telemetry, Geofence, Check-in/out)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emp_id TEXT NOT NULL REFERENCES public.employees(emp_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dept TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in TEXT NOT NULL,
  check_out TEXT,
  hours_logged NUMERIC(4,1) DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('Present', 'Late', 'Half Day', 'Absent', 'On Leave')),
  source TEXT NOT NULL DEFAULT 'Web Portal',
  correction_requested BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_emp_date UNIQUE(emp_id, date) -- Section 4 Rule: Duplicate check-in rejected (HTTP 409)
);

-- ==============================================================================
-- TABLE: public.attendance_corrections (Module M4: Checklist #12)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.attendance_corrections (
  id TEXT PRIMARY KEY,
  emp_id TEXT NOT NULL REFERENCES public.employees(emp_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  original_check_in TEXT NOT NULL,
  proposed_check_in TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  hr_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE: public.leave_requests (Module M5: Working Days & Quota Deductions)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.leave_requests (
  id TEXT PRIMARY KEY,
  emp_id TEXT NOT NULL REFERENCES public.employees(emp_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dept TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Annual', 'Sick', 'Casual', 'Unpaid')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  working_days INT NOT NULL CHECK (working_days > 0),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  hr_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE: public.payroll_runs (Module M6: Monthly Payroll Lock Engine)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.payroll_runs (
  id TEXT PRIMARY KEY,
  month TEXT NOT NULL,
  year INT NOT NULL,
  working_days INT NOT NULL DEFAULT 22,
  is_finalized BOOLEAN DEFAULT FALSE,
  finalized_by TEXT,
  finalized_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE: public.payroll_records (Module M6: Itemized Payslips & Tax Slabs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.payroll_records (
  id TEXT PRIMARY KEY,
  payroll_id TEXT NOT NULL REFERENCES public.payroll_runs(id) ON DELETE CASCADE,
  emp_id TEXT NOT NULL REFERENCES public.employees(emp_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dept TEXT NOT NULL,
  basic NUMERIC(12,2) NOT NULL,
  hra NUMERIC(12,2) NOT NULL,
  med NUMERIC(12,2) NOT NULL,
  gross NUMERIC(12,2) NOT NULL,
  per_day NUMERIC(12,2) NOT NULL,
  absent_days INT DEFAULT 0,
  half_days INT DEFAULT 0,
  deductions NUMERIC(12,2) DEFAULT 0,
  annual_tax NUMERIC(12,2) DEFAULT 0,
  monthly_tax NUMERIC(12,2) DEFAULT 0,
  net NUMERIC(12,2) NOT NULL,
  status TEXT DEFAULT 'Draft'
);

-- ==============================================================================
-- TABLE: public.announcements (Module M9: Bulletins & Feeds)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  role TEXT NOT NULL,
  date TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'Normal' CHECK (priority IN ('Normal', 'High', 'Urgent')),
  tags TEXT[] DEFAULT ARRAY['General'],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE: public.audit_logs (Module M9: Checklist #25 Immutable Ledger)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  details TEXT NOT NULL,
  before_state JSONB,
  after_state JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile; Admin & HR can read all
CREATE POLICY "Profiles are viewable by owner or HR/Admin"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'hr'));

CREATE POLICY "Profiles updateable by user or Admin"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Org Settings: Read for all authenticated; Update ONLY for Admin
CREATE POLICY "Org settings viewable by authenticated users"
  ON public.org_settings FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Org settings updateable only by Admin"
  ON public.org_settings FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Attendance: Employees see their own; Admin & HR see all
CREATE POLICY "Attendance viewable by owner or HR/Admin"
  ON public.attendance FOR SELECT
  TO authenticated
  USING (
    emp_id = (SELECT emp_id FROM public.profiles WHERE id = auth.uid())
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'hr')
  );

CREATE POLICY "Attendance insertable by owner"
  ON public.attendance FOR INSERT
  TO authenticated
  WITH CHECK (
    emp_id = (SELECT emp_id FROM public.profiles WHERE id = auth.uid())
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'hr')
  );

-- Attendance Corrections: Owner views own; HR/Admin views all
CREATE POLICY "Corrections viewable by owner or HR/Admin"
  ON public.attendance_corrections FOR SELECT
  TO authenticated
  USING (
    emp_id = (SELECT emp_id FROM public.profiles WHERE id = auth.uid())
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'hr')
  );

CREATE POLICY "Corrections updateable by HR/Admin"
  ON public.attendance_corrections FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'hr'));

-- Leave Requests: Owner views own; HR/Admin views all
CREATE POLICY "Leaves viewable by owner or HR/Admin"
  ON public.leave_requests FOR SELECT
  TO authenticated
  USING (
    emp_id = (SELECT emp_id FROM public.profiles WHERE id = auth.uid())
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'hr')
  );

CREATE POLICY "Leaves updateable by HR/Admin"
  ON public.leave_requests FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'hr'));

-- Payroll: Section 2 Security Rule: Employees ONLY view own records for FINALIZED runs!
CREATE POLICY "Payroll records viewable by owner if locked, or HR/Admin"
  ON public.payroll_records FOR SELECT
  TO authenticated
  USING (
    (emp_id = (SELECT emp_id FROM public.profiles WHERE id = auth.uid()) 
     AND EXISTS (SELECT 1 FROM public.payroll_runs pr WHERE pr.id = payroll_id AND pr.is_finalized = true))
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'hr')
  );

-- Audit Logs: Section 2 Rule: ONLY Admin can view audit logs. Immutable (no updates or deletes).
CREATE POLICY "Audit logs viewable exclusively by Admin"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Audit logs insertable by system"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH.USERS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, title, dept, emp_id, avatar)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee'),
    COALESCE(NEW.raw_user_meta_data->>'title', 'Team Member'),
    COALESCE(NEW.raw_user_meta_data->>'dept', 'Engineering'),
    COALESCE(NEW.raw_user_meta_data->>'emp_id', 'EMP-' || substr(md5(random()::text), 1, 4)),
    COALESCE(NEW.raw_user_meta_data->>'avatar', upper(substr(split_part(NEW.email, '@', 1), 1, 2)))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- INITIAL SEED DATA (Module M1 to M9)
-- ==============================================================================

-- 1. Create Default Users in auth.users (Admin, HR, Employee)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@saylani.org') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
      'a1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated', 'admin@saylani.org', crypt('admin123', gen_salt('bf')),
      NOW(), '{"provider":"email","providers":["email"]}',
      '{"name":"Admin User","role":"admin","title":"Company Administrator","dept":"Executive","emp_id":"EMP-001","avatar":"AD"}',
      NOW(), NOW()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'hr@saylani.org') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
      'b2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated', 'hr@saylani.org', crypt('hr123', gen_salt('bf')),
      NOW(), '{"provider":"email","providers":["email"]}',
      '{"name":"Zubair Khan","role":"hr","title":"HR Operations Lead","dept":"Human Resources","emp_id":"EMP-002","avatar":"ZK"}',
      NOW(), NOW()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ayesha@saylani.org') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
      'c3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated', 'ayesha@saylani.org', crypt('emp123', gen_salt('bf')),
      NOW(), '{"provider":"email","providers":["email"]}',
      '{"name":"Ayesha Siddiqui","role":"employee","title":"Frontend Engineer","dept":"Engineering","emp_id":"EMP-003","avatar":"AS"}',
      NOW(), NOW()
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
  id, company_name, office_start, grace_period_minutes, half_day_threshold_hours,
  weekend_days, office_lat, office_lng, geofence_radius_meters, annual_quota, sick_quota, casual_quota
) VALUES (
  1, 'Saylani HCM Solutions Ltd.', '09:00', 15, 5.0,
  ARRAY['Saturday', 'Sunday'], 24.8607, 67.0011, 150, 14, 8, 10
) ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  office_start = EXCLUDED.office_start,
  grace_period_minutes = EXCLUDED.grace_period_minutes,
  half_day_threshold_hours = EXCLUDED.half_day_threshold_hours;

-- 4. Populate public.employees (Module M3)
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

-- 5. Populate public.attendance (Module M4)
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

-- 7. Populate public.leave_requests (Module M5)
INSERT INTO public.leave_requests (
  id, emp_id, name, dept, type, start_date, end_date, working_days, reason, status, hr_comment
) VALUES
  ('LV-101', 'EMP-003', 'Ayesha Siddiqui', 'Core Platform Engineering', 'Casual', '2026-10-27', '2026-10-28', 2, 'Family wedding ceremony', 'Pending', NULL),
  ('LV-102', 'EMP-004', 'Bilawal Sheikh', 'Core Platform Engineering', 'Sick', '2026-10-20', '2026-10-21', 2, 'Severe seasonal flu with fever', 'Approved', 'Approved. Medical certificate submitted.')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status;

-- 8. Populate public.payroll_runs & records (Module M6)
INSERT INTO public.payroll_runs (
  id, month, year, working_days, is_finalized, finalized_by, finalized_at
) VALUES
  ('PR-2026-10', 'October 2026', 2026, 22, false, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

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

-- 9. Populate public.announcements (Module M9)
INSERT INTO public.announcements (
  id, title, author, role, date, content, priority, tags
) VALUES
  ('ANN-01', 'SMIT Hackathon 2026 Project Showcase', 'Admin User', 'Company Administrator', '2026-10-24', 'Welcome judges and evaluators to the HCM Lite AI-assisted enterprise human capital management platform.', 'High', ARRAY['Hackathon', 'Showcase']),
  ('ANN-02', 'Quarterly System Performance Audit', 'Zubair Khan', 'HR Operations Lead', '2026-10-23', 'Office shift grace window ends strictly at 09:15 AM. Camera biometric stations are online.', 'Normal', ARRAY['Operations', 'Policy'])
ON CONFLICT (id) DO NOTHING;

-- 10. Populate public.audit_logs (Module M9)
INSERT INTO public.audit_logs (
  id, timestamp, actor, action, entity, details, before_state, after_state
) VALUES
  ('AUD-001', '2026-10-24 08:30:00', 'Admin User', 'UPDATE_ORG_SETTINGS', 'OrgSettings', 'Configured 09:00 shift with 15m grace and 150m geofence radius', '{"grace": 10}', '{"grace": 15}'),
  ('AUD-002', '2026-10-24 09:00:00', 'Zubair Khan', 'REGISTER_EMPLOYEE', 'Employee #EMP-003', 'Registered Ayesha Siddiqui with PKR 120,000 gross salary', NULL, '{"empId": "EMP-003", "gross": 120000}'),
  ('AUD-003', '2026-10-24 09:24:12', 'Ayesha Siddiqui', 'CHECK_IN', 'Attendance #EMP-003', 'Camera check-in marked Late at 09:24 AM (after grace 09:15 AM)', NULL, '{"checkIn": "09:24 AM", "status": "Late"}'),
  ('AUD-004', '2026-10-24 09:25:40', 'Ayesha Siddiqui', 'REQUEST_ATTENDANCE_CORRECTION', 'Correction #CORR-01', 'Requested correction to 09:05 AM citing queue lag', NULL, '{"proposed": "09:05 AM"}')
ON CONFLICT (id) DO NOTHING;
