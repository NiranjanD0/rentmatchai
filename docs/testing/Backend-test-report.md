# RentMatch AI – Backend Test Report

| | |
|---|---|
| **Tested by** | Ayush Donga |
| **Date** | 01 Nov 2026 |
| **Area** | `backend/` (FastAPI, SQLAlchemy 2.1, Alembic, PostgreSQL, PassLib/bcrypt, python-jose) |
| **Base commit** | `3e0a8fe` (main) with the backend changes in this pull request |
| **Environment** | Windows 11, Python 3.12.10 (virtual environment), PostgreSQL 17.11 (local) |
| **Databases** | `rentmatch` – local development DB (migrations, live API tests)<br>`rentmatch_test` – throwaway DB used by pytest, rebuilt on every run |

## 1. Summary

| Check | Result |
|---|---|
| Pytest | ✅ **65 / 65 passed** (0 failed, 0 skipped) |
| Live API tests (running server + DB) | ✅ **34 / 36 passed** – the 2 remaining are a status-code decision (see 6) |
| OpenAPI generation | ✅ 10 paths, 15 operations, no duplicate operation IDs |
| Alembic migrations | ✅ Apply cleanly; models match the database |
| Dependency install / `pip check` | ✅ No problems |
| Python compilation | ✅ No errors |

## 2. API under test

| Method | Path | Access |
|---|---|---|
| POST | `/api/v1/register` | Public (role `tenant` or `landlord`) |
| POST | `/api/v1/login` | Public (OAuth2 form: `username` = email) |
| POST | `/api/v1/logout` | Public |
| POST | `/api/v1/google` | Public (Google ID token) |
| GET, PUT | `/api/v1/profile/` | Logged-in user |
| GET, PUT | `/api/v1/profile/preferences` | Logged-in user |
| GET | `/api/v1/properties/` | Public (filters + pagination) |
| POST | `/api/v1/properties/` | Landlord or admin |
| GET | `/api/v1/properties/{property_id}` | Public |
| PUT, DELETE | `/api/v1/properties/{property_id}` | Owner only |
| GET | `/`, `/health` | Public |

## 3. Automated tests (pytest)

Files: `backend/tests/conftest.py`, `backend/tests/test_auth.py` (28 tests), `backend/tests/test_properties.py` (37 tests).

| Area | What is covered | Tests | Result |
|---|---|---|---|
| Security helpers | bcrypt hashing, JWT subject and expiry (timezone-aware UTC), secrets read from central settings, default/short `SECRET_KEY` rejected in production | 4 | ✅ 4 passed |
| Registration | Default tenant role, landlord role, duplicate email (case-insensitive), password length 7 / 8 / 9, invalid email, blank names, `role=admin` rejected | 7 | ✅ 7 passed |
| Login and tokens | Successful login, wrong password, unknown email, missing field, inactive user, missing / garbage / expired / forged token, token of deleted user, logout | 6 | ✅ 6 passed |
| Google sign-in | Missing client ID fails safely, client ID read from settings, new user created as tenant (missing family name handled), unverified email rejected | 4 | ✅ 4 passed |
| Profile and preferences | Profile update, empty preferences, single preferences row per user, budget validation, privacy between users, cascade delete, health check | 7 | ✅ 7 passed |
| Property create and roles | Landlord ✅, admin ✅, tenant → 403, no token / bad token → 401 | 4 | ✅ 4 passed |
| Property validation | Rent 0 / negative, bedrooms negative, area 0 / negative, deposit negative, title empty / blank / >150 chars, empty description, invalid type / listing type / furnishing, latitude out of range, each required field missing, boundary values accepted | 21 | ✅ 21 passed |
| Property read | Get by ID, unknown ID → 404, invalid UUID → 422, list shows only published, filters (city, type, budget), pagination (default 10, `limit`, `skip`, limit bounds) | 5 | ✅ 5 passed |
| Property update / delete | Owner update (partial), update validation (negative, null, invalid status), other landlord / tenant / no token blocked, unknown ID → 404, owner delete, others cannot delete | 7 | ✅ 7 passed |
| **Total** | | **65** | **✅ 65 passed** |

Safety: the test fixtures only run against a database whose name ends in `_test` and that differs from `DATABASE_URL`; otherwise pytest stops before touching anything.

## 4. Live API tests

Run against `uvicorn app.main:app` with the local `rentmatch` database, using throwaway test accounts.

| ID | Case | Expected | Actual | Result |
|---|---|---|---|---|
| BE-L01 | `GET /health` | 200, database `ok` | 200, `ok` | ✅ |
| BE-L03 | Register tenant / landlord | 201 | 201 | ✅ |
| BE-L04 | Register duplicate email (different case) | 400 | 400 | ✅ |
| BE-L05 | 7-character password / invalid email / `role=admin` | 422 | 422 | ✅ |
| BE-L06a | Login with correct password | 200 + token | 200 + token | ✅ |
| BE-L06b | Login with wrong password | 401 | 400 | ⚠️ See 6.1 |
| BE-L06c | Login with unknown email | 401 | 400 | ⚠️ See 6.1 |
| BE-L07 | Profile with token / without / garbage token / update | 200 / 401 / 401 / 200 | as expected | ✅ |
| BE-L08 | Preferences GET / PUT | 200 / 200 | 200 / 200 | ✅ |
| BE-L09 | Create property as landlord / tenant / no token | 201 / 403 / 401 | as expected | ✅ |
| BE-L10 | Create with rent 0 / negative rent / negative bedrooms | 422 | 422 | ✅ |
| BE-L11 | Owner update / delete; other landlord update / delete; deleted property | 200 / 204 / 403 / 403 / 404 | as expected | ✅ |
| BE-L12 | Get by ID / unknown UUID / invalid UUID | 200 / 404 / 422 | as expected | ✅ |
| BE-L13 | City + budget filter; `limit=101` | listing returned / 422 | as expected | ✅ |
| BE-L15 | Logout | 200 | 200 | ✅ |
| BE-L16 | Google login with empty body | 422 | 422 | ✅ |
| | **Total** | | | **34 / 36** |

## 5. Other checks

| Check | Command | Result |
|---|---|---|
| Install dependencies | `pip install -r requirements.txt` | ✅ |
| Dependency consistency | `pip check` | ✅ No broken requirements |
| Compilation | `python -m compileall app tests scripts alembic` | ✅ |
| OpenAPI | `app.openapi()` | ✅ No warnings, no duplicate operation IDs |
| Migrations on empty DB | `alembic upgrade head` | ✅ `0001_initial_schema → 769d4e8016fe`, 10 tables |
| Model / DB drift | `alembic check` | ✅ No new upgrade operations |
| Admin script | `python -m app.create_admin` (on `rentmatch_test`) | ✅ Creates admin, re-run promotes existing user, short password rejected |
| Access control review | Owner checks on update/delete, role check on create, profile/preferences scoped to current user | ✅ No IDOR found |
| Foreign keys | Roles, preferences, saved items cascade on user delete; `properties.owner_id` is `RESTRICT` | ✅ |

## 6. Open items for the team

### 6.1 Login error status code
`/login` returns **400** for a wrong password or unknown email. The test plan expects **401**. FastAPI's own OAuth2 examples use 400, so both are acceptable – the team should pick one and document it in the API contract. The frontend should handle whichever is chosen.

### 6.2 Password minimum length (frontend)
The backend requires at least **8** characters. The frontend still checks for **6** in:
- `frontend/src/components/auth/signup-form.tsx`
- `frontend/src/components/auth/AuthModal.tsx`
- `frontend/src/app/profile/page.tsx`
- `frontend/src/services/authService.ts` (2 places)

These should be changed to 8 by the frontend team.

### 6.3 Production `SECRET_KEY`
With `ENVIRONMENT=production`, the API will not start unless `SECRET_KEY` is set to a random value of at least 32 characters. The deployment (Render / Railway) must define it. Generate one with:
```
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

### 6.4 Other observations
- There are two database setups: `app/core/database.py` (used by the API) and `app/db/session.py` + `app/db/base.py` (`Base` used by the models). `app/db/session.py` is unused. Recommended to merge them in a separate clean-up.
- `scripts/seed_listings.py` needs `user@example.com` to be registered first, does not give that user the landlord role, and adds 5 listings (the plan asks for 100–300).
- `updated_at` on users and properties is not updated when records change.
- `starlette.testclient` shows a deprecation warning about `httpx`; it does not affect results.

## 7. Not tested
- Real Google sign-in with a live Google ID token (needs a Google OAuth client ID). Covered with mocked token verification.
- Frontend ↔ backend integration (the frontend does not call the API yet).
- Shared / production databases (intentionally not used).
- Load and performance testing.

## 8. How to run the tests
1. Create a local PostgreSQL user once (pgAdmin → Query Tool on your **local** server, run each line separately):
   ```sql
   CREATE ROLE rentmatch LOGIN PASSWORD 'rentmatch' CREATEDB;
   CREATE DATABASE rentmatch OWNER rentmatch;
   ```
2. Create `backend/.env` from `.env.example` (never commit it) and set `DATABASE_URL` to your local database. `TEST_DATABASE_URL` defaults to `postgresql+psycopg2://rentmatch:rentmatch@localhost:5432/rentmatch_test`; pytest creates and resets it automatically.
3. From `backend/`:
   ```
   pip install -r requirements.txt
   alembic upgrade head
   pytest -q
   ```
