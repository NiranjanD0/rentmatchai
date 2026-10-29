import React from 'react';
import { Skeleton } from '@/src/components/ui/skeleton';

export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs min-w-0">
      {/* Property Image Skeleton */}
      <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <Skeleton className="h-full w-full rounded-none bg-zinc-200/70 dark:bg-zinc-800/70" />
        <div className="absolute top-3.5 left-3.5 flex gap-2">
          <Skeleton className="h-5 w-20 rounded-md bg-white/60 dark:bg-zinc-700/60" />
        </div>
        <div className="absolute top-3.5 right-3.5">
          <Skeleton className="h-8 w-8 rounded-full bg-white/60 dark:bg-zinc-700/60" />
        </div>
        <div className="absolute bottom-3 left-3">
          <Skeleton className="h-5 w-24 rounded-md bg-white/60 dark:bg-zinc-700/60" />
        </div>
      </div>

      {/* Property Details Content Skeleton */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-5 w-3/4 rounded-lg bg-zinc-200/80 dark:bg-zinc-800/80" />
            <Skeleton className="h-4 w-12 rounded-md bg-zinc-200/60 dark:bg-zinc-800/60" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-4 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60" />
            <Skeleton className="h-3.5 w-1/2 rounded-md bg-zinc-200/60 dark:bg-zinc-800/60" />
          </div>
        </div>

        {/* Specs Row */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-12 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            <Skeleton className="h-4 w-12 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            <Skeleton className="h-4 w-14 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
          </div>
          <Skeleton className="h-5 w-16 rounded-md bg-zinc-200/80 dark:bg-zinc-800/80" />
        </div>
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
