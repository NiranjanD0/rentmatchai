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
  PlusCircle,
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
      className={`h-full flex flex-col justify-between bg-white dark:bg-[#09090b] text-zinc-700 dark:text-zinc-300 border-r border-zinc-200 dark:border-zinc-800/80 select-none transition-colors duration-200 ${
        isMobileDrawer ? 'w-full p-4' : 'w-64 xl:w-68 p-4'
      }`}
    >
      {/* Top Block: Logo and Close (mobile) */}
      <div className="shrink-0">
        {/* Brand Header */}
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
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Middle Block: Dynamic Role Navigation Items with ScrollArea */}
      <ScrollArea className="flex-1 my-2 -mx-1 px-1">
        <nav className="space-y-1 pt-1">
          {/* Tenant Navigation */}
          {isTenant && (
            <>
              {/* Dashboard */}
              <button
                type="button"
                onClick={() => handleNavClick('/dashboard/tenant', 'Dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                  isItemActive('/dashboard')
                    ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-xs border border-zinc-200/90 dark:bg-zinc-800/90 dark:text-white dark:border-zinc-700/40'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <LayoutDashboard size={16} strokeWidth={1.8} className="shrink-0" />
                <span className="truncate">Dashboard</span>
              </button>

              {/* AI Search */}
              <button
                type="button"
                onClick={() => handleNavClick('/dashboard/ai-search', 'AI Search')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                  pathname === '/dashboard/ai-search'
                    ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-xs border border-zinc-200/90 dark:bg-zinc-800/90 dark:text-white dark:border-zinc-700/40'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Sparkles size={16} strokeWidth={1.8} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="truncate">AI Search</span>
                </div>
                <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/25">
                  AI
                </span>
              </button>

              {/* Inbox */}
              <button
                type="button"
                onClick={() => handleNavClick('/dashboard/inbox', 'Inbox')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                  pathname === '/dashboard/inbox'
                    ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-xs border border-zinc-200/90 dark:bg-zinc-800/90 dark:text-white dark:border-zinc-700/40'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Inbox size={16} strokeWidth={1.8} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="truncate">Inbox</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/25">
                  3
                </span>
              </button>

              {/* Find Properties */}
              <button
                type="button"
                onClick={() => handleNavClick('/explore', 'Find Properties')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                  pathname === '/explore'
                    ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-xs border border-zinc-200/90 dark:bg-zinc-800/90 dark:text-white dark:border-zinc-700/40'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <Compass size={16} strokeWidth={1.8} className="shrink-0" />
                <span className="truncate">Find Properties</span>
              </button>

              {/* My Shortlist */}
              <button
                type="button"
                onClick={() => handleNavClick('/shortlist', 'My Shortlist')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                  pathname === '/shortlist'
                    ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-xs border border-zinc-200/90 dark:bg-zinc-800/90 dark:text-white dark:border-zinc-700/40'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Heart size={16} strokeWidth={1.8} className="shrink-0" />
                  <span className="truncate">My Shortlist</span>
                </div>
                {shortlistCount > 0 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/50">
                    {shortlistCount}
                  </span>
                )}
              </button>

              {/* Compare Properties */}
              <button
                type="button"
                onClick={() => handleNavClick('/dashboard/compare', 'Compare Properties')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                  pathname === '/dashboard/compare'
                    ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-xs border border-zinc-200/90 dark:bg-zinc-800/90 dark:text-white dark:border-zinc-700/40'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
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
              {/* Dashboard */}
              <button
                type="button"
                onClick={() => handleNavClick('/dashboard/landlord', 'Dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                  isItemActive('/dashboard')
                    ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-xs border border-zinc-200/90 dark:bg-zinc-800/90 dark:text-white dark:border-zinc-700/40'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <LayoutDashboard size={16} strokeWidth={1.8} className="shrink-0" />
                <span className="truncate">Dashboard</span>
              </button>

              {/* AI Search */}
              <button
                type="button"
                onClick={() => handleNavClick('/dashboard/ai-search', 'AI Search')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                  pathname === '/dashboard/ai-search'
                    ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-xs border border-zinc-200/90 dark:bg-zinc-800/90 dark:text-white dark:border-zinc-700/40'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Sparkles size={16} strokeWidth={1.8} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="truncate">AI Search</span>
                </div>
                <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/25">
                  AI
                </span>
              </button>

              {/* Inbox */}
              <button
                type="button"
                onClick={() => handleNavClick('/dashboard/inbox', 'Inbox')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                  pathname === '/dashboard/inbox'
                    ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-xs border border-zinc-200/90 dark:bg-zinc-800/90 dark:text-white dark:border-zinc-700/40'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Inbox size={16} strokeWidth={1.8} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="truncate">Inbox</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/25">
                  3
                </span>
              </button>

              {/* My Properties */}
              <button
                type="button"
                onClick={() => handleNavClick('/profile?tab=listings', 'My Properties')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                  pathname === '/profile' && typeof window !== 'undefined' && window.location.search.includes('listings')
                    ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-xs border border-zinc-200/90 dark:bg-zinc-800/90 dark:text-white dark:border-zinc-700/40'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Building2 size={16} strokeWidth={1.8} className="shrink-0" />
                  <span className="truncate">My Properties</span>
                </div>
                {myPropertiesCount > 0 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/50">
                    {myPropertiesCount}
                  </span>
                )}
              </button>

              {/* Add Property */}
              <button
                type="button"
                onClick={() => {
                  onCloseMobileDrawer?.();
                  openAddProperty();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium transition-colors cursor-pointer text-left"
              >
                <PlusCircle size={16} strokeWidth={1.8} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="truncate">Add Property</span>
              </button>
            </>
          )}
        </nav>
      </ScrollArea>

      {/* Bottom Block: Dropdown Account Card */}
      <div className="shrink-0 pt-3 border-t border-zinc-200 dark:border-zinc-800/70">
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

