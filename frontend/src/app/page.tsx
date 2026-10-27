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
  ArrowRight,
  ArrowUpRight,
  Building2,
  UserPlus,
  ShieldCheck,
  Zap,
  Compass,
  GraduationCap,
  Briefcase,
  Users,
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { USER_ROLES } from '../constants/initialData';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLister, openAuthModal } = useAuth();
  const { activeProperties, saved, toggleSave, openAddProperty } = useProperty();

  const [activeTab, setActiveTab] = useState<'all' | 'students' | 'pros' | 'families'>('all');
  const [query, setQuery] = useState('Furnished 2BHK near PDEU with balcony under ₹22,000');
  const [location, setLocation] = useState('Gandhinagar');
  const [budget, setBudget] = useState('25000');

  const samplePrompts = [
    { label: '🎓 Near PDEU (< ₹20k)', text: 'Furnished 2BHK near PDEU under ₹20,000' },
    { label: '⚡ Studio at Infocity', text: 'Studio apartment near Infocity with fast Wi-Fi' },
    { label: '🐾 Kudasan 3BHK Pet-friendly', text: 'Pet-friendly 3BHK in Kudasan with covered parking' },
    { label: '🚇 Budget 1BHK near Metro', text: 'Budget 1BHK near Metro under ₹14,000' },
  ];

  const handleTabSelect = (tab: 'all' | 'students' | 'pros' | 'families') => {
    setActiveTab(tab);
    if (tab === 'students') {
      setQuery('Student friendly shared apartment walking distance to PDEU or PDPU with high-speed internet');
      setLocation('Raysan / PDEU');
      setBudget('18000');
    } else if (tab === 'pros') {
      setQuery('Fully furnished 1BHK or studio apartment near Infocity tech park with power backup');
      setLocation('Infocity, Gandhinagar');
      setBudget('22000');
    } else if (tab === 'families') {
      setQuery('Spacious 3BHK family flat in Kudasan with elevator, covered parking, and gated security');
      setLocation('Kudasan');
      setBudget('35000');
    } else {
      setQuery('Furnished 2BHK near PDEU with balcony under ₹22,000');
      setLocation('Gandhinagar');
      setBudget('25000');
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    router.push(
      `/explore?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&budget=${encodeURIComponent(budget)}`
    );
  };

  const featured = activeProperties.slice(0, 3);

  return (
    <div className="home-page-wrapper relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="hero-glow-ambient" />

      <div className="wrap">
        {/* Modern Centered Hero */}
        <section className="hero-modern">
          <div className="hero-badge">
            <span className="hero-badge-pulse" />
            <Sparkles size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>AI-Powered Rental Intelligence</span>
          </div>

          <h1 className="hero-headline">
            Find a home that fits your life,
            <span className="hero-gradient-text"> not just your filters.</span>
          </h1>

          <p className="hero-subtitle">
            Skip the broker calls and endless scrolling. Tell us how you live in plain language — we match you directly with verified properties and real landlords.
          </p>

          <div className="hero-proof-strip">
            <div className="proof-item">
              <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>100% Verified Landlords</span>
            </div>
            <div className="proof-sep">·</div>
            <div className="proof-item">
              <Zap size={16} className="text-amber-500" />
              <span>Zero Brokerage Fees</span>
            </div>
            <div className="proof-sep">·</div>
            <div className="proof-item">
              <CheckCircle2 size={16} className="text-teal-600 dark:text-teal-400" />
              <span>Direct Lister WhatsApp &amp; Chat</span>
            </div>
          </div>

          {/* AI Search Capsule */}
          <div className="search-capsule-card">
            {/* Filter Persona Tabs */}
            <div className="capsule-tabs">
              <button
                type="button"
                className={`capsule-tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => handleTabSelect('all')}
              >
                <Compass size={14} /> All Rentals
              </button>
              <button
                type="button"
                className={`capsule-tab ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => handleTabSelect('students')}
              >
                <GraduationCap size={14} /> Student Housing
              </button>
              <button
                type="button"
                className={`capsule-tab ${activeTab === 'pros' ? 'active' : ''}`}
                onClick={() => handleTabSelect('pros')}
              >
                <Briefcase size={14} /> Tech &amp; Working Pros
              </button>
              <button
                type="button"
                className={`capsule-tab ${activeTab === 'families' ? 'active' : ''}`}
                onClick={() => handleTabSelect('families')}
              >
                <Users size={14} /> Family Residences
              </button>
            </div>

            {/* Natural Language Prompt Area */}
            <div className="capsule-prompt-box">
              <div className="prompt-icon-wrapper">
                <Sparkles size={18} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSearchSubmit();
                  }
                }}
                rows={2}
                placeholder="Describe your ideal place (e.g. Sunny 2BHK with balcony near PDEU, pet-friendly, under ₹22,000)..."
                className="capsule-textarea"
              />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="capsule-chips-row">
              <span className="chips-hint">Try:</span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="capsule-chip-btn"
                  onClick={() => setQuery(p.text)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Controls & Search CTA Row */}
            <div className="capsule-controls-row">
              <div className="capsule-field">
                <MapPin size={15} className="field-icon" />
                <div className="field-text">
                  <span className="field-label">Locality / Sector</span>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Area or city"
                    className="field-input"
                  />
                </div>
              </div>

              <div className="capsule-field">
                <Wallet size={15} className="field-icon" />
                <div className="field-text">
                  <span className="field-label">Budget Limit</span>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="field-select"
                  >
                    <option value="15000">Up to ₹15,000 / mo</option>
                    <option value="20000">Up to ₹20,000 / mo</option>
                    <option value="25000">Up to ₹25,000 / mo</option>
                    <option value="35000">Up to ₹35,000 / mo</option>
                    <option value="50000">Up to ₹50,000 / mo</option>
                  </select>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </div>

              <button
                type="button"
                className="btn-capsule-submit"
                onClick={() => handleSearchSubmit()}
              >
                <span>Find My Match</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Landlord Announcement Card */}
        {!isAuthenticated && (
          <section className="landlord-bento-banner">
            <div className="bento-content">
              <div className="bento-icon-box">
                <Building2 size={24} />
              </div>
              <div>
                <h3>Are you a property owner or lister in Gandhinagar?</h3>
                <p>List directly with RentMatch AI. Zero brokerage, verified student and professional tenants, and full lifecycle control.</p>
              </div>
            </div>
            <button
              type="button"
              className="btn-bento-cta"
              onClick={() => openAuthModal('register', USER_ROLES.PROPERTY_LISTER)}
            >
              <UserPlus size={15} /> List Property Free
            </button>
          </section>
        )}

        {isAuthenticated && isLister && (
          <section className="landlord-bento-banner active-lister">
            <div className="bento-content">
              <div className="bento-icon-box">
                <Building2 size={24} />
              </div>
              <div>
                <h3>Welcome back, {user!.firstName}!</h3>
                <p>Manage your live listings, adjust rental pricing, review tenant enquiries, or add new properties.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="btn-bento-cta" onClick={openAddProperty}>
                + Add Property
              </button>
              <button
                type="button"
                className="btn-bento-secondary"
                onClick={() => router.push('/profile?tab=listings')}
              >
                Dashboard
              </button>
            </div>
          </section>
        )}

        {/* Trust Metrics Bar */}
        <section className="metrics-bento-strip">
          <div className="metric-box">
            <div className="metric-value">2,500+</div>
            <div className="metric-title">Verified Rentals</div>
            <p>Inspected homes in Gandhinagar &amp; Ahmedabad</p>
          </div>
          <div className="metric-box">
            <div className="metric-value">98.4%</div>
            <div className="metric-title">Match Precision</div>
            <p>Semantic scoring aligned with student &amp; pro habits</p>
          </div>
          <div className="metric-box">
            <div className="metric-value">&lt; 12 hrs</div>
            <div className="metric-title">Lister Response</div>
            <p>Direct chat between verified tenants and owners</p>
          </div>
          <div className="metric-box">
            <div className="metric-value">₹0</div>
            <div className="metric-title">Broker Commission</div>
            <p>100% direct lister rentals with zero agent cuts</p>
          </div>
        </section>

        {/* Featured Listings Grid */}
        <section className="featured-section-modern">
          <div className="section-header-modern">
            <div>
              <small className="section-eyebrow">CURATED HOMES</small>
              <h2 className="section-title">Featured Active Rentals</h2>
              <p className="section-desc">Handpicked verified properties ready for immediate move-in.</p>
            </div>
            <button
              type="button"
              className="btn-link-modern"
              onClick={() => router.push('/explore')}
            >
              <span>Explore all {activeProperties.length} homes</span>
              <ArrowUpRight size={16} />
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

        {/* 3-Step Walkthrough Bento */}
        <section className="how-it-works-modern">
          <div className="text-center mb-10">
            <small className="section-eyebrow">HOW IT WORKS</small>
            <h2 className="section-title">A Smarter Way to Rent</h2>
            <p className="section-desc max-w-xl mx-auto">
              Find the right apartment in minutes instead of weeks of frustrating broker calls.
            </p>
          </div>

          <div className="steps-cards-grid">
            <div className="step-card-modern">
              <span className="step-number">01</span>
              <div className="step-icon-modern">
                <Sparkles size={22} />
              </div>
              <h4>Conversational Search</h4>
              <p>Type what matters to you in plain English — proximity to university, balcony sunlight, or high-speed fiber.</p>
            </div>

            <div className="step-card-modern">
              <span className="step-number">02</span>
              <div className="step-icon-modern">
                <Compass size={22} />
              </div>
              <h4>Lifestyle Fit Scoring</h4>
              <p>Our match engine computes semantic compatibility scores based on your routine and budget limits.</p>
            </div>

            <div className="step-card-modern">
              <span className="step-number">03</span>
              <div className="step-icon-modern">
                <ShieldCheck size={22} />
              </div>
              <h4>Zero-Brokerage Move-In</h4>
              <p>Connect directly with verified owners, schedule site visits, and finalize agreements with zero broker fees.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
