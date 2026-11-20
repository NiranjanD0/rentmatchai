'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '@/src/components/ui/notifications';
import { AuthService } from '@/src/services/authService';
import { OtpInput } from './OtpInput';

interface VerifyEmailOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onVerified?: (email: string) => void;
}

type Step = 'email' | 'otp' | 'verified';

export default function VerifyEmailOtpModal({
  isOpen,
  onClose,
  initialEmail = '',
  onVerified,
}: VerifyEmailOtpModalProps) {
  const { notify } = useToast();

  const [step, setStep] = useState<Step>(initialEmail ? 'otp' : 'email');
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [otpError, setOtpError] = useState(false);

  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail || '');
      setOtp('');
      setStep(initialEmail ? 'otp' : 'email');
      setLoading(false);
      setResending(false);
      setOtpError(false);
      if (initialEmail) {
        setCooldown(60);
      }
    } else {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
      setCooldown(0);
    }
  }, [isOpen, initialEmail]);

  useEffect(() => {
    if (cooldown <= 0) return;
    cooldownTimerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, [cooldown]);

  if (!isOpen) return null;

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();

    if (!trimmed) {
      notify.error('Please enter your email address.', 'Email Required');
      return;
    }
    if (!validateEmail(trimmed)) {
      notify.error('Please enter a valid email address.', 'Invalid Email');
      return;
    }

    setLoading(true);
    try {
      await AuthService.sendEmailVerificationOtp(trimmed);
      notify.success(
        `A 6-digit verification code has been sent to ${trimmed}.`,
        'OTP Sent'
      );
      setStep('otp');
      setCooldown(60);
      setOtp('');
      setOtpError(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to send verification OTP. Please try again.';
      notify.error(msg, 'Failed to Send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || resending) return;
    const trimmed = email.trim().toLowerCase();

    setResending(true);
    try {
      await AuthService.sendEmailVerificationOtp(trimmed);
      notify.success(
        `A new 6-digit verification code has been sent to ${trimmed}.`,
        'OTP Resent'
      );
      setCooldown(60);
      setOtp('');
      setOtpError(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resend code. Please wait and try again.';
      notify.error(msg, 'Resend Failed');
    } finally {
      setResending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      notify.error('Please enter the complete 6-digit verification code.', 'Incomplete OTP');
      setOtpError(true);
      return;
    }

    setLoading(true);
    setOtpError(false);
    try {
      const res = await AuthService.verifyEmailOtp(email, otp);
      if (res.valid !== false) {
        notify.success('Your email address has been successfully verified!', 'Email Verified');
        setStep('verified');
        onVerified?.(email);
      } else {
        setOtpError(true);
        notify.error('The verification code is invalid or has expired.', 'Verification Failed');
      }
    } catch (err: unknown) {
      setOtpError(true);
      const msg = err instanceof Error ? err.message : 'Verification failed. Please check the code.';
      notify.error(msg, 'Invalid Code');
    } finally {
      setLoading(false);
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
        className="relative w-full max-w-md rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#211E1B] p-6 sm:p-8 shadow-2xl shadow-zinc-950/20 dark:shadow-black/70 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dismiss Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-950 dark:hover:text-white flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Modal Header Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 mb-3">
          <Mail size={12} />
          <span>Email Verification</span>
        </div>

        {/* STEP 1: ENTER EMAIL */}
        {step === 'email' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight mb-1.5">
              Verify Your Email
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              Enter your email address to receive a 6-digit one-time verification passcode.
            </p>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="verify-email-input" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail size={15} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                  <input
                    id="verify-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    autoFocus
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#E8510E] dark:focus:ring-[#F06A32] transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-zinc-950 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-150 text-white dark:text-zinc-950 text-xs font-bold tracking-tight shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: VERIFY 6-DIGIT OTP */}
        {step === 'otp' && (
          <div>
            <button
              type="button"
              onClick={() => setStep('email')}
              disabled={loading || resending}
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-semibold mb-3 cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft size={13} />
              <span>Change email</span>
            </button>

            <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight mb-1.5">
              Enter Verification Code
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              We&apos;ve sent a 6-digit OTP code to <strong>{email}</strong>.
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <OtpInput
                  value={otp}
                  onChange={(val) => {
                    setOtp(val);
                    if (otpError) setOtpError(false);
                  }}
                  disabled={loading}
                  isError={otpError}
                  isSuccess={otp.length === 6 && !otpError}
                  autoFocus
                />
                {otpError && (
                  <p className="text-xs text-center text-red-600 dark:text-red-400 font-medium">
                    Please enter the correct 6-digit code.
                  </p>
                )}
              </div>

              {/* Resend OTP button with cooldown timer */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-zinc-500">Didn&apos;t receive code?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={cooldown > 0 || resending || loading}
                  className="font-semibold text-[#E8510E] dark:text-[#F06A32] hover:underline disabled:text-zinc-400 dark:disabled:text-zinc-600 disabled:no-underline cursor-pointer disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                >
                  {resending && <RefreshCw size={12} className="animate-spin" />}
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-zinc-950 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-150 text-white dark:text-zinc-950 text-xs font-bold tracking-tight shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Verifying code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} />
                    <span>Verify Email</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: VERIFIED */}
        {step === 'verified' && (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-2xs">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight mb-2">
              Email Verified Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              <strong>{email}</strong> has been confirmed. Your account is active and verified.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex items-center justify-center py-3 px-6 rounded-full bg-zinc-950 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-150 text-white dark:text-zinc-950 text-xs font-bold tracking-tight shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Continue
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
