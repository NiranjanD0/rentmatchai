'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { PropertyService } from '../../services/propertyService';
import { PROPERTY_STATUS, type Property } from '../../constants/initialData';
import { PropertyCard } from '@/src/components/property';
import { User, Mail, Phone, Building2, ShieldCheck, Plus, CheckCircle2, AlertCircle, Lock, Sparkles } from 'lucide-react';
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
    properties
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
      <div className="wrap profile-page empty-profile">
        <User size={48} />
        <h2>Sign In Required</h2>
        <p>Please log in or register to access your personal profile and manage listings.</p>
        <button
          type="button"
          className="btn-create-account text-xs font-bold px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5 mt-4"
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
        preferences: isTenant ? {
          budgetMax: Number(budgetMax),
          preferredBhk,
          targetLocation
        } : null
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

  return (
    <div className="wrap profile-page">
      {/* Profile Header Banner */}
      <div className="profile-banner-card">
        <div className="profile-main-info">
          <div className="profile-avatar-large">
            <span>{`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()}</span>
          </div>
          <div className="profile-text-meta">
            <div className="profile-name-row">
              <h1>{user.firstName} {user.lastName}</h1>
              <span className={`role-pill-large ${isLister ? 'pill-lister' : 'pill-tenant'}`}>
                {isLister ? (
                  <>
                    <Building2 size={13} /> Property Lister / Landlord
                  </>
                ) : (
                  <>
                    <User size={13} /> Tenant / Renter
                  </>
                )}
              </span>
              <span className="verified-pill">
                <ShieldCheck size={13} /> Verified User
              </span>
            </div>

            <div className="profile-contact-row">
              <span>
                <Mail size={14} /> {user.email}
              </span>
              {user.phone && (
                <span>
                  <Phone size={14} /> {user.phone}
                </span>
              )}
              {user.company && (
                <span>
                  <Building2 size={14} /> {user.company}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action Button for Lister */}
        {isLister && (
          <button className="primary btn-add-listing-hero" onClick={openAddProperty}>
            <Plus size={16} /> List New Property
          </button>
        )}
      </div>

      {/* Tabs navigation */}
      <div className="profile-tabs-bar">
        <button
          className={`profile-tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          <User size={16} /> Profile Details &amp; Preferences
        </button>

        {isLister && (
          <button
            className={`profile-tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('listings');
              loadListerProperties();
            }}
          >
            <Building2 size={16} /> My Listed Properties ({listerProperties.length})
          </button>
        )}

        <button
          className={`profile-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Lock size={16} /> Security &amp; Password
        </button>
      </div>

      {/* TAB 1: Personal Details & Preferences */}
      {activeTab === 'personal' && (
        <div className="profile-tab-content">
          <div className="profile-card">
            <div className="card-heading">
              <div>
                <h2>Personal Information</h2>
                <p>Manage your account name, contact telephone, and role credentials.</p>
              </div>
            </div>

            {updateSuccess && (
              <div className="form-alert success">
                <CheckCircle2 size={16} /> Profile details saved successfully.
              </div>
            )}

            {updateError && (
              <div className="form-alert error">
                <AlertCircle size={16} /> {updateError}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="pf-fname">First Name</label>
                  <input
                    id="pf-fname"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pf-lname">Last Name</label>
                  <input
                    id="pf-lname"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="pf-email">Registered Email (Read-only)</label>
                  <input
                    id="pf-email"
                    type="email"
                    value={user.email}
                    disabled
                    className="input-disabled"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pf-phone">Contact Phone Number</label>
                  <input
                    id="pf-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {isLister && (
                <div className="form-group">
                  <label htmlFor="pf-company">Real Estate Agency / Business Name</label>
                  <input
                    id="pf-company"
                    type="text"
                    placeholder="e.g. Apex Realty Gandhinagar"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              )}

              {isTenant && (
                <div className="tenant-pref-box">
                  <h3>
                    <Sparkles size={16} /> Rental Search Preferences
                  </h3>
                  <p>Helps RentMatch AI automatically rank homes tailored to your lifestyle.</p>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label htmlFor="pf-budget">Max Budget (₹/mo)</label>
                      <input
                        id="pf-budget"
                        type="number"
                        value={budgetMax}
                        onChange={(e) => setBudgetMax(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="pf-bhk">Preferred Bedrooms</label>
                      <select
                        id="pf-bhk"
                        value={preferredBhk}
                        onChange={(e) => setPreferredBhk(e.target.value)}
                      >
                        <option value="1">1 BHK</option>
                        <option value="2">2 BHK</option>
                        <option value="3">3 BHK</option>
                        <option value="Any">Any</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="pf-loc">Target Location</label>
                      <input
                        id="pf-loc"
                        type="text"
                        value={targetLocation}
                        onChange={(e) => setTargetLocation(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="form-actions-row">
                <button
                  type="submit"
                  className="primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving Changes...' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: Lister Property Management (Sprint 2 Goal) */}
      {isLister && activeTab === 'listings' && (
        <div className="profile-tab-content">
          {/* Dashboard Stats Cards */}
          <div className="lister-stats-grid">
            <div className="lister-stat-card">
              <span className="stat-label">Total Properties</span>
              <span className="stat-number">{listerProperties.length}</span>
              <small className="stat-desc">All owned listings</small>
            </div>
            <div className="lister-stat-card active-card">
              <span className="stat-label">Active (Live)</span>
              <span className="stat-number">{activeCount}</span>
              <small className="stat-desc">Visible on search to tenants</small>
            </div>
            <div className="lister-stat-card inactive-card">
              <span className="stat-label">Inactive (Drafts/Hidden)</span>
              <span className="stat-number">{inactiveCount}</span>
              <small className="stat-desc">Hidden from public explore</small>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="lister-toolbar">
            <div className="lister-filter-buttons">
              <button
                className={`filter-btn ${propertyFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setPropertyFilter('ALL')}
              >
                All ({listerProperties.length})
              </button>
              <button
                className={`filter-btn ${propertyFilter === 'ACTIVE' ? 'active' : ''}`}
                onClick={() => setPropertyFilter('ACTIVE')}
              >
                <span className="dot green" /> Active ({activeCount})
              </button>
              <button
                className={`filter-btn ${propertyFilter === 'INACTIVE' ? 'active' : ''}`}
                onClick={() => setPropertyFilter('INACTIVE')}
              >
                <span className="dot gray" /> Inactive ({inactiveCount})
              </button>
            </div>

            <button className="primary" onClick={openAddProperty}>
              <Plus size={16} /> + Add New Property Listing
            </button>
          </div>

          {/* Property Listings Grid */}
          {filteredProperties.length > 0 ? (
            <div className="cards lister-cards-grid">
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
            <div className="empty-lister-state">
              <Building2 size={40} />
              <h3>No properties in this category</h3>
              <p>
                {propertyFilter === 'INACTIVE'
                  ? 'You currently have no inactive listings.'
                  : 'Start by publishing your first property listing on RentMatch AI.'}
              </p>
              <button className="primary" onClick={openAddProperty}>
                <Plus size={16} /> Add Your First Property
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Security & Password */}
      {activeTab === 'security' && (
        <div className="profile-tab-content">
          <div className="profile-card">
            <div className="card-heading">
              <div>
                <h2>Change Password</h2>
                <p>Update your account password using secure hashing algorithms.</p>
              </div>
            </div>

            {passwordSuccess && (
              <div className="form-alert success">
                <CheckCircle2 size={16} /> Your password has been updated successfully.
              </div>
            )}

            {passwordError && (
              <div className="form-alert error">
                <AlertCircle size={16} /> {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="old-pass">Current Password</label>
                <input
                  id="old-pass"
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="new-pass">New Password</label>
                  <input
                    id="new-pass"
                    type="password"
                    required
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-pass">Confirm New Password</label>
                  <input
                    id="confirm-pass"
                    type="password"
                    required
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-actions-row">
                <button
                  type="submit"
                  className="primary"
                  disabled={passwordUpdating}
                >
                  {passwordUpdating ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="wrap"><p>Loading profile...</p></div>}>
      <ProfileContent />
    </Suspense>
  );
}
