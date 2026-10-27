'use client';

import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { type Property } from '@/src/constants/initialData';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  property: Property | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function DeleteConfirmModal({ isOpen, property, onClose, onConfirm, isDeleting }: DeleteConfirmModalProps) {
  if (!isOpen || !property) return null;

  return (
    <div className="property-modal-overlay" onClick={onClose}>
      <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-icon" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="delete-icon-wrapper">
          <Trash2 size={28} />
        </div>

        <div className="delete-modal-content">
          <h3>Delete Property Listing?</h3>
          <p>
            Are you sure you want to permanently delete <strong>&ldquo;{property.title}&rdquo;</strong>?
          </p>
          <div className="delete-warning-note">
            <AlertTriangle size={15} />
            <span>This will delete the row permanently from the database. This action cannot be reversed.</span>
          </div>
        </div>

        <div className="delete-modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger-confirm"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Listing'}
          </button>
        </div>
      </div>
    </div>
  );
}
