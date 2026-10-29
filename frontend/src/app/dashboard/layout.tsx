import React from 'react';
import { DashboardLayout } from '@/src/components/dashboard';

export const metadata = {
  title: 'Dashboard | RentMatch AI',
  description: 'RentMatch AI management dashboard',
};

export default function AppDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
