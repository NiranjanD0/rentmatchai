# RentMatch AI — Next.js Frontend (TypeScript)

Full Next.js (App Router) + TypeScript implementation of the RentMatch AI frontend, migrated from Vite/React. Implements all deliverables for **Sprint 1 (User Authentication & Profile Management)** and **Sprint 2 (Property Listing & Management)**.

---

## 🚀 Key Implementations

### Sprint 1: User Authentication & Profile Management
- **Role-Based Registration & Login**:
  - Register as **Tenant / Renter** or **Property Lister / Landlord** (`UserRole` type).
  - Validations: Unique email check, password strength verification (minimum 6 characters), required fields.
  - Matches the **Sprint 1 State Machine** (`Validating Registration` ➔ `User Registered` / `Registration Failed` ➔ `Retry`).
- **Google OAuth Simulation**:
  - One-click Google Sign-in with simulated OAuth token and claims.
  - Quick-fill demo account buttons for seamless evaluator testing.
- **Stateless JWT Simulation**:
  - Generates and decodes signed claims containing `userId`, `role`, and `exp` timestamp.
  - Persisted and validated in client storage with automatic expiry checks.
- **Role-Based Authorization & Protection**:
  - Restricts property creation, editing, and status toggles strictly to users with the `PROPERTY_LISTER` role.
  - Attempting unauthorized access triggers friendly **403 Forbidden** feedback.
- **Profile Management**:
  - Profile viewing, profile editing, and password change with hash verification.

---

### Sprint 2: Property Listing & Management
- **Create & Edit Property Listings**:
  - Full modal form with validations, price/deposit calculators, amenity picker, photo preset picker, and descriptions.
  - Adheres strictly to the **Sprint 2 State Diagram** (`Draft` ➔ `Validating` ➔ `Active`).
- **Public Feed vs. Lister Dashboard**:
  - Public Feed displays **Active** listings only.
  - Lister Dashboard (in Profile) displays both **Active** and **Inactive** properties with quick toggle switches, edit modals, and delete confirmations.
- **Ownership Enforcement**:
  - `OwnershipChecker` verifies only listing owners can edit, toggle, or delete their properties.

---

## 👥 Seed Demo Accounts

| Role | Email | Password | Preloaded Data |
| :--- | :--- | :--- | :--- |
| **Property Lister** | `lister@rentmatch.ai` | `Lister@123` | Owns 4 pre-seeded listings (Sunlit 2BHK, Calm 2BHK, Studio, Inactive 2BHK) |
| **Tenant** | `tenant@rentmatch.ai` | `Tenant@123` | Pre-configured search preferences, saved shortlist |
| **Google Sign-In** | Any role | *One-click* | Click **Continue with Google Account** in modal |

*(Quick-login buttons are also provided directly inside the Sign-In modal for convenience!)*

---

## 💻 How to Run

1. Open a terminal in `frontend/`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser:
   ```
   http://localhost:3000/
   ```
3. To create an optimized production build:
   ```bash
   npm run build
   npm run start
   ```

---

## 📁 Project Structure (Next.js App Router)

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # RootLayout with SEO metadata & Viewport
│   │   ├── RootClientLayout.tsx      # Shared client app layout (Navbar, Footer, Modals)
│   │   ├── providers.tsx             # Context Providers (Auth + Property)
│   │   ├── globals.css               # RentMatch AI Design System & Tailwind CSS
│   │   ├── page.tsx                  # / (Discover & Hero Home Route)
│   │   ├── explore/
│   │   │   └── page.tsx              # /explore (Active Listings Search & Filter Feed)
│   │   ├── results/
│   │   │   └── page.tsx              # /results (Explore Alias Route)
│   │   ├── properties/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # /properties/:id (Dynamic Property Details Route)
│   │   ├── shortlist/
│   │   │   └── page.tsx              # /shortlist (Saved Homes Route)
│   │   └── profile/
│   │       └── page.tsx              # /profile (User Profile & Lister Dashboard Route)
│   ├── components/
│   │   ├── AuthModal.tsx             # Sprint 1 Login, Register, Google OAuth
│   │   ├── Navbar.tsx                # App Router Navigation bar & User Menu
│   │   ├── PropertyCard.tsx          # Card with owner actions (Edit, Toggle, Delete)
│   │   ├── PropertyFormModal.tsx     # Sprint 2 Create & Edit listing form
│   │   ├── DeleteConfirmModal.tsx    # Sprint 2 Permanent deletion warning
│   │   ├── EnquiryModal.tsx          # Contact owner modal
│   │   └── ToastNotification.tsx     # Action feedback alerts
│   ├── constants/
│   │   └── initialData.ts            # Typed roles, models, seed users & properties
│   ├── context/
│   │   ├── AuthContext.tsx           # Global typed authentication state & session
│   │   └── PropertyContext.tsx       # Global properties, shortlist & modal coordinator
│   └── services/
│       ├── authService.ts            # JWT, Password Hasher, Auth & Profile Service
│       └── propertyService.ts        # Property CRUD, OwnershipChecker, Validator
├── package.json
├── tsconfig.json
└── next.config.ts
```
