"""Create (or promote) an admin account. Admins cannot self-register through the API.

Usage (from the backend folder, after `alembic upgrade head`):
    python -m app.create_admin --email admin@rentmatch.ai --password "Admin@12345" --name "RentMatch Admin"
"""
import argparse

from sqlalchemy import func, select

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User, UserRole


def main() -> None:
    parser = argparse.ArgumentParser(description="Create or promote an admin user")
    parser.add_argument("--email", required=True)
    parser.add_argument("--password", required=True)
    parser.add_argument("--name", default="RentMatch Admin")
    args = parser.parse_args()
    if len(args.password) < 8:
        raise SystemExit("Password must be at least 8 characters")

    email = args.email.strip().lower()
    with SessionLocal() as db:
        user = db.scalar(select(User).where(func.lower(User.email) == email))
        if user is None:
            user = User(email=email, hashed_password=hash_password(args.password), full_name=args.name,
                        role=UserRole.ADMIN.value, is_active=True)
            db.add(user)
            action = "Created"
        else:
            user.role = UserRole.ADMIN.value
            user.hashed_password = hash_password(args.password)
            user.is_active = True
            action = "Promoted"
        db.commit()
        print(f"{action} admin {email} (id={user.id})")


if __name__ == "__main__":
    main()
