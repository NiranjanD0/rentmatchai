'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Sparkles,
  Heart,
  BedDouble,
  Bath,
  Maximize2,
  CheckCircle2,
  Check,
  MessageCircle,
  Building2,
  Edit3,
  Eye,
  EyeOff,
  Trash2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Clock,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useProperty } from '../../../context/PropertyContext';
import { PropertyService } from '../../../services/propertyService';
import { PROPERTY_STATUS } from '../../../constants/initialData';
import { usePageCurtains } from '../../../components/ui/page-curtains';
import { PropertyDetailSkeleton } from '@/src/components/property';

const money = (n: number) => '₹' + Number(n).toLocaleString('en-IN');

function PropertyDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { navigateWithCurtains } = usePageCurtains();

  const { user } = useAuth();
  const {
    properties,
    saved,
    toggleSave,
    openEditProperty,
    togglePropertyStatus,
    openDeleteProperty,
    openEnquiry,
  } = useProperty();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Find property from context or database
  const property =
    properties.find((p) => String(p.id) === String(id)) || PropertyService.getProperty(id);

  if (!property && properties.length === 0) {
    return <PropertyDetailSkeleton />;
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32 text-center">
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-400">
          <Building2 size={24} />
        </div>
        <h2 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight mb-2">
          Property Not Found
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-6">
          The listing you are looking for does not exist or may have been deleted.
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold px-6 py-2.5 text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
          onClick={() => navigateWithCurtains('/dashboard/explore', 'Find Properties')}
        >
          <ArrowLeft size={14} /> Return to Find Properties
        </button>
      </div>
    );
  }

  const isSaved = saved.includes(property.id);
  const isOwner = Boolean(user && String(user.id) === String(property.listerId));
  const isInactive = property.status === PROPERTY_STATUS.INACTIVE;

  const images = property.gallery?.length ? property.gallery : [property.image];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-950 dark:text-zinc-50 pb-24 sm:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Back Navigation Bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 active:scale-95"
            onClick={() => {
              if (typeof window !== 'undefined' && window.history.length > 1) {
                router.back();
              } else {
                navigateWithCurtains('/dashboard/explore', 'Find Properties');
              }
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to results</span>
          </button>

          <div className="flex items-center gap-2">
            {property.match && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-2xs">
                <Sparkles size={12} />
                <span>{property.match}% match</span>
              </span>
            )}
            <button
              type="button"
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-2xs ${
                isSaved
                  ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400'
              }`}
              onClick={() => toggleSave(property.id)}
            >
              <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} />
              <span>{isSaved ? 'Saved to shortlist' : 'Save home'}</span>
            </button>
          </div>
        </div>

        {/* Owner Management Notification Banner */}
        {isOwner && (
          <div className="mb-8 p-4 sm:p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shrink-0">
                <Building2 size={18} />
              </div>
              <div>
                <strong className="block text-sm font-bold text-zinc-950 dark:text-white">
                  Owner Mode: You own this listing.
                </strong>
                <span className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 block">
                  Current status is <strong className="text-zinc-900 dark:text-zinc-200">{property.status}</strong>.{' '}
                  {isInactive
                    ? 'This listing is hidden from public tenants.'
                    : 'This listing is live on the public feed.'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-all active:scale-95 cursor-pointer"
                onClick={() => openEditProperty(property)}
              >
                <Edit3 size={13} /> Edit Details
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-all active:scale-95 cursor-pointer"
                onClick={() => togglePropertyStatus(property.id)}
              >
                {isInactive ? (
                  <>
                    <Eye size={13} /> Reactivate
                  </>
                ) : (
                  <>
                    <EyeOff size={13} /> Deactivate
                  </>
                )}
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                onClick={() => openDeleteProperty(property)}
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        )}

        {/* Header Title Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
            <MapPin size={13} className="text-zinc-400" />
            <span>{property.location}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-zinc-950 dark:text-white tracking-[-0.025em] mb-3 leading-tight break-words">
            {property.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
            {property.propertyType} · {property.bedrooms} bedrooms · {property.bathrooms || 1} bathrooms · {property.sqft || 900} sq ft
          </p>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* Main Photo Container */}
          <div className="lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100 dark:bg-zinc-900 shadow-sm group">
            <img
              src={images[activeImageIndex]}
              alt={property.title}
              className="h-full w-full object-cover transition-transform duration-500 ease-out"
            />

            {/* Photo Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  aria-label="Previous photo"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border border-white/20 dark:border-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center opacity-85 hover:opacity-100 transition-all active:scale-90 shadow-md cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next photo"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border border-white/20 dark:border-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center opacity-85 hover:opacity-100 transition-all active:scale-90 shadow-md cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
                <span className="absolute bottom-4 right-4 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-black/65 backdrop-blur-md text-white border border-white/10 shadow-xs">
                  {activeImageIndex + 1} / {images.length}
                </span>
              </>
            )}

            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-zinc-950/90 text-zinc-950 dark:text-white backdrop-blur-md border border-white/20 dark:border-zinc-800 shadow-xs">
              <ShieldCheck size={13} />
              <span>Verified property photo</span>
            </div>
          </div>

          {/* Side Thumbnail & Host Card */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div
              className="relative aspect-[16/10] sm:aspect-[16/8] lg:aspect-auto lg:flex-1 rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100 dark:bg-zinc-900 cursor-pointer group"
              onClick={() => setActiveImageIndex((1) % images.length)}
            >
              <img
                src={images[1] || images[0]}
                alt="Interior view"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white">
                Interior view
              </span>
            </div>

            <div className="p-5 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-950/70 backdrop-blur-sm flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shrink-0 font-bold text-sm shadow-2xs">
                <Building2 size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <b className="block text-xs font-bold text-zinc-950 dark:text-white truncate">
                  {property.propertyType || 'Apartment'} in {property.location}
                </b>
                <small className="block text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                  Lister: {property.listerName || 'Verified Host'}
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Content Columns: Left Details + Right Sticky Rent Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* Section 1: The Space */}
            <section className="p-7 sm:p-9 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/60 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 block mb-1">
                THE SPACE
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight mb-4">
                About this rental
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
                {property.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-850">
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800">
                  <BedDouble className="text-zinc-500 mb-2" size={20} />
                  <b className="block text-sm font-bold text-zinc-950 dark:text-white">
                    {property.bedrooms} Bedrooms
                  </b>
                  <small className="block text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Living &amp; sleeping rooms
                  </small>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800">
                  <Bath className="text-zinc-500 mb-2" size={20} />
                  <b className="block text-sm font-bold text-zinc-950 dark:text-white">
                    {property.bathrooms || 1} Bathrooms
                  </b>
                  <small className="block text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Private sanitary spaces
                  </small>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800">
                  <Maximize2 className="text-zinc-500 mb-2" size={20} />
                  <b className="block text-sm font-bold text-zinc-950 dark:text-white">
                    {property.sqft || 900} sq ft
                  </b>
                  <small className="block text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Approx carpet area
                  </small>
                </div>
              </div>
            </section>

            {/* Section 2: Amenities */}
            <section className="p-7 sm:p-9 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/60 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 block mb-1">
                AMENITIES &amp; SPECIFICATIONS
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight mb-6">
                Included features
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {[...(property.amenities || []), property.furnishing, property.availableFrom].map(
                  (item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                    >
                      <CheckCircle2 size={14} className="text-zinc-950 dark:text-white shrink-0" />
                      <span>{item}</span>
                    </span>
                  )
                )}
              </div>
            </section>

            {/* Section 3: Match Explanation (AI Concept) */}
            <section className="p-7 sm:p-9 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 shadow-xs flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shrink-0">
                <Sparkles size={20} />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 block mb-1">
                  MATCH EXPLANATION · AI CONCEPT
                </span>
                <h2 className="text-xl font-black text-zinc-950 dark:text-white tracking-tight mb-2">
                  Why this home could fit
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Calculated weighted fit based on rent within budget, location in Gandhinagar, and specified amenities.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200">
                    <Check size={12} className="text-zinc-950 dark:text-white" />
                    <span>Rent at {money(property.rent)}/mo</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200">
                    <Check size={12} className="text-zinc-950 dark:text-white" />
                    <span>{property.bedrooms} BHK spacious layout</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200">
                    <Check size={12} className="text-zinc-950 dark:text-white" />
                    <span>{property.commute || '15 min to campus'}</span>
                  </span>
                </div>
              </div>
            </section>

            {/* Section 4: Visit Checklist Questions */}
            <section className="p-7 sm:p-9 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/60 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 block mb-1">
                BE PREPARED FOR A VISIT
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight mb-4">
                Recommended Landlord Visit Questions
              </h2>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 mb-6">
                <li className="flex items-start gap-2.5">
                  <HelpCircle size={15} className="text-zinc-400 shrink-0 mt-0.5" />
                  <span>What maintenance charges are covered in the {money(property.rent)} monthly rent?</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <HelpCircle size={15} className="text-zinc-400 shrink-0 mt-0.5" />
                  <span>What are the exact security deposit refund clauses and notice periods?</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <HelpCircle size={15} className="text-zinc-400 shrink-0 mt-0.5" />
                  <span>Is 24/7 water supply and power backup provided?</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <HelpCircle size={15} className="text-zinc-400 shrink-0 mt-0.5" />
                  <span>Are visitor restrictions or gated community guidelines applicable?</span>
                </li>
              </ul>
              <small className="text-xs text-zinc-400 dark:text-zinc-500 block">
                Visit questions assist tenants in evaluating homes thoroughly.
              </small>
            </section>
          </div>

          {/* Right Sticky Rent Box */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-xl shadow-zinc-950/5 dark:shadow-black/50">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 block mb-1">
                MONTHLY RENT
              </span>
              <div className="text-3xl font-black text-zinc-950 dark:text-white tracking-tight mb-6 tabular-nums">
                {money(property.rent)}{' '}
                <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">/ month</span>
              </div>

              <div className="space-y-3.5 py-4 border-y border-zinc-100 dark:border-zinc-850 text-xs mb-6">
                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Security deposit</span>
                  <b className="text-zinc-950 dark:text-white tabular-nums">
                    {money(property.deposit || property.rent * 2)}
                  </b>
                </div>

                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Furnishing</span>
                  <b className="text-zinc-950 dark:text-white">{property.furnishing}</b>
                </div>

                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Availability</span>
                  <b className="text-zinc-950 dark:text-white">{property.availableFrom || 'Available now'}</b>
                </div>

                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Lister Name</span>
                  <b className="text-zinc-950 dark:text-white">{property.listerName || 'Verified Lister'}</b>
                </div>

                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Commute estimate</span>
                  <b className="text-zinc-950 dark:text-white">{property.commute || '15-20 min'}</b>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold tracking-tight shadow-md transition-all active:scale-95 cursor-pointer"
                  onClick={() => openEnquiry(property)}
                >
                  <MessageCircle size={15} /> Contact / Enquire
                </button>

                <button
                  type="button"
                  className={`w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full border text-xs font-bold tracking-tight transition-all active:scale-95 cursor-pointer ${
                    isSaved
                      ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400'
                  }`}
                  onClick={() => toggleSave(property.id)}
                >
                  <Heart size={15} fill={isSaved ? 'currentColor' : 'none'} />
                  <span>{isSaved ? 'Saved to shortlist' : 'Save to shortlist'}</span>
                </button>
              </div>

              {isOwner && (
                <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-850">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2.5">
                    Lister Quick Actions
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                      onClick={() => openEditProperty(property)}
                    >
                      <Edit3 size={13} /> Edit Listing Details
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                      onClick={() => togglePropertyStatus(property.id)}
                    >
                      {isInactive ? 'Reactivate Property' : 'Deactivate Listing'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function PropertyDetailsRoute() {
  return (
    <React.Suspense fallback={<PropertyDetailSkeleton />}>
      <PropertyDetailsContent />
    </React.Suspense>
  );
}
