'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/src/context/AuthContext';
import { USER_ROLES, type UserRole } from '@/src/constants/initialData';
import { useToast } from '@/src/components/ui/notifications';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Sparkles,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { GoogleAuthButton } from './GoogleAuthButton';
import ForgotPasswordModal from './ForgotPasswordModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
  initialRole?: UserRole;
  onAuthSuccess?: (msg: string) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialTab = 'login',
  initialRole,
  onAuthSuccess,
}: AuthModalProps) {
  const { login, register } = useAuth();
  const { notify } = useToast();

  const [tab, setTab] = useState(initialTab); // 'login' | 'register'
  const [role, setRole] = useState<UserRole | null>(initialRole ?? null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  // Sprint 1 State Machine tracking
  const [authStatus, setAuthStatus] = useState<'idle' | 'validating' | 'failed' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setTab(initialTab);
    setRole(initialRole ?? null);
    setErrorMessage('');
    setAuthStatus('idle');
  }, [initialTab, initialRole, isOpen]);

  if (!isOpen) return null;

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPhone('');
    setErrorMessage('');
    setAuthStatus('idle');
  };

  const switchTab = (newTab: string) => {
    setTab(newTab);
    setErrorMessage('');
    setAuthStatus('idle');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      const msg = 'Please provide both email and password.';
      notify.error(msg, 'Validation Error');
      setErrorMessage(msg);
      setAuthStatus('failed');
      return;
    }

    setAuthStatus('validating');
    setErrorMessage('');

    try {
      const res = await login(email, password);
      setAuthStatus('success');
      if (onAuthSuccess) onAuthSuccess(`Welcome back, ${res.user.firstName}!`);
      setTimeout(() => {
        resetForm();
        onClose();
      }, 400);
    } catch (err: unknown) {
      const msg =
        (err as Error).message || 'Invalid credentials. Please verify your email and password.';
      notify.error(msg, 'Login Failed');
      setAuthStatus('failed');
      setErrorMessage(msg);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      const msg = 'Please choose your role (Tenant or Property Lister).';
      notify.error(msg, 'Role Required');
      setErrorMessage(msg);
      setAuthStatus('failed');
      return;
    }

    if (!firstName.trim()) {
      const msg = 'Please enter your first name.';
      notify.error(msg, 'Validation Error');
      setErrorMessage(msg);
      setAuthStatus('failed');
      return;
    }

    if (!lastName.trim()) {
      const msg = 'Please enter your last name.';
      notify.error(msg, 'Validation Error');
      setErrorMessage(msg);
      setAuthStatus('failed');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      const msg = 'Please enter a valid email address.';
      notify.error(msg, 'Validation Error');
      setErrorMessage(msg);
      setAuthStatus('failed');
      return;
    }

    if (!password || password.length < 8) {
      const msg = 'Password must contain at least 8 characters.';
      notify.error(msg, 'Validation Error');
      setErrorMessage(msg);
      setAuthStatus('failed');
      return;
    }

    if (password !== confirmPassword) {
      const msg = 'Passwords do not match. Please re-enter.';
      notify.error(msg, 'Validation Error');
      setErrorMessage(msg);
      setAuthStatus('failed');
      return;
    }

    setAuthStatus('validating');
    setErrorMessage('');

    try {
      const res = await register({
        firstName,
        lastName,
        email,
        password,
        role,
        phone,
      });
      setAuthStatus('success');
      if (onAuthSuccess) {
        onAuthSuccess(
          `Account created successfully! Logged in as ${
            res.user.role === USER_ROLES.PROPERTY_LISTER ? 'Property Lister' : 'Tenant'
          }.`
        );
      }
      setTimeout(() => {
        resetForm();
        onClose();
      }, 400);
    } catch (err: unknown) {
      const msg = (err as Error).message || 'Registration failed. Please try again.';
      notify.error(msg, 'Registration Failed');
      setAuthStatus('failed');
      setErrorMessage(msg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        className="relative w-full max-w-lg rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#211E1B] p-6 sm:p-8 shadow-2xl shadow-zinc-950/20 dark:shadow-black/70 my-auto flex flex-col max-h-[92svh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-5 right-5 h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-950 dark:hover:text-white flex items-center justify-center active:scale-90 transition-transform cursor-pointer z-10"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        <ScrollArea className="flex-1 pr-3 -mr-3">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200/60 dark:border-zinc-800 mb-2.5">
              <Sparkles size={12} />
              <span>RentMatch AI Security</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
              {tab === 'login' ? 'Sign In to RentMatch' : 'Create an Account'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {tab === 'login'
                ? 'Access your saved shortlist, manage listings, and sync preferences.'
                : 'Choose your role to get started with intelligent rental matching.'}
            </p>
          </div>

          {/* Google Auth Button */}
          <div className="space-y-4 mb-5">
            <GoogleAuthButton
              mode={tab === 'register' ? 'signup' : 'signin'}
              preferredRole={role || undefined}
              disabled={authStatus === 'validating' || (tab === 'register' && !role)}
              onLoadingChange={(loading) => {
                setAuthStatus(loading ? 'validating' : 'idle');
                if (loading) setErrorMessage('');
              }}
              onSuccess={(session) => {
                setAuthStatus('success');
                if (onAuthSuccess) onAuthSuccess(`Signed in with Google as ${session.user.firstName}!`);
                setTimeout(() => {
                  resetForm();
                  onClose();
                }, 400);
              }}
              onError={(err) => {
                notify.error(err.message, 'Google Sign-In Error');
                setAuthStatus('failed');
                setErrorMessage(err.message);
              }}
            />
            {tab === 'register' && !role && (
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 text-center font-medium">
                Select your role below to enable Google Sign-Up
              </p>
            )}

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <span className="relative px-3 bg-white dark:bg-zinc-950 text-[11px] font-medium text-zinc-400">
                or use email and password
              </span>
            </div>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="inline-flex w-full p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 mb-5">
            <button
              type="button"
              className={`flex-1 py-2 text-center text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
              onClick={() => switchTab('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-center text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
              onClick={() => switchTab('register')}
            >
              Create Account
            </button>
          </div>

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail size={15} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="login-password" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock size={15} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                  />
                  <button
                    type="button"
                    className="absolute right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-xs text-[#E8510E] dark:text-[#F06A32] font-semibold hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-zinc-950 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-150 text-white dark:text-zinc-950 text-xs font-bold tracking-tight shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                disabled={authStatus === 'validating'}
              >
                <span>{authStatus === 'validating' ? 'Validating credentials...' : 'Sign In'}</span>
              </button>

            </form>
          )}

          {/* REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block">
                  I am joining as:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                      role === USER_ROLES.TENANT
                        ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950 shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                    }`}
                    onClick={() => setRole(USER_ROLES.TENANT)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <User size={16} />
                      {role === USER_ROLES.TENANT && <CheckCircle2 size={14} />}
                    </div>
                    <strong className="block text-xs font-bold">Tenant / Renter</strong>
                    <small className="text-[10px] opacity-75 block mt-0.5">
                      Search homes, save shortlist, enquire
                    </small>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                      role === USER_ROLES.PROPERTY_LISTER
                        ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950 shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                    }`}
                    onClick={() => setRole(USER_ROLES.PROPERTY_LISTER)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Building2 size={16} />
                      {role === USER_ROLES.PROPERTY_LISTER && <CheckCircle2 size={14} />}
                    </div>
                    <strong className="block text-xs font-bold">Property Lister</strong>
                    <small className="text-[10px] opacity-75 block mt-0.5">
                      Publish &amp; manage rental listings
                    </small>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="reg-first-name" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    First Name
                  </label>
                  <div className="relative flex items-center">
                    <User size={15} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                    <input
                      id="reg-first-name"
                      type="text"
                      placeholder="e.g. Rahul"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-last-name" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Last Name
                  </label>
                  <input
                    id="reg-last-name"
                    type="text"
                    placeholder="e.g. Patel"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="reg-email" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail size={15} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="reg-phone" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Phone Number (Optional)
                </label>
                <div className="relative flex items-center">
                  <Phone size={15} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                  <input
                    id="reg-phone"
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="reg-password" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock size={15} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 6 chars"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-confirm-password" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock size={15} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                    <input
                      id="reg-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-zinc-950 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-150 text-white dark:text-zinc-950 text-xs font-bold tracking-tight shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                disabled={authStatus === 'validating' || !role}
              >
                <span>
                  {authStatus === 'validating'
                    ? 'Creating account...'
                    : !role
                    ? 'Select a Role to Continue'
                    : `Register as ${role === USER_ROLES.PROPERTY_LISTER ? 'Property Lister' : 'Tenant'}`}
                </span>
              </button>
            </form>
          )}
        </ScrollArea>

        {/* Forgot Password Modal */}
        <ForgotPasswordModal
          isOpen={isForgotPasswordOpen}
          onClose={() => setIsForgotPasswordOpen(false)}
          initialEmail={email}
        />
      </motion.div>
    </div>
  );
}
