"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Calculator, 
  MapPin, 
  ShieldCheck, 
  Briefcase, 
  FileCheck2, 
  GraduationCap, 
  Bot, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  ExternalLink, 
  Lock, 
  Building2, 
  FileSpreadsheet, 
  Calendar,
  Sparkles,
  QrCode,
  Users2
} from "lucide-react";
import { cn } from "@/lib/utils";

export function FeaturesGrid() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const pillars = [
    {
      title: "Pakistan FY2025-26 Payroll & Tax Slabs",
      badge: "Statutory Precision",
      tagline: "Maker-Checker dual signoff with mathematical formula transparency on every payslip.",
      content: {
        highlights: [
          "FBR Salaried Slabs for FY 2025-26 seeded directly into database rules",
          "Automated split: Basic (60%), House Rent (30%), Utilities (10%)",
          "Tax-exempt medical allowances & EOBI employee contribution (PKR 1,980)",
          "Automated bank salary transfer CSV format for HBL, Meezan, Alfalah & MCB",
        ],
        mockSnippet: "advance_payroll(payroll_id, 'approve_hr') → advance_payroll(payroll_id, 'approve_finance')",
      },
    },
    {
      title: "GPS Haversine Attendance & Shifts",
      badge: "Anti-Spoofing",
      tagline: "Server-stamped check-ins with spherical trigonometry distance validation.",
      content: {
        highlights: [
          "Calculates exact distance between mobile device and registered branch office",
          "Rejects mock locations, proxy apps, and modified client-side device timestamps",
          "Rotational shift rosters with cross-midnight night-shift logic",
          "Weekend sandwich rule integration with annual and casual leave policies",
        ],
        mockSnippet: "6371000 * 2 * ASIN(SQRT(...)) <= branch.radius_meters (150m)",
      },
    },
    {
      title: "Modern ATS & Public Careers Portal",
      badge: "Talent Acquisition",
      tagline: "Branded careers board, explainable AI matching, and 1-click employee provisioning.",
      content: {
        highlights: [
          "Instant public careers portal at /careers?c=your-company with resume upload",
          "Explainable AI match scoring based on skills, experience, and salary expectations",
          "Structured interview scorecards and over-band salary approval workflows",
          "One-click hire automatically provisions employee record, department, and grade",
        ],
        mockSnippet: "hire_candidate(app_id) → auto-creates employee in public.employees",
      },
    },
    {
      title: "Employee Lifecycle & Final Settlement",
      badge: "Governance & Exits",
      tagline: "Multi-stakeholder onboarding checklists and automated gratuity/encashment calculations.",
      content: {
        highlights: [
          "Checklists assigned to specific stakeholders: HR, IT, Manager, Finance, and Buddy",
          "Resignation workflow with structured exit interview feedback",
          "Automated final settlement calculation: unpaid salary + leave encashment + gratuity - active loans",
          "Dual sign-off: HR settlement verification followed by Finance Controller release",
        ],
        mockSnippet: "advance_settlement(settlement_id, 'finance_approve')",
      },
    },
    {
      title: "Public Letter Verification & Vault",
      badge: "Verifiable Credentials",
      tagline: "Cryptographically verifiable experience letters and digital document vault.",
      content: {
        highlights: [
          "Experience letters and salary certificates generated with unique verification tokens",
          "Public verification portal at /verify for embassies, banks, and prospective employers",
          "Private documents vault with tenant-isolated Supabase storage policies",
          "Digital asset tracking (laptops, monitors, access cards) assigned to employees",
        ],
        mockSnippet: "GET /verify?code=EXP-2025-9821 → Instant verification",
      },
    },
    {
      title: "Permissions-Bound Edge AI Copilot",
      badge: "Role-Scoped AI",
      tagline: "A natural language workforce assistant strictly bounded by PostgreSQL row-level security.",
      content: {
        highlights: [
          "Supabase Edge Function querying the database under the caller's active user context",
          "Zero salary leakage: Line managers and employees cannot query confidential payroll data",
          "Every query, prompt, and system response is logged to an immutable ai_logs table",
          "Answers complex questions regarding shift rosters, leave overlaps, and policy rules",
        ],
        mockSnippet: "POST /functions/v1/copilot → Enforces auth.uid() & RLS policies",
      },
    },
  ];

  return (
    <section id="features" ref={sectionRef} className="py-24 sm:py-32 relative border-t border-line bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
            <Layers className="h-3.5 w-3.5" /> Built from the Ground Up
          </div>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">
            Six Core Pillars. Enforced by Server Authority.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink-soft leading-relaxed">
            Unlike superficial HR templates that store logic in the client, every single rule in HCM Master Suite lives in PostgreSQL database functions and triggers.
          </p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bento Item 1: Large Feature (7 Columns) - Payroll Engine */}
          <div className="lg:col-span-7 rounded-3xl border border-line bg-surface p-7 sm:p-9 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-brand-600 bg-brand-50 dark:bg-brand-950 px-2.5 py-1 rounded-md">
                  Module M6 · Payroll
                </span>
                <span className="text-xs text-ink-soft">Pakistan FY2025-26 Ordinance</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-ink">
                Maker-Checker Payroll Engine with Full Formula Transparency
              </h3>
              <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                Brief §21 enforcement: Payroll cannot be finalized by the same person who calculated it. Automatic 60/30/10 allowances split, progressive tax slabs, EOBI caps, and loan recovery with complete mathematical explanations on every payslip line.
              </p>

              {/* Realistic Payroll Calculation Card */}
              <div className="mt-6 p-4 rounded-2xl bg-surface-muted/60 border border-line space-y-2 text-xs">
                <div className="font-semibold text-ink flex items-center justify-between border-b border-line/60 pb-2">
                  <span>Standard Worked Example (Senior Engineer)</span>
                  <span className="font-mono text-brand-600">Grade G4</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="text-ink-soft">Gross Monthly:</div>
                    <div className="font-mono font-bold text-ink">PKR 135,000</div>
                  </div>
                  <div>
                    <div className="text-ink-soft">Allowances (60/30/10):</div>
                    <div className="font-mono text-ink">81k Basic | 40.5k Rent | 13.5k Util</div>
                  </div>
                  <div>
                    <div className="text-ink-soft">Income Tax (FY25-26):</div>
                    <div className="font-mono text-rose-600 font-semibold">-PKR 3,459</div>
                  </div>
                  <div>
                    <div className="text-ink-soft">EOBI & Loan Recovery:</div>
                    <div className="font-mono text-rose-600 font-semibold">-PKR 1,980 (EOBI) | -PKR 8,000 (Loan)</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-line/60 flex items-center justify-between font-bold">
                  <span className="text-ink">Net Take-Home Pay:</span>
                  <span className="font-mono text-emerald-600 text-sm">PKR 116,424</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-line/60 flex flex-wrap items-center justify-between text-xs text-ink-soft gap-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Bank CSV Export (HBL, Meezan, Alfalah)
              </span>
              <span className="font-mono text-brand-600 font-semibold">Test Suite: 131 Checks Passed</span>
            </div>
          </div>

          {/* Bento Item 2: Geofence (5 Columns) */}
          <div className="lg:col-span-5 rounded-3xl border border-line bg-surface p-7 sm:p-9 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
                  Module M4 · Attendance
                </span>
                <span className="text-xs text-ink-soft">GPS Haversine</span>
              </div>
              <h3 className="font-display text-xl font-bold text-ink">
                Tamper-Proof Geofenced Check-In
              </h3>
              <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                Server-side Haversine distance calculation validates physical device proximity to office branch coordinates. Defeats mock GPS and proxy attendance.
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-surface-muted/60 border border-line text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-ink">Branch Geofence Check:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-mono font-bold text-[10px]">
                    24.2m &lt; 150m Limit
                  </span>
                </div>
                <div className="text-ink-soft leading-relaxed">
                  Night shift cross-midnight logic & weekend sandwich rules automatically adjust balances.
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between text-xs text-ink-soft">
              <span>Shifts: Morning, Evening & Night</span>
              <span className="text-emerald-600 font-semibold">Anti-Proxy Stamp</span>
            </div>
          </div>

          {/* Bento Item 3: Public Careers & ATS (4 Columns) */}
          <div className="lg:col-span-4 rounded-3xl border border-line bg-surface p-7 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-md">
                  Module M2 · ATS
                </span>
                <Link href="/careers" className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 font-medium">
                  <span>/careers</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <h3 className="font-display text-lg font-bold text-ink">
                Public Careers Board & AI Match
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-ink-soft leading-relaxed">
                Branded public job portal, explainable match scores, interview scorecards, and one-click hiring that automatically provisions employee accounts.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-line/60 flex items-center justify-between text-xs">
              <span className="text-ink-soft">Over-band approval workflow</span>
              <span className="font-semibold text-brand-600">1-Click Hire</span>
            </div>
          </div>

          {/* Bento Item 4: Verifiable HR Letters (4 Columns) */}
          <div className="lg:col-span-4 rounded-3xl border border-line bg-surface p-7 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-md">
                  Module M1 · Verifiable Letters
                </span>
                <Link href="/verify" className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 font-medium">
                  <span>/verify</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <h3 className="font-display text-lg font-bold text-ink">
                Tamper-Proof Document Verification
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-ink-soft leading-relaxed">
                Experience letters, employment certificates, and letters carry unique verification tokens. Embassies and banks can instantly verify validity online.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-line/60 flex items-center justify-between text-xs">
              <span className="text-ink-soft">Public QR validation code</span>
              <span className="font-semibold text-indigo-600">Immutable Cryptographic Seal</span>
            </div>
          </div>

          {/* Bento Item 5: Permissions-Bound AI Copilot (4 Columns) */}
          <div className="lg:col-span-4 rounded-3xl border border-line bg-surface p-7 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-violet-600 bg-violet-50 dark:bg-violet-950 px-2.5 py-1 rounded-md">
                  Module M12 · AI Copilot
                </span>
                <span className="text-xs text-ink-soft font-mono">Supabase Edge</span>
              </div>
              <h3 className="font-display text-lg font-bold text-ink">
                Zero Data Leakage AI Assistant
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-ink-soft leading-relaxed">
                Runs under the authenticated user's exact database credentials. Line managers cannot discover salaries. Every question is recorded to immutable audit tables.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-line/60 flex items-center justify-between text-xs">
              <span className="text-ink-soft">RLS bounded context</span>
              <span className="font-semibold text-violet-600">ai_logs Ledger</span>
            </div>
          </div>
        </div>

        {/* Tabbed Comprehensive Module Explorer */}
        <div className="mt-16 rounded-3xl border border-line bg-surface p-6 sm:p-10 shadow-pop">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-line pb-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-ink">Complete Module Directory (M0 – M13)</h3>
              <p className="text-xs sm:text-sm text-ink-soft mt-1">
                Explore how server authority is implemented across every single department workflow.
              </p>
            </div>
            <div className="text-xs font-mono text-ink-soft">
              Source: HCM Master Suite Product Brief
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* List of modules */}
            <div className="space-y-1.5 md:col-span-1">
              {pillars.map((p, idx) => (
                <button
                  key={p.title}
                  onClick={() => setActiveTab(idx)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl text-xs font-medium transition-all flex items-center justify-between",
                    activeTab === idx
                      ? "brand-gradient text-white shadow-soft font-semibold"
                      : "hover:bg-surface-muted text-ink-soft hover:text-ink"
                  )}
                >
                  <span className="truncate">{p.title}</span>
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-mono ml-2 shrink-0", activeTab === idx ? "bg-white/20 text-white" : "bg-surface-muted text-ink-soft")}>
                    {p.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Module Detail Panel */}
            <div className="md:col-span-2 p-6 rounded-2xl bg-surface-muted/50 border border-line flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-display text-lg font-bold text-ink">
                    {pillars[activeTab].title}
                  </h4>
                  <span className="text-xs font-mono text-brand-600 bg-brand-50 dark:bg-brand-950 px-2.5 py-1 rounded-md">
                    {pillars[activeTab].badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                  {pillars[activeTab].tagline}
                </p>

                <div className="mt-5 space-y-2.5">
                  {pillars[activeTab].content.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2.5 text-xs text-ink">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-line/60">
                <div className="text-[11px] font-mono text-ink-soft bg-surface p-2.5 rounded-lg border border-line">
                  <span className="text-brand-600 font-bold">SQL Trigger:</span> {pillars[activeTab].content.mockSnippet}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
