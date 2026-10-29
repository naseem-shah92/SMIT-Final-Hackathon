"use client";
import { ShieldCheck, Database, Lock, EyeOff, FileText, CheckCircle2, XCircle } from "lucide-react";

export function SecurityArchitecture() {
  const securityPillars = [
    {
      icon: Database,
      title: "100% Server Authority",
      description: "Business rules live in PostgreSQL functions (`decide_leave`, `advance_payroll`, `hire_candidate`). The frontend browser cannot bypass validation or calculate unverified figures.",
      badge: "Zero Client Trust",
    },
    {
      icon: Lock,
      title: "Postgres Row-Level Security",
      description: "Every query is scoped by tenant and system role. A Line Manager cannot query salaries, and an HR Executive cannot read private banking details without authorization.",
      badge: "Row-Level Isolation",
    },
    {
      icon: EyeOff,
      title: "Private Data Separation",
      description: "Sensitive national IDs (CNIC), dates of birth, and bank account numbers are segregated into an isolated `employee_private` table with restricted select permissions.",
      badge: "GDPR & Privacy Ready",
    },
    {
      icon: ShieldCheck,
      title: "ABAC Scope by Branch & Dept",
      description: "Attribute-based access control bounds managers to their specific branches and reporting trees. Multiple subsidiary companies can coexist safely in the same cluster.",
      badge: "Multi-Company Tenancy",
    },
    {
      icon: FileText,
      title: "Immutable Audit Trails",
      description: "Every insert, update, status advancement, and copilot query is logged to an immutable `audit_logs` table with actor, timestamp, IP, and before/after payloads.",
      badge: "Time-Boxed Auditor Pass",
    },
    {
      icon: CheckCircle2,
      title: "Tamper-Proof Verification",
      description: "Experience letters and employment credentials carry verifiable tokens. External verifiers can validate document authenticity in real time on the public verification portal.",
      badge: "Public QR / Code Verify",
    },
  ];

  return (
    <section id="security" className="py-24 sm:py-32 relative border-t border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Database-Level Server Authority
          </div>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">
            Where Other HR Tools Put Logic in React, We Put It in PostgreSQL.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink-soft leading-relaxed">
            The browser is an untrusted client. In HCM Master Suite, every permission, salary calculation, geofence radius check, and maker-checker rule is enforced at the database layer.
          </p>
        </div>

        {/* Side-by-Side Comparison: Conventional vs HCM Master Suite */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Left: Conventional HR */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface-muted/40 border border-line space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-base text-ink">Conventional Web HR Tools</span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 text-xs font-semibold">
                Client Trust Model
              </span>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              Business rules and approval gates are verified in JavaScript frontend components, creating vulnerabilities to DevTools tampering and API bypasses.
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-2.5 text-ink-soft">
                <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Client sends calculated salary figures directly to backend endpoints</span>
              </div>
              <div className="flex items-start gap-2.5 text-ink-soft">
                <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Mock GPS location apps on Android can easily fool check-in forms</span>
              </div>
              <div className="flex items-start gap-2.5 text-ink-soft">
                <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Same admin user can both draft and disburse payroll without checks</span>
              </div>
              <div className="flex items-start gap-2.5 text-ink-soft">
                <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Sensitive CNICs and bank details sit in the same public profiles table</span>
              </div>
            </div>
          </div>

          {/* Right: HCM Master Suite */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-emerald-500/40 shadow-card space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-base text-ink">HCM Master Suite</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-xs font-semibold">
                PostgreSQL Server Authority
              </span>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              Zero client trust. Every check is calculated and validated inside PostgreSQL row-level security functions and immutable triggers.
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-2.5 text-ink">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Salaries computed in-database using seeded Pakistan FY25-26 tax slabs</span>
              </div>
              <div className="flex items-start gap-2.5 text-ink">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Haversine distance calculation rejects mock GPS coordinates & altitude skew</span>
              </div>
              <div className="flex items-start gap-2.5 text-ink">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Maker-checker separation enforced by SQL trigger; self-approval impossible</span>
              </div>
              <div className="flex items-start gap-2.5 text-ink">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>CNICs and banking isolated in separate table with restrictive RLS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {securityPillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-6 sm:p-7 rounded-3xl bg-surface border border-line shadow-card hover:shadow-pop transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200/50">
                    {p.badge}
                  </span>
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-ink">{p.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-ink-soft leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
