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
    <footer className="border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-black text-zinc-600 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="mb-4">
              <BrandLogo size="lg" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed mb-5">
              Intelligent rental matching that connects verified tenants directly with authentic landlords and property managers across Gandhinagar and Ahmedabad.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <Check className="h-3 w-3 text-zinc-700 dark:text-zinc-300" /> 100% Verified Listers
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <Check className="h-3 w-3 text-zinc-700 dark:text-zinc-300" /> Zero Brokerage
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <Check className="h-3 w-3 text-zinc-700 dark:text-zinc-300" /> Direct Landlord Chat
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/explore" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  All Available Homes
                </a>
              </li>
              <li>
                <a href="/explore?query=furnished" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Furnished 2BHKs
                </a>
              </li>
              <li>
                <a href="/explore?query=student" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Student Housing near PDEU
                </a>
              </li>
              <li>
                <a href="/explore?query=pet-friendly" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Pet-Friendly Rentals
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
              For Landlords
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/profile?tab=listings" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  List Your Property
                </a>
              </li>
              <li>
                <a href="/profile" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Listing Dashboard
                </a>
              </li>
              <li>
                <a href="/explore" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Rental Pricing Guide
                </a>
              </li>
              <li>
                <a href="/explore" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Tenant Verification
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
              Locations
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-500 dark:text-zinc-400">
              <li>Gandhinagar Core</li>
              <li>Infocity &amp; Kudasan</li>
              <li>Raysan &amp; PDEU Road</li>
              <li>Ahmedabad SG Highway</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <span>&copy; 2026 RentMatch AI. All rights reserved.</span>
          <div className="flex gap-6">
            <span className="hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer transition-colors">Security &amp; Trust</span>
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
