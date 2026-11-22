'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Script from 'next/script';
import { useAuth } from '@/src/context/AuthContext';
import type { UserRole } from '@/src/constants/initialData';
import type { AuthSession } from '@/src/services/authService';

interface GoogleCredentialResponse {
  credential?: string;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

interface GoogleAuthButtonProps {
  mode?: 'signin' | 'signup';
  preferredRole?: UserRole;
  disabled?: boolean;
  className?: string;
  onLoadingChange?: (loading: boolean) => void;
  onSuccess: (session: AuthSession) => void;
  onError: (error: Error) => void;
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleAuthButton({
  mode = 'signin',
  preferredRole,
  disabled = false,
  className = '',
  onLoadingChange,
  onSuccess,
  onError,
}: GoogleAuthButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const { loginWithGoogle } = useAuth();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const [buttonReady, setButtonReady] = useState(false);
  const [initializationFailed, setInitializationFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCredential = useCallback(
    async (response: GoogleCredentialResponse) => {
      if (!response.credential) {
        onError(new Error('Google did not return credentials. Authentication cancelled.'));
        return;
      }

      setIsSubmitting(true);
      onLoadingChange?.(true);

      try {
        const session = await loginWithGoogle(response.credential, preferredRole);
        onSuccess(session);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Google authentication failed. Please verify your connection or try again.';
        onError(new Error(message));
      } finally {
        setIsSubmitting(false);
        onLoadingChange?.(false);
      }
    },
    [loginWithGoogle, preferredRole, onSuccess, onError, onLoadingChange]
  );

  const credentialHandlerRef = useRef(handleCredential);
  useEffect(() => {
    credentialHandlerRef.current = handleCredential;
  }, [handleCredential]);

  // Initialize Google Identity Services
  useEffect(() => {
    const button = googleButtonRef.current;
    if (!button) return;

    button.replaceChildren();
    setButtonReady(false);
    setInitializationFailed(false);

    if (!scriptLoaded || scriptError || !GOOGLE_CLIENT_ID) return;
    const googleId = window.google?.accounts?.id;
    if (!googleId) {
      setInitializationFailed(true);
      return;
    }

    try {
      googleId.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (resp) => credentialHandlerRef.current(resp),
      });

      const measuredWidth = containerRef.current?.offsetWidth || 340;
      const buttonWidth = Math.min(Math.max(measuredWidth, 240), 400);

      googleId.renderButton(button, {
        theme: 'outline',
        size: 'large',
        text: mode === 'signup' ? 'signup_with' : 'signin_with',
        shape: 'rectangular',
        width: buttonWidth,
      });

      if (button.childElementCount === 0) {
        setInitializationFailed(true);
        return;
      }

      setButtonReady(true);
    } catch (err: unknown) {
      console.warn('Google Identity Services render failed:', err);
      setInitializationFailed(true);
    }
  }, [scriptLoaded, scriptError, mode]);

  const handleFallbackClick = () => {
    if (isButtonDisabled) return;
    if (!GOOGLE_CLIENT_ID) {
      onError(new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.'));
      return;
    }
    if (scriptError || !window.google?.accounts?.id) {
      onError(
        new Error(
          'Google Identity Services is unreachable. Please check your internet connection or ad blocker.'
        )
      );
      return;
    }
    onError(
      new Error(
        initializationFailed
          ? 'Google sign-in could not initialize. Please reload and try again.'
          : 'Google sign-in is still loading. Please try again in a moment.'
      )
    );
  };

  const isWaitingForGoogle =
    !scriptError &&
    (!scriptLoaded ||
      (Boolean(GOOGLE_CLIENT_ID) && !buttonReady && !initializationFailed));
  const isButtonDisabled = disabled || isSubmitting || isWaitingForGoogle;

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setScriptLoaded(true)}
        onError={() => setScriptError(true)}
      />

      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden rounded-xl ${className}`}
      >
        {!buttonReady && (
          <button
            type="button"
            onClick={handleFallbackClick}
            disabled={isButtonDisabled}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
              <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
              <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
              <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
            </svg>
            <span>
              {isWaitingForGoogle
                ? 'Loading Google sign-in...'
                : mode === 'signup'
                  ? 'Sign up with Google'
                  : 'Continue with Google'}
            </span>
          </button>
        )}

        <div
          ref={googleButtonRef}
          className={`w-full ${
            buttonReady
              ? isButtonDisabled
                ? 'pointer-events-none opacity-50'
                : ''
              : 'pointer-events-none absolute inset-0 opacity-0'
          }`}
          aria-hidden={!buttonReady}
        />
      </div>
    </>
  );
}
