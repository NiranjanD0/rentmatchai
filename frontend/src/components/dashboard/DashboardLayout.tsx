'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardGuard } from './DashboardGuard';
import { DashboardSidebar } from './DashboardSidebar';
import BrandLogo from '@/src/components/layout/BrandLogo';
import { useAuth } from '@/src/context/AuthContext';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { ToggleTheme } from '../lightswind/toggle-theme';

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
    if (pathname === '/dashboard/ai-search') return 'AI Search';
    if (pathname === '/dashboard/inbox') return 'Inbox';
    if (pathname === '/dashboard/explore') return 'Find Properties';
    if (pathname === '/dashboard/shortlist') return 'My Shortlist';
    if (pathname === '/dashboard/compare') return 'Compare Properties';
    if (pathname === '/dashboard/landlord') return 'Landlord Dashboard';
    if (pathname === '/dashboard/tenant') return 'Tenant Dashboard';
    if (pathname === '/dashboard') return isLister ? 'Landlord Dashboard' : 'Tenant Dashboard';
    return title;
  }, [pathname, title, isLister]);

  return (
    <DashboardGuard>
      <div className="min-h-[100dvh] w-full flex bg-zinc-50 dark:bg-[#171513] text-zinc-900 dark:text-zinc-100 overflow-x-hidden transition-colors duration-200">
        {/* Desktop Fixed Left Sidebar */}
        <div className="hidden lg:flex shrink-0 h-[100dvh] sticky top-0 z-30">
          <DashboardSidebar />
        </div>

        {/* Mobile Slide-Out Drawer Navigation (Apple Spring Physics) */}
        <AnimatePresence>
          {mobileDrawerOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              {/* Backdrop Overlay with blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                onClick={() => setMobileDrawerOpen(false)}
                aria-hidden="true"
              />

              {/* Sliding Drawer Container with Apple Spring physics */}
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Navigation Drawer"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-[#211E1B] border-r border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 overflow-hidden flex flex-col"
              >
                <DashboardSidebar
                  isMobileDrawer={true}
                  onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-[100dvh] bg-zinc-50 dark:bg-[#171513] transition-colors duration-200 overflow-hidden">
          {/* Top Bar (Liquid frosted glass) */}
          <header
            className="shrink-0 h-16 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-[#211E1B]/90 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors duration-200 z-10"
            style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
          >
            {/* Left: Mobile hamburger or Page Title */}
            <div className="flex items-center gap-3">
              {/* Mobile Drawer Toggle */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden p-2 rounded-xl text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/80 transition-all cursor-pointer active:scale-90"
                aria-label="Open navigation menu"
              >
                <Menu size={20} />
              </button>

              {/* Mobile Brand Logo */}
              <div className="lg:hidden">
                <BrandLogo size="sm" hideText={true} />
              </div>

              {/* Page Title */}
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-white truncate">
                {displayTitle}
              </h1>
            </div>

            {/* Right: Header Action & Dedicated Theme Toggle */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {headerAction}
              <ToggleTheme />
            </div>
          </header>

          {/* Main Content Area: Responsive 100dvh handling */}
          {pathname === '/dashboard/ai-search' || pathname === '/dashboard/inbox' ? (
            <main className="flex-1 p-0 overflow-hidden flex flex-col h-[calc(100dvh-4rem)]">
              {children}
            </main>
          ) : (
            <ScrollArea className="flex-1 h-[calc(100dvh-4rem)]">
              <main
                className="p-4 sm:p-6 lg:p-8"
                style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}
              >
                {children}
              </main>
            </ScrollArea>
          )}
        </div>
      </div>
    </DashboardGuard>
  );
}
