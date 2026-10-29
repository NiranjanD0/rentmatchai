import React, { Suspense } from "react";
import Link from "next/link";
import { SignupForm, AuthCardSkeleton } from "@/src/components/auth";
import BrandLogo from "@/src/components/layout/BrandLogo";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-white dark:bg-black transition-colors">
      <div className="w-full max-w-md relative z-10 py-6 flex flex-col items-center">
        <Link href="/" className="mb-6 flex justify-center hover:opacity-90 transition-opacity">
          <BrandLogo size="lg" />
        </Link>
        <div className="w-full">
          <Suspense fallback={<AuthCardSkeleton mode="signup" />}>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

