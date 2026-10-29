"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Calculator, 
  Lock, 
  Building2, 
  Bot, 
  FileCheck2, 
  Users, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ChevronRight,
  Sparkles,
  Search,
  ExternalLink,
  Briefcase,
  Sliders,
  Check
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function LandingHero() {
  const { session, ctx, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"payroll" | "attendance" | "orgchart" | "recruitment">("payroll");
  const heroRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const floating1 = useRef<HTMLDivElement>(null);
  const floating2 = useRef<HTMLDivElement>(null);

  const dashboardHref = ctx?.tenant || ctx?.is_platform_admin ? "/dashboard" : "/onboarding";

  useEffect(() => {
    let ctxAnim: any;
    let isMounted = true;

    import("gsap").then((mod) => {
      if (!isMounted || !heroRef.current) return;
      const gsap = mod.default || mod;

      ctxAnim = gsap.context(() => {
        gsap.from(".hero-text", {
          opacity: 0,
          y: 24,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
        });

        if (floating1.current) {
          gsap.to(floating1.current, {
            y: -8,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
        if (floating2.current) {
          gsap.to(floating2.current, {
            y: 8,
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.4,
          });
        }
      }, heroRef);
    });

    return () => {
      isMounted = false;
      if (ctxAnim) ctxAnim.revert();
    };
  }, []);

  return (
    <section ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-brand-500/10 blur-[120px] rounded-full dark:bg-brand-500/15" />
        <div className="grid-dots absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Release Pill */}
        <div className="flex justify-center hero-text">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/90 px-3.5 py-1.5 text-xs font-medium text-ink shadow-soft backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-brand-600 dark:text-brand-400">Enterprise Release</span>
            <span className="text-line">|</span>
            <span className="text-ink-soft">Pakistan FY 2025-26 Tax Engine · Zero-Trust Server Authority</span>
          </div>
        </div>

        {/* Editorial Headline */}
        <div className="mt-7 text-center max-w-4xl mx-auto hero-text">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-ink leading-[1.12]">
            Workforce, Attendance, and Payroll.{" "}
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 bg-clip-text text-transparent">
              Engineered with Mathematical Precision.
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-xl text-ink-soft max-w-2xl mx-auto leading-relaxed">
            A unified multi-company HCM with PostgreSQL row-level security. GPS Haversine attendance, maker-checker Pakistan tax compliance, and permissions-bound AI copilot.
          </p>
        </div>

        {/* Main Action CTAs */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 hero-text">
          {!loading && session ? (
            <Link
              href={dashboardHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm sm:text-base font-semibold text-white brand-gradient rounded-xl shadow-soft hover:opacity-95 transition-all group"
            >
              <span>Go to Company Dashboard</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm sm:text-base font-semibold text-white brand-gradient rounded-xl shadow-soft hover:opacity-95 transition-all group"
              >
                <span>Launch Company Workspace</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#interactive-demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-medium text-ink bg-surface border border-line rounded-xl shadow-soft hover:bg-surface-muted transition-colors"
              >
                <Calculator className="h-4 w-4 text-brand-600" />
                <span>Pakistan Salary Calculator</span>
              </Link>
            </>
          )}
        </div>

        {/* Real Product Proof Points */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-ink-soft hero-text">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 14 Enforced System Roles
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Maker-Checker Dual Payroll Signoff
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Haversine GPS Clock-In (Anti-Spoof)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 100% Database RLS Authority
          </span>
        </div>

        {/* High-Fidelity Product Command Center */}
        <div ref={mockupRef} className="mt-12 relative hero-text">
          {/* Subtle Floating Micro Badges */}
          <div
            ref={floating1}
            className="hidden xl:flex absolute -top-5 -left-8 z-20 items-center gap-3 p-3 rounded-2xl bg-surface border border-line shadow-pop"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-bold text-xs">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-ink">Haversine GPS Verified</div>
              <div className="text-[11px] text-emerald-600 font-mono">Distance: 24.2m · Office In-Bounds</div>
            </div>
          </div>

          <div
            ref={floating2}
            className="hidden xl:flex absolute top-1/2 -right-8 z-20 items-center gap-3 p-3 rounded-2xl bg-surface border border-line shadow-pop"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 font-bold text-xs">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-ink">Maker-Checker Pass</div>
              <div className="text-[11px] text-ink-soft">HR Approved → Finance Finalized</div>
            </div>
          </div>

          {/* Main App Window Frame */}
          <div className="rounded-2xl border border-line bg-surface shadow-pop overflow-hidden">
            {/* Window Chrome Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-b border-line bg-surface-muted/40 px-4 py-3 gap-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700 inline-block" />
                </div>
                <div className="h-3.5 w-[1px] bg-line mx-2" />
                <span className="text-xs font-mono text-ink-soft flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-emerald-500" />
                  hcm-suite.internal / live-instance
                </span>
              </div>

              {/* Viewport Tabs */}
              <div className="flex items-center gap-1 bg-surface rounded-xl p-1 border border-line text-xs font-medium">
                <button
                  onClick={() => setActiveTab("payroll")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all",
                    activeTab === "payroll" ? "brand-gradient text-white shadow-soft" : "text-ink-soft hover:text-ink"
                  )}
                >
                  Automated Payroll & Slabs
                </button>
                <button
                  onClick={() => setActiveTab("attendance")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all",
                    activeTab === "attendance" ? "brand-gradient text-white shadow-soft" : "text-ink-soft hover:text-ink"
                  )}
                >
                  GPS Geofence & Shifts
                </button>
                <button
                  onClick={() => setActiveTab("orgchart")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all",
                    activeTab === "orgchart" ? "brand-gradient text-white shadow-soft" : "text-ink-soft hover:text-ink"
                  )}
                >
                  Core HR & Org Tree
                </button>
                <button
                  onClick={() => setActiveTab("recruitment")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all",
                    activeTab === "recruitment" ? "brand-gradient text-white shadow-soft" : "text-ink-soft hover:text-ink"
                  )}
                >
                  Recruitment Pipeline
                </button>
              </div>
            </div>

            {/* Interactive Viewport Display */}
            <div className="p-4 sm:p-6 lg:p-7 bg-canvas/40 min-h-[420px]">
              {/* Tab 1: Pakistan Payroll Engine */}
              {activeTab === "payroll" && (
                <div className="space-y-4 animate-fade-up">
                  {/* Status Banner */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl bg-surface border border-line text-xs gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-ink">Payroll Run #PR-2025-10 (October 2025) · PKR 48,240,000</div>
                        <div className="text-[11px] text-ink-soft">Pakistan FY2025-26 Salaried Slabs Applied · 128 Employees</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-mono text-[11px] font-semibold border border-emerald-200/50">
                        Maker-Checker Passed
                      </span>
                      <span className="text-ink-soft font-mono text-[11px]">Bank CSV Ready (HBL/Meezan)</span>
                    </div>
                  </div>

                  {/* Real Payroll Table Mockup */}
                  <div className="rounded-xl border border-line bg-surface overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-line bg-surface-muted/50 text-ink-soft font-medium">
                          <th className="p-3">Employee</th>
                          <th className="p-3">Role / Grade</th>
                          <th className="p-3 font-mono">Gross Pay</th>
                          <th className="p-3 font-mono">Allowances (60/30/10)</th>
                          <th className="p-3 font-mono">Tax (FY25-26)</th>
                          <th className="p-3 font-mono">EOBI / PF</th>
                          <th className="p-3 font-mono">Net Salary</th>
                          <th className="p-3 text-right">Formula Payslip</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line/60">
                        {[
                          {
                            name: "Hamza Tariq",
                            email: "hamza@company.com",
                            role: "VP Engineering",
                            grade: "G6",
                            gross: "PKR 450,000",
                            allowance: "B: 270k | R: 135k | U: 45k",
                            tax: "-PKR 71,250",
                            eobiPf: "-PKR 24,471",
                            net: "PKR 354,279",
                          },
                          {
                            name: "Ayesha Khan",
                            email: "ayesha.k@company.com",
                            role: "Staff Product Designer",
                            grade: "G4",
                            gross: "PKR 220,000",
                            allowance: "B: 132k | R: 66k | U: 22k",
                            tax: "-PKR 15,000",
                            eobiPf: "-PKR 12,975",
                            net: "PKR 192,025",
                          },
                          {
                            name: "Zubair Ahmed",
                            email: "zubair.a@company.com",
                            role: "Payroll Specialist",
                            grade: "G3",
                            gross: "PKR 135,000",
                            allowance: "B: 81k | R: 40.5k | U: 13.5k",
                            tax: "-PKR 3,459",
                            eobiPf: "-PKR 8,727",
                            net: "PKR 122,814",
                          },
                          {
                            name: "Fatima Noor",
                            email: "fatima.n@company.com",
                            role: "Junior Associate",
                            grade: "G2",
                            gross: "PKR 75,000",
                            allowance: "B: 45k | R: 22.5k | U: 7.5k",
                            tax: "-PKR 625",
                            eobiPf: "-PKR 5,728",
                            net: "PKR 68,647",
                          },
                        ].map((row) => (
                          <tr key={row.email} className="hover:bg-surface-muted/30 transition-colors">
                            <td className="p-3">
                              <div className="font-semibold text-ink">{row.name}</div>
                              <div className="text-[11px] text-ink-soft">{row.email}</div>
                            </td>
                            <td className="p-3">
                              <span className="font-medium text-ink">{row.role}</span>
                              <span className="ml-1.5 text-[10px] font-mono bg-surface-muted px-1.5 py-0.5 rounded text-ink-soft">
                                {row.grade}
                              </span>
                            </td>
                            <td className="p-3 font-mono font-semibold text-ink">{row.gross}</td>
                            <td className="p-3 font-mono text-[11px] text-ink-soft">{row.allowance}</td>
                            <td className="p-3 font-mono text-rose-600 font-medium">{row.tax}</td>
                            <td className="p-3 font-mono text-ink-soft">{row.eobiPf}</td>
                            <td className="p-3 font-mono font-bold text-emerald-600">{row.net}</td>
                            <td className="p-3 text-right">
                              <span className="text-[11px] font-medium text-brand-600 hover:text-brand-700 cursor-pointer">
                                View Formula →
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Maker-Checker Signature Trail */}
                  <div className="p-3 rounded-xl bg-surface border border-line text-[11px] text-ink-soft flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <strong>Maker:</strong> S. Malik (Payroll Officer) at 09:15 AM
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <strong>HR Checker:</strong> N. Jamil (HR Director) at 11:30 AM
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <strong>Finance Authority:</strong> F. Qureshi (CFO) at 02:45 PM
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 2: GPS Geofence & Shifts */}
              {activeTab === "attendance" && (
                <div className="grid md:grid-cols-2 gap-6 items-center animate-fade-up">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold">
                      <MapPin className="h-3.5 w-3.5" /> Spherical Haversine Verification
                    </div>
                    <h3 className="text-xl font-bold font-display text-ink">
                      True Device Location Clock-In with Server Timestamp
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                      Every punch is verified in the database engine using spherical trigonometry. Mock GPS locations and altered device clocks are rejected immediately.
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-surface border border-line flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-ink">Lahore Head Office Branch</div>
                          <div className="text-[11px] text-ink-soft font-mono">31.5204° N, 74.3587° E · 150m Allowed Radius</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                          Active
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface border border-line flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-ink">Shift Schedule: Standard Morning (A)</div>
                          <div className="text-[11px] text-ink-soft">09:00 AM – 06:00 PM (15m Grace Period) · Night Shift Logic Built-in</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-600 text-[11px] font-bold">
                          Rotational
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Clock-In Simulator Visual */}
                  <div className="p-6 rounded-2xl bg-surface border border-line shadow-soft text-center relative">
                    <div className="w-48 h-48 mx-auto rounded-full border-2 border-dashed border-emerald-500/40 flex items-center justify-center relative bg-emerald-50/10">
                      <div className="w-32 h-32 rounded-full bg-emerald-500/10 flex items-center justify-center animate-pulse">
                        <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-soft">
                          <Building2 className="h-7 w-7" />
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                        <MapPin className="h-3 w-3" /> 28.4m · In Bounds
                      </div>
                    </div>
                    <div className="mt-4 font-mono text-sm font-bold text-ink">
                      1,392 On-Time Check-Ins Today (98.4%)
                    </div>
                    <div className="text-xs text-ink-soft mt-0.5">
                      Overtime and sandwich rules automatically applied to leave balances.
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Core HR & Org Chart */}
              {activeTab === "orgchart" && (
                <div className="space-y-5 animate-fade-up">
                  <div className="flex justify-between items-center border-b border-line pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-ink">Interactive Org Chart & Effective-Dated Records</h4>
                      <p className="text-xs text-ink-soft">Reporting hierarchies and compensation history with private data isolation</p>
                    </div>
                    <Link href="/verify" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                      Verify Issued Letters →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-surface border border-line">
                      <div className="text-xs text-ink-soft">CEO & Managing Director</div>
                      <div className="font-bold text-sm text-ink mt-0.5">Kamran Akhtar</div>
                      <div className="text-[11px] text-brand-600 mt-1 font-mono">Grade: G7 · 6 Direct Reports</div>
                    </div>
                    <div className="p-4 rounded-xl bg-surface border border-brand-500/40 shadow-soft">
                      <div className="text-xs text-ink-soft">Head of Engineering</div>
                      <div className="font-bold text-sm text-ink mt-0.5">Hamza Tariq</div>
                      <div className="text-[11px] text-brand-600 mt-1 font-mono">Grade: G6 · 42 Team Members</div>
                    </div>
                    <div className="p-4 rounded-xl bg-surface border border-line">
                      <div className="text-xs text-ink-soft">HR Director</div>
                      <div className="font-bold text-sm text-ink mt-0.5">Dr. Naila Jamil</div>
                      <div className="text-[11px] text-brand-600 mt-1 font-mono">Grade: G6 · 14 Team Members</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-muted/60 border border-line text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <span className="font-semibold text-ink">Effective-Dated Salary History:</span>
                      <span className="text-ink-soft ml-2">Job title and compensation adjustments are versioned with retroactive tracking.</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded font-bold">
                      employee_private table isolated
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 4: ATS Pipeline */}
              {activeTab === "recruitment" && (
                <div className="space-y-4 animate-fade-up">
                  <div className="flex justify-between items-center border-b border-line pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-ink">Recruitment Kanban & Explainable AI Match</h4>
                      <p className="text-xs text-ink-soft">Senior Backend Engineer (Golang & Postgres) · 3 Open Positions</p>
                    </div>
                    <Link href="/careers" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                      Public Careers Board →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {[
                      { col: "Applied (18)", candidate: "Bilal Sheikh", match: "91% Match", exp: "5 Yrs Exp · Go, RLS" },
                      { col: "Technical Interview (6)", candidate: "Zainab Raza", match: "96% Match", exp: "Scorecard: 4.9 / 5.0" },
                      { col: "Offer Stage (2)", candidate: "Usman Ghani", match: "94% Match", exp: "Within Salary Band" },
                      { col: "Hired (1-Click)", candidate: "Mehak Ali", match: "98% Match", exp: "Provisioned to G4" },
                    ].map((step) => (
                      <div key={step.col} className="p-3 rounded-xl bg-surface border border-line">
                        <div className="text-[11px] font-bold text-ink-soft uppercase tracking-wider mb-2">{step.col}</div>
                        <div className="p-2.5 rounded-lg bg-surface-muted border border-line/60">
                          <div className="font-semibold text-xs text-ink">{step.candidate}</div>
                          <div className="text-[10px] font-semibold text-emerald-600 mt-1">{step.match}</div>
                          <div className="text-[10px] text-ink-soft mt-0.5">{step.exp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
