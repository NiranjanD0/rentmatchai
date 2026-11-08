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
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePageCurtains } from '../components/ui/page-curtains';
import { LineShadowText } from '../components/ui/line-shadow-text';
import { Spotlight } from '../components/ui/spotlight';
import { Particles } from '../components/ui/particles';
import { AnimatedShinyText } from '../components/ui/animated-shiny-text';
import { ShimmerButton } from '../components/ui/shimmer-button';
import { Marquee } from '../components/ui/marquee';
import { BorderBeam } from '../components/ui/border-beam';
import { BlurFade } from '../components/ui/blur-fade';

const CORRIDOR_BADGES = [
  { label: 'Gandhinagar Direct Rentals', icon: Building2 },
  { label: 'Zero Brokerage Protocol', icon: Coins },
  { label: 'Infocity IT Park Corridor', icon: MapPin },
  { label: '100% Deed-Verified Landlords', icon: ShieldCheck },
  { label: 'PDEU / Raysan Student Hub', icon: Compass },
  { label: 'Instant WhatsApp Dialogue', icon: MessageCircle },
  { label: 'Sargasan SG Highway', icon: MapPin },
  { label: '24-Hour Digital Agreements', icon: FileCheck2 },
];

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

  // FAQ Accordion State: Default is closed (null)
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
    <div className="min-h-screen bg-white dark:bg-black text-zinc-950 dark:text-zinc-50 transition-colors duration-200 overflow-x-hidden">
      {/* ===================== HERO SECTION: ACETERNITY SPOTLIGHT + MAGIC PARTICLES ===================== */}
      <section className="relative w-full -mt-18 sm:-mt-20 min-h-[100svh] flex flex-col justify-center items-center pt-24 pb-24 sm:pt-28 sm:pb-32 overflow-hidden border-b border-zinc-200/80 dark:border-zinc-800/80">
        {/* Aceternity Spotlight Effect */}
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill={isDark ? '#ffffff' : '#a1a1aa'}
        />

        {/* Magic UI Interactive Particles Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Particles
            className="absolute inset-0"
            quantity={60}
            staticity={40}
            ease={50}
            size={0.6}
            color={isDark ? '#ffffff' : '#000000'}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto -translate-y-2 sm:-translate-y-6">
          {/* Eyebrow Kicker with Magic UI AnimatedShinyText */}
          <BlurFade delay={0.1} inView>
            <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md mb-6 shadow-2xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <AnimatedShinyText className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-300">
                Direct Rental Platform · Gandhinagar &amp; Ahmedabad
              </AnimatedShinyText>
            </div>
          </BlurFade>

          {/* Monumental Headline featuring LineShadowText */}
          <BlurFade delay={0.2} inView>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.035em] leading-[0.98] text-zinc-950 dark:text-white uppercase select-none mb-6 max-w-4xl mx-auto">
              <span>Rent Direct.</span>{' '}
              <br />
              <LineShadowText
                shadowColor={isDark ? '#ffffff' : '#000000'}
                className="italic -skew-x-12 inline-block font-black text-zinc-700 dark:text-zinc-300 pr-4 sm:pr-6"
              >
                Zero Brokerage.
              </LineShadowText>
            </h1>
          </BlurFade>

          {/* Editorial Lead Paragraph */}
          <BlurFade delay={0.3} inView>
            <p className="text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10 text-pretty">
              RentMatch AI connects verified tenants directly with authentic property owners across PDEU, Infocity, Kudasan, and SG Highway. No mediator calls, no 1-month broker commissions, and 100% direct WhatsApp communication.
            </p>
          </BlurFade>

          {/* Hero CTA with Magic UI ShimmerButton */}
          <BlurFade delay={0.4} inView>
            <div className="flex items-center justify-center gap-4">
              <ShimmerButton
                onClick={() => navigateWithCurtains('/signup', 'Create Account')}
                shimmerColor={isDark ? '#ffffff' : '#000000'}
                background={isDark ? '#09090b' : '#18181b'}
                className="font-bold py-3.5 px-8 text-xs tracking-tight shadow-xl hover:shadow-2xl transition-all active:scale-95 cursor-pointer rounded-full"
              >
                <span className="flex items-center gap-2 text-white">
                  <span>Get Started Free</span>
                  <ArrowRight size={14} />
                </span>
              </ShimmerButton>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ===================== MAGIC UI MARQUEE: VERIFIED CORRIDORS ===================== */}
      <div className="py-4 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/60 backdrop-blur-md">
        <Marquee pauseOnHover className="[--duration:35s]">
          {CORRIDOR_BADGES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2 mx-4 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-2xs whitespace-nowrap"
              >
                <Icon size={13} className="text-zinc-900 dark:text-zinc-100 shrink-0" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </Marquee>
      </div>

      {/* ===================== SECTION 1: WHY THIS WEBSITE / BROKER VS RENTMATCH ===================== */}
      <section id="why-rentmatch" className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurFade delay={0.1} inView>
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
          </BlurFade>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* The Old Broker Model */}
            <BlurFade delay={0.2} inView>
              <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/60 dark:bg-zinc-950/60 p-7 sm:p-9 flex flex-col justify-between backdrop-blur-sm h-full hover:border-zinc-350 dark:hover:border-zinc-700 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 font-bold">
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
            </BlurFade>

            {/* The RentMatch AI Standard with Magic UI BorderBeam */}
            <BlurFade delay={0.3} inView>
              <div className="relative rounded-3xl border border-zinc-950 dark:border-white bg-white dark:bg-zinc-900 p-7 sm:p-9 shadow-xl shadow-zinc-950/5 dark:shadow-black/40 flex flex-col justify-between backdrop-blur-xl h-full overflow-hidden">
                <BorderBeam
                  size={90}
                  duration={6}
                  colorFrom={isDark ? '#ffffff' : '#18181b'}
                  colorTo={isDark ? '#71717a' : '#a1a1aa'}
                  borderWidth={1.5}
                />
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
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 2: HOW IT WORKS ===================== */}
      <section id="how-it-works" className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurFade delay={0.1} inView>
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
          </BlurFade>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <BlurFade delay={0.2} inView>
              <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 p-8 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors h-full group">
                <div>
                  <div className="font-mono text-2xl font-black text-zinc-400 dark:text-zinc-600 mb-6 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                    01
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white mb-2">
                    Direct Verification
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Property deed holders submit proof of ownership and real photographs. No middlemen or agencies are permitted to list properties.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-2 text-[11px] font-bold text-zinc-900 dark:text-white">
                  <ShieldCheck size={14} className="shrink-0 text-emerald-500" />
                  <span>100% Genuine Deeds</span>
                </div>
              </div>
            </BlurFade>

            {/* Step 2 */}
            <BlurFade delay={0.3} inView>
              <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 p-8 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors h-full group">
                <div>
                  <div className="font-mono text-2xl font-black text-zinc-400 dark:text-zinc-600 mb-6 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                    02
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white mb-2">
                    AI Precision Matching
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Tenants specify transit hubs (PDEU, Infocity, SG Highway), preferred floor height, furnishing quality, and budget. Our model ranks ideal matches.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-2 text-[11px] font-bold text-zinc-900 dark:text-white">
                  <Sparkles size={14} className="shrink-0 text-amber-500" />
                  <span>Multi-Factor Compatibility</span>
                </div>
              </div>
            </BlurFade>

            {/* Step 3 */}
            <BlurFade delay={0.4} inView>
              <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 p-8 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors h-full group">
                <div>
                  <div className="font-mono text-2xl font-black text-zinc-400 dark:text-zinc-600 mb-6 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                    03
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white mb-2">
                    Instant WhatsApp Dialogue
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Initiate direct conversation with the owner. Coordinate in-person walkthroughs and finalize lease agreements with zero broker interference.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-2 text-[11px] font-bold text-zinc-900 dark:text-white">
                  <MessageCircle size={14} className="shrink-0 text-emerald-500" />
                  <span>Zero Broker Commission</span>
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 3: WHAT WE OFFER (FEATURES OVERVIEW) ===================== */}
      <section id="features" className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurFade delay={0.1} inView>
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
          </BlurFade>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <BlurFade delay={0.1} inView>
              <div className="p-7 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors h-full group">
                <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center mb-4 shadow-2xs group-hover:scale-105 transition-transform">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-1.5">
                  100% Deed-Verified Landlords
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  We confirm property ownership through municipal records to prevent agents masquerading as owners.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.15} inView>
              <div className="p-7 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors h-full group">
                <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center mb-4 shadow-2xs group-hover:scale-105 transition-transform">
                  <Coins size={20} />
                </div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-1.5">
                  Zero Brokerage Guarantee
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Zero commission charged to tenants or landlords. No hidden paperwork fees or listing markups.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.2} inView>
              <div className="p-7 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors h-full group">
                <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center mb-4 shadow-2xs group-hover:scale-105 transition-transform">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-1.5">
                  AI Compatibility Scoring
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Multidimensional scoring based on real transit routes to campuses, tech corridors, and personal lifestyle preferences.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.25} inView>
              <div className="p-7 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors h-full group">
                <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center mb-4 shadow-2xs group-hover:scale-105 transition-transform">
                  <MessageCircle size={20} />
                </div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-1.5">
                  Direct WhatsApp Integration
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  One-tap connection to message property owners directly, request walkthrough videos, and fix inspection times.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.3} inView>
              <div className="p-7 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors h-full group">
                <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center mb-4 shadow-2xs group-hover:scale-105 transition-transform">
                  <Compass size={20} />
                </div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-1.5">
                  Gandhinagar Prime Corridors
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Focused micro-market coverage across Raysan (PDEU), Infocity (TCS Park), Kudasan, and SG Highway.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.35} inView>
              <div className="p-7 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors h-full group">
                <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center mb-4 shadow-2xs group-hover:scale-105 transition-transform">
                  <Clock size={20} />
                </div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-1.5">
                  Fast Move-In Turnaround
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Without broker delays and scheduling bottlenecks, agreements and handovers are completed in under 24 hours.
                </p>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 4: WHO IS THIS FOR (TENANTS & LANDLORDS) ===================== */}
      <section id="audience" className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* For Tenants */}
            <BlurFade delay={0.2} inView>
              <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 p-8 sm:p-12 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors h-full">
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
                      <Check size={14} className="text-zinc-950 dark:text-white shrink-0" />
                      <span>Direct WhatsApp chat with property owners</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-zinc-950 dark:text-white shrink-0" />
                      <span>Save 100% of upfront broker fees</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-zinc-950 dark:text-white shrink-0" />
                      <span>Smart commute compatibility matching</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => navigateWithCurtains('/signup', 'Join as Tenant')}
                  className="w-full py-3.5 px-6 rounded-full bg-zinc-950 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-150 text-white dark:text-zinc-950 text-xs font-bold tracking-tight text-center transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  Join as Tenant
                </button>
              </div>
            </BlurFade>

            {/* For Landlords */}
            <BlurFade delay={0.3} inView>
              <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 p-8 sm:p-12 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors h-full">
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
                      <Check size={14} className="text-zinc-950 dark:text-white shrink-0" />
                      <span>Zero listing fees and zero commission cuts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-zinc-950 dark:text-white shrink-0" />
                      <span>Pre-screened, verified student and professional tenants</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-zinc-950 dark:text-white shrink-0" />
                      <span>Manage all inquiries and walkthroughs directly</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => navigateWithCurtains('/signup', 'Create Landlord Account')}
                  className="w-full py-3.5 px-6 rounded-full border border-zinc-950 dark:border-white bg-transparent hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 text-zinc-950 dark:text-white text-xs font-bold tracking-tight text-center transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  List Property Free
                </button>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 5: FREQUENTLY ASKED QUESTIONS (DEFAULT CLOSED) ===================== */}
      <section id="faqs" className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurFade delay={0.1} inView>
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
          </BlurFade>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <BlurFade key={faq.q} delay={0.1 * index} inView>
                  <div className="py-5">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="flex items-center justify-between w-full text-left font-bold text-sm sm:text-base text-zinc-950 dark:text-white py-2 focus:outline-none cursor-pointer active:opacity-75 transition-opacity"
                      aria-expanded={isOpen}
                    >
                      <span className="pr-4">{faq.q}</span>
                      <span className="font-mono text-zinc-400 dark:text-zinc-500 text-lg shrink-0">
                        {isOpen ? '—' : '+'}
                      </span>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                          className="overflow-hidden"
                        >
                          <p className="pt-2 pb-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </BlurFade>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
