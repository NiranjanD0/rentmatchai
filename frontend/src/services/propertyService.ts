// Sprint 2: Property Listing & Management Service
// Implements PropertyValidator, OwnershipChecker, and PropertyService
// Aligned with Sprint 2 Class Diagram and State Diagram

import { INITIAL_PROPERTIES, PROPERTY_STATUS, type Property, type User } from '../constants/initialData';

const PROPERTIES_STORAGE_KEY = 'rentmatch_properties_db';

// --- Property Validator (Sprint 2 Class Diagram) ---
export const PropertyValidator = {
  validateRent(rent: string | number): boolean {
    const num = Number(rent);
    return !isNaN(num) && num > 0;
  },

  validateBedrooms(bedrooms: string | number): boolean {
    const num = Number(bedrooms);
    return !isNaN(num) && num >= 1;
  },

  validate(data: Partial<Property>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!data.title || data.title.trim().length < 5) {
      errors.title = 'Title must be at least 5 characters long.';
    }

    if (!this.validateRent(data.rent ?? '')) {
      errors.rent = 'Please enter a valid monthly rent greater than 0.';
    }

    if (!data.location || data.location.trim().length < 3) {
      errors.location = 'Please enter a location or locality (e.g. Kudasan, Gandhinagar).';
    }

    if (!this.validateBedrooms(data.bedrooms ?? '')) {
      errors.bedrooms = 'Bedrooms count must be at least 1.';
    }

    if (!data.propertyType) {
      errors.propertyType = 'Please select a property type.';
    }

    const isValid = Object.keys(errors).length === 0;
    return { isValid, errors };
  }
};

// --- Storage Helper ---
function getStoredProperties(): Property[] {
  if (typeof window === 'undefined') return INITIAL_PROPERTIES;
  try {
    const raw = localStorage.getItem(PROPERTIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES));
      return INITIAL_PROPERTIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROPERTIES;
  }
}

function saveStoredProperties(props: Property[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(props));
  } catch {
    // ignore
  }
}

// --- Ownership Checker (Sprint 2 Class Diagram) ---
export const OwnershipChecker = {
  isOwner(listerId: string, property: Property): boolean {
    if (!listerId || !property) return false;
    return String(property.listerId) === String(listerId);
  },

  checkPermission(currentUserId: string, property: Property): void {
    if (!this.isOwner(currentUserId, property)) {
      throw Object.assign(
        new Error('403 Forbidden: You do not have ownership permission to edit, deactivate, or delete this listing.'),
        { status: 403, code: 'FORBIDDEN_OWNERSHIP' }
      );
    }
  }
};

export type PropertyFormData = Partial<Pick<Property,
  'title' | 'propertyType' | 'rent' | 'deposit' | 'location' | 'bedrooms' | 'bathrooms' |
  'sqft' | 'furnishing' | 'availableFrom' | 'amenities' | 'description' | 'image' | 'gallery' |
  'status' | 'commute'
>>;

// --- PropertyService (Sprint 2 Class Diagram) ---
export const PropertyService = {
  // Reset database back to default seed for testing/demos
  resetToDefault(): Property[] {
    localStorage.removeItem(PROPERTIES_STORAGE_KEY);
    return getStoredProperties();
  },

  // View Property Listings: Display active properties to users (Sprint 2 Goal)
  getAvailableProperties(): Property[] {
    const all = getStoredProperties();
    // In accordance with Sprint 2 State Diagram: only ACTIVE listings are visible to normal users
    return all.filter((p) => p.status === PROPERTY_STATUS.ACTIVE);
  },

  // Get all properties including inactive (for lister / admin)
  getAllProperties(): Property[] {
    return getStoredProperties();
  },

  // Get properties owned by a specific lister (both Active and Inactive)
  getPropertiesByLister(listerId: string): Property[] {
    if (!listerId) return [];
    const all = getStoredProperties();
    return all.filter((p) => String(p.listerId) === String(listerId));
  },

  // Get single property by ID
  getProperty(propertyId: string): Property | null {
    const all = getStoredProperties();
    return all.find((p) => String(p.id) === String(propertyId)) || null;
  },

  // Create Property Listing (Draft -> Validating -> Insert Active)
  async createProperty(listerId: string, data: PropertyFormData, currentUser?: User | null): Promise<Property> {
    await new Promise((resolve) => setTimeout(resolve, 350));

    // Validating state (Sprint 2 State Diagram)
    const { isValid, errors } = PropertyValidator.validate(data);
    if (!isValid) {
      throw Object.assign(new Error('Property validation failed.'), { validationErrors: errors, code: 'VALIDATION_ERROR' });
    }

    const all = getStoredProperties();
    const newPropertyId = `prop-${Date.now()}`;

    const newProperty: Property = {
      id: newPropertyId,
      listerId: listerId,
      listerName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : 'Property Owner',
      listerEmail: currentUser?.email || '',
      listerPhone: currentUser?.phone || '',
      title: data.title!.trim(),
      description: data.description?.trim() || 'No description provided.',
      propertyType: data.propertyType || 'Apartment',
      rent: Number(data.rent),
      deposit: Number(data.deposit) || Number(data.rent) * 2,
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms) || 1,
      sqft: Number(data.sqft) || 850,
      furnishing: data.furnishing || 'Semi-furnished',
      location: data.location!.trim(),
      amenities: Array.isArray(data.amenities) ? data.amenities : [],
      status: PROPERTY_STATUS.ACTIVE, // State Diagram: [valid] / INSERT property -> Active
      availableFrom: data.availableFrom?.trim() || 'Available now',
      match: 90, // Baseline match for demo
      commute: data.commute?.trim() || '15-20 min to city center',
      verified: true,
      image: data.image?.trim() || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
      gallery: data.gallery?.length ? data.gallery : [
        data.image || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    all.unshift(newProperty); // newest on top
    saveStoredProperties(all);

    return newProperty;
  },

  // Edit Property Details (Owner only)
  async updateProperty(currentUserId: string, propertyId: string, updateData: PropertyFormData): Promise<Property> {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const all = getStoredProperties();
    const index = all.findIndex((p) => String(p.id) === String(propertyId));

    if (index === -1) {
      throw new Error('Property not found.');
    }

    const existing = all[index];

    // Ownership check (Sprint 2 Class Diagram: OwnershipChecker)
    OwnershipChecker.checkPermission(currentUserId, existing);

    // Validate update data
    const merged = { ...existing, ...updateData };
    const { isValid, errors } = PropertyValidator.validate(merged);
    if (!isValid) {
      throw Object.assign(new Error('Property update validation failed.'), { validationErrors: errors });
    }

    const updated: Property = {
      ...existing,
      ...updateData,
      rent: Number(updateData.rent !== undefined ? updateData.rent : existing.rent),
      deposit: Number(updateData.deposit !== undefined ? updateData.deposit : existing.deposit),
      bedrooms: Number(updateData.bedrooms !== undefined ? updateData.bedrooms : existing.bedrooms),
      bathrooms: Number(updateData.bathrooms !== undefined ? updateData.bathrooms : existing.bathrooms),
      sqft: Number(updateData.sqft !== undefined ? updateData.sqft : existing.sqft),
      updatedAt: new Date().toISOString()
    };

    all[index] = updated;
    saveStoredProperties(all);

    return updated;
  },

  // Deactivate Property (Active -> Inactive)
  async deactivateProperty(currentUserId: string, propertyId: string): Promise<Property> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const all = getStoredProperties();
    const prop = all.find((p) => String(p.id) === String(propertyId));
    if (!prop) throw new Error('Property not found.');

    OwnershipChecker.checkPermission(currentUserId, prop);

    prop.status = PROPERTY_STATUS.INACTIVE;
    prop.updatedAt = new Date().toISOString();
    saveStoredProperties(all);

    return prop;
  },

  // Reactivate Property (Inactive -> Active)
  async reactivateProperty(currentUserId: string, propertyId: string): Promise<Property> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const all = getStoredProperties();
    const prop = all.find((p) => String(p.id) === String(propertyId));
    if (!prop) throw new Error('Property not found.');

    OwnershipChecker.checkPermission(currentUserId, prop);

    prop.status = PROPERTY_STATUS.ACTIVE;
    prop.updatedAt = new Date().toISOString();
    saveStoredProperties(all);

    return prop;
  },

  // Toggle status between ACTIVE and INACTIVE
  async togglePropertyStatus(currentUserId: string, propertyId: string): Promise<Property> {
    const prop = this.getProperty(propertyId);
    if (!prop) throw new Error('Property not found.');

    if (prop.status === PROPERTY_STATUS.ACTIVE) {
      return this.deactivateProperty(currentUserId, propertyId);
    } else {
      return this.reactivateProperty(currentUserId, propertyId);
    }
  },

  // Delete Property Listing: Permanently removes listing (Sprint 2 State Diagram)
  async deleteProperty(currentUserId: string, propertyId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const all = getStoredProperties();
    const prop = all.find((p) => String(p.id) === String(propertyId));
    if (!prop) throw new Error('Property not found.');

    // Ownership rule check
    OwnershipChecker.checkPermission(currentUserId, prop);

    const filtered = all.filter((p) => String(p.id) !== String(propertyId));
    saveStoredProperties(filtered);

    return true;
  }
};
