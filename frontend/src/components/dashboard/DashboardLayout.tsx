'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { DashboardGuard } from './DashboardGuard';
import { DashboardSidebar } from './DashboardSidebar';
import BrandLogo from '@/src/components/layout/BrandLogo';
import { useAuth } from '@/src/context/AuthContext';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  title?: string;
  headerAction?: React.ReactNode;
}

export function DashboardLayout({
  children,
  title = 'Dashboard',
  headerAction,
}: DashboardLayoutProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { isLister } = useAuth();

  // Close drawer on path change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  // Close drawer on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMobileDrawerOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute dynamic title based on sub-route if not explicitly specified
  const displayTitle = React.useMemo(() => {
    if (pathname === '/dashboard/compare') return 'Compare Properties';
    if (pathname === '/dashboard/landlord') return 'Landlord Dashboard';
    if (pathname === '/dashboard/tenant') return 'Tenant Dashboard';
    return title;
  }, [pathname, title]);

  return (
    <DashboardGuard>
      <div className="min-h-screen w-full flex bg-[#09090b] text-zinc-100 overflow-x-hidden">
        {/* Desktop Fixed Left Sidebar */}
        <div className="hidden lg:flex shrink-0 h-screen sticky top-0 z-30">
          <DashboardSidebar />
        </div>

        {/* Mobile Slide-Out Drawer Navigation */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop Overlay */}
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
              onClick={() => setMobileDrawerOpen(false)}
              aria-hidden="true"
            />

            {/* Sliding Drawer Container */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Drawer"
              className="relative w-72 max-w-[85vw] h-full bg-[#09090b] shadow-2xl z-50 animate-in slide-in-from-left duration-200"
            >
              <DashboardSidebar
                isMobileDrawer={true}
                onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          {/* Top Bar (Mobile Drawer Toggle & Desktop Page Header) */}
          <header className="sticky top-0 z-20 shrink-0 h-16 border-b border-zinc-800/80 bg-[#09090b]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Left: Mobile hamburger or Page Title */}
            <div className="flex items-center gap-3">
              {/* Mobile Drawer Toggle */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu size={20} />
              </button>

              {/* Mobile Brand Logo */}
              <div className="lg:hidden">
                <BrandLogo size="sm" hideText={true} />
              </div>

              {/* Page Title */}
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {displayTitle}
              </h1>
            </div>
            
          </header>

          {/* Blank Main Content Area (Intentionally clean for future feature development) */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </DashboardGuard>
  );
}

