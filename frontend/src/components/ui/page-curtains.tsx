'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';

export function getRouteTitle(url: string): string {
  try {
    const path = url.split('?')[0].split('#')[0];
    if (path === '/' || path === '') return 'Lander';
    if (path === '/explore') return 'Explore Homes';
    if (path === '/shortlist') return 'My Shortlist';
    if (path === '/login') return 'Login';
    if (path === '/signup' || path === '/register') return 'Create Account';
    if (path === '/profile') return 'Dashboard & Profile';
    if (path.startsWith('/properties')) return 'Property Details';
    if (path === '/results') return 'Search Results';

    const segment = path.replace(/^\//, '').split('/')[0];
    if (!segment) return 'RentMatch AI';
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
  } catch {
    return 'RentMatch AI';
  }
}

interface PageCurtainsContextType {
  navigateWithCurtains: (url: string, customTitle?: string) => void;
  isCurtainActive: boolean;
}

const PageCurtainsContext = createContext<PageCurtainsContextType>({
  navigateWithCurtains: () => {},
  isCurtainActive: false,
});

export function usePageCurtains() {
  return useContext(PageCurtainsContext);
}

function PageCurtainsInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const currentPathname = usePathname();

  // 'idle' | 'closing' | 'covered' | 'opening'
  const [phase, setPhase] = useState<'idle' | 'closing' | 'covered' | 'opening'>('idle');
  const [destinationTitle, setDestinationTitle] = useState('Lander');
  const pendingUrlRef = useRef<string | null>(null);
  const isNavigatingRef = useRef(false);

  const navigateWithCurtains = useCallback(
    (url: string, customTitle?: string) => {
      // Don't transition if already running or navigating to the exact same full path
      if (isNavigatingRef.current) return;
      if (url === currentPathname) return;

      const title = customTitle || getRouteTitle(url);
      setDestinationTitle(title);
      pendingUrlRef.current = url;
      isNavigatingRef.current = true;
      setPhase('closing');
    },
    [currentPathname]
  );

  // Handle curtain closing completion
  const handleClosingComplete = useCallback(() => {
    setPhase('covered');
    if (pendingUrlRef.current) {
      router.push(pendingUrlRef.current);
    }
  }, [router]);

  // When pathname changes while covered, wait a brief frame for DOM painting, then open curtains
  useEffect(() => {
    if (phase === 'covered') {
      const timer = setTimeout(() => {
        setPhase('opening');
      }, 70);
      return () => clearTimeout(timer);
    }
  }, [phase, currentPathname]);

  // Handle curtain opening completion
  const handleOpeningComplete = useCallback(() => {
    setPhase('idle');
    pendingUrlRef.current = null;
    isNavigatingRef.current = false;
  }, []);

  // Handle browser back & forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const targetTitle = getRouteTitle(window.location.pathname);
      setDestinationTitle(targetTitle);
      isNavigatingRef.current = true;
      setPhase('closing');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global click interceptor for internal links
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Find nearest <a> tag
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore external links, downloads, new tabs, hash-only anchors
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download') ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.defaultPrevented
      ) {
        return;
      }

      // Check if same route
      if (href === currentPathname) {
        return;
      }

      // Intercept and run curtain transition
      e.preventDefault();
      const title = anchor.getAttribute('data-curtain-title') || getRouteTitle(href);
      navigateWithCurtains(href, title);
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [currentPathname, navigateWithCurtains]);

  const isVisible = phase !== 'idle';
  const isClosing = phase === 'closing';
  const isCovered = phase === 'covered';

  // Animation variants for split stage curtains (Left and Right panels)
  const easeCurve: [number, number, number, number] = [0.22, 1, 0.36, 1];

  const leftCurtainVariants = {
    initial: { x: '-100%' },
    closing: {
      x: '0%',
      transition: { duration: 0.38, ease: easeCurve },
    },
    covered: { x: '0%' },
    opening: {
      x: '-100%',
      transition: { duration: 0.38, ease: easeCurve },
    },
  };

  const rightCurtainVariants = {
    initial: { x: '100%' },
    closing: {
      x: '0%',
      transition: { duration: 0.38, ease: easeCurve },
    },
    covered: { x: '0%' },
    opening: {
      x: '100%',
      transition: { duration: 0.38, ease: easeCurve },
    },
  };

  const centerContentVariants = {
    initial: { opacity: 0, scale: 0.92, y: 10 },
    closing: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.28, delay: 0.1, ease: 'easeOut' as const },
    },
    covered: { opacity: 1, scale: 1, y: 0 },
    opening: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.2, ease: 'easeIn' as const },
    },
  };

  return (
    <PageCurtainsContext.Provider value={{ navigateWithCurtains, isCurtainActive: isVisible }}>
      {children}

      {/* Full-coverage Cinematic Page Curtains Overlay */}
      <AnimatePresence>
        {isVisible && (
          <div
            className="fixed inset-0 z-[99999] pointer-events-auto flex items-center justify-center overflow-hidden"
            aria-live="assertive"
            aria-busy={isVisible}
          >
            {/* Left Curtain Panel */}
            <motion.div
              variants={leftCurtainVariants}
              initial="initial"
              animate={isClosing ? 'closing' : isCovered ? 'covered' : 'opening'}
              onAnimationComplete={(variant) => {
                if (variant === 'closing') handleClosingComplete();
                if (variant === 'opening') handleOpeningComplete();
              }}
              className="absolute top-0 left-0 bottom-0 w-1/2 bg-white dark:bg-black border-r border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-zinc-400/20 dark:shadow-black"
            />

            {/* Right Curtain Panel */}
            <motion.div
              variants={rightCurtainVariants}
              initial="initial"
              animate={isClosing ? 'closing' : isCovered ? 'covered' : 'opening'}
              className="absolute top-0 right-0 bottom-0 w-1/2 bg-white dark:bg-black border-l border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-zinc-400/20 dark:shadow-black"
            />

            {/* Center Destination Title ONLY */}
            <motion.div
              variants={centerContentVariants}
              initial="initial"
              animate={isClosing ? 'closing' : isCovered ? 'covered' : 'opening'}
              className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-lg"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white drop-shadow-xs">
                <span className="bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent">
                  {destinationTitle}
                </span>
              </h2>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageCurtainsContext.Provider>
  );
}

export function PageCurtains({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={<>{children}</>}>
      <PageCurtainsInner>{children}</PageCurtainsInner>
    </React.Suspense>
  );
}
