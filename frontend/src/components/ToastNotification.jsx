import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
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
