'use client';

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { PropertyProvider } from '../context/PropertyContext';
import RootClientLayout from './RootClientLayout';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PropertyProvider>
        <RootClientLayout>{children}</RootClientLayout>
      </PropertyProvider>
    </AuthProvider>
  );
}
