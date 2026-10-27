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
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { USER_ROLES, type UserRole } from '../constants/initialData';
import AnimatedThemeToggler from './ui/animated-theme-toggler';
import { usePageCurtains } from './ui/page-curtains';
import {
  Navbar as AceternityNavbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  type NavItemConfig,
} from './ui/resizable-navbar';

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

  // Build desktop nav items
  const navItems: NavItemConfig[] = [
    {
      name: 'Discover',
      link: 'home',
      active: activePage === 'home',
      icon: <Home className="h-3.5 w-3.5" />,
    },
    {
      name: 'Explore Homes',
      link: 'results',
      active: activePage === 'results',
      icon: <Compass className="h-3.5 w-3.5" />,
    },
    {
      name: 'Shortlist',
      link: 'shortlist',
      active: activePage === 'shortlist',
      badge: savedCount > 0 ? savedCount : undefined,
      icon: <Heart className="h-3.5 w-3.5" />,
    },
  ];

  if (isAuthenticated && isLister) {
    navItems.push({
      name: 'My Listings',
      link: 'profile-listings',
      active: activePage === 'profile',
      icon: <Building2 className="h-3.5 w-3.5" />,
    });
  }

  const handleNavItemClick = (link: string) => {
    if (link === 'profile-listings') {
      handleNav('profile', 'listings');
    } else {
      handleNav(link);
    }
  };

  return (
    <AceternityNavbar>
      {/* Desktop Floating Resizable Navbar */}
      <NavBody>
        {/* Brand Logo */}
        <button
          type="button"
          className="brand flex items-center gap-2.5 text-left border-0 bg-transparent p-0 cursor-pointer group"
          onClick={() => handleNav('home')}
        >
          <div className="brand-mark flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <Home size={18} />
            <b>✦</b>
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
            rentmatch<span className="text-emerald-600 dark:text-emerald-400">ai</span>
          </span>
        </button>

        {/* Center Pill NavItems with animated hover indicator */}
        <NavItems items={navItems} onItemClick={handleNavItemClick} />

        {/* Right Header Section: Add Property, Theme Toggler, & Auth */}
        <div className="flex items-center gap-2.5">
          {isAuthenticated && isLister && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 transition-all shadow-sm"
              onClick={onOpenAddProperty}
            >
              <Plus size={13} /> Add Property
            </button>
          )}

          {(!isAuthenticated || !isLister) && (
            <button
              type="button"
              className="hidden xl:inline-flex text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 px-2 py-1 transition-colors"
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

          {/* Theme Toggler */}
          <AnimatedThemeToggler />

          {/* Authenticated User Menu vs Login Action Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-xs font-bold px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                onClick={() => handleNav('profile')}
              >
                <LayoutDashboard size={13} />
                <span>Dashboard</span>
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="user-profile-trigger flex items-center gap-2 border border-line rounded-full bg-white dark:bg-slate-900 dark:border-slate-800 px-2.5 py-1 transition-all hover:shadow-sm"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-expanded={userDropdownOpen}
                >
                  <div className="user-avatar-circle w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-700 to-teal-500 text-white font-bold text-[10px] flex items-center justify-center overflow-hidden">
                    {user!.avatar && !user!.avatar.includes('dicebear') ? (
                      <img src={user!.avatar} alt={user!.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{userInitials}</span>
                    )}
                  </div>
                  <div className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 max-w-[90px] truncate">
                      {user!.firstName}
                    </span>
                    <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      {isLister ? 'Lister' : 'Tenant'}
                    </span>
                  </div>
                  <ChevronDown
                    size={13}
                    className={`text-slate-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="user-dropdown-card">
                    <div className="dropdown-user-header">
                      <div className="dropdown-avatar-large">
                        <span>{userInitials}</span>
                      </div>
                      <div className="dropdown-meta">
                        <strong>{user!.firstName} {user!.lastName}</strong>
                        <span className="dropdown-email">{user!.email}</span>
                        <span className={`dropdown-role-chip ${isLister ? 'lister' : 'tenant'}`}>
                          {isLister ? 'Property Lister' : 'Verified Tenant'}
                        </span>
                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    <button
                      className="dropdown-item"
                      onClick={() => handleNav('profile', 'personal')}
                    >
                      <User size={15} /> My Profile &amp; Preferences
                    </button>

                    {isLister ? (
                      <>
                        <button
                          className="dropdown-item"
                          onClick={() => handleNav('profile', 'listings')}
                        >
                          <Building2 size={15} /> My Properties Dashboard
                        </button>
                        <button
                          className="dropdown-item highlight"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenAddProperty();
                          }}
                        >
                          <Plus size={15} /> + Add New Property
                        </button>
                      </>
                    ) : (
                      <button
                        className="dropdown-item"
                        onClick={() => handleNav('shortlist')}
                      >
                        <Heart size={15} /> My Shortlisted Homes ({savedCount})
                      </button>
                    )}

                    <div className="dropdown-divider" />

                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="auth-buttons-group flex items-center">
              <button
                type="button"
                className="btn-create-account text-xs font-bold px-4 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                onClick={() => handleNav('login')}
              >
                <LogIn size={13} />
                <span>Login</span>
              </button>
            </div>
          )}
        </div>
      </NavBody>

      {/* Mobile Drawer Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <button
            type="button"
            className="brand flex items-center gap-2 border-0 bg-transparent p-0 cursor-pointer"
            onClick={() => handleNav('home')}
          >
            <div className="brand-mark">
              <Home size={17} />
              <b>✦</b>
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
              rentmatch<span className="text-emerald-600 dark:text-emerald-400">ai</span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <AnimatedThemeToggler />
            <MobileNavToggle
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          <div className="flex flex-col gap-1 w-full">
            <button
              className={`flex items-center justify-between w-full p-2.5 rounded-xl text-sm font-semibold text-left transition-colors ${
                activePage === 'home'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
              onClick={() => handleNav('home')}
            >
              <span className="flex items-center gap-2.5">
                <Home size={16} /> Discover
              </span>
            </button>

            <button
              className={`flex items-center justify-between w-full p-2.5 rounded-xl text-sm font-semibold text-left transition-colors ${
                activePage === 'results'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
              onClick={() => handleNav('results')}
            >
              <span className="flex items-center gap-2.5">
                <Compass size={16} /> Explore Homes
              </span>
            </button>

            <button
              className={`flex items-center justify-between w-full p-2.5 rounded-xl text-sm font-semibold text-left transition-colors ${
                activePage === 'shortlist'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
              onClick={() => handleNav('shortlist')}
            >
              <span className="flex items-center gap-2.5">
                <Heart size={16} /> My Shortlist
              </span>
              {savedCount > 0 && (
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/80 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-200">
                  {savedCount}
                </span>
              )}
            </button>

            {isAuthenticated && isLister && (
              <>
                <button
                  className="flex items-center gap-2.5 w-full p-2.5 rounded-xl text-sm font-semibold text-left text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={() => handleNav('profile', 'listings')}
                >
                  <Building2 size={16} /> My Listings
                </button>
                <button
                  className="flex items-center justify-center gap-2 w-full p-2.5 mt-1 rounded-xl text-sm font-bold text-emerald-800 bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-100"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAddProperty();
                  }}
                >
                  <Plus size={16} /> Add New Property
                </button>
              </>
            )}

            {(!isAuthenticated || !isLister) && (
              <button
                className="flex items-center gap-2.5 w-full p-2.5 rounded-xl text-sm font-semibold text-emerald-700 dark:text-emerald-400 text-left hover:bg-emerald-50/50"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (!isAuthenticated) {
                    onOpenAuth('register', USER_ROLES.PROPERTY_LISTER);
                  } else {
                    handleNav('profile');
                  }
                }}
              >
                <Sparkles size={16} /> List a Property as Landlord
              </button>
            )}
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 w-full" />

          {/* Mobile Auth Section */}
          {isAuthenticated ? (
            <div className="flex flex-col gap-2 w-full pt-1">
              <button
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm cursor-pointer"
                onClick={() => handleNav('profile')}
              >
                <LayoutDashboard size={15} /> Dashboard
              </button>
              <button
                className="flex items-center gap-2 w-full p-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                onClick={handleLogout}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full pt-1">
              <button
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm cursor-pointer"
                onClick={() => handleNav('login')}
              >
                <LogIn size={15} /> Login
              </button>
              <button
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                onClick={() => handleNav('signup')}
              >
                <UserPlus size={15} /> Create Account
              </button>
            </div>
          )}
        </MobileNavMenu>
      </MobileNav>
    </AceternityNavbar>
  );
}
