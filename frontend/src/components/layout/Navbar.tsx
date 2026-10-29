'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Heart,
  Plus,
  User,
  LogOut,
  LogIn,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useProperty } from '@/src/context/PropertyContext';
import { USER_ROLES, type UserRole } from '@/src/constants/initialData';
import { ToggleTheme } from '../lightswind/toggle-theme';
import { usePageCurtains } from '../ui/page-curtains';
import { useToast } from '../ui/notifications';
import { RainbowButton } from '../ui/rainbow-button';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  page?: string;
  onNavigate?: (page: string, extraTab?: string | null) => void;
  savedCount?: number;
  onOpenAddProperty?: () => void;
  onOpenAuth?: (tab?: string, role?: string) => void;
}

export default function Navbar({
  onNavigate,
  savedCount: propSavedCount,
  onOpenAddProperty: propOpenAddProperty,
  onOpenAuth: propOpenAuth,
}: NavbarProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { navigateWithCurtains } = usePageCurtains();
  const { notify } = useToast();

  const { user, isAuthenticated, isLister, logout, openAuthModal } = useAuth();
  const propertyContext = useProperty();

  const savedCount = propSavedCount !== undefined ? propSavedCount : propertyContext.saved.length;
  const onOpenAddProperty = propOpenAddProperty || propertyContext.openAddProperty;
  const onOpenAuth = propOpenAuth || ((tab, role) => openAuthModal(tab, role as UserRole));

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll detection to adapt navbar backdrop over hero vs page content
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (targetPage: string, extraTab: string | null = null) => {
    if (onNavigate) {
      onNavigate(targetPage, extraTab);
    } else {
      if (targetPage === 'home') {
        navigateWithCurtains('/', 'Lander');
      } else if (targetPage === 'dashboard') {
        const dest = isLister ? '/dashboard/landlord' : '/dashboard/tenant';
        navigateWithCurtains(dest, 'Dashboard');
      } else if (targetPage === 'results') {
        const dest = isAuthenticated ? '/dashboard/explore' : '/explore';
        navigateWithCurtains(dest, 'Find Properties');
      } else if (targetPage === 'shortlist') {
        const dest = isAuthenticated ? '/dashboard/shortlist' : '/shortlist';
        navigateWithCurtains(dest, 'My Shortlist');
      } else if (targetPage === 'profile') {
        navigateWithCurtains(extraTab ? `/profile?tab=${extraTab}` : '/profile', 'Dashboard & Profile');
      } else if (targetPage === 'login') {
        navigateWithCurtains('/login', 'Login');
      } else if (targetPage === 'signup') {
        navigateWithCurtains('/signup', 'Create Account');
      }
    }
    setUserDropdownOpen(false);
  };

  const handleLogout = () => {
    const firstName = user?.firstName;
    logout();
    setUserDropdownOpen(false);
    notify.info(
      firstName
        ? `You have been signed out. See you soon, ${firstName}!`
        : 'You have been signed out successfully.',
      'Signed Out'
    );
    handleNav('home');
  };

  const userInitials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-xs'
          : 'border-b border-zinc-200/30 dark:border-zinc-800/30 bg-white/20 dark:bg-black/25 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <button
          type="button"
          className="text-left border-0 bg-transparent p-0 cursor-pointer group flex items-center focus:outline-none"
          onClick={() => handleNav('home')}
        >
          <BrandLogo size="md" />
        </button>

        {/* Right Action Cluster: Two buttons only (Theme & Capsuled Login) */}
        <div className="flex items-center gap-3">
          {/* Black & White Theme Toggle */}
          <ToggleTheme />

          {/* Authenticated Dashboard / User Profile vs Capsuled RainbowButton Login */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-1.5 pr-2.5 py-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer shadow-xs active:scale-95"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
              >
                <div className="w-7 h-7 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-[10px] flex items-center justify-center overflow-hidden shrink-0">
                  {user!.avatar && !user!.avatar.includes('dicebear') ? (
                    <img src={user!.avatar} alt={user!.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{userInitials}</span>
                  )}
                </div>
                <span className="hidden sm:inline-block max-w-[100px] truncate text-xs font-semibold">
                  {user!.firstName}
                </span>
                <ChevronDown
                  className={`h-3 w-3 text-zinc-400 transition-transform duration-200 ${
                    userDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* User Dropdown Card */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl p-2 shadow-xl shadow-zinc-950/10 dark:shadow-black/50 z-50"
                  >
                    <div className="px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800/80 mb-1">
                      <div className="font-bold text-xs text-zinc-950 dark:text-zinc-100">
                        {user!.firstName} {user!.lastName}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {user!.email}
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">
                        <ShieldCheck className="h-3 w-3" />
                        <span>{isLister ? 'Verified Landlord' : 'Verified Renter'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl text-left transition-colors cursor-pointer"
                      onClick={() => handleNav('profile', 'personal')}
                    >
                      <User className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Profile &amp; Account</span>
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl text-left transition-colors cursor-pointer"
                      onClick={() => handleNav('dashboard')}
                    >
                      <LayoutDashboard className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Dashboard</span>
                    </button>

                    {isLister ? (
                      <>
                        <button
                          type="button"
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl text-left transition-colors cursor-pointer"
                          onClick={() => handleNav('profile', 'listings')}
                        >
                          <Building2 className="h-3.5 w-3.5 text-zinc-500" />
                          <span>My Listings &amp; Enquiries</span>
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-zinc-950 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl text-left transition-colors cursor-pointer"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenAddProperty();
                          }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>+ Add New Listing</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl text-left transition-colors cursor-pointer"
                        onClick={() => handleNav('shortlist')}
                      >
                        <Heart className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Saved Shortlist ({savedCount})</span>
                      </button>
                    )}

                    <div className="h-px bg-zinc-100 dark:border-zinc-800/80 my-1" />

                    <button
                      type="button"
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl text-left transition-colors cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <RainbowButton
              type="button"
              className="rounded-full px-5 py-2 text-xs"
              onClick={() => handleNav('login')}
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Login</span>
            </RainbowButton>
          )}
        </div>
      </div>
    </header>
  );
}
