"use client";
import Link from "next/link";
import { Logo } from "@/components/brand";
import { ThemeToggle, AccentPicker } from "@/components/theme-controls";
import { ShieldCheck, Heart, ExternalLink, Globe2 } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-line bg-surface/80 pt-16 pb-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Logo />
            <p className="text-xs sm:text-sm text-ink-soft max-w-sm leading-relaxed">
              The modern human capital management platform with database-enforced server authority, Pakistan FY 2025-26 tax slabs, GPS geofencing, and permissions-bound AI copilot.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-ink-soft">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">All Systems Operational</span>
              <span className="text-line">·</span>
              <span>100% RLS Server Authority</span>
            </div>

            {/* Accent Picker in Footer */}
            <div className="pt-4">
              <div className="text-xs font-semibold text-ink-soft mb-2">Accent Theme:</div>
              <AccentPicker />
            </div>
          </div>

          {/* Col 2: Core Platform */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-ink mb-4">Core Platform</div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-ink-soft">
              <li>
                <Link href="#features" className="hover:text-ink transition-colors">Core HR & Directory</Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-ink transition-colors">Geofenced Attendance</Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-ink transition-colors">Leave & Sandwich Rules</Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-ink transition-colors">Maker-Checker Payroll</Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-ink transition-colors">Expenses & Loans</Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-ink transition-colors">Performance & OKRs</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Public Portals */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-ink mb-4">Public Portals</div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-ink-soft">
              <li>
                <Link href="/careers" className="hover:text-brand-600 transition-colors flex items-center gap-1">
                  <span>Careers Board</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-brand-600 transition-colors flex items-center gap-1">
                  <span>Verify HR Letters</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/my-applications" className="hover:text-brand-600 transition-colors flex items-center gap-1">
                  <span>Candidate Portal</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="#interactive-demo" className="hover:text-ink transition-colors">Tax Calculator</Link>
              </li>
              <li>
                <Link href="#security" className="hover:text-ink transition-colors">Security Architecture</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Workspace & Auth */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-ink mb-4">Workspace</div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-ink-soft">
              <li>
                <Link href="/login" className="hover:text-ink transition-colors">Sign In</Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-ink transition-colors">Create Company</Link>
              </li>
              <li>
                <Link href="/forgot-password" className="hover:text-ink transition-colors">Reset Password</Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-ink transition-colors">Company Setup Wizard</Link>
              </li>
            </ul>

            <div className="mt-6">
              <div className="text-xs font-semibold text-ink-soft mb-2">Theme Mode:</div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-soft">
          <div>
            © {new Date().getFullYear()} HCM Master Suite. Engineered for high-scale workforce operations.
          </div>
          <div className="flex items-center gap-6">
            <span>Built with Next.js 15 & Supabase</span>
            <span>PostgreSQL Row-Level Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
