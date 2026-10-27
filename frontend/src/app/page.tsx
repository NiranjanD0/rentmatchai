'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  CheckCircle2,
  MapPin,
  Wallet,
  ChevronDown,
  Search,
  ArrowUpRight,
  Building2,
  UserPlus,
  ShieldCheck,
  Zap,
  Clock,
  Compass,
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { USER_ROLES } from '../constants/initialData';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLister, openAuthModal } = useAuth();
  const { activeProperties, saved, toggleSave, openAddProperty } = useProperty();

  const [query, setQuery] = useState('Furnished 2BHK near PDEU with balcony under ₹22,000');
  const [location, setLocation] = useState('Gandhinagar');
  const [budget, setBudget] = useState('25000');

  const samplePrompts = [
    'Furnished 2BHK near PDEU under ₹20k',
    'Studio apartment near Infocity with fast Wi-Fi',
    'Pet-friendly 3BHK in Kudasan with covered parking',
    'Budget 1BHK near Metro under ₹14,000',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/explore?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&budget=${encodeURIComponent(budget)}`
    );
  };

  const featured = activeProperties.slice(0, 3);

  return (
    <div className="wrap home-page">
      {/* Hero Section */}
      <section className="hero">
        <div>
          <div className="eyebrow">
            <span className="pulse-indicator" />
            <Sparkles size={14} /> AI-POWERED RENTAL INTELLIGENCE
          </div>
          <h1>
            Find a home that<br />
            <em>fits your life,</em> not just your filters.
          </h1>
          <p className="hero-desc">
            Describe what your ideal living space looks like in plain language. RentMatch AI pairs you with authentic, verified properties and direct landlord connections — with zero brokerage.
          </p>

          <div className="proof">
            <span>
              <ShieldCheck size={16} /> 100% Verified Landlords
            </span>
            <span>
              <Zap size={16} /> Zero Brokerage Fees
            </span>
            <span>
              <CheckCircle2 size={16} /> Direct Lister Contact
            </span>
          </div>
        </div>

        <div className="hero-image">
          <img
            src={
              activeProperties[0]?.image ||
              'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85'
            }
            alt="Contemporary designed apartment interior"
          />
          <div className="float-card">
            <span>
              <Sparkles size={17} />
            </span>
            <div>
              <b>98% Lifestyle Fit Score</b>
              <small>7 mins to PDEU · High-speed Fiber</small>
            </div>
            <CheckCircle2 size={20} className="text-emerald-600" />
          </div>
          <div className="float-tag">
            <b>⌂ &nbsp; Verified Direct Listing</b>
            <small>Direct Landlord · Immediate Move-in</small>
          </div>
        </div>
      </section>

      {/* Role-Specific Announcement Callout */}
      {!isAuthenticated && (
        <section className="role-callout-banner">
          <div className="callout-content">
            <Building2 size={24} />
            <div>
              <strong>Are you a property owner or estate manager?</strong>
              <p>List your rental apartments directly, screen verified tenants, and manage occupancy without middlemen.</p>
            </div>
          </div>
          <div className="callout-actions">
            <button
              type="button"
              className="btn-lister-cta"
              onClick={() => openAuthModal('register', USER_ROLES.PROPERTY_LISTER)}
            >
              <UserPlus size={15} /> List Your Property Free
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
              <p>Manage your live listings, adjust rental pricing, review tenant enquiries, or add new properties.</p>
            </div>
          </div>
          <div className="callout-actions">
            <button type="button" className="primary" onClick={openAddProperty}>
              + List New Property
            </button>
            <button type="button" className="secondary" onClick={() => router.push('/profile?tab=listings')}>
              Manage Dashboard
            </button>
          </div>
        </section>
      )}

      {/* AI Natural Language Search Console */}
      <section className="search-panel">
        <div className="panel-title">
          <div>
            <small className="kicker">INTELLIGENT PROPERTY DISCOVERY</small>
            <h2>What are you looking for?</h2>
          </div>
          <span className="ai-label">
            <Sparkles size={14} /> Semantic Match Engine
          </span>
        </div>

        <label className="field-label" htmlFor="ideal">
          Describe your routine, location preferences, or non-negotiables
        </label>
        <div className="natural-input">
          <Sparkles size={19} className="text-emerald-600 mt-1 flex-shrink-0" />
          <textarea
            id="ideal"
            rows={2}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. A peaceful 2BHK with balcony near PDEU, furnished with AC, budget under ₹22,000..."
          />
        </div>

        {/* Prompt Recommendation Chips */}
        <div className="prompt-chips-row">
          <span className="chips-label">Popular searches:</span>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              className="prompt-chip"
              onClick={() => setQuery(p)}
            >
              &ldquo;{p}&rdquo;
            </button>
          ))}
        </div>

        <div className="quick-fields">
          <div className="quick-field">
            <MapPin size={17} />
            <div>
              <label htmlFor="loc-home">Preferred Region / Sector</label>
              <input
                id="loc-home"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or neighbourhood (e.g. Kudasan)"
              />
            </div>
          </div>

          <div className="quick-field">
            <Wallet size={17} />
            <div>
              <label htmlFor="budget-home">Monthly Budget Cap</label>
              <select
                id="budget-home"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="15000">Up to ₹15,000 / mo</option>
                <option value="20000">Up to ₹20,000 / mo</option>
                <option value="25000">Up to ₹25,000 / mo</option>
                <option value="35000">Up to ₹35,000 / mo</option>
                <option value="50000">Up to ₹50,000 / mo</option>
              </select>
            </div>
            <ChevronDown size={14} />
          </div>

          <button type="button" className="primary search-main" onClick={handleSearchSubmit}>
            <Search size={18} /> Match Properties <ArrowUpRight size={17} />
          </button>
        </div>
      </section>

      {/* Platform Trust & Metric Stats Strip */}
      <section className="stats-strip">
        <div className="stat-card">
          <div className="stat-num">2,500+</div>
          <div className="stat-label">Verified Listings</div>
          <p>Carefully inspected homes across top sectors</p>
        </div>
        <div className="stat-card">
          <div className="stat-num">98%</div>
          <div className="stat-label">Match Accuracy</div>
          <p>Semantic scoring aligned with student &amp; pro habits</p>
        </div>
        <div className="stat-card">
          <div className="stat-num">&lt; 12 hrs</div>
          <div className="stat-label">Landlord Response</div>
          <p>Direct chat between verified tenants and owners</p>
        </div>
        <div className="stat-card">
          <div className="stat-num">₹0</div>
          <div className="stat-label">Brokerage Fee</div>
          <p>100% direct lister rentals with zero agent cuts</p>
        </div>
      </section>

      {/* How It Works 3-Step Bento Strip */}
      <section className="how-it-works-section">
        <div className="section-head text-center">
          <small className="kicker">TRANSPARENT &amp; DIRECT</small>
          <h2>How RentMatch AI Simplifies Renting</h2>
          <p>Skip weeks of broker calls and unverified classifieds in three intuitive steps.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span className="step-badge">01</span>
            <div className="step-icon">
              <Sparkles size={20} />
            </div>
            <h3>Describe in Natural Language</h3>
            <p>Tell our engine about your daily commute, roommate preferences, budget, or quiet study requirements.</p>
          </div>

          <div className="step-card">
            <span className="step-badge">02</span>
            <div className="step-icon">
              <Compass size={20} />
            </div>
            <h3>Intelligent Similarity Scoring</h3>
            <p>Properties receive compatibility scores tailored specifically to your habits and lifestyle parameters.</p>
          </div>

          <div className="step-card">
            <span className="step-badge">03</span>
            <div className="step-icon">
              <ShieldCheck size={20} />
            </div>
            <h3>Direct Lister Connect</h3>
            <p>Chat directly with landlords, schedule viewing tours, and finalize agreements without broker markups.</p>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="featured">
        <div className="section-head">
          <div>
            <small className="kicker">ACTIVE VERIFIED RENTALS</small>
            <h2>Featured Available Homes</h2>
            <p>Verified homes available for immediate lease in top student &amp; tech hubs.</p>
          </div>
          <button type="button" className="link" onClick={() => router.push('/explore')}>
            Explore all homes <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="cards">
          {featured.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              isSaved={saved.includes(p.id)}
              onToggleSave={toggleSave}
              onOpenDetails={(id) => router.push(`/properties/${id}`)}
            />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="banner">
        <span>
          <Sparkles size={24} />
        </span>
        <div>
          <b>Ready to find your next home without broker hassles?</b>
          <p>Join thousands of verified students, professors, and professionals using RentMatch AI.</p>
        </div>
        <button type="button" onClick={() => router.push('/explore')}>
          Start exploring homes <ArrowUpRight size={16} />
        </button>
      </section>
    </div>
  );
}
