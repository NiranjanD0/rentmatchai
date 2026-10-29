'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Search,
  Compass,
  ArrowUpDown,
  Sparkles,
  ShieldCheck,
  Building2,
  X,
  Bookmark,
} from 'lucide-react';
import { PropertyCard } from '@/src/components/property';
import { useProperty } from '@/src/context/PropertyContext';
import { usePageCurtains } from '@/src/components/ui/page-curtains';
import { Button } from '@/src/components/ui/button';

export default function DashboardShortlistPage() {
  const router = useRouter();
  const { properties, saved, toggleSave } = useProperty();
  const { navigateWithCurtains } = usePageCurtains();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'recent' | 'price-asc' | 'price-desc' | 'match'>('recent');

  // Filter properties in shortlist
  const savedProperties = useMemo(() => {
    return properties.filter((p) => saved.includes(p.id));
  }, [properties, saved]);

  // Search & Sort within shortlisted properties
  const displayedProperties = useMemo(() => {
    let list = [...savedProperties];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (sortOption === 'price-asc') {
      list.sort((a, b) => a.rent - b.rent);
    } else if (sortOption === 'price-desc') {
      list.sort((a, b) => b.rent - a.rent);
    } else if (sortOption === 'match') {
      list.sort((a, b) => (b.match || 0) - (a.match || 0));
    }

    return list;
  }, [savedProperties, searchQuery, sortOption]);

  const handleOpenDetails = (id: string) => {
    navigateWithCurtains(`/properties/${id}`, 'Property Details');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              My Shortlist
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Bookmark size={11} className="fill-emerald-500/20" />
              {savedProperties.length} Saved
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Compare your favorite verified homes or contact verified direct owners.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWithCurtains('/dashboard/explore', 'Find Properties')}
            className="h-9 text-xs gap-1.5 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer shadow-2xs"
          >
            <Compass size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>Find More Properties</span>
          </Button>
        </div>
      </div>

      {/* 2. Search & Sort Bar (if 2+ saved properties) */}
      {savedProperties.length > 1 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved homes by title, area, or amenities..."
              className="w-full h-10 pl-9 pr-9 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-hidden focus:border-zinc-400 dark:focus:border-zinc-600 shadow-2xs transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 rounded cursor-pointer"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="relative shrink-0">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="h-10 pl-3 pr-8 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-zinc-400 dark:focus:border-zinc-600 shadow-2xs appearance-none cursor-pointer transition-colors"
            >
              <option value="recent">Sort: Recently Added</option>
              <option value="match">Sort: Highest Match</option>
              <option value="price-asc">Sort: Price: Low to High</option>
              <option value="price-desc">Sort: Price: High to Low</option>
            </select>
            <ArrowUpDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none"
            />
          </div>
        </div>
      )}

      {/* 3. Property Grid or Empty State */}
      {displayedProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedProperties.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              isSaved={true}
              onToggleSave={toggleSave}
              onOpenDetails={handleOpenDetails}
            />
          ))}
        </div>
      ) : savedProperties.length > 0 ? (
        /* Filtered Empty State */
        <div className="py-16 px-6 text-center rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800/80 shadow-2xs">
          <div className="size-14 mx-auto rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center mb-4">
            <Search size={26} />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            No matching saved properties
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-4">
            No homes in your shortlist match &ldquo;{searchQuery}&rdquo;.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="text-xs cursor-pointer"
          >
            Clear Search
          </Button>
        </div>
      ) : (
        /* Empty Shortlist State */
        <div className="py-20 px-6 text-center rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800/80 shadow-2xs">
          <div className="size-16 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
            <Heart size={30} className="fill-emerald-500/20" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
            Your shortlist is empty
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mt-1 mb-6 leading-relaxed">
            Explore verified direct rental listings across Gandhinagar and tap the heart icon on any home to save it for easy comparison and direct inquiries.
          </p>
          <Button
            onClick={() => navigateWithCurtains('/dashboard/explore', 'Find Properties')}
            className="h-10 text-xs px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2 shadow-xs cursor-pointer"
          >
            <Compass size={15} />
            <span>Find Available Properties</span>
          </Button>
        </div>
      )}
    </div>
  );
}
