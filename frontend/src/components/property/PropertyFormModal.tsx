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
  ChevronDown,
  BedDouble,
  Bath,
  Armchair,
  Sofa,
  Home,
  Layers,
  Crown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/src/components/ui/dropdown-menu';

interface ModernSelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
}

interface ModernSelectProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: ModernSelectOption[];
  icon?: React.ComponentType<{ className?: string; size?: number }>;
}

function ModernSelect({
  label,
  required,
  value,
  onChange,
  options,
  icon: DefaultIcon,
}: ModernSelectProps) {
  const currentOption = options.find((o) => o.value === value) || options[0];
  const DisplayIcon = currentOption?.icon || DefaultIcon;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all focus:outline-hidden focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white cursor-pointer shadow-2xs text-left"
            />
          }
        >
          <div className="flex items-center gap-2.5 truncate">
            {DisplayIcon && (
              <DisplayIcon className="size-4 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors shrink-0" />
            )}
            <span className="font-medium truncate">{currentOption?.label || value}</span>
          </div>
          <ChevronDown className="size-4 text-zinc-400 group-data-[popup-open]:rotate-180 transition-transform duration-200 shrink-0 ml-1.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side="bottom"
          sideOffset={6}
          className="w-(--anchor-width) min-w-[210px] p-1.5 rounded-2xl bg-white/95 dark:bg-[#1E1B18]/95 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-xl shadow-zinc-950/10 dark:shadow-black/60 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
        >
          <DropdownMenuGroup className="space-y-0.5">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              const OptIcon = opt.icon;
              return (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => onChange(opt.value)}
                  className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-950 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {OptIcon && (
                      <OptIcon className={`size-4 shrink-0 ${isSelected ? 'text-zinc-950 dark:text-white' : 'text-zinc-400'}`} />
                    )}
                    <div className="min-w-0 text-left">
                      <span className="block truncate">{opt.label}</span>
                      {opt.description && (
                        <span className="block text-[11px] font-normal text-zinc-400 dark:text-zinc-500 truncate">
                          {opt.description}
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <Check size={14} className="text-zinc-950 dark:text-white shrink-0 ml-auto" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const PROPERTY_TYPE_OPTIONS: ModernSelectOption[] = [
  { value: 'Apartment', label: 'Apartment', description: 'Multi-unit residential flat', icon: Building2 },
  { value: 'Studio', label: 'Studio', description: 'Open-concept single living space', icon: Layers },
  { value: 'Villa', label: 'Villa / Row House', description: 'Standalone independent residence', icon: Home },
  { value: 'Independent Floor', label: 'Independent Floor', description: 'Dedicated private floor unit', icon: Building2 },
  { value: 'Penthouse', label: 'Penthouse', description: 'Top-floor luxury residence', icon: Crown },
];

const BEDROOM_OPTIONS: ModernSelectOption[] = [
  { value: '1', label: '1 BHK', description: '1 Bedroom & Living Hall', icon: BedDouble },
  { value: '2', label: '2 BHK', description: '2 Bedrooms & Living Hall', icon: BedDouble },
  { value: '3', label: '3 BHK', description: '3 Bedrooms & Living Hall', icon: BedDouble },
  { value: '4', label: '4+ BHK', description: '4+ Bedrooms Luxury Layout', icon: BedDouble },
];

const BATHROOM_OPTIONS: ModernSelectOption[] = [
  { value: '1', label: '1 Bath', description: 'Single private/common bathroom', icon: Bath },
  { value: '2', label: '2 Baths', description: 'Master attached & common bath', icon: Bath },
  { value: '3', label: '3 Baths', description: 'Multiple attached bathrooms', icon: Bath },
  { value: '4', label: '4+ Baths', description: 'Ensuite bathrooms for all rooms', icon: Bath },
];

const FURNISHING_OPTIONS: ModernSelectOption[] = [
  { value: 'Fully furnished', label: 'Fully furnished', description: 'Move-in ready with appliances & sofa', icon: Armchair },
  { value: 'Semi-furnished', label: 'Semi-furnished', description: 'Fitted wardrobes, fans & modular kitchen', icon: Sofa },
  { value: 'Unfurnished', label: 'Unfurnished', description: 'Blank canvas for your own furniture', icon: Maximize2 },
];

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
  const { user, token } = useAuth();
  const { notify } = useToast();
  const isEditing = Boolean(initialProperty);

  // Form Fields
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [rent, setRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [location, setLocation] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [sqft, setSqft] = useState('1050');
  const [furnishing, setFurnishing] = useState('Semi-furnished');
  const [availableFrom, setAvailableFrom] = useState('');
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
      setAddressLine(initialProperty.addressLine || '');
      setBedrooms(String(initialProperty.bedrooms || '2'));
      setBathrooms(String(initialProperty.bathrooms || '2'));
      setSqft(String(initialProperty.sqft || ''));
      setFurnishing(initialProperty.furnishing || 'Semi-furnished');
      setAvailableFrom(initialProperty.availableFrom && /^\d{4}-\d{2}-\d{2}$/.test(initialProperty.availableFrom) ? initialProperty.availableFrom : '');
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
      setAddressLine('');
      setBedrooms('2');
      setBathrooms('2');
      setSqft('1000');
      setFurnishing('Semi-furnished');
      setAvailableFrom('');
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
      addressLine,
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
      if (!token) throw new Error('Please sign in again before managing properties.');
      if (isEditing && initialProperty) {
        const updated = await PropertyService.updateProperty(token, initialProperty.id, payload, user);
        setFormState('success');
        if (onSuccess) onSuccess(updated, 'Listing updated successfully!');
        setTimeout(onClose, 350);
      } else {
        const created = await PropertyService.createProperty(token, payload, user);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-hidden"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        className="relative w-full max-w-5xl rounded-3xl border border-border bg-card shadow-2xl shadow-zinc-950/20 dark:shadow-black/70 flex flex-col max-h-[90svh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Pinned) */}
        <div className="flex items-start justify-between gap-4 p-6 sm:p-8 pb-4 border-b border-zinc-100 dark:border-zinc-850 shrink-0">
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
            <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-2">
              The backend currently saves core listing details only; photos and amenities are not persisted yet.
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
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-6 sm:px-8 py-5 space-y-6 overscroll-contain">
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

              <div className="space-y-1.5">
                <label htmlFor="prop-desc" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Property Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="prop-desc"
                  rows={3}
                  placeholder="Highlight special features, nearby landmarks, or neighborhood benefits (min 10 characters)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full p-3 rounded-xl border bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all resize-none leading-relaxed ${
                    validationErrors.description ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                  required
                />
                {validationErrors.description && (
                  <span className="text-[11px] text-red-500 block">{validationErrors.description}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <ModernSelect
                  label="Property Type"
                  required
                  value={propertyType}
                  onChange={setPropertyType}
                  options={PROPERTY_TYPE_OPTIONS}
                  icon={Building2}
                />

                <ModernSelect
                  label="Bedrooms (BHK)"
                  required
                  value={bedrooms}
                  onChange={setBedrooms}
                  options={BEDROOM_OPTIONS}
                  icon={BedDouble}
                />

                <ModernSelect
                  label="Bathrooms"
                  value={bathrooms}
                  onChange={setBathrooms}
                  options={BATHROOM_OPTIONS}
                  icon={Bath}
                />
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

              <div className="space-y-1.5">
                <label htmlFor="prop-address" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Building / Society / Street Address <span className="text-zinc-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="prop-address"
                  type="text"
                  placeholder="e.g. Flat 402, Block B, Pramukh Elegance"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all"
                />
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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

                <ModernSelect
                  label="Furnishing Status"
                  value={furnishing}
                  onChange={setFurnishing}
                  options={FURNISHING_OPTIONS}
                  icon={Armchair}
                />

                <div className="space-y-1.5">
                  <label htmlFor="prop-available" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Available From
                  </label>
                  <input
                    id="prop-available"
                    type="date"
                    value={availableFrom && /^\d{4}-\d{2}-\d{2}$/.test(availableFrom) ? availableFrom : ''}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs sm:text-sm text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                  />
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

            {/* Section 4: Visuals */}
            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-850">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center text-[10px] font-mono">
                  4
                </span>
                <span>Listing Photos &amp; Presets</span>
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
            </div>
          </div>

          {/* Actions Footer (Pinned) */}
          <div className="px-6 sm:px-8 py-4 border-t border-zinc-100 dark:border-zinc-850 flex items-center justify-end gap-3 bg-card/95 backdrop-blur-xs shrink-0">
            <button
              type="button"
              className="py-2.5 px-5 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer active:scale-95"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 py-2.5 px-6 rounded-full bg-zinc-950 hover:bg-zinc-850 text-white dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold tracking-tight shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
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
      </motion.div>
    </div>
  );
}
