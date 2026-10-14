'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  title?: string;
}

interface ToastNotificationProps {
  toast: Toast | null;
  onClose: () => void;
}

export default function ToastNotification({ toast, onClose }: ToastNotificationProps) {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <div className={`toast-container ${isError ? 'toast-error' : isInfo ? 'toast-info' : 'toast-success'}`}>
      <div className="toast-icon">
        {isError ? <AlertCircle size={18} /> : isInfo ? <Info size={18} /> : <CheckCircle2 size={18} />}
      </div>
      <div className="toast-message">
        {toast.title && <div className="toast-title">{toast.title}</div>}
        <div>{toast.message}</div>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        <X size={15} />
      </button>
    </div>
  );
}
