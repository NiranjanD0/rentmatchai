'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';

interface DashboardGuardProps {
  children: React.ReactNode;
}

export function DashboardGuard({ children }: DashboardGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Preserve intended destination safely
      const safeRedirect = pathname && pathname.startsWith('/') ? encodeURIComponent(pathname) : '';
      const loginUrl = safeRedirect ? `/login?redirect=${safeRedirect}` : '/login';
      router.replace(loginUrl);
    }
  }, [loading, isAuthenticated, pathname, router]);

  // While verifying session, show a sleek dark loading state to prevent flash of content
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#09090b] flex flex-col items-center justify-center text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-zinc-800 border-t-zinc-200 animate-spin" />
          <span className="text-xs font-medium tracking-wider uppercase text-zinc-500">
            Verifying session...
          </span>
        </div>
      </div>
    );
  }

  // If unauthenticated, don't render dashboard while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
