# Contributing to RentMatchAI

Thank you for your interest in contributing to **RentMatchAI**! Whether you are implementing new features, fixing bugs, writing tests, or improving documentation, this guide outlines the workflow, coding standards, and review processes to keep our codebase clean and maintainable.

---

## Table of Contents

1. [Branching Strategy](#branching-strategy)
2. [Commit Conventions](#commit-conventions)
3. [Local Development Setup](#local-development-setup)
4. [Coding Standards & Guardrails](#coding-standards--guardrails)
5. [Testing & Quality Assurance](#testing--quality-assurance)
6. [Pull Request & Review Process](#pull-request--review-process)

---

## Branching Strategy

To maintain a stable `main` branch, all development work must occur on dedicated short-lived branches.

- **No Direct Commits on Main:** Never make or push commits directly to `main` or `master`.
- **Pre-Change Sync:** Always pull the latest updates from remote with rebase before branching:
  ```bash
  git checkout main
  git pull --rebase origin main
  ```
- **Branch Naming Conventions:** Create task-specific branches using clear prefixes:
  - `feat/<task-name>`: New feature or enhancement (e.g., `feat/search-filter`, `feat/inbox-chat`)
  - `fix/<bug-name>`: Bug fix (e.g., `fix/auth-token-refresh`, `fix/listing-modal`)
  - `docs/<topic>`: Documentation updates (e.g., `docs/api-specs`, `docs/contributing-guide`)
  - `chore/<task>`: Tooling, dependency, or configuration updates (e.g., `chore/gitignore-cleanup`)
  - `test/<scope>`: Adding or modifying test suites (e.g., `test/property-endpoints`)
- **Scope Limit:** Keep pull requests focused and small, ideally under 300 lines of changes.

---

## Commit Conventions

We strictly follow [Conventional Commits](https://www.conventionalcommits.org/) to generate clean commit histories and facilitate release notes.

### Format
```text
<type>(<scope>): <short summary in imperative mood>

[optional body explaining motivation and context]

[optional footer(s), e.g., Closes #12]
```

### Allowed Types
| Type | Description | Example |
| :--- | :--- | :--- |
| `feat` | New feature or functional enhancement | `feat(property): add amenity selection modal` |
| `fix` | Bug fix in existing functionality | `fix(auth): handle expired token redirect correctly` |
| `docs` | Documentation changes only | `docs(readme): add contributing guide link` |
| `style` | Formatting or styling changes without logic impact | `style(inbox): format tailwind class ordering` |
| `refactor` | Code restructuring without feature or bug changes | `refactor(db): streamline database session dependency` |
| `perf` | Performance optimization | `perf(search): add index for property price filtering` |
| `test` | Adding missing tests or refactoring test suites | `test(auth): add edge case tests for duplicate email` |
| `chore` | Maintenance, dependencies, or configuration changes | `chore(deps): update pnpm lockfile` |

---

## Local Development Setup

### 1. Prerequisites
- **Git**
- **Python 3.11+**
- **Node.js 18+** & **pnpm** (or npm)
- **PostgreSQL 16** (local instance or Supabase project)

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
# Edit .env with your DATABASE_URL, SECRET_KEY, etc.

# Run migrations & seed data
alembic upgrade head
python scripts/seed_listings.py

# Start development server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies (pnpm recommended)
pnpm install

# Configure environment variables
cp .env.example .env.local 2>/dev/null || true
# Ensure NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 is set

# Start Next.js development server
pnpm dev
```

---

## Coding Standards & Guardrails

### 1. Architectural Guardrails
- **No Mock Data:** Strictly avoid hardcoded mock arrays or placeholder collections in production code. Always implement real data integration patterns, API contracts, or model mappings.
- **End-to-End Implementation:** When adding features, complete the entire pipeline:
  `Database Schema / Migration` ➔ `Backend Controller / API Endpoint` ➔ `Frontend Service Layer` ➔ `shadcn/ui View Component`.
- **UI Components:** Exclusively use [shadcn/ui](https://ui.shadcn.com/) components and Tailwind CSS for styling and UI elements.
- **Database Safety:** Never write operations or scripts that delete database records without explicit user confirmation and safety checks.

### 2. Lazy Senior Dev Principle
- Solve problems with the minimum necessary code. Deletion beats addition.
- Avoid speculative abstractions, unnecessary wrappers, or premature configuration options.
- Maintain existing error handling and trust boundary validation.

---

## Testing & Quality Assurance

All changes must pass automated checks before being submitted for review.

### Backend Tests
```bash
cd backend
pytest -v
```

### Frontend Linting & Type Checking
```bash
cd frontend
pnpm run lint
```

---

## Pull Request & Review Process

1. **Verify Locally:** Ensure all tests pass and your branch is rebased on latest `main`.
2. **Open Pull Request:**
   - Set a descriptive PR title using Conventional Commits format.
   - Describe what changed, why the change was made, and how you verified it.
   - Link any related GitHub issues.
3. **Review Requirements:**
   - At least **one peer approval** is required for standard changes.
   - **Two approvals** are mandatory for core authentication or database schema modifications.
   - CI automated checks must pass without warnings or errors.
4. **Merge & Clean Up:**
   - Prefer squashing or rebasing as determined by the repository maintainer.
   - Delete your feature branch after merging to maintain repository hygiene.
