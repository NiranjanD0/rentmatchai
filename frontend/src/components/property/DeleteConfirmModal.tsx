'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { type Property } from '@/src/constants/initialData';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  property: Property | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  property,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteConfirmModalProps) {
  if (!isOpen || !property) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#211E1B] p-6 sm:p-7 shadow-2xl shadow-zinc-950/20 dark:shadow-black/70 my-auto text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-5 right-5 h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-950 dark:hover:text-white flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4 shadow-2xs">
          <Trash2 size={22} />
        </div>

        <h3 className="text-xl font-black text-zinc-950 dark:text-white tracking-tight mb-2">
          Delete Property Listing?
        </h3>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-5 leading-relaxed">
          Are you sure you want to permanently delete <strong>&ldquo;{property.title}&rdquo;</strong>?
        </p>

        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 flex items-start gap-2.5 text-left text-xs text-amber-900 dark:text-amber-200 mb-6">
          <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <span>This will delete the row permanently from the database. This action cannot be reversed.</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="py-3 px-4 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="py-3 px-4 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold tracking-tight shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Listing'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
