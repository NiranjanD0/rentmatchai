'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { useProperty } from '@/src/context/PropertyContext';
import {
  Search,
  HelpCircle,
  Mail,
  Bold,
  Italic,
  Underline,
  Link2,
  AlignLeft,
  AlignCenter,
  List,
  Lock,
  KeyRound,
  User,
  Building2,
  ShieldCheck,
  Check,
  Phone,
} from 'lucide-react';
import { usePageCurtains } from '@/src/components/ui/page-curtains';
import { BlurFade } from '@/src/components/ui/blur-fade';

type SettingsTab =
  | 'my-details'
  | 'profile'
  | 'password'
  | 'team'
  | 'plan'
  | 'billing'
  | 'email'
  | 'notifications'
  | 'integrations'
  | 'api';

const TABS: { id: SettingsTab; label: string; badge?: number }[] = [
  { id: 'my-details', label: 'My details' },
  { id: 'profile', label: 'Profile' },
  { id: 'password', label: 'Password' },
  { id: 'team', label: 'Team' },
  { id: 'plan', label: 'Plan' },
  { id: 'billing', label: 'Billing' },
  { id: 'email', label: 'Email' },
  { id: 'notifications', label: 'Notifications', badge: 2 },
  { id: 'integrations', label: 'Integrations' },
  { id: 'api', label: 'API' },
];

function SettingsProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { navigateWithCurtains } = usePageCurtains();
  const { user, updateProfile, changePassword, isLister, isTenant } = useAuth();
  const { showToast } = useProperty();

  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<SettingsTab>(() => {
    if (tabParam === 'security' || tabParam === 'password') return 'password';
    if (tabParam === 'personal' || tabParam === 'my-details') return 'my-details';
    return 'profile';
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Profile fields matching reference screenshot
  const [username, setUsername] = useState('olivia');
  const [website, setWebsite] = useState('www.untitledui.com');
  const [photoUrl, setPhotoUrl] = useState<string>('/images/profile-avatar.png');
  const [bio, setBio] = useState(
    "I'm a Product Designer based in Melbourne, Australia. I specialize in UX/UI design, brand strategy, and Webflow development."
  );
  const [jobTitle, setJobTitle] = useState('Product Designer');
  const [showJobTitle, setShowJobTitle] = useState(true);
  const [altEmail, setAltEmail] = useState('');

  // Account details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with authenticated user
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName && user.lastName !== 'User' ? user.lastName : '');
      setPhone(user.phone || '');
      setCompany(user.company || '');
      if (user.avatar && !user.avatar.includes('dicebear')) {
        setPhotoUrl(user.avatar);
      }
      if (user.email) {
        const usernamePrefix = user.email.split('@')[0];
        if (usernamePrefix && username === 'olivia') {
          setUsername(usernamePrefix);
        }
      }
    }
  }, [user]);

  // Tab param URL listener
  useEffect(() => {
    if (tabParam === 'security' || tabParam === 'password') {
      setActiveTab('password');
    } else if (tabParam === 'personal' || tabParam === 'my-details') {
      setActiveTab('my-details');
    } else if (tabParam === 'profile') {
      setActiveTab('profile');
    }
  }, [tabParam]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size must be less than 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
          showToast('Profile photo updated.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Delete Photo
  const handleDeletePhoto = () => {
    setPhotoUrl('/images/profile-avatar.png');
    showToast('Photo reset to default.', 'info');
  };

  // Text formatting insertion for bio textarea
  const applyFormat = (format: string) => {
    if (format === 'bold') setBio((b) => `**${b}**`);
    else if (format === 'italic') setBio((b) => `*${b}*`);
    else if (format === 'underline') setBio((b) => `_${b}_`);
    else if (format === 'link') setBio((b) => `${b} [link](https://)`);
    else if (format === 'list') setBio((b) => `${b}\n- Item 1\n- Item 2`);
    else if (format === 'align-left') showToast('Aligned left', 'info');
    else if (format === 'align-center') showToast('Aligned center', 'info');
  };

  // Save changes
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile({
        firstName: firstName || user?.firstName || 'User',
        lastName: lastName || user?.lastName,
        phone,
        company: company || jobTitle,
      });

      // Save custom fields locally
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'user_settings_profile',
          JSON.stringify({ username, website, bio, jobTitle, showJobTitle, altEmail, photoUrl })
        );
      }

      showToast('Profile settings saved successfully!', 'success');
    } catch (err: unknown) {
      const msg = (err as Error).message || 'Failed to save settings.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Password Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    setIsPasswordUpdating(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated successfully!', 'success');
    } catch (err: unknown) {
      showToast((err as Error).message || 'Failed to update password.', 'error');
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const safeLastName = user?.lastName && user.lastName !== 'User' ? user.lastName : '';
  const fullName = user ? [user.firstName, safeLastName].filter(Boolean).join(' ') : 'Olivia Rhye';
  const userInitials =
    `${user?.firstName?.[0] || 'O'}${safeLastName?.[0] || 'R'}`.toUpperCase();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20 select-none">
      {/* 1. Header: Settings Title + Search Input with ⌘K Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>

        <div className="relative flex items-center">
          <Search size={16} className="absolute left-3 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-12 py-2 text-sm bg-card/60 dark:bg-zinc-950/60 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors shadow-2xs"
          />
          <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground bg-muted/60 border border-border/80 rounded select-none pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* 2. Top Segmented Navigation Tabs */}
      <div className="w-full overflow-x-auto no-scrollbar pt-1">
        <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-border bg-card/40 min-w-full sm:min-w-0">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-muted dark:bg-zinc-800 text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-xs font-semibold ${
                      isActive
                        ? 'bg-background text-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Tab Content Area */}
      <BlurFade key={activeTab} delay={0.04} inView>
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveChanges} className="space-y-0">
            {/* Section Header */}
            <div className="pt-6 pb-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Profile</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Update your photo and personal details here.
              </p>
            </div>

            {/* Row 1: Username */}
            <div className="py-5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="w-full md:w-72 lg:w-80 shrink-0">
                <label className="text-sm font-medium text-foreground">
                  Username <span className="text-zinc-500">*</span>
                </label>
              </div>
              <div className="flex-1 max-w-xl">
                <div className="flex rounded-lg shadow-2xs overflow-hidden">
                  <span className="inline-flex items-center px-3.5 text-sm text-muted-foreground bg-muted/60 border border-r-0 border-border rounded-l-lg select-none">
                    untitledui.com/
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="olivia"
                    className="flex-1 min-w-0 px-3.5 py-2 text-sm bg-card/60 dark:bg-zinc-950/60 border border-border rounded-r-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Website */}
            <div className="py-5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="w-full md:w-72 lg:w-80 shrink-0">
                <label className="text-sm font-medium text-foreground">
                  Website <span className="text-zinc-500">*</span>
                </label>
              </div>
              <div className="flex-1 max-w-xl">
                <div className="flex rounded-lg shadow-2xs overflow-hidden">
                  <span className="inline-flex items-center px-3.5 text-sm text-muted-foreground bg-muted/60 border border-r-0 border-border rounded-l-lg select-none">
                    https://
                  </span>
                  <input
                    type="text"
                    required
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="www.untitledui.com"
                    className="flex-1 min-w-0 px-3.5 py-2 text-sm bg-card/60 dark:bg-zinc-950/60 border border-border rounded-r-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Your photo */}
            <div className="py-5 border-b border-border flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="w-full md:w-72 lg:w-80 shrink-0 space-y-0.5">
                <label className="text-sm font-medium text-foreground">
                  Your photo <span className="text-zinc-500">*</span>
                </label>
                <p className="text-xs text-muted-foreground">
                  This will be displayed on your profile.
                </p>
              </div>
              <div className="flex-1 max-w-xl">
                <div className="flex items-center gap-6">
                  {/* Photo circular thumbnail */}
                  <div className="size-16 rounded-full overflow-hidden border border-border shadow-xs shrink-0 bg-muted flex items-center justify-center">
                    {photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photoUrl}
                        alt={fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-base font-bold text-foreground">
                        {userInitials}
                      </span>
                    )}
                  </div>

                  {/* Actions: Delete and Update */}
                  <div className="flex items-center gap-4 text-sm">
                    <button
                      type="button"
                      onClick={handleDeletePhoto}
                      className="font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                    <label className="font-semibold text-foreground hover:text-foreground/80 transition-colors cursor-pointer">
                      Update
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4: Your bio */}
            <div className="py-5 border-b border-border flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="w-full md:w-72 lg:w-80 shrink-0 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Your bio <span className="text-zinc-500">*</span>
                  </label>
                  <HelpCircle
                    size={14}
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-help"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Write a short introduction.
                </p>
              </div>
              <div className="flex-1 max-w-xl space-y-2">
                {/* Rich text formatting icons */}
                <div className="flex items-center gap-1 text-muted-foreground pb-1">
                  <button
                    type="button"
                    onClick={() => applyFormat('bold')}
                    className="p-1.5 hover:text-foreground hover:bg-muted rounded transition-colors"
                    title="Bold"
                  >
                    <Bold size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('italic')}
                    className="p-1.5 hover:text-foreground hover:bg-muted rounded transition-colors"
                    title="Italic"
                  >
                    <Italic size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('underline')}
                    className="p-1.5 hover:text-foreground hover:bg-muted rounded transition-colors"
                    title="Underline"
                  >
                    <Underline size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('link')}
                    className="p-1.5 hover:text-foreground hover:bg-muted rounded transition-colors"
                    title="Insert Link"
                  >
                    <Link2 size={15} />
                  </button>
                  <span className="h-4 w-px bg-border mx-1" />
                  <button
                    type="button"
                    onClick={() => applyFormat('align-left')}
                    className="p-1.5 hover:text-foreground hover:bg-muted rounded transition-colors"
                    title="Align Left"
                  >
                    <AlignLeft size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('align-center')}
                    className="p-1.5 hover:text-foreground hover:bg-muted rounded transition-colors"
                    title="Align Center"
                  >
                    <AlignCenter size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('list')}
                    className="p-1.5 hover:text-foreground hover:bg-muted rounded transition-colors"
                    title="Bulleted List"
                  >
                    <List size={15} />
                  </button>
                </div>

                {/* Bio textarea */}
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="I'm a Product Designer based in Melbourne, Australia..."
                  className="w-full bg-card/60 dark:bg-zinc-950/60 border border-border rounded-lg p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y leading-relaxed shadow-2xs transition-colors"
                />

                {/* Character count helper */}
                <p className="text-xs text-muted-foreground">
                  {Math.max(0, 400 - bio.length)} characters left
                </p>
              </div>
            </div>

            {/* Row 5: Job title */}
            <div className="py-5 border-b border-border flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="w-full md:w-72 lg:w-80 shrink-0">
                <label className="text-sm font-medium text-foreground">
                  Job title
                </label>
              </div>
              <div className="flex-1 max-w-xl space-y-3">
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Product Designer"
                  className="w-full px-3.5 py-2 text-sm bg-card/60 dark:bg-zinc-950/60 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring shadow-2xs transition-colors"
                />
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showJobTitle}
                    onChange={(e) => setShowJobTitle(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-foreground accent-primary focus:ring-ring"
                  />
                  <span className="text-sm text-muted-foreground">
                    Show my job title in my profile
                  </span>
                </label>
              </div>
            </div>

            {/* Row 6: Alternative contact email */}
            <div className="py-5 border-b border-border flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="w-full md:w-72 lg:w-80 shrink-0 space-y-0.5">
                <label className="text-sm font-medium text-foreground">
                  Alternative contact email
                </label>
                <p className="text-xs text-muted-foreground">
                  Enter an alternative email if you&apos;d like to receive notifications elsewhere.
                </p>
              </div>
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <input
                    type="email"
                    value={altEmail}
                    onChange={(e) => setAltEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3.5 py-2 text-sm bg-card/60 dark:bg-zinc-950/60 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring shadow-2xs transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Form Action Buttons (Bottom Bar) */}
            <div className="pt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setUsername('olivia');
                  setWebsite('www.untitledui.com');
                  setBio("I'm a Product Designer based in Melbourne, Australia. I specialize in UX/UI design, brand strategy, and Webflow development.");
                  setJobTitle('Product Designer');
                  showToast('Changes discarded', 'info');
                }}
                className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-sm font-medium text-foreground transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        )}

        {/* Tab: My details */}
        {activeTab === 'my-details' && (
          <div className="space-y-6 pt-6">
            <div className="pb-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">My Details</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage your legal name, contact phone, and account role.
              </p>
            </div>

            <form onSubmit={handleSaveChanges} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3.5 py-2 text-sm bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold transition-all cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Update Details'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab: Password */}
        {activeTab === 'password' && (
          <div className="space-y-6 pt-6">
            <div className="pb-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Password &amp; Security</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Change your account password to keep your profile secure.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min. 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="submit"
                  disabled={isPasswordUpdating}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold transition-all cursor-pointer"
                >
                  {isPasswordUpdating ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Other Tabs Placeholder */}
        {!['profile', 'my-details', 'password'].includes(activeTab) && (
          <div className="py-16 text-center border border-dashed border-border rounded-xl mt-6">
            <h3 className="text-base font-semibold text-foreground capitalize">
              {activeTab} Settings
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Configure and manage your {activeTab} preferences for your RentMatch AI workspace.
            </p>
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
          <p className="text-xs text-muted-foreground font-mono">Loading settings...</p>
        </div>
      }
    >
      <SettingsProfileContent />
    </Suspense>
  );
}
