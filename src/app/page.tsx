"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { LandingPage } from "@/components/landing";

export default function Home() {
  const { session, ctx, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      if (ctx?.tenant || ctx?.is_platform_admin) {
        router.replace("/dashboard");
      } else {
        router.replace("/onboarding");
      }
    }
  }, [session, ctx, loading, router]);

  return <LandingPage />;
}
