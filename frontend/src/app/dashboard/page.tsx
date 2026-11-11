'use client';

import React from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { DashboardShellSkeleton } from '@/src/components/dashboard/DashboardShellSkeleton';
import TenantDashboardPage from './tenant/page';
import LandlordDashboardPage from './landlord/page';

/**
 * Main Dashboard Entry Point
 * Automatically resolves and displays the appropriate tailored dashboard view:
 * - Property Lister / Landlord: LandlordDashboardPage
 * - Tenant / Renter: TenantDashboardPage
 */
export default function DashboardPage() {
  const { isLister, loading } = useAuth();

  if (loading) {
    return <DashboardShellSkeleton />;
  }

  if (isLister) {
    return <LandlordDashboardPage />;
  }

  return <TenantDashboardPage />;
}
