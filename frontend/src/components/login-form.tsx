'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, AlertCircle, ArrowRight } from 'lucide-react';
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
import { usePageCurtains } from '@/src/components/ui/page-curtains';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const { login } = useAuth();
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

          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Welcome back
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Sign in to access your saved homes, chats, and listings
            </p>
          </div>

          {/* Quick Demo Switcher */}
          <div className="mb-5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 flex items-center justify-between">
              <span>Quick Demo Accounts</span>
              <span className="text-zinc-500 dark:text-zinc-400">1-Click Fill</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('tenant')}
                className="py-1.5 px-2.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 transition-colors text-left truncate cursor-pointer"
              >
                Rohan (Student)
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('lister')}
                className="py-1.5 px-2.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 transition-colors text-left truncate cursor-pointer"
              >
                Rajesh (Landlord)
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Email Address
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rohan@student.pdeu.ac.in"
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm h-10"
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Password
                  </FieldLabel>
                  <button
                    type="button"
                    onClick={() => showToast('Password reset link sent to registered email.', 'info')}
                    className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
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
                  className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm h-10"
                  required
                />
              </Field>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-semibold transition-all cursor-pointer h-10 text-xs shadow-xs"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Login</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </Button>
            </FieldGroup>
          </form>

          {/* Footer switcher */}
          <div className="pt-5 mt-5 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => navigateWithCurtains('/signup', 'Create Account')}
              className="font-semibold text-zinc-950 dark:text-white hover:underline cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="text-center text-[11px] text-zinc-500 dark:text-zinc-400">
        By continuing, you agree to RentMatch AI&apos;s Terms of Service and Privacy Policy.
      </FieldDescription>
    </div>
  );
}
