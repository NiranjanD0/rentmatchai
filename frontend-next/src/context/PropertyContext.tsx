'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PropertyService } from '../services/propertyService';
import { PROPERTY_STATUS, USER_ROLES, type Property } from '../constants/initialData';
import { useAuth } from './AuthContext';

export interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  title?: string;
}

interface PropertyContextValue {
  properties: Property[];
  activeProperties: Property[];
  saved: string[];
  refreshProperties: () => void;
  toggleSave: (propertyId: string) => void;
  isSaved: (propertyId: string) => boolean;
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info', title?: string) => void;
  clearToast: () => void;

  // Property Form Modal (Create / Edit)
  isPropertyModalOpen: boolean;
  editingProperty: Property | null;
  openAddProperty: () => void;
  openEditProperty: (property: Property) => void;
  closePropertyModal: () => void;
  handlePropertyFormSuccess: (property: Property, message: string) => void;

  // Delete Confirm Modal
  isDeleteModalOpen: boolean;
  deletingProperty: Property | null;
  isDeleting: boolean;
  openDeleteProperty: (property: Property) => void;
  closeDeleteModal: () => void;
  confirmDelete: () => Promise<void>;

  // Enquiry Modal
  isEnquiryModalOpen: boolean;
  enquiryProperty: Property | null;
  openEnquiry: (property: Property) => void;
  closeEnquiryModal: () => void;

  // Property Status Lifecycle Toggle
  togglePropertyStatus: (propertyId: string) => Promise<void>;
}

const PropertyContext = createContext<PropertyContextValue | null>(null);

const getInitialSaved = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('rentmatch-saved') || '[]');
  } catch {
    return [];
  }
};

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLister, openAuthModal } = useAuth();

  const [properties, setProperties] = useState<Property[]>([]);
  const [saved, setSaved] = useState<string[]>([]);

  // Modals state
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryProperty, setEnquiryProperty] = useState<Property | null>(null);

  // Toast State
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success', title: string = '') => {
    setToast({ message, type, title });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Load properties on mount
  const refreshProperties = useCallback(() => {
    const all = PropertyService.getAllProperties();
    setProperties(all);
  }, []);

  useEffect(() => {
    refreshProperties();
    setSaved(getInitialSaved());
  }, [refreshProperties]);

  // Sync shortlist with localStorage
  const toggleSave = useCallback((propertyId: string) => {
    setSaved((prev) => {
      const exists = prev.includes(propertyId);
      const next = exists ? prev.filter((id) => id !== propertyId) : [...prev, propertyId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('rentmatch-saved', JSON.stringify(next));
      }
      showToast(
        exists ? 'Property removed from your shortlist' : 'Property saved to your shortlist!',
        exists ? 'info' : 'success'
      );
      return next;
    });
  }, [showToast]);

  const isSaved = useCallback((propertyId: string) => {
    return saved.includes(propertyId);
  }, [saved]);

  // Add Property Handler
  const openAddProperty = useCallback(() => {
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
  const openEditProperty = useCallback((property: Property) => {
    if (!user || String(user.id) !== String(property.listerId)) {
      showToast('403 Forbidden: You do not have permission to edit this listing.', 'error');
      return;
    }
    setEditingProperty(property);
    setIsPropertyModalOpen(true);
  }, [user, showToast]);

  const closePropertyModal = useCallback(() => {
    setIsPropertyModalOpen(false);
    setEditingProperty(null);
  }, []);

  const handlePropertyFormSuccess = useCallback((property: Property, message: string) => {
    refreshProperties();
    setIsPropertyModalOpen(false);
    showToast(message || 'Property saved successfully!', 'success');
  }, [refreshProperties, showToast]);

  // Delete Property Handler
  const openDeleteProperty = useCallback((property: Property) => {
    if (!user || String(user.id) !== String(property.listerId)) {
      showToast('403 Forbidden: Only the property owner can delete this listing.', 'error');
      return;
    }
    setDeletingProperty(property);
    setIsDeleteModalOpen(true);
  }, [user, showToast]);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeletingProperty(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deletingProperty || !user) return;
    setIsDeleting(true);
    try {
      await PropertyService.deleteProperty(user.id, deletingProperty.id);
      refreshProperties();
      setIsDeleteModalOpen(false);
      setDeletingProperty(null);
      showToast('Listing permanently deleted.', 'success');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to delete listing.';
      showToast(errMsg, 'error');
    } finally {
      setIsDeleting(false);
    }
  }, [deletingProperty, user, refreshProperties, showToast]);

  // Status toggle handler
  const togglePropertyStatus = useCallback(async (propertyId: string) => {
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

  // Enquiry Modal
  const openEnquiry = useCallback((property: Property) => {
    setEnquiryProperty(property);
    setIsEnquiryModalOpen(true);
  }, []);

  const closeEnquiryModal = useCallback(() => {
    setIsEnquiryModalOpen(false);
    setEnquiryProperty(null);
  }, []);

  const activeProperties = properties.filter((p) => p.status === PROPERTY_STATUS.ACTIVE);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        activeProperties,
        saved,
        refreshProperties,
        toggleSave,
        isSaved,
        toast,
        showToast,
        clearToast,
        isPropertyModalOpen,
        editingProperty,
        openAddProperty,
        openEditProperty,
        closePropertyModal,
        handlePropertyFormSuccess,
        isDeleteModalOpen,
        deletingProperty,
        isDeleting,
        openDeleteProperty,
        closeDeleteModal,
        confirmDelete,
        isEnquiryModalOpen,
        enquiryProperty,
        openEnquiry,
        closeEnquiryModal,
        togglePropertyStatus
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
}
