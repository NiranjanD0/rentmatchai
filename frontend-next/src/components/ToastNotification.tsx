'use client';

import { useEffect, useRef } from 'react';
import { useToast } from './ui/Notifications';

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
  const lastToastRef = useRef<Toast | null>(null);

  useEffect(() => {
    if (toast && toast !== lastToastRef.current) {
      lastToastRef.current = toast;
      const isError = toast.type === 'error';
      const isInfo = toast.type === 'info';

      notify({
        icon: isError ? 'alert' : isInfo ? 'info' : 'success',
        title: toast.title || (isError ? 'Action Failed' : isInfo ? 'Notice' : 'Success'),
        description: toast.message,
        duration: 4500,
      });
      onClose();
    }
  }, [toast, notify, onClose]);

  return null;
}
