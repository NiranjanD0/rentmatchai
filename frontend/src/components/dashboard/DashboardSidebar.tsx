'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  Heart,
  ArrowLeftRight,
  Building2,
  PlusCircle,
  HelpCircle,
  Settings,
  Search,
  ChevronsUpDown,
  LogOut,
  User,
  ShieldCheck,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useProperty } from '@/src/context/PropertyContext';
import { USER_ROLES } from '@/src/constants/initialData';
import BrandLogo from '@/src/components/layout/BrandLogo';
import { usePageCurtains } from '@/src/components/ui/page-curtains';

interface DashboardSidebarProps {
  onCloseMobileDrawer?: () => void;
  isMobileDrawer?: boolean;
}

export function DashboardSidebar({
  onCloseMobileDrawer,
  isMobileDrawer = false,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isTenant, isLister, logout } = useAuth();
  const { saved, properties, openAddProperty } = useProperty();
  const { navigateWithCurtains } = usePageCurtains();

  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global ⌘K / Ctrl+K keyboard shortcut to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    onCloseMobileDrawer?.();
    logout();
    router.replace('/login');
  };

  const handleNavClick = (href: string, title: string) => {
    onCloseMobileDrawer?.();
    navigateWithCurtains(href, title);
  };

  const userInitials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  const userRoleLabel = isLister ? 'Landlord' : 'Tenant';

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

  return (
    <aside
      className={`h-full flex flex-col justify-between bg-[#09090b] text-zinc-300 border-r border-zinc-800/80 select-none ${
        isMobileDrawer ? 'w-full p-4' : 'w-64 xl:w-68 p-4'
      }`}
    >
      {/* Top Block: Logo, Close (mobile), and Search */}
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1 pt-1">
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
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Search Field with ⌘K Shortcut Hint */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-9 pr-9 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono text-zinc-500 bg-zinc-800/80 rounded border border-zinc-700/60 pointer-events-none select-none">
            ⌘K
          </kbd>
        </div>

        {/* Dynamic Role Navigation Items */}
        <nav className="space-y-1 pt-2">
          {/* Tenant Navigation */}
          {isTenant && (
            <>
              {/* Dashboard */}
              <button
                type="button"
                onClick={() => handleNavClick('/dashboard/tenant', 'Dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                  isItemActive('/dashboard')
                    ? 'bg-zinc-800/90 text-white font-semibold shadow-xs border border-zinc-700/40'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <LayoutDashboard size={16} strokeWidth={1.8} className="shrink-0" />
                <span className="truncate">Dashboard</span>
              </button>

              {/* Find Properties */}
              <button
                type="button"
                onClick={() => handleNavClick('/explore', 'Find Properties')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                  pathname === '/explore'
                    ? 'bg-zinc-800/90 text-white font-semibold shadow-xs border border-zinc-700/40'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70 font-medium'
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
                    ? 'bg-zinc-800/90 text-white font-semibold shadow-xs border border-zinc-700/40'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Heart size={16} strokeWidth={1.8} className="shrink-0" />
                  <span className="truncate">My Shortlist</span>
                </div>
                {shortlistCount > 0 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/50">
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
                    ? 'bg-zinc-800/90 text-white font-semibold shadow-xs border border-zinc-700/40'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70 font-medium'
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
                    ? 'bg-zinc-800/90 text-white font-semibold shadow-xs border border-zinc-700/40'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <LayoutDashboard size={16} strokeWidth={1.8} className="shrink-0" />
                <span className="truncate">Dashboard</span>
              </button>

              {/* My Properties */}
              <button
                type="button"
                onClick={() => handleNavClick('/profile?tab=listings', 'My Properties')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                  pathname === '/profile' && typeof window !== 'undefined' && window.location.search.includes('listings')
                    ? 'bg-zinc-800/90 text-white font-semibold shadow-xs border border-zinc-700/40'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Building2 size={16} strokeWidth={1.8} className="shrink-0" />
                  <span className="truncate">My Properties</span>
                </div>
                {myPropertiesCount > 0 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/50">
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
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70 font-medium transition-colors cursor-pointer text-left"
              >
                <PlusCircle size={16} strokeWidth={1.8} className="shrink-0 text-emerald-400" />
                <span className="truncate">Add Property</span>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Bottom Block: Help, Settings, and User Profile Dropdown */}
      <div className="space-y-2 pt-4 border-t border-zinc-800/70" ref={dropdownRef}>
        {/* Help & Support */}
        <a
          href="mailto:support@rentmatch.ai"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70 font-medium transition-colors cursor-pointer"
        >
          <HelpCircle size={16} strokeWidth={1.8} className="shrink-0" />
          <span className="truncate">Help &amp; Support</span>
        </a>

        {/* Settings */}
        <button
          type="button"
          onClick={() => handleNavClick('/profile?tab=personal', 'Settings')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/70 font-medium transition-colors cursor-pointer text-left"
        >
          <Settings size={16} strokeWidth={1.8} className="shrink-0" />
          <span className="truncate">Settings</span>
        </button>

        {/* Authenticated User Card with Profile Dropdown */}
        <div className="relative pt-2">
          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="px-3 py-2.5 border-b border-zinc-800/90 mb-1">
                <div className="font-bold text-xs text-white truncate">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {user?.email}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                  <ShieldCheck size={12} />
                  <span>{userRoleLabel}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  handleNavClick('/profile?tab=personal', 'Profile & Account');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer text-left"
              >
                <User size={14} className="text-zinc-400" />
                <span>Profile &amp; Account</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  handleNavClick('/profile?tab=security', 'Security');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer text-left"
              >
                <Settings size={14} className="text-zinc-400" />
                <span>Security &amp; Password</span>
              </button>

              <div className="h-px bg-zinc-800/80 my-1" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* User Button */}
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/70 border border-zinc-800/80 hover:border-zinc-700/80 transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* User Avatar with Green Active Status Indicator Dot */}
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700/80 text-white font-bold text-xs flex items-center justify-center overflow-hidden">
                  {user?.avatar && !user.avatar.includes('dicebear') ? (
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{userInitials}</span>
                  )}
                </div>
                {/* Active Status Indicator */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#09090b]" />
              </div>

              {/* Name & Role */}
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-200 truncate group-hover:text-white transition-colors">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-[10px] text-zinc-500 font-medium truncate">
                  {userRoleLabel}
                </div>
              </div>
            </div>

            <ChevronsUpDown
              size={14}
              className="text-zinc-500 group-hover:text-zinc-300 shrink-0 ml-1 transition-colors"
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
