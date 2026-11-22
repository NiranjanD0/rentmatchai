'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  Compass,
  Heart,
  ArrowLeftRight,
  Building2,
  X,
  Settings,
  HelpCircle,
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

interface SidebarButtonProps {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  badge?: React.ReactNode;
  collapsedBadge?: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  isExpanded: boolean;
}

function SidebarButton({
  icon: Icon,
  label,
  badge,
  collapsedBadge,
  active = false,
  onClick,
  isExpanded,
}: SidebarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={!isExpanded ? label : undefined}
      className={`w-full h-10 flex items-center px-2 rounded-xl text-xs transition-colors duration-150 cursor-pointer active:scale-[0.98] overflow-hidden ${
        active
          ? 'bg-zinc-950 text-white font-medium shadow-2xs dark:bg-zinc-100 dark:text-zinc-950'
          : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/70 font-medium'
      }`}
    >
      <div className="w-8 h-8 shrink-0 flex items-center justify-center relative">
        <Icon size={16} strokeWidth={1.8} className="shrink-0" />
        {!isExpanded && collapsedBadge && (
          <span className="absolute -top-0.5 -right-0.5 min-w-3.5 h-3.5 px-0.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[8px] font-bold flex items-center justify-center shadow-xs pointer-events-none ring-2 ring-white dark:ring-[#211E1B]">
            {collapsedBadge}
          </span>
        )}
      </div>

      <div
        className={`overflow-hidden transition-all duration-200 flex-1 flex items-center justify-between min-w-0 ${
          isExpanded
            ? 'opacity-100 max-w-[170px] ml-2'
            : 'opacity-0 max-w-0 ml-0 pointer-events-none'
        }`}
      >
        <span className="truncate whitespace-nowrap">{label}</span>
        {badge}
      </div>
    </button>
  );
}

export function DashboardSidebar({
  onCloseMobileDrawer,
  isMobileDrawer = false,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, isTenant, isLister, logout } = useAuth();
  const { saved, properties } = useProperty();
  const { navigateWithCurtains } = usePageCurtains();
  const { resolvedTheme, theme, setTheme } = useTheme();

  // Permanent collapsible state: expands smoothly on hover or when profile dropdown is open
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    leaveTimerRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 120);
  };

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
      }
    };
  }, []);

  const isExpanded = isMobileDrawer || isHovered || isMenuOpen;
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

  const safeLastName = user?.lastName && user.lastName !== 'User' ? user.lastName : '';
  const displayName = [user?.firstName, safeLastName].filter(Boolean).join(' ') || 'User';
  const displayEmail = user?.email || '';
  const displayAvatar = user?.avatar && !user.avatar.includes('dicebear') ? user.avatar : undefined;

  return (
    <aside
      onMouseEnter={!isMobileDrawer ? handleMouseEnter : undefined}
      onMouseLeave={!isMobileDrawer ? handleMouseLeave : undefined}
      style={
        isMobileDrawer
          ? {
              paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))',
              paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
            }
          : undefined
      }
      className={`h-full flex flex-col justify-between bg-white dark:bg-[#211E1B] text-zinc-700 dark:text-zinc-300 border-r border-zinc-200 dark:border-zinc-800/80 select-none transition-[width,box-shadow] duration-250 ease-out ${
        isMobileDrawer
          ? 'w-full p-4'
          : isExpanded
            ? 'fixed top-0 left-0 w-64 p-2.5 shadow-2xl shadow-black/10 dark:shadow-black/60 z-40'
            : 'fixed top-0 left-0 w-[68px] p-2.5 shadow-none z-30'
      }`}
    >
      {/* Top Block: Logo and Close (mobile) */}
      <div className="shrink-0 h-11 flex items-center px-1 pb-1">
        <div className="w-full flex items-center justify-between">
          <Link
            href="/"
            onClick={() => onCloseMobileDrawer?.()}
            className="flex items-center gap-2 group hover:opacity-90 transition-opacity focus:outline-hidden overflow-hidden h-10"
            title={!isExpanded ? 'RentMatch AI' : undefined}
          >
            <BrandLogo size="sm" hideText={!isExpanded} />
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
      <ScrollArea className="flex-1 my-2 -mx-1 px-1 overflow-x-hidden">
        <nav className="space-y-1 pt-1" aria-label="Dashboard navigation">
          {/* Tenant Navigation */}
          {isTenant && (
            <>
              {/* Dashboard Overview */}
              <SidebarButton
                icon={LayoutDashboard}
                label="Dashboard"
                active={isItemActive('/dashboard')}
                onClick={() => handleNavClick('/dashboard', 'Dashboard')}
                isExpanded={isExpanded}
              />

              {/* AI Search */}
              <SidebarButton
                icon={Sparkles}
                label="AI Search"
                active={pathname === '/dashboard/ai-search'}
                onClick={() => handleNavClick('/dashboard/ai-search', 'AI Search')}
                isExpanded={isExpanded}
                badge={
                  <span
                    className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${
                      pathname === '/dashboard/ai-search'
                        ? 'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                        : 'bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/60'
                    }`}
                  >
                    AI
                  </span>
                }
              />

              {/* Find Properties */}
              <SidebarButton
                icon={Compass}
                label="Find Properties"
                active={pathname === '/dashboard/explore' || pathname === '/explore'}
                onClick={() => handleNavClick('/dashboard/explore', 'Find Properties')}
                isExpanded={isExpanded}
              />

              {/* My Shortlist */}
              <SidebarButton
                icon={Heart}
                label="My Shortlist"
                active={pathname === '/dashboard/shortlist' || pathname === '/shortlist'}
                onClick={() => handleNavClick('/dashboard/shortlist', 'My Shortlist')}
                isExpanded={isExpanded}
                collapsedBadge={
                  pathname === '/dashboard/shortlist' || pathname === '/shortlist'
                    ? undefined
                    : shortlistCount > 0
                      ? shortlistCount
                      : undefined
                }
                badge={
                  shortlistCount > 0 ? (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        pathname === '/dashboard/shortlist' || pathname === '/shortlist'
                          ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900'
                          : 'bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/60'
                      }`}
                    >
                      {shortlistCount}
                    </span>
                  ) : null
                }
              />

              {/* Compare Properties */}
              <SidebarButton
                icon={ArrowLeftRight}
                label="Compare Properties"
                active={pathname === '/dashboard/compare'}
                onClick={() => handleNavClick('/dashboard/compare', 'Compare Properties')}
                isExpanded={isExpanded}
              />
            </>
          )}

          {/* Landlord Navigation */}
          {isLister && (
            <>
              {/* Dashboard Overview */}
              <SidebarButton
                icon={LayoutDashboard}
                label="Dashboard"
                active={isItemActive('/dashboard')}
                onClick={() => handleNavClick('/dashboard', 'Dashboard')}
                isExpanded={isExpanded}
              />

              {/* AI Search */}
              <SidebarButton
                icon={Sparkles}
                label="AI Search"
                active={pathname === '/dashboard/ai-search'}
                onClick={() => handleNavClick('/dashboard/ai-search', 'AI Search')}
                isExpanded={isExpanded}
                badge={
                  <span
                    className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${
                      pathname === '/dashboard/ai-search'
                        ? 'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                        : 'bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/60'
                    }`}
                  >
                    AI
                  </span>
                }
              />

              {/* My Properties */}
              <SidebarButton
                icon={Building2}
                label="My Properties"
                active={pathname === '/dashboard/properties'}
                onClick={() => handleNavClick('/dashboard/properties', 'My Properties')}
                isExpanded={isExpanded}
                collapsedBadge={
                  pathname === '/dashboard/properties'
                    ? undefined
                    : myPropertiesCount > 0
                      ? myPropertiesCount
                      : undefined
                }
                badge={
                  myPropertiesCount > 0 ? (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        pathname === '/dashboard/properties'
                          ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900'
                          : 'bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/60'
                      }`}
                    >
                      {myPropertiesCount}
                    </span>
                  ) : null
                }
              />
            </>
          )}
        </nav>
      </ScrollArea>

      {/* Secondary Bottom Block: Support & Settings */}
      <div className="shrink-0 pt-2 pb-2 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-1">
        {/* Support: Direct single function mailto me@niranjan.lol */}
        <SidebarButton
          icon={HelpCircle}
          label="Support"
          onClick={() => {
            onCloseMobileDrawer?.();
            window.location.href = 'mailto:me@niranjan.lol';
          }}
          isExpanded={isExpanded}
        />

        {/* Settings */}
        <SidebarButton
          icon={Settings}
          label="Settings"
          active={pathname === '/dashboard/profile'}
          onClick={() => handleNavClick('/dashboard/profile?tab=security', 'Settings')}
          isExpanded={isExpanded}
        />
      </div>

      {/* Bottom Block: Dropdown Account Card */}
      <div className="shrink-0 pt-1">
        <DropdownAccountCardMD
          name={displayName}
          email={displayEmail}
          avatarUrl={displayAvatar}
          role={isLister ? 'landlord' : 'tenant'}
          isDarkMode={isDark}
          onToggleDarkMode={() => setTheme(isDark ? 'light' : 'dark')}
          onSignOut={logout}
          onCloseMobileDrawer={onCloseMobileDrawer}
          isExpanded={isExpanded}
          onOpenChange={(open) => setIsMenuOpen(open)}
        />
      </div>
    </aside>
  );
}
