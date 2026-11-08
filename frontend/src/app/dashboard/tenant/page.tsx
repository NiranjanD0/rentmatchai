'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Compass,
  Heart,
  Inbox,
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

export default function TenantDashboardPage() {
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
      {/* 1. Welcome Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Verified Renter · {targetLocation}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Welcome back, {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Track your saved Gandhinagar properties, chat directly with verified homeowners, and discover new verified rental matches.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <Button
              onClick={() => navigateWithCurtains('/dashboard/ai-search', 'AI Search')}
              className="h-10 text-xs px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 font-semibold gap-2 shadow-xs cursor-pointer active:scale-[0.99]"
            >
              <Sparkles size={14} />
              <span>AI Search</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigateWithCurtains('/dashboard/explore', 'Find Properties')}
              className="h-10 text-xs px-4 rounded-xl border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 font-medium gap-2 cursor-pointer shadow-2xs active:scale-[0.99]"
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
            <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
              {preferredBhk}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
              Under {budgetMax}/mo
            </span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
              {targetLocation}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigateWithCurtains('/profile?tab=preferences', 'Preferences')}
            className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer font-medium"
          >
            <SlidersHorizontal size={13} />
            <span>Edit Criteria</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Saved Homes */}
        <div
          onClick={() => navigateWithCurtains('/dashboard/shortlist', 'My Shortlist')}
          className="group p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-150 cursor-pointer shadow-2xs hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Shortlisted Homes</span>
            <div className="size-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
              <Heart size={15} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {saved.length}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">saved</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            Ready for comparison & visits
          </p>
        </div>

        {/* Metric 2: Active Inquiries */}
        <div
          onClick={() => navigateWithCurtains('/dashboard/inbox', 'Inbox')}
          className="group p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-150 cursor-pointer shadow-2xs hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Direct Inquiries</span>
            <div className="size-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
              <Inbox size={15} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              3
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Active chats</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            Replies from verified listers
          </p>
        </div>

        {/* Metric 3: Best Match Score */}
        <div
          onClick={() => navigateWithCurtains('/dashboard/explore', 'Find Properties')}
          className="group p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-150 cursor-pointer shadow-2xs hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Top Match Rating</span>
            <div className="size-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
              <Sparkles size={15} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {topMatches[0]?.match ? `${topMatches[0].match}%` : '96%'}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">fit</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            Matches commute & amenities
          </p>
        </div>

        {/* Metric 4: Renter Verification */}
        <div
          onClick={() => navigateWithCurtains('/profile?tab=personal', 'Profile')}
          className="group p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-150 cursor-pointer shadow-2xs hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Account Safety</span>
            <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              100%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Verified</span>
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
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
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
            className="text-xs gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
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
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 text-center bg-white/50 dark:bg-zinc-900/30">
            <div className="size-12 mx-auto rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center mb-3">
              <Heart size={20} />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              No saved homes yet
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-4">
              Explore verified Gandhinagar listings and tap the heart icon to shortlist homes you love.
            </p>
            <Button
              size="sm"
              onClick={() => navigateWithCurtains('/dashboard/explore', 'Find Properties')}
              className="text-xs rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
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
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
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
            className="text-xs gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
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

      {/* 5. Direct Landlord Conversations Snapshot */}
      <section className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
              Active Conversations
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Direct discussions with verified property owners
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWithCurtains('/dashboard/inbox', 'Inbox')}
            className="text-xs gap-1.5 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer"
          >
            <Inbox size={13} />
            <span>Open Inbox</span>
          </Button>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
          {[
            {
              id: '1',
              name: 'Dr. Ramesh Patel',
              property: '3 BHK High-Floor Flat, Kudasan',
              lastMessage: 'Sure, you are welcome to visit tomorrow between 4 PM and 6 PM.',
              time: '12m ago',
              unread: 1,
            },
            {
              id: '2',
              name: 'Sunita Sharma',
              property: '2 BHK Fully Furnished, Infocity',
              lastMessage: 'Maintenance includes covered car parking and water charges.',
              time: '2h ago',
              unread: 2,
            },
            {
              id: '3',
              name: 'Amit Shah',
              property: '1 BHK Cozy Studio, Raysan',
              lastMessage: 'The security deposit is 2 months rent, fully refundable on vacating.',
              time: 'Yesterday',
              unread: 0,
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => navigateWithCurtains('/dashboard/inbox', 'Inbox')}
              className="py-3.5 flex items-center justify-between gap-4 hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 -mx-3 px-3 rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="size-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-xs flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700/60">
                  {item.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">· {item.property}</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    {item.lastMessage}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{item.time}</span>
                {item.unread > 0 && (
                  <span className="size-5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[10px] font-bold flex items-center justify-center">
                    {item.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
