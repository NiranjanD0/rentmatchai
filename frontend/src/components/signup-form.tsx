'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, AlertCircle, ArrowRight, ShieldCheck, GraduationCap, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
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
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields (First Name, Email, Password).');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role,
      });

      showToast(`Account created! Welcome to RentMatch AI, ${res.user.firstName}!`, 'success');
      navigateWithCurtains('/', 'Discover');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. An account with this email may already exist.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl p-0">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-[620px]">
          {/* Form Side */}
          <div className="flex flex-col justify-between p-6 sm:p-8 md:p-10">
            <div>
              {/* Brand Header */}
              <div className="flex items-center gap-2 mb-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white font-extrabold text-sm shadow-md shadow-emerald-600/30">
                  ✦
                </span>
                <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                  rentmatch<span className="text-emerald-600 dark:text-emerald-400">ai</span>
                </span>
              </div>

              <div className="mb-5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Create an account
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Join verified renters and authentic landlords with zero broker cuts
                </p>
              </div>

              {/* Role Selection Tabs */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800 mb-5">
                <button
                  type="button"
                  onClick={() => setRole(USER_ROLES.TENANT)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    role === USER_ROLES.TENANT
                      ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <GraduationCap size={15} />
                  <span>Tenant / Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole(USER_ROLES.PROPERTY_LISTER)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    role === USER_ROLES.PROPERTY_LISTER
                      ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <Building2 size={15} />
                  <span>Property Lister</span>
                </button>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel htmlFor="firstName" className="text-xs mb-1">First Name *</FieldLabel>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Ananya"
                      className="rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/50 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="lastName" className="text-xs mb-1">Last Name</FieldLabel>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Sharma"
                      className="rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/50 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="signup-email" className="text-xs mb-1">Email Address *</FieldLabel>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/50 text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel htmlFor="phone" className="text-xs mb-1">WhatsApp / Phone</FieldLabel>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/50 text-xs"
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="signup-password" className="text-xs mb-1">Password *</FieldLabel>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/50 text-xs"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/25 transition-all cursor-pointer h-10 text-xs"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Create Free Account</span>
                      <ArrowRight size={15} />
                    </span>
                  )}
                </Button>
              </form>
            </div>

            {/* Footer switcher */}
            <div className="pt-5 mt-5 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigateWithCurtains('/login', 'Login')}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </div>

          {/* Right Luxury Visual Banner */}
          <div className="relative hidden md:flex flex-col justify-between p-8 overflow-hidden bg-zinc-900 text-white">
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
              alt="Apartment building exterior"
              className="absolute inset-0 h-full w-full object-cover opacity-50 scale-105"
            />
            {/* Ambient gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20" />
            <div className="absolute inset-0 bg-emerald-950/30 mix-blend-multiply" />

            {/* Top Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-md">
                <ShieldCheck size={14} />
                <span>Zero Broker Commission</span>
              </div>
              <span className="text-xs font-mono text-zinc-400 tracking-widest">
                VERIFIED PLATFORM
              </span>
            </div>

            {/* Bottom Proof Strip */}
            <div className="relative z-10 grid grid-cols-2 gap-3">
              <div className="bg-zinc-950/75 backdrop-blur-md rounded-2xl border border-zinc-800/80 p-4">
                <div className="text-xl font-extrabold text-emerald-400">2,500+</div>
                <div className="text-xs font-semibold text-zinc-200 mt-0.5">Inspected Properties</div>
                <p className="text-[11px] text-zinc-400 mt-1">Across Gandhinagar, PDEU, Kudasan & Infocity</p>
              </div>

              <div className="bg-zinc-950/75 backdrop-blur-md rounded-2xl border border-zinc-800/80 p-4">
                <div className="text-xl font-extrabold text-teal-400">100%</div>
                <div className="text-xs font-semibold text-zinc-200 mt-0.5">Direct Lister Chat</div>
                <p className="text-[11px] text-zinc-400 mt-1">Connect with verified real owners immediately</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        By registering, you agree to our{' '}
        <span className="underline hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer">Terms of Service</span>{' '}
        and{' '}
        <span className="underline hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer">Privacy Policy</span>.
      </FieldDescription>
    </div>
  );
}
