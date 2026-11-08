'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  ArrowRight,
  Check,
  X,
  MessageCircle,
  Sparkles,
  Compass,
  Search,
} from 'lucide-react';
import { usePageCurtains } from '../components/ui/page-curtains';

export default function HomePage() {
  const { navigateWithCurtains } = usePageCurtains();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Why did we build RentMatch AI?',
      a: 'Traditional rental broker models force tenants to surrender 15 days to 1 full month of rent as a mediator commission, while brokers often circulate bait ads and fake photos. RentMatch AI cuts out middlemen entirely by connecting tenants directly with authentic deed-verified property owners.',
    },
    {
      q: 'How does RentMatch AI verify that listings are 100% direct owners?',
      a: 'Every property owner submits identity credentials and municipal property tax/deed documentation. We actively filter out third-party brokers, real estate agencies, and duplicate listings to ensure you only ever communicate directly with the verified deed-holder.',
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
      a: 'Our resident and landlord dashboard provides a centralized workspace to manage property shortlists, direct chat histories, visit appointments, and digital rental agreements seamlessly.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* ===================== HERO SECTION: APP-FRAME COLLAGE ===================== */}
      <section className="relative w-full pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Plain Copy, Strong Editorial Typography */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>Direct leasing · Gandhinagar &amp; Ahmedabad</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.08]">
                Rent direct from verified owners. Zero broker commission.
              </h1>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
                RentMatch AI connects university students and professionals directly with deed-authenticated property owners in Gandhinagar. No broker calls, no one-month commission fees, and direct WhatsApp walkthroughs.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigateWithCurtains('/dashboard/explore', 'Find Properties')}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium tracking-tight px-5 py-3 transition-colors shadow-2xs active:scale-[0.98] cursor-pointer"
                >
                  <span>Explore verified homes</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => navigateWithCurtains('/signup', 'List Property')}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs font-medium tracking-tight px-5 py-3 transition-colors active:scale-[0.98] cursor-pointer"
                >
                  <span>List your property direct</span>
                </button>
              </div>

              <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  100% Deed-authenticated
                </span>
                <span>•</span>
                <span>₹32,000 average upfront saved</span>
              </div>
            </div>

            {/* Right Column: High-Craft Live Product App-Frame */}
            <div className="lg:col-span-7 relative">
              <div className="relative rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-4 sm:p-6 shadow-xl backdrop-blur-xs">
                {/* Window Chrome Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200/70 dark:border-zinc-800/70">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    RentMatch AI · Compatibility Engine
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Live
                  </span>
                </div>

                {/* Natural Language Prompt Simulation */}
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs mb-4">
                  <div className="flex items-center gap-2.5 text-xs">
                    <Search size={14} className="text-zinc-400 shrink-0" />
                    <span className="font-mono text-zinc-800 dark:text-zinc-200 truncate">
                      &quot;Furnished 2BHK near PDEU with fast fiber under ₹20,000/mo&quot;
                    </span>
                    <span className="ml-auto shrink-0 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      98% Match
                    </span>
                  </div>
                </div>

                {/* Main Product Window Preview Card */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-3.5 shadow-sm group">
                  <div className="sm:col-span-5 relative aspect-[4/3] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
                      alt="Modern rental residence interior"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-zinc-950/80 backdrop-blur-xs text-white text-[10px] font-mono">
                      Verified Owner
                    </div>
                  </div>

                  <div className="sm:col-span-7 flex flex-col justify-between py-0.5 text-left">
                    <div>
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                          ₹18,500 <span className="text-xs font-normal text-zinc-500">/mo</span>
                        </span>
                        <span className="text-xs font-mono text-zinc-500">Deposit ₹37,000</span>
                      </div>
                      <h4 className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                        Sunlit 2BHK with Balcony
                      </h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Raysan, Gandhinagar · 18 min transit to PDEU
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400">
                        <Check size={13} className="text-emerald-500 shrink-0" />
                        <span>Deed verified to owner Rajesh Sharma</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => navigateWithCurtains('/properties/prop-101', 'Property Details')}
                          className="flex-1 py-1.5 px-3 rounded-md bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium text-center transition-colors cursor-pointer"
                        >
                          View property
                        </button>
                        <a
                          href="https://wa.me/919876543210"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 px-2.5 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors inline-flex items-center gap-1"
                        >
                          <MessageCircle size={13} />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overlapping Dealt Moment: Live Metrics Floating Card */}
                <div className="mt-4 p-3 rounded-xl bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400">
                    <div>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block">Commute fit</span>
                      <span className="text-zinc-900 dark:text-zinc-100 font-semibold">99%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block">Budget margin</span>
                      <span className="text-zinc-900 dark:text-zinc-100 font-semibold">+₹1,500</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block">Brokerage</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">₹0</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Saved ₹18,500
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 2: THE FINANCIAL TRUTH (BROKER VS DIRECT) ===================== */}
      <section className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14 text-left">
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              The economic model
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
              The financial truth of direct leasing
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              Renting residential property in Gandhinagar should not cost an extra month of commission or days of opaque phone mediation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* The Old Broker Model */}
            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
                  <span className="text-xs font-mono text-red-600 dark:text-red-400 font-medium">
                    The Broker Intermediary
                  </span>
                  <span className="text-xs font-mono text-zinc-400">One-Month Commission</span>
                </div>

                <ul className="space-y-4 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  <li className="flex items-start gap-3">
                    <X className="size-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-medium">Upfront fee penalty:</strong> You pay ₹18,000 to ₹35,000+ directly to an agent simply for an address inspection.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="size-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-medium">Opaque listings:</strong> Recycled and fabricated photos create wasted inspection visits and altered lease terms.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="size-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-medium">Aggressive agent contact:</strong> Contact details are shared across third-party real estate broker networks without consent.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="size-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-medium">Scheduling bottlenecks:</strong> Every question regarding lease terms and security deposits passes through mediators.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 font-mono text-xs text-zinc-500">
                Average lost per tenancy: ₹24,000
              </div>
            </div>

            {/* The RentMatch Direct Protocol */}
            <div className="rounded-xl border border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
                  <span className="text-xs font-mono text-zinc-900 dark:text-zinc-100 font-semibold">
                    RentMatch Direct Protocol
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                    Zero Brokerage
                  </span>
                </div>

                <ul className="space-y-4 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  <li className="flex items-start gap-3">
                    <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-medium">Zero commission guarantee:</strong> 100% of upfront funds remain in your possession for moving and security deposit.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-medium">Authenticated deed ownership:</strong> Every property owner is verified against municipal property documentation before listing.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-medium">Direct WhatsApp communication:</strong> Connect 1-to-1 with genuine landlords to agree on move-in dates and terms.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-medium">Fast agreement turnaround:</strong> Direct coordination lets tenants and landlords agree and sign within 24 hours.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 font-mono text-xs text-emerald-600 dark:text-emerald-400">
                100% retained capital for tenants and landlords
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 3: THREE-STEP DIRECT PIPELINE ===================== */}
      <section id="how-it-works" className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14 text-left">
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              The workflow
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
              Three steps from requirement to move-in
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              A transparent leasing workflow built to remove friction and save capital at every stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 p-6 flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
              <div>
                <div className="font-mono text-xs text-zinc-400 mb-6">01 / REQUIREMENT</div>
                <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                  Natural Language Query
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Describe what you actually require—such as commute distance to PDEU or Infocity, furnishing level, and budget ceiling.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-2 text-xs font-mono text-zinc-500">
                <Compass size={14} />
                <span>Contextual parsing</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 p-6 flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
              <div>
                <div className="font-mono text-xs text-zinc-400 mb-6">02 / MATCHING</div>
                <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                  Precision Compatibility
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Our model scores available listings against genuine travel times, floor heights, and verified landlord records.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-2 text-xs font-mono text-zinc-500">
                <Sparkles size={14} />
                <span>Multi-factor scoring</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 p-6 flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
              <div>
                <div className="font-mono text-xs text-zinc-400 mb-6">03 / CONTACT</div>
                <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                  Direct WhatsApp Coordination
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Message the authenticated property deed holder directly. Coordinate walkthroughs and sign lease agreements without mediators.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-2 text-xs font-mono text-zinc-500">
                <MessageCircle size={14} />
                <span>Zero broker interference</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 4: MICRO-MARKET INVENTORY PREVIEW ===================== */}
      <section className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div className="max-w-xl text-left">
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                Gandhinagar &amp; Ahmedabad
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
                Active verified residential listings
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                Real properties authenticated with municipal records across key university and corporate corridors.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigateWithCurtains('/dashboard/explore', 'Find Properties')}
              className="inline-flex items-center gap-2 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer self-start md:self-end"
            >
              <span>View all active listings</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Listing 1 */}
            <div
              onClick={() => navigateWithCurtains('/properties/prop-101', 'Property Details')}
              className="group rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
                    alt="Sunlit 2BHK residence"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-zinc-950/80 text-white text-[10px] font-mono backdrop-blur-xs">
                    Deed Verified
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-emerald-500/90 text-white text-[10px] font-mono">
                    96% Match
                  </div>
                </div>

                <div className="p-5 text-left">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      ₹18,500 <span className="text-xs font-normal text-zinc-500">/mo</span>
                    </span>
                    <span className="text-xs font-mono text-zinc-500">Deposit ₹37,000</span>
                  </div>
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    Sunlit Modern 2BHK with Balcony
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Raysan, Gandhinagar · 18 min to PDEU
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>Fully furnished</span>
                <span>2 Bed · 2 Bath</span>
              </div>
            </div>

            {/* Listing 2 */}
            <div
              onClick={() => navigateWithCurtains('/properties/prop-102', 'Property Details')}
              className="group rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
                    alt="Calm 2BHK residence"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-zinc-950/80 text-white text-[10px] font-mono backdrop-blur-xs">
                    Deed Verified
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-emerald-500/90 text-white text-[10px] font-mono">
                    92% Match
                  </div>
                </div>

                <div className="p-5 text-left">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      ₹16,000 <span className="text-xs font-normal text-zinc-500">/mo</span>
                    </span>
                    <span className="text-xs font-mono text-zinc-500">Deposit ₹32,000</span>
                  </div>
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    Calm 2BHK Home with Open Skyline Views
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Kudasan, Gandhinagar · 22 min to PDEU
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>Semi-furnished</span>
                <span>2 Bed · 2 Bath</span>
              </div>
            </div>

            {/* Listing 3 */}
            <div
              onClick={() => navigateWithCurtains('/dashboard/explore', 'Find Properties')}
              className="group rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
                    alt="Infocity flat"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-zinc-950/80 text-white text-[10px] font-mono backdrop-blur-xs">
                    Deed Verified
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-emerald-500/90 text-white text-[10px] font-mono">
                    94% Match
                  </div>
                </div>

                <div className="p-5 text-left">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      ₹24,000 <span className="text-xs font-normal text-zinc-500">/mo</span>
                    </span>
                    <span className="text-xs font-mono text-zinc-500">Deposit ₹48,000</span>
                  </div>
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    Executive 3BHK Corporate Suite
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Infocity Corridor, Gandhinagar · 8 min to TCS
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>Fully furnished</span>
                <span>3 Bed · 3 Bath</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 5: ROLE PORTALS (FOR TENANTS & OWNERS) ===================== */}
      <section className="py-20 sm:py-28 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* For Tenants */}
            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 p-8 flex flex-col justify-between text-left">
              <div>
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  For Students &amp; Tenants
                </span>
                <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50 mt-1 mb-3">
                  Find your home without broker fees
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  Studying at PDEU or working around Infocity? Avoid losing upfront funds to mediators. Browse verified apartments, calculate door-to-door transit, and chat directly with genuine landlords.
                </p>

                <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 mb-8 font-mono">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Direct WhatsApp dialogue with deed owners</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Save 100% of upfront broker fees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Commute compatibility to your campus or workplace</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => navigateWithCurtains('/signup', 'Join as Tenant')}
                className="w-full py-2.5 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium text-center transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
              >
                Browse verified homes
              </button>
            </div>

            {/* For Landlords */}
            <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 p-8 flex flex-col justify-between text-left">
              <div>
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  For Property Owners
                </span>
                <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50 mt-1 mb-3">
                  List your property in two minutes
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  Own an apartment or flat in Gandhinagar? Connect directly with pre-screened university scholars and working professionals. Zero listing charges, zero commission cuts, and complete control over inquiries.
                </p>

                <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 mb-8 font-mono">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Zero listing fees and zero commission cuts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Direct WhatsApp tenant communication</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Manage walkthroughs and listings in one dashboard</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => navigateWithCurtains('/signup', 'Create Landlord Account')}
                className="w-full py-2.5 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-medium text-center transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
              >
                List your apartment free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 6: FREQUENTLY ANSWERED QUESTIONS ===================== */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              Clear facts
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
              Frequently answered inquiries
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              Everything you need to know about deed verification and direct leasing on RentMatch AI.
            </p>
          </div>

          <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80 border-y border-zinc-200/80 dark:border-zinc-800/80">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.q} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex items-center justify-between w-full text-left font-medium text-sm text-zinc-900 dark:text-zinc-100 py-1.5 focus:outline-hidden cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="ml-4 font-mono text-zinc-400 shrink-0 text-xs">
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
                        <p className="pt-2 pb-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
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
    </div>
  );
}
