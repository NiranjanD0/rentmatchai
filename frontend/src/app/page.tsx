'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
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
} from 'lucide-react';
import { PropertyCard } from '../components/property';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { usePageCurtains } from '../components/ui/page-curtains';
import { USER_ROLES } from '../constants/initialData';
import { ShimmerButton } from '../components/ui/shimmer-button';
import { Globe } from '../components/ui/globe';
import { AuroraText } from '../components/ui/aurora-text';

export default function HomePage() {
  const router = useRouter();
  const { navigateWithCurtains } = usePageCurtains();
  const { user, isAuthenticated, isLister, openAuthModal } = useAuth();
  const { activeProperties, saved, toggleSave, openAddProperty } = useProperty();

  // Category tab state
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'students' | 'pros' | 'families'>('all');

  // Savings Calculator State
  const [calculatorRent, setCalculatorRent] = useState(22000);

  // Filter properties based on featured category tab
  const filteredFeatured = activeProperties.filter((p) => {
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
        p.bedrooms === 1
      );
    }
    if (selectedCategory === 'families') {
      return p.bedrooms >= 2 || p.location.toLowerCase().includes('kudasan');
    }
    return true;
  }).slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Background Decorative Ambient Blobs */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[560px] overflow-hidden -z-10">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/15 to-teal-400/5 dark:from-emerald-500/10 dark:to-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-gradient-to-bl from-teal-400/15 to-cyan-400/5 dark:from-teal-500/10 dark:to-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-24">
        {/* ===================== IMMERSIVE 100% VIEWPORT HERO WITH CENTERPIECE GLOBE ===================== */}
        <section className="relative w-full h-[calc(100svh-5rem)] min-h-[600px] flex flex-col items-center justify-center overflow-hidden text-center select-none">
          {/* Subtle Green/Cyan Atmospheric Horizon Glow */}
          <div className="pointer-events-none absolute bottom-[-160px] sm:bottom-[-210px] md:bottom-[-260px] lg:bottom-[-290px] left-1/2 -translate-x-1/2 w-[640px] sm:w-[820px] md:w-[990px] lg:w-[1120px] aspect-square rounded-full bg-[radial-gradient(circle_at_50%_18%,rgba(16,185,129,0.28)_0%,rgba(6,182,212,0.18)_25%,rgba(16,185,129,0.04)_50%,transparent_70%)] blur-2xl -z-10" />

          {/* Top Ambient Subtle Glow */}
          <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 w-[450px] sm:w-[650px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_70%)] blur-2xl -z-10" />

          {/* Centerpiece Globe: Upper Hemisphere Emerging from the Bottom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto absolute bottom-[-220px] sm:bottom-[-290px] md:bottom-[-360px] lg:bottom-[-400px] left-1/2 -translate-x-1/2 w-[620px] sm:w-[800px] md:w-[960px] lg:w-[1080px] aspect-square z-0"
          >
            <Globe
              className="w-full h-full max-w-none opacity-90 transition-opacity duration-700"
              config={{
                width: 1080,
                height: 1080,
                onRender: () => {},
                devicePixelRatio: 1.5,
                phi: 0,
                theta: 0.28,
                dark: 1,
                diffuse: 1.2,
                mapSamples: 14000,
                mapBrightness: 2.2,
                baseColor: [0.12, 0.22, 0.18],
                markerColor: [16 / 255, 185 / 255, 129 / 255],
                glowColor: [16 / 255, 185 / 255, 129 / 255],
                markers: [
                  { location: [23.2156, 72.6369], size: 0.13 }, // Gandhinagar & Ahmedabad
                  { location: [23.1557, 72.6669], size: 0.09 }, // PDEU / Raysan
                  { location: [23.195, 72.63], size: 0.09 }, // Infocity
                  { location: [19.076, 72.8777], size: 0.06 }, // Mumbai
                  { location: [28.6139, 77.209], size: 0.06 }, // Delhi
                  { location: [12.9716, 77.5946], size: 0.06 }, // Bengaluru
                ],
              }}
            />
          </motion.div>

          {/* Bottom Seamless Gradient Blend into Page Content */}
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white dark:from-black via-white/85 dark:via-black/85 to-transparent z-10" />

          {/* Top Radial Vignette for Optimal Text Contrast */}
          <div className="pointer-events-none absolute top-0 inset-x-0 h-[420px] bg-[radial-gradient(ellipse_at_50%_35%,rgba(255,255,255,0.7),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_50%_35%,rgba(0,0,0,0.65),transparent_70%)] z-10" />

          {/* Layered Foreground Content (Moved up to give prominent breathing room above the rising globe) */}
          <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center px-4 -mt-10 sm:-mt-16 md:-mt-20">

            {/* Location & Zero Brokerage Badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15 backdrop-blur-md text-[11px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-5 shadow-xs"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live in Gandhinagar &amp; Ahmedabad &bull; Zero Broker Commission</span>
            </motion.div>

            {/* Hero Main Headline with AuroraText */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.5 }}
              className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-zinc-950 dark:text-white max-w-4xl mx-auto leading-[1.14] mb-5 drop-shadow-xs"
            >
              Rent Verified Homes Directly.{' '}
              <AuroraText
                colors={['#10b981', '#06b6d4', '#3b82f6', '#10b981']}
                className="font-black"
              >
                No Broker Calls.
              </AuroraText>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.5 }}
              className="text-sm sm:text-base md:text-lg text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow-xs"
            >
              Connect directly with verified property owners near PDEU, Infocity, Kudasan, and SG Highway. Verified photographs, direct WhatsApp messaging, and zero broker fees.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <button
                type="button"
                onClick={() => navigateWithCurtains('/explore', 'Explore Homes')}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-7 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 transition-all duration-200 active:scale-[0.98] cursor-pointer text-sm"
              >
                <span>Explore Verified Rentals</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* ShimmerButton for List Property - opens signup page */}
              <ShimmerButton
                shimmerColor="#10b981"
                background="rgba(16, 185, 129, 0.15)"
                className="border border-emerald-500/40 text-zinc-950 dark:text-white font-bold py-3 px-6 shadow-md hover:shadow-emerald-500/20 text-sm active:scale-[0.98] cursor-pointer"
                onClick={() => navigateWithCurtains('/signup', 'Create Landlord Account')}
              >
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>List Property</span>
                </div>
              </ShimmerButton>
            </motion.div>

          </div>
        </section>

        {/* ===================== PLATFORM TRUST PILLARS ===================== */}
        <section className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md p-5 hover:border-emerald-500/40 transition-all shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white">100%</div>
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-200 mt-0.5">Verified Landlords</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Every owner verified with identity &amp; ownership documents.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md p-5 hover:border-emerald-500/40 transition-all shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 mb-3">
              <Coins className="h-5 w-5" />
            </div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white">₹0 Brokerage</div>
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-200 mt-0.5">Direct Dealings</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Never pay 15-day or 1-month commissions to rental agents.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md p-5 hover:border-emerald-500/40 transition-all shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mb-3">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white">Direct Chat</div>
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-200 mt-0.5">WhatsApp &amp; Phone</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Instant site visit bookings without intermediary delays.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md p-5 hover:border-emerald-500/40 transition-all shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 mb-3">
              <Clock className="h-5 w-5" />
            </div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white">&lt; 24 Hours</div>
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-200 mt-0.5">Fast Move-In</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Finalize agreements and receive digital keys in record time.
            </p>
          </div>
        </section>

        {/* ===================== TRADITIONAL BROKER VS RENTMATCH COMPARISON ===================== */}
        <section className="mt-20 pt-10 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              TRANSPARENCY REPORT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
              Why Smart Renters Skip Traditional Brokers
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              Compare the traditional rental broker experience against RentMatch AI direct matching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Traditional Broker Box */}
            <div className="rounded-3xl border border-red-200/80 dark:border-red-950/60 bg-red-50/40 dark:bg-red-950/20 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Old Broker Way</span>
                <span className="text-xs font-mono text-red-500 font-bold">Expensive &amp; Opaque</span>
              </div>
              <ul className="space-y-3.5 text-xs text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-2.5">
                  <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>1-Month Brokerage Fee:</strong> Pay ₹15,000 to ₹35,000+ upfront just for showing addresses.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Fake Photos &amp; Bait Ads:</strong> Photos in ads rarely match actual property conditions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Spam Broker Calls:</strong> Your number is shared across dozens of aggressive local agents.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>No Direct Landlord Connect:</strong> Everything is filtered through a middleman who delays negotiations.</span>
                </li>
              </ul>
            </div>

            {/* RentMatch AI Box */}
            <div className="rounded-3xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/30 p-6 sm:p-7 shadow-md ring-1 ring-emerald-500/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">RentMatch AI</span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/80 px-2.5 py-0.5 rounded-full">Recommended</span>
              </div>
              <ul className="space-y-3.5 text-xs text-zinc-800 dark:text-zinc-200">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Broker Commission:</strong> Save 100% of broker fees to spend on your new home setup.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>100% Inspected &amp; Real Photos:</strong> High-resolution photos, verified floor plans, and real amenities.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Privacy Protected:</strong> Your contact details remain confidential until you choose to connect.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Instant WhatsApp Direct:</strong> Chat with real verified landlords, schedule visits, and finalize agreements.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ===================== NEIGHBORHOOD RENTAL HUB ===================== */}
        <section className="mt-20 pt-10 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                LOCALITY GUIDE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
                Explore Top Gandhinagar Neighborhoods
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Rental prices, student density, and commute hubs across prime micro-markets.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateWithCurtains('/explore', 'Explore Homes')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer group"
            >
              <span>Explore All Localities</span>
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Raysan / PDEU */}
            <div
              onClick={() => navigateWithCurtains('/explore?location=Raysan', 'PDEU Rentals')}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-5 hover:border-emerald-500/50 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
                  Student Hub
                </span>
                <span className="text-xs font-bold text-zinc-900 dark:text-white">From ₹12k/mo</span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Raysan / PDEU Road
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Walkable to PDEU &amp; GNLU. Furnished 2BHKs, mess services, and high-speed fiber internet.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>View 45+ Rentals</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Infocity */}
            <div
              onClick={() => navigateWithCurtains('/explore?location=Infocity', 'Infocity Rentals')}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-5 hover:border-teal-500/50 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/50">
                  Tech Corridor
                </span>
                <span className="text-xs font-bold text-zinc-900 dark:text-white">From ₹16k/mo</span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Infocity / TCS Park
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Preferred by IT engineers and executives. 1BHKs &amp; modern studios with power backup.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                <span>View 60+ Rentals</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Kudasan */}
            <div
              onClick={() => navigateWithCurtains('/explore?location=Kudasan', 'Kudasan Rentals')}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-5 hover:border-amber-500/50 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50">
                  Family Prime
                </span>
                <span className="text-xs font-bold text-zinc-900 dark:text-white">From ₹22k/mo</span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Kudasan Residential
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Gated communities with gardens, covered car parking, 24/7 security, and supermarket access.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span>View 50+ Rentals</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Sargasan / SG Highway */}
            <div
              onClick={() => navigateWithCurtains('/explore?location=Sargasan', 'Sargasan Rentals')}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-5 hover:border-cyan-500/50 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200/50 dark:border-cyan-800/50">
                  Expressway
                </span>
                <span className="text-xs font-bold text-zinc-900 dark:text-white">From ₹25k/mo</span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Sargasan / SG Highway
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Fast expressway connectivity to Ahmedabad. High-rise towers with gyms and clubhouses.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                <span>View 35+ Rentals</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </section>

        {/* ===================== FEATURED RENTALS GRID WITH PERSONA TABS ===================== */}
        <section className="mt-20 pt-10 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                ACTIVE PROPERTIES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
                Featured Verified Homes
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Inspected rentals available for direct lease with authentic owners.
              </p>
            </div>

            {/* Persona Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                All Homes
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('students')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'students'
                    ? 'bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Students (PDEU)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('pros')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'pros'
                    ? 'bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                IT Pros (Infocity)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('families')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'families'
                    ? 'bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Family Flats
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatured.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                isSaved={saved.includes(p.id)}
                onToggleSave={toggleSave}
                onOpenDetails={(id) => navigateWithCurtains(`/properties/${id}`, 'Property Details')}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => navigateWithCurtains('/explore', 'Explore Homes')}
              className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>Explore all {activeProperties.length} verified listings in Gandhinagar</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* ===================== ZERO BROKERAGE SAVINGS CALCULATOR ===================== */}
        <section className="mt-20 rounded-3xl border border-emerald-300 dark:border-emerald-800/80 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-emerald-500/15 dark:from-emerald-950/40 dark:via-zinc-900/60 dark:to-teal-950/30 p-6 sm:p-10 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                SAVINGS CALCULATOR
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
                How Much Do You Save With Zero Brokerage?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                Traditional agents demand 1-month rent as mediator commission. With RentMatch AI, 100% of that money stays in your bank account.
              </p>

              {/* Preset buttons */}
              <div className="flex flex-wrap gap-2 mt-5">
                {[15000, 22000, 30000, 45000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCalculatorRent(amt)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      calculatorRent === amt
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}/mo
                  </button>
                ))}
              </div>
            </div>

            {/* Savings Display Card */}
            <div className="rounded-2xl border border-emerald-300/80 dark:border-emerald-800 bg-white/90 dark:bg-zinc-900/90 p-6 sm:p-7 shadow-md text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Your Direct Savings on Move-In
              </span>
              <div className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 my-2">
                ₹{calculatorRent.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
                That is enough to furnish your bedroom, set up high-speed Wi-Fi, or cover your moving and transport costs entirely.
              </p>
              <button
                type="button"
                onClick={() => navigateWithCurtains('/explore', 'Explore Homes')}
                className="mt-5 inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <span>Find a Broker-Free Home</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* ===================== LANDLORD CALLOUT BANNER ===================== */}
        <section className="mt-20 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-7 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
                Are you a property owner in Gandhinagar or Ahmedabad?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl leading-relaxed">
                List your apartment in under 2 minutes. Reach verified university students and IT professionals directly with zero listing fees and zero commission cuts.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {isAuthenticated && isLister ? (
              <button
                type="button"
                onClick={openAddProperty}
                className="flex items-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>+ Add New Property</span>
              </button>
            ) : (
              <ShimmerButton
                shimmerColor="#10b981"
                background="rgba(16, 185, 129, 0.15)"
                className="border border-emerald-500/40 text-zinc-900 dark:text-white font-bold py-3 px-6 shadow-md text-xs active:scale-95 cursor-pointer"
                onClick={() => {
                  openAuthModal('register', USER_ROLES.PROPERTY_LISTER);
                  navigateWithCurtains('/signup', 'Create Landlord Account');
                }}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>List Property Free</span>
                </div>
              </ShimmerButton>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
