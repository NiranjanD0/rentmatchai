-- ============================================================
-- RentMatch AI — Initial PostgreSQL Database Schema
-- Run in pgAdmin Query Tool after selecting your RentMatchAi DB.
-- PostgreSQL 13+ recommended.
--
-- Scope:
--   1. users
--   2. user_roles
--   3. properties
--   4. property_images
--   5. amenities
--   6. property_amenities
--   7. saved_properties (tenant wishlist)
--   8. saved_questions (only explicitly saved questions)
--
-- IMPORTANT:
--   - This script is for a NEW/EMPTY database.
--   - It does not drop existing tables or data.
--   - If you later use Alembic, make migrations the source of truth
--     for future schema changes rather than rerunning this script.
-- ============================================================

BEGIN;

-- gen_random_uuid() is available in supported modern PostgreSQL versions.
-- On older PostgreSQL versions, enable pgcrypto if required:
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,

    -- Store emails normalized to lowercase in the application.
    -- The unique index below also prevents case-only duplicates.
    email VARCHAR(255) NOT NULL,

    -- Nullable for accounts that use Google OAuth only.
    password_hash TEXT,
    google_sub VARCHAR(255) UNIQUE,

    phone VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT users_first_name_not_empty
        CHECK (LENGTH(TRIM(first_name)) > 0),
    CONSTRAINT users_last_name_not_empty
        CHECK (LENGTH(TRIM(last_name)) > 0),
    CONSTRAINT users_auth_method_required
        CHECK (password_hash IS NOT NULL OR google_sub IS NOT NULL)
);

CREATE UNIQUE INDEX uq_users_email_lower ON users (LOWER(email));


-- 2. USER ROLES
-- One user may have more than one role.
CREATE TABLE user_roles (
    user_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id, role),

    CONSTRAINT user_roles_valid_role
        CHECK (role IN ('tenant', 'landlord', 'admin'))
);


-- 3. PROPERTIES
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    owner_id UUID NOT NULL
        REFERENCES users(id) ON DELETE RESTRICT,

    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,

    property_type VARCHAR(30) NOT NULL,
    listing_type VARCHAR(20) NOT NULL DEFAULT 'rent',

    monthly_rent NUMERIC(12,2) NOT NULL,
    security_deposit NUMERIC(12,2),

    bedrooms SMALLINT NOT NULL DEFAULT 1,
    bathrooms NUMERIC(3,1) NOT NULL DEFAULT 1,
    area_sqft NUMERIC(10,2),

    furnishing_status VARCHAR(20),

    address_line VARCHAR(255),
    locality VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(12),

    -- Coordinates for future Google Maps and geographic search.
    -- They may remain NULL until a listing is geocoded.
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,

    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    available_from DATE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT properties_title_not_empty
        CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT properties_description_not_empty
        CHECK (LENGTH(TRIM(description)) > 0),
    CONSTRAINT properties_valid_type
        CHECK (property_type IN (
            'apartment', 'house', 'studio', 'pg', 'room', 'other'
        )),
    CONSTRAINT properties_valid_listing_type
        CHECK (listing_type IN ('rent', 'lease')),
    CONSTRAINT properties_valid_status
        CHECK (status IN ('draft', 'published', 'rented', 'archived')),
    CONSTRAINT properties_valid_furnishing
        CHECK (
            furnishing_status IS NULL OR furnishing_status IN (
                'furnished', 'semi-furnished', 'unfurnished'
            )
        ),
    CONSTRAINT properties_positive_rent
        CHECK (monthly_rent > 0),
    CONSTRAINT properties_nonnegative_deposit
        CHECK (security_deposit IS NULL OR security_deposit >= 0),
    CONSTRAINT properties_nonnegative_rooms
        CHECK (bedrooms >= 0 AND bathrooms >= 0),
    CONSTRAINT properties_positive_area
        CHECK (area_sqft IS NULL OR area_sqft > 0),
    CONSTRAINT properties_valid_latitude
        CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
    CONSTRAINT properties_valid_longitude
        CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),
    CONSTRAINT properties_coordinates_paired
        CHECK (
            (latitude IS NULL AND longitude IS NULL)
            OR (latitude IS NOT NULL AND longitude IS NOT NULL)
        )
);

-- Indexes for common listing pages and filters.
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_city_status ON properties(city, status);
CREATE INDEX idx_properties_rent ON properties(monthly_rent);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);


-- 4. PROPERTY IMAGES
-- Store image URLs here; store actual image files in object storage.
CREATE TABLE property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL
        REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT property_images_url_not_empty
        CHECK (LENGTH(TRIM(image_url)) > 0),
    CONSTRAINT property_images_nonnegative_order
        CHECK (display_order >= 0)
);

CREATE INDEX idx_property_images_property
    ON property_images(property_id, display_order);


-- 5. AMENITIES
CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT amenities_name_not_empty
        CHECK (LENGTH(TRIM(name)) > 0)
);

CREATE UNIQUE INDEX uq_amenities_name_lower ON amenities (LOWER(name));


-- 6. PROPERTY AMENITIES — many-to-many link
CREATE TABLE property_amenities (
    property_id UUID NOT NULL
        REFERENCES properties(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL
        REFERENCES amenities(id) ON DELETE CASCADE,

    PRIMARY KEY (property_id, amenity_id)
);

CREATE INDEX idx_property_amenities_amenity
    ON property_amenities(amenity_id);


-- 7. SAVED PROPERTIES — tenant wishlist
-- A tenant can save many properties; each property can be saved by
-- many tenants. Composite PK prevents duplicate saves.
CREATE TABLE saved_properties (
    user_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL
        REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id, property_id)
);

CREATE INDEX idx_saved_properties_property
    ON saved_properties(property_id);


-- 8. SAVED QUESTIONS
-- Store only questions the tenant explicitly saves.
-- Generated/discarded questions are not persisted by this schema.
CREATE TABLE saved_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL
        REFERENCES properties(id) ON DELETE CASCADE,

    question_text TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT saved_questions_text_not_empty
        CHECK (LENGTH(TRIM(question_text)) > 0)
);

CREATE INDEX idx_saved_questions_tenant
    ON saved_questions(tenant_id, created_at DESC);

CREATE INDEX idx_saved_questions_property
    ON saved_questions(property_id);

-- Optional uniqueness policy:
-- Uncomment if the same tenant should not save the same question
-- more than once for the same property. Exact text matching is used.
-- CREATE UNIQUE INDEX uq_saved_question_per_tenant_property_text
--     ON saved_questions(tenant_id, property_id, question_text);


-- Optional starter amenity catalog. Safe to run more than once.
INSERT INTO amenities (name, category) VALUES
    ('Wi-Fi', 'utilities'),
    ('Parking', 'building'),
    ('Lift', 'building'),
    ('Air Conditioning', 'appliances'),
    ('Security', 'building'),
    ('Power Backup', 'utilities'),
    ('Gym', 'facilities'),
    ('Swimming Pool', 'facilities'),
    ('Laundry', 'utilities'),
    ('Pet Friendly', 'policy')
ON CONFLICT DO NOTHING;

COMMIT;

-- Quick verification after successful execution:
-- SELECT table_name
-- FROM information_schema.tables
-- WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
-- ORDER BY table_name;
