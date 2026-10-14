'use client';

import React from 'react';
import { Heart, Search, ArrowUpRight, Bookmark, CircleHelp } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { type Property } from '../constants/initialData';

interface ShortlistPageProps {
  properties?: Property[];
  savedIds?: string[];
  onToggleSave: (id: string) => void;
  onOpenDetails: (id: string) => void;
  onNavigate: (page: string) => void;
}

export default function ShortlistPage({
  properties = [],
  savedIds = [],
  onToggleSave,
  onOpenDetails,
  onNavigate
}: ShortlistPageProps) {
  const savedProperties = properties.filter((p) => savedIds.includes(p.id));

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
            <button className="link" onClick={() => onNavigate('results')}>
              Discover more homes <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="cards">
            {savedProperties.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                isSaved={true}
                onToggleSave={onToggleSave}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="empty-shortlist">
          <span>
            <Heart size={28} />
          </span>
          <h2>Your shortlist is empty</h2>
          <p>
            Browse through active rental properties and tap the heart icon on any card to save it here for quick comparison.
          </p>
          <button className="primary" onClick={() => onNavigate('results')}>
            <Search size={17} /> Explore Available Homes
          </button>
        </div>
      )}

      <div className="sample-note">
        <CircleHelp size={16} />
        <span>
          <b>Persistence Notice:</b> Shortlisted homes are synchronized to your browser storage and will be linked to your user account upon authentication.
        </span>
      </div>
    </div>
  );
}
