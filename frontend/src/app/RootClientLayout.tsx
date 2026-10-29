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
  const isDashboardPage = pathname?.startsWith('/dashboard');
  if (isAuthPage || isDashboardPage) return null;
  return <Navbar />;
}

function FooterSlot() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/register';
  const isDashboardPage = pathname?.startsWith('/dashboard');
  if (isAuthPage || isDashboardPage) return null;
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-black text-zinc-600 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-md">
            <BrandLogo size="md" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              RentMatch AI connects verified tenants directly with authentic property owners across Gandhinagar and Ahmedabad with zero brokerage fees.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            <a href="/explore" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              Explore Homes
            </a>
            <a href="/login" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              Sign In
            </a>
            <a href="/signup" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
              Create Account
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <span>&copy; 2026 RentMatch AI. All rights reserved.</span>
          <div className="flex gap-6">
            <span className="hover:text-zinc-950 dark:hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-zinc-950 dark:hover:text-white cursor-pointer transition-colors">Terms</span>
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
