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

interface NavItemProps {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  count?: number;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ label, icon: Icon, count, isActive, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full h-9 flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
        isActive
          ? 'bg-zinc-100 text-zinc-900 font-medium border border-zinc-200/80 dark:bg-zinc-800/80 dark:text-zinc-100 dark:border-zinc-700/50 shadow-2xs'
          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/60 font-normal'
      }`}
    >
      <div className="flex items-center gap-2.5 truncate">
        <Icon
          size={16}
          strokeWidth={1.5}
          className={`shrink-0 ${
            isActive
              ? 'text-zinc-900 dark:text-zinc-100'
              : 'text-zinc-500 dark:text-zinc-400'
          }`}
        />
        <span className="truncate">{label}</span>
      </div>

      {typeof count === 'number' && count > 0 && (
        <span
          className={`text-xs font-mono tabular-nums px-1.5 py-0.5 rounded-md border ${
            isActive
              ? 'bg-zinc-200/70 dark:bg-zinc-700/60 text-zinc-800 dark:text-zinc-200 border-zinc-300/60 dark:border-zinc-600/50'
              : 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-500 dark:text-zinc-400 border-zinc-200/60 dark:border-zinc-700/40'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
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

  const isDashboardActive =
    pathname === '/dashboard' ||
    pathname === '/dashboard/tenant' ||
    pathname === '/dashboard/landlord';

  const displayName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';
  const displayEmail = user?.email || '';
  const displayAvatar = user?.avatar && !user.avatar.includes('dicebear') ? user.avatar : undefined;

  return (
    <aside
      className={`h-full flex flex-col justify-between bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border-r border-zinc-200/80 dark:border-zinc-800/60 select-none transition-colors duration-200 ${
        isMobileDrawer ? 'w-full p-4' : 'w-64 p-4'
      }`}
    >
      {/* Top Block: Logo and Close (mobile) */}
      <div className="shrink-0 pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="flex items-center justify-between px-1">
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
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* Middle Block: Navigation Items */}
      <ScrollArea className="flex-1 my-3 -mx-1 px-1">
        <nav className="space-y-1">
          {/* Tenant Navigation */}
          {isTenant && (
            <>
              <NavItem
                label="Dashboard"
                href="/dashboard/tenant"
                icon={LayoutDashboard}
                isActive={isDashboardActive}
                onClick={() => handleNavClick('/dashboard/tenant', 'Dashboard')}
              />

              <NavItem
                label="AI Search"
                href="/dashboard/ai-search"
                icon={Sparkles}
                isActive={pathname === '/dashboard/ai-search'}
                onClick={() => handleNavClick('/dashboard/ai-search', 'AI Search')}
              />

              <NavItem
                label="Inbox"
                href="/dashboard/inbox"
                icon={Inbox}
                count={3}
                isActive={pathname === '/dashboard/inbox'}
                onClick={() => handleNavClick('/dashboard/inbox', 'Inbox')}
              />

              <NavItem
                label="Find Properties"
                href="/dashboard/explore"
                icon={Compass}
                isActive={pathname === '/dashboard/explore' || pathname === '/explore'}
                onClick={() => handleNavClick('/dashboard/explore', 'Find Properties')}
              />

              <NavItem
                label="My Shortlist"
                href="/dashboard/shortlist"
                icon={Heart}
                count={shortlistCount}
                isActive={pathname === '/dashboard/shortlist' || pathname === '/shortlist'}
                onClick={() => handleNavClick('/dashboard/shortlist', 'My Shortlist')}
              />

              <NavItem
                label="Compare Properties"
                href="/dashboard/compare"
                icon={ArrowLeftRight}
                isActive={pathname === '/dashboard/compare'}
                onClick={() => handleNavClick('/dashboard/compare', 'Compare Properties')}
              />
            </>
          )}

          {/* Landlord Navigation */}
          {isLister && (
            <>
              <NavItem
                label="Dashboard"
                href="/dashboard/landlord"
                icon={LayoutDashboard}
                isActive={isDashboardActive}
                onClick={() => handleNavClick('/dashboard/landlord', 'Dashboard')}
              />

              <NavItem
                label="AI Search"
                href="/dashboard/ai-search"
                icon={Sparkles}
                isActive={pathname === '/dashboard/ai-search'}
                onClick={() => handleNavClick('/dashboard/ai-search', 'AI Search')}
              />

              <NavItem
                label="Inbox"
                href="/dashboard/inbox"
                icon={Inbox}
                count={3}
                isActive={pathname === '/dashboard/inbox'}
                onClick={() => handleNavClick('/dashboard/inbox', 'Inbox')}
              />

              <NavItem
                label="My Properties"
                href="/profile?tab=listings"
                icon={Building2}
                count={myPropertiesCount}
                isActive={pathname === '/profile' && typeof window !== 'undefined' && window.location.search.includes('listings')}
                onClick={() => handleNavClick('/profile?tab=listings', 'My Properties')}
              />

              <button
                type="button"
                onClick={() => {
                  onCloseMobileDrawer?.();
                  openAddProperty();
                }}
                className="w-full h-9 flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-normal text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/60 transition-colors cursor-pointer text-left"
              >
                <PlusCircle size={16} strokeWidth={1.5} className="shrink-0 text-zinc-500 dark:text-zinc-400" />
                <span className="truncate">Add Property</span>
              </button>
            </>
          )}
        </nav>
      </ScrollArea>

      {/* Bottom Block: Dropdown Account Card */}
      <div className="shrink-0 pt-3 border-t border-zinc-200/80 dark:border-zinc-800/60">
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
