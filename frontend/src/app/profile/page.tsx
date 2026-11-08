'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { PropertyService } from '../../services/propertyService';
import { PROPERTY_STATUS, type Property } from '../../constants/initialData';
import { PropertyCard } from '@/src/components/property';
import {
  User,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Plus,
  Lock,
  Sparkles,
  KeyRound,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { usePageCurtains } from '../../components/ui/page-curtains';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { navigateWithCurtains } = usePageCurtains();
  const initialTab = searchParams.get('tab') || 'personal';

  const { user, updateProfile, changePassword, isLister, isTenant } = useAuth();
  const {
    saved,
    toggleSave,
    openAddProperty,
    openEditProperty,
    openDeleteProperty,
    togglePropertyStatus,
    showToast,
    properties,
  } = useProperty();

  const [activeTab, setActiveTab] = useState(initialTab); // 'personal' | 'listings' | 'security'

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

  // Lister Properties State
  const [listerProperties, setListerProperties] = useState<Property[]>([]);
  const [propertyFilter, setPropertyFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'

  const loadListerProperties = useCallback(() => {
    if (user?.id) {
      const props = PropertyService.getPropertiesByLister(user.id);
      setListerProperties(props);
    }
  }, [user]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) setActiveTab(tabParam);
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phone || '');
      setCompany(user.company || '');
      if (user.preferences) {
        setBudgetMax(String(user.preferences.budgetMax || 25000));
        setPreferredBhk(String(user.preferences.preferredBhk || '2'));
        setTargetLocation(user.preferences.targetLocation || 'Gandhinagar');
      }
      loadListerProperties();
    }
  }, [user, loadListerProperties, properties]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32 text-center">
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-400">
          <User size={24} />
        </div>
        <h2 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight mb-2">
          Sign In Required
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-6">
          Please log in or register to access your personal profile and manage listings.
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold px-6 py-2.5 text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
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

    if (newPassword.length < 6) {
      const msg = 'New password must be at least 6 characters.';
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

  // Stats for Lister Dashboard
  const activeCount = listerProperties.filter((p) => p.status === PROPERTY_STATUS.ACTIVE).length;
  const inactiveCount = listerProperties.filter((p) => p.status === PROPERTY_STATUS.INACTIVE).length;

  const filteredProperties = listerProperties.filter((p) => {
    if (propertyFilter === 'ACTIVE') return p.status === PROPERTY_STATUS.ACTIVE;
    if (propertyFilter === 'INACTIVE') return p.status === PROPERTY_STATUS.INACTIVE;
    return true;
  });

  const userInitials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-950 dark:text-zinc-50 pb-24 sm:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        {/* Profile Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/60 dark:bg-zinc-950/60 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm mb-8">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-black text-xl sm:text-2xl shadow-md shrink-0">
              {user.avatar && !user.avatar.includes('dicebear') ? (
                <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover rounded-3xl" />
              ) : (
                <span>{userInitials}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight">
                  {user.firstName} {user.lastName}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-2xs">
                  {isLister ? (
                    <>
                      <Building2 size={12} />
                      <span>Property Lister / Landlord</span>
                    </>
                  ) : (
                    <>
                      <User size={12} />
                      <span>Tenant / Renter</span>
                    </>
                  )}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck size={12} /> Verified User
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
              className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold tracking-tight shadow-md transition-all active:scale-95 cursor-pointer self-stretch sm:self-auto justify-center"
              onClick={openAddProperty}
            >
              <Plus size={15} /> List New Property
            </button>
          )}
        </div>

        {/* Apple Segmented Control Tabs */}
        <div className="inline-flex p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 mb-8 max-w-full overflow-x-auto">
          <button
            type="button"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              activeTab === 'personal'
                ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('personal')}
          >
            <User size={14} /> Profile Details &amp; Preferences
          </button>

          {isLister && (
            <button
              type="button"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                activeTab === 'listings'
                  ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
              onClick={() => {
                setActiveTab('listings');
                loadListerProperties();
              }}
            >
              <Building2 size={14} /> My Listed Properties ({listerProperties.length})
            </button>
          )}

          <button
            type="button"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              activeTab === 'security'
                ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('security')}
          >
            <Lock size={14} /> Security &amp; Password
          </button>
        </div>

        {/* TAB 1: Personal Details & Preferences */}
        {activeTab === 'personal' && (
          <div className="max-w-3xl">
            <div className="p-6 sm:p-9 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-950 shadow-sm">
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
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/60 text-xs sm:text-sm text-zinc-500 dark:text-zinc-500 cursor-not-allowed"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                    />
                  </div>
                )}

                {isTenant && (
                  <div className="p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-zinc-900/50 space-y-4">
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
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
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
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
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
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold tracking-tight shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    disabled={isUpdating}
                  >
                    <span>{isUpdating ? 'Saving Changes...' : 'Save Profile Details'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: Lister Property Management */}
        {isLister && activeTab === 'listings' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 sm:p-6 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-950 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Total Properties
                </span>
                <span className="text-3xl font-black text-zinc-950 dark:text-white block tabular-nums">
                  {listerProperties.length}
                </span>
                <small className="text-xs text-zinc-500 mt-1 block">All owned listings</small>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-950 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                  Active (Live)
                </span>
                <span className="text-3xl font-black text-zinc-950 dark:text-white block tabular-nums">
                  {activeCount}
                </span>
                <small className="text-xs text-zinc-500 mt-1 block">Visible on search to tenants</small>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-950 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Inactive (Drafts/Hidden)
                </span>
                <span className="text-3xl font-black text-zinc-950 dark:text-white block tabular-nums">
                  {inactiveCount}
                </span>
                <small className="text-xs text-zinc-500 mt-1 block">Hidden from public explore</small>
              </div>
            </div>

            {/* Filter Buttons & Add Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="inline-flex p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 self-start">
                <button
                  type="button"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    propertyFilter === 'ALL'
                      ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                  }`}
                  onClick={() => setPropertyFilter('ALL')}
                >
                  All ({listerProperties.length})
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    propertyFilter === 'ACTIVE'
                      ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                  }`}
                  onClick={() => setPropertyFilter('ACTIVE')}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Active ({activeCount})</span>
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    propertyFilter === 'INACTIVE'
                      ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                  }`}
                  onClick={() => setPropertyFilter('INACTIVE')}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                  <span>Inactive ({inactiveCount})</span>
                </button>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 py-2.5 px-5 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold tracking-tight shadow-xs transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
                onClick={openAddProperty}
              >
                <Plus size={14} /> + Add New Property Listing
              </button>
            </div>

            {/* Properties Grid */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    isSaved={saved.includes(prop.id)}
                    onToggleSave={toggleSave}
                    onOpenDetails={(id) => router.push(`/properties/${id}`)}
                    isOwner={true}
                    onEdit={openEditProperty}
                    onToggleStatus={togglePropertyStatus}
                    onDelete={openDeleteProperty}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 text-center max-w-lg mx-auto">
                <Building2 size={36} className="text-zinc-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-1">
                  No properties in this category
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6">
                  {propertyFilter === 'INACTIVE'
                    ? 'You currently have no inactive listings.'
                    : 'Start by publishing your first property listing on RentMatch AI.'}
                </p>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 py-2.5 px-5 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold tracking-tight shadow-xs transition-all active:scale-95 cursor-pointer"
                  onClick={openAddProperty}
                >
                  <Plus size={14} /> Add Your First Property
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Security & Password */}
        {activeTab === 'security' && (
          <div className="max-w-xl">
            <div className="p-6 sm:p-9 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-950 shadow-sm">
              <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-850">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
                  Change Password
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
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
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
                      placeholder="Min. 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold tracking-tight shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    disabled={passwordUpdating}
                  >
                    <span>{passwordUpdating ? 'Updating Password...' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <p className="text-xs text-zinc-500 font-mono">Loading profile...</p>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
