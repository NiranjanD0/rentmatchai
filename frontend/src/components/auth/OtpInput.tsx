'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function OtpInput({
  value = '',
  onChange,
  disabled = false,
  isError = false,
  isSuccess = false,
  autoFocus = true,
  className = '',
}: OtpInputProps) {
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const digit = rawVal.replace(/\D/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = digit;
    const combined = newDigits.join('').slice(0, 6);
    onChange(combined);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        e.preventDefault();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    onChange(pasted);
    const targetIdx = Math.min(pasted.length, 5);
    inputRefs.current[targetIdx]?.focus();
  };

  return (
    <div className={cn('flex items-center justify-center gap-2 sm:gap-2.5', className)}>
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputRefs.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete={idx === 0 ? 'one-time-code' : 'off'}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            'w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-mono rounded-xl border transition-all outline-none',
            'bg-zinc-50 dark:bg-zinc-900/60 text-zinc-950 dark:text-white',
            'border-zinc-200 dark:border-zinc-800',
            'focus:border-[#E8510E] dark:focus:border-[#F06A32] focus:ring-2 focus:ring-[#E8510E]/20 dark:focus:ring-[#F06A32]/20',
            isError && 'border-red-500 dark:border-red-500 text-red-600 focus:ring-red-500/20 focus:border-red-500',
            isSuccess && 'border-emerald-500 dark:border-emerald-500 text-emerald-600 focus:ring-emerald-500/20 focus:border-emerald-500',
            disabled && 'opacity-50 cursor-not-allowed bg-zinc-100 dark:bg-zinc-950'
          )}
          aria-label={`Digit ${idx + 1} of verification code`}
        />
      ))}
    </div>
  );
}
