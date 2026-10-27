'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '../context/AuthContext';
import { PropertyProvider } from '../context/PropertyContext';
import { ToastProvider } from '../components/ui/Notifications';
import { PageCurtains } from '../components/ui/page-curtains';
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
            <PageCurtains>
              <RootClientLayout>{children}</RootClientLayout>
            </PageCurtains>
          </PropertyProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
