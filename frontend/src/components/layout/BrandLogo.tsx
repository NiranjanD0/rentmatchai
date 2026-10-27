'use client';

import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  hideText?: boolean;
}

export default function BrandLogo({
  className = '',
  size = 'md',
  hideText = false,
}: BrandLogoProps) {
  const sizeMap = {
    sm: { icon: 'h-7 w-7', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'h-8 w-8', text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 'h-10 w-10', text: 'text-2xl', sub: 'text-xs' },
  };

  const { icon, text, sub } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Geometric Smart Match Roof Icon */}
      <div
        className={`${icon} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-700 text-white shadow-md shadow-emerald-500/20 ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-105 shrink-0`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4/6 w-4/6 text-white drop-shadow-xs"
        >
          {/* Stylized Roof */}
          <path d="M3 10.5L12 3l9 7.5" />
          {/* Modern Building Pillars with Intersecting Match Node */}
          <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
          {/* Central AI Match Spark */}
          <circle cx="12" cy="14" r="2.5" fill="currentColor" stroke="none" />
        </svg>
      </div>

      {!hideText && (
        <div className="flex flex-col leading-none">
          <span className={`font-extrabold tracking-tight text-zinc-900 dark:text-white ${text}`}>
            RentMatch<span className="text-emerald-500">.ai</span>
          </span>
          <span className={`font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mt-0.5 ${sub}`}>
            Direct Rentals
          </span>
        </div>
      )}
    </div>
  );
}
