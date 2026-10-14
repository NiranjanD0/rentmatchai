# RentMatchAI

### AI Powered Personalized Rental Assistant

IT314 Software Engineering | Group 7 | Dhirubhai Ambani University

RentMatchAI is an AI powered rental assistance platform that helps students, working professionals and families find rental homes that truly match their needs, budget, lifestyle and commute. Instead of depending only on traditional filters, users describe their ideal home in plain language, and the system turns it into clear preferences. It then recommends and ranks suitable properties, explaining why each one fits. During visits, it also generates personalized questions that users can ask the landlord.

## Table of Contents

* [Project Overview](#project-overview)
* [Problem Statement](#problem-statement)
* [Proposed Solution](#proposed-solution)
* [Objectives](#objectives)
* [Target Users](#target-users)
* [Key Features](#key-features)
* [How RentMatchAI Works](#how-rentmatchai-works)
* [System Workflow](#system-workflow)
* [Project Scope](#project-scope)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Agile Scrum Methodology](#agile-scrum-methodology)
* [Team](#team)
* [GitHub Collaboration](#github-collaboration)
* [Communication](#communication)
* [Development Setup](#development-setup)
* [Environment Variables](#environment-variables)
* [Future Enhancements](#future-enhancements)
* [License](#license)

## Project Overview

Finding a suitable rental property is difficult because users usually have many requirements that normal search filters cannot capture. A user may care about:

* Monthly rent and security deposit
* Property type and number of bedrooms
* Furnishing and amenities
* Location and distance from college or workplace
* Commute time and transport availability
* Parking
* Lifestyle preferences
* Suitability for students, professionals or families

RentMatchAI simplifies this by letting users explain their requirements naturally and receive personalized, explainable recommendations.

### Example

A user can enter:

> "I am a student looking for a furnished 1 BHK near my university. My budget is around ₹15,000 per month and I don't have a vehicle, so I would prefer a place with good public transport and a short commute."

RentMatchAI understands the request and extracts the preferences:

```text
User Type       : Student
Property Type   : 1 BHK
Budget          : ₹15,000 per month
Furnishing      : Furnished
Transportation  : Public Transport
Commute         : Short
Location        : Near University
```

## Problem Statement

Renters today face several problems when searching for a home:

* Property websites depend on fixed filters and cannot understand needs written in everyday language.
* Important factors such as commute time, nearby transport and lifestyle fit are hard to search for and compare.
* Users spend a lot of time checking many listings that do not really suit them.
* Most platforms do not explain why a property is recommended, so users cannot trust the ranking.
* Many renters do not know what to ask the landlord during a visit and miss important points such as deposit rules, maintenance, water, electricity or restrictions.
* Property listers have no simple way to publish and manage their listings and reach the right tenants.

There is a need for a rental platform that understands what the user wants, matches it with real property data, and guides the user until the final decision.

## Proposed Solution

RentMatchAI combines a structured property database with AI assistance:

* Users type their requirement in natural language, and an LLM converts it into structured preferences.
* Plain, tested code filters, scores and ranks the properties, so results are explainable and consistent.
* Google Maps data adds location, nearby places and commute time to every recommendation.
* The AI writes a short explanation of why each property matches.
* A question generator prepares property specific questions for landlord visits.
* A RAG assistant answers questions about a property using only the information in its listing.
* Property listers can register, publish and manage their own listings.

## Objectives

* Allow users to search for homes in their own words.
* Recommend properties based on budget, location, commute and lifestyle.
* Explain every recommendation clearly.
* Help users prepare for property visits with useful questions and checklists.
* Give property listers a simple way to manage their listings.
* Build a secure, tested and well documented system by following Agile Scrum and good Git practice.

## Target Users

* **Tenants:** students, working professionals and families searching for a rental home.
* **Property Listers:** owners and managers who publish and maintain rental properties.

## Key Features

* User registration, login and logout with JWT and role based access
* Profile management for tenants and property listers
* Property listing creation, editing and removal for property listers
* Filters for rent, location, bedrooms and amenities with pagination
* Google Maps view with markers, nearby places, commute time and distance
* Natural language search with a manual filter fallback
* Search history
* Match score ranking with a "why this matches" explanation
* Shortlist and side by side comparison of properties
* Landlord question generator, visit checklist and saved notes
* RAG chat assistant that answers from listing data and shows its sources

## How RentMatchAI Works

1. The user describes the ideal home in a sentence or fills the manual filters.
2. The LLM extracts structured preferences, and the user can review and correct them.
3. The backend filters properties from the database using these preferences and Google Maps data.
4. The matching service scores and ranks the properties.
5. The user sees ranked results with a clear explanation for each one.
6. The user saves, compares and asks questions about properties.
7. The system generates questions for the landlord and helps the user note down visit details.

## System Workflow

```text
User (Tenant)
    |
    v
React Frontend  <------>  Google Maps Platform
    |
    v
FastAPI Backend
    |-- Auth (JWT, Google OAuth)
    |-- Listings and Search APIs
    |-- Matching Service (scoring and ranking)
    |-- AI Module (LLM parsing, explanations, questions, RAG)
    |
    v
PostgreSQL (PostGIS and pgvector)
```

Business logic stays in the services layer of the backend, and every LLM call goes through the single AI module so models can be changed without rewriting other code.

## Project Scope

### In Scope

* Authentication and role based authorization
* Property listing management
* Filters, maps, commute and nearby places
* Natural language search and matching
* Shortlist, comparison and landlord question generation
* RAG assistant over listing data
* Testing, deployment and documentation

### Out of Scope

* Online payments and rent collection
* Rental agreement generation and e signing
* Scraping data from third party property websites
* Mobile native applications
* Real time chat between tenants and listers

The project uses a synthetic dataset of 100 to 300 listings, because real listing websites usually forbid scraping.

## Technology Stack

* **Frontend:** React (Vite) and Tailwind CSS
* **Backend:** Python and FastAPI
* **Database:** PostgreSQL with PostGIS and pgvector
* **ORM and Migrations:** SQLAlchemy and Alembic
* **Authentication:** JWT (custom in FastAPI) and Google OAuth
* **Maps and Location:** Google Maps Platform (Maps JS, Places, Geocoding, Distance Matrix)
* **Natural Language Search:** LLM API (Gemini or similar) with structured JSON output
* **RAG:** LangChain or LlamaIndex, pgvector and embeddings
* **Testing:** Pytest and HTTPX for backend, Vitest and React Testing Library for frontend, Playwright for end to end tests, Postman and Swagger for API checks
* **DevOps:** Docker, docker compose and GitHub Actions
* **Deployment:** Vercel or Netlify (frontend), Render or Railway (backend), Supabase or Neon (database)
* **Planning and Design:** GitHub Projects, Figma, draw.io, Google Docs or Notion

## Project Structure

```text
RentMatch-AI-/
├── .github/
│   ├── workflows/            # CI: lint and test on every pull request
│   ├── pull_request_template.md
│   ├── ISSUE_TEMPLATE/
│   └── CODEOWNERS
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/         # API calls
│   │   ├── hooks/
│   │   └── utils/
│   ├── tests/
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── api/              # route handlers
│   │   ├── core/             # config, security, settings
│   │   ├── models/           # database models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # business logic
│   │   ├── ai/               # LLM client, prompts, RAG
│   │   └── main.py
│   ├── migrations/           # Alembic migrations
│   ├── tests/
│   └── requirements.txt
├── database/
│   └── seed/                 # seed scripts and sample data
├── docs/
│   ├── requirements/         # SRS, user stories
│   ├── design/               # architecture, ER diagram, wireframes
│   ├── sprints/              # plan, review and retrospective per sprint
│   └── testing/              # test plan and test cases
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Agile Scrum Methodology

The project is delivered in 9 sprints as below:

* **Sprint 0, Foundation and Planning:** SRS, user stories, backlog, diagrams, wireframes, repository, CI and a working skeleton
* **Sprint 1, User Authentication and Profile Management:** registration, login, JWT, role based access and profiles
* **Sprint 2, Property Listing and Management:** create, view, edit and delete listings with ownership checks
* **Sprint 3, Search, Filters and Google Maps:** filters, pagination, map markers, nearby places and commute
* **Sprint 4, Natural Language Search:** LLM parser, search box, fallback and query history
* **Sprint 5, Matching and Shortlist:** match score, explanations, save and compare
* **Sprint 6, Landlord Question Generator:** generated questions, visit checklist and notes
* **Sprint 7, RAG Integration:** document ingestion, embeddings and chat assistant with sources
* **Sprint 8, Hardening and Release:** testing, security, performance, deployment, final report and demo

### Scrum Practices

* **Sprint Planning:** on the first day of each sprint
* **Daily Stand up:** 15 minutes, or asynchronous in the team chat
* **Sprint Review:** on the last day, demo from the main branch
* **Retrospective:** after the review

### Definition of Done

A task is done only when the code is merged into develop through an approved pull request, CI passes, the acceptance criteria are met, tests are written, documentation is updated and the issue is moved to Done.

## Team

**Course:** IT314 Software Engineering
**Group:** 7
**Institute:** Dhirubhai Ambani University
**Repository:** https://github.com/tasvibhalani/RentMatch-AI-

| Student ID | Name |
| --- | --- |
| 202401011 | Akshay Das |
| 202401027 | Bhalani Tasvi Vijay |
| 202401034 | Bhuva Shyam Vikrambhai |
| 202401037 | Chavda Naitik Arjunbhai |
| 202401042 | Dangi Niranjan Rajubhai |
| 202401049 | Dharmesh Upadhyay |
| 202401052 | Donga Ayush Lalitbhai |
| 202401069 | Hitansh |
| 202401071 | Jadeja Yashrajsinh Dhvjvandansinh |

## GitHub Collaboration

### Branches

* **main:** stable, demo ready code, updated only at the end of each sprint
* **develop:** integration branch where finished features come together
* **feature/sprint short name:** new functionality, for example feature/s2 listing filters
* **fix/short name:** bug fixes
* **docs/short name:** documentation changes
* **hotfix/short name:** urgent fixes to main, rare

### Rules

* No direct push to main or develop. Every change goes through a pull request.
* At least 1 approval is needed, and backend and auth changes need 2 approvals.
* CI must pass before merging.
* Keep pull requests small, preferably under 300 lines, and link each one to an issue.
* Never approve your own pull request.
* Do not force push to shared branches.
* Never commit API keys, passwords or personal data.

### Commit Message Format

```text
feat: add login endpoint
fix: correct map marker position
docs: update SRS with commute requirement
test: add auth token expiry tests
refactor: move matching logic to services
chore: update docker compose
```

### Task Tracking

Tasks are tracked as GitHub issues on a GitHub Projects board with the columns Backlog, Sprint Backlog, In Progress, In Review and Done. Each issue has a sprint milestone and a label such as frontend, backend, docs, testing, maps, auth or bug.

## Communication

* Daily updates and quick discussions in the team chat
* Sprint planning, review and retrospective meetings once per sprint
* Meeting minutes and sprint notes saved in docs/sprints
* Blockers are reported in the daily stand up, and reviewers reply to pull requests within 24 hours

## Development Setup

### Prerequisites

* Git
* Docker and docker compose
* Node.js (for running the frontend outside Docker)
* Python 3.11 or above (for running the backend outside Docker)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/tasvibhalani/RentMatch-AI-.git
cd RentMatch-AI-

# 2. Create your environment file
cp .env.example .env
# then fill in the values

# 3. Start the database and API
docker compose up --build

# 4. Seed sample property data
# (see database/seed for the seed script)

# 5. Start the frontend
cd frontend
npm install
npm run dev
```

### Running Tests

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your own values. The real `.env` file must never be committed.

```text
DATABASE_URL=
JWT_SECRET_KEY=
JWT_ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_MAPS_API_KEY=
LLM_API_KEY=
VITE_API_BASE_URL=
VITE_GOOGLE_MAPS_KEY=
```

## Future Enhancements

* Real listing data through official partnerships or APIs
* Multi language search, including Hindi and Gujarati
* In app messaging between tenants and property listers
* Rental agreement help and document checklist
* Neighbourhood safety and cost of living insights
* Mobile application
* Notifications for new properties that match saved searches

## License

This project is developed for academic purposes as part of the IT314 Software Engineering course. A formal license can be added here if the project is made public.
