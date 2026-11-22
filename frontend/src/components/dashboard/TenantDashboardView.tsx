'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Compass,
  Heart,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Building2,
  SlidersHorizontal,
  ArrowUpRight,
  MessageSquare,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useProperty } from '@/src/context/PropertyContext';
import { usePageCurtains } from '@/src/components/ui/page-curtains';
import { PropertyCard } from '@/src/components/property';
import { Button } from '@/src/components/ui/button';

const money = (n: number) => '₹' + Number(n).toLocaleString('en-IN');

export default function TenantDashboardView() {
  const { user } = useAuth();
  const { properties, activeProperties, saved, toggleSave } = useProperty();
  const { navigateWithCurtains } = usePageCurtains();

  // Saved properties from real context
  const savedProperties = useMemo(() => {
    return properties.filter((p) => saved.includes(p.id));
  }, [properties, saved]);

  // Top AI matches from active properties
  const topMatches = useMemo(() => {
    const list = [...activeProperties];
    return list.sort((a, b) => (b.match || 0) - (a.match || 0)).slice(0, 3);
  }, [activeProperties]);

  const displayName = user?.firstName || 'Renter';
  const targetLocation = user?.preferences?.targetLocation || 'Gandhinagar';
  const preferredBhk = user?.preferences?.preferredBhk || '2 BHK';
  const budgetMax = user?.preferences?.budgetMax ? money(user.preferences.budgetMax) : '₹25,000';

  const handleOpenDetails = (id: string) => {
    navigateWithCurtains(`/properties/${id}`, 'Property Details');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 select-none">
      {/* 1. Welcome Header Banner (standard clean card) */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/60 shadow-2xs">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Verified Renter · {targetLocation}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
              Welcome back, {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed text-pretty">
              Track your saved Gandhinagar properties, chat directly with verified homeowners, and discover new verified rental matches.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <Button
              onClick={() => navigateWithCurtains('/dashboard/ai-search', 'AI Search')}
              className="h-10 text-xs px-5 rounded-lg bg-zinc-950 hover:bg-zinc-850 text-white dark:bg-white dark:hover:bg-zinc-150 dark:text-zinc-950 font-bold gap-2 shadow-sm cursor-pointer active:scale-95 transition-all"
            >
              <Sparkles size={14} />
              <span>AI Search</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigateWithCurtains('/dashboard/explore', 'Find Properties')}
              className="h-10 text-xs px-5 rounded-lg border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 font-semibold gap-2 cursor-pointer shadow-2xs active:scale-95 transition-all"
            >
              <Compass size={14} />
              <span>Browse All Homes</span>
            </Button>
          </div>
        </div>

        {/* Current Search Criteria Ribbon */}
        <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Search Criteria:</span>
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium border border-zinc-200/50 dark:border-zinc-700/50">
              {preferredBhk}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium border border-zinc-200/50 dark:border-zinc-700/50 tabular-nums">
              Under {budgetMax}/mo
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium border border-zinc-200/50 dark:border-zinc-700/50">
              {targetLocation}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigateWithCurtains('/dashboard/profile?tab=preferences', 'Preferences')}
            className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer font-medium active:scale-95"
          >
            <SlidersHorizontal size={13} />
            <span>Edit Criteria</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Row (standard clean tiles with tabular figures) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Saved Homes */}
        <div
          onClick={() => navigateWithCurtains('/dashboard/shortlist', 'My Shortlist')}
          className="group p-6 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-200 cursor-pointer shadow-2xs hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Shortlisted Homes</span>
            <div className="size-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shadow-2xs">
              <Heart size={15} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white tabular-nums">
              {saved.length}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">saved</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            Ready for comparison & visits
          </p>
        </div>

        {/* Metric 2: Available Rentals */}
        <div
          onClick={() => navigateWithCurtains('/dashboard/explore', 'Find Properties')}
          className="group p-6 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-200 cursor-pointer shadow-2xs hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Available Homes</span>
            <div className="size-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shadow-2xs">
              <Compass size={15} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white tabular-nums">
              {activeProperties.length}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Verified direct</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            Browse Gandhinagar listings
          </p>
        </div>

        {/* Metric 3: Best Match Score */}
        <div
          onClick={() => navigateWithCurtains('/dashboard/explore', 'Find Properties')}
          className="group p-6 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-200 cursor-pointer shadow-2xs hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Top Match Rating</span>
            <div className="size-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shadow-2xs">
              <Sparkles size={15} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white tabular-nums">
              {topMatches[0]?.match ? `${topMatches[0].match}%` : '96%'}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">fit</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            Matches commute & amenities
          </p>
        </div>

        {/* Metric 4: Renter Verification */}
        <div
          onClick={() => navigateWithCurtains('/dashboard/profile?tab=personal', 'Profile')}
          className="group p-6 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-200 cursor-pointer shadow-2xs hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Account Safety</span>
            <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white tabular-nums">
              100%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Verified</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            Direct owner contact enabled
          </p>
        </div>
      </div>

      {/* 3. Shortlisted Homes Spotlight */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Your Shortlist
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Homes you saved for quick comparison and visit scheduling
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWithCurtains('/dashboard/shortlist', 'My Shortlist')}
            className="text-xs gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer active:scale-95"
          >
            <span>View All ({saved.length})</span>
            <ArrowRight size={13} />
          </Button>
        </div>

        {savedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {savedProperties.slice(0, 3).map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isSaved={true}
                onToggleSave={toggleSave}
                onOpenDetails={handleOpenDetails}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 sm:p-10 text-center bg-white/50 dark:bg-zinc-900/30">
            <div className="size-12 mx-auto rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center mb-3">
              <Heart size={20} />
            </div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
              No saved homes yet
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
              Explore verified Gandhinagar listings and tap the heart icon to shortlist homes you love.
            </p>
            <Button
              size="sm"
              onClick={() => navigateWithCurtains('/dashboard/explore', 'Find Properties')}
              className="text-xs rounded-lg bg-zinc-950 hover:bg-zinc-850 text-white dark:bg-white dark:hover:bg-zinc-150 dark:text-zinc-950 cursor-pointer font-bold px-5 active:scale-95 shadow-xs"
            >
              Browse Listings
            </Button>
          </div>
        )}
      </section>

      {/* 4. Top Recommended AI Matches */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Top Matches for Your Profile
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Ranked by commute time, budget compatibility, and amenity matches in Gandhinagar
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWithCurtains('/dashboard/explore', 'Find Properties')}
            className="text-xs gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer active:scale-95"
          >
            <span>Explore All</span>
            <ArrowRight size={13} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {topMatches.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isSaved={saved.includes(property.id)}
              onToggleSave={toggleSave}
              onOpenDetails={handleOpenDetails}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

