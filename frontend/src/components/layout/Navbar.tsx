'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Building2,
  Heart,
  Plus,
  User,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
  LayoutDashboard,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useProperty } from '@/src/context/PropertyContext';
import { USER_ROLES, type UserRole } from '@/src/constants/initialData';
import { ToggleTheme } from '../lightswind/toggle-theme';
import { usePageCurtains } from '../ui/page-curtains';
import { useToast } from '../ui/notifications';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  page?: string;
  onNavigate?: (page: string, extraTab?: string | null) => void;
  savedCount?: number;
  onOpenAddProperty?: () => void;
  onOpenAuth?: (tab?: string, role?: string) => void;
}

export default function Navbar({
  page: propPage,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Determine active route
  const activePage = propPage || (
    pathname === '/' ? 'home'
    : pathname.startsWith('/explore') || pathname.startsWith('/results') ? 'results'
    : pathname.startsWith('/shortlist') ? 'shortlist'
    : pathname.startsWith('/profile') ? 'profile'
    : ''
  );

  const handleNav = (targetPage: string, extraTab: string | null = null) => {
    if (onNavigate) {
      onNavigate(targetPage, extraTab);
    } else {
      if (targetPage === 'home') {
        navigateWithCurtains('/', 'Discover');
      } else if (targetPage === 'results') {
        navigateWithCurtains('/explore', 'Explore Homes');
      } else if (targetPage === 'shortlist') {
        navigateWithCurtains('/shortlist', 'My Shortlist');
      } else if (targetPage === 'profile') {
        navigateWithCurtains(extraTab ? `/profile?tab=${extraTab}` : '/profile', 'Dashboard & Profile');
      } else if (targetPage === 'login') {
        navigateWithCurtains('/login', 'Login');
      } else if (targetPage === 'signup') {
        navigateWithCurtains('/signup', 'Create Account');
      }
    }
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleListPropertyClick = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    if (isAuthenticated && isLister) {
      onOpenAddProperty();
    } else if (!isAuthenticated) {
      onOpenAuth('register', USER_ROLES.PROPERTY_LISTER);
      navigateWithCurtains('/signup', 'Create Landlord Account');
    } else {
      handleNav('profile', 'listings');
    }
  };

  const handleLogout = () => {
    const firstName = user?.firstName;
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
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

  // Unified central navigation items (Discover, Explore Homes, Shortlist)
  const navItems = [
    { id: 'home', label: 'Discover', icon: Compass, onClick: () => handleNav('home') },
    { id: 'results', label: 'Explore Homes', icon: Building2, onClick: () => handleNav('results') },
    {
      id: 'shortlist',
      label: 'Shortlist',
      icon: Heart,
      badge: savedCount > 0 ? savedCount : null,
      onClick: () => handleNav('shortlist'),
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-black/70 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          type="button"
          className="text-left border-0 bg-transparent p-0 cursor-pointer group flex items-center focus:outline-none"
          onClick={() => handleNav('home')}
        >
          <BrandLogo size="md" />
        </button>

        {/* Center Floating Dock with Discover, Explore, Shortlist AND List Property */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'text-zinc-950 dark:text-white font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 font-medium'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-full shadow-xs border border-zinc-200/60 dark:border-zinc-700/60 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <Icon
                  className={`h-3.5 w-3.5 ${
                    isActive
                      ? 'text-zinc-950 dark:text-white'
                      : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                />
                <span>{item.label}</span>
                {item.badge !== null && item.badge !== undefined && (
                  <span className="rounded-full bg-emerald-600 text-white dark:bg-emerald-500 dark:text-zinc-950 text-[10px] font-bold px-1.5 py-0.2 leading-tight">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2.5">
          {/* Black & White Theme Toggle */}
          <ToggleTheme />

          {/* Authenticated Dashboard / User Profile vs Minimal Modern Login Button */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 pl-1.5 pr-2.5 py-1 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer shadow-xs active:scale-95"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
              >
                <div className="w-6 h-6 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold text-[10px] flex items-center justify-center overflow-hidden shrink-0">
                  {user!.avatar && !user!.avatar.includes('dicebear') ? (
                    <img src={user!.avatar} alt={user!.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{userInitials}</span>
                  )}
                </div>
                <span className="hidden sm:inline-block max-w-[100px] truncate">
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
                      <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                        {user!.firstName} {user!.lastName}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {user!.email}
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
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
                      onClick={() => handleNav('profile')}
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
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl text-left transition-colors cursor-pointer"
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

                    <div className="h-px bg-zinc-100 dark:bg-zinc-800/80 my-1" />

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
            <button
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 transition-all shadow-xs active:scale-95 cursor-pointer"
              onClick={() => handleNav('login')}
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 px-4 pt-3 pb-6 space-y-1.5 backdrop-blur-xl overflow-hidden"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                  onClick={item.onClick}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="rounded-full bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2" />

            {isAuthenticated ? (
              <div className="space-y-1.5 pt-1">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  onClick={() => handleNav('profile')}
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                  onClick={() => handleNav('login')}
                >
                  <LogIn className="h-4 w-4" /> Login
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                  onClick={() => handleNav('signup')}
                >
                  <UserPlus className="h-4 w-4" /> Create Account
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
