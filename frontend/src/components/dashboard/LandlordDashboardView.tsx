'use client';

import React, { useMemo, useState } from 'react';
import {
  Building2,
  TrendingUp,
  Eye,
  SlidersHorizontal,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useProperty } from '@/src/context/PropertyContext';
import { usePageCurtains } from '@/src/components/ui/page-curtains';
import { PropertyCard } from '@/src/components/property';
import { Button } from '@/src/components/ui/button';
import { PROPERTY_STATUS, type Property } from '@/src/constants/initialData';
import {
  Table,
  TableCard,
  TableRowActionsDropdown,
} from '@/src/components/application/table/table';

const money = (n: number) => '₹' + Number(n).toLocaleString('en-IN');

export default function LandlordDashboardView() {
  const { user } = useAuth();
  const {
    properties,
    openEditProperty,
    openDeleteProperty,
    togglePropertyStatus,
  } = useProperty();
  const { navigateWithCurtains } = usePageCurtains();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Properties belonging to this logged-in landlord
  const myProperties = useMemo(() => {
    if (!user?.id) return [];
    return properties.filter((p) => p.listerId === user.id);
  }, [properties, user?.id]);

  const activeCount = useMemo(() => {
    return myProperties.filter((p) => p.status === PROPERTY_STATUS.ACTIVE).length;
  }, [myProperties]);

  const inactiveCount = useMemo(() => {
    return myProperties.filter((p) => p.status !== PROPERTY_STATUS.ACTIVE).length;
  }, [myProperties]);

  const totalMonthlyRent = useMemo(() => {
    return myProperties
      .filter((p) => p.status === PROPERTY_STATUS.ACTIVE)
      .reduce((sum, p) => sum + p.rent, 0);
  }, [myProperties]);

  const safeLastName = user?.lastName && user.lastName !== 'User' ? user.lastName : '';
  const displayName = user?.firstName ? [user.firstName, safeLastName].filter(Boolean).join(' ') : 'Property Lister';

  const handleOpenDetails = (id: string) => {
    navigateWithCurtains(`/properties/${id}`, 'Property Details');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 select-none">
      {/* 1. Welcome & Portfolio Banner */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
              Welcome, {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed text-pretty">
              Manage your Gandhinagar rental inventory, track prospective tenant enquiries, and publish verified direct listings.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row (standard clean tiles with tabular nums) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Portfolio Listings */}
        <div className="p-6 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Total Properties</span>
            <div className="size-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shadow-2xs">
              <Building2 size={15} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white tabular-nums">
              {myProperties.length}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">properties</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            {activeCount} currently live for rent
          </p>
        </div>

        {/* Metric 2: Active / Occupancy Status */}
        <div className="p-6 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Active Listings</span>
            <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white tabular-nums">
              {activeCount}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Published</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            {myProperties.length - activeCount} paused / drafts
          </p>
        </div>

        {/* Metric 3: Total Monthly Rental Value */}
        <div className="p-6 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Monthly Yield</span>
            <div className="size-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shadow-2xs">
              <TrendingUp size={15} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white tabular-nums">
              {money(totalMonthlyRent)}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">/mo</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            Active rent potential
          </p>
        </div>

        {/* Metric 4: Drafts & Inactive Units */}
        <div
          onClick={() => navigateWithCurtains('/dashboard/properties', 'My Properties')}
          className="group p-6 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-200 cursor-pointer shadow-2xs hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Drafts / Inactive</span>
            <div className="size-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shadow-2xs">
              <Building2 size={15} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white tabular-nums">
              {inactiveCount}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">units</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            Manage in portfolio view
          </p>
        </div>
      </div>

      {/* 3. Managed Properties Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Your Rental Properties
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Update pricing, toggle publication states, or edit listing specifications
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWithCurtains('/dashboard/properties', 'My Properties')}
              className="text-xs h-9 rounded-lg border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
            >
              <span>Manage All ({myProperties.length})</span>
              <ArrowUpRight size={13} />
            </Button>
          </div>
        </div>

        {myProperties.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {myProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isSaved={false}
                  onToggleSave={() => {}}
                  onOpenDetails={handleOpenDetails}
                  isOwner={true}
                  onEdit={openEditProperty}
                  onToggleStatus={togglePropertyStatus}
                  onDelete={openDeleteProperty}
                />
              ))}
            </div>
          ) : (
            <TableCard.Root>
              <Table aria-label="Landlord portfolio table" size="sm">
                <Table.Header>
                  <Table.Head label="Property" />
                  <Table.Head label="Location" />
                  <Table.Head label="Monthly Rent" />
                  <Table.Head label="Status" />
                  <Table.Head label="Actions" className="text-right" />
                </Table.Header>
                <Table.Body>
                  {myProperties.map((p) => (
                    <Table.Row key={p.id} id={p.id}>
                      <Table.Cell>
                        <div className="flex items-center gap-3">
                          <div
                            className="size-10 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 cursor-pointer"
                            onClick={() => handleOpenDetails(p.id)}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&q=80'}
                              alt={p.title}
                              className="size-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => handleOpenDetails(p.id)}
                              className="text-left font-semibold text-zinc-900 dark:text-white hover:text-[#E8510E] transition-colors truncate block max-w-xs cursor-pointer"
                            >
                              {p.title}
                            </button>
                            <p className="text-[11px] text-zinc-500 font-normal mt-0.5">
                              {p.bedrooms} BHK · {p.sqft} sqft · {p.furnishing}
                            </p>
                          </div>
                        </div>
                      </Table.Cell>

                      <Table.Cell>
                        <span className="text-zinc-600 dark:text-zinc-400 truncate block max-w-[160px]">
                          {p.location}
                        </span>
                      </Table.Cell>

                      <Table.Cell>
                        <span className="font-bold text-zinc-900 dark:text-white tabular-nums">
                          {money(p.rent)}/mo
                        </span>
                      </Table.Cell>

                      <Table.Cell>
                        <button
                          type="button"
                          onClick={() => togglePropertyStatus(p.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors active:scale-95 ${
                            p.status === PROPERTY_STATUS.ACTIVE
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/60'
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              p.status === PROPERTY_STATUS.ACTIVE ? 'bg-emerald-500' : 'bg-zinc-400'
                            }`}
                          />
                          {p.status === PROPERTY_STATUS.ACTIVE ? 'Active' : 'Paused'}
                        </button>
                      </Table.Cell>

                      <Table.Cell className="text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDetails(p.id)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors cursor-pointer active:scale-90"
                            title="View property details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditProperty(p)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
                          >
                            Edit
                          </button>
                          <TableRowActionsDropdown
                            onView={() => handleOpenDetails(p.id)}
                            onEdit={() => openEditProperty(p)}
                            onToggleStatus={() => togglePropertyStatus(p.id)}
                            onDelete={() => openDeleteProperty(p)}
                            isPaused={p.status === PROPERTY_STATUS.INACTIVE}
                          />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </TableCard.Root>
          )
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 sm:p-10 text-center bg-white/50 dark:bg-zinc-900/30">
            <div className="size-12 mx-auto rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center mb-3">
              <Building2 size={20} />
            </div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
              No properties listed yet
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
              Publish your first Gandhinagar rental property to start receiving verified tenant enquiries.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

