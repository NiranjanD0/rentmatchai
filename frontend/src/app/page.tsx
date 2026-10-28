'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import {
  Building2,
  ShieldCheck,
  ArrowRight,
  Check,
  X,
  Coins,
  Clock,
  MessageCircle,
  Sparkles,
  Zap,
  Users,
  Compass,
  FileCheck2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePageCurtains } from '../components/ui/page-curtains';
import { LineShadowText } from '../components/ui/line-shadow-text';
import { Globe } from '../components/ui/globe';

const money = (n: number) => '₹' + Number(n).toLocaleString('en-IN');

export default function HomePage() {
  const router = useRouter();
  const { navigateWithCurtains } = usePageCurtains();
  const { isAuthenticated, isLister, openAuthModal } = useAuth();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  // Savings Calculator State
  const [calculatorRent, setCalculatorRent] = useState(22000);

  // FAQ Accordion State: Default is closed (null) as requested
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Why did we build RentMatch AI?',
      a: 'Traditional rental broker models force tenants to surrender 15 days to 1 full month of rent as a mediator commission, while brokers often circulate bait ads and fake photos. RentMatch AI cuts out middlemen entirely by connecting tenants directly with authentic deed-verified property owners.',
    },
    {
      q: 'How does RentMatch AI verify that listings are 100% direct owners?',
      a: 'Every property owner submits biometric identity proof and municipal property documentation. We actively filter out third-party brokers, real estate agencies, and duplicate listings to ensure you only ever communicate directly with the verified deed-holder.',
    },
    {
      q: 'What does zero brokerage mean for tenants and landlords?',
      a: 'Zero brokerage means neither the tenant nor the landlord pays any commission to a middleman. 100% of the rent and deposit stays between the tenant and the landlord, saving you between ₹15,000 and ₹45,000 on day one.',
    },
    {
      q: 'How does the AI Precision Matching work?',
      a: 'Our matching model calculates compatibility based on your commute distance to PDEU, Infocity, or SG Highway, furnishing quality, ambient noise profile, and budget elasticity. This helps renters find the exact right home without endless searching.',
    },
    {
      q: 'Can I schedule physical site visits and chat over WhatsApp?',
      a: 'Yes. With one click on any listing, you can initiate a direct WhatsApp dialogue or phone call with the verified owner to schedule same-day walkthroughs, review digital floor plans, and agree on lease terms.',
    },
    {
      q: 'How will I manage my rentals and view properties?',
      a: 'Our upcoming resident and landlord dashboard will provide a centralized workspace to manage property shortlists, direct chat histories, visit appointments, and digital rental agreements seamlessly.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-950 dark:text-zinc-50 transition-colors duration-200">
      {/* ===================== HERO SECTION: EDITORIAL & IMMERSIVE ===================== */}
      <section className="relative w-full pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-20 sm:pb-28 overflow-hidden border-b border-zinc-200/80 dark:border-zinc-800/80">
        {/* Subtle Ambient Monochrome Vignette */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.03),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)] blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow Kicker */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-950 dark:bg-white animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
              Direct Rental Platform · Gandhinagar &amp; Ahmedabad
            </span>
          </motion.div>

          {/* Monumental Headline featuring LineShadowText */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-zinc-950 dark:text-white uppercase select-none mb-6"
          >
            Rent Direct.{' '}
            <br className="hidden sm:inline" />
            <LineShadowText
              shadowColor={isDark ? '#52525b' : '#a1a1aa'}
              className="italic font-black text-zinc-950 dark:text-white"
            >
              Zero Brokerage.
            </LineShadowText>
          </motion.h1>

          {/* Editorial Lead Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            RentMatch AI connects verified tenants directly with authentic property owners across PDEU, Infocity, Kudasan, and SG Highway. No mediator calls, no 1-month broker commissions, and 100% direct WhatsApp communication.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button
              type="button"
              onClick={() => navigateWithCurtains('/signup', 'Create Account')}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold py-3.5 px-8 text-xs tracking-tight shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-700 hover:border-zinc-950 dark:hover:border-white bg-transparent text-zinc-900 dark:text-white font-bold py-3.5 px-7 text-xs tracking-tight transition-all active:scale-95 cursor-pointer"
            >
              <span>How It Works</span>
            </button>
          </motion.div>

          {/* Centerpiece 3D Interactive Globe */}
          <div className="relative w-full max-w-md mx-auto aspect-square mt-14 mb-4 select-none pointer-events-auto">
            <Globe
              key={isDark ? 'dark' : 'light'}
              className="w-full h-full opacity-90 transition-opacity duration-700"
              config={{
                width: 700,
                height: 700,
                onRender: () => {},
                devicePixelRatio: 1.5,
                phi: 0,
                theta: 0.28,
                dark: isDark ? 1 : 0,
                diffuse: 1.2,
                mapSamples: 14000,
                mapBrightness: isDark ? 2.2 : 1.4,
                baseColor: isDark ? [0.12, 0.12, 0.14] : [0.95, 0.95, 0.96],
                markerColor: isDark ? [1, 1, 1] : [0.1, 0.1, 0.1],
                glowColor: isDark ? [0.2, 0.2, 0.2] : [0.9, 0.9, 0.9],
                markers: [
                  { location: [23.2156, 72.6369], size: 0.12 }, // Gandhinagar
                  { location: [23.1557, 72.6669], size: 0.08 }, // PDEU / Raysan
                  { location: [23.195, 72.63], size: 0.08 }, // Infocity
                  { location: [23.0225, 72.5714], size: 0.06 }, // Ahmedabad
                ],
              }}
            />
          </div>
        </div>
      </section>

      {/* ===================== SECTION 1: WHY THIS WEBSITE / BROKER VS RENTMATCH ===================== */}
      <section className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              The Mission
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 dark:text-white tracking-tight mt-1">
              Why We Built RentMatch AI
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              Renting a home in Gandhinagar and Ahmedabad has been dominated by opaque middlemen, inflated commission fees, and bait-and-switch listings. We redesigned the process from first principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* The Old Broker Model */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 p-7 sm:p-9 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                    The Traditional Broker Way
                  </span>
                  <span className="text-xs font-mono text-zinc-400">Expensive &amp; Opaque</span>
                </div>
                <ul className="space-y-4 text-xs text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-start gap-3">
                    <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>1-Month Brokerage Fee:</strong> Pay ₹15,000 to ₹35,000+ upfront just for someone showing you an address.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Fake &amp; Bait Ads:</strong> Photos rarely match real property conditions, wasting hours on fruitless visits.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Spam Broker Calls:</strong> Your personal contact details are shared across dozens of aggressive local agents.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Intermediary Delays:</strong> Every question and negotiation is delayed through a third-party middleman.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* The RentMatch AI Standard */}
            <div className="rounded-2xl border border-zinc-950 dark:border-white bg-white dark:bg-zinc-900 p-7 sm:p-9 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
                    The RentMatch AI Standard
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white">
                    Direct
                  </span>
                </div>
                <ul className="space-y-4 text-xs text-zinc-800 dark:text-zinc-200">
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-zinc-950 dark:text-white shrink-0 mt-0.5" />
                    <span>
                      <strong>Zero Brokerage Protocol:</strong> Save 100% of broker commissions to spend on your new home setup.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-zinc-950 dark:text-white shrink-0 mt-0.5" />
                    <span>
                      <strong>100% Deed-Verified Landlords:</strong> Real property owners authenticated with verified identity and deed records.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-zinc-950 dark:text-white shrink-0 mt-0.5" />
                    <span>
                      <strong>Privacy Protected:</strong> Your phone number remains completely confidential until you choose to connect.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-zinc-950 dark:text-white shrink-0 mt-0.5" />
                    <span>
                      <strong>Instant WhatsApp Dialogue:</strong> Chat directly with verified landlords, schedule site visits, and agree on terms.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 2: HOW IT WORKS ===================== */}
      <section id="how-it-works" className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              The Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 dark:text-white tracking-tight mt-1">
              How RentMatch Works
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              A transparent, 3-step leasing journey designed to save both tenants and landlords time and capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 p-8 flex flex-col justify-between">
              <div>
                <div className="font-mono text-2xl font-black text-zinc-400 mb-6">01</div>
                <h3 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white mb-2">
                  Direct Verification
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Property deed holders submit proof of ownership and real photographs. No middlemen or agencies are permitted to list properties.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-2 text-[11px] font-bold text-zinc-900 dark:text-white">
                <ShieldCheck size={14} />
                <span>100% Genuine Deeds</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 p-8 flex flex-col justify-between">
              <div>
                <div className="font-mono text-2xl font-black text-zinc-400 mb-6">02</div>
                <h3 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white mb-2">
                  AI Precision Matching
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Tenants specify transit hubs (PDEU, Infocity, SG Highway), preferred floor height, furnishing quality, and budget. Our model ranks ideal matches.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-2 text-[11px] font-bold text-zinc-900 dark:text-white">
                <Sparkles size={14} />
                <span>Multi-Factor Compatibility</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 p-8 flex flex-col justify-between">
              <div>
                <div className="font-mono text-2xl font-black text-zinc-400 mb-6">03</div>
                <h3 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white mb-2">
                  Instant WhatsApp Dialogue
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Initiate direct conversation with the owner. Coordinate in-person walkthroughs and finalize lease agreements with zero broker interference.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-2 text-[11px] font-bold text-zinc-900 dark:text-white">
                <MessageCircle size={14} />
                <span>Zero Broker Commission</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 3: WHAT WE OFFER (FEATURES OVERVIEW) ===================== */}
      <section className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 dark:text-white tracking-tight mt-1">
              What We Offer
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              Every tool and guardrail you need to find, verify, and secure residential rentals directly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-7 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center mb-4">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-1.5">
                100% Deed-Verified Landlords
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We confirm property ownership through municipal records to prevent agents masquerading as owners.
              </p>
            </div>

            <div className="p-7 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center mb-4">
                <Coins size={20} />
              </div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-1.5">
                Zero Brokerage Guarantee
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Zero commission charged to tenants or landlords. No hidden paperwork fees or listing markups.
              </p>
            </div>

            <div className="p-7 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center mb-4">
                <Sparkles size={20} />
              </div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-1.5">
                AI Compatibility Scoring
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Multidimensional scoring based on real transit routes to campuses, tech corridors, and personal lifestyle preferences.
              </p>
            </div>

            <div className="p-7 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center mb-4">
                <MessageCircle size={20} />
              </div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-1.5">
                Direct WhatsApp Integration
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                One-tap connection to message property owners directly, request walkthrough videos, and fix inspection times.
              </p>
            </div>

            <div className="p-7 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center mb-4">
                <Compass size={20} />
              </div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-1.5">
                Gandhinagar Prime Corridors
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Focused micro-market coverage across Raysan (PDEU), Infocity (TCS Park), Kudasan, and SG Highway.
              </p>
            </div>

            <div className="p-7 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center mb-4">
                <Clock size={20} />
              </div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-1.5">
                Fast Move-In Turnaround
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Without broker delays and scheduling bottlenecks, agreements and handovers are completed in under 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 4: WHO IS THIS FOR (TENANTS & LANDLORDS) ===================== */}
      <section className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* For Tenants */}
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 p-8 sm:p-12 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                  For Renters &amp; Students
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight mt-2 mb-4">
                  Find Your Home Without Broker Fees
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  Whether you are studying at PDEU or working in Infocity, avoid losing thousands to mediators. Browse verified apartments, compare commute routes, and deal directly with genuine landlords.
                </p>
                <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 mb-8">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-zinc-950 dark:text-white" />
                    <span>Direct WhatsApp chat with property owners</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-zinc-950 dark:text-white" />
                    <span>Save 100% of upfront broker fees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-zinc-950 dark:text-white" />
                    <span>Smart commute compatibility matching</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => navigateWithCurtains('/signup', 'Join as Tenant')}
                className="w-full py-3.5 px-6 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold tracking-tight text-center transition-all cursor-pointer shadow-xs"
              >
                Join as Tenant
              </button>
            </div>

            {/* For Landlords */}
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 p-8 sm:p-12 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                  For Property Owners
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight mt-2 mb-4">
                  List Your Property in 2 Minutes
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  Own an apartment or flat in Gandhinagar? Connect directly with verified corporate professionals and university students. Zero listing charges, zero commissions, and complete control over inquiries.
                </p>
                <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 mb-8">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-zinc-950 dark:text-white" />
                    <span>Zero listing fees and zero commission cuts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-zinc-950 dark:text-white" />
                    <span>Pre-screened, verified student and professional tenants</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-zinc-950 dark:text-white" />
                    <span>Manage all inquiries and walkthroughs directly</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => navigateWithCurtains('/signup', 'Create Landlord Account')}
                className="w-full py-3.5 px-6 rounded-full border border-zinc-950 dark:border-white bg-transparent hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 text-zinc-950 dark:text-white text-xs font-bold tracking-tight text-center transition-all cursor-pointer shadow-xs"
              >
                List Property Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 5: ZERO BROKERAGE SAVINGS CALCULATOR ===================== */}
      <section className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/60 p-8 sm:p-12">
            <div className="lg:col-span-7">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                Direct Savings
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight mt-1">
                How Much Do You Save With Zero Brokerage?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed max-w-xl">
                Traditional agents demand 1 full month of rent as a mediator commission. With RentMatch AI, 100% of that capital stays in your bank account.
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
                That is enough to furnish your bedroom, set up high-speed Wi-Fi, or cover your moving and transport costs entirely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 6: FREQUENTLY ASKED QUESTIONS (DEFAULT CLOSED) ===================== */}
      <section className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              Clear Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              Everything you need to know about direct renting and verification on RentMatch AI.
            </p>
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

      {/* ===================== FINAL CALL TO ACTION ===================== */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl border border-zinc-950 dark:border-white bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 p-10 sm:p-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-70">
              Start Direct Living
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-2 mb-4">
              Ready to Experience Broker-Free Renting?
            </h2>
            <p className="text-xs sm:text-sm max-w-xl mx-auto leading-relaxed opacity-80 mb-8">
              Join students, tech professionals, and property owners across Gandhinagar and Ahmedabad today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => navigateWithCurtains('/signup', 'Create Account')}
                className="py-3.5 px-8 rounded-full bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white font-bold text-xs tracking-tight shadow-md hover:opacity-90 transition-opacity cursor-pointer"
              >
                Create Free Account
              </button>
              <button
                type="button"
                onClick={() => navigateWithCurtains('/login', 'Sign In')}
                className="py-3.5 px-8 rounded-full border border-white/30 dark:border-zinc-300 text-white dark:text-zinc-950 font-bold text-xs tracking-tight hover:bg-white/10 dark:hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
