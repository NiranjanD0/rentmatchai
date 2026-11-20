'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Mail, CheckCircle2, Lock, FileText, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import BrandLogo from '@/src/components/layout/BrandLogo';
import { BlurFade } from '@/src/components/ui/blur-fade';
import { usePageCurtains } from '@/src/components/ui/page-curtains';

export default function PrivacyPolicyPage() {
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
              onClick={() => navigateWithCurtains('/terms', 'Terms of Service')}
              className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
            >
              Terms of Service
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
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Effective Date: November 20, 2026 · Last Updated: November 20, 2026
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-4 leading-relaxed max-w-2xl">
              Welcome to <strong>RentMatchAI</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting the privacy, security, and personal data of our users across our platform at{' '}
              <a href="https://rentmatchai.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[#E8510E] dark:text-[#F06A32] underline font-medium">
                rentmatchai.vercel.app
              </a>.
            </p>
          </div>
        </BlurFade>

        {/* Content Sections */}
        <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {/* Section 1 */}
          <section className="p-6 sm:p-8 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/90 dark:bg-[#1E1B18]/90 backdrop-blur-sm shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="size-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-mono font-bold flex items-center justify-center">1</span>
              <span>Information We Collect</span>
            </h2>

            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">A. Information Provided by Users</h3>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-zinc-400">
                <li><strong>Account Credentials:</strong> Name, email address, phone number, and password created during registration as a Tenant or Property Lister.</li>
                <li><strong>Tenant Search Preferences:</strong> Budget constraints (maximum/minimum rent), preferred localities (e.g., Kudasan, Infocity, Sargasan, Raysan, Vavol), desired BHK type, furnishing preference, and commute parameters.</li>
                <li><strong>Landlord &amp; Property Data:</strong> Property address, monthly rent, security deposit terms, room specifications, carpet area, photographs, and ownership verification documents (e.g., electricity bills, tax receipts, or property deed proofs).</li>
                <li><strong>Direct Inquiries:</strong> Contact information shared when scheduling property visits or initiating conversations with landlords via WhatsApp.</li>
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">B. Automatically Collected Information</h3>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-zinc-400">
                <li><strong>Technical Data:</strong> Browser type, device identifiers, IP address, and pages visited within the application.</li>
                <li><strong>Local Storage:</strong> Client-side persistence for user interface state, such as dark/light theme mode and shortlisted favorite properties (<code>rentmatch-saved</code>).</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="p-6 sm:p-8 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/90 dark:bg-[#1E1B18]/90 backdrop-blur-sm shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="size-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-mono font-bold flex items-center justify-center">2</span>
              <span>How We Use Your Information</span>
            </h2>
            <p>We process your data strictly to deliver and improve our rental matching services:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <strong className="block text-zinc-950 dark:text-white font-semibold mb-1">AI Compatibility Matching</strong>
                <span className="text-zinc-600 dark:text-zinc-400">Analyzing tenant constraints against property attributes to calculate personalized compatibility fit scores.</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <strong className="block text-zinc-950 dark:text-white font-semibold mb-1">Deed &amp; Ownership Verification</strong>
                <span className="text-zinc-600 dark:text-zinc-400">Authenticating property ownership documents to ensure genuine, broker-free direct listings.</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <strong className="block text-zinc-950 dark:text-white font-semibold mb-1">Communication Routing</strong>
                <span className="text-zinc-600 dark:text-zinc-400">Enabling verified tenants to connect directly with property owners via WhatsApp without broker commission fees.</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                <strong className="block text-zinc-950 dark:text-white font-semibold mb-1">Platform Security &amp; Safety</strong>
                <span className="text-zinc-600 dark:text-zinc-400">Preventing fraudulent listings, duplicate spam, automated web scraping, and service disruptions.</span>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="p-6 sm:p-8 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/90 dark:bg-[#1E1B18]/90 backdrop-blur-sm shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight flex items-center gap-2">
              <span className="size-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-mono font-bold flex items-center justify-center">3</span>
              <span>Information Sharing &amp; Disclosure</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-400">
              <li><strong>Zero Data Selling:</strong> We never sell, rent, or trade personal information to third-party telemarketers, brokers, or data aggregators.</li>
              <li><strong>Direct Landlord-Tenant Disclosure:</strong> Contact phone numbers are disclosed solely when an authenticated tenant explicitly clicks &quot;Contact / Enquire&quot; to initiate visit dialogue.</li>
              <li><strong>Trusted Infrastructure:</strong> We utilize secure hosting and authentication partners (Vercel, Google OAuth) under strict confidentiality agreements solely to deliver the service.</li>
              <li><strong>Legal Compliance:</strong> We disclose records only when strictly mandated by applicable Indian statutes, court subpoenas, or authorized law enforcement requests.</li>
            </ul>
          </section>

          {/* Section 4 & 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="p-6 sm:p-8 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/90 dark:bg-[#1E1B18]/90 backdrop-blur-sm shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-base">
                <Lock size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>4. Data Security &amp; Storage</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                We implement robust physical, administrative, and technical controls. All platform network transmission is protected via modern TLS/HTTPS encryption with strict database access controls.
              </p>
            </section>

            <section className="p-6 sm:p-8 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/90 dark:bg-[#1E1B18]/90 backdrop-blur-sm shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-base">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>5. User Rights &amp; Control</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                You maintain full ownership of your data. You may review and edit preferences anytime under <Link href="/dashboard/profile" className="underline font-medium text-zinc-900 dark:text-white">/dashboard/profile</Link>, or request account and listing purge via support email.
              </p>
            </section>
          </div>

          {/* Section 6 & 7 */}
          <section className="p-6 sm:p-8 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/90 dark:bg-[#1E1B18]/90 backdrop-blur-sm shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              6. Age Restrictions &amp; 7. Policy Modifications
            </h2>
            <p>
              RentMatchAI is intended exclusively for individuals aged 18 and older. We do not knowingly collect information from minors. We reserve the right to revise this Privacy Policy as our services evolve, maintaining the revised effective date at the top of this document.
            </p>
          </section>

          {/* Section 8: Contact & Grievance */}
          <section className="p-6 sm:p-8 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-100/70 dark:bg-zinc-900/60 backdrop-blur-sm shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight flex items-center gap-2">
              <Mail size={18} className="text-[#E8510E] dark:text-[#F06A32]" />
              <span>8. Contact Us &amp; Grievance Redressal</span>
            </h2>
            <p>
              For privacy inquiries, rights requests, or feedback, please contact our support team:
            </p>
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80">
              <p className="font-semibold text-zinc-950 dark:text-white">Grievance &amp; Data Privacy Officer</p>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-1">
                In compliance with the Information Technology Act, 2000 and Digital Personal Data Protection guidelines:
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  href="mailto:support@rentmatchai.niranjan.lol"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  <Mail size={13} />
                  <span>support@rentmatchai.niranjan.lol</span>
                </a>
                <span className="text-xs text-zinc-500">
                  Response timeline: Acknowledgment within 48h, resolution within 15 working days.
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 RentMatchAI. Direct &amp; Zero-Brokerage Rentals.</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigateWithCurtains('/terms', 'Terms of Service')}
              className="hover:text-zinc-950 dark:hover:text-white underline cursor-pointer"
            >
              Terms of Service
            </button>
            <span className="font-semibold text-zinc-950 dark:text-white">
              Privacy Policy
            </span>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
