"""Initial RentMatch AI schema.

Creates the eight application tables and indexes from the agreed PostgreSQL schema.
"""
from alembic import op

revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute('CREATE TABLE users (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n\n    first_name VARCHAR(100) NOT NULL,\n    last_name  VARCHAR(100) NOT NULL,\n\n    email VARCHAR(255) NOT NULL,\n\n    password_hash TEXT,\n    google_sub VARCHAR(255) UNIQUE,\n\n    phone VARCHAR(20),\n    is_active BOOLEAN NOT NULL DEFAULT TRUE,\n\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n\n    CONSTRAINT users_first_name_not_empty\n        CHECK (LENGTH(TRIM(first_name)) > 0),\n    CONSTRAINT users_last_name_not_empty\n        CHECK (LENGTH(TRIM(last_name)) > 0),\n    CONSTRAINT users_auth_method_required\n        CHECK (password_hash IS NOT NULL OR google_sub IS NOT NULL)\n);')
    op.execute('CREATE UNIQUE INDEX uq_users_email_lower ON users (LOWER(email));')
    op.execute("CREATE TABLE user_roles (\n    user_id UUID NOT NULL\n        REFERENCES users(id) ON DELETE CASCADE,\n    role VARCHAR(20) NOT NULL,\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n\n    PRIMARY KEY (user_id, role),\n\n    CONSTRAINT user_roles_valid_role\n        CHECK (role IN ('tenant', 'landlord', 'admin'))\n);")
    op.execute("CREATE TABLE properties (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n\n    owner_id UUID NOT NULL\n        REFERENCES users(id) ON DELETE RESTRICT,\n\n    title VARCHAR(150) NOT NULL,\n    description TEXT NOT NULL,\n\n    property_type VARCHAR(30) NOT NULL,\n    listing_type VARCHAR(20) NOT NULL DEFAULT 'rent',\n\n    monthly_rent NUMERIC(12,2) NOT NULL,\n    security_deposit NUMERIC(12,2),\n\n    bedrooms SMALLINT NOT NULL DEFAULT 1,\n    bathrooms NUMERIC(3,1) NOT NULL DEFAULT 1,\n    area_sqft NUMERIC(10,2),\n\n    furnishing_status VARCHAR(20),\n\n    address_line VARCHAR(255),\n    locality VARCHAR(100),\n    city VARCHAR(100) NOT NULL,\n    state VARCHAR(100) NOT NULL,\n    postal_code VARCHAR(12),\n\n    latitude DOUBLE PRECISION,\n    longitude DOUBLE PRECISION,\n\n    status VARCHAR(20) NOT NULL DEFAULT 'draft',\n    available_from DATE,\n\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n\n    CONSTRAINT properties_title_not_empty\n        CHECK (LENGTH(TRIM(title)) > 0),\n    CONSTRAINT properties_description_not_empty\n        CHECK (LENGTH(TRIM(description)) > 0),\n    CONSTRAINT properties_valid_type\n        CHECK (property_type IN (\n            'apartment', 'house', 'studio', 'pg', 'room', 'other'\n        )),\n    CONSTRAINT properties_valid_listing_type\n        CHECK (listing_type IN ('rent', 'lease')),\n    CONSTRAINT properties_valid_status\n        CHECK (status IN ('draft', 'published', 'rented', 'archived')),\n    CONSTRAINT properties_valid_furnishing\n        CHECK (\n            furnishing_status IS NULL OR furnishing_status IN (\n                'furnished', 'semi-furnished', 'unfurnished'\n            )\n        ),\n    CONSTRAINT properties_positive_rent\n        CHECK (monthly_rent > 0),\n    CONSTRAINT properties_nonnegative_deposit\n        CHECK (security_deposit IS NULL OR security_deposit >= 0),\n    CONSTRAINT properties_nonnegative_rooms\n        CHECK (bedrooms >= 0 AND bathrooms >= 0),\n    CONSTRAINT properties_positive_area\n        CHECK (area_sqft IS NULL OR area_sqft > 0),\n    CONSTRAINT properties_valid_latitude\n        CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),\n    CONSTRAINT properties_valid_longitude\n        CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),\n    CONSTRAINT properties_coordinates_paired\n        CHECK (\n            (latitude IS NULL AND longitude IS NULL)\n            OR (latitude IS NOT NULL AND longitude IS NOT NULL)\n        )\n);")
    op.execute('CREATE INDEX idx_properties_owner ON properties(owner_id);')
    op.execute('CREATE INDEX idx_properties_city_status ON properties(city, status);')
    op.execute('CREATE INDEX idx_properties_rent ON properties(monthly_rent);')
    op.execute('CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);')
    op.execute('CREATE INDEX idx_properties_created_at ON properties(created_at DESC);')
    op.execute('CREATE TABLE property_images (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    property_id UUID NOT NULL\n        REFERENCES properties(id) ON DELETE CASCADE,\n    image_url TEXT NOT NULL,\n    display_order INTEGER NOT NULL DEFAULT 0,\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n\n    CONSTRAINT property_images_url_not_empty\n        CHECK (LENGTH(TRIM(image_url)) > 0),\n    CONSTRAINT property_images_nonnegative_order\n        CHECK (display_order >= 0)\n);')
    op.execute('CREATE INDEX idx_property_images_property\n    ON property_images(property_id, display_order);')
    op.execute('CREATE TABLE amenities (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    name VARCHAR(100) NOT NULL,\n    category VARCHAR(50),\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n\n    CONSTRAINT amenities_name_not_empty\n        CHECK (LENGTH(TRIM(name)) > 0)\n);')
    op.execute('CREATE UNIQUE INDEX uq_amenities_name_lower ON amenities (LOWER(name));')
    op.execute('CREATE TABLE property_amenities (\n    property_id UUID NOT NULL\n        REFERENCES properties(id) ON DELETE CASCADE,\n    amenity_id UUID NOT NULL\n        REFERENCES amenities(id) ON DELETE CASCADE,\n\n    PRIMARY KEY (property_id, amenity_id)\n);')
    op.execute('CREATE INDEX idx_property_amenities_amenity\n    ON property_amenities(amenity_id);')
    op.execute('CREATE TABLE saved_properties (\n    user_id UUID NOT NULL\n        REFERENCES users(id) ON DELETE CASCADE,\n    property_id UUID NOT NULL\n        REFERENCES properties(id) ON DELETE CASCADE,\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n\n    PRIMARY KEY (user_id, property_id)\n);')
    op.execute('CREATE INDEX idx_saved_properties_property\n    ON saved_properties(property_id);')
    op.execute('CREATE TABLE saved_questions (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n\n    tenant_id UUID NOT NULL\n        REFERENCES users(id) ON DELETE CASCADE,\n    property_id UUID NOT NULL\n        REFERENCES properties(id) ON DELETE CASCADE,\n\n    question_text TEXT NOT NULL,\n\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n\n    CONSTRAINT saved_questions_text_not_empty\n        CHECK (LENGTH(TRIM(question_text)) > 0)\n);')
    op.execute('CREATE INDEX idx_saved_questions_tenant\n    ON saved_questions(tenant_id, created_at DESC);')
    op.execute('CREATE INDEX idx_saved_questions_property\n    ON saved_questions(property_id);')
    op.execute("INSERT INTO amenities (name, category) VALUES\n    ('Wi-Fi', 'utilities'),\n    ('Parking', 'building'),\n    ('Lift', 'building'),\n    ('Air Conditioning', 'appliances'),\n    ('Security', 'building'),\n    ('Power Backup', 'utilities'),\n    ('Gym', 'facilities'),\n    ('Swimming Pool', 'facilities'),\n    ('Laundry', 'utilities'),\n    ('Pet Friendly', 'policy')\nON CONFLICT DO NOTHING;")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS saved_questions CASCADE")
    op.execute("DROP TABLE IF EXISTS saved_properties CASCADE")
    op.execute("DROP TABLE IF EXISTS property_amenities CASCADE")
    op.execute("DROP TABLE IF EXISTS amenities CASCADE")
    op.execute("DROP TABLE IF EXISTS property_images CASCADE")
    op.execute("DROP TABLE IF EXISTS properties CASCADE")
    op.execute("DROP TABLE IF EXISTS user_roles CASCADE")
    op.execute("DROP TABLE IF EXISTS users CASCADE")
