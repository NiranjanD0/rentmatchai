'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Home, Building2, Plus, User, Heart, LogOut, LogIn, UserPlus, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../constants/initialData';

interface NavbarProps {
  page: string;
  onNavigate: (page: string, extraTab?: string | null) => void;
  savedCount?: number;
  onOpenAddProperty: () => void;
  onOpenAuth: (tab?: string, role?: string) => void;
}

export default function Navbar({
  page,
  onNavigate,
  savedCount = 0,
  onOpenAddProperty,
  onOpenAuth
}: NavbarProps) {
  const { user, isAuthenticated, isLister, logout } = useAuth();
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

  const handleNav = (targetPage: string, extraTab: string | null = null) => {
    onNavigate(targetPage, extraTab);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    onNavigate('home');
  };

  const userInitials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : 'G';

  return (
    <header className="topbar">
      {/* Brand Logo */}
      <button className="brand" onClick={() => handleNav('home')}>
        <span className="brand-mark">
          <Home size={19} />
          <b>✦</b>
        </span>
        <span>
          rentmatch<span className="ai">ai</span>
        </span>
      </button>

      {/* Main Navigation (Desktop & Mobile) */}
      <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
        <button
          className={page === 'home' ? 'active' : ''}
          onClick={() => handleNav('home')}
        >
          Discover
        </button>

        <button
          className={page === 'results' ? 'active' : ''}
          onClick={() => handleNav('results')}
        >
          Explore Homes
        </button>

        <button
          className={page === 'shortlist' ? 'active' : ''}
          onClick={() => handleNav('shortlist')}
        >
          My Shortlist
          {savedCount > 0 && <small>{savedCount}</small>}
        </button>

        {/* Lister-Specific Direct Links in Navigation */}
        {isAuthenticated && isLister && (
          <>
            <button
              className={page === 'profile' ? 'active' : ''}
              onClick={() => handleNav('profile', 'listings')}
            >
              <Building2 size={14} /> My Listings
            </button>
            <button
              className="nav-btn-highlight"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAddProperty();
              }}
            >
              <Plus size={14} /> Add Property
            </button>
          </>
        )}

        {/* Guest prompt to list property */}
        {(!isAuthenticated || !isLister) && (
          <button
            className="nav-link-subtle"
            onClick={() => {
              setMobileMenuOpen(false);
              if (!isAuthenticated) {
                onOpenAuth('register', USER_ROLES.PROPERTY_LISTER);
              } else {
                handleNav('profile');
              }
            }}
          >
            List a Property
          </button>
        )}

        {/* Mobile-only auth buttons */}
        <div className="mobile-auth-section">
          {isAuthenticated ? (
            <div className="mobile-user-info">
              <div className="mobile-user-header">
                <span className="avatar-chip">{userInitials}</span>
                <div>
                  <strong>{user!.firstName} {user!.lastName}</strong>
                  <span className="user-role-tag">{user!.role}</span>
                </div>
              </div>
              <button className="btn-mobile-nav" onClick={() => handleNav('profile')}>
                <User size={15} /> My Profile &amp; Account
              </button>
              <button className="btn-mobile-nav logout" onClick={handleLogout}>
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          ) : (
            <div className="mobile-guest-buttons">
              <button className="primary full" onClick={() => { setMobileMenuOpen(false); onOpenAuth('login'); }}>
                <LogIn size={15} /> Sign In
              </button>
              <button className="secondary full" onClick={() => { setMobileMenuOpen(false); onOpenAuth('register'); }}>
                <UserPlus size={15} /> Create Account
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Right Header Section: Authentication & Profile Menu */}
      <div className="header-actions">
        {isAuthenticated ? (
          <div className="user-menu-wrapper" ref={dropdownRef}>
            <button
              className="user-profile-trigger"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              aria-expanded={userDropdownOpen}
            >
              <div className="user-avatar-circle">
                {user!.avatar && !user!.avatar.includes('dicebear') ? (
                  <img src={user!.avatar} alt={user!.firstName} />
                ) : (
                  <span>{userInitials}</span>
                )}
              </div>
              <div className="user-info-text">
                <span className="user-name">{user!.firstName}</span>
                <span className={`role-badge ${isLister ? 'badge-lister' : 'badge-tenant'}`}>
                  {isLister ? 'Lister' : 'Tenant'}
                </span>
              </div>
              <ChevronDown size={14} className={`dropdown-chevron ${userDropdownOpen ? 'rotated' : ''}`} />
            </button>

            {/* Dropdown Menu */}
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
        ) : (
          <div className="auth-buttons-group">
            <button
              className="btn-text-signin"
              onClick={() => onOpenAuth('login')}
            >
              Sign In
            </button>
            <button
              className="btn-create-account"
              onClick={() => onOpenAuth('register')}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
