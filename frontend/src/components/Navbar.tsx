'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Building2,
  Heart,
  KeyRound,
  Plus,
  User,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { USER_ROLES, type UserRole } from '../constants/initialData';
import { ToggleTheme } from './lightswind/toggle-theme';
import { usePageCurtains } from './ui/page-curtains';
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
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    handleNav('home');
  };

  const userInitials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  const navLinks = [
    { id: 'home', label: 'Discover', icon: Compass, href: '/' },
    { id: 'results', label: 'Explore Homes', icon: Building2, href: '/explore' },
    { id: 'shortlist', label: 'Shortlist', icon: Heart, href: '/shortlist', badge: savedCount > 0 ? savedCount : null },
  ];

  if (isAuthenticated && isLister) {
    navLinks.push({ id: 'profile', label: 'My Listings', icon: KeyRound, href: '/profile?tab=listings', badge: null });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          type="button"
          className="text-left border-0 bg-transparent p-0 cursor-pointer group flex items-center"
          onClick={() => handleNav('home')}
        >
          <BrandLogo size="md" />
        </button>

        {/* Center Desktop Navigation Links with Icons */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-300 bg-white dark:bg-zinc-800 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
                <span>{item.label}</span>
                {item.badge !== null && (
                  <span className="rounded-full bg-emerald-600 text-white dark:bg-emerald-500 dark:text-zinc-950 text-[10px] font-bold px-1.5 py-0.2">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Prominent List Property Action Button */}
          <button
            type="button"
            onClick={handleListPropertyClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200/90 border border-emerald-300/60 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80 transition-all shadow-xs hover:shadow-sm cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>List Property</span>
          </button>

          {/* Lightswind Theme Toggle */}
          <ToggleTheme />

          {/* Authenticated Dashboard / User Profile vs Login Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="hidden sm:flex text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer items-center gap-1.5"
                onClick={() => handleNav('profile')}
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>Dashboard</span>
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-full bg-white dark:bg-zinc-900 p-1 pr-2 transition-all hover:border-emerald-500/50 cursor-pointer shadow-xs"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-[11px] flex items-center justify-center overflow-hidden shadow-xs">
                    {user!.avatar && !user!.avatar.includes('dicebear') ? (
                      <img src={user!.avatar} alt={user!.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{userInitials}</span>
                    )}
                  </div>
                  <ChevronDown
                    className={`h-3 w-3 text-zinc-500 dark:text-zinc-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* User Dropdown Card */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                      <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                        {user!.firstName} {user!.lastName}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {user!.email}
                      </div>
                      <span className="inline-block mt-1.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
                        {isLister ? 'Property Lister' : 'Verified Tenant'}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl text-left transition-colors cursor-pointer"
                      onClick={() => handleNav('profile', 'personal')}
                    >
                      <User className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Profile &amp; Preferences</span>
                    </button>

                    {isLister ? (
                      <>
                        <button
                          type="button"
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl text-left transition-colors cursor-pointer"
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
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl text-left transition-colors cursor-pointer"
                        onClick={() => handleNav('shortlist')}
                      >
                        <Heart className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Saved Shortlist ({savedCount})</span>
                      </button>
                    )}

                    <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />

                    <button
                      type="button"
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl text-left transition-colors cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
                onClick={() => handleNav('login')}
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Login</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
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
            className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/98 dark:bg-zinc-950/98 px-4 pt-3 pb-6 space-y-1.5 backdrop-blur-md overflow-hidden"
          >
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                  onClick={() => handleNav(item.id)}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== null && (
                    <span className="rounded-full bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              type="button"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100 dark:bg-emerald-950/80 dark:text-emerald-200 mt-2"
              onClick={handleListPropertyClick}
            >
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>List a Property (Zero Commission)</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-300">Free</span>
            </button>

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
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20"
                  onClick={() => handleNav('login')}
                >
                  <LogIn className="h-4 w-4" /> Login
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
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
