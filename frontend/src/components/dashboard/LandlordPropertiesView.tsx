'use client';

import React, { useMemo, useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  LayoutGrid,
  List,
  Eye,
  SlidersHorizontal,
  MapPin,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowUpDown,
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
import { Badge } from '@/src/components/base/badges/badges';

const money = (n: number) => '₹' + Number(n).toLocaleString('en-IN');

export default function LandlordPropertiesView() {
  const { user, isLister } = useAuth();
  const {
    properties,
    openAddProperty,
    openEditProperty,
    openDeleteProperty,
    togglePropertyStatus,
    saved,
    toggleSave,
  } = useProperty();
  const { navigateWithCurtains } = usePageCurtains();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [sortOption, setSortOption] = useState<'newest' | 'rent-high' | 'rent-low' | 'title'>('newest');

  // Properties belonging to this logged-in landlord
  const myProperties = useMemo(() => {
    if (!user?.id) return [];
    return properties.filter((p) => p.listerId === user.id);
  }, [properties, user?.id]);

  const activeCount = useMemo(() => {
    return myProperties.filter((p) => p.status === PROPERTY_STATUS.ACTIVE).length;
  }, [myProperties]);

  const inactiveCount = useMemo(() => {
    return myProperties.filter((p) => p.status === PROPERTY_STATUS.INACTIVE).length;
  }, [myProperties]);

  const totalMonthlyRent = useMemo(() => {
    return myProperties
      .filter((p) => p.status === PROPERTY_STATUS.ACTIVE)
      .reduce((sum, p) => sum + p.rent, 0);
  }, [myProperties]);

  // Filter & Search
  const filteredProperties = useMemo(() => {
    let result = [...myProperties];

    if (statusFilter === 'ACTIVE') {
      result = result.filter((p) => p.status === PROPERTY_STATUS.ACTIVE);
    } else if (statusFilter === 'INACTIVE') {
      result = result.filter((p) => p.status === PROPERTY_STATUS.INACTIVE);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          (p.addressLine && p.addressLine.toLowerCase().includes(q)) ||
          p.furnishing.toLowerCase().includes(q) ||
          `${p.bedrooms} bhk`.includes(q)
      );
    }

    if (sortOption === 'rent-high') {
      result.sort((a, b) => b.rent - a.rent);
    } else if (sortOption === 'rent-low') {
      result.sort((a, b) => a.rent - b.rent);
    } else if (sortOption === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [myProperties, statusFilter, searchQuery, sortOption]);

  const handleOpenDetails = (id: string) => {
    navigateWithCurtains(`/properties/${id}`, 'Property Details');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 select-none">
      {/* 1. Page Header & Actions */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
              My Listed Properties
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Manage your Gandhinagar rental inventory, update tenancy vacancy status, and edit listing details.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={openAddProperty}
              className="gap-2 h-11 px-6 rounded-lg bg-zinc-950 hover:bg-zinc-850 text-white dark:bg-white dark:hover:bg-zinc-150 dark:text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add New Property</span>
            </Button>
          </div>
        </div>

        {/* 2. Portfolio Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="p-4 sm:p-5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Total Properties
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tabular-nums">
                {myProperties.length}
              </span>
              <span className="text-xs text-zinc-500 font-medium">units</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
              Active Listings
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                {activeCount}
              </span>
              <span className="text-xs text-zinc-500 font-medium">live</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Paused / Drafts
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-zinc-700 dark:text-zinc-300 tabular-nums">
                {inactiveCount}
              </span>
              <span className="text-xs text-zinc-500 font-medium">hidden</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Live Rent Roll
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tabular-nums">
                {money(totalMonthlyRent)}
              </span>
              <span className="text-xs text-zinc-500 font-medium">/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search, Filters, & View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, location, BHK..."
            className="w-full h-10 pl-10 pr-9 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-[#E8510E]/30 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills + Sort & View Mode */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Tabs */}
          <div className="inline-flex p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80">
            <button
              type="button"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
              onClick={() => setStatusFilter('ALL')}
            >
              All ({myProperties.length})
            </button>
            <button
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'ACTIVE'
                  ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
              onClick={() => setStatusFilter('ACTIVE')}
            >
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Active ({activeCount})</span>
            </button>
            <button
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'INACTIVE'
                  ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
              onClick={() => setStatusFilter('INACTIVE')}
            >
              <span className="size-1.5 rounded-full bg-zinc-400" />
              <span>Paused ({inactiveCount})</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as typeof sortOption)}
              className="h-9 px-3 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 text-zinc-700 dark:text-zinc-300 cursor-pointer shadow-2xs focus:outline-hidden"
            >
              <option value="newest">Sort: Default</option>
              <option value="rent-high">Rent: High to Low</option>
              <option value="rent-low">Rent: Low to High</option>
              <option value="title">Title: A-Z</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
              title="Table view"
              aria-label="Table view"
            >
              <List size={14} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Listings Display: Untitled UI Table or Grid */}
      {filteredProperties.length > 0 ? (
        viewMode === 'table' ? (
          <TableCard.Root>
            <TableCard.Header
              title="All Listings"
              badge={`${filteredProperties.length} ${filteredProperties.length === 1 ? 'property' : 'properties'}`}
              description="Listing details, monthly rates, and live availability"
            />
            <Table aria-label="Properties table" size="md">
              <Table.Header>
                <Table.Head label="Property" />
                <Table.Head label="Location" />
                <Table.Head label="Monthly Rent" />
                <Table.Head label="Status" />
                <Table.Head label="Configuration" />
                <Table.Head label="Actions" className="text-right" />
              </Table.Header>
              <Table.Body>
                {filteredProperties.map((p) => (
                  <Table.Row key={p.id} id={p.id}>
                    {/* Property Thumbnail & Info */}
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <div
                          className="size-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 cursor-pointer shadow-2xs hover:opacity-90 transition-opacity"
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
                            className="text-left font-semibold text-zinc-900 dark:text-white hover:text-[#E8510E] dark:hover:text-[#F06A32] transition-colors truncate block max-w-xs cursor-pointer"
                          >
                            {p.title}
                          </button>
                          <p className="text-[11px] text-zinc-500 font-normal mt-0.5">
                            {p.bedrooms} BHK · {p.bathrooms} Bath · {p.sqft} sqft
                          </p>
                        </div>
                      </div>
                    </Table.Cell>

                    {/* Location */}
                    <Table.Cell>
                      <div>
                        <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                          <MapPin size={13} className="text-zinc-400 shrink-0" />
                          <span className="truncate max-w-[180px] font-medium">{p.location}</span>
                        </div>
                        {p.addressLine && (
                          <p className="text-[11px] text-zinc-400 truncate max-w-[180px] pl-4.5 mt-0.5">
                            {p.addressLine}
                          </p>
                        )}
                      </div>
                    </Table.Cell>

                    {/* Rent */}
                    <Table.Cell>
                      <div>
                        <span className="font-bold text-zinc-950 dark:text-white tabular-nums">
                          {money(p.rent)}
                          <span className="text-[10px] text-zinc-500 font-normal">/mo</span>
                        </span>
                        {p.deposit && (
                          <p className="text-[10px] text-zinc-400">
                            Dep: {money(p.deposit)}
                          </p>
                        )}
                      </div>
                    </Table.Cell>

                    {/* Status Badge Toggle */}
                    <Table.Cell>
                      <button
                        type="button"
                        onClick={() => togglePropertyStatus(p.id)}
                        title="Click to toggle status"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-all active:scale-95 ${
                          p.status === PROPERTY_STATUS.ACTIVE
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/60 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80'
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            p.status === PROPERTY_STATUS.ACTIVE ? 'bg-emerald-500' : 'bg-zinc-400'
                          }`}
                        />
                        <span>{p.status === PROPERTY_STATUS.ACTIVE ? 'Active' : 'Paused'}</span>
                      </button>
                    </Table.Cell>

                    {/* Furnishing & Config */}
                    <Table.Cell>
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60">
                          {p.furnishing}
                        </span>
                        {p.availableFrom && (
                          <p className="text-[10px] text-zinc-500 font-normal">
                            Avail: {p.availableFrom}
                          </p>
                        )}
                      </div>
                    </Table.Cell>

                    {/* Actions */}
                    <Table.Cell className="text-right">
                      <div className="inline-flex items-center gap-1">
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isSaved={saved.includes(property.id)}
                onToggleSave={toggleSave}
                onOpenDetails={handleOpenDetails}
                isOwner={true}
                onEdit={openEditProperty}
                onToggleStatus={togglePropertyStatus}
                onDelete={openDeleteProperty}
              />
            ))}
          </div>
        )
      ) : myProperties.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 p-10 sm:p-14 text-center bg-white/60 dark:bg-zinc-900/40">
          <div className="size-14 mx-auto rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mb-4">
            <Building2 size={24} />
          </div>
          <h3 className="text-base font-bold text-zinc-950 dark:text-white">
            No properties listed yet
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mt-1 mb-6 leading-relaxed">
            You have not added any properties to your portfolio. Use the button at the top to add one.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 p-8 sm:p-12 text-center bg-white dark:bg-zinc-900/40">
          <AlertCircle size={28} className="text-zinc-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
            No matching properties
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 mb-4">
            No listings found for &quot;{searchQuery}&quot; with current status filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
            }}
            className="text-xs rounded-lg cursor-pointer"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
