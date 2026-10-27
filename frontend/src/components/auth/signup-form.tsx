'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { AlertCircle, ArrowRight, GraduationCap, Building2, User, Mail, Lock, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { FieldDescription, FieldLabel } from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import { useAuth } from '@/src/context/AuthContext';
import { useProperty } from '@/src/context/PropertyContext';
import { USER_ROLES, type UserRole } from '@/src/constants/initialData';
import { usePageCurtains } from '@/src/components/ui/page-curtains';
import BrandLogo from '../layout/BrandLogo';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();
  const { showToast } = useProperty();
  const { navigateWithCurtains } = usePageCurtains();

  const [role, setRole] = useState<UserRole>(USER_ROLES.TENANT);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        role,
        firstName,
        lastName,
        email,
        password,
        phone: phone || undefined,
      });
      showToast(`Welcome to RentMatch AI, ${res.user.firstName}!`, 'success');
      navigateWithCurtains('/', 'Discover');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const res = await loginWithGoogle(role);
      showToast(`Welcome to RentMatch AI, ${res.user.firstName}!`, 'success');
      navigateWithCurtains('/', 'Discover');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google authentication failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-5', className)} {...props}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl shadow-zinc-900/5 dark:shadow-black/50 rounded-3xl p-7 sm:p-9">
        <CardContent className="p-0">
          {/* Brand Header */}
          <div className="flex items-center justify-between mb-5">
            <BrandLogo size="md" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full">
              Verified Direct
            </span>
          </div>

          <div className="mb-5">
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Create an account
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Join verified tenants and direct property owners in Gandhinagar &amp; Ahmedabad
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 mb-5">
            <button
              type="button"
              onClick={() => setRole(USER_ROLES.TENANT)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === USER_ROLES.TENANT
                  ? 'bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 shadow-xs ring-1 ring-emerald-500/20'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Tenant / Student</span>
            </button>
            <button
              type="button"
              onClick={() => setRole(USER_ROLES.PROPERTY_LISTER)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === USER_ROLES.PROPERTY_LISTER
                  ? 'bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 shadow-xs ring-1 ring-emerald-500/20'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>Property Owner</span>
            </button>
          </div>

          {/* Social Google Signup Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-all shadow-xs mb-4 cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>

          <div className="relative flex items-center justify-center mb-4">
            <div className="border-t border-zinc-200 dark:border-zinc-800 w-full" />
            <span className="bg-white dark:bg-zinc-950 px-3 text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
              or enter details
            </span>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel htmlFor="firstName" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                  First Name *
                </FieldLabel>
                <div className="relative">
                  <User className="h-4 w-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Rohan"
                    className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs sm:text-sm h-10 pl-9.5"
                    required
                  />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="lastName" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                  Last Name *
                </FieldLabel>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Shah"
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs sm:text-sm h-10"
                  required
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="signup-email" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                Email Address *
              </FieldLabel>
              <div className="relative">
                <Mail className="h-4 w-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs sm:text-sm h-10 pl-9.5"
                  required
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="signup-phone" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                Phone Number (WhatsApp)
              </FieldLabel>
              <div className="relative">
                <Phone className="h-4 w-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                <Input
                  id="signup-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs sm:text-sm h-10 pl-9.5"
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="signup-password" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                Password *
              </FieldLabel>
              <div className="relative">
                <Lock className="h-4 w-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs sm:text-sm h-10 pl-9.5"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold transition-all cursor-pointer h-10 text-xs shadow-md shadow-emerald-600/25 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Create Free Account</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              )}
            </Button>
          </form>

          {/* Footer switcher */}
          <div className="pt-5 mt-5 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigateWithCurtains('/login', 'Login')}
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </CardContent>
      </Card>
      </motion.div>

      <FieldDescription className="text-center text-[11px] text-zinc-500 dark:text-zinc-400">
        By registering, you agree to our Terms of Service and Privacy Policy.
      </FieldDescription>
    </div>
  );
}
