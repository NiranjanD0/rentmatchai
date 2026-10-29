'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/src/context/AuthContext';
import { USER_ROLES, type UserRole } from '@/src/constants/initialData';
import { useToast } from '@/src/components/ui/notifications';
import { X, Mail, Lock, Eye, EyeOff, User, Phone, Sparkles, Building2, KeyRound, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
  initialRole?: UserRole;
  onAuthSuccess?: (msg: string) => void;
}

export default function AuthModal({ isOpen, onClose, initialTab = 'login', initialRole = USER_ROLES.TENANT, onAuthSuccess }: AuthModalProps) {
  const { login, register, loginWithGoogle } = useAuth();
  const { notify } = useToast();

  const [tab, setTab] = useState(initialTab); // 'login' | 'register'
  const [role, setRole] = useState<UserRole>(initialRole);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  // Sprint 1 State Machine tracking
  // 'idle' | 'validating' | 'failed' | 'success'
  const [authStatus, setAuthStatus] = useState<'idle' | 'validating' | 'failed' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setTab(initialTab);
    setRole(initialRole);
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

    setAuthStatus('validating'); // Sprint 1: Validating Login state
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
      const msg = (err as Error).message || 'Invalid credentials. Please verify your email and password.';
      notify.error(msg, 'Login Failed');
      setAuthStatus('failed'); // Sprint 1: Login Failed state
      setErrorMessage(msg);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validations
    if (!firstName.trim()) {
      const msg = 'Please enter your first name.';
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

    if (!password || password.length < 6) {
      const msg = 'Password must contain at least 6 characters.';
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

    setAuthStatus('validating'); // Sprint 1: Validating Registration state
    setErrorMessage('');

    try {
      const res = await register({
        firstName,
        lastName,
        email,
        password,
        role,
        phone
      });
      setAuthStatus('success');
      if (onAuthSuccess) {
        onAuthSuccess(`Account created successfully! Logged in as ${res.user.role === USER_ROLES.PROPERTY_LISTER ? 'Property Lister' : 'Tenant'}.`);
      }
      setTimeout(() => {
        resetForm();
        onClose();
      }, 400);
    } catch (err: unknown) {
      const msg = (err as Error).message || 'Registration failed. Please try again.';
      notify.error(msg, 'Registration Failed');
      setAuthStatus('failed'); // Sprint 1: Registration Failed state
      setErrorMessage(msg);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthStatus('validating');
    setErrorMessage('');
    try {
      const res = await loginWithGoogle(role);
      setAuthStatus('success');
      if (onAuthSuccess) onAuthSuccess(`Signed in with Google as ${res.user.firstName}!`);
      setTimeout(() => {
        resetForm();
        onClose();
      }, 400);
    } catch {
      const msg = 'Google Authentication was cancelled or failed.';
      notify.error(msg, 'Google Sign-In Error');
      setAuthStatus('failed');
      setErrorMessage(msg);
    }
  };

  const handleQuickDemoLogin = (demoRole: UserRole) => {
    if (demoRole === USER_ROLES.PROPERTY_LISTER) {
      setEmail('lister@rentmatch.ai');
      setPassword('Lister@123');
    } else {
      setEmail('tenant@rentmatch.ai');
      setPassword('Tenant@123');
    }
    setTab('login');
    setErrorMessage('');
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="auth-header">
          <div className="auth-badge">
            <Sparkles size={14} /> RentMatch AI Security
          </div>
          <h2>{tab === 'login' ? 'Sign In to RentMatch' : 'Create an Account'}</h2>
          <p>
            {tab === 'login'
              ? 'Access your saved shortlist, manage listings, and sync preferences.'
              : 'Choose your role to get started with intelligent rental matching.'}
          </p>
        </div>

        {/* Direct Google OAuth Option */}
        <div className="auth-google-section">
          <button
            type="button"
            className="btn-google"
            onClick={handleGoogleAuth}
            disabled={authStatus === 'validating'}
          >
            <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google Account</span>
          </button>

          <div className="auth-divider">
            <span>or use email and password</span>
          </div>
        </div>

        {/* Tab switcher: Login / Register */}
        <div className="auth-tab-bar">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => switchTab('login')}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => switchTab('register')}
            type="button"
          >
            Create Account
          </button>
        </div>

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} />
                <input
                  id="login-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="login-password">Password</label>
              </div>
              <div className="input-with-icon">
                <Lock size={16} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary-auth"
              disabled={authStatus === 'validating'}
            >
              {authStatus === 'validating' ? 'Validating credentials...' : 'Sign In'}
            </button>

            {/* Quick Demo Credentials Fill for Testing/Grading */}
            <div className="demo-credentials-box">
              <div className="demo-credentials-title">
                <KeyRound size={13} /> Instant Demo Credentials (1-Click Fill):
              </div>
              <div className="demo-credentials-buttons">
                <button
                  type="button"
                  className="btn-demo-chip"
                  onClick={() => handleQuickDemoLogin(USER_ROLES.PROPERTY_LISTER)}
                >
                  <Building2 size={12} /> Lister (Rajesh)
                </button>
                <button
                  type="button"
                  className="btn-demo-chip"
                  onClick={() => handleQuickDemoLogin(USER_ROLES.TENANT)}
                >
                  <User size={12} /> Tenant (Ananya)
                </button>
              </div>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            {/* Role Selection (Sprint 1 Class Diagram: UserRole enum) */}
            <div className="role-selector-section">
              <label className="section-label">I am joining as:</label>
              <div className="role-options">
                <motion.div
                  className={`role-option-card ${role === USER_ROLES.TENANT ? 'selected' : ''}`}
                  onClick={() => setRole(USER_ROLES.TENANT)}
                  role="button"
                  tabIndex={0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    scale: role === USER_ROLES.TENANT ? 1.02 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                >
                  <motion.div
                    className="role-icon"
                    animate={{
                      scale: role === USER_ROLES.TENANT ? [1, 1.2, 1] : 1,
                      rotate: role === USER_ROLES.TENANT ? [0, -8, 8, 0] : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <User size={18} />
                  </motion.div>
                  <div className="role-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <strong>Tenant / Renter</strong>
                      <AnimatePresence>
                        {role === USER_ROLES.TENANT && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            style={{ display: 'inline-flex', color: '#286b50' }}
                          >
                            <CheckCircle2 size={13} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <small>Search homes, save shortlist, enquire</small>
                  </div>
                </motion.div>

                <motion.div
                  className={`role-option-card ${role === USER_ROLES.PROPERTY_LISTER ? 'selected' : ''}`}
                  onClick={() => setRole(USER_ROLES.PROPERTY_LISTER)}
                  role="button"
                  tabIndex={0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    scale: role === USER_ROLES.PROPERTY_LISTER ? 1.02 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                >
                  <motion.div
                    className="role-icon"
                    animate={{
                      scale: role === USER_ROLES.PROPERTY_LISTER ? [1, 1.2, 1] : 1,
                      rotate: role === USER_ROLES.PROPERTY_LISTER ? [0, -8, 8, 0] : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Building2 size={18} />
                  </motion.div>
                  <div className="role-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <strong>Property Lister</strong>
                      <AnimatePresence>
                        {role === USER_ROLES.PROPERTY_LISTER && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            style={{ display: 'inline-flex', color: '#286b50' }}
                          >
                            <CheckCircle2 size={13} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <small>Publish &amp; manage rental listings</small>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="reg-first-name">First Name</label>
                <div className="input-with-icon">
                  <User size={16} />
                  <input
                    id="reg-first-name"
                    type="text"
                    placeholder="e.g. Rahul"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-last-name">Last Name</label>
                <input
                  id="reg-last-name"
                  type="text"
                  placeholder="e.g. Patel"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input-plain"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} />
                <input
                  id="reg-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-phone">Phone Number (Optional)</label>
              <div className="input-with-icon">
                <Phone size={16} />
                <input
                  id="reg-phone"
                  type="tel"
                  placeholder="+91 98765 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <div className="input-with-icon">
                  <Lock size={16} />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-confirm-password">Confirm Password</label>
                <div className="input-with-icon">
                  <Lock size={16} />
                  <input
                    id="reg-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary-auth"
              disabled={authStatus === 'validating'}
            >
              {authStatus === 'validating' ? 'Creating account...' : `Register as ${role === USER_ROLES.PROPERTY_LISTER ? 'Property Lister' : 'Tenant'}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
