'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  X,
  MapPin,
  Building2,
  Sparkles,
  ShieldCheck,
  ArrowUpDown,
  Check,
  Compass,
} from 'lucide-react';
import { PropertyCard, PropertyGridSkeleton } from '@/src/components/property';
import { Skeleton } from '@/src/components/ui/skeleton';
import { useProperty } from '@/src/context/PropertyContext';
import { usePageCurtains } from '@/src/components/ui/page-curtains';
import { Button } from '@/src/components/ui/button';

const money = (n: number | string) => '₹' + Number(n).toLocaleString('en-IN');

const POPULAR_AREAS = [
  'All Areas',
  'Kudasan',
  'Infocity',
  'Sargasan',
  'Raysan',
  'Vavol',
  'Randesan',
  'Bhaijipura',
];

const BHK_OPTIONS = ['Any', '1', '2', '3+'];

const FURNISHING_OPTIONS = [
  'Any',
  'Fully furnished',
  'Semi-furnished',
  'Unfurnished',
];

const SORT_OPTIONS = [
  { label: 'Best match', value: 'Best match' },
  { label: 'Lowest rent', value: 'Lowest rent' },
  { label: 'Highest rent', value: 'Highest rent' },
  { label: 'Commute time', value: 'Commute time' },
];

function DashboardExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeProperties, saved, toggleSave } = useProperty();
  const { navigateWithCurtains } = usePageCurtains();

  const [mounted, setMounted] = useState(false);
  const initialQuery = searchParams.get('query') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialBudget = searchParams.get('budget') || '50000';

  const [query, setQuery] = useState(initialQuery);
  const [selectedArea, setSelectedArea] = useState(initialLocation ? initialLocation : 'All Areas');
  const [budget, setBudget] = useState(initialBudget);
  const [bedrooms, setBedrooms] = useState('Any');
  const [furnishing, setFurnishing] = useState('Any');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState('Best match');
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter & Sort properties
  const results = useMemo(() => {

    const list = activeProperties.filter((p) => {
      // 1. Location match
      const locMatch =
        selectedArea === 'All Areas' ||
        p.location.toLowerCase().includes(selectedArea.toLowerCase());

      // 2. Budget match
      const maxRent = !budget || p.rent <= Number(budget);

      // 3. Bedrooms match
      const bedMatch =
        bedrooms === 'Any' ||
        (bedrooms === '3+' ? p.bedrooms >= 3 : p.bedrooms === Number(bedrooms));

      // 4. Furnishing match
      const furnMatch = furnishing === 'Any' || p.furnishing === furnishing;

      // 5. Verified only match
      const verifiedMatch = !verifiedOnly || Boolean(p.verified);

      // 6. Query keyword search
      const q = query.trim().toLowerCase();
      const textMatch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);

      return locMatch && maxRent && bedMatch && furnMatch && verifiedMatch && textMatch;
    });

    if (sort === 'Lowest rent') {
      list.sort((a, b) => a.rent - b.rent);
    } else if (sort === 'Highest rent') {
      list.sort((a, b) => b.rent - a.rent);
    } else if (sort === 'Commute time') {
      list.sort((a, b) => parseInt(a.commute || '99') - parseInt(b.commute || '99'));
    } else {
      list.sort((a, b) => (b.match || 0) - (a.match || 0));
    }

    return list;
  }, [activeProperties, selectedArea, budget, bedrooms, furnishing, verifiedOnly, query, sort]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedArea !== 'All Areas') count++;
    if (Number(budget) < 50000) count++;
    if (bedrooms !== 'Any') count++;
    if (furnishing !== 'Any') count++;
    if (verifiedOnly) count++;
    if (query.trim()) count++;
    return count;
  }, [selectedArea, budget, bedrooms, furnishing, verifiedOnly, query]);

  const resetFilters = () => {
    setQuery('');
    setSelectedArea('All Areas');
    setBudget('50000');
    setBedrooms('Any');
    setFurnishing('Any');
    setVerifiedOnly(false);
    setSort('Best match');
  };

  const handleOpenDetails = (id: string) => {
    navigateWithCurtains(`/properties/${id}`, 'Property Details');
  };

  if (!mounted) {
    return <DashboardExploreSkeleton />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">

      {/* 1. Header & Quick Search Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Find Properties
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Explore verified direct-owner listings across Gandhinagar with zero brokerage.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              <span className="size-1.5 rounded-full bg-violet-500 animate-pulse" />
              {results.length} Available
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8 text-xs gap-1.5 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer"
            >
              <SlidersHorizontal size={13} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="size-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold flex items-center justify-center ml-0.5">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Search & Sort Controls Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by area, landmark, or amenities (e.g. Balcony, Infocity, Furnished)..."
              className="w-full h-10 pl-9 pr-9 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-hidden focus:border-zinc-400 dark:focus:border-zinc-600 shadow-2xs transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 rounded cursor-pointer"
                aria-label="Clear search query"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 pl-3 pr-8 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-zinc-400 dark:focus:border-zinc-600 shadow-2xs appearance-none cursor-pointer transition-colors"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort: {opt.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown
                size={13}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter Options Panel */}
      {showFilters && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800/80 shadow-2xs space-y-4 transition-all">
          {/* Locality Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <MapPin size={13} className="text-violet-600 dark:text-violet-400" />
                <span>Locality / Sector</span>
              </label>
              {selectedArea !== 'All Areas' && (
                <button
                  type="button"
                  onClick={() => setSelectedArea('All Areas')}
                  className="text-[11px] text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
                >
                  Clear Area
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {POPULAR_AREAS.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setSelectedArea(area)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer shrink-0 ${
                    selectedArea === area
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xs'
                      : 'bg-zinc-100/80 hover:bg-zinc-200/70 text-zinc-700 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            {/* BHK Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                Bedrooms (BHK)
              </label>
              <div className="flex items-center gap-1.5">
                {BHK_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setBedrooms(opt)}
                    className={`flex-1 text-xs py-1.5 rounded-xl font-medium transition-colors cursor-pointer text-center ${
                      bedrooms === opt
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xs'
                        : 'bg-zinc-100/80 hover:bg-zinc-200/70 text-zinc-700 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 dark:text-zinc-300'
                    }`}
                  >
                    {opt === 'Any' ? 'Any' : opt === '3+' ? '3+ BHK' : `${opt} BHK`}
                  </button>
                ))}
              </div>
            </div>

            {/* Furnishing Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                Furnishing
              </label>
              <div className="flex items-center gap-1.5">
                {FURNISHING_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFurnishing(opt)}
                    className={`flex-1 text-xs py-1.5 px-2 rounded-xl font-medium transition-colors cursor-pointer text-center truncate ${
                      furnishing === opt
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xs'
                        : 'bg-zinc-100/80 hover:bg-zinc-200/70 text-zinc-700 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 dark:text-zinc-300'
                    }`}
                    title={opt}
                  >
                    {opt === 'Any'
                      ? 'Any'
                      : opt === 'Fully furnished'
                      ? 'Furnished'
                      : opt === 'Semi-furnished'
                      ? 'Semi'
                      : 'Unfurnished'}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Budget Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Max Budget
                </label>
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                  {money(budget)}/mo
                </span>
              </div>
              <input
                type="range"
                min="8000"
                max="50000"
                step="1000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full accent-violet-600 dark:accent-violet-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
                <span>₹8k</span>
                <span>₹25k</span>
                <span>₹50k</span>
              </div>
            </div>
          </div>

          {/* Quick Verified Toggle & Reset Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            <button
              type="button"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                verifiedOnly
                  ? 'bg-violet-500/15 text-violet-700 border-violet-500/30 dark:bg-violet-500/20 dark:text-violet-300 dark:border-violet-500/40'
                  : 'bg-zinc-100/80 text-zinc-700 border-transparent hover:bg-zinc-200/70 dark:bg-zinc-800/80 dark:text-zinc-300'
              }`}
            >
              <ShieldCheck size={14} className={verifiedOnly ? 'text-violet-600 dark:text-violet-400' : 'text-zinc-500'} />
              <span>Verified Direct Owners Only</span>
              {verifiedOnly && <Check size={13} className="ml-0.5" />}
            </button>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white gap-1.5 cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset all filters</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 3. Property Cards Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {results.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              isSaved={saved.includes(p.id)}
              onToggleSave={toggleSave}
              onOpenDetails={handleOpenDetails}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 px-6 text-center rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800/80 shadow-2xs">
          <div className="size-14 mx-auto rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center mb-4">
            <Compass size={28} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
            No properties found
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mt-1 mb-6">
            We couldn&apos;t find any rental listings matching your current filter settings. Try expanding your search area or increasing your budget range.
          </p>
          <Button
            onClick={resetFilters}
            className="h-9 text-xs px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold gap-2 shadow-xs cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset All Filters</span>
          </Button>
        </div>
      )}
    </div>
  );
}

export function DashboardExploreSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-48 rounded-lg" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
        </div>

        {/* Search & Sort Skeleton */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl shrink-0" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800/80 shadow-2xs space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-28 rounded" />
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-xl shrink-0" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-8 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-8 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-8 w-full rounded-xl" />
          </div>
        </div>
      </div>

      {/* Property Cards Grid Skeleton */}
      <PropertyGridSkeleton count={6} />
    </div>
  );
}

export default function DashboardExplorePage() {
  return (
    <Suspense fallback={<DashboardExploreSkeleton />}>
      <DashboardExploreContent />
    </Suspense>
  );
}
