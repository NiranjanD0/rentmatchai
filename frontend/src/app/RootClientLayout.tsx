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
      {/* Top Prototype Status Strip */}
      <div className="prototype-strip">
        <i /> SPRINT 1 & 2 ACTIVE
        <span>·</span> Role Auth (Tenant/Lister) + Property CRUD & Status Lifecycle
      </div>

      {/* Shared Navigation Bar */}
      <React.Suspense fallback={<header className="topbar" />}>
        <Navbar />
      </React.Suspense>

      {/* Page Content from App Router */}
      <main>{children}</main>

      {/* Shared Global Footer */}
      <footer>
        <div className="footer-brand">
          <span className="brand-mark">
            <span style={{ fontSize: '13px' }}>✦</span>
          </span>
          <b>
            rentmatch<span>ai</span>
          </b>
        </div>
        <span>Personalized AI Rental Matching · Sprint 1 & 2 Prototype</span>
        <small>Role Auth + Property Management Active</small>
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
