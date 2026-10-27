'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  CheckCircle2,
  MapPin,
  Wallet,
  ArrowRight,
  ArrowUpRight,
  Building2,
  ShieldCheck,
  Compass,
  GraduationCap,
  Briefcase,
  Users,
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { usePageCurtains } from '../components/ui/page-curtains';

export default function HomePage() {
  const router = useRouter();
  const { navigateWithCurtains } = usePageCurtains();
  const { user, isAuthenticated, isLister } = useAuth();
  const { activeProperties, saved, toggleSave, openAddProperty } = useProperty();

  const [activeTab, setActiveTab] = useState<'all' | 'students' | 'pros' | 'families'>('all');
  const [query, setQuery] = useState('Furnished 2BHK near PDEU with balcony under ₹22,000');
  const [location, setLocation] = useState('Gandhinagar');
  const [budget, setBudget] = useState('25000');

  const samplePrompts = [
    { label: 'Near PDEU (< ₹20k)', text: 'Furnished 2BHK near PDEU under ₹20,000' },
    { label: 'Studio at Infocity', text: 'Studio apartment near Infocity with fast Wi-Fi' },
    { label: 'Kudasan 3BHK Pet-friendly', text: 'Pet-friendly 3BHK in Kudasan with covered parking' },
    { label: 'Budget 1BHK near Metro', text: 'Budget 1BHK near Metro under ₹14,000' },
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
    navigateWithCurtains(
      `/explore?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&budget=${encodeURIComponent(budget)}`,
      'Explore Homes'
    );
  };

  const featured = activeProperties.slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        {/* Informative Minimal Hero Header */}
        <section className="text-center pt-6 pb-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-6">
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" />
            <span>Direct rental matching in Gandhinagar &amp; Ahmedabad</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white max-w-3xl mx-auto leading-tight mb-4">
            A simpler way to rent your next home.
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-6">
            Connect directly with verified property owners. Tell us what you need in plain words, and find apartments matched to your routine with zero brokerage fees.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-10">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
              <span>100% Verified Landlords</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
              <span>Zero Broker Commission</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
              <span>Direct WhatsApp &amp; Chat</span>
            </div>
          </div>

          {/* Minimal Search Capsule Card */}
          <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-5 shadow-sm text-left">
            {/* Filter Persona Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 mb-3.5">
              <button
                type="button"
                onClick={() => handleTabSelect('all')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold shadow-2xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                }`}
              >
                <Compass className="h-3.5 w-3.5" /> All Rentals
              </button>
              <button
                type="button"
                onClick={() => handleTabSelect('students')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'students'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold shadow-2xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" /> Students
              </button>
              <button
                type="button"
                onClick={() => handleTabSelect('pros')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'pros'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold shadow-2xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" /> Professionals
              </button>
              <button
                type="button"
                onClick={() => handleTabSelect('families')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'families'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold shadow-2xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                }`}
              >
                <Users className="h-3.5 w-3.5" /> Families
              </button>
            </div>

            {/* Plain English Query Box */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-3 focus-within:border-zinc-400 dark:focus-within:border-zinc-700 transition-colors mb-3.5">
              <div className="flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 text-zinc-500 dark:text-zinc-400 shrink-0 mt-0.5" />
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
                  placeholder="Describe your desired home (e.g. Furnished 2BHK near PDEU with balcony under ₹22,000)..."
                  className="w-full resize-none bg-transparent text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Quick Prompt Pills (Clean, No Emojis) */}
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mr-1">
                Try:
              </span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQuery(p.text)}
                  className="text-xs font-medium px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Controls & Search CTA Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2">
                <MapPin className="h-4 w-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Locality</span>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Area or landmark"
                    className="w-full bg-transparent text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none truncate"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2">
                <Wallet className="h-4 w-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Max Budget</span>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-transparent text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
                  >
                    <option value="15000" className="dark:bg-zinc-950">Up to ₹15,000 / mo</option>
                    <option value="20000" className="dark:bg-zinc-950">Up to ₹20,000 / mo</option>
                    <option value="25000" className="dark:bg-zinc-950">Up to ₹25,000 / mo</option>
                    <option value="35000" className="dark:bg-zinc-950">Up to ₹35,000 / mo</option>
                    <option value="50000" className="dark:bg-zinc-950">Up to ₹50,000 / mo</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSearchSubmit()}
                className="flex items-center justify-center gap-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-semibold py-2.5 px-4 transition-colors cursor-pointer text-xs sm:text-sm shadow-xs"
              >
                <span>Search Homes</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Informative Platform Facts */}
        <section className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-xs">
            <div className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">2,500+</div>
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 mt-1">Inspected Rentals</div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Active homes across Gandhinagar, PDEU, Kudasan &amp; Infocity
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-xs">
            <div className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">Zero</div>
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 mt-1">Broker Commissions</div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              No mediator fee. Deal directly with genuine property owners
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-xs">
            <div className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">&lt; 12 hrs</div>
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 mt-1">Direct Response</div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Instant contact and site visits via verified WhatsApp connections
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-xs">
            <div className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">100%</div>
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 mt-1">Verified Listers</div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Identity &amp; ownership checks before listings go live
            </p>
          </div>
        </section>

        {/* Featured Listings Grid */}
        <section className="mt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">AVAILABLE PROPERTIES</span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white mt-0.5">Featured Verified Homes</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Handpicked rentals available for immediate occupancy.</p>
            </div>
            <button
              type="button"
              onClick={() => navigateWithCurtains('/explore', 'Explore Homes')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer group"
            >
              <span>View all {activeProperties.length} homes</span>
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                isSaved={saved.includes(p.id)}
                onToggleSave={toggleSave}
                onOpenDetails={(id) => navigateWithCurtains(`/properties/${id}`, 'Property Details')}
              />
            ))}
          </div>
        </section>

        {/* How It Works - 3 Clear Informative Steps */}
        <section className="mt-20 pt-10 border-t border-zinc-200 dark:border-zinc-800">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">HOW IT WORKS</span>
            <h2 className="text-2xl font-bold text-zinc-950 dark:text-white mt-1">Simple, Transparent Renting</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Find the right apartment directly from owners in three straightforward steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xs">
              <span className="text-2xl font-bold font-mono text-zinc-300 dark:text-zinc-700">01</span>
              <h3 className="text-base font-bold text-zinc-950 dark:text-white mt-3 mb-1.5">Conversational Search</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Describe your requirements in plain language — budget limits, distance to university, parking, or furnishings.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xs">
              <span className="text-2xl font-bold font-mono text-zinc-300 dark:text-zinc-700">02</span>
              <h3 className="text-base font-bold text-zinc-950 dark:text-white mt-3 mb-1.5">Compatibility Scoring</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                RentMatch computes fit scores based on your commute, routine, and amenities to show you what actually matches.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xs">
              <span className="text-2xl font-bold font-mono text-zinc-300 dark:text-zinc-700">03</span>
              <h3 className="text-base font-bold text-zinc-950 dark:text-white mt-3 mb-1.5">Direct Owner Contact</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Connect directly with verified landlords via chat or phone, schedule visits, and finalize agreements without brokerage fees.
              </p>
            </div>
          </div>
        </section>

        {/* Informative Landlord Banner */}
        <section className="mt-16 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                Are you a property owner in Gandhinagar or Ahmedabad?
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                List your apartment directly on RentMatch AI. Zero commission, verified tenants, and complete control over inquiries.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2.5">
            {isAuthenticated && isLister ? (
              <button
                type="button"
                onClick={openAddProperty}
                className="rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-semibold px-4 py-2.5 text-xs transition-colors cursor-pointer shadow-xs"
              >
                + Add Property
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigateWithCurtains('/signup', 'Create Account')}
                className="rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-semibold px-4 py-2.5 text-xs transition-colors cursor-pointer shadow-xs"
              >
                List Property Free
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
