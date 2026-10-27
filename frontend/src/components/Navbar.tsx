'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Building2,
  Plus,
  User,
  Heart,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
  Compass,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { USER_ROLES, type UserRole } from '../constants/initialData';
import { ToggleTheme } from './lightswind/toggle-theme';
import { usePageCurtains } from './ui/page-curtains';

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

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    handleNav('home');
  };

  const userInitials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'G';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          type="button"
          className="flex items-center gap-2.5 text-left border-0 bg-transparent p-0 cursor-pointer group"
          onClick={() => handleNav('home')}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold transition-transform duration-200 group-hover:scale-105 shadow-2xs">
            <Home className="h-4 w-4" />
          </div>
          <span className="font-bold text-lg tracking-tight text-zinc-950 dark:text-white">
            rentmatch<span className="text-zinc-500 dark:text-zinc-400 font-semibold">ai</span>
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activePage === 'home'
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
            }`}
          >
            Discover
          </button>
          <button
            type="button"
            onClick={() => handleNav('results')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activePage === 'results'
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
            }`}
          >
            Explore Homes
          </button>
          <button
            type="button"
            onClick={() => handleNav('shortlist')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activePage === 'shortlist'
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
            }`}
          >
            <span>Shortlist</span>
            {savedCount > 0 && (
              <span className="rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-bold px-1.5 py-0.2">
                {savedCount}
              </span>
            )}
          </button>

          {isAuthenticated && isLister && (
            <button
              type="button"
              onClick={() => handleNav('profile', 'listings')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activePage === 'profile'
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              My Listings
            </button>
          )}
        </nav>

        {/* Right Section: Add Property, ToggleTheme, Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated && isLister && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 transition-colors shadow-2xs cursor-pointer"
              onClick={onOpenAddProperty}
            >
              <Plus className="h-3.5 w-3.5" /> Add Property
            </button>
          )}

          {(!isAuthenticated || !isLister) && (
            <button
              type="button"
              className="hidden lg:inline-flex text-xs font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white px-2 py-1 transition-colors cursor-pointer"
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenAuth('register', USER_ROLES.PROPERTY_LISTER);
                } else {
                  handleNav('profile');
                }
              }}
            >
              List Property
            </button>
          )}

          {/* Lightswind Theme Toggle */}
          <ToggleTheme />

          {/* Auth Button or User Menu */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="hidden sm:flex text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer items-center gap-1.5"
                onClick={() => handleNav('profile')}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-full bg-white dark:bg-zinc-900 px-2 py-1 transition-colors hover:border-zinc-400 dark:hover:border-zinc-700 cursor-pointer"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-[10px] flex items-center justify-center overflow-hidden">
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
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-xl z-50">
                    <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                      <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                        {user!.firstName} {user!.lastName}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                        {user!.email}
                      </div>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                        {isLister ? 'Property Lister' : 'Verified Tenant'}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-left transition-colors cursor-pointer"
                      onClick={() => handleNav('profile', 'personal')}
                    >
                      <User className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Profile &amp; Preferences</span>
                    </button>

                    {isLister ? (
                      <>
                        <button
                          type="button"
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-left transition-colors cursor-pointer"
                          onClick={() => handleNav('profile', 'listings')}
                        >
                          <Building2 className="h-3.5 w-3.5 text-zinc-500" />
                          <span>My Properties</span>
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg text-left transition-colors cursor-pointer"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenAddProperty();
                          }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>+ Add Property</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-left transition-colors cursor-pointer"
                        onClick={() => handleNav('shortlist')}
                      >
                        <Heart className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Shortlisted ({savedCount})</span>
                      </button>
                    )}

                    <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />

                    <button
                      type="button"
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-left transition-colors cursor-pointer"
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
            <button
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 transition-colors shadow-2xs cursor-pointer"
              onClick={() => handleNav('login')}
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-4 pt-3 pb-6 space-y-2">
          <button
            type="button"
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-left ${
              activePage === 'home'
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
            onClick={() => handleNav('home')}
          >
            <span className="flex items-center gap-2">
              <Home className="h-4 w-4" /> Discover
            </span>
          </button>

          <button
            type="button"
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-left ${
              activePage === 'results'
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
            onClick={() => handleNav('results')}
          >
            <span className="flex items-center gap-2">
              <Compass className="h-4 w-4" /> Explore Homes
            </span>
          </button>

          <button
            type="button"
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-left ${
              activePage === 'shortlist'
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
            onClick={() => handleNav('shortlist')}
          >
            <span className="flex items-center gap-2">
              <Heart className="h-4 w-4" /> My Shortlist
            </span>
            {savedCount > 0 && (
              <span className="rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold px-2 py-0.5">
                {savedCount}
              </span>
            )}
          </button>

          {isAuthenticated && isLister && (
            <>
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-left"
                onClick={() => handleNav('profile', 'listings')}
              >
                <Building2 className="h-4 w-4" /> My Listings
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAddProperty();
                }}
              >
                <Plus className="h-4 w-4" /> Add New Property
              </button>
            </>
          )}

          {(!isAuthenticated || !isLister) && (
            <button
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-left"
              onClick={() => {
                setMobileMenuOpen(false);
                if (!isAuthenticated) {
                  onOpenAuth('register', USER_ROLES.PROPERTY_LISTER);
                } else {
                  handleNav('profile');
                }
              }}
            >
              <Building2 className="h-4 w-4" /> List Property as Landlord
            </button>
          )}

          <div className="h-px bg-zinc-200 dark:border-zinc-800 my-2" />

          {isAuthenticated ? (
            <div className="space-y-1.5 pt-1">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                onClick={() => handleNav('profile')}
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold bg-zinc-950 dark:bg-white text-white dark:text-zinc-950"
                onClick={() => handleNav('login')}
              >
                <LogIn className="h-4 w-4" /> Login
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                onClick={() => handleNav('signup')}
              >
                <UserPlus className="h-4 w-4" /> Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
