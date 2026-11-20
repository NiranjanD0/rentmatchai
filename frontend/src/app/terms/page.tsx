'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle2, AlertTriangle, Scale, ShieldAlert, Mail, Building2 } from 'lucide-react';
import { motion } from 'motion/react';
import BrandLogo from '@/src/components/layout/BrandLogo';
import { BlurFade } from '@/src/components/ui/blur-fade';
import { usePageCurtains } from '@/src/components/ui/page-curtains';

export default function TermsOfServicePage() {
  const { navigateWithCurtains } = usePageCurtains();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-[#F9F5EF] dark:bg-[#171513] text-zinc-950 dark:text-zinc-50 transition-colors"
    >
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-[#F9F5EF]/85 dark:bg-[#171513]/85 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigateWithCurtains('/', 'Lander')}
            className="hover:opacity-90 transition-opacity flex items-center cursor-pointer"
          >
            <BrandLogo size="md" />
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigateWithCurtains('/privacy', 'Privacy Policy')}
              className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => navigateWithCurtains('/', 'Lander')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-850 dark:hover:bg-zinc-150 transition-all shadow-2xs cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <BlurFade delay={0.1} inView>
          {/* Header */}
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Effective Date: November 20, 2026 · Last Updated: November 20, 2026
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-4 leading-relaxed max-w-2xl">
              Welcome to <strong>RentMatchAI</strong>. By accessing or using our platform at{' '}
              <a href="https://rentmatchai.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[#E8510E] dark:text-[#F06A32] underline font-medium">
                rentmatchai.vercel.app
              </a>{' '}
              or associated services, you agree to comply with and be bound by these Terms of Service (&quot;Terms&quot;).
            </p>
          </div>
        </BlurFade>

        {/* Content Sections */}
        <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {/* Section 1: Description */}
          <section className="p-6 sm:p-8 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/90 dark:bg-[#1E1B18]/90 backdrop-blur-sm shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="size-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-mono font-bold flex items-center justify-center">1</span>
              <span>Description of the Platform</span>
            </h2>
            <p>
              RentMatchAI is an intelligent rental recommendation platform designed to connect prospective tenants directly with verified residential property owners.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <strong className="block text-zinc-950 dark:text-white font-semibold mb-1">Zero Brokerage Model</strong>
                <span className="text-zinc-600 dark:text-zinc-400">RentMatchAI is not a real estate agency or broker. We do not charge commission, brokerage fees, or finder fees on transactions.</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <strong className="block text-zinc-950 dark:text-white font-semibold mb-1">Software Platform Role</strong>
                <span className="text-zinc-600 dark:text-zinc-400">We provide technology tools for listing presentation, AI-assisted matching, and direct communication routing via WhatsApp.</span>
              </div>
            </div>
          </section>

          {/* Section 2: Accounts & Eligibility */}
          <section className="p-6 sm:p-8 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/90 dark:bg-[#1E1B18]/90 backdrop-blur-sm shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="size-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-mono font-bold flex items-center justify-center">2</span>
              <span>User Accounts &amp; Eligibility</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-400">
              <li><strong>Eligibility:</strong> You must be at least 18 years of age and legally competent to enter into binding residential rental contracts under Indian law.</li>
              <li><strong>Account Security:</strong> You are responsible for safeguarding your login credentials and for all activities conducted under your registered account.</li>
              <li><strong>Role Selection:</strong> Users must register in their genuine capacity:
                <ul className="list-circle pl-5 pt-1 space-y-1">
                  <li><strong>Tenant:</strong> Looking for genuine residential accommodation.</li>
                  <li><strong>Property Lister / Owner:</strong> Legally authorized to lease out the listed residential property.</li>
                </ul>
              </li>
            </ul>
          </section>

          {/* Section 3: Listings & Verification */}
          <section className="p-6 sm:p-8 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/90 dark:bg-[#1E1B18]/90 backdrop-blur-sm shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="size-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-mono font-bold flex items-center justify-center">3</span>
              <span>Property Listings &amp; Ownership Verification</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-400">
              <li><strong>Owner Representations:</strong> Landlords represent and warrant that they possess legal ownership, subletting rights, or explicit authority to lease the property.</li>
              <li><strong>Deed &amp; Document Checks:</strong> RentMatchAI conducts verification checks on submitted listings (e.g., electricity bills, tax receipts, or deed proofs) to promote genuine inventory. However, verification does not constitute a legal title warranty.</li>
              <li><strong>Accuracy:</strong> All listing details (monthly rent, security deposit, furnishings, specifications, and images) must be accurate, current, and truthful.</li>
              <li><strong>Strict Prohibition on Broker Listings:</strong> Duplicate listings, unauthorized broker listings, discriminatory tenant criteria, or misleading pricing will result in immediate listing removal and account termination.</li>
            </ul>
          </section>

          {/* Section 4 & 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="p-6 sm:p-8 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/90 dark:bg-[#1E1B18]/90 backdrop-blur-sm shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-base">
                <CheckCircle2 size={16} className="text-[#E8510E] dark:text-[#F06A32]" />
                <span>4. Tenant Conduct &amp; Negotiations</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Tenancy agreements, lease durations, rent payments, security deposits, and move-in terms are negotiated directly between owner and tenant. Tenants must physically inspect properties and verify landlord identity before transferring any deposit.
              </p>
            </section>

            <section className="p-6 sm:p-8 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/90 dark:bg-[#1E1B18]/90 backdrop-blur-sm shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-base">
                <Scale size={16} className="text-[#E8510E] dark:text-[#F06A32]" />
                <span>5. AI Compatibility Scores</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Compatibility scores (e.g., &quot;94% Match&quot;) and AI explanations are automated algorithmic estimates calculated from preferences and property specs. They serve as guidance and do not guarantee personal satisfaction or neighborhood conditions.
              </p>
            </section>
          </div>

          {/* Section 6: Liability & Disclaimers */}
          <section className="p-6 sm:p-8 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/90 dark:bg-[#1E1B18]/90 backdrop-blur-sm shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400" />
              <span>6. Disclaimers &amp; Limitation of Liability</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-400">
              <li><strong>&quot;As-Is&quot; Service:</strong> The platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis without express or implied warranties.</li>
              <li><strong>No Liability for Rental Disputes:</strong> RentMatchAI is not a party to any lease agreement and bears no liability for rent defaults, security deposit disputes, property damage, or residential society guideline infractions.</li>
              <li><strong>Maximum Liability:</strong> To the fullest extent permitted by Indian law, RentMatchAI&apos;s total liability shall not exceed the amount paid by you (if any) to access the platform.</li>
            </ul>
          </section>

          {/* Section 7 & 8 */}
          <section className="p-6 sm:p-8 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/90 dark:bg-[#1E1B18]/90 backdrop-blur-sm shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              7. Termination &amp; 8. Governing Law
            </h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms, post unverified properties, or engage in abusive conduct. These Terms are governed by the laws of <strong>India</strong>, and any disputes shall be subject to the exclusive jurisdiction of the competent courts in <strong>Gujarat, India</strong>.
            </p>
          </section>

          {/* Section 9: Dispute Escalation & Reporting */}
          <section className="p-6 sm:p-8 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-100/70 dark:bg-zinc-900/60 backdrop-blur-sm shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight flex items-center gap-2">
              <ShieldAlert size={18} className="text-[#E8510E] dark:text-[#F06A32]" />
              <span>9. Support &amp; Reporting Suspicious Listings</span>
            </h2>
            <p>
              If you encounter a listing involving fraudulent claims, brokerage fee demands, or unverified documents:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 marker:text-zinc-500 font-medium">
              <li>Note the Listing ID and property location.</li>
              <li>Email our verification team with screenshots and relevant chat logs.</li>
              <li>Offending listings will be reviewed and removed within 24 hours.</li>
            </ol>
            <div className="pt-2">
              <a
                href="mailto:support@rentmatchai.niranjan.lol"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold hover:opacity-90 transition-opacity"
              >
                <Mail size={13} />
                <span>Report to: support@rentmatchai.niranjan.lol</span>
              </a>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 RentMatchAI. Direct &amp; Zero-Brokerage Rentals.</p>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-zinc-950 dark:text-white">
              Terms of Service
            </span>
            <button
              type="button"
              onClick={() => navigateWithCurtains('/privacy', 'Privacy Policy')}
              className="hover:text-zinc-950 dark:hover:text-white underline cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
