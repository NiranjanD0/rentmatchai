'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  Compass,
  Check,
  X,
  Heart,
  Sparkles,
  MapPin,
  Building2,
  Trash2,
} from 'lucide-react';
import { useProperty } from '@/src/context/PropertyContext';
import { usePageCurtains } from '@/src/components/ui/page-curtains';
import { Button } from '@/src/components/ui/button';

const money = (n: number) => '₹' + Number(n).toLocaleString('en-IN');

export default function ComparePropertiesPage() {
  const { properties, saved, toggleSave, openEnquiry } = useProperty();
  const { navigateWithCurtains } = usePageCurtains();

  // Saved properties available to compare
  const savedProperties = useMemo(() => {
    return properties.filter((p) => saved.includes(p.id));
  }, [properties, saved]);

  // Compare up to 3 properties
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    return savedProperties.slice(0, 3).map((p) => p.id);
  });

  const comparedProperties = useMemo(() => {
    return savedProperties.filter((p) => selectedIds.includes(p.id));
  }, [savedProperties, selectedIds]);

  const removeProperty = (id: string) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const handleOpenDetails = (id: string) => {
    navigateWithCurtains(`/properties/${id}`, 'Property Details');
  };

  if (savedProperties.length < 2) {
    return (
      <div className="w-full max-w-7xl mx-auto py-16 px-4 text-center">
        <div className="size-16 mx-auto rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center mb-4 border border-zinc-200 dark:border-zinc-700/60">
          <ArrowLeftRight size={28} />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Compare Verified Homes
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mt-1 mb-6 leading-relaxed">
          Shortlist at least 2 rental properties in Gandhinagar to compare pricing, deposits, commute times, and amenities side-by-side.
        </p>
        <Button
          onClick={() => navigateWithCurtains('/dashboard/explore', 'Find Properties')}
          className="h-10 text-xs px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 font-semibold gap-2 shadow-xs cursor-pointer active:scale-[0.99]"
        >
          <Compass size={15} />
          <span>Browse Available Homes</span>
        </Button>
      </div>
    );
  }

  const allAmenities = Array.from(
    new Set(comparedProperties.flatMap((p) => p.amenities || []))
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Compare Properties
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Side-by-side breakdown of your shortlisted homes in Gandhinagar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWithCurtains('/dashboard/shortlist', 'My Shortlist')}
            className="text-xs border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 cursor-pointer"
          >
            <span>Shortlist ({saved.length})</span>
          </Button>
        </div>
      </div>

      {/* Comparison Matrix */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 shadow-2xs">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-zinc-900/40">
              <th className="py-4 px-6 w-48 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Specification
              </th>
              {comparedProperties.map((p) => (
                <th key={p.id} className="py-4 px-6 min-w-[220px] align-top">
                  <div className="space-y-2">
                    <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80'}
                        alt={p.title}
                        className="size-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
                          {p.match ? `${p.match}% Match` : 'Verified'}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeProperty(p.id)}
                          className="text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 cursor-pointer transition-colors"
                          title="Remove from comparison"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-white truncate mt-1">
                        {p.title}
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                        {p.location}
                      </p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-xs">
            {/* Rent */}
            <tr>
              <td className="py-3.5 px-6 font-medium text-zinc-500 dark:text-zinc-400">Monthly Rent</td>
              {comparedProperties.map((p) => (
                <td key={p.id} className="py-3.5 px-6 font-bold text-zinc-900 dark:text-white">
                  {money(p.rent)}/mo
                </td>
              ))}
            </tr>

            {/* Deposit */}
            <tr>
              <td className="py-3.5 px-6 font-medium text-zinc-500 dark:text-zinc-400">Security Deposit</td>
              {comparedProperties.map((p) => (
                <td key={p.id} className="py-3.5 px-6 text-zinc-700 dark:text-zinc-300">
                  {money(p.deposit)}
                </td>
              ))}
            </tr>

            {/* Bedrooms & Baths */}
            <tr>
              <td className="py-3.5 px-6 font-medium text-zinc-500 dark:text-zinc-400">Layout</td>
              {comparedProperties.map((p) => (
                <td key={p.id} className="py-3.5 px-6 text-zinc-700 dark:text-zinc-300">
                  {p.bedrooms} BHK · {p.bathrooms} Bath
                </td>
              ))}
            </tr>

            {/* Carpet Area */}
            <tr>
              <td className="py-3.5 px-6 font-medium text-zinc-500 dark:text-zinc-400">Carpet Area</td>
              {comparedProperties.map((p) => (
                <td key={p.id} className="py-3.5 px-6 text-zinc-700 dark:text-zinc-300">
                  {p.sqft} sq ft
                </td>
              ))}
            </tr>

            {/* Furnishing */}
            <tr>
              <td className="py-3.5 px-6 font-medium text-zinc-500 dark:text-zinc-400">Furnishing</td>
              {comparedProperties.map((p) => (
                <td key={p.id} className="py-3.5 px-6 text-zinc-700 dark:text-zinc-300 font-medium">
                  {p.furnishing}
                </td>
              ))}
            </tr>

            {/* Commute */}
            <tr>
              <td className="py-3.5 px-6 font-medium text-zinc-500 dark:text-zinc-400">Transit & Commute</td>
              {comparedProperties.map((p) => (
                <td key={p.id} className="py-3.5 px-6 text-zinc-700 dark:text-zinc-300">
                  {p.commute || '15 min to Infocity'}
                </td>
              ))}
            </tr>

            {/* Verified Owner */}
            <tr>
              <td className="py-3.5 px-6 font-medium text-zinc-500 dark:text-zinc-400">Direct Owner</td>
              {comparedProperties.map((p) => (
                <td key={p.id} className="py-3.5 px-6">
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <Check size={14} strokeWidth={2.5} />
                    <span>{p.listerName}</span>
                  </span>
                </td>
              ))}
            </tr>

            {/* Amenities breakdown */}
            {allAmenities.slice(0, 5).map((amenity) => (
              <tr key={amenity}>
                <td className="py-3 px-6 text-zinc-500 dark:text-zinc-400">{amenity}</td>
                {comparedProperties.map((p) => {
                  const hasAmenity = p.amenities?.includes(amenity);
                  return (
                    <td key={p.id} className="py-3 px-6">
                      {hasAmenity ? (
                        <Check size={15} className="text-zinc-900 dark:text-white" strokeWidth={2.5} />
                      ) : (
                        <span className="text-zinc-300 dark:text-zinc-700">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Action Row */}
            <tr className="bg-zinc-50/50 dark:bg-zinc-900/30">
              <td className="py-4 px-6 font-medium text-zinc-500 dark:text-zinc-400">Actions</td>
              {comparedProperties.map((p) => (
                <td key={p.id} className="py-4 px-6">
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleOpenDetails(p.id)}
                      className="w-full text-xs h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 cursor-pointer font-semibold"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEnquiry(p)}
                      className="w-full text-xs h-8 rounded-lg border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 cursor-pointer"
                    >
                      Contact Owner
                    </Button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
