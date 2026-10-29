import React from 'react';
import { Skeleton } from '@/src/components/ui/skeleton';

export function AuthCardSkeleton({ mode = 'login' }: { mode?: 'login' | 'signup' }) {
  return (
    <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 shadow-sm space-y-6 select-none">
      {/* Title & Subtitle */}
      <div className="space-y-2 text-center flex flex-col items-center">
        <Skeleton className="h-7 w-48 rounded-lg bg-zinc-200/80 dark:bg-zinc-800/80" />
        <Skeleton className="h-4 w-64 rounded-md bg-zinc-200/60 dark:bg-zinc-800/60" />
      </div>

      {/* Role Selector Skeleton (if signup) */}
      {mode === 'signup' && (
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900">
          <Skeleton className="h-9 rounded-lg bg-zinc-200/80 dark:bg-zinc-800/80" />
          <Skeleton className="h-9 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50" />
        </div>
      )}

      {/* Social Button Skeleton */}
      <Skeleton className="h-10 w-full rounded-xl bg-zinc-200/70 dark:bg-zinc-800/70" />

      {/* Separator */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
        <Skeleton className="h-3 w-16 rounded bg-zinc-200/50 dark:bg-zinc-800/50" />
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {mode === 'signup' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-16 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
              <Skeleton className="h-10 w-full rounded-xl bg-zinc-200/70 dark:bg-zinc-800/70" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-16 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
              <Skeleton className="h-10 w-full rounded-xl bg-zinc-200/70 dark:bg-zinc-800/70" />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-20 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
          <Skeleton className="h-10 w-full rounded-xl bg-zinc-200/70 dark:bg-zinc-800/70" />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3.5 w-16 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            {mode === 'login' && <Skeleton className="h-3 w-24 rounded bg-zinc-200/50 dark:bg-zinc-800/50" />}
          </div>
          <Skeleton className="h-10 w-full rounded-xl bg-zinc-200/70 dark:bg-zinc-800/70" />
        </div>
      </div>

      {/* Submit Button */}
      <Skeleton className="h-11 w-full rounded-xl bg-violet-500/25 dark:bg-violet-500/30" />

      {/* Footer Switch Link */}
      <div className="flex justify-center pt-2">
        <Skeleton className="h-3.5 w-48 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
      </div>
    </div>
  );
}
