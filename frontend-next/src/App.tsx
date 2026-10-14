'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PropertyService } from './services/propertyService';
import { PROPERTY_STATUS, USER_ROLES, type Property, type UserRole } from './constants/initialData';

// Components
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import PropertyFormModal from './components/PropertyFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import EnquiryModal from './components/EnquiryModal';
import ToastNotification from './components/ToastNotification';

// Views / Page Components
import HomePage from './views/HomePage';
import ExplorePage from './views/ExplorePage';
import PropertyDetailsPage from './views/PropertyDetailsPage';
import ProfilePage from './views/ProfilePage';
import ShortlistPage from './views/ShortlistPage';

const getInitialSaved = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('rentmatch-saved') || '[]');
  } catch {
    return [];
  }
};

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  title?: string;
}

function MainApp() {
  const { user, isAuthenticated, isLister, isAuthModalOpen, openAuthModal, closeAuthModal, authModalTab, authModalRole } = useAuth();

  // Navigation & Page routing
  const [page, setPage] = useState('home'); // 'home' | 'results' | 'details' | 'shortlist' | 'profile'
  const [profileTab, setProfileTab] = useState('personal'); // 'personal' | 'listings' | 'security'
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Data State
  const [properties, setProperties] = useState<Property[]>([]);
  const [saved, setSaved] = useState<string[]>([]);

  // Initialize saved from localStorage on mount
  useEffect(() => {
    setSaved(getInitialSaved());
  }, []);

  // Search criteria passed between Home & Explore
  const [searchParams, setSearchParams] = useState({
    query: '',
    location: 'Gandhinagar',
    budget: '25000'
  });

  // Modal State
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  // Toast State
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success', title: string = '') => {
    setToast({ message, type, title });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Load properties from PropertyService
  const refreshProperties = useCallback(() => {
    const all = PropertyService.getAllProperties();
    setProperties(all);
  }, []);

  useEffect(() => {
    refreshProperties();
  }, [refreshProperties]);

  // Sync shortlist with localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rentmatch-saved', JSON.stringify(saved));
    }
  }, [saved]);

  // Navigation Helper
  const navigate = useCallback((targetPage: string, extraTab: string | null = null) => {
    setPage(targetPage);
    if (extraTab) {
      setProfileTab(extraTab);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Shortlist Toggle
  const handleToggleSave = useCallback((propertyId: string) => {
    setSaved((prev) => {
      const exists = prev.includes(propertyId);
      if (exists) {
        showToast('Property removed from your shortlist', 'info');
        return prev.filter((id) => id !== propertyId);
      } else {
        showToast('Property saved to your shortlist!', 'success');
        return [...prev, propertyId];
      }
    });
  }, [showToast]);

  // Open Property Details
  const handleOpenDetails = useCallback((propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setPage('details');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Search handler from HomePage
  const handleSearch = useCallback(({ query, location, budget }: { query: string; location: string; budget: string }) => {
    setSearchParams({ query, location, budget });
    setPage('results');
    showToast('Search criteria updated from query', 'info');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showToast]);

  // Add Property Handler (Sprint 2 & Role Enforcement)
  const handleOpenAddProperty = useCallback(() => {
    if (!isAuthenticated) {
      showToast('Please sign in or register as a Property Lister to add a property.', 'info');
      openAuthModal('register', USER_ROLES.PROPERTY_LISTER);
      return;
    }

    if (!isLister) {
      showToast('Role Restricted (403): Only users with the Property Lister role can publish listings.', 'error');
      return;
    }

    setEditingProperty(null);
    setIsPropertyModalOpen(true);
  }, [isAuthenticated, isLister, openAuthModal, showToast]);

  // Edit Property Handler
  const handleEditProperty = useCallback((property: Property) => {
    if (!user || String(user.id) !== String(property.listerId)) {
      showToast('403 Forbidden: You do not have permission to edit this listing.', 'error');
      return;
    }
    setEditingProperty(property);
    setIsPropertyModalOpen(true);
  }, [user, showToast]);

  // Toggle Property Status (Active <-> Inactive)
  const handleToggleStatus = useCallback(async (propertyId: string) => {
    if (!user) {
      showToast('Please sign in to manage properties', 'error');
      return;
    }

    try {
      const updated = await PropertyService.togglePropertyStatus(user.id, propertyId);
      refreshProperties();
      showToast(
        `Listing is now ${updated.status === PROPERTY_STATUS.ACTIVE ? 'Active (Live)' : 'Inactive (Hidden)'}!`,
        'success'
      );
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to update property status.';
      showToast(errMsg, 'error');
    }
  }, [user, refreshProperties, showToast]);

  // Delete Property Handler
  const handleDeleteProperty = useCallback((property: Property) => {
    if (!user || String(user.id) !== String(property.listerId)) {
      showToast('403 Forbidden: Only the property owner can delete this listing.', 'error');
      return;
    }
    setDeletingProperty(property);
    setIsDeleteModalOpen(true);
  }, [user, showToast]);

  // Confirm Delete Action
  const handleConfirmDelete = async () => {
    if (!deletingProperty || !user) return;
    setIsDeleting(true);
    try {
      await PropertyService.deleteProperty(user.id, deletingProperty.id);
      refreshProperties();
      setIsDeleteModalOpen(false);
      setDeletingProperty(null);
      showToast('Listing permanently deleted.', 'success');
      if (page === 'details' && selectedPropertyId === deletingProperty.id) {
        setPage('results');
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to delete listing.';
      showToast(errMsg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Property Form Success Handler
  const handlePropertyFormSuccess = (propertyObj: Property, message: string) => {
    refreshProperties();
    showToast(message || 'Property saved successfully!', 'success');
  };

  // Filter active properties for public view
  const activeProperties = properties.filter((p) => p.status === PROPERTY_STATUS.ACTIVE);
  const selectedProperty = properties.find((p) => String(p.id) === String(selectedPropertyId));

  return (
    <div className="app">
      {/* Top Prototype Status Strip */}
      <div className="prototype-strip">
        <i /> SPRINT 1 & 2 ACTIVE
        <span>·</span> Role Auth (Tenant/Lister) + Property CRUD & Status Lifecycle
      </div>

      {/* Navigation Bar */}
      <Navbar
        page={page}
        onNavigate={navigate}
        savedCount={saved.length}
        onOpenAddProperty={handleOpenAddProperty}
        onOpenAuth={(tab, role) => openAuthModal(tab, role as UserRole)}
      />

      {/* Main Pages Routing */}
      <main>
        {page === 'home' && (
          <HomePage
            properties={activeProperties}
            savedIds={saved}
            onToggleSave={handleToggleSave}
            onOpenDetails={handleOpenDetails}
            onNavigate={navigate}
            onSearch={handleSearch}
            onOpenAddProperty={handleOpenAddProperty}
            onOpenAuth={(tab, role) => openAuthModal(tab, role as UserRole)}
          />
        )}

        {page === 'results' && (
          <ExplorePage
            properties={activeProperties}
            savedIds={saved}
            onToggleSave={handleToggleSave}
            onOpenDetails={handleOpenDetails}
            onNavigate={navigate}
            initialQuery={searchParams.query}
            initialLocation={searchParams.location}
            initialBudget={searchParams.budget}
          />
        )}

        {page === 'details' && selectedProperty && (
          <PropertyDetailsPage
            property={selectedProperty}
            isSaved={saved.includes(selectedProperty.id)}
            onToggleSave={handleToggleSave}
            onBack={() => navigate('results')}
            onEdit={handleEditProperty}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteProperty}
            onOpenEnquiry={() => setIsEnquiryModalOpen(true)}
          />
        )}

        {page === 'profile' && (
          <ProfilePage
            initialTab={profileTab}
            savedIds={saved}
            onToggleSave={handleToggleSave}
            onOpenDetails={handleOpenDetails}
            onOpenAddProperty={handleOpenAddProperty}
            onEditProperty={handleEditProperty}
            onDeleteProperty={handleDeleteProperty}
            onToggleStatus={handleToggleStatus}
            notify={(msg, type) => showToast(msg, (type as 'success' | 'error' | 'info') || 'info')}
          />
        )}

        {page === 'shortlist' && (
          <ShortlistPage
            properties={properties}
            savedIds={saved}
            onToggleSave={handleToggleSave}
            onOpenDetails={handleOpenDetails}
            onNavigate={navigate}
          />
        )}
      </main>

      {/* Footer */}
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
        onClose={() => setIsPropertyModalOpen(false)}
        initialProperty={editingProperty}
        onSuccess={handlePropertyFormSuccess}
      />

      {/* Delete Confirmation Modal (Sprint 2 Delete) */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        property={deletingProperty}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Enquiry Modal */}
      {isEnquiryModalOpen && selectedProperty && (
        <EnquiryModal
          property={selectedProperty}
          onClose={() => setIsEnquiryModalOpen(false)}
        />
      )}

      {/* Floating Toast Notification */}
      <ToastNotification toast={toast} onClose={clearToast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
