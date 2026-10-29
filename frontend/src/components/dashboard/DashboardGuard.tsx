'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { DashboardShellSkeleton } from './DashboardShellSkeleton';

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

  // While verifying session, show seamless skeleton shell matching layout
  if (loading) {
    return <DashboardShellSkeleton />;
  }


  // If unauthenticated, don't render dashboard while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
