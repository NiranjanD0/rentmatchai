# RentMatchAI

<div align="center">
  <img src="./frontend/public/rentmatch-logo.webp" alt="RentMatchAI Logo" width="120">

  <strong>AI-Powered Personalized Rental Assistant</strong>

  <img src="https://img.shields.io/badge/AI-Powered-7C3AED?style=for-the-badge&labelColor=101418" alt="AI Powered">
  <img src="https://img.shields.io/badge/Next.js-16.4-FFFFFF?style=for-the-badge&labelColor=101418&logo=next.js&logoColor=FFFFFF" alt="Next.js 16">
  <img src="https://img.shields.io/badge/FastAPI-0.115%2B-009688?style=for-the-badge&labelColor=101418&logo=fastapi&logoColor=009688" alt="FastAPI">
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-9CCBFB?style=for-the-badge&labelColor=101418&logo=postgresql&logoColor=9CCBFB" alt="PostgreSQL and Supabase">

</div>

---

## Overview

**RentMatchAI** transforms rental property hunting by replacing traditional, rigid search filters with natural language requirement matching. Instead of checking endless checkbox combinations, tenants express their living preferences, daily commute requirements, budget, and lifestyle in everyday language. 

RentMatchAI extracts structured parameters, scores properties using explainable match algorithms, maps locations with Google Maps geospatial data, and equips prospective tenants with intelligent, property-specific question checklists for landlord visits.

---

## Key Highlights & Implemented Features

### Sprint 1: Authentication & User Management
- **Role-Based Access Control (RBAC):** Distinct roles for **Tenant (Renter)** and **Property Lister (Landlord)**, plus an administrative role.
- **Secure Authentication Pipeline:** Password hashing via bcrypt (PassLib), signed stateless JWT access tokens (60-minute expiry) and refresh tokens (7-day validity).
- **Profile & Preference Capture:** Endpoints to manage user profile information, contact preferences, and rental criteria (budget limits, preferred localities, bedroom counts).
- **Admin Provisioning:** Dedicated CLI utility (`backend/app/create_admin.py`) for initializing administrative accounts.

### Sprint 2: Property Listings & Management
- **Property Lifecycle Management:** Create, read, update, and toggle listings through draft, validation, and active publication states.
- **Owner Verification & Permissions:** Strict ownership verification guaranteeing only the authorized lister can modify or delete listings.
- **Search & Discovery Feed:** Filterable public catalog for active listings, coupled with a private dashboard for listers to manage all active and inactive inventory.
- **Interactive Modals:** Validated form dialogs for property creation, price-deposit computation, amenity selection, image presets, and deletion safeguards.

### Intelligent Assistance (In Progress & Architecture)
- **Natural Language Parsing:** Conversational extraction transforming text prompts (e.g., *"Furnished 1 BHK near university under ₹15,000 with quick commute"*) into structured database query filters.
- **Explainable Match Scoring:** Direct, transparent scoring showing tenants exactly why and how well a listing matches their constraints.
- **Commute & Neighborhood Intelligence:** Integration with Google Maps Platform (Places, Geocoding, Distance Matrix) for transit times and local amenity proximity.
- **Landlord Question Checklist:** Dynamic question generation highlighting security deposit policies, maintenance obligations, utility metering, and lease restrictions.
- **Grounded Listing RAG:** In-context AI assistant strictly answering tenant questions based on listing specifications and disclosures.

---

## Architecture & System Workflow

```text
[ Tenant / Property Lister ]
             │
             ▼
   [ Next.js 16 Frontend ] ◄────────────► [ Google Maps Platform ]
    (App Router, Tailwind,                 (Places, Distance Matrix,
     shadcn/ui, TypeScript)                 Geocoding & Street Map)
             │
             ▼ (RESTful API / JSON)
   [ FastAPI Backend Service ]
     ├── Authentication (JWT, PassLib bcrypt, RBAC)
     ├── Listings & Inventory Management API
     ├── User Profile & Preference Service
     ├── Property Scoring & Matching Engine
     └── AI Integration Module (LLM Parser, RAG, Visit Prompts)
             │
             ▼ (SQLAlchemy 2.0 ORM & Alembic Migrations)
   [ PostgreSQL / Supabase ]
     ├── Core Tables (users, user_preferences, properties)
     └── Extensions (PostGIS geospatial indexing, pgvector embeddings)
```

---

## Technology Stack

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Frontend Framework** | Next.js 16.4 (App Router), React 19, TypeScript |
| **Styling & Components** | Tailwind CSS v4, shadcn/ui, Radix UI, Lucide Icons, Framer Motion |
| **Backend Framework** | Python 3.11+, FastAPI, Uvicorn ASGI Server |
| **Database & ORM** | PostgreSQL 16 / Supabase, SQLAlchemy 2.0, Alembic Migrations |
| **Security & Auth** | OAuth2 Bearer, PyJWT, PassLib (bcrypt), Pydantic Settings |
| **Geospatial & Maps** | Google Maps Platform (Maps JavaScript API, Places, Geocoding) |
| **AI & Retrieval** | Google Gemini / OpenAI APIs, LangChain, pgvector |
| **Testing & Quality** | Pytest, HTTPX, ESLint |

---

## Seed & Demo Accounts

For evaluator convenience and quick testing, pre-configured accounts are available:

| Role | Email | Password | Access / Purpose |
| :--- | :--- | :--- | :--- |
| **Property Lister** | `lister@rentmatch.ai` | `Lister@123` | Full lister dashboard, manage 4 pre-seeded listings, edit/delete inventory |
| **Tenant** | `tenant@rentmatch.ai` | `Tenant@123` | Browse public feed, view match details, manage shortlisted properties |
| **Administrator** | `admin@rentmatch.ai` | `Admin@12345` | Provisioned via CLI (`python -m app.create_admin`), user administration |

*(Quick-login shortcuts are also embedded directly within the frontend authentication modal).*

---

## Core API Endpoints

The FastAPI backend exposes versioned REST endpoints under `/api/v1`:

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register a new tenant or property lister account |
| `POST` | `/api/v1/auth/login` | Public | Authenticate with JSON credentials, returns JWT tokens |
| `POST` | `/api/v1/auth/token` | Public | OAuth2 password form authentication for Swagger docs |
| `POST` | `/api/v1/auth/refresh` | Public | Exchange refresh token for a new access token pair |
| `POST` | `/api/v1/auth/logout` | Bearer Token | Invalidate current client session |
| `GET` | `/api/v1/auth/me` | Bearer Token | Retrieve currently authenticated user profile |
| `PATCH` | `/api/v1/auth/me` | Bearer Token | Update user profile attributes (full name, phone) |
| `POST` | `/api/v1/auth/me/change-password` | Bearer Token | Securely update password with previous password verification |
| `GET` | `/api/v1/auth/me/preferences` | Bearer Token | Retrieve tenant search preferences |
| `PUT` | `/api/v1/auth/me/preferences` | Bearer Token | Replace or create tenant search preferences |
| `GET` | `/api/v1/auth/users` | Bearer (Admin) | List all registered users with optional role filtering |
| `GET` | `/api/v1/properties/` | Public | List active properties with optional pagination & filters |
| `POST` | `/api/v1/properties/` | Bearer (Lister) | Create a new rental property listing |
| `GET` | `/api/v1/properties/{id}` | Public | Retrieve detailed property specification by ID |
| `PUT` | `/api/v1/properties/{id}` | Bearer (Owner) | Modify existing property details |
| `DELETE` | `/api/v1/properties/{id}` | Bearer (Owner) | Remove a property listing |
| `GET` | `/api/v1/health` | Public | Database and system health check probe |

Interactive documentation is available at `http://localhost:8000/docs` (Swagger UI) and `http://localhost:8000/redoc`.

---

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js 18+](https://nodejs.org/) & npm
- [Python 3.11+](https://www.python.org/)
- PostgreSQL 16 (local installation, Docker container, or Supabase project)

### 1. Clone the Repository

```bash
git clone https://github.com/NiranjanD0/rentmatchai.git
cd rentmatchai
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and SECRET_KEY

# Run database migrations
alembic upgrade head

# (Optional) Seed sample listings and create admin
python scripts/seed_listings.py
python -m app.create_admin --email admin@rentmatch.ai --password "Admin@12345"

# Start backend server
uvicorn app.main:app --reload --port 8000
```

The backend API will be live at `http://localhost:8000`.

### 3. Frontend Setup

In a new terminal window:

```bash
cd frontend

# Install Node dependencies
npm install

# Start Next.js development server
npm run dev
```

Open `http://localhost:3000` in your browser.

### 4. Running Tests

```bash
# Execute backend test suite
cd backend
pytest -v

# Run frontend lint check
cd frontend
npm run lint
```

---

## Environment Variables

### Backend Configuration (`backend/.env`)

```ini
# Database Connection (Local PostgreSQL or Supabase Session Pooler)
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/rentmatch

# Security & JWT
SECRET_KEY=your-super-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7

# Testing Database
TEST_DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/rentmatch_test

# External Integrations (Planned / Ongoing)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend Configuration (`frontend/.env.local`)

```ini
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

---

## Project Structure

```text
rentmatchai/
├── .agents/                      # Workflow rules, style guidelines, and agent instructions
│   └── rules/                    # Guardrails for git workflow, ponytail dev, and architecture
├── backend/                      # FastAPI application
│   ├── alembic/                  # Database migration scripts
│   │   ├── versions/             # Versioned schema migrations
│   │   ├── env.py                # Alembic migration runner configuration
│   │   └── script.py.mako        # Migration template
│   ├── app/                      # Application source package
│   │   ├── api/                  # API routes (auth, properties, profile, deps)
│   │   ├── core/                 # App configuration, security, and database session
│   │   ├── db/                   # SQLAlchemy declarative models and session logic
│   │   ├── schemas/              # Pydantic request and response schemas
│   │   ├── create_admin.py       # Administrative account bootstrap script
│   │   └── main.py               # FastAPI entrypoint, middleware, and CORS configuration
│   ├── scripts/                  # Standalone database seeding utilities
│   ├── tests/                    # Pytest test suites (test_auth, fixtures)
│   ├── alembic.ini               # Alembic configuration file
│   └── requirements.txt          # Python package dependencies
├── docs/                         # Academic and engineering documentation
│   ├── Requirements.md           # Software Requirements Specification (SRS)
│   ├── Sprints.md                # Sprint planning logs and backlog status
│   ├── BACKEND_TESTING_REPORT.md # Test execution results
│   └── *.pdf / *.png             # Sprint state machines, class diagrams, and ER schemas
├── frontend/                     # Next.js 16 (App Router) TypeScript web client
│   ├── public/                   # Static assets (logos, favicons, site webmanifest)
│   ├── src/                      # Client application source code
│   │   ├── app/                  # App Router routes and pages
│   │   │   ├── layout.tsx        # Root HTML layout and viewport metadata
│   │   │   ├── page.tsx          # Homepage and hero landing page
│   │   │   ├── explore/          # Property search and feed route
│   │   │   ├── properties/[id]/  # Individual listing detail view route
│   │   │   ├── shortlist/        # Saved tenant properties route
│   │   │   └── profile/          # User profile and lister inventory dashboard
│   │   ├── components/           # Modular UI components (auth, property, layout)
│   │   ├── constants/            # Initial state fixtures and role definitions
│   │   ├── context/              # React state providers (AuthContext, PropertyContext)
│   │   ├── hooks/                # Custom React hooks (toast alerts, mobile detectors)
│   │   └── services/             # Client-side API and auth service layers
│   ├── next.config.ts            # Next.js build and runtime settings
│   ├── package.json              # Client dependencies and build scripts
│   └── tsconfig.json             # TypeScript configuration
├── .gitignore                    # Git exclusions
└── README.md                     # Main repository documentation
```

---

## Team · Group 7

**Course:** IT314 Software Engineering — Dhirubhai Ambani University

| Student ID | Name |
| :--- | :--- |
| 202401011 | Akshay Das |
| 202401027 | Bhalani Tasvi Vijay |
| 202401034 | Bhuva Shyam Vikrambhai |
| 202401037 | Chavda Naitik Arjunbhai |
| 202401042 | Dangi Niranjan Rajubhai |
| 202401049 | Dharmesh Upadhyay |
| 202401052 | Donga Ayush Lalitbhai |
| 202401069 | Hitansh |
| 202401071 | Jadeja Yashrajsinh Dhvjvandansinh |

---

## Contribution & Workflow

- **Branching Model:** Branch from `develop` using `feature/<name>` or `fix/<name>`. Keep pull requests small and focused, ideally under 300 lines.
- **Commit Style:** Use Conventional Commits such as `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, and `chore:`.
- **Reviews:** Require at least one approval, two for core authentication/backend changes, and passing CI tests before merging.

---

## License

Developed for academic purposes as part of the IT314 Software Engineering course curriculum.
