'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import { useAuth } from '@/src/context/AuthContext';
import { useProperty } from '@/src/context/PropertyContext';
import { usePageCurtains } from '@/src/components/ui/page-curtains';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const { showToast } = useProperty();
  const { navigateWithCurtains } = usePageCurtains();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      showToast(`Welcome back, ${res.user.firstName}!`, 'success');
      navigateWithCurtains('/', 'Discover');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials. Please check your email and password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role: 'tenant' | 'lister') => {
    if (role === 'tenant') {
      setEmail('rohan@student.pdeu.ac.in');
      setPassword('password123');
    } else {
      setEmail('rajesh@patelproperties.in');
      setPassword('password123');
    }
    setError(null);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl p-0">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-[580px]">
          {/* Form Side */}
          <div className="flex flex-col justify-between p-6 sm:p-8 md:p-10">
            <div>
              {/* Brand Header */}
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white font-extrabold text-sm shadow-md shadow-emerald-600/30">
                  ✦
                </span>
                <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                  rentmatch<span className="text-emerald-600 dark:text-emerald-400">ai</span>
                </span>
              </div>

              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Welcome back
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
                  Sign in to access your saved homes, chats, and listings
                </p>
              </div>

              {/* Demo Account Quick Switcher */}
              <div className="mb-6 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 flex items-center justify-between">
                  <span>Quick Demo Accounts</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">1-Click Autofill</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('tenant')}
                    className="py-1.5 px-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-700/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-zinc-800 dark:text-zinc-200 hover:text-emerald-700 dark:hover:text-emerald-300 border border-zinc-200 dark:border-zinc-600 transition-all text-left truncate shadow-2xs"
                  >
                    🎓 Rohan (Student)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('lister')}
                    className="py-1.5 px-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-700/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-zinc-800 dark:text-zinc-200 hover:text-emerald-700 dark:hover:text-emerald-300 border border-zinc-200 dark:border-zinc-600 transition-all text-left truncate shadow-2xs"
                  >
                    🏢 Rajesh (Landlord)
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rohan@student.pdeu.ac.in"
                      className="rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/50"
                      required
                    />
                  </Field>

                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <button
                        type="button"
                        onClick={() => showToast('Password reset link sent to registered email.', 'info')}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/50"
                      required
                    />
                  </Field>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/25 transition-all cursor-pointer h-10"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span>Login</span>
                        <ArrowRight size={16} />
                      </span>
                    )}
                  </Button>
                </FieldGroup>
              </form>
            </div>

            {/* Footer switcher */}
            <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => navigateWithCurtains('/signup', 'Create Account')}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Sign up free
              </button>
            </div>
          </div>

          {/* Luxury Visual Banner Side */}
          <div className="relative hidden md:flex flex-col justify-between p-8 overflow-hidden bg-zinc-900 text-white">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury Apartment in Gandhinagar"
              className="absolute inset-0 h-full w-full object-cover opacity-55 scale-105"
            />
            {/* Ambient gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-950/20" />
            <div className="absolute inset-0 bg-emerald-950/20 mix-blend-multiply" />

            {/* Top Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-md">
                <ShieldCheck size={14} />
                <span>100% Verified Landlords</span>
              </div>
              <span className="text-xs font-mono text-zinc-400 tracking-widest">
                ZERO BROKERAGE
              </span>
            </div>

            {/* Bottom Testimonial Quote */}
            <div className="relative z-10 bg-zinc-950/70 backdrop-blur-md rounded-2xl border border-zinc-800/80 p-5 shadow-xl">
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold mb-2">
                <span>★★★★★</span>
                <span className="ml-1 text-zinc-300 font-normal">Verified Move-In</span>
              </div>
              <blockquote className="text-sm font-medium text-zinc-100 leading-relaxed italic mb-3">
                &ldquo;We matched directly with our landlord near Infocity in under 12 hours. Zero broker calls, no commission fees.&rdquo;
              </blockquote>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-semibold text-zinc-200">Aarav M. — Tech Professional</span>
                <span className="text-emerald-400 font-mono">Infocity, Gandhinagar</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        By continuing, you agree to RentMatch AI&apos;s{' '}
        <span className="underline hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer">Terms of Service</span>{' '}
        and{' '}
        <span className="underline hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer">Privacy Policy</span>.
      </FieldDescription>
    </div>
  );
}
