'use client';

import React, { useState } from 'react';
import { Sparkles, Check, CheckCircle2, MapPin, Wallet, ChevronDown, Search, ArrowUpRight, Building2, UserPlus } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES, type Property } from '../constants/initialData';

interface HomePageProps {
  properties?: Property[];
  savedIds?: string[];
  onToggleSave: (id: string) => void;
  onOpenDetails: (id: string) => void;
  onNavigate: (page: string, extraTab?: string | null) => void;
  onSearch: (params: { query: string; location: string; budget: string }) => void;
  onOpenAddProperty: () => void;
  onOpenAuth: (tab?: string, role?: string) => void;
}

export default function HomePage({
  properties = [],
  savedIds = [],
  onToggleSave,
  onOpenDetails,
  onNavigate,
  onSearch,
  onOpenAddProperty,
  onOpenAuth
}: HomePageProps) {
  const { user, isAuthenticated, isLister } = useAuth();
  const [query, setQuery] = useState('A furnished 2BHK near PDEU under ₹20,000');
  const [location, setLocation] = useState('Gandhinagar');
  const [budget, setBudget] = useState('25000');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ query, location, budget });
  };

  const featured = properties.slice(0, 3);

  return (
    <div className="wrap home-page">
      {/* Hero Section */}
      <section className="hero">
        <div>
          <div className="eyebrow">
            <Sparkles size={15} /> SPRINT 1 &amp; 2 DELIVERABLES LIVE
          </div>
          <h1>
            Find a place that<br />
            <em>feels like you.</em>
          </h1>
          <p className="hero-desc">
            Tell us what home looks like to you. Discover places that fit your routine, budget, and lifestyle — or list your rental properties directly with RentMatch AI.
          </p>
          <div className="proof">
            <span>
              <Check size={15} /> Role-Based Tenant &amp; Lister Portal
            </span>
            <span>
              <Check size={15} /> JWT Auth &amp; Google Sign-In
            </span>
            <span>
              <Check size={15} /> Full Property CRUD &amp; Validation
            </span>
          </div>
        </div>

        <div className="hero-image">
          <img
            src={properties[0]?.image || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85'}
            alt="Bright contemporary living room"
          />
          <div className="float-card">
            <span>
              <Sparkles size={17} />
            </span>
            <div>
              <b>Intelligent AI Matching</b>
              <small>Sprint 1 &amp; 2 Fully Working</small>
            </div>
            <CheckCircle2 size={20} />
          </div>
          <div className="float-tag">
            <b>⌂ &nbsp; Verified Listings</b>
            <small>Active &amp; Moderated</small>
          </div>
        </div>
      </section>

      {/* Role-Specific Announcement Callout */}
      {!isAuthenticated && (
        <section className="role-callout-banner">
          <div className="callout-content">
            <Building2 size={24} />
            <div>
              <strong>Are you a landlord or property manager?</strong>
              <p>Publish your property listings, manage active/inactive status, and connect with verified tenants.</p>
            </div>
          </div>
          <div className="callout-actions">
            <button
              className="btn-lister-cta"
              onClick={() => onOpenAuth('register', USER_ROLES.PROPERTY_LISTER)}
            >
              <UserPlus size={15} /> Register as Property Lister
            </button>
          </div>
        </section>
      )}

      {isAuthenticated && isLister && (
        <section className="role-callout-banner lister-active">
          <div className="callout-content">
            <Building2 size={24} />
            <div>
              <strong>Logged in as Property Lister ({user!.firstName})</strong>
              <p>You can create new property listings, update rental pricing, or toggle active/inactive status.</p>
            </div>
          </div>
          <div className="callout-actions">
            <button className="primary" onClick={onOpenAddProperty}>
              + List New Property
            </button>
            <button className="secondary" onClick={() => onNavigate('profile', 'listings')}>
              Manage My Listings
            </button>
          </div>
        </section>
      )}

      {/* AI Search Panel */}
      <section className="search-panel">
        <div className="panel-title">
          <div>
            <small className="kicker">LET&apos;S FIND YOUR PLACE</small>
            <h2>What are you looking for?</h2>
          </div>
          <span className="ai-label">
            <Sparkles size={14} /> AI-assisted search concept
          </span>
        </div>

        <label className="field-label" htmlFor="ideal">
          Describe your ideal home
        </label>
        <div className="natural-input">
          <Sparkles size={19} />
          <textarea
            id="ideal"
            rows={2}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. A sunny 2BHK near my college, furnished, under ₹20,000..."
          />
        </div>
        <p className="hint">Try: &ldquo;A furnished 2BHK near PDEU under ₹20,000&rdquo;</p>

        <div className="quick-fields">
          <div className="quick-field">
            <MapPin size={17} />
            <div>
              <label htmlFor="loc-home">Preferred area</label>
              <input
                id="loc-home"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or neighbourhood"
              />
            </div>
          </div>

          <div className="quick-field">
            <Wallet size={17} />
            <div>
              <label htmlFor="budget-home">Monthly budget</label>
              <select
                id="budget-home"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="15000">Up to ₹15,000</option>
                <option value="20000">Up to ₹20,000</option>
                <option value="25000">Up to ₹25,000</option>
                <option value="35000">Up to ₹35,000</option>
                <option value="50000">Up to ₹50,000</option>
              </select>
            </div>
            <ChevronDown size={14} />
          </div>

          <button className="primary search-main" onClick={handleSearchSubmit}>
            <Search size={18} /> Find my home <ArrowUpRight size={17} />
          </button>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="featured">
        <div className="section-head">
          <div>
            <small className="kicker">CURRENTLY AVAILABLE HOMES</small>
            <h2>Featured Active Rentals</h2>
            <p>Verified active properties currently available for lease and rent.</p>
          </div>
          <button className="link" onClick={() => onNavigate('results')}>
            Explore all homes <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="cards">
          {featured.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              isSaved={savedIds.includes(p.id)}
              onToggleSave={onToggleSave}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      </section>

      {/* Feature banner */}
      <section className="banner">
        <span>
          <Sparkles size={22} />
        </span>
        <div>
          <b>Your preferences. Your priorities.</b>
          <p>The planned AI experience will turn everyday language into accurate, verified property matches.</p>
        </div>
        <button onClick={() => onNavigate('results')}>
          Start exploring <ArrowUpRight size={16} />
        </button>
      </section>
    </div>
  );
}
