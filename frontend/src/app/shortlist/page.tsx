'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Search, ArrowUpRight, Bookmark, CircleHelp } from 'lucide-react';
import PropertyCard from '../../components/PropertyCard';
import { useProperty } from '../../context/PropertyContext';

export default function ShortlistRoute() {
  const router = useRouter();
  const { properties, saved, toggleSave } = useProperty();

  const savedProperties = properties.filter((p) => saved.includes(p.id));

  return (
    <div className="wrap shortlist-page">
      {/* Title Header */}
      <div className="shortlist-title">
        <div>
          <small className="kicker">YOUR PERSONAL SAVED HOMES</small>
          <h1>Homes worth a second look.</h1>
          <p>Keep your favorite rental properties together while deciding what feels best for you.</p>
        </div>
        <div className="saved-count">
          <Heart size={20} />
          <b>{savedProperties.length}</b>
          <small>saved homes</small>
        </div>
      </div>

      {savedProperties.length > 0 ? (
        <>
          <div className="shortlist-toolbar">
            <b>
              <Bookmark size={16} /> Saved Collection ({savedProperties.length})
            </b>
            <button className="link" onClick={() => router.push('/explore')}>
              Find more homes <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="cards shortlist-cards">
            {savedProperties.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                isSaved={true}
                onToggleSave={toggleSave}
                onOpenDetails={(id) => router.push(`/properties/${id}`)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="empty-shortlist">
          <Heart size={40} />
          <h3>No saved homes yet</h3>
          <p>Tap the heart icon on any listing card or detail view to save it to your personal shortlist.</p>
          <button className="primary" onClick={() => router.push('/explore')}>
            <Search size={16} /> Explore Available Rentals
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
