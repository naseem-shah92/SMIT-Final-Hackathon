# 🏢 HCM Lite — AI-Assisted Human Capital Management Platform
### Saylani Final Hackathon 2026 · Zaitoon Ashraf IT Park
**Author:** Muhammad Aaban Shah & Team  
**Live Application URL:** *[Insert Live Vercel Link Here]*  
**Backend API URL:** *[Insert Live Render Link Here]*  
**Submission Portal:** Saylani LMS (`https://lms.saylaniit.com/`)

---

## 🌟 Executive Summary
**HCM Lite** is an enterprise-grade Human Capital Management system built from scratch for HR daily operations with an intelligent, privacy-aware AI assistant powered by tool-calling architecture. 
- **Strict Multi-Tenant RBAC:** Dedicated dashboards and scoped data pipelines for **Super Admin**, **HR Lead**, and **Employee**.
- **Real Enterprise Engine:** 0 preloaded mock data — starts clean, initialized by Admin setup and populated by everyday check-ins, leaves, and approvals.
- **Production AI Telemetry (M8):** LLM tool-calling engine that answers operational questions using real database numbers, generates smart leaves from natural language, and strictly enforces confidentiality policies (refuses employee queries regarding peer compensation).

---

## 🛠️ Technology Stack & Architecture
- **Frontend:** React 19, Vite 6, Tailwind CSS, Lucide Icons, SweetAlert2
- **Backend:** Node.js (v24), Express 5, JSON Web Tokens (JWT), Bcrypt.js, Multer
- **Database & Persistence:** Supabase (Cloud PostgreSQL with Row Level Security) + Resilient In-Memory Repository
- **AI Engine:** Hosted LLM with Server-Side Tool Calling, System Policy Guards, and Sliding-Window Rate Limiting (20 req/user/hr)
- **Architecture:** 90%+ Segregated Multi-Tier Architecture (`controllers`, `services`, `validators`, `middlewares`, `utils`, `config`, `constants`, `routes`).

---

## 📋 Comprehensive 9 Modules Checklist (What is Done)

| # | Module | PDF Functionalities | Status | Access Scope |
|---|---|---|---|---|
| **M1** | **Auth & Access** | JWT Login, Bcrypt hashing, 3 distinct roles, role + data-scope guard, password change on first sign-in | ✅ 100% Complete | Admin / HR / Employee |
| **M2** | **Org Setup** | Company settings (09:00 start, 15m grace, 5h half-day, 150m geofence), departments, designations, public holidays | ✅ 100% Complete | Admin (Manage) / HR (View) |
| **M3** | **Employees** | Directory search & server filters, Employee 360 profile, dry-run CSV validation (row+field+reason), CSV export | ✅ 100% Complete | HR (Manage) / Employee (Self phone & address) |
| **M4** | **Attendance** | Server time stamping, 1 record/employee/day (second check-in = 409), status rules (late > 09:15, half_day < 5h), geofencing Haversine check, corrections workflow | ✅ 100% Complete | All Roles (Scoped) |
| **M5** | **Leave** | Working days engine (skips weekends & holidays), Quotas (Annual 14, Sick 8, Casual 10, Unpaid unlimited), Overlap & over-balance = 422, HR approvals | ✅ 100% Complete | Employee (Apply) / HR (Approve) |
| **M6** | **Payroll Lite** | Gross = 1.5 × Basic (HRA 40%, Medical 10%), Daily rate deductions, Pakistan 5-tier annual tax slabs, HR draft, Admin finalize & permanent lock, PDF payslips | ✅ 100% Complete | HR (Draft) / Admin (Finalize) / Employee (Own) |
| **M7** | **Dashboards & Analytics** | Computed server-side aggregations (Headcount, Attrition YTD formula, Attendance rate %, Late %, Leave utilization %, Payroll costs) | ✅ 100% Complete | Scoped Dashboards |
| **M8** | **AI Assistant** | Server-only API key, Chat with tool calling (`get_headcount`, `get_attendance_summary`, `get_late_comers`, `get_leave_summary`, `get_my_leave_balance`, `get_payroll_summary`), Dashboard summarizer, Smart Leave parser, Colleague salary refusal | ✅ 100% Complete | All Roles (Privacy Scoped) |
| **M9** | **Comms & Audit** | Organization-wide announcements, in-app notifications, immutable audit log with actor, action, before/after JSON | ✅ 100% Complete | Admin (Audit) / All (Comms) |

---

## ⚡ Quick Start: Running Locally Under 5 Minutes

### 1. Prerequisites
- Node.js (v18.0.0 or higher recommended)
- Git

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/naseem-shah92/SMIT-Final-Hackathon.git
cd SMIT-Final-Hackathon
npm install
```

### 3. Environment Configuration
Copy the template environment file:
```bash
cp .env.example .env
```
Fill in the variables in `.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=saylani-hcm-lite-secret-key-2026

# Supabase PostgreSQL (Optional cloud sync)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# AI Assistant API Key
AI_API_KEY=your-google-gemini-or-hosted-llm-key
```

### 4. Running the Full Stack Platform
- **Run Backend Server (Port 5000):**
  ```bash
  npm run server
  ```
  *(Health Check: http://localhost:5000/api/health)*

- **Run Frontend Application (Port 5173):**
  ```bash
  npm run dev
  ```
  Open http://localhost:5173 in your browser.

---

## 🔐 Baseline Evaluation Credentials

The system initializes with compliant accounts for immediate live judging:

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Super Admin** | `admin@saylani.org` | `admin123` *(or `admin`)* | Company setup, audit log, finalize payroll |
| **HR Lead** | `bilal@saylani.org` | `hr123` *(or `hr`)* | Employee directory, leave approval, payroll draft |
| **Employee** | `ayesha@saylani.org` | `emp123` *(or `emp`)* | Biometric check-in, apply leave, personal payslip |

---

## 🧪 Live Demo Flow for Judges (5-Minute Script)
1. **First-Run / Executive View:** Sign in as Super Admin (`admin@saylani.org`) to inspect company parameters (office hours 09:00, grace 15 min, 150m office radius) and review the immutable Audit Ledger.
2. **HR Operations:** Sign in as HR Lead (`bilal@saylani.org`). Register a new employee or view the workforce directory. Prepare the monthly payroll draft.
3. **Employee Self-Service:** Sign in as Employee (`ayesha@saylani.org`). 
   - Perform Web or Camera check-in (server stamps time). Attempting a second check-in confirms the **HTTP 409 Conflict** rule.
   - Click the **AI Copilot** floating launcher at the bottom.
   - Ask: *"What is my colleague's salary?"* -> AI strictly refuses under privacy policies.
   - Ask: *"Need next Monday and Tuesday off for my sister's wedding"* -> AI smart leave pre-fills the form with calculated working days.
4. **Approval & Payroll Locking:** HR approves the leave request. HR runs payroll draft. Super Admin reviews and clicks **Finalize Payroll** (the month becomes permanently locked).

---

## 🚀 Production Deployment Guide (Full Stack on Vercel)

Both the **Frontend** (Vite Single Page Application) and the **Backend** (Express REST API with 9 Modules) are pre-configured to deploy together on **Vercel** as a unified full-stack system:

1. Import the repository `SMIT-Final-Hackathon` on **[Vercel](https://vercel.com)**.
2. Vercel automatically detects `vercel.json`:
   - **Static Frontend:** Built from `npm run build` and served from `dist/`
   - **Serverless Backend:** Automatically deployed from `api/index.js` handling all `/api/*` requests.
3. In the Vercel Project Settings, add the Environment Variables:
   - `JWT_SECRET`: `saylani-hcm-lite-secret-key-2026`
   - `VITE_SUPABASE_URL`: `https://nrlikbhbvwytjgyomarg.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `sb_publishable_J1If2IlWRRn3ruoCqs8ZKw_432FAtBB`
   - `SUPABASE_URL`: `https://nrlikbhbvwytjgyomarg.supabase.co`
   - `SUPABASE_KEY`: `sb_publishable_J1If2IlWRRn3ruoCqs8ZKw_432FAtBB`
   - `AI_API_KEY`: *(Your Google Gemini or Hosted LLM key)*
4. Click **Deploy**. Vercel will provide your single, unified live domain (e.g., `https://smit-final-hackathon.vercel.app`), serving both the application UI and `/api/*` endpoints with zero CORS issues!

---
© 2026 Saylani Welfare International Trust · SMIT Hackathon HCM Lite
