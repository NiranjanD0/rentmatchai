'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { useProperty } from '@/src/context/PropertyContext';
import {
  User,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Lock,
  Sparkles,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { usePageCurtains } from '@/src/components/ui/page-curtains';
import { BlurFade } from '@/src/components/ui/blur-fade';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { navigateWithCurtains } = usePageCurtains();
  const initialTab = searchParams.get('tab');

  const { user, updateProfile, changePassword, isLister, isTenant } = useAuth();
  const { showToast } = useProperty();

  const [activeTab, setActiveTab] = useState<'personal' | 'security'>(
    initialTab === 'security' ? 'security' : 'personal'
  );

  // Profile Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [budgetMax, setBudgetMax] = useState('25000');
  const [preferredBhk, setPreferredBhk] = useState('2');
  const [targetLocation, setTargetLocation] = useState('Gandhinagar');

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'listings') {
      navigateWithCurtains('/dashboard/properties', 'My Properties');
    } else if (tabParam === 'security') {
      setActiveTab('security');
    } else if (tabParam === 'personal' || tabParam === 'preferences') {
      setActiveTab('personal');
    }
  }, [searchParams, navigateWithCurtains]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName && user.lastName !== 'User' ? user.lastName : '');
      setPhone(user.phone || '');
      setCompany(user.company || '');
      if (user.preferences) {
        setBudgetMax(String(user.preferences.budgetMax || 25000));
        setPreferredBhk(String(user.preferences.preferredBhk || '2'));
        setTargetLocation(user.preferences.targetLocation || 'Gandhinagar');
      }
    }
  }, [user]);

  if (!user) {
    return (
      <div className="w-full max-w-xl mx-auto py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-400">
          <User size={24} />
        </div>
        <h2 className="text-xl font-black text-zinc-950 dark:text-white tracking-tight mb-2">
          Sign In Required
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          Please log in to manage your personal profile and account credentials.
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold px-6 py-2.5 text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
          onClick={() => navigateWithCurtains('/login', 'Login')}
        >
          Login to Continue
        </button>
      </div>
    );
  }

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateError('');
    setUpdateSuccess(false);

    try {
      await updateProfile({
        firstName,
        lastName,
        phone,
        company,
        preferences: isTenant
          ? {
              budgetMax: Number(budgetMax),
              preferredBhk,
              targetLocation,
            }
          : null,
      });

      setUpdateSuccess(true);
      showToast('Profile updated successfully!', 'success');
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = (err as Error).message || 'Failed to update profile details.';
      setUpdateError(msg);
      showToast(msg, 'error', 'Profile Update Error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      const msg = 'New password must be at least 8 characters.';
      setPasswordError(msg);
      showToast(msg, 'error', 'Password Too Short');
      return;
    }

    if (newPassword !== confirmPassword) {
      const msg = 'New passwords do not match.';
      setPasswordError(msg);
      showToast(msg, 'error', 'Password Mismatch');
      return;
    }

    setPasswordUpdating(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password changed successfully!', 'success');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = (err as Error).message || 'Failed to update password.';
      setPasswordError(msg);
      showToast(msg, 'error', 'Password Change Failed');
    } finally {
      setPasswordUpdating(false);
    }
  };

  const safeLastName = user?.lastName && user.lastName !== 'User' ? user.lastName : '';
  const fullName = user ? [user.firstName, safeLastName].filter(Boolean).join(' ') : 'User';
  const userInitials =
    `${user?.firstName?.[0] || ''}${safeLastName?.[0] || ''}`.toUpperCase() ||
    user?.firstName?.[0]?.toUpperCase() ||
    'U';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 select-none">
      {/* 1. Profile Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-black text-xl sm:text-2xl shadow-md shrink-0">
              {user.avatar && !user.avatar.includes('dicebear') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span>{userInitials}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight">
                  {fullName}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-2xs">
                  {isLister ? (
                    <>
                      <Building2 size={12} />
                      <span>Landlord</span>
                    </>
                  ) : (
                    <>
                      <User size={12} />
                      <span>Tenant</span>
                    </>
                  )}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck size={12} /> Verified Account
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={13} className="text-zinc-400" /> {user.email}
                </span>
                {user.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone size={13} className="text-zinc-400" /> {user.phone}
                  </span>
                )}
                {user.company && (
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 size={13} className="text-zinc-400" /> {user.company}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action for Lister */}
          {isLister && (
            <button
              type="button"
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold tracking-tight shadow-md transition-all active:scale-95 cursor-pointer self-start md:self-auto shrink-0"
              onClick={() => navigateWithCurtains('/dashboard/properties', 'My Properties')}
            >
              <Building2 size={14} />
              <span>Manage Properties</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Apple Segmented Control Tabs */}
      <div className="inline-flex p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 max-w-full overflow-x-auto">
        <button
          type="button"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
            activeTab === 'personal'
              ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
          }`}
          onClick={() => setActiveTab('personal')}
        >
          <User size={14} />
          <span>Profile Details &amp; Preferences</span>
        </button>

        <button
          type="button"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
            activeTab === 'security'
              ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
          }`}
          onClick={() => setActiveTab('security')}
        >
          <Lock size={14} />
          <span>Security &amp; Password</span>
        </button>
      </div>

      <BlurFade key={activeTab} delay={0.05} inView>
        {/* TAB 1: Personal Details & Preferences */}
        {activeTab === 'personal' && (
          <div className="max-w-3xl">
            <div className="p-6 sm:p-9 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/90 dark:bg-[#211E1B] shadow-xs">
              <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-850">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
                  Personal Information
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Manage your account name, contact telephone, and role credentials.
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="pf-fname" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      First Name
                    </label>
                    <input
                      id="pf-fname"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="pf-lname" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      Last Name
                    </label>
                    <input
                      id="pf-lname"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="pf-email" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      Registered Email (Read-only)
                    </label>
                    <input
                      id="pf-email"
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/60 text-xs sm:text-sm text-zinc-500 dark:text-zinc-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="pf-phone" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      Contact Phone Number
                    </label>
                    <input
                      id="pf-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                    />
                  </div>
                </div>

                {isLister && (
                  <div className="space-y-1.5">
                    <label htmlFor="pf-company" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      Real Estate Agency / Business Name
                    </label>
                    <input
                      id="pf-company"
                      type="text"
                      placeholder="e.g. Apex Realty Gandhinagar"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                    />
                  </div>
                )}

                {isTenant && (
                  <div className="p-5 rounded-lg border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-zinc-900/50 space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-zinc-950 dark:text-white" />
                      <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                        Rental Search Preferences
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Helps RentMatch AI automatically rank homes tailored to your lifestyle.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <label htmlFor="pf-budget" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                          Max Budget (₹/mo)
                        </label>
                        <input
                          id="pf-budget"
                          type="number"
                          value={budgetMax}
                          onChange={(e) => setBudgetMax(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="pf-bhk" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                          Preferred Bedrooms
                        </label>
                        <select
                          id="pf-bhk"
                          value={preferredBhk}
                          onChange={(e) => setPreferredBhk(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                        >
                          <option value="1">1 BHK</option>
                          <option value="2">2 BHK</option>
                          <option value="3">3 BHK</option>
                          <option value="Any">Any</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="pf-loc" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                          Target Location
                        </label>
                        <input
                          id="pf-loc"
                          type="text"
                          value={targetLocation}
                          onChange={(e) => setTargetLocation(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-lg bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold tracking-tight shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    disabled={isUpdating}
                  >
                    <span>{isUpdating ? 'Saving Changes...' : 'Save Profile Details'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: Security & Password */}
        {activeTab === 'security' && (
          <div className="max-w-xl">
            <div className="p-6 sm:p-9 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#211E1B] shadow-xs">
              <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-850">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight flex items-center gap-2">
                  <KeyRound size={20} className="text-zinc-500" />
                  <span>Change Password</span>
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Update your account password using secure hashing algorithms.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="old-pass" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Current Password
                  </label>
                  <input
                    id="old-pass"
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="new-pass" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      New Password
                    </label>
                    <input
                      id="new-pass"
                      type="password"
                      required
                      placeholder="Min. 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="confirm-pass" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      Confirm New Password
                    </label>
                    <input
                      id="confirm-pass"
                      type="password"
                      required
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-lg bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold tracking-tight shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    disabled={passwordUpdating}
                  >
                    <span>{passwordUpdating ? 'Updating Password...' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </BlurFade>
    </div>
  );
}

export default function DashboardProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-5xl mx-auto py-20 text-center">
          <p className="text-xs text-zinc-500 font-mono">Loading profile details...</p>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}

