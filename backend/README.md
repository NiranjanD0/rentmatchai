# RentMatch AI — Backend, Sprint 1 (Auth and users)

Scope: **FR-01** user registration/profile, **FR-02** preference capture, **NFR-04** security
(hashed passwords, JWT, role-based access). Listings, search, matching, maps and RAG come in later sprints.

Stack: FastAPI + Uvicorn · PostgreSQL · SQLAlchemy 2.0 · Alembic · PassLib (bcrypt) · PyJWT ·
OAuth2PasswordBearer · Pytest.

## 1. Install

Python 3.11+ is required.

```bash
cd rentmatch-ai/backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # Windows: copy .env.example .env
```

## 2. Set `DATABASE_URL`

The URL is read from the environment or from `backend/.env` (environment variables win). Use the
`postgresql+psycopg2://` scheme; plain `postgresql://` or `postgres://` URLs are converted automatically.

**Local PostgreSQL**

```bash
# create a database once, e.g.
createdb rentmatch
# backend/.env
DATABASE_URL=postgresql+psycopg2://<user>:<password>@localhost:5432/rentmatch
```

If you have Docker, a throw-away database is one command:

```bash
docker run -d --name rentmatch-db -e POSTGRES_USER=rentmatch -e POSTGRES_PASSWORD=rentmatch \
  -e POSTGRES_DB=rentmatch -p 5432:5432 postgres:16
```

**Supabase**

1. Supabase dashboard → *Project Settings → Database → Connection string*.
2. Copy the **Session pooler** URI (port 5432; it works on IPv4 networks).
3. Change the scheme to `postgresql+psycopg2://` and add `?sslmode=require`:

```bash
DATABASE_URL=postgresql+psycopg2://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require
```

If the password contains special characters (`@ : / % #` …) URL-encode them, e.g. with
`python -c "import urllib.parse; print(urllib.parse.quote('my@pass#1', safe=''))"`.

Also set a real `SECRET_KEY` in `.env`:

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

## 3. Create the tables with Alembic

Run these from the `backend/` folder:

```bash
alembic upgrade head        # creates users + user_preferences on an empty database
alembic current             # shows 0001_initial_users (head)
alembic history             # lists migrations
alembic downgrade base      # drops the Sprint 1 tables again (careful!)
```

When models change in a later sprint, create a new migration and review it before applying:

```bash
alembic revision --autogenerate -m "describe the change"
alembic upgrade head
alembic check               # "No new upgrade operations detected" = models and database match
```

Tables created by `0001_initial_users`:

| Table | Columns |
|---|---|
| `users` | `id`, `email` (unique), `hashed_password`, `full_name`, `role` (`renter` / `landlord` / `admin`, check constraint), `is_active`, `created_at`, `updated_at` |
| `user_preferences` | `id`, `user_id` (unique FK → `users.id`, `ON DELETE CASCADE`), `min_budget`, `max_budget`, `preferred_localities` (`VARCHAR[]`), `property_types` (`VARCHAR[]`), `min_bedrooms`, `updated_at` |

## 4. Run the API

```bash
uvicorn app.main:app --reload
```

Open <http://localhost:8000/docs>. Click **Authorize**, enter your email as *username* plus your
password, and Swagger will send the bearer token on every request.

Optional — create an admin (admins cannot self-register through the API):

```bash
python -m app.create_admin --email admin@rentmatch.ai --password "Admin@12345"
```

## 5. Endpoints (`/api/v1/auth`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/register` | – | Create a `renter` or `landlord`; returns access + refresh tokens and the user |
| POST | `/login` | – | JSON `{email, password}` login |
| POST | `/token` | – | OAuth2 password form (`username`, `password`), used by Swagger |
| POST | `/refresh` | – | Exchange a refresh token for a new token pair |
| POST | `/logout` | Bearer | Stateless logout (client discards tokens) |
| GET / PATCH | `/me` | Bearer | Read profile / update `full_name` |
| POST | `/me/change-password` | Bearer | Change password (requires the current one) |
| GET / PUT | `/me/preferences` | Bearer | Read (auto-created empty) / replace rental preferences |
| GET | `/users` | Bearer, admin | List users, optional `?role=` filter |
| GET | `/health` | – | Database connectivity check |

Security notes: passwords are hashed with bcrypt through PassLib (12 rounds); access tokens last
60 minutes and refresh tokens 7 days (configurable); tokens carry a `type` claim so a refresh token
cannot be used as an access token and vice versa; deactivated users get `403`.

## 6. Tests

The tests use a separate database from `TEST_DATABASE_URL` (default
`postgresql+psycopg2://rentmatch:rentmatch@localhost:5432/rentmatch_test`). It is created automatically
if the user has permission, and its tables are rebuilt with the real Alembic migration on every run.
**Never point it at your real or Supabase database.**

```bash
pytest -q
```

## Project layout

```text
backend/
├── app/
│   ├── main.py              FastAPI app, CORS, router, /health
│   ├── create_admin.py      CLI to create or promote an admin
│   ├── core/                config.py (pydantic-settings), database.py, security.py
│   ├── models/user.py       User, UserPreference
│   ├── schemas/             auth.py, user.py
│   └── api/                 deps.py (get_current_user, role guard), auth.py (routes)
├── migrations/              env.py, script.py.mako, versions/0001_initial_users.py
├── tests/                   conftest.py, test_auth.py
├── alembic.ini
├── requirements.txt
└── .env.example
```
