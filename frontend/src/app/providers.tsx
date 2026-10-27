'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '../context/AuthContext';
import { PropertyProvider } from '../context/PropertyContext';
import { ToastProvider } from '../components/ui/Notifications';
import RootClientLayout from './RootClientLayout';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <AuthProvider>
        <ToastProvider position="bottom-right">
          <PropertyProvider>
            <RootClientLayout>{children}</RootClientLayout>
          </PropertyProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
