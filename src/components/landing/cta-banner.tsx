"use client";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function CtaBanner() {
  const { session, ctx, loading } = useAuth();
  const dashboardHref = ctx?.tenant || ctx?.is_platform_admin ? "/dashboard" : "/onboarding";

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] brand-glow overflow-hidden p-8 sm:p-14 lg:p-20 text-center text-white shadow-pop">
          {/* Subtle grid pattern overlay */}
          <div className="grid-dots absolute inset-0 opacity-25 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur-md ring-1 ring-white/20">
              <Sparkles className="h-3.5 w-3.5 text-brand-200" />
              <span>Production-Ready Multi-Company HR Platform</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Modernize Your Workforce Operations Today.
            </h2>

            <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
              Launch your company workspace in 2 minutes. Pre-seeded with Pakistan FY2025-26 tax slabs, standard grades G1-G6, attendance geofence, and automated maker-checker workflows.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {!loading && session ? (
                <Link
                  href={dashboardHref}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-ink bg-white rounded-2xl shadow-pop hover:bg-white/95 transition-all group scale-100 hover:scale-[1.02]"
                >
                  <LayoutDashboard className="h-5 w-5 text-brand-600" />
                  <span>Go to Company Dashboard</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-ink bg-white rounded-2xl shadow-pop hover:bg-white/95 transition-all group scale-100 hover:scale-[1.02]"
                  >
                    <span>Launch Company Workspace</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold text-white bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 backdrop-blur-md transition-colors"
                  >
                    <span>Sign In with Work Email</span>
                  </Link>
                </>
              )}
            </div>

            {/* Value checklist */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" /> Instant 2-Step Setup
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-brand-300" /> 100% RLS Server Authority
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" /> Pakistan FY25-26 Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
