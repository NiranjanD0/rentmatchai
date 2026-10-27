'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import PropertyFormModal from '../components/PropertyFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import EnquiryModal from '../components/EnquiryModal';
import ToastNotification from '../components/ToastNotification';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';

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
    <div className="app">

      {/* Shared Navigation Bar */}
      <React.Suspense fallback={<div className="h-16 w-full" />}>
        <Navbar />
      </React.Suspense>

      {/* Page Content from App Router */}
      <main>{children}</main>

      {/* Shared Global Footer */}
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-col-brand">
            <div className="footer-brand">
              <span className="brand-mark">
                <span style={{ fontSize: '13px' }}>✦</span>
              </span>
              <b>
                rentmatch<span>ai</span>
              </b>
            </div>
            <p className="footer-tagline">
              Intelligent rental matching that connects verified tenants directly with authentic landlords and property managers.
            </p>
            <div className="footer-trust-chips">
              <span>✓ 100% Verified Listers</span>
              <span>✓ Zero Brokerage</span>
              <span>✓ Direct Tenant Chat</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <a href="/explore">All Available Homes</a>
            <a href="/explore?query=furnished">Furnished 2BHKs</a>
            <a href="/explore?query=student">Student Housing near PDEU</a>
            <a href="/explore?query=pet-friendly">Pet-Friendly Rentals</a>
          </div>

          <div className="footer-col">
            <h4>For Landlords</h4>
            <a href="/profile?tab=listings">List Your Property</a>
            <a href="/profile">Listing Dashboard</a>
            <a href="/explore">Rental Pricing Guide</a>
            <a href="/explore">Tenant Verification</a>
          </div>

          <div className="footer-col">
            <h4>Locations</h4>
            <span>Gandhinagar</span>
            <span>Infocity &amp; Kudasan</span>
            <span>Raysan &amp; PDEU Road</span>
            <span>Ahmedabad SG Highway</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; 2026 RentMatch AI. All rights reserved.</span>
          <div className="footer-links">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security &amp; Verification</span>
          </div>
        </div>
      </footer>

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
