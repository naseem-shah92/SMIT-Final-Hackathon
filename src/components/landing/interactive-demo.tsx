"use client";
import { useState, useMemo } from "react";
import { 
  Calculator, 
  MapPin, 
  ShieldCheck, 
  Bot, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  FileSpreadsheet, 
  Sparkles, 
  DollarSign, 
  AlertTriangle,
  Building,
  Lock,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

export function InteractiveDemo() {
  const [activeSimulator, setActiveSimulator] = useState<"tax" | "geofence" | "maker-checker" | "copilot">("tax");

  // State for Simulator 1: Tax Calculator
  const [grossSalary, setGrossSalary] = useState<number>(135000);
  const [includePF, setIncludePF] = useState<boolean>(true);
  const [includeLoan, setIncludeLoan] = useState<boolean>(false);
  const [loanAmount, setLoanAmount] = useState<number>(8000);

  // Salary calculations based on Pakistan FY 2025-26 rules
  const salaryCalc = useMemo(() => {
    const basic = Math.round(grossSalary * 0.6);
    const houseRent = Math.round(grossSalary * 0.3);
    const utilities = Math.round(grossSalary * 0.1);

    // EOBI employee share
    const eobi = 1980;

    // Provident fund (8.33% of basic)
    const pf = includePF ? Math.round(basic * 0.0833) : 0;

    // Annual taxable income
    const annualTaxable = grossSalary * 12;
    let annualTax = 0;

    // Pakistan FY 2025-26 salaried slabs
    if (annualTaxable <= 600000) {
      annualTax = 0;
    } else if (annualTaxable <= 1200000) {
      annualTax = (annualTaxable - 600000) * 0.05;
    } else if (annualTaxable <= 2200000) {
      annualTax = 30000 + (annualTaxable - 1200000) * 0.15;
    } else if (annualTaxable <= 3200000) {
      annualTax = 180000 + (annualTaxable - 2200000) * 0.25;
    } else if (annualTaxable <= 4100000) {
      annualTax = 430000 + (annualTaxable - 3200000) * 0.30;
    } else {
      annualTax = 700000 + (annualTaxable - 4100000) * 0.35;
    }

    const monthlyTax = Math.round(annualTax / 12);
    const loanDeduction = includeLoan ? loanAmount : 0;
    const totalDeductions = monthlyTax + eobi + pf + loanDeduction;
    const netSalary = grossSalary - totalDeductions;

    return {
      basic,
      houseRent,
      utilities,
      eobi,
      pf,
      monthlyTax,
      annualTax: Math.round(annualTax),
      loanDeduction,
      totalDeductions,
      netSalary,
    };
  }, [grossSalary, includePF, includeLoan, loanAmount]);

  // State for Simulator 2: Geofence
  const [distance, setDistance] = useState<number>(38);
  const geofenceRadius = 100;
  const isWithinGeofence = distance <= geofenceRadius;

  // State for Simulator 3: Maker Checker
  const [mcStep, setMcStep] = useState<number>(2); // 0: draft, 1: HR, 2: Finance, 3: Finalized
  const mcSteps = [
    { title: "1. Calculate", role: "Payroll Officer", status: "Exceptions checked (0 anomalies)" },
    { title: "2. HR Approval", role: "HR Director", status: "Leaves & sandwich rules verified" },
    { title: "3. Finance Approval", role: "Finance Controller", status: "Maker-checker separation enforced" },
    { title: "4. Finalized", role: "Database Authority", status: "Published payslips & Bank CSV ready" },
  ];

  // State for Simulator 4: AI Copilot
  const [selectedPrompt, setSelectedPrompt] = useState<number>(0);
  const copilotPrompts = [
    {
      q: "Who is on leave in Engineering today, and are any critical shifts unstaffed?",
      ans: "2 engineers are on approved leave today: Tariq (Annual, Sandwich rule checked) and Sarah (Casual). Evening shift roster has 4 active engineers, exceeding the minimum staffing threshold of 3. No escalation required.",
      badge: "Attendance & Roster Scope",
    },
    {
      q: "Explain why Hamza's net salary changed from last month.",
      ans: "Hamza's net salary changed by -PKR 9,980 due to: (1) FY25-26 updated tax bracket adjustment (-PKR 1,980), and (2) First installment of approved company laptop loan (-PKR 8,000). All deductions are itemized with formulas on his payslip.",
      badge: "Payroll Transparency",
    },
    {
      q: "What is our company's voluntary attrition trend over the last 6 months?",
      ans: "Voluntary attrition stands at 4.2% (down from 6.8% in Q1). Highest retention is in Product & Engineering. Flight-risk radar identified 2 senior individual contributors with no salary revision in 18+ months.",
      badge: "Workforce Analytics",
    },
  ];

  return (
    <section id="interactive-demo" className="py-24 sm:py-32 bg-surface-muted/40 relative border-t border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-50/60 dark:bg-brand-950/40 px-3.5 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300">
            <Sparkles className="h-3.5 w-3.5" /> Hands-On Interactive Playground
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Experience the Logic Before You Deploy
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink-soft leading-relaxed">
            Test the real business rules built into our PostgreSQL functions — from Pakistan FY 2025-26 tax formulas to Haversine GPS geofencing.
          </p>
        </div>

        {/* Simulator Switcher */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {[
            { id: "tax", label: "🇵🇰 Pakistan FY25-26 Tax & Salary", icon: Calculator },
            { id: "geofence", label: "📍 GPS Geofence Simulator", icon: MapPin },
            { id: "maker-checker", label: "🛡️ Maker-Checker Payroll", icon: ShieldCheck },
            { id: "copilot", label: "🤖 Role-Scoped AI Copilot", icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSimulator(tab.id as any)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-2xl transition-all",
                  activeSimulator === tab.id
                    ? "brand-gradient text-white shadow-soft scale-105"
                    : "bg-surface border border-line text-ink-soft hover:text-ink hover:bg-surface-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Simulator Container */}
        <div className="mt-10 max-w-5xl mx-auto rounded-3xl bg-surface border border-line shadow-pop p-6 sm:p-10">
          {/* 1. Pakistan FY25-26 Salary Tax Simulator */}
          {activeSimulator === "tax" && (
            <div className="space-y-8 animate-fade-up">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-line pb-6">
                <div>
                  <h3 className="text-xl font-bold font-display text-ink flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-brand-600" />
                    Interactive Pakistan FY 2025-26 Salary Calculator
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-soft mt-1">
                    Calculated strictly using Pakistan salaried tax slabs, 60/30/10 allowances split, and statutory deductions.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 text-xs font-semibold border border-brand-200 dark:border-brand-800">
                  FBR FY2025-26 Slabs
                </div>
              </div>

              {/* Slider for Gross Salary */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-ink">Gross Monthly Salary</label>
                  <span className="font-mono text-xl sm:text-2xl font-bold text-brand-600">
                    PKR {grossSalary.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={40000}
                  max={600000}
                  step={5000}
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(Number(e.target.value))}
                  className="w-full h-3 bg-surface-muted rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between text-xs text-ink-soft">
                  <span>PKR 40,000/mo (Tax-free)</span>
                  <span>PKR 250,000/mo (Mid-tier)</span>
                  <span>PKR 600,000/mo (Executive)</span>
                </div>

                {/* Additional checkboxes */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includePF}
                      onChange={(e) => setIncludePF(e.target.checked)}
                      className="rounded border-line accent-brand-600 h-4 w-4"
                    />
                    <span>Provident Fund (8.33% of Basic)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs sm:text-sm text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeLoan}
                      onChange={(e) => setIncludeLoan(e.target.checked)}
                      className="rounded border-line accent-brand-600 h-4 w-4"
                    />
                    <span>Active Loan Installment (-PKR 8,000)</span>
                  </label>
                </div>

                {/* Visual Stacked Proportion Bar */}
                <div className="pt-2">
                  <div className="h-4 w-full bg-surface-muted rounded-full overflow-hidden flex shadow-inner">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${Math.max(5, (salaryCalc.netSalary / grossSalary) * 100)}%` }}
                      title={`Net Take-Home: PKR ${salaryCalc.netSalary.toLocaleString()}`}
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-300"
                      style={{ width: `${(salaryCalc.monthlyTax / grossSalary) * 100}%` }}
                      title={`Income Tax: PKR ${salaryCalc.monthlyTax.toLocaleString()}`}
                    />
                    <div
                      className="bg-amber-500 h-full transition-all duration-300"
                      style={{ width: `${(salaryCalc.eobi / grossSalary) * 100}%` }}
                      title={`EOBI: PKR ${salaryCalc.eobi.toLocaleString()}`}
                    />
                    {includePF && (
                      <div
                        className="bg-indigo-500 h-full transition-all duration-300"
                        style={{ width: `${(salaryCalc.pf / grossSalary) * 100}%` }}
                        title={`Provident Fund: PKR ${salaryCalc.pf.toLocaleString()}`}
                      />
                    )}
                    {includeLoan && (
                      <div
                        className="bg-slate-500 h-full transition-all duration-300"
                        style={{ width: `${(salaryCalc.loanDeduction / grossSalary) * 100}%` }}
                        title={`Loan: PKR ${salaryCalc.loanDeduction.toLocaleString()}`}
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-ink-soft mt-2">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Net Salary ({Math.round((salaryCalc.netSalary / grossSalary) * 100)}%)
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="h-2 w-2 rounded-full bg-rose-500 inline-block" /> Tax ({Math.round((salaryCalc.monthlyTax / grossSalary) * 100)}%)
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> EOBI
                    </span>
                    {includePF && (
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block" /> PF
                      </span>
                    )}
                    {includeLoan && (
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="h-2 w-2 rounded-full bg-slate-500 inline-block" /> Loan
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Real-time Calculation Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Allowances breakdown */}
                <div className="p-5 rounded-2xl bg-surface-muted/50 border border-line space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-ink-soft">Allowances Distribution</div>
                  <div className="flex justify-between text-sm py-1 border-b border-line/60">
                    <span className="text-ink-soft">Basic Salary (60%)</span>
                    <span className="font-mono font-semibold text-ink">PKR {salaryCalc.basic.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-line/60">
                    <span className="text-ink-soft">House Rent Allowance (30%)</span>
                    <span className="font-mono font-semibold text-ink">PKR {salaryCalc.houseRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-line/60">
                    <span className="text-ink-soft">Utilities Allowance (10%)</span>
                    <span className="font-mono font-semibold text-ink">PKR {salaryCalc.utilities.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 font-bold text-ink">
                    <span>Total Gross Monthly</span>
                    <span className="font-mono text-brand-600">PKR {grossSalary.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deductions & Net Take-Home */}
                <div className="p-5 rounded-2xl bg-surface-muted/50 border border-line space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-ink-soft">Statutory Deductions & Slabs</div>
                  <div className="flex justify-between text-sm py-1 border-b border-line/60">
                    <span className="text-ink-soft">Income Tax (FY25-26 Slab)</span>
                    <span className="font-mono font-semibold text-rose-600">
                      - PKR {salaryCalc.monthlyTax.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-line/60">
                    <span className="text-ink-soft">EOBI Employee Share</span>
                    <span className="font-mono font-semibold text-rose-600">- PKR {salaryCalc.eobi.toLocaleString()}</span>
                  </div>
                  {includePF && (
                    <div className="flex justify-between text-sm py-1 border-b border-line/60">
                      <span className="text-ink-soft">Provident Fund (8.33% Basic)</span>
                      <span className="font-mono font-semibold text-rose-600">- PKR {salaryCalc.pf.toLocaleString()}</span>
                    </div>
                  )}
                  {includeLoan && (
                    <div className="flex justify-between text-sm py-1 border-b border-line/60">
                      <span className="text-ink-soft">Loan Recovery</span>
                      <span className="font-mono font-semibold text-rose-600">- PKR {salaryCalc.loanDeduction.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm pt-2 font-bold text-ink">
                    <span>Total Deductions</span>
                    <span className="font-mono text-rose-600">- PKR {salaryCalc.totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Net Salary Highlight Banner */}
              <div className="p-6 rounded-2xl brand-gradient text-white flex flex-col sm:flex-row justify-between items-center gap-4 shadow-pop">
                <div>
                  <div className="text-xs uppercase tracking-wider text-white/80 font-bold">Estimated Monthly Net Pay (Take-Home)</div>
                  <div className="font-display text-3xl sm:text-4xl font-extrabold mt-1">
                    PKR {salaryCalc.netSalary.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/80 mt-1">
                    Annual Tax: PKR {salaryCalc.annualTax.toLocaleString()} · Generated with exact formula transparency on payslip
                  </div>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-xs font-semibold">
                  Zero Formula Discrepancy
                </div>
              </div>
            </div>
          )}

          {/* 2. GPS Geofence Simulator */}
          {activeSimulator === "geofence" && (
            <div className="space-y-8 animate-fade-up">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-line pb-6">
                <div>
                  <h3 className="text-xl font-bold font-display text-ink flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    GPS Geofence Haversine Distance Validator
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-soft mt-1">
                    Calculates spherical distance between employee GPS and office branch in PostgreSQL.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold border border-emerald-200">
                  Branch Radius: 100 meters
                </div>
              </div>

              {/* Distance Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-ink">Simulated Employee Distance from Office</label>
                  <span className={cn("font-mono text-2xl font-bold", isWithinGeofence ? "text-emerald-600" : "text-rose-600")}>
                    {distance} meters
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={250}
                  step={2}
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full h-3 bg-surface-muted rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between text-xs text-ink-soft">
                  <span>10m (Inside Office Desk)</span>
                  <span>100m (Office Boundary Threshold)</span>
                  <span>250m (Off-Premises / Home)</span>
                </div>
              </div>

              {/* Visual Radar / Map Simulation */}
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="p-8 rounded-2xl bg-surface-muted/40 border border-line flex flex-col items-center justify-center relative min-h-[260px]">
                  {/* Outer circle (Threshold) */}
                  <div className="w-56 h-56 rounded-full border-2 border-dashed border-brand-500/30 flex items-center justify-center relative bg-brand-500/5">
                    {/* Inner Office center */}
                    <div className="w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-soft">
                      <Building className="h-6 w-6" />
                    </div>

                    {/* Employee Marker positioned by distance */}
                    <div
                      className={cn(
                        "absolute p-2 rounded-full text-white shadow-pop transition-all duration-300 flex items-center gap-1.5 text-xs font-bold",
                        isWithinGeofence ? "bg-emerald-600" : "bg-rose-600"
                      )}
                      style={{
                        top: `${Math.max(10, Math.min(80, 50 - (distance / 250) * 45))}%`,
                        right: `${Math.max(10, Math.min(80, 50 - (distance / 250) * 45))}%`,
                      }}
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{distance}m</span>
                    </div>
                  </div>
                  <div className="text-xs text-ink-soft mt-3 font-mono">Allowed Radius: 100m Circle</div>
                </div>

                {/* Validation Response Box */}
                <div className="space-y-4">
                  <div
                    className={cn(
                      "p-5 rounded-2xl border transition-all",
                      isWithinGeofence
                        ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
                        : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {isWithinGeofence ? (
                        <CheckCircle2 className="h-8 w-8 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="h-8 w-8 text-rose-600 shrink-0" />
                      )}
                      <div>
                        <div className="text-base font-bold text-ink">
                          {isWithinGeofence ? "Clock-In Verified & Recorded" : "Clock-In Rejected (Out-of-Bounds)"}
                        </div>
                        <div className="text-xs text-ink-soft mt-0.5">
                          {isWithinGeofence
                            ? `Haversine distance (${distance}m) is strictly within the 100m branch geofence.`
                            : `Haversine distance (${distance}m) exceeds 100m. Tamper violation flagged in audit log.`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-surface border border-line text-xs space-y-2">
                    <div className="font-semibold text-ink">Database Assertion Details:</div>
                    <div className="font-mono text-ink-soft text-[11px] bg-surface-muted p-2 rounded-lg">
                      6371000 * 2 * ASIN(SQRT(POWER(SIN(rad(dlat)/2), 2) + COS(rad(lat1)) * COS(rad(lat2)) * POWER(SIN(rad(dlon)/2), 2))) = {distance}m
                    </div>
                    <div className="text-ink-soft">
                      No browser-side bypass possible: The server function calculates coordinates directly against office coordinates stored in <code>branches</code> table.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Maker-Checker Simulator */}
          {activeSimulator === "maker-checker" && (
            <div className="space-y-8 animate-fade-up">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-line pb-6">
                <div>
                  <h3 className="text-xl font-bold font-display text-ink flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-indigo-600" />
                    Maker-Checker Multi-Tier Approval Pipeline
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-soft mt-1">
                    Brief §21 enforcement: Payroll cannot be finalized by the same person who calculated it.
                  </p>
                </div>
                <button
                  onClick={() => setMcStep((s) => (s + 1) % 4)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl brand-gradient text-white text-xs font-semibold shadow-soft"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Advance Pipeline Step</span>
                </button>
              </div>

              {/* Visual Pipeline Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {mcSteps.map((step, idx) => {
                  const isDone = idx < mcStep;
                  const isCurrent = idx === mcStep;
                  return (
                    <div
                      key={step.title}
                      onClick={() => setMcStep(idx)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all cursor-pointer relative",
                        isCurrent
                          ? "bg-brand-50/50 dark:bg-brand-950/30 border-brand-500 shadow-card"
                          : isDone
                          ? "bg-surface border-emerald-500/40 text-ink"
                          : "bg-surface-muted/50 border-line text-ink-soft opacity-70"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-ink">{step.title}</span>
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : isCurrent ? (
                          <span className="h-2 w-2 rounded-full bg-brand-500 animate-ping" />
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-ink-soft" />
                        )}
                      </div>
                      <div className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">{step.role}</div>
                      <div className="text-[11px] text-ink-soft mt-1">{step.status}</div>
                    </div>
                  );
                })}
              </div>

              {/* Status Details */}
              <div className="p-5 rounded-2xl bg-surface-muted/50 border border-line text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-ink text-sm">Active Enforced Rule:</div>
                  <span className="font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded text-[11px] font-bold">
                    RLS Checked
                  </span>
                </div>
                <p className="text-ink-soft leading-relaxed">
                  The SQL function <code>advance_payroll(payroll_id, action)</code> asserts that the caller has the required role (e.g. Finance Controller) and rejects approval if <code>auth.uid()</code> matches the user who triggered step 1.
                </p>
                <div className="grid sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-surface border border-line">
                    <div className="text-ink-soft text-[11px]">Bank CSV Generator</div>
                    <div className="text-ink font-semibold mt-0.5">Automated IBAN File</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-line">
                    <div className="text-ink-soft text-[11px]">Formula Explanations</div>
                    <div className="text-ink font-semibold mt-0.5">Every line item explained</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-line">
                    <div className="text-ink-soft text-[11px]">Audit Trail</div>
                    <div className="text-ink font-semibold mt-0.5">Immutable Ledger Entry</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. AI Copilot Simulator */}
          {activeSimulator === "copilot" && (
            <div className="space-y-6 animate-fade-up">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-line pb-6">
                <div>
                  <h3 className="text-xl font-bold font-display text-ink flex items-center gap-2">
                    <Bot className="h-5 w-5 text-brand-600" />
                    Permissions-Bound AI Copilot (Supabase Edge)
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-soft mt-1">
                    Answers workforce queries strictly within the user's logged-in RLS permissions.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300 text-xs font-semibold border border-violet-200">
                  Zero Data Leakage
                </div>
              </div>

              {/* Sample Prompts to Click */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Select a sample workforce query:</div>
                <div className="grid sm:grid-cols-3 gap-2">
                  {copilotPrompts.map((cp, idx) => (
                    <button
                      key={cp.q}
                      onClick={() => setSelectedPrompt(idx)}
                      className={cn(
                        "p-3 rounded-xl text-left text-xs transition-all border",
                        selectedPrompt === idx
                          ? "bg-brand-50/70 dark:bg-brand-950/40 border-brand-500 font-semibold text-ink shadow-soft"
                          : "bg-surface border-line text-ink-soft hover:text-ink hover:bg-surface-muted"
                      )}
                    >
                      <div className="text-[10px] text-brand-600 font-bold mb-1">{cp.badge}</div>
                      <div className="line-clamp-2">{cp.q}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Chat Interface */}
              <div className="p-5 rounded-2xl bg-surface-muted/40 border border-line space-y-4">
                {/* User Prompt Bubble */}
                <div className="flex justify-end">
                  <div className="max-w-lg p-3.5 rounded-2xl bg-brand-600 text-white text-xs sm:text-sm shadow-soft">
                    {copilotPrompts[selectedPrompt].q}
                  </div>
                </div>

                {/* Copilot Response Bubble */}
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl brand-gradient text-white shrink-0 mt-1 shadow-soft">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="max-w-xl p-4 rounded-2xl bg-surface border border-line shadow-card text-xs sm:text-sm text-ink space-y-2">
                    <p className="leading-relaxed">{copilotPrompts[selectedPrompt].ans}</p>
                    <div className="pt-2 border-t border-line text-[11px] text-ink-soft flex items-center justify-between">
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Logged to ai_logs table
                      </span>
                      <span className="font-mono">Latency: 182ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
