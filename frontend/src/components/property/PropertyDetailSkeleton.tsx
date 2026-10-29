import React from 'react';
import { Skeleton } from '@/src/components/ui/skeleton';

export function PropertyDetailSkeleton() {
  return (
    <div className="wrap detail-page select-none">
      {/* Back Button Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-8 w-32 rounded-lg bg-zinc-200/70 dark:bg-zinc-800/70" />
      </div>

      {/* Header Info Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="space-y-2.5 flex-1">
          <Skeleton className="h-4 w-44 rounded-md bg-zinc-200/70 dark:bg-zinc-800/70" />
          <Skeleton className="h-8 w-3/4 max-w-lg rounded-xl bg-zinc-200/80 dark:bg-zinc-800/80" />
          <Skeleton className="h-4 w-72 rounded-md bg-zinc-200/60 dark:bg-zinc-800/60" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 rounded-xl bg-zinc-200/70 dark:bg-zinc-800/70" />
          <Skeleton className="h-9 w-32 rounded-xl bg-zinc-200/70 dark:bg-zinc-800/70" />
        </div>
      </div>

      {/* Gallery Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80">
          <Skeleton className="w-full h-full rounded-none bg-zinc-200/70 dark:bg-zinc-800/70" />
        </div>
        <div className="hidden lg:flex flex-col gap-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex-1">
            <Skeleton className="w-full h-full rounded-none bg-zinc-200/70 dark:bg-zinc-800/70" />
          </div>
          <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl bg-zinc-200/70 dark:bg-zinc-800/70 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-3/4 rounded bg-zinc-200/70 dark:bg-zinc-800/70" />
              <Skeleton className="h-3 w-1/2 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Columns: Main Space Details + Rent Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: The Space */}
          <div className="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 space-y-4">
            <Skeleton className="h-3 w-20 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            <Skeleton className="h-6 w-48 rounded-lg bg-zinc-200/80 dark:bg-zinc-800/80" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
              <Skeleton className="h-4 w-5/6 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
              <Skeleton className="h-4 w-2/3 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            </div>

            {/* Spec Cards */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center gap-2"
                >
                  <Skeleton className="h-6 w-6 rounded-md bg-zinc-200/70 dark:bg-zinc-800/70" />
                  <Skeleton className="h-4 w-20 rounded bg-zinc-200/70 dark:bg-zinc-800/70" />
                  <Skeleton className="h-3 w-16 rounded bg-zinc-200/50 dark:bg-zinc-800/50" />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Amenities */}
          <div className="p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 space-y-4">
            <Skeleton className="h-3 w-24 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            <Skeleton className="h-6 w-40 rounded-lg bg-zinc-200/80 dark:bg-zinc-800/80" />
            <div className="flex flex-wrap gap-2.5 pt-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-28 rounded-full bg-zinc-200/70 dark:bg-zinc-800/70" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Rent Box Skeleton */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 space-y-5 shadow-xs">
            <Skeleton className="h-3 w-24 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-8 w-36 rounded-lg bg-zinc-200/80 dark:bg-zinc-800/80" />
              <Skeleton className="h-4 w-12 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            </div>

            <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-3.5 w-24 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
                  <Skeleton className="h-3.5 w-20 rounded bg-zinc-200/70 dark:bg-zinc-800/70" />
                </div>
              ))}
            </div>

            <div className="space-y-2.5 pt-4">
              <Skeleton className="h-11 w-full rounded-xl bg-violet-500/20 dark:bg-violet-500/20" />
              <Skeleton className="h-11 w-full rounded-xl bg-zinc-200/70 dark:bg-zinc-800/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
