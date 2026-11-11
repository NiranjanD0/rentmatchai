'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/src/context/AuthContext';
import { useToast } from '@/src/components/ui/notifications';
import { PropertyService, PropertyValidator, type PropertyFormData } from '@/src/services/propertyService';
import {
  AVAILABLE_AMENITIES,
  CURATED_PHOTO_PRESETS,
  PROPERTY_STATUS,
  type Property,
  type PropertyStatus,
} from '@/src/constants/initialData';
import {
  X,
  Building2,
  MapPin,
  IndianRupee,
  Maximize2,
  Image as ImageIcon,
  Sparkles,
  Check,
} from 'lucide-react';
import { ScrollArea } from '@/src/components/ui/scroll-area';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProperty?: Property | null; // null for create, property object for edit
  onSuccess?: (property: Property, message: string) => void;
}

export default function PropertyFormModal({
  isOpen,
  onClose,
  initialProperty = null,
  onSuccess,
}: PropertyFormModalProps) {
  const { user } = useAuth();
  const { notify } = useToast();
  const isEditing = Boolean(initialProperty);

  // Form Fields
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [rent, setRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [location, setLocation] = useState('');
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [sqft, setSqft] = useState('1050');
  const [furnishing, setFurnishing] = useState('Semi-furnished');
  const [availableFrom, setAvailableFrom] = useState('Available now');
  const [amenities, setAmenities] = useState<string[]>(['Balcony', 'Parking', 'Security']);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(CURATED_PHOTO_PRESETS[0].url);
  const [status, setStatus] = useState<PropertyStatus>(PROPERTY_STATUS.ACTIVE);

  // Validation & Submission States
  const [formState, setFormState] = useState<'draft' | 'validating' | 'error' | 'success'>('draft');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  // Load initial data when modal opens
  useEffect(() => {
    if (initialProperty) {
      setTitle(initialProperty.title || '');
      setPropertyType(initialProperty.propertyType || 'Apartment');
      setRent(String(initialProperty.rent || ''));
      setDeposit(String(initialProperty.deposit || ''));
      setLocation(initialProperty.location || '');
      setBedrooms(String(initialProperty.bedrooms || '2'));
      setBathrooms(String(initialProperty.bathrooms || '2'));
      setSqft(String(initialProperty.sqft || ''));
      setFurnishing(initialProperty.furnishing || 'Semi-furnished');
      setAvailableFrom(initialProperty.availableFrom || 'Available now');
      setAmenities(initialProperty.amenities || []);
      setDescription(initialProperty.description || '');
      setImage(initialProperty.image || CURATED_PHOTO_PRESETS[0].url);
      setStatus(initialProperty.status || PROPERTY_STATUS.ACTIVE);
    } else {
      setTitle('');
      setPropertyType('Apartment');
      setRent('');
      setDeposit('');
      setLocation('Kudasan, Gandhinagar');
      setBedrooms('2');
      setBathrooms('2');
      setSqft('1000');
      setFurnishing('Semi-furnished');
      setAvailableFrom('Available now');
      setAmenities(['Balcony', 'Parking', 'Security']);
      setDescription('');
      setImage(CURATED_PHOTO_PRESETS[0].url);
      setStatus(PROPERTY_STATUS.ACTIVE);
    }
    setFormState('draft');
    setValidationErrors({});
    setServerError('');
  }, [initialProperty, isOpen]);

  if (!isOpen) return null;

  const toggleAmenity = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleRentChange = (val: string) => {
    setRent(val);
    const num = Number(val);
    if (!isNaN(num) && num > 0 && !deposit) {
      setDeposit(String(num * 2));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('validating');
    setValidationErrors({});
    setServerError('');

    const payload: PropertyFormData = {
      title,
      propertyType,
      rent: Number(rent),
      deposit: deposit ? Number(deposit) : Number(rent) * 2,
      location,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      sqft: sqft ? Number(sqft) : undefined,
      furnishing,
      availableFrom,
      amenities,
      description,
      image,
      status,
    };

    const validation = PropertyValidator.validate(payload);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setFormState('error');
      notify.error('Please resolve the highlighted validation errors.', 'Form Incomplete');
      return;
    }

    try {
      if (isEditing && initialProperty) {
        const updated = await PropertyService.updateProperty(user!.id, initialProperty.id, payload);
        setFormState('success');
        if (onSuccess) onSuccess(updated, 'Listing updated successfully!');
        setTimeout(onClose, 350);
      } else {
        const created = await PropertyService.createProperty(user!.id, payload, user);
        setFormState('success');
        if (onSuccess) onSuccess(created, 'New property published successfully and is now Active!');
        setTimeout(onClose, 350);
      }
    } catch (err: unknown) {
      const msg = (err as Error).message || 'Operation failed. Please try again.';
      notify.error(msg, 'Listing Error');
      setFormState('error');
      setServerError(msg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        className="relative w-full max-w-2xl rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-2xl shadow-zinc-950/20 dark:shadow-black/70 my-auto flex flex-col max-h-[92svh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-850">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200/60 dark:border-zinc-800 mb-2">
              <Building2 size={12} /> {isEditing ? 'Editing Mode (Owner)' : 'New Listing Draft'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
              {isEditing ? 'Edit Property Details' : 'Publish a Rental Property'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {isEditing
                ? 'Update rental terms, amenities or description. Changes reflect immediately.'
                : 'Fill in property specifications to make it available to tenants.'}
            </p>
          </div>
          <button
            type="button"
            className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-950 dark:hover:text-white flex items-center justify-center active:scale-90 transition-transform cursor-pointer shrink-0"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <ScrollArea className="flex-1 py-4 pr-3 -mr-3">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center text-[10px] font-mono">
                  1
                </span>
                <span>Basic Information &amp; Location</span>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="prop-title" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Listing Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="prop-title"
                  type="text"
                  placeholder="e.g. Bright & Spacious 2BHK Apartment with Balcony"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all ${
                    validationErrors.title ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                  required
                />
                {validationErrors.title && (
                  <span className="text-[11px] text-red-500 block">{validationErrors.title}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="prop-type" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="prop-type"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Studio">Studio</option>
                    <option value="Villa">Villa / Row House</option>
                    <option value="Independent Floor">Independent Floor</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="prop-bhk" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Bedrooms (BHK) <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="prop-bhk"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                  >
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4+ BHK</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="prop-baths" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Bathrooms
                  </label>
                  <select
                    id="prop-baths"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                  >
                    <option value="1">1 Bath</option>
                    <option value="2">2 Baths</option>
                    <option value="3">3 Baths</option>
                    <option value="4">4+ Baths</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="prop-location" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Locality / Area <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <MapPin size={15} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                    <input
                      id="prop-location"
                      type="text"
                      placeholder="e.g. Kudasan, Gandhinagar"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all ${
                        validationErrors.location ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
                      }`}
                      required
                    />
                  </div>
                  {validationErrors.location && (
                    <span className="text-[11px] text-red-500 block">{validationErrors.location}</span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="prop-sqft" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Carpet Area (sq. ft)
                  </label>
                  <div className="relative flex items-center">
                    <Maximize2 size={15} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                    <input
                      id="prop-sqft"
                      type="number"
                      placeholder="e.g. 1050"
                      value={sqft}
                      onChange={(e) => setSqft(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Furnishing */}
            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-850">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center text-[10px] font-mono">
                  2
                </span>
                <span>Pricing &amp; Furnishing</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="prop-rent" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Monthly Rent (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <IndianRupee size={15} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                    <input
                      id="prop-rent"
                      type="number"
                      placeholder="e.g. 18000"
                      value={rent}
                      onChange={(e) => handleRentChange(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all ${
                        validationErrors.rent ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
                      }`}
                      required
                    />
                  </div>
                  {validationErrors.rent && (
                    <span className="text-[11px] text-red-500 block">{validationErrors.rent}</span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="prop-deposit" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Security Deposit (₹)
                  </label>
                  <div className="relative flex items-center">
                    <IndianRupee size={15} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                    <input
                      id="prop-deposit"
                      type="number"
                      placeholder="e.g. 36000"
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="prop-furnishing" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Furnishing Status
                  </label>
                  <select
                    id="prop-furnishing"
                    value={furnishing}
                    onChange={(e) => setFurnishing(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                  >
                    <option value="Fully furnished">Fully furnished</option>
                    <option value="Semi-furnished">Semi-furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              {/* Status Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block">
                  Listing Visibility (State Diagram):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      status === PROPERTY_STATUS.ACTIVE
                        ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950 shadow-2xs'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                    }`}
                    onClick={() => setStatus(PROPERTY_STATUS.ACTIVE)}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Active (Visible to tenants)</span>
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      status === PROPERTY_STATUS.INACTIVE
                        ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950 shadow-2xs'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                    }`}
                    onClick={() => setStatus(PROPERTY_STATUS.INACTIVE)}
                  >
                    <span className="w-2 h-2 rounded-full bg-zinc-400" />
                    <span>Inactive (Hidden / Draft)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Section 3: Amenities */}
            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-850">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center text-[10px] font-mono">
                  3
                </span>
                <span>Amenities &amp; Features</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {AVAILABLE_AMENITIES.map((item) => {
                  const checked = amenities.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer active:scale-95 ${
                        checked
                          ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950 shadow-2xs'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                      }`}
                      onClick={() => toggleAmenity(item)}
                    >
                      <span className="w-3.5 h-3.5 rounded flex items-center justify-center text-[10px]">
                        {checked && <Check size={12} strokeWidth={2.5} />}
                      </span>
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Visuals & Description */}
            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-850">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center text-[10px] font-mono">
                  4
                </span>
                <span>Photos &amp; Description</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block">
                  Choose a Curated Photo Preset or Custom URL
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {CURATED_PHOTO_PRESETS.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden border transition-all cursor-pointer group text-left ${
                        image === preset.url
                          ? 'border-zinc-950 ring-2 ring-zinc-950 dark:border-white dark:ring-white'
                          : 'border-zinc-200 dark:border-zinc-800 opacity-75 hover:opacity-100'
                      }`}
                      onClick={() => setImage(preset.url)}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[10px] font-semibold text-white truncate block">
                          {preset.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="relative flex items-center pt-2">
                  <ImageIcon size={15} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                  <input
                    type="url"
                    placeholder="Or paste an image URL..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="prop-desc" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Property Description
                </label>
                <textarea
                  id="prop-desc"
                  rows={3}
                  placeholder="Highlight special features, nearby landmarks, or neighborhood benefits..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-850 flex items-center justify-end gap-3">
              <button
                type="button"
                className="py-2.5 px-5 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer active:scale-95"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 py-2.5 px-6 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold tracking-tight shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                disabled={formState === 'validating'}
              >
                <Sparkles size={14} />
                <span>
                  {formState === 'validating'
                    ? 'Validating property fields...'
                    : isEditing
                    ? 'Save Changes'
                    : 'Publish Listing (Insert Active)'}
                </span>
              </button>
            </div>
          </form>
        </ScrollArea>
      </motion.div>
    </div>
  );
}
