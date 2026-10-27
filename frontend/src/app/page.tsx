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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[520px] bg-gradient-to-b from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl rounded-full dark:from-emerald-500/20 dark:via-teal-500/10" />
      <div className="pointer-events-none absolute top-96 -left-48 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-600/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-96 -right-48 w-96 h-96 bg-teal-400/10 dark:bg-teal-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        {/* Modern Centered Hero Header */}
        <section className="text-center pt-8 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 backdrop-blur-md mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>AI-Powered Rental Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-4xl mx-auto leading-[1.15] mb-5">
            Find a home that fits your life,{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-300 bg-clip-text text-transparent">
              not just your filters.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Skip broker calls and endless scrolling. Tell us how you live in plain language — we match you directly with verified properties and real landlords.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-10">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>100% Verified Landlords</span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-amber-500" />
              <span>Zero Brokerage Fees</span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-teal-600 dark:text-teal-400" />
              <span>Direct Lister WhatsApp &amp; Chat</span>
            </div>
          </div>

          {/* AI Search Capsule Card */}
          <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 p-4 sm:p-6 shadow-xl shadow-zinc-900/5 dark:shadow-black/40 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 text-left">
            {/* Filter Persona Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800 mb-4">
              <button
                type="button"
                onClick={() => handleTabSelect('all')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Compass size={14} /> All Rentals
              </button>
              <button
                type="button"
                onClick={() => handleTabSelect('students')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'students'
                    ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <GraduationCap size={14} /> Student Housing
              </button>
              <button
                type="button"
                onClick={() => handleTabSelect('pros')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'pros'
                    ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Briefcase size={14} /> Tech &amp; Pros
              </button>
              <button
                type="button"
                onClick={() => handleTabSelect('families')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'families'
                    ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Users size={14} /> Family Homes
              </button>
            </div>

            {/* Natural Language Prompt Area */}
            <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/70 dark:bg-zinc-950/50 p-3 sm:p-4 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all mb-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Sparkles size={17} />
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
                  placeholder="Describe your ideal place (e.g. Furnished 2BHK near PDEU with balcony under ₹22,000)..."
                  className="w-full resize-none bg-transparent text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mr-1">
                Try:
              </span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQuery(p.text)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300 border border-zinc-200/60 dark:border-zinc-700/60 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Controls & Search CTA Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/60 dark:bg-zinc-950/40 px-3.5 py-2.5">
                <MapPin size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Locality</span>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Area or city"
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none truncate"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/60 dark:bg-zinc-950/40 px-3.5 py-2.5">
                <Wallet size={18} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Budget Limit</span>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
                  >
                    <option value="15000" className="dark:bg-zinc-900">Up to ₹15,000 / mo</option>
                    <option value="20000" className="dark:bg-zinc-900">Up to ₹20,000 / mo</option>
                    <option value="25000" className="dark:bg-zinc-900">Up to ₹25,000 / mo</option>
                    <option value="35000" className="dark:bg-zinc-900">Up to ₹35,000 / mo</option>
                    <option value="50000" className="dark:bg-zinc-900">Up to ₹50,000 / mo</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSearchSubmit()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 px-5 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <span>Find My Match</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Landlord Announcement Card */}
        {!isAuthenticated && (
          <section className="mt-14 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-emerald-500/10 dark:from-emerald-950/20 dark:via-zinc-900/40 dark:to-teal-950/20 p-6 md:p-8 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <Building2 size={28} />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Are you a property owner or lister in Gandhinagar?
                </h3>
                <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  List directly with RentMatch AI. Zero brokerage, verified student and professional tenants, and full lifecycle control.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal('register', USER_ROLES.PROPERTY_LISTER)}
              className="shrink-0 flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold px-5 py-3 text-sm hover:opacity-90 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <UserPlus size={16} />
              <span>List Property Free</span>
            </button>
          </section>
        )}

        {isAuthenticated && isLister && (
          <section className="mt-14 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 p-6 md:p-8 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <Building2 size={28} />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Welcome back, {user?.firstName}!
                </h3>
                <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Manage your live listings, adjust rental pricing, review tenant enquiries, or add new properties.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={openAddProperty}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 text-sm transition-all shadow-md active:scale-95 cursor-pointer"
              >
                + Add Property
              </button>
              <button
                type="button"
                onClick={() => router.push('/profile?tab=listings')}
                className="flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all active:scale-95 cursor-pointer"
              >
                Dashboard
              </button>
            </div>
          </section>
        )}

        {/* Trust Metrics Bar */}
        <section className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-5 hover:border-emerald-500/40 transition-all shadow-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">2,500+</div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">Verified Rentals</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
              Inspected homes in Gandhinagar &amp; Ahmedabad
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-5 hover:border-emerald-500/40 transition-all shadow-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">98.4%</div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">Match Precision</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
              Semantic scoring aligned with student &amp; pro habits
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-5 hover:border-emerald-500/40 transition-all shadow-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">&lt; 12 hrs</div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">Lister Response</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
              Direct chat between verified tenants and owners
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-5 hover:border-emerald-500/40 transition-all shadow-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">₹0</div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">Broker Commission</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
              100% direct lister rentals with zero agent cuts
            </p>
          </div>
        </section>

        {/* Featured Listings Grid */}
        <section className="mt-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">CURATED HOMES</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">Featured Active Rentals</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Handpicked verified properties ready for immediate move-in.</p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/explore')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer group"
            >
              <span>Explore all {activeProperties.length} homes</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <section className="mt-24 pt-12 border-t border-zinc-200/80 dark:border-zinc-800">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">HOW IT WORKS</span>
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">A Smarter Way to Rent</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              Find the right apartment in minutes instead of weeks of frustrating broker calls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40">
              <span className="absolute top-6 right-6 text-3xl font-extrabold text-zinc-200 dark:text-zinc-800 font-mono">01</span>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-5">
                <Sparkles size={24} />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Conversational Search</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Type what matters to you in plain English — proximity to university, balcony sunlight, or high-speed fiber.
              </p>
            </div>

            <div className="relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40">
              <span className="absolute top-6 right-6 text-3xl font-extrabold text-zinc-200 dark:text-zinc-800 font-mono">02</span>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-5">
                <Compass size={24} />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Lifestyle Fit Scoring</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Our match engine computes semantic compatibility scores based on your routine and budget limits.
              </p>
            </div>

            <div className="relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40">
              <span className="absolute top-6 right-6 text-3xl font-extrabold text-zinc-200 dark:text-zinc-800 font-mono">03</span>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-5">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Zero-Brokerage Move-In</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Connect directly with verified owners, schedule site visits, and finalize agreements with zero broker fees.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
