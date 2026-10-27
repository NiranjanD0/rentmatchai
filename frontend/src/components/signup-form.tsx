'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import {
  FieldDescription,
  FieldLabel,
} from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import { useAuth } from '@/src/context/AuthContext';
import { useProperty } from '@/src/context/PropertyContext';
import { USER_ROLES, type UserRole } from '@/src/constants/initialData';
import { usePageCurtains } from '@/src/components/ui/page-curtains';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useProperty();
  const { navigateWithCurtains } = usePageCurtains();

  const [role, setRole] = useState<UserRole>(USER_ROLES.TENANT);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
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

  return (
    <div className={cn('flex flex-col gap-5', className)} {...props}>
      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm rounded-2xl p-6 sm:p-8">
        <CardContent className="p-0">
          {/* Brand Header */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950">
              <Home className="h-3.5 w-3.5" />
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-950 dark:text-white">
              rentmatch<span className="text-zinc-500 dark:text-zinc-400 font-medium">ai</span>
            </span>
          </div>

          <div className="mb-5">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Create an account
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Join verified renters and authentic landlords with zero broker cuts
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 mb-5">
            <button
              type="button"
              onClick={() => setRole(USER_ROLES.TENANT)}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer text-center ${
                role === USER_ROLES.TENANT
                  ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white font-semibold shadow-2xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              Tenant / Student
            </button>
            <button
              type="button"
              onClick={() => setRole(USER_ROLES.PROPERTY_LISTER)}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer text-center ${
                role === USER_ROLES.PROPERTY_LISTER
                  ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white font-semibold shadow-2xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              Property Lister
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel htmlFor="firstName" className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  First Name *
                </FieldLabel>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Rohan"
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm h-10"
                  required
                />
              </div>
              <div>
                <FieldLabel htmlFor="lastName" className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  Last Name *
                </FieldLabel>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Shah"
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm h-10"
                  required
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="signup-email" className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                Email Address *
              </FieldLabel>
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm h-10"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel htmlFor="signup-phone" className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  Phone
                </FieldLabel>
                <Input
                  id="signup-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm h-10"
                />
              </div>
              <div>
                <FieldLabel htmlFor="signup-occ" className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  {role === USER_ROLES.TENANT ? 'College / Job' : 'Organisation'}
                </FieldLabel>
                <Input
                  id="signup-occ"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder={role === USER_ROLES.TENANT ? 'e.g. PDEU / TCS' : 'Individual Owner'}
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm h-10"
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="signup-password" className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                Password *
              </FieldLabel>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm h-10"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-semibold transition-all cursor-pointer h-10 text-xs shadow-xs"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Create Account</span>
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
              className="font-semibold text-zinc-950 dark:text-white hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="text-center text-[11px] text-zinc-500 dark:text-zinc-400">
        By registering, you agree to our Terms of Service and Privacy Policy.
      </FieldDescription>
    </div>
  );
}
