from __future__ import annotations

import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean, CheckConstraint, Date, DateTime, ForeignKey, Index, Integer,
    Numeric, SmallInteger, String, Text, UniqueConstraint, func, text
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("LENGTH(TRIM(first_name)) > 0", name="users_first_name_not_empty"),
        CheckConstraint("LENGTH(TRIM(last_name)) > 0", name="users_last_name_not_empty"),
        CheckConstraint(
            "password_hash IS NOT NULL OR google_sub IS NOT NULL",
            name="users_auth_method_required",
        ),
        Index("uq_users_email_lower", func.lower(text("email")), unique=True),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    password_hash: Mapped[str | None] = mapped_column(Text)
    google_sub: Mapped[str | None] = mapped_column(String(255), unique=True)
    phone: Mapped[str | None] = mapped_column(String(20))
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("TRUE"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class UserRole(Base):
    __tablename__ = "user_roles"
    __table_args__ = (
        CheckConstraint("role IN ('tenant', 'landlord', 'admin')", name="user_roles_valid_role"),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    role: Mapped[str] = mapped_column(String(20), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class Property(Base):
    __tablename__ = "properties"
    __table_args__ = (
        CheckConstraint("LENGTH(TRIM(title)) > 0", name="properties_title_not_empty"),
        CheckConstraint("LENGTH(TRIM(description)) > 0", name="properties_description_not_empty"),
        CheckConstraint(
            "property_type IN ('apartment', 'house', 'studio', 'pg', 'room', 'other')",
            name="properties_valid_type",
        ),
        CheckConstraint("listing_type IN ('rent', 'lease')", name="properties_valid_listing_type"),
        CheckConstraint(
            "status IN ('draft', 'published', 'rented', 'archived')",
            name="properties_valid_status",
        ),
        CheckConstraint(
            "furnishing_status IS NULL OR furnishing_status IN "
            "('furnished', 'semi-furnished', 'unfurnished')",
            name="properties_valid_furnishing",
        ),
        CheckConstraint("monthly_rent > 0", name="properties_positive_rent"),
        CheckConstraint(
            "security_deposit IS NULL OR security_deposit >= 0",
            name="properties_nonnegative_deposit",
        ),
        CheckConstraint("bedrooms >= 0 AND bathrooms >= 0", name="properties_nonnegative_rooms"),
        CheckConstraint("area_sqft IS NULL OR area_sqft > 0", name="properties_positive_area"),
        CheckConstraint(
            "latitude IS NULL OR latitude BETWEEN -90 AND 90",
            name="properties_valid_latitude",
        ),
        CheckConstraint(
            "longitude IS NULL OR longitude BETWEEN -180 AND 180",
            name="properties_valid_longitude",
        ),
        CheckConstraint(
            "(latitude IS NULL AND longitude IS NULL) OR "
            "(latitude IS NOT NULL AND longitude IS NOT NULL)",
            name="properties_coordinates_paired",
        ),
        Index("idx_properties_owner", "owner_id"),
        Index("idx_properties_city_status", "city", "status"),
        Index("idx_properties_rent", "monthly_rent"),
        Index("idx_properties_bedrooms", "bedrooms"),
        Index("idx_properties_created_at", text("created_at DESC")),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    property_type: Mapped[str] = mapped_column(String(30), nullable=False)
    listing_type: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'rent'"))
    monthly_rent: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    security_deposit: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))
    bedrooms: Mapped[int] = mapped_column(SmallInteger, nullable=False, server_default=text("1"))
    bathrooms: Mapped[Decimal] = mapped_column(Numeric(3, 1), nullable=False, server_default=text("1"))
    area_sqft: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    furnishing_status: Mapped[str | None] = mapped_column(String(20))
    address_line: Mapped[str | None] = mapped_column(String(255))
    locality: Mapped[str | None] = mapped_column(String(100))
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    postal_code: Mapped[str | None] = mapped_column(String(12))
    latitude: Mapped[float | None]
    longitude: Mapped[float | None]
    status: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'draft'"))
    available_from: Mapped[date | None] = mapped_column(Date)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class PropertyImage(Base):
    __tablename__ = "property_images"
    __table_args__ = (
        CheckConstraint("LENGTH(TRIM(image_url)) > 0", name="property_images_url_not_empty"),
        CheckConstraint("display_order >= 0", name="property_images_nonnegative_order"),
        Index("idx_property_images_property", "property_id", "display_order"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False
    )
    image_url: Mapped[str] = mapped_column(Text, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class Amenity(Base):
    __tablename__ = "amenities"
    __table_args__ = (
        CheckConstraint("LENGTH(TRIM(name)) > 0", name="amenities_name_not_empty"),
        Index("uq_amenities_name_lower", func.lower(text("name")), unique=True),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[str | None] = mapped_column(String(50))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class PropertyAmenity(Base):
    __tablename__ = "property_amenities"
    __table_args__ = (Index("idx_property_amenities_amenity", "amenity_id"),)

    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), primary_key=True
    )
    amenity_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("amenities.id", ondelete="CASCADE"), primary_key=True
    )


class SavedProperty(Base):
    __tablename__ = "saved_properties"
    __table_args__ = (Index("idx_saved_properties_property", "property_id"),)

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), primary_key=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class SavedQuestion(Base):
    __tablename__ = "saved_questions"
    __table_args__ = (
        CheckConstraint(
            "LENGTH(TRIM(question_text)) > 0",
            name="saved_questions_text_not_empty",
        ),
        Index("idx_saved_questions_tenant", "tenant_id", text("created_at DESC")),
        Index("idx_saved_questions_property", "property_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False
    )
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

class RentalPreference(Base):
    __tablename__ = "rental_preferences"
    __table_args__ = (
        CheckConstraint("budget_min >= 0", name="preferences_budget_min_nonnegative"),
        CheckConstraint("budget_max >= budget_min", name="preferences_budget_valid"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    property_type: Mapped[str | None] = mapped_column(String(30))
    budget_min: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))
    budget_max: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))
    city: Mapped[str | None] = mapped_column(String(100))
    furnishing_status: Mapped[str | None] = mapped_column(String(20))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
