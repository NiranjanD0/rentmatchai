'use client';

import { SignupForm } from "@/src/components/signup-form";

export default function SignupPage() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl rounded-full dark:from-emerald-500/20" />
      
      <div className="w-full max-w-sm md:max-w-4xl relative z-10 py-6">
        <SignupForm />
      </div>
    </div>
  );
}
