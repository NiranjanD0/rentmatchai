'use client';

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { PropertyProvider } from '../context/PropertyContext';
import { ToastProvider } from '../components/ui/Notifications';
import RootClientLayout from './RootClientLayout';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider position="bottom-right">
        <PropertyProvider>
          <RootClientLayout>{children}</RootClientLayout>
        </PropertyProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

