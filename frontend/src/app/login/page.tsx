'use client';

import { LoginForm } from "@/src/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 sm:p-6 bg-white dark:bg-black transition-colors">
      <div className="w-full max-w-md relative z-10 py-6">
        <LoginForm />
      </div>
    </div>
  );
}
