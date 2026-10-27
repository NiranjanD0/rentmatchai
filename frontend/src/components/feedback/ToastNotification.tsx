'use client';

import { useEffect } from 'react';
import { useToast } from '@/src/components/ui/Notifications';

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
  const { notify } = useToast();

  useEffect(() => {
    if (!toast) return;

    notify({
      title: toast.title || (toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Notice' : 'Information'),
      description: toast.message,
      icon: toast.type === 'error' ? 'alert' : toast.type === 'success' ? 'success' : 'info',
      duration: 3500,
    });

    onClose();
  }, [toast, notify, onClose]);

  return null;
}
