'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { useToast } from '@/src/components/ui/notifications';
import { PropertyService, PropertyValidator, type PropertyFormData } from '@/src/services/propertyService';
import { AVAILABLE_AMENITIES, CURATED_PHOTO_PRESETS, PROPERTY_STATUS, type Property, type PropertyStatus } from '@/src/constants/initialData';
import { X, Building2, MapPin, IndianRupee, Maximize2, Image as ImageIcon, Sparkles, Check } from 'lucide-react';

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
  onSuccess
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

  // Validation & Submission States (Sprint 2 State Diagram)
  // 'draft' | 'validating' | 'error' | 'success'
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
      // Default reset
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

    const payload: PropertyFormData = {
      title,
      propertyType,
      rent: Number(rent),
      deposit: Number(deposit),
      location,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      sqft: Number(sqft),
      furnishing,
      availableFrom,
      amenities,
      description,
      image,
      status
    };

    // Sprint 2 State Diagram: "Validating (required-field checks)"
    setFormState('validating');
    const { isValid, errors } = PropertyValidator.validate(payload);

    if (!isValid) {
      // Sprint 2 State Diagram: "[invalid] / show errors" -> back to draft with errors displayed
      const firstError = Object.values(errors)[0] || 'Please review required fields before publishing.';
      notify.error(firstError, 'Validation Error');
      setValidationErrors(errors);
      setFormState('draft');
      return;
    }

    setValidationErrors({});
    setServerError('');

    try {
      if (isEditing && initialProperty) {
        // Sprint 2: "[valid] / UPDATE"
        const updated = await PropertyService.updateProperty(user!.id, initialProperty.id, payload);
        setFormState('success');
        if (onSuccess) onSuccess(updated, 'Property details updated successfully.');
        setTimeout(onClose, 350);
      } else {
        // Sprint 2: "[valid] / INSERT property -> Active"
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
    <div className="property-modal-overlay" onClick={onClose}>
      <div className="property-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="property-modal-header">
          <div>
            <span className="property-modal-tag">
              <Building2 size={13} /> {isEditing ? 'Editing Mode (Owner)' : 'New Listing Draft'}
            </span>
            <h2>{isEditing ? 'Edit Property Details' : 'Publish a Rental Property'}</h2>
            <p>
              {isEditing
                ? 'Update rental terms, amenities or description. Changes reflect immediately.'
                : 'Fill in property specifications to make it available to tenants.'}
            </p>
          </div>
          <button className="modal-close-icon" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="property-form">
          {/* Section 1: Basic Information */}
          <div className="form-section-title">
            <span>1</span> Basic Information &amp; Location
          </div>

          <div className="form-group">
            <label htmlFor="prop-title">
              Listing Title <span className="req">*</span>
            </label>
            <input
              id="prop-title"
              type="text"
              placeholder="e.g. Bright & Spacious 2BHK Apartment with Balcony"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={validationErrors.title ? 'input-error' : ''}
              required
            />
            {validationErrors.title && <span className="error-hint">{validationErrors.title}</span>}
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label htmlFor="prop-type">Property Type <span className="req">*</span></label>
              <select
                id="prop-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="Apartment">Apartment</option>
                <option value="Studio">Studio</option>
                <option value="Villa">Villa / Row House</option>
                <option value="Independent Floor">Independent Floor</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="prop-bhk">Bedrooms (BHK) <span className="req">*</span></label>
              <select
                id="prop-bhk"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              >
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="prop-baths">Bathrooms</label>
              <select
                id="prop-baths"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
              >
                <option value="1">1 Bath</option>
                <option value="2">2 Baths</option>
                <option value="3">3 Baths</option>
                <option value="4">4+ Baths</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="prop-location">
                Locality / Area <span className="req">*</span>
              </label>
              <div className="input-with-icon">
                <MapPin size={16} />
                <input
                  id="prop-location"
                  type="text"
                  placeholder="e.g. Kudasan, Gandhinagar"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={validationErrors.location ? 'input-error' : ''}
                  required
                />
              </div>
              {validationErrors.location && <span className="error-hint">{validationErrors.location}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="prop-sqft">Carpet Area (sq. ft)</label>
              <div className="input-with-icon">
                <Maximize2 size={16} />
                <input
                  id="prop-sqft"
                  type="number"
                  placeholder="e.g. 1050"
                  value={sqft}
                  onChange={(e) => setSqft(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Financials & Furnishing */}
          <div className="form-section-title">
            <span>2</span> Pricing &amp; Furnishing
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label htmlFor="prop-rent">
                Monthly Rent (₹) <span className="req">*</span>
              </label>
              <div className="input-with-icon">
                <IndianRupee size={16} />
                <input
                  id="prop-rent"
                  type="number"
                  placeholder="e.g. 18000"
                  value={rent}
                  onChange={(e) => handleRentChange(e.target.value)}
                  className={validationErrors.rent ? 'input-error' : ''}
                  required
                />
              </div>
              {validationErrors.rent && <span className="error-hint">{validationErrors.rent}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="prop-deposit">Security Deposit (₹)</label>
              <div className="input-with-icon">
                <IndianRupee size={16} />
                <input
                  id="prop-deposit"
                  type="number"
                  placeholder="e.g. 36000"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="prop-furnishing">Furnishing Status</label>
              <select
                id="prop-furnishing"
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value)}
              >
                <option value="Fully furnished">Fully furnished</option>
                <option value="Semi-furnished">Semi-furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          {/* Status (Sprint 2 State: Active vs Inactive) */}
          <div className="form-group status-selector-group">
            <label>Listing Visibility (State Diagram):</label>
            <div className="status-toggle-row">
              <button
                type="button"
                className={`btn-status-pill ${status === PROPERTY_STATUS.ACTIVE ? 'active' : ''}`}
                onClick={() => setStatus(PROPERTY_STATUS.ACTIVE)}
              >
                <span className="dot green" /> Active (Visible to tenants)
              </button>
              <button
                type="button"
                className={`btn-status-pill ${status === PROPERTY_STATUS.INACTIVE ? 'active' : ''}`}
                onClick={() => setStatus(PROPERTY_STATUS.INACTIVE)}
              >
                <span className="dot gray" /> Inactive (Hidden / Draft)
              </button>
            </div>
          </div>

          {/* Section 3: Amenities */}
          <div className="form-section-title">
            <span>3</span> Amenities &amp; Features
          </div>

          <div className="amenities-checkbox-grid">
            {AVAILABLE_AMENITIES.map((item) => {
              const checked = amenities.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  className={`amenity-chip ${checked ? 'checked' : ''}`}
                  onClick={() => toggleAmenity(item)}
                >
                  <span className="checkbox-box">{checked && <Check size={12} />}</span>
                  <span>{item}</span>
                </button>
              );
            })}
          </div>

          {/* Section 4: Visuals & Description */}
          <div className="form-section-title">
            <span>4</span> Photos &amp; Description
          </div>

          <div className="form-group">
            <label>Choose a Curated Photo Preset or Custom URL</label>
            <div className="photo-presets-row">
              {CURATED_PHOTO_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  className={`preset-btn ${image === preset.url ? 'selected' : ''}`}
                  onClick={() => setImage(preset.url)}
                >
                  <img src={preset.url} alt={preset.label} />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>

            <div className="custom-photo-url-row">
              <div className="input-with-icon">
                <ImageIcon size={16} />
                <input
                  type="url"
                  placeholder="Or paste an image URL..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="prop-desc">Property Description</label>
            <textarea
              id="prop-desc"
              rows={3}
              placeholder="Highlight special features, nearby landmarks, or neighborhood benefits..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Modal Actions */}
          <div className="modal-actions-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit-property"
              disabled={formState === 'validating'}
            >
              <Sparkles size={16} />
              {formState === 'validating'
                ? 'Validating property fields...'
                : isEditing
                ? 'Save Changes'
                : 'Publish Listing (Insert Active)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
