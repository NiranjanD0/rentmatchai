// Initial Seed Data for RentMatch AI (Sprint 1 & Sprint 2)
// Aligned with Supabase Schema & Class Diagrams

export const USER_ROLES = {
  TENANT: 'TENANT',
  PROPERTY_LISTER: 'PROPERTY_LISTER'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const PROPERTY_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
} as const;

export type PropertyStatus = typeof PROPERTY_STATUS[keyof typeof PROPERTY_STATUS];

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string | null;
  role: UserRole;
  phone: string;
  googleSub: string | null;
  avatar: string;
  company?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  preferences?: {
    budgetMax: number;
    preferredBhk: string;
    targetLocation: string;
  } | null;
}

export interface Property {
  id: string;
  listerId: string;
  listerName: string;
  listerEmail: string;
  listerPhone: string;
  title: string;
  propertyType: string;
  description: string;
  rent: number;
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  furnishing: string;
  location: string;
  amenities: string[];
  status: PropertyStatus;
  availableFrom: string;
  match: number;
  commute: string;
  verified: boolean;
  image: string;
  gallery: string[];
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-lister-001',
    firstName: 'Rajesh',
    lastName: 'Sharma',
    email: 'lister@rentmatch.ai',
    passwordHash: 'Lister@123', // In a real backend, bcrypt/argon2 hash
    role: USER_ROLES.PROPERTY_LISTER,
    phone: '+91 98765 43210',
    googleSub: null,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    company: 'Apex Realty Gandhinagar',
    isActive: true,
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'usr-tenant-001',
    firstName: 'Ananya',
    lastName: 'Patel',
    email: 'tenant@rentmatch.ai',
    passwordHash: 'Tenant@123',
    role: USER_ROLES.TENANT,
    phone: '+91 91234 56789',
    googleSub: null,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    preferences: {
      budgetMax: 22000,
      preferredBhk: '2',
      targetLocation: 'Near PDEU, Gandhinagar'
    },
    isActive: true,
    createdAt: '2026-09-01T14:30:00Z',
    updatedAt: '2026-09-01T14:30:00Z'
  },
  {
    id: 'usr-lister-002',
    firstName: 'Vikram',
    lastName: 'Mehta',
    email: 'vikram.mehta@rentmatch.ai',
    passwordHash: 'Vikram@123',
    role: USER_ROLES.PROPERTY_LISTER,
    phone: '+91 97123 88990',
    googleSub: null,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    company: 'Capital Homes',
    isActive: true,
    createdAt: '2026-09-10T09:15:00Z',
    updatedAt: '2026-09-10T09:15:00Z'
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-101',
    listerId: 'usr-lister-001',
    listerName: 'Rajesh Sharma',
    listerEmail: 'lister@rentmatch.ai',
    listerPhone: '+91 98765 43210',
    title: 'Sunlit Modern 2BHK with Balcony',
    propertyType: 'Apartment',
    description: 'A bright, well-kept apartment with an airy living space, modular kitchen, practical storage, and a scenic balcony for slow mornings.',
    rent: 18500,
    deposit: 37000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1080,
    furnishing: 'Fully furnished',
    location: 'Raysan, Gandhinagar',
    amenities: ['Balcony', 'Parking', 'Wi-Fi', 'Lift', 'Security', 'Power Backup'],
    status: PROPERTY_STATUS.ACTIVE,
    availableFrom: 'Available now',
    match: 96,
    commute: '18 min to PDEU',
    verified: true,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85'
    ],
    createdAt: '2026-09-02T11:00:00Z',
    updatedAt: '2026-09-02T11:00:00Z'
  },
  {
    id: 'prop-102',
    listerId: 'usr-lister-001',
    listerName: 'Rajesh Sharma',
    listerEmail: 'lister@rentmatch.ai',
    listerPhone: '+91 98765 43210',
    title: 'Calm 2BHK Home with Open Skyline Views',
    propertyType: 'Apartment',
    description: 'A comfortable, light-filled home in a peaceful residential pocket of Kudasan with 24/7 security and close proximity to markets.',
    rent: 16000,
    deposit: 32000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 980,
    furnishing: 'Semi-furnished',
    location: 'Kudasan, Gandhinagar',
    amenities: ['Lift', 'Security', 'Balcony', 'Water Supply', 'Parking'],
    status: PROPERTY_STATUS.ACTIVE,
    availableFrom: 'Available from 1 Nov',
    match: 92,
    commute: '22 min to PDEU',
    verified: true,
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'
    ],
    createdAt: '2026-09-05T15:20:00Z',
    updatedAt: '2026-09-05T15:20:00Z'
  },
  {
    id: 'prop-103',
    listerId: 'usr-lister-001',
    listerName: 'Rajesh Sharma',
    listerEmail: 'lister@rentmatch.ai',
    listerPhone: '+91 98765 43210',
    title: 'Minimal Studio Space Near Campus Hub',
    propertyType: 'Studio',
    description: 'A compact and efficient studio apartment designed for focused students and working individuals, with a dedicated study desk and high-speed Wi-Fi.',
    rent: 11000,
    deposit: 22000,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 560,
    furnishing: 'Fully furnished',
    location: 'PDPU Road, Gandhinagar',
    amenities: ['Wi-Fi', 'Study Nook', 'Laundry', 'Security', 'Power Backup'],
    status: PROPERTY_STATUS.ACTIVE,
    availableFrom: 'Available now',
    match: 89,
    commute: '8 min to PDEU',
    verified: true,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85'
    ],
    createdAt: '2026-09-08T09:40:00Z',
    updatedAt: '2026-09-08T09:40:00Z'
  },
  {
    id: 'prop-104',
    listerId: 'usr-lister-002',
    listerName: 'Vikram Mehta',
    listerEmail: 'vikram.mehta@rentmatch.ai',
    listerPhone: '+91 97123 88990',
    title: 'Warm Contemporary 3BHK Family Residence',
    propertyType: 'Apartment',
    description: 'A spacious 3BHK layout with ample natural ventilation, private garden access, dedicated covered parking, and gated society security.',
    rent: 24500,
    deposit: 49000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1420,
    furnishing: 'Semi-furnished',
    location: 'Sargasan, Gandhinagar',
    amenities: ['Parking', 'Gym', 'Balcony', 'Garden', 'Security'],
    status: PROPERTY_STATUS.ACTIVE,
    availableFrom: 'Available now',
    match: 85,
    commute: '25 min to PDEU',
    verified: false,
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'
    ],
    createdAt: '2026-09-12T16:10:00Z',
    updatedAt: '2026-09-12T16:10:00Z'
  },
  {
    id: 'prop-105',
    listerId: 'usr-lister-001',
    listerName: 'Rajesh Sharma',
    listerEmail: 'lister@rentmatch.ai',
    listerPhone: '+91 98765 43210',
    title: 'Quiet Green-Facing 2BHK Near Infocity',
    propertyType: 'Apartment',
    description: 'A serene living space surrounded by green trees, peaceful neighbors, and quick highway connectivity towards Ahmedabad and Gandhinagar.',
    rent: 19500,
    deposit: 39000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1150,
    furnishing: 'Unfurnished',
    location: 'Koba, Gandhinagar',
    amenities: ['Garden', 'Parking', 'Pet Friendly', 'Security'],
    status: PROPERTY_STATUS.INACTIVE, // Demonstrates inactive state from Sprint 2 State Diagram!
    availableFrom: 'Available from 15 Oct',
    match: 81,
    commute: '20 min to PDEU',
    verified: true,
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85'
    ],
    createdAt: '2026-09-15T12:00:00Z',
    updatedAt: '2026-09-15T12:00:00Z'
  }
];

export const CURATED_PHOTO_PRESETS = [
  { label: 'Modern Living Room', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85' },
  { label: 'Calm Interior', url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85' },
  { label: 'Minimal Studio', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85' },
  { label: 'Spacious Balcony', url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85' },
  { label: 'Executive Penthouse', url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=85' }
];

export const AVAILABLE_AMENITIES = [
  'Balcony',
  'Parking',
  'Wi-Fi',
  'Lift',
  'Security',
  'Gym',
  'Garden',
  'Pet Friendly',
  'Study Nook',
  'Power Backup',
  'Water Supply',
  'Air Conditioning'
];
