"use client";
import { Users, Layers, ShieldCheck, FileSpreadsheet, Zap, Award } from "lucide-react";

export function StatsRibbon() {
  const stats = [
    {
      icon: Users,
      value: "14 Roles",
      label: "System-level RLS & ABAC",
      desc: "From Super Admin to Auditor and Candidate",
    },
    {
      icon: Layers,
      value: "16 Modules",
      label: "Unified Platform",
      desc: "HR, Attendance, Payroll, ATS, OKRs & LMS",
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: "Server Authority",
      desc: "Every permission & rule enforced in PostgreSQL",
    },
    {
      icon: FileSpreadsheet,
      value: "FY25-26",
      label: "Pakistan Tax Engine",
      desc: "Zero-error slabs, basic/rent/utilities & EOBI",
    },
    {
      icon: Zap,
      value: "<0.2s",
      label: "Edge AI Copilot",
      desc: "Role-scoped natural language workforce answers",
    },
  ];

  return (
    <section className="relative py-12 border-y border-line bg-surface/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.value}
                className="flex flex-col items-start p-4 rounded-2xl bg-surface/80 border border-line/60 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm font-semibold text-ink">{stat.label}</div>
                <div className="mt-0.5 text-xs text-ink-soft leading-normal">{stat.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
