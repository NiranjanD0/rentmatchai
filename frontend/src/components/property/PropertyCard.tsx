'use client';

import React from 'react';
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Heart,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Edit3,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react';
import { PROPERTY_STATUS, type Property } from '@/src/constants/initialData';
import { cn } from '@/lib/utils';

const money = (n: number) => '₹' + Number(n).toLocaleString('en-IN');

interface PropertyCardProps {
  property: Property;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenDetails: (id: string) => void;
  isOwner?: boolean;
  onEdit?: (property: Property) => void;
  onToggleStatus?: (id: string) => void;
  onDelete?: (property: Property) => void;
}

export default function PropertyCard({
  property,
  isSaved,
  onToggleSave,
  onOpenDetails,
  isOwner = false,
  onEdit,
  onToggleStatus,
  onDelete,
}: PropertyCardProps) {
  const p = property;
  const isInactive = p.status === PROPERTY_STATUS.INACTIVE;

  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-zinc-400 dark:hover:border-zinc-700 min-w-0',
        isInactive && 'opacity-60 grayscale-[30%]'
      )}
    >
      {/* Editorial Large Property Photography Container */}
      <div
        className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => onOpenDetails(p.id)}
        onKeyDown={(e) => e.key === 'Enter' && onOpenDetails(p.id)}
      >
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = '0.3';
          }}
        />

        {/* Minimal Dark Gradient Vignette for Badge Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Property Type Badge - Editorial Minimalist */}
        <span className="absolute top-3.5 left-3.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-white/90 dark:bg-zinc-950/90 text-zinc-900 dark:text-white backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800 shadow-xs">
          {p.propertyType || 'Apartment'}
        </span>

        {/* Verified Direct Landlord Pill */}
        {p.verified && (
          <span className="absolute top-3.5 left-24 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-zinc-950/80 dark:bg-white/90 text-white dark:text-zinc-950 backdrop-blur-md border border-white/20 dark:border-zinc-200 shadow-xs flex items-center gap-1">
            <ShieldCheck size={11} /> Verified
          </span>
        )}

        {/* Shortlist Minimalist Heart Button */}
        <button
          type="button"
          className={cn(
            'absolute top-3.5 right-3.5 h-8 w-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer active:scale-90',
            isSaved
              ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white'
              : 'bg-white/80 dark:bg-zinc-950/80 border-white/30 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:text-red-500 hover:border-red-500'
          )}
          aria-label={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(p.id);
          }}
        >
          <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} />
        </button>

        {/* AI Precision Match Score Badge */}
        {p.match && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 text-[11px] font-extrabold rounded-md bg-zinc-950/90 dark:bg-white/95 text-white dark:text-zinc-950 backdrop-blur-md border border-white/20 dark:border-zinc-200 shadow-sm flex items-center gap-1.5">
            <Sparkles size={11} className="text-zinc-400 dark:text-zinc-600" />
            <span>{p.match}% Match</span>
          </div>
        )}

        {/* Commute Tag */}
        {p.commute && (
          <span className="absolute bottom-3 right-3 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-black/60 backdrop-blur-md text-zinc-200 border border-white/10 hidden sm:inline-block">
            {p.commute}
          </span>
        )}

        {/* Status Pill for Lister */}
        {isOwner && (
          <span
            className={cn(
              'absolute bottom-3 right-3 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md flex items-center gap-1.5 shadow-xs',
              p.status === PROPERTY_STATUS.ACTIVE
                ? 'bg-white/90 text-zinc-950 border border-zinc-200'
                : 'bg-zinc-900/90 text-zinc-400 border border-zinc-800'
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                p.status === PROPERTY_STATUS.ACTIVE ? 'bg-zinc-950 dark:bg-white' : 'bg-zinc-500'
              )}
            />
            {p.status}
          </span>
        )}
      </div>

      {/* Card Content - Editorial Layout */}
      <div className="p-5 flex flex-col flex-1 bg-white dark:bg-zinc-950">
        {/* Locality Kicker */}
        <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 mb-1.5">
          <span className="flex items-center gap-1 truncate">
            <MapPin size={12} className="text-zinc-400 shrink-0" />
            {p.location}
          </span>
          {p.furnishing && (
            <span className="text-[10px] font-medium tracking-normal text-zinc-600 dark:text-zinc-400">
              {p.furnishing}
            </span>
          )}
        </div>

        {/* Residence Title */}
        <button
          type="button"
          className="text-base sm:text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50 text-left hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors line-clamp-1 mb-2.5 cursor-pointer"
          onClick={() => onOpenDetails(p.id)}
        >
          {p.title}
        </button>

        {/* Price & Deposit */}
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <div className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
            {money(p.rent)} <span className="text-xs font-normal tracking-normal text-zinc-500 dark:text-zinc-400">/ mo</span>
          </div>
          {p.deposit && (
            <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
              Deposit: {money(p.deposit)}
            </span>
          )}
        </div>

        {/* Specs Row: BHK, Bath, Sqft with Hairline Dividers */}
        <div className="flex items-center gap-3 py-2.5 border-y border-zinc-100 dark:border-zinc-900 text-xs text-zinc-600 dark:text-zinc-400 mb-3.5">
          <span className="flex items-center gap-1 font-medium">
            <BedDouble size={13} className="text-zinc-500" /> {p.bedrooms} Beds
          </span>
          <span className="h-3 w-px bg-zinc-200 dark:bg-zinc-800" />
          <span className="flex items-center gap-1 font-medium">
            <Bath size={13} className="text-zinc-500" /> {p.bathrooms || 1} Baths
          </span>
          {p.sqft && (
            <>
              <span className="h-3 w-px bg-zinc-200 dark:bg-zinc-800" />
              <span className="flex items-center gap-1 font-medium">
                <Maximize2 size={12} className="text-zinc-500" /> {p.sqft} sq.ft
              </span>
            </>
          )}
        </div>

        {/* Amenities Preview */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {(p.amenities || []).slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800"
            >
              {t}
            </span>
          ))}
          {(p.amenities || []).length > 3 && (
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
              +{p.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* OWNER CONTROLS vs EDITORIAL VIEW BUTTON */}
        {isOwner ? (
          <div className="mt-auto grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(p);
              }}
              title="Edit Property Details"
            >
              <Edit3 size={13} /> Edit
            </button>

            <button
              type="button"
              className={cn(
                'flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                p.status === PROPERTY_STATUS.ACTIVE
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200'
                  : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
              )}
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus?.(p.id);
              }}
              title={p.status === PROPERTY_STATUS.ACTIVE ? 'Deactivate listing' : 'Reactivate listing'}
            >
              {p.status === PROPERTY_STATUS.ACTIVE ? (
                <>
                  <EyeOff size={13} /> Pause
                </>
              ) : (
                <>
                  <Eye size={13} /> Live
                </>
              )}
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(p);
              }}
              title="Delete Listing"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="mt-auto w-full py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs font-bold tracking-tight flex items-center justify-between transition-all duration-200 cursor-pointer shadow-2xs group-hover:border-zinc-950 dark:group-hover:border-white"
            onClick={() => onOpenDetails(p.id)}
          >
            <span>View Residence</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}
      </div>
    </article>
  );
}

