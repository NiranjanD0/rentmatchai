'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Search, ArrowUpRight, Bookmark, CircleHelp } from 'lucide-react';
import { PropertyCard } from '@/src/components/property';
import { useProperty } from '../../context/PropertyContext';
import { usePageCurtains } from '../../components/ui/page-curtains';

export default function ShortlistRoute() {
  const router = useRouter();
  const { properties, saved, toggleSave } = useProperty();
  const { navigateWithCurtains } = usePageCurtains();

  const savedProperties = properties.filter((p) => saved.includes(p.id));

  return (
    <div className="wrap shortlist-page text-zinc-900 dark:text-zinc-100">
      {/* Title Header */}
      <div className="shortlist-title">
        <div>
          <small className="kicker">YOUR PERSONAL SAVED HOMES</small>
          <h1 className="text-zinc-900 dark:text-white">Homes worth a second look.</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Keep your favorite rental properties together while deciding what feels best for you.</p>
        </div>
        <div className="saved-count bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white">
          <Heart size={20} className="text-emerald-600 dark:text-emerald-400" />
          <b>{savedProperties.length}</b>
          <small className="text-zinc-500 dark:text-zinc-400">saved homes</small>
        </div>
      </div>

      {savedProperties.length > 0 ? (
        <>
          <div className="shortlist-toolbar border-b border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
            <b>
              <Bookmark size={16} className="text-emerald-600 dark:text-emerald-400" /> Saved Collection ({savedProperties.length})
            </b>
            <button
              type="button"
              className="link text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
              onClick={() => navigateWithCurtains('/explore', 'Explore Homes')}
            >
              <span>Find more homes</span>
              <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="cards shortlist-cards">
            {savedProperties.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                isSaved={true}
                onToggleSave={toggleSave}
                onOpenDetails={(id) => navigateWithCurtains(`/properties/${id}`, 'Property Details')}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="empty-shortlist bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Heart size={32} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No saved homes yet</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
            Tap the heart icon on any listing card or detail view to save it to your personal shortlist.
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
            onClick={() => navigateWithCurtains('/explore', 'Explore Homes')}
          >
            <Search size={16} />
            <span>Explore Available Rentals</span>
          </button>
        </div>
      )}

      <div className="sample-note shortlist-note">
        <CircleHelp size={16} />
        <span>
          Shortlisted properties are automatically saved to your browser session storage so you don&apos;t lose them between visits.
        </span>
      </div>
    </div>
  );
}
