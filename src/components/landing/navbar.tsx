"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-controls";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
  const { session, ctx, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Interactive Demo", href: "#interactive-demo" },
    { label: "Architecture", href: "#security" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Careers Portal", href: "/careers" },
    { label: "Verify Letters", href: "/verify" },
  ];

  const dashboardHref = ctx?.tenant || ctx?.is_platform_admin ? "/dashboard" : "/onboarding";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 pt-4">
      <div
        className={cn(
          "mx-auto max-w-7xl rounded-2xl transition-all duration-300 flex items-center justify-between px-4 sm:px-6 h-16 sm:h-18",
          scrolled
            ? "bg-surface/85 backdrop-blur-xl border border-line shadow-card"
            : "bg-surface/60 backdrop-blur-md border border-line/40 shadow-soft"
        )}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Logo />
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink hover:bg-surface-muted/80 rounded-xl transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle compact />

          {!loading && session ? (
            <Link
              href={dashboardHref}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white brand-gradient rounded-xl shadow-soft hover:opacity-95 transition-all group"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-ink hover:text-brand-600 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white brand-gradient rounded-xl shadow-soft hover:opacity-95 transition-all group"
              >
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle compact />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-ink-soft hover:text-ink rounded-lg focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="sm:hidden mt-2 mx-auto max-w-7xl rounded-2xl bg-surface/95 backdrop-blur-xl border border-line shadow-pop p-4 animate-fade-up">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-muted rounded-xl transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-line flex flex-col gap-2">
              {!loading && session ? (
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white brand-gradient rounded-xl shadow-soft"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Go to Dashboard</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center w-full py-2.5 text-sm font-medium text-ink hover:bg-surface-muted rounded-xl"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white brand-gradient rounded-xl shadow-soft"
                  >
                    <span>Create Company Workspace</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
