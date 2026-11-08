'use client';

import React, { useMemo, useState } from 'react';
import {
  Building2,
  Plus,
  TrendingUp,
  Inbox,
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

const money = (n: number) => '₹' + Number(n).toLocaleString('en-IN');

export default function LandlordDashboardPage() {
  const { user } = useAuth();
  const {
    properties,
    openAddProperty,
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

  const totalMonthlyRent = useMemo(() => {
    return myProperties
      .filter((p) => p.status === PROPERTY_STATUS.ACTIVE)
      .reduce((sum, p) => sum + p.rent, 0);
  }, [myProperties]);

  const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Property Lister';

  const handleOpenDetails = (id: string) => {
    navigateWithCurtains(`/properties/${id}`, 'Property Details');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 select-none">
      {/* 1. Welcome & Portfolio Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Verified Property Lister · Gandhinagar Portfolio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Welcome, {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Manage your Gandhinagar rental inventory, track prospective tenant enquiries, and publish verified direct listings.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <Button
              onClick={openAddProperty}
              className="h-10 text-xs px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 font-semibold gap-2 shadow-xs cursor-pointer active:scale-[0.99]"
            >
              <Plus size={15} strokeWidth={2.2} />
              <span>Add New Property</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigateWithCurtains('/dashboard/inbox', 'Inbox')}
              className="h-10 text-xs px-4 rounded-xl border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 font-medium gap-2 cursor-pointer shadow-2xs active:scale-[0.99]"
            >
              <Inbox size={14} />
              <span>View Enquiries (3)</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Portfolio Listings */}
        <div className="p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Properties</span>
            <div className="size-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
              <Building2 size={15} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {myProperties.length}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">properties</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            {activeCount} currently live for rent
          </p>
        </div>

        {/* Metric 2: Active / Occupancy Status */}
        <div className="p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Active Listings</span>
            <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {activeCount}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Published</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            {myProperties.length - activeCount} paused / drafts
          </p>
        </div>

        {/* Metric 3: Total Monthly Rental Value */}
        <div className="p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Monthly Yield</span>
            <div className="size-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
              <TrendingUp size={15} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {money(totalMonthlyRent)}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">/mo</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            Active rent potential
          </p>
        </div>

        {/* Metric 4: Tenant Enquiries */}
        <div
          onClick={() => navigateWithCurtains('/dashboard/inbox', 'Inbox')}
          className="group p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-150 cursor-pointer shadow-2xs hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Tenant Enquiries</span>
            <div className="size-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
              <Inbox size={15} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              12
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">3 Pending tours</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            Respond directly in Inbox
          </p>
        </div>
      </div>

      {/* 3. Managed Properties Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              Your Rental Properties
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Update pricing, toggle publication states, or edit listing specifications
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700/50">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
                title="Grid view"
                aria-label="Grid view"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
                title="Table view"
                aria-label="Table view"
              >
                <List size={14} />
              </button>
            </div>

            <Button
              size="sm"
              onClick={openAddProperty}
              className="text-xs h-8 gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 font-semibold cursor-pointer active:scale-[0.99]"
            >
              <Plus size={14} />
              <span>Add Property</span>
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
            <div className="overflow-x-auto rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400 font-semibold">
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Monthly Rent</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {myProperties.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&q=80'}
                              alt={p.title}
                              className="size-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold">{p.title}</p>
                            <p className="text-[11px] text-zinc-500 font-normal">
                              {p.bedrooms} BHK · {p.sqft} sqft · {p.furnishing}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{p.location}</td>
                      <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-white">
                        {money(p.rent)}/mo
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => togglePropertyStatus(p.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
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
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDetails(p.id)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors cursor-pointer"
                            title="View property details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditProperty(p)}
                            className="px-2 py-1 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteProperty(p)}
                            className="px-2 py-1 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 text-center bg-white/50 dark:bg-zinc-900/30">
            <div className="size-12 mx-auto rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center mb-3">
              <Building2 size={20} />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              No properties listed yet
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-4">
              Publish your first Gandhinagar rental property to start receiving verified tenant enquiries.
            </p>
            <Button
              size="sm"
              onClick={openAddProperty}
              className="text-xs rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 cursor-pointer font-semibold"
            >
              Add Property Now
            </Button>
          </div>
        )}
      </section>

      {/* 4. Recent Tenant Enquiries Stream */}
      <section className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
              Recent Tenant Enquiries
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Prospective renters interested in your listings
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWithCurtains('/dashboard/inbox', 'Inbox')}
            className="text-xs gap-1.5 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer"
          >
            <Inbox size={13} />
            <span>Open Inbox</span>
          </Button>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
          {[
            {
              id: '1',
              renter: 'Rajesh Sharma',
              role: 'Software Engineer @ TCS Infocity',
              property: '3 BHK High-Floor Flat, Kudasan',
              message: 'Hello! Is this flat available for immediate move-in? I work at Infocity and can visit tomorrow.',
              date: 'Today, 2:15 PM',
              status: 'Tour Requested',
            },
            {
              id: '2',
              renter: 'Priya Mehta',
              role: 'DA-IICT Graduate Student',
              property: '2 BHK Fully Furnished, Infocity',
              message: 'Could you please confirm if high-speed Wi-Fi and power backup are included in the maintenance fee?',
              date: 'Yesterday, 6:40 PM',
              status: 'Enquiry',
            },
            {
              id: '3',
              renter: 'Kavita Joshi',
              role: 'Faculty @ NID Gandhinagar',
              property: '4 BHK Luxury Penthouse, Sargasan',
              message: 'Interested in a long-term 2-year lease. Can we discuss security deposit terms?',
              date: '2 days ago',
              status: 'Enquiry',
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => navigateWithCurtains('/dashboard/inbox', 'Inbox')}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 -mx-3 px-3 rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="size-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-xs flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700/60 mt-0.5">
                  {item.renter.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                      {item.renter}
                    </p>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">· {item.role}</span>
                  </div>
                  <p className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mt-0.5">
                    Re: {item.property}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
                    &ldquo;{item.message}&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0 pl-12 sm:pl-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
                  {item.status}
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
