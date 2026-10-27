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
        'group relative flex flex-col rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 min-w-0',
        isInactive && 'opacity-60 grayscale-[30%]'
      )}
    >
      {/* Image & Floating Badges */}
      <div
        className="relative h-52 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => onOpenDetails(p.id)}
        onKeyDown={(e) => e.key === 'Enter' && onOpenDetails(p.id)}
      >
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = '0.3';
          }}
        />

        {/* Property Type Badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-sm">
          {p.propertyType || 'Apartment'}
        </span>

        {/* Verified Badge */}
        {p.verified && (
          <span className="absolute top-3 right-12 px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30 shadow-sm flex items-center gap-1">
            <ShieldCheck size={12} /> Verified
          </span>
        )}

        {/* Shortlist Heart Button */}
        <button
          type="button"
          className={cn(
            'absolute top-3 right-3 h-8 w-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer active:scale-90',
            isSaved
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-300 hover:text-red-500 hover:bg-white dark:hover:bg-zinc-900'
          )}
          aria-label={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(p.id);
          }}
        >
          <Heart size={15} fill={isSaved ? 'currentColor' : 'none'} />
        </button>

        {/* Match Percentage Badge */}
        {p.match && (
          <span className="absolute bottom-3 left-3 px-2.5 py-1 text-[11px] font-extrabold rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md flex items-center gap-1">
            <Sparkles size={12} /> {p.match}% match
          </span>
        )}

        {/* Status Pill for Lister */}
        {isOwner && (
          <span
            className={cn(
              'absolute bottom-3 right-3 px-2.5 py-0.5 text-[11px] font-bold rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-sm',
              p.status === PROPERTY_STATUS.ACTIVE
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                : 'bg-zinc-900/80 text-zinc-400 border border-zinc-700'
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                p.status === PROPERTY_STATUS.ACTIVE ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'
              )}
            />
            {p.status}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Locality */}
        <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
          <MapPin size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="truncate">{p.location}</span>
        </div>

        {/* Title */}
        <button
          type="button"
          className="text-base font-bold text-zinc-900 dark:text-white text-left hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-1 mb-2.5 cursor-pointer"
          onClick={() => onOpenDetails(p.id)}
        >
          {p.title}
        </button>

        {/* Price & Deposit Row */}
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <div className="text-xl font-extrabold text-zinc-900 dark:text-white">
            {money(p.rent)} <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">/ mo</span>
          </div>
          {p.deposit && (
            <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
              Dep: {money(p.deposit)}
            </span>
          )}
        </div>

        {/* BHK, Bath, Sqft Facts */}
        <div className="flex items-center gap-2 mb-3 text-xs text-zinc-600 dark:text-zinc-400">
          <span className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-1 rounded-lg font-medium">
            <BedDouble size={14} className="text-emerald-600 dark:text-emerald-400" /> {p.bedrooms} BHK
          </span>
          <span className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-1 rounded-lg font-medium">
            <Bath size={14} className="text-teal-600 dark:text-teal-400" /> {p.bathrooms || 1} Bath
          </span>
          {p.sqft && (
            <span className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-1 rounded-lg font-medium">
              <Maximize2 size={13} className="text-zinc-500" /> {p.sqft} sqft
            </span>
          )}
        </div>

        {/* Amenities / Furnishing Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {(p.amenities || []).slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/90 text-zinc-600 dark:text-zinc-400"
            >
              {t}
            </span>
          ))}
          {p.furnishing && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              {p.furnishing}
            </span>
          )}
        </div>

        {/* OWNER CONTROLS vs VIEW BUTTON */}
        {isOwner ? (
          <div className="mt-auto grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
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
                'flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer',
                p.status === PROPERTY_STATUS.ACTIVE
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
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
              className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
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
            className="mt-auto w-full py-2.5 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 group-hover:bg-emerald-600 group-hover:text-white cursor-pointer shadow-sm"
            onClick={() => onOpenDetails(p.id)}
          >
            <span>View property details</span>
            <ArrowUpRight size={14} />
          </button>
        )}
      </div>
    </article>
  );
}
