'use client';

import React, { Suspense } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { LoginForm, AuthCardSkeleton } from "@/src/components/auth";
import BrandLogo from "@/src/components/layout/BrandLogo";
import { Spotlight } from "@/src/components/ui/spotlight";
import { Particles } from "@/src/components/ui/particles";
import { BlurFade } from "@/src/components/ui/blur-fade";

export default function LoginPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 bg-white dark:bg-black transition-colors">
      {/* Aceternity Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill={isDark ? "#ffffff" : "#a1a1aa"}
      />

      {/* Magic UI Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Particles
          className="absolute inset-0"
          quantity={40}
          staticity={50}
          ease={50}
          size={0.6}
          color={isDark ? "#ffffff" : "#000000"}
        />
      </div>

      <div className="w-full max-w-md relative z-10 py-6 flex flex-col items-center">
        <BlurFade delay={0.1} inView>
          <Link href="/" className="mb-6 flex justify-center hover:opacity-90 transition-opacity">
            <BrandLogo size="lg" />
          </Link>
        </BlurFade>

        <div className="w-full">
          <BlurFade delay={0.2} inView>
            <Suspense fallback={<AuthCardSkeleton mode="login" />}>
              <LoginForm />
            </Suspense>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}
