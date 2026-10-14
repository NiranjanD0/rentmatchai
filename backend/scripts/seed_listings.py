import sys
import os
from decimal import Decimal

# Add the parent directory to the path so we can import 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.db.models import User, Property

def seed_data():
    db = SessionLocal()
    try:
        # 1. Find your test user to act as the landlord
        owner = db.query(User).filter(User.email == "user@example.com").first()
        if not owner:
            print("Error: No test user found. Please register user@example.com in Swagger first.")
            return

        # 2. Prevent duplicate seeding
        if db.query(Property).count() > 0:
            print("Database already has properties. Skipping seed.")
            return

        # 3. Create dummy listings
        properties = [
            Property(
                owner_id=owner.id,
                title="Cozy Downtown Studio",
                description="A beautiful studio apartment in the heart of the city.",
                property_type="studio",
                listing_type="rent",
                monthly_rent=Decimal("1200.00"),
                city="New York",
                state="NY",
                status="published"
            ),
            Property(
                owner_id=owner.id,
                title="Spacious 3BHK Family Home",
                description="Perfect for families, close to schools and parks.",
                property_type="house",
                listing_type="rent",
                monthly_rent=Decimal("2500.00"),
                bedrooms=3,
                bathrooms=Decimal("2.0"),
                city="Austin",
                state="TX",
                status="published"
            ),
            Property(
                owner_id=owner.id,
                title="Luxury High-Rise Apartment",
                description="Stunning views, gym, and pool access.",
                property_type="apartment",
                listing_type="rent",
                monthly_rent=Decimal("3500.00"),
                bedrooms=2,
                bathrooms=Decimal("2.0"),
                city="San Francisco",
                state="CA",
                status="published"
            ),
            Property(
                owner_id=owner.id,
                title="Affordable Student PG",
                description="Shared room with meals included, walking distance to campus.",
                property_type="pg",
                listing_type="rent",
                monthly_rent=Decimal("500.00"),
                bedrooms=1,
                bathrooms=Decimal("1.0"),
                city="Boston",
                state="MA",
                status="published"
            ),
            Property(
                owner_id=owner.id,
                title="Quiet Suburb Room",
                description="Private room in a shared house with backyard.",
                property_type="room",
                listing_type="rent",
                monthly_rent=Decimal("800.00"),
                bedrooms=1,
                bathrooms=Decimal("1.0"),
                city="Austin",
                state="TX",
                status="published"
            )
        ]

        db.add_all(properties)
        db.commit()
        print("Successfully seeded 5 dummy properties!")

    finally:
        db.close()

if __name__ == "__main__":
    seed_data()