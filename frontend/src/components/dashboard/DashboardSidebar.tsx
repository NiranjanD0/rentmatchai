'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  Inbox,
  Compass,
  Heart,
  ArrowLeftRight,
  Building2,
  Plus,
  X,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/src/context/AuthContext';
import { useProperty } from '@/src/context/PropertyContext';
import BrandLogo from '@/src/components/layout/BrandLogo';
import { usePageCurtains } from '@/src/components/ui/page-curtains';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { DropdownAccountCardMD } from './DropdownAccountCard';

interface DashboardSidebarProps {
  onCloseMobileDrawer?: () => void;
  isMobileDrawer?: boolean;
}

export function DashboardSidebar({
  onCloseMobileDrawer,
  isMobileDrawer = false,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, isTenant, isLister, logout } = useAuth();
  const { saved, properties, openAddProperty } = useProperty();
  const { navigateWithCurtains } = usePageCurtains();
  const { resolvedTheme, theme, setTheme } = useTheme();

  const isDark = resolvedTheme === 'dark' || theme === 'dark';

  const handleNavClick = (href: string, title: string) => {
    onCloseMobileDrawer?.();
    navigateWithCurtains(href, title);
  };

  // Landlord property count
  const myPropertiesCount = isLister && user?.id
    ? properties.filter((p) => p.listerId === user.id).length
    : 0;

  // Tenant shortlist count
  const shortlistCount = saved.length;

  // Active check helper
  const isItemActive = (href: string) => {
    if (href === '/dashboard') {
      return (
        pathname === '/dashboard' ||
        pathname === '/dashboard/tenant' ||
        pathname === '/dashboard/landlord'
      );
    }
    return pathname === href;
  };

  const displayName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';
  const displayEmail = user?.email || '';
  const displayAvatar = user?.avatar && !user.avatar.includes('dicebear') ? user.avatar : undefined;

  return (
    <aside
      style={
        isMobileDrawer
          ? {
              paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))',
              paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
            }
          : undefined
      }
      className={`h-full flex flex-col justify-between bg-white dark:bg-[#09090b] text-zinc-700 dark:text-zinc-300 border-r border-zinc-200 dark:border-zinc-800/80 select-none transition-colors duration-200 ${
        isMobileDrawer ? 'w-full p-4' : 'w-64 xl:w-68 p-4'
      }`}
    >
      {/* Top Block: Logo and Close (mobile) */}
      <div className="shrink-0">
        <div className="flex items-center justify-between px-1 pt-1 pb-2">
          <Link
            href="/"
            onClick={() => onCloseMobileDrawer?.()}
            className="flex items-center gap-2 group hover:opacity-90 transition-opacity focus:outline-hidden"
          >
            <BrandLogo size="sm" />
          </Link>

          {isMobileDrawer && (
            <button
              type="button"
              onClick={onCloseMobileDrawer}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/80 transition-colors cursor-pointer active:scale-90"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Middle Block: Dynamic Role Navigation Items with ScrollArea */}
      <ScrollArea className="flex-1 my-2 -mx-1 px-1">
        <nav className="space-y-1 pt-1" aria-label="Dashboard navigation">
          {/* Tenant Navigation */}
          {isTenant && (
            <>
              {/* Dashboard Overview */}
              <button
                type="button"
                onClick={() => handleNavClick('/dashboard/tenant', 'Dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer text-left active:scale-[0.98] ${
                  isItemActive('/dashboard')
                    ? 'bg-zinc-950 text-white font-medium shadow-2xs dark:bg-zinc-100 dark:text-zinc-950'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <LayoutDashboard size={16} strokeWidth={1.8} className="shrink-0" />
                <span className="truncate">Dashboard</span>
              </button>

              {/* AI Search */}
              <button
                type="button"
                onClick={() => handleNavClick('/dashboard/ai-search', 'AI Search')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer text-left active:scale-[0.98] ${
                  pathname === '/dashboard/ai-search'
                    ? 'bg-zinc-950 text-white font-medium shadow-2xs dark:bg-zinc-100 dark:text-zinc-950'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Sparkles size={16} strokeWidth={1.8} className="shrink-0" />
                  <span className="truncate">AI Search</span>
                </div>
                <span
                  className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${
                    pathname === '/dashboard/ai-search'
                      ? 'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                      : 'bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/60'
                  }`}
                >
                  AI
                </span>
              </button>

              {/* Inbox */}
              <button
                type="button"
                onClick={() => handleNavClick('/dashboard/inbox', 'Inbox')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer text-left active:scale-[0.98] ${
                  pathname === '/dashboard/inbox'
                    ? 'bg-zinc-950 text-white font-medium shadow-2xs dark:bg-zinc-100 dark:text-zinc-950'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Inbox size={16} strokeWidth={1.8} className="shrink-0" />
                  <span className="truncate">Inbox</span>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    pathname === '/dashboard/inbox'
                      ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900'
                      : 'bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/60'
                  }`}
                >
                  3
                </span>
              </button>

              {/* Find Properties */}
              <button
                type="button"
                onClick={() => handleNavClick('/dashboard/explore', 'Find Properties')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer text-left active:scale-[0.98] ${
                  pathname === '/dashboard/explore' || pathname === '/explore'
                    ? 'bg-zinc-950 text-white font-medium shadow-2xs dark:bg-zinc-100 dark:text-zinc-950'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <Compass size={16} strokeWidth={1.8} className="shrink-0" />
                <span className="truncate">Find Properties</span>
              </button>

              {/* My Shortlist */}
              <button
                type="button"
                onClick={() => handleNavClick('/dashboard/shortlist', 'My Shortlist')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer text-left active:scale-[0.98] ${
                  pathname === '/dashboard/shortlist' || pathname === '/shortlist'
                    ? 'bg-zinc-950 text-white font-medium shadow-2xs dark:bg-zinc-100 dark:text-zinc-950'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Heart size={16} strokeWidth={1.8} className="shrink-0" />
                  <span className="truncate">My Shortlist</span>
                </div>
                {shortlistCount > 0 && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      pathname === '/dashboard/shortlist' || pathname === '/shortlist'
                        ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900'
                        : 'bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/60'
                    }`}
                  >
                    {shortlistCount}
                  </span>
                )}
              </button>

              {/* Compare Properties */}
              <button
                type="button"
                onClick={() => handleNavClick('/dashboard/compare', 'Compare Properties')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer text-left active:scale-[0.98] ${
                  pathname === '/dashboard/compare'
                    ? 'bg-zinc-950 text-white font-medium shadow-2xs dark:bg-zinc-100 dark:text-zinc-950'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <ArrowLeftRight size={16} strokeWidth={1.8} className="shrink-0" />
                <span className="truncate">Compare Properties</span>
              </button>
            </>
          )}

          {/* Landlord Navigation */}
          {isLister && (
            <>
              {/* Dashboard Overview */}
              <button
                type="button"
                onClick={() => handleNavClick('/dashboard/landlord', 'Dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer text-left active:scale-[0.98] ${
                  isItemActive('/dashboard')
                    ? 'bg-zinc-950 text-white font-medium shadow-2xs dark:bg-zinc-100 dark:text-zinc-950'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <LayoutDashboard size={16} strokeWidth={1.8} className="shrink-0" />
                <span className="truncate">Dashboard</span>
              </button>

              {/* AI Search */}
              <button
                type="button"
                onClick={() => handleNavClick('/dashboard/ai-search', 'AI Search')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer text-left active:scale-[0.98] ${
                  pathname === '/dashboard/ai-search'
                    ? 'bg-zinc-950 text-white font-medium shadow-2xs dark:bg-zinc-100 dark:text-zinc-950'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Sparkles size={16} strokeWidth={1.8} className="shrink-0" />
                  <span className="truncate">AI Search</span>
                </div>
                <span
                  className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${
                    pathname === '/dashboard/ai-search'
                      ? 'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                      : 'bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/60'
                  }`}
                >
                  AI
                </span>
              </button>

              {/* Inbox */}
              <button
                type="button"
                onClick={() => handleNavClick('/dashboard/inbox', 'Inbox')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer text-left active:scale-[0.98] ${
                  pathname === '/dashboard/inbox'
                    ? 'bg-zinc-950 text-white font-medium shadow-2xs dark:bg-zinc-100 dark:text-zinc-950'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Inbox size={16} strokeWidth={1.8} className="shrink-0" />
                  <span className="truncate">Inbox</span>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    pathname === '/dashboard/inbox'
                      ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900'
                      : 'bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/60'
                  }`}
                >
                  3
                </span>
              </button>

              {/* My Properties */}
              <button
                type="button"
                onClick={() => handleNavClick('/profile?tab=listings', 'My Properties')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer text-left active:scale-[0.98] ${
                  pathname === '/profile' && typeof window !== 'undefined' && window.location.search.includes('listings')
                    ? 'bg-zinc-950 text-white font-medium shadow-2xs dark:bg-zinc-100 dark:text-zinc-950'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Building2 size={16} strokeWidth={1.8} className="shrink-0" />
                  <span className="truncate">My Properties</span>
                </div>
                {myPropertiesCount > 0 && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      pathname === '/profile' && typeof window !== 'undefined' && window.location.search.includes('listings')
                        ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900'
                        : 'bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/60'
                    }`}
                  >
                    {myPropertiesCount}
                  </span>
                )}
              </button>

              {/* Add Property CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onCloseMobileDrawer?.();
                    openAddProperty();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-950 hover:bg-zinc-850 text-white dark:bg-white dark:hover:bg-zinc-150 dark:text-zinc-950 transition-all duration-150 cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  <Plus size={15} strokeWidth={2.2} className="shrink-0" />
                  <span>Add Property</span>
                </button>
              </div>
            </>
          )}
        </nav>
      </ScrollArea>

      {/* Bottom Block: Dropdown Account Card */}
      <div className="shrink-0 pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
        <DropdownAccountCardMD
          name={displayName}
          email={displayEmail}
          avatarUrl={displayAvatar}
          role={isLister ? 'landlord' : 'tenant'}
          isDarkMode={isDark}
          onToggleDarkMode={() => setTheme(isDark ? 'light' : 'dark')}
          onSignOut={logout}
          onCloseMobileDrawer={onCloseMobileDrawer}
        />
      </div>
    </aside>
  );
}
