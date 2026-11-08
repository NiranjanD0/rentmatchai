import React from 'react';
import { Skeleton } from '@/src/components/ui/skeleton';

export function DashboardShellSkeleton() {
  return (
    <div className="min-h-screen w-full flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 select-none transition-colors duration-200">
      {/* Sidebar Skeleton */}
      <aside className="hidden lg:flex w-64 flex-col justify-between p-4 border-r border-zinc-200/80 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 h-screen sticky top-0 shrink-0">
        <div className="space-y-4">
          {/* Logo Skeleton */}
          <div className="flex items-center gap-2.5 px-1 py-1 pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
            <Skeleton className="size-8 rounded-lg bg-zinc-200/80 dark:bg-zinc-800/80" />
            <Skeleton className="h-4 w-28 rounded-md bg-zinc-200/80 dark:bg-zinc-800/80" />
          </div>

          {/* Nav Items Skeleton */}
          <div className="space-y-1 pt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 flex items-center gap-2.5 px-3 rounded-lg">
                <Skeleton className="size-4 rounded bg-zinc-200/70 dark:bg-zinc-800/70" />
                <Skeleton className="h-3.5 flex-1 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
              </div>
            ))}
          </div>
        </div>

        {/* User Card Skeleton */}
        <div className="p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-900/50 flex items-center gap-2.5">
          <Skeleton className="size-9 rounded-full bg-zinc-200/70 dark:bg-zinc-800/70" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-3.5 w-24 rounded bg-zinc-200/80 dark:bg-zinc-800/80" />
            <Skeleton className="h-3 w-16 rounded bg-zinc-200/50 dark:bg-zinc-800/50" />
          </div>
        </div>
      </aside>

      {/* Main Workspace Skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar Skeleton */}
        <header className="h-14 px-6 border-b border-zinc-200/80 dark:border-zinc-800/60 bg-white/95 dark:bg-zinc-950/95 flex items-center justify-between sticky top-0 z-20">
          <Skeleton className="h-5 w-32 rounded-md bg-zinc-200/80 dark:bg-zinc-800/80" />
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-8 rounded-lg bg-zinc-200/60 dark:bg-zinc-800/60" />
            <Skeleton className="size-8 rounded-lg bg-zinc-200/60 dark:bg-zinc-800/60" />
          </div>
        </header>

        {/* Content Area Skeleton */}
        <main className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-lg bg-zinc-200/80 dark:bg-zinc-800/80" />
            <Skeleton className="h-4 w-72 rounded-md bg-zinc-200/60 dark:bg-zinc-800/60" />
          </div>

          {/* Metric Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3.5 w-20 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
                  <Skeleton className="size-7 rounded-md bg-zinc-200/70 dark:bg-zinc-800/70" />
                </div>
                <Skeleton className="h-6 w-16 rounded-md bg-zinc-200/80 dark:bg-zinc-800/80" />
              </div>
            ))}
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 overflow-hidden space-y-3"
              >
                <Skeleton className="w-full aspect-[16/10] bg-zinc-200/70 dark:bg-zinc-800/70 rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded bg-zinc-200/80 dark:bg-zinc-800/80" />
                  <Skeleton className="h-3.5 w-1/2 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
