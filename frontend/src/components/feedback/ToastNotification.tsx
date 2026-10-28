'use client';

import { useEffect } from 'react';

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
  useEffect(() => {
    if (toast) {
      onClose();
    }
  }, [toast, onClose]);

  return null;
}
