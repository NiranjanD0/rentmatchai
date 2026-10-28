'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import {
  Building2,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  Check,
  X,
  Plus,
  Coins,
  Clock,
  MessageCircle,
  Search,
  Sparkles,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Compass,
  Star,
  Quote,
} from 'lucide-react';
import { PropertyCard } from '../components/property';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { usePageCurtains } from '../components/ui/page-curtains';
import { USER_ROLES } from '../constants/initialData';
import { Globe } from '../components/ui/globe';

const money = (n: number) => '₹' + Number(n).toLocaleString('en-IN');

export default function HomePage() {
  const router = useRouter();
  const { navigateWithCurtains } = usePageCurtains();
  const { user, isAuthenticated, isLister, openAuthModal } = useAuth();
  const { activeProperties, saved, toggleSave, openAddProperty, openEnquiry } = useProperty();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  // Search interface states
  const [searchLocation, setSearchLocation] = useState('all');
  const [searchBedrooms, setSearchBedrooms] = useState('all');
  const [searchBudget, setSearchBudget] = useState('all');
  const [searchNaturalQuery, setSearchNaturalQuery] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);

  // Category tab state
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'students' | 'pros' | 'families'>('all');

  // Savings Calculator State
  const [calculatorRent, setCalculatorRent] = useState(22000);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Filter properties based on featured category tab
  const filteredFeatured = useMemo(() => {
    return activeProperties.filter((p) => {
      if (selectedCategory === 'students') {
        return (
          p.location.toLowerCase().includes('pdeu') ||
          p.location.toLowerCase().includes('raysan') ||
          p.rent <= 20000
        );
      }
      if (selectedCategory === 'pros') {
        return (
          p.location.toLowerCase().includes('infocity') ||
          p.furnishing === 'Fully Furnished' ||
          p.furnishing === 'Fully furnished' ||
          p.bedrooms === 1
        );
      }
      if (selectedCategory === 'families') {
        return p.bedrooms >= 2 || p.location.toLowerCase().includes('kudasan');
      }
      return true;
    }).slice(0, 6);
  }, [activeProperties, selectedCategory]);

  // Spotlight property (top-rated verified residence)
  const spotlightProperty = useMemo(() => {
    return (
      activeProperties.find((p) => p.verified && p.match >= 90) ||
      activeProperties[0] ||
      null
    );
  }, [activeProperties]);

  const handleHeroSearch = (overrideQuery?: string) => {
    const params = new URLSearchParams();
    if (searchLocation !== 'all') params.set('location', searchLocation);
    if (searchBedrooms !== 'all') params.set('bedrooms', searchBedrooms);
    if (searchBudget !== 'all') params.set('budget', searchBudget);
    const q = overrideQuery !== undefined ? overrideQuery : searchNaturalQuery;
    if (q.trim()) params.set('query', q.trim());

    const qs = params.toString();
    navigateWithCurtains(qs ? `/explore?${qs}` : '/explore', 'Curated Residences');
  };

  const aiPresets = [
    'Furnished 2BHK near PDEU under ₹20k',
    'Quiet Infocity studio with high-speed fiber',
    'Spacious 3BHK in Kudasan with covered parking',
  ];

  const faqs = [
    {
      q: 'How does RentMatch AI verify that properties are 100% direct from owners?',
      a: 'Every property listed on RentMatch undergoes biometric identity check and property deed verification. We actively filter out third-party brokers, agents, and duplicate marketing listings to ensure you only ever communicate directly with the verified deed-holder or authorized residential caretaker.',
    },
    {
      q: 'What does zero brokerage mean for both tenants and landlords?',
      a: 'Traditional rental brokers in Gandhinagar and Ahmedabad charge 15 days to 1 full month of rent as a mediator commission fee. RentMatch AI charges ₹0. 100% of your rental payment goes toward your lease and deposit, saving you between ₹15,000 and ₹45,000 on day one.',
    },
    {
      q: 'How does the AI Precision Matching algorithm score residences?',
      a: 'Our matching model calculates a multidimensional compatibility index based on transit times to your primary destination (PDEU, Infocity, SG Highway), preferred floor height, furnishing quality, ambient noise profile, and budget elasticity. Higher match scores indicate an optimal fit for your profile.',
    },
    {
      q: 'Can I schedule physical site visits and chat over WhatsApp?',
      a: 'Yes. With one click on any verified listing, you can open a direct, encrypted WhatsApp dialogue or phone call with the verified property owner. You can confirm move-in dates, schedule same-day site inspections, and negotiate lease covenants directly.',
    },
    {
      q: 'How quickly can a property owner list an apartment on RentMatch AI?',
      a: 'Listing a property takes under 2 minutes. Simply upload authentic high-resolution photos, specify your monthly rent and deposit, select your locality, and our automated verification pipeline activates your residence immediately for qualified tenants.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-950 dark:text-zinc-50 transition-colors duration-200">
      {/* Editorial Top Hairline Ambient Accent */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />

      {/* ===================== HERO SECTION: EDITORIAL & MONUMENTAL ===================== */}
      <section className="relative w-full pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-16 sm:pb-24 overflow-hidden border-b border-zinc-200/80 dark:border-zinc-800/80">
        {/* Atmospheric Ambient Monochrome Horizon (Understated Luxury) */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.03),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)] blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Editorial Kicker */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-950 dark:bg-white animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
              Edition 2026 · Gandhinagar &amp; Ahmedabad
            </span>
          </div>

          {/* Monumental Editorial Headline */}
          <div className="text-center max-w-5xl mx-auto mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.92] text-zinc-950 dark:text-white uppercase select-none"
            >
              Direct Residences.
              <br />
              <span className="text-zinc-400 dark:text-zinc-500 font-light">
                Zero Brokerage.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mt-6 text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            >
              The editorial standard in residential leasing. Curated apartments and studios connected directly with authenticated property owners across PDEU, Infocity, Kudasan, and SG Highway.
            </motion.p>
          </div>

          {/* ===================== EDITORIAL RENTAL SEARCH CONSOLE ===================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.55 }}
            className="max-w-4xl mx-auto mt-10"
          >
            <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl p-3 sm:p-4 shadow-xl shadow-zinc-950/5 dark:shadow-black/40">
              {/* Primary Search Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {/* Locality Selector */}
                <div className="flex flex-col px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <MapPin size={10} /> Locality
                  </label>
                  <select
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="mt-1 bg-transparent text-xs font-bold text-zinc-950 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Prime Localities</option>
                    <option value="Raysan">Raysan / PDEU Road</option>
                    <option value="Infocity">Infocity Tech Corridor</option>
                    <option value="Kudasan">Kudasan Residential</option>
                    <option value="Sargasan">Sargasan / SG Highway</option>
                  </select>
                </div>

                {/* Configuration Selector */}
                <div className="flex flex-col px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <BedDouble size={10} /> Configuration
                  </label>
                  <select
                    value={searchBedrooms}
                    onChange={(e) => setSearchBedrooms(e.target.value)}
                    className="mt-1 bg-transparent text-xs font-bold text-zinc-950 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="all">Any Bedroom Count</option>
                    <option value="1">1 BHK / Studio</option>
                    <option value="2">2 BHK Residence</option>
                    <option value="3">3+ BHK Spacious</option>
                  </select>
                </div>

                {/* Monthly Budget Selector */}
                <div className="flex flex-col px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <Coins size={10} /> Monthly Budget
                  </label>
                  <select
                    value={searchBudget}
                    onChange={(e) => setSearchBudget(e.target.value)}
                    className="mt-1 bg-transparent text-xs font-bold text-zinc-950 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="all">Any Budget</option>
                    <option value="16000">Under ₹16,000</option>
                    <option value="22000">Under ₹22,000</option>
                    <option value="35000">Under ₹35,000</option>
                  </select>
                </div>

                {/* Search Action Button */}
                <button
                  type="button"
                  onClick={() => handleHeroSearch()}
                  className="flex items-center justify-center gap-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs tracking-tight py-3 px-4 shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <Search size={14} />
                  <span>Search Residences</span>
                </button>
              </div>

              {/* Natural AI Query Expansion Bar */}
              <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <Sparkles size={12} className="text-zinc-900 dark:text-zinc-100 shrink-0" />
                  <span className="font-semibold">AI Matcher:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {aiPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setSearchNaturalQuery(preset);
                          handleHeroSearch(preset);
                        }}
                        className="px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-[10px] text-zinc-700 dark:text-zinc-300 font-medium transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAiInput(!showAiInput)}
                  className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer flex items-center gap-1 shrink-0 ml-auto sm:ml-0"
                >
                  <span>{showAiInput ? 'Hide Custom Prompt' : 'Custom Prompt'}</span>
                </button>
              </div>

              {/* Custom AI Prompt Input Drawer */}
              <AnimatePresence>
                {showAiInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-3"
                  >
                    <div className="flex items-center gap-2 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                      <input
                        type="text"
                        value={searchNaturalQuery}
                        onChange={(e) => setSearchNaturalQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleHeroSearch()}
                        placeholder="Type natural preferences, e.g. Sunlit 2BHK near PDEU with quiet balcony under ₹20k..."
                        className="flex-1 bg-transparent px-3 py-1.5 text-xs text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleHeroSearch()}
                        className="px-3.5 py-1.5 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        Match
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ===================== PLATFORM CREDENTIALS TICKER ===================== */}
          <div className="mt-16 pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
                100%
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mt-1">
                Direct Landlords
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Every owner deed-verified. Zero agent proxies.
              </p>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
                ₹0
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mt-1">
                Brokerage Fee
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Retain 100% of broker commissions.
              </p>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
                98%
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mt-1">
                Match Precision
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Neural commute and lifestyle fit engine.
              </p>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
                &lt; 24h
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mt-1">
                Fast Move-In
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Direct WhatsApp agreements &amp; key exchange.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== EDITORIAL SPOTLIGHT: RESIDENCE OF THE WEEK ===================== */}
      {spotlightProperty && (
        <section className="py-20 sm:py-24 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                  Architectural Spotlight
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 dark:text-white tracking-tight mt-1">
                  Featured Residence of the Week
                </h2>
              </div>
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Residence {spotlightProperty.id} · Inspected &amp; Available
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 p-6 sm:p-10">
              {/* Left: Grand Architectural Photo */}
              <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 shadow-md">
                <img
                  src={spotlightProperty.image}
                  alt={spotlightProperty.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-zinc-950/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  {spotlightProperty.propertyType}
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded-md bg-white/95 text-zinc-950 text-xs font-extrabold backdrop-blur-md shadow-xs flex items-center gap-1.5">
                  <Sparkles size={13} />
                  <span>{spotlightProperty.match}% Match Rating</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs backdrop-blur-md bg-black/60 px-4 py-2 rounded-xl">
                  <span>{spotlightProperty.location}</span>
                  <span className="font-semibold">{spotlightProperty.commute}</span>
                </div>
              </div>

              {/* Right: Editorial Narrative & Specifications */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                    <MapPin size={13} className="text-zinc-900 dark:text-white" />
                    <span>{spotlightProperty.location}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white mb-3 leading-snug">
                    {spotlightProperty.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                    {spotlightProperty.description}
                  </p>

                  {/* Specification Badges */}
                  <div className="grid grid-cols-3 gap-2.5 py-4 border-y border-zinc-200 dark:border-zinc-800 text-center mb-6">
                    <div>
                      <div className="text-base font-bold text-zinc-950 dark:text-white">
                        {spotlightProperty.bedrooms} BHK
                      </div>
                      <div className="text-[10px] uppercase font-semibold text-zinc-400">Layout</div>
                    </div>
                    <div>
                      <div className="text-base font-bold text-zinc-950 dark:text-white">
                        {spotlightProperty.sqft || 1080} sq.ft
                      </div>
                      <div className="text-[10px] uppercase font-semibold text-zinc-400">Living Area</div>
                    </div>
                    <div>
                      <div className="text-base font-bold text-zinc-950 dark:text-white">
                        {spotlightProperty.furnishing || 'Furnished'}
                      </div>
                      <div className="text-[10px] uppercase font-semibold text-zinc-400">Condition</div>
                    </div>
                  </div>

                  {/* Rent & Zero Brokerage Notice */}
                  <div className="flex items-baseline justify-between mb-6">
                    <div>
                      <span className="text-3xl font-black text-zinc-950 dark:text-white">
                        {money(spotlightProperty.rent)}
                      </span>
                      <span className="text-xs text-zinc-400 ml-1">/ month</span>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[10px] font-bold uppercase tracking-wider">
                        ₹0 Brokerage
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigateWithCurtains(`/properties/${spotlightProperty.id}`, 'Property Dossier')}
                    className="flex-1 py-3 px-5 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold tracking-tight text-center transition-all cursor-pointer shadow-xs"
                  >
                    View Residence Dossier
                  </button>
                  <button
                    type="button"
                    onClick={() => openEnquiry(spotlightProperty)}
                    className="py-3 px-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-bold tracking-tight transition-all cursor-pointer flex items-center gap-2"
                  >
                    <MessageCircle size={14} />
                    <span>Inquire</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================== CURATED PROPERTY COLLECTION WITH EDITORIAL TABS ===================== */}
      <section className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                Curated Collection
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 dark:text-white tracking-tight mt-1">
                Verified Residences
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-xl">
                Every home inspected and photographed in authentic detail. Deal directly with genuine property owners with no broker commissions.
              </p>
            </div>

            {/* Editorial Persona Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`py-1.5 px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                All Residences ({activeProperties.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('students')}
                className={`py-1.5 px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'students'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                Students (PDEU)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('pros')}
                className={`py-1.5 px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'pros'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                IT Pros (Infocity)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('families')}
                className={`py-1.5 px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'families'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                Family Residences
              </button>
            </div>
          </div>

          {/* Real Property Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredFeatured.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isSaved={saved.includes(property.id)}
                onToggleSave={toggleSave}
                onOpenDetails={(id) => navigateWithCurtains(`/properties/${id}`, 'Property Details')}
              />
            ))}
          </div>

          {/* Explore Complete Collection Button */}
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => navigateWithCurtains('/explore', 'All Residences')}
              className="inline-flex items-center gap-2 py-3 px-8 rounded-full border border-zinc-950 dark:border-white bg-transparent hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 text-zinc-950 dark:text-white font-bold text-xs tracking-tight transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <span>Explore all {activeProperties.length} verified listings in Gandhinagar</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ===================== THE AI MATCHING PROTOCOL: EDITORIAL MANIFESTO ===================== */}
      <section className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              The Protocol
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 dark:text-white tracking-tight mt-1">
              Precision Rental Architecture
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              How RentMatch AI replaces opaque broker channels with intelligent matching and verified direct leasing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 01 */}
            <div className="flex flex-col border-t border-zinc-950 dark:border-white pt-6">
              <span className="font-mono text-xs font-black text-zinc-400 mb-4">01 / VERIFICATION</span>
              <h3 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white mb-2">
                Biometric &amp; Deed Inspection
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Every owner identity and municipal property document is verified before a listing is published. We eradicate phantom ads, bait prices, and unsolicited middleman calls.
              </p>
            </div>

            {/* Step 02 */}
            <div className="flex flex-col border-t border-zinc-950 dark:border-white pt-6">
              <span className="font-mono text-xs font-black text-zinc-400 mb-4">02 / MATCHING</span>
              <h3 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white mb-2">
                Neural Compatibility Fit
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Our algorithm scores each apartment on commute efficiency to PDEU or Infocity, natural ventilation, quietness, and amenities to present curated homes with transparent compatibility scores.
              </p>
            </div>

            {/* Step 03 */}
            <div className="flex flex-col border-t border-zinc-950 dark:border-white pt-6">
              <span className="font-mono text-xs font-black text-zinc-400 mb-4">03 / DIRECT CONNECT</span>
              <h3 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white mb-2">
                Instant WhatsApp Dialogue
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Connect directly with property owners via WhatsApp or phone. Book in-person walkthroughs, negotiate covenants, and finalize digital rental agreements without paying broker commissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== NEIGHBORHOOD INTELLIGENCE DOSSIER ===================== */}
      <section className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                Locality Dossier
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 dark:text-white tracking-tight mt-1">
                Gandhinagar Prime Corridors
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                Rental benchmarks, transit speeds, and resident profiles across primary micro-markets.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateWithCurtains('/explore', 'All Localities')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-950 dark:text-white hover:underline cursor-pointer group"
            >
              <span>Explore All Localities</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Raysan / PDEU */}
            <div
              onClick={() => navigateWithCurtains('/explore?location=Raysan', 'PDEU Residences')}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 p-6 hover:border-zinc-950 dark:hover:border-white transition-all cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Academic Quarter
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-950 dark:text-white">
                    ₹12k–₹22k/mo
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white group-hover:underline">
                  Raysan &amp; PDEU Road
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Walkable to PDEU, GNLU, and NIFT. Student-friendly furnished 2BHKs, mess services, and high-speed Wi-Fi.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs font-bold text-zinc-950 dark:text-white">
                <span>View 45+ Rentals</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Infocity Tech Corridor */}
            <div
              onClick={() => navigateWithCurtains('/explore?location=Infocity', 'Infocity Residences')}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 p-6 hover:border-zinc-950 dark:hover:border-white transition-all cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Tech Corridor
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-950 dark:text-white">
                    ₹16k–₹26k/mo
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white group-hover:underline">
                  Infocity &amp; TCS Park
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Preferred by IT engineers and software executives. Modern 1BHKs and studios with 100% power backup.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs font-bold text-zinc-950 dark:text-white">
                <span>View 60+ Rentals</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Kudasan Residential Haven */}
            <div
              onClick={() => navigateWithCurtains('/explore?location=Kudasan', 'Kudasan Residences')}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 p-6 hover:border-zinc-950 dark:hover:border-white transition-all cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Family Haven
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-950 dark:text-white">
                    ₹20k–₹32k/mo
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white group-hover:underline">
                  Kudasan Residential
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Gated societies with green landscaped gardens, dedicated parking, children play zones, and supermarkets.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs font-bold text-zinc-950 dark:text-white">
                <span>View 50+ Rentals</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Sargasan / SG Highway */}
            <div
              onClick={() => navigateWithCurtains('/explore?location=Sargasan', 'Sargasan Residences')}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 p-6 hover:border-zinc-950 dark:hover:border-white transition-all cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Express Corridor
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-950 dark:text-white">
                    ₹24k–₹40k/mo
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white group-hover:underline">
                  Sargasan / SG Highway
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  High-speed arterial expressway connectivity into Ahmedabad. High-rise residential towers with clubhouses.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs font-bold text-zinc-950 dark:text-white">
                <span>View 35+ Rentals</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== ZERO BROKERAGE SAVINGS INDEX ===================== */}
      <section className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/60 p-8 sm:p-12">
            <div className="lg:col-span-7">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                Financial Index
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight mt-1">
                Zero Brokerage Direct Savings
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed max-w-xl">
                Traditional property brokers demand 1 month of monthly rent as a mediator commission. With RentMatch AI, 100% of that capital stays in your account.
              </p>

              {/* Preset Selector */}
              <div className="flex flex-wrap gap-2 mt-6">
                {[15000, 22000, 30000, 45000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCalculatorRent(amt)}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      calculatorRent === amt
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                        : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    {money(amt)}/mo
                  </button>
                ))}
              </div>
            </div>

            {/* Savings Display Card */}
            <div className="lg:col-span-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center shadow-md">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Your Direct Move-In Savings
              </span>
              <div className="text-5xl sm:text-6xl font-black text-zinc-950 dark:text-white my-3 tracking-tight">
                {money(calculatorRent)}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
                Reallocate saved broker commissions toward custom furnishings, high-speed fiber internet, or moving logistics.
              </p>
              <button
                type="button"
                onClick={() => navigateWithCurtains('/explore', 'Explore Residences')}
                className="mt-6 inline-flex items-center gap-2 py-3 px-6 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <span>Find a Broker-Free Residence</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== EDITORIAL RESIDENT & OWNER VOICES ===================== */}
      <section className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              Resident &amp; Owner Perspectives
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 dark:text-white tracking-tight mt-1">
              Voices of Direct Living
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 01 */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 p-7 flex flex-col justify-between">
              <div>
                <Quote size={20} className="text-zinc-400 mb-4" />
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 font-medium">
                  &ldquo;Moving near PDEU used to mean fielding calls from six aggressive brokers demanding ₹18,000 in brokerage fees. On RentMatch, I matched directly with Rajesh Sharma, visited the flat on Saturday, and moved in Monday without paying a rupee in commission.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <div className="w-9 h-9 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs flex items-center justify-center">
                  AP
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-950 dark:text-white">Ananya Patel</div>
                  <div className="text-[10px] text-zinc-500">Student at PDEU · Raysan Residence</div>
                </div>
              </div>
            </div>

            {/* Testimonial 02 */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 p-7 flex flex-col justify-between">
              <div>
                <Quote size={20} className="text-zinc-400 mb-4" />
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 font-medium">
                  &ldquo;As an apartment owner in Gandhinagar, I was exhausted by brokers claiming they had clients, only to post my photos with fake prices. RentMatch AI verified my deed, connected me directly with high-caliber tech professionals, and leased my 2BHK in 48 hours.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <div className="w-9 h-9 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs flex items-center justify-center">
                  RS
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-950 dark:text-white">Rajesh Sharma</div>
                  <div className="text-[10px] text-zinc-500">Property Owner · Raysan &amp; Kudasan</div>
                </div>
              </div>
            </div>

            {/* Testimonial 03 */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 p-7 flex flex-col justify-between">
              <div>
                <Quote size={20} className="text-zinc-400 mb-4" />
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 font-medium">
                  &ldquo;The AI commute matching is remarkably accurate. It recommended a 2BHK in Kudasan with a 7-minute transit to Infocity TCS Park. The floor plans and photographs matched reality 100%.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <div className="w-9 h-9 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs flex items-center justify-center">
                  VM
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-950 dark:text-white">Vikram Mehta</div>
                  <div className="text-[10px] text-zinc-500">Tech Lead at Infocity · Resident</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== ARCHITECTURAL FREQUENTLY ASKED QUESTIONS ===================== */}
      <section className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              Direct Inquiries
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.q} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex items-center justify-between w-full text-left font-bold text-sm sm:text-base text-zinc-950 dark:text-white py-2 focus:outline-none cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="ml-4 font-mono text-zinc-400 shrink-0">
                      {isOpen ? '—' : '+'}
                    </span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pt-2 pb-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== LANDLORD EDITORIAL CALLOUT ===================== */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-zinc-950 dark:border-white bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-70">
                Partnership Protocol
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mt-1">
                Own a Residential Property in Gandhinagar or Ahmedabad?
              </h2>
              <p className="text-xs sm:text-sm mt-3 leading-relaxed opacity-80">
                List in under 2 minutes. Connect with verified corporate executives, researchers, and university scholars directly with zero listing fees and zero commission cuts.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              {isAuthenticated && isLister ? (
                <button
                  type="button"
                  onClick={openAddProperty}
                  className="inline-flex items-center gap-2 py-3.5 px-7 rounded-full bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white font-bold text-xs tracking-tight shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Plus size={14} />
                  <span>+ Add New Residence</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    openAuthModal('register', USER_ROLES.PROPERTY_LISTER);
                    navigateWithCurtains('/signup', 'Create Landlord Account');
                  }}
                  className="inline-flex items-center gap-2 py-3.5 px-7 rounded-full bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white font-bold text-xs tracking-tight shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Building2 size={14} />
                  <span>List Residence Free</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
