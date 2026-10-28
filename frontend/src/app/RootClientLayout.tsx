'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Home, Check } from 'lucide-react';
import { Navbar, BrandLogo } from '../components/layout';
import { AuthModal } from '../components/auth';
import { PropertyFormModal, DeleteConfirmModal, EnquiryModal } from '../components/property';
import { ToastNotification } from '../components/feedback';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';

function HeaderSlot() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/register';
  if (isAuthPage) return null;
  return <Navbar />;
}

function FooterSlot() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/register';
  if (isAuthPage) return null;
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-black text-zinc-600 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          {/* Brand Manifesto Column */}
          <div className="md:col-span-5 space-y-4">
            <BrandLogo size="lg" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              RentMatch AI is the editorial standard for residential leasing in Gandhinagar and Ahmedabad. Connecting discerning residents directly with authenticated property owners — eliminating mediator commissions, phantom listings, and rental friction through precision matching.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <Check className="h-3 w-3 text-zinc-950 dark:text-white" /> 100% Direct Owners
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <Check className="h-3 w-3 text-zinc-950 dark:text-white" /> ₹0 Brokerage Fees
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <Check className="h-3 w-3 text-zinc-950 dark:text-white" /> Instant WhatsApp
              </span>
            </div>
          </div>

          {/* Curated Collections */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-950 dark:text-zinc-100 mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="/explore" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  All Residences
                </a>
              </li>
              <li>
                <a href="/explore?query=furnished" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Furnished 2BHKs
                </a>
              </li>
              <li>
                <a href="/explore?query=student" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Student Enclave (PDEU)
                </a>
              </li>
              <li>
                <a href="/explore?query=balcony" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Skyline &amp; Balcony Homes
                </a>
              </li>
            </ul>
          </div>

          {/* Neighborhood Dossier */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-950 dark:text-zinc-100 mb-4">
              Localities
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="/explore?location=Raysan" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Raysan &amp; PDEU Road
                </a>
              </li>
              <li>
                <a href="/explore?location=Infocity" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Infocity Tech Corridor
                </a>
              </li>
              <li>
                <a href="/explore?location=Kudasan" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Kudasan Residential
                </a>
              </li>
              <li>
                <a href="/explore?location=Sargasan" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Sargasan / SG Highway
                </a>
              </li>
            </ul>
          </div>

          {/* Landlords & Access */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-950 dark:text-zinc-100 mb-4">
              Landlords
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="/profile?tab=listings" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  List a Residence
                </a>
              </li>
              <li>
                <a href="/profile" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Owner Dashboard
                </a>
              </li>
              <li>
                <a href="/explore" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Pricing Index
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Sign In
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span>&copy; 2026 RentMatch AI · Editorial Rental Platform</span>
            <span className="hidden sm:inline-block">·</span>
            <span className="hidden sm:inline-block font-mono text-[10px]">Gandhinagar 23.2156° N, 72.6369° E</span>
          </div>
          <div className="flex gap-6 font-medium">
            <span className="hover:text-zinc-950 dark:hover:text-white cursor-pointer transition-colors">Privacy Protocol</span>
            <span className="hover:text-zinc-950 dark:hover:text-white cursor-pointer transition-colors">Terms of Lease</span>
            <span className="hover:text-zinc-950 dark:hover:text-white cursor-pointer transition-colors">Zero Brokerage Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootClientLayout({ children }: { children: React.ReactNode }) {

  const {
    toast,
    clearToast,
    isPropertyModalOpen,
    editingProperty,
    closePropertyModal,
    handlePropertyFormSuccess,
    isDeleteModalOpen,
    deletingProperty,
    closeDeleteModal,
    confirmDelete,
    isDeleting,
    isEnquiryModalOpen,
    enquiryProperty,
    closeEnquiryModal,
    refreshProperties,
    showToast
  } = useProperty();

  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    authModalRole
  } = useAuth();

  return (
    <div className="app min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors">

      {/* Shared Navigation Bar (hidden completely on auth pages) */}
      <React.Suspense fallback={<div className="h-20 sm:h-24 w-full" />}>
        <HeaderSlot />
      </React.Suspense>

      {/* Page Content from App Router */}
      <main>{children}</main>

      {/* Shared Global Footer (hidden completely on auth pages) */}
      <React.Suspense fallback={null}>
        <FooterSlot />
      </React.Suspense>

      {/* Auth Modal (Sprint 1) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialTab={authModalTab}
        initialRole={authModalRole}
        onAuthSuccess={(msg) => {
          showToast(msg, 'success');
          refreshProperties();
        }}
      />

      {/* Property Form Modal (Sprint 2 Create / Edit) */}
      <PropertyFormModal
        isOpen={isPropertyModalOpen}
        onClose={closePropertyModal}
        initialProperty={editingProperty}
        onSuccess={handlePropertyFormSuccess}
      />

      {/* Delete Confirmation Modal (Sprint 2 Delete) */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        property={deletingProperty}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />

      {/* Enquiry Modal */}
      {isEnquiryModalOpen && enquiryProperty && (
        <EnquiryModal
          property={enquiryProperty}
          onClose={closeEnquiryModal}
        />
      )}

      {/* Floating Toast Notification */}
      <ToastNotification toast={toast} onClose={clearToast} />
    </div>
  );
}
