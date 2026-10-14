'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, RotateCcw, X, MapPin, CircleHelp } from 'lucide-react';
import PropertyCard from '../../components/PropertyCard';
import { useProperty } from '../../context/PropertyContext';

const money = (n: number | string) => '₹' + Number(n).toLocaleString('en-IN');

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeProperties, saved, toggleSave } = useProperty();

  const initialQuery = searchParams.get('query') || '';
  const initialLocation = searchParams.get('location') || 'Gandhinagar';
  const initialBudget = searchParams.get('budget') || '25000';

  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [budget, setBudget] = useState(initialBudget);
  const [bedrooms, setBedrooms] = useState('Any');
  const [furnishing, setFurnishing] = useState('Any');
  const [sort, setSort] = useState('Best match');
  const [showFilters, setShowFilters] = useState(false);

  // Filter & Sort properties (Sprint 2 View Property Listings)
  const results = useMemo(() => {
    const list = activeProperties.filter((p) => {
      // 1. Location match
      const locMatch =
        !location.trim() ||
        location.toLowerCase().includes('gandhinagar') ||
        p.location.toLowerCase().includes(location.toLowerCase());

      // 2. Budget match
      const maxRent = !budget || p.rent <= Number(budget);

      // 3. Bedrooms match
      const bedMatch =
        bedrooms === 'Any' ||
        (bedrooms === '3+' ? p.bedrooms >= 3 : p.bedrooms === Number(bedrooms));

      // 4. Furnishing match
      const furnMatch = furnishing === 'Any' || p.furnishing === furnishing;

      // 5. Query keyword search
      const q = query.trim().toLowerCase();
      const textMatch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);

      return locMatch && maxRent && bedMatch && furnMatch && textMatch;
    });

    if (sort === 'Lowest rent') {
      list.sort((a, b) => a.rent - b.rent);
    } else if (sort === 'Commute time') {
      list.sort((a, b) => parseInt(a.commute || '99') - parseInt(b.commute || '99'));
    } else {
      list.sort((a, b) => (b.match || 0) - (a.match || 0));
    }

    return list;
  }, [activeProperties, location, budget, bedrooms, furnishing, query, sort]);

  const resetFilters = () => {
    setQuery('');
    setLocation('Gandhinagar');
    setBudget('25000');
    setBedrooms('Any');
    setFurnishing('Any');
    setSort('Best match');
  };

  return (
    <div className="wrap results-page">
      {/* Breadcrumb */}
      <div className="crumb">
        <button onClick={() => router.push('/')}>Discover</button> / Explore Homes
      </div>

      {/* Header */}
      <div className="results-title">
        <div>
          <small className="kicker">SPRINT 2 ACTIVE LISTINGS</small>
          <h1>Find your kind of home.</h1>
          <p>Explore verified active rental listings matching your requirements.</p>
        </div>
        <span className="result-count">
          <i /> {results.length} active homes available
        </span>
      </div>

      {/* Quick Search Bar */}
      <div className="results-search">
        <Search size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by keywords, amenities, or locality (e.g. Balcony, Kudasan, Studio)..."
        />
        {query && (
          <button className="clear-search-btn" onClick={() => setQuery('')}>
            <X size={15} />
          </button>
        )}
      </div>

      {/* Layout: Sidebar Filters + Main Grid */}
      <div className="results-layout">
        {/* Filters Sidebar */}
        <aside className={`filters ${showFilters ? 'filter-show' : ''}`}>
          <div className="filter-head">
            <h3>
              <SlidersHorizontal size={17} /> Filter Homes
            </h3>
            <button className="reset" onClick={resetFilters}>
              <RotateCcw size={13} /> Reset
            </button>
            <button className="filter-close" onClick={() => setShowFilters(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-loc">Location / Locality</label>
            <div className="filter-input">
              <MapPin size={14} />
              <input
                id="filter-loc"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Area or city"
              />
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="rent-range">Max Monthly Rent</label>
            <strong className="range-value">
              {money(budget)} <small>/ month</small>
            </strong>
            <input
              id="rent-range"
              className="range"
              type="range"
              min="8000"
              max="50000"
              step="1000"
              value={budget || 10000}
              onChange={(e) => setBudget(e.target.value)}
            />
            <div className="range-ends">
              <span>₹8k</span>
              <span>₹50k</span>
            </div>
          </div>

          <div className="filter-group">
            <label>Bedrooms (BHK)</label>
            <div className="chips">
              {['Any', '1', '2', '3+'].map((v) => (
                <button
                  key={v}
                  className={bedrooms === v ? 'chosen' : ''}
                  onClick={() => setBedrooms(v)}
                >
                  {v === 'Any' ? 'Any' : v === '3+' ? '3+ BHK' : v + ' BHK'}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="furnish">Furnishing</label>
            <select
              className="control"
              id="furnish"
              value={furnishing}
              onChange={(e) => setFurnishing(e.target.value)}
            >
              <option value="Any">Any Furnishing</option>
              <option value="Fully furnished">Fully furnished</option>
              <option value="Semi-furnished">Semi-furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>

          <button className="primary apply" onClick={() => setShowFilters(false)}>
            Show {results.length} Active Homes
          </button>
        </aside>

        {/* Results Main Section */}
        <section className="result-content">
          <div className="toolbar">
            <b>
              {results.length} places available <small>· Active Verified Listings</small>
            </b>
            <label>
              Sort by{' '}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="Best match">Best match</option>
                <option value="Lowest rent">Lowest rent</option>
                <option value="Commute time">Commute time</option>
              </select>
            </label>
            <button className="mobile-filter" onClick={() => setShowFilters(true)}>
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>

          {results.length > 0 ? (
            <div className="cards result-cards">
              {results.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  isSaved={saved.includes(p.id)}
                  onToggleSave={toggleSave}
                  onOpenDetails={(id) => router.push(`/properties/${id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="empty">
              <Search size={28} />
              <h3>No matching properties found</h3>
              <p>Try adjusting your monthly rent budget, relaxing your bedroom filters, or resetting search keywords.</p>
              <button className="secondary" onClick={resetFilters}>
                Reset all filters
              </button>
            </div>
          )}

          <div className="sample-note">
            <CircleHelp size={16} />
            <span>
              <b>Sprint 2 State Verification:</b> Only <strong>ACTIVE</strong> properties are displayed in this public feed. Inactive listings are hidden until reactivated by their owner.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="wrap"><p>Loading properties...</p></div>}>
      <ExploreContent />
    </Suspense>
  );
}
