# RentMatch AI — Frontend (Sprint 1 & Sprint 2 Combined)

Complete, production-grade React (Vite) frontend implementing all deliverables for **Sprint 1 (User Authentication & Profile Management)** and **Sprint 2 (Property Listing & Management)** as specified in the project architecture, class diagrams, state machines, and Supabase relational schema.

---

## 🚀 Key Implementations

### Sprint 1: User Authentication & Profile Management
- **Role-Based Registration**:
  - Register as **Tenant / Renter** or **Property Lister / Landlord** (`UserRole` enum).
  - Validations: Unique email check, password strength verification (minimum 6 characters), required fields.
  - Matches the **Sprint 1 State Machine** (`Validating Registration` ➔ `User Registered` / `Registration Failed` ➔ `Retry`).
- **User Login & Google OAuth**:
  - Traditional Email + Password authentication with show/hide password toggle.
  - **"Continue with Google"** one-click sign-in flow (with Google user avatar and claims).
  - Quick-fill demo account buttons for seamless evaluator demonstration.
  - Matches the **Sprint 1 State Machine** (`Validating Login` ➔ `Authenticated` / `Login Failed`).
- **Stateless JWT Simulation**:
  - Generates and decodes signed claims containing `userId`, `role`, and `exp` timestamp.
  - Session stored and validated against `localStorage` with automatic expiry checks.
- **Role-Based Authorization & Protection**:
  - Restricts property creation, editing, and status toggles strictly to users with the `PROPERTY_LISTER` role.
  - Attempting unauthorized access triggers friendly **403 Forbidden** feedback.
- **Profile Management**:
  - **Viewing Profile**: View avatar, full name, role badge, contact phone, email, and member credentials.
  - **Editing Profile**: Real-time form to update name, phone, agency/company, and tenant search preferences (budget, BHK, target location).
  - **Password Change**: Change current password with old password verification and secure hash update.

---

### Sprint 2: Property Listing & Management
- **Create Property Listing (Draft ➔ Validating ➔ Insert Active)**:
  - Form with 4 structured sections:
    1. *Basic Info & Location*: Title, Property Type (Apartment, Studio, Villa, Floor, Penthouse), Bedrooms (BHK), Bathrooms, Area (sqft), Location.
    2. *Pricing & Terms*: Monthly Rent (₹), Security Deposit (₹), Furnishing status.
    3. *Amenities Checklist*: Balcony, Parking, Wi-Fi, Lift, Security, Gym, Garden, Pet Friendly, Study Nook, Power Backup, etc.
    4. *Photos & Description*: Curated photo presets with instant preview + custom image URL support + detailed description.
  - Strictly adheres to the **Sprint 2 State Diagram**:
    - Lister enters details (`Draft`)
    - Submits form ➔ Field validation checks (`Validating`)
    - Shows inline errors if rent <= 0 or fields invalid (`[invalid] / show errors`)
    - Inserts property as **`ACTIVE`** (`[valid] / INSERT property`)
- **View Property Listings (Public vs Owner Views)**:
  - **Public Feed (Explore Homes)**: Only displays **`ACTIVE`** listings. Inactive listings are hidden from tenants and casual visitors.
  - **Owner Dashboard (Profile ➔ My Listed Properties)**: Shows all owned listings (both Active and Inactive) with statistics (`Total`, `Active Live`, `Inactive Drafts`).
- **Edit Property Details (Owner Only)**:
  - Real-time edit modal for existing properties.
  - **`OwnershipChecker`**: Checks `property.listerId === currentUser.id`. If a non-owner attempts to edit, rejects with **403 Forbidden**.
- **Deactivate & Reactivate Property (Sprint 2 State Lifecycle)**:
  - Toggle between `ACTIVE` (visible on explore search) and `INACTIVE` (hidden from tenants).
  - Status updates reflect immediately on both the dashboard and public feed.
- **Delete Property Listing**:
  - Confirmation modal warning the user of permanent deletion (`delete [owner] / DELETE row`).
  - Removes row permanently from the database.

---

## 👥 Seed Demo Accounts (For Instant Evaluation)

| Role | Email | Password | Preloaded Data |
| :--- | :--- | :--- | :--- |
| **Property Lister** | `lister@rentmatch.ai` | `Lister@123` | Owns 4 pre-seeded listings (Sunlit 2BHK, Calm 2BHK, Studio, Inactive 2BHK) |
| **Tenant** | `tenant@rentmatch.ai` | `Tenant@123` | Pre-configured search preferences, saved shortlist |
| **Google Sign-In** | Any role | *One-click* | Click **Continue with Google Account** in modal |

*(Quick-login buttons are also provided directly inside the Sign-In modal for convenience!)*

---

## 💻 How to Run on Windows

1. Open PowerShell or Command Prompt in this folder.
2. If PowerShell script execution policy restricts `npm`, use `npm.cmd`:
   ```powershell
   npm.cmd install
   npm.cmd run dev
   ```
3. Open the localhost URL in your browser:
   ```
   http://localhost:5173/
   ```
4. To test a production build:
   ```powershell
   npm.cmd run build
   ```

---

## 📁 Monorepo Folder Structure

```
rentmatch-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.jsx             # Sprint 1 Login, Register, Google OAuth
│   │   │   ├── Navbar.jsx                # Responsive Navigation & User Dropdown
│   │   │   ├── PropertyCard.jsx          # Card with owner actions (Edit, Toggle, Delete)
│   │   │   ├── PropertyFormModal.jsx     # Sprint 2 Create & Edit listing form
│   │   │   ├── DeleteConfirmModal.jsx    # Sprint 2 Permanent deletion warning
│   │   │   ├── EnquiryModal.jsx          # Contact owner modal
│   │   │   └── ToastNotification.jsx     # Action feedback alerts
│   │   ├── constants/
│   │   │   └── initialData.js            # Roles, seed users & properties
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Global authentication state
│   │   ├── pages/
│   │   │   ├── HomePage.jsx              # Hero, AI search, role callout, featured
│   │   │   ├── ExplorePage.jsx           # Active listings feed, filters, sorting
│   │   │   ├── PropertyDetailsPage.jsx   # Detailed space specs, gallery, owner bar
│   │   │   ├── ProfilePage.jsx           # Sprint 1 Profile + Sprint 2 Lister Dashboard
│   │   │   └── ShortlistPage.jsx         # Saved properties collection
│   │   ├── services/
│   │   │   ├── authService.js            # JWT, Password Hasher, Auth & Profile Service
│   │   │   └── propertyService.js        # Property CRUD, OwnershipChecker, Validator
│   │   ├── App.jsx                       # Root application coordinator
│   │   ├── main.jsx                      # Vite React entry point
│   │   └── styles.css                    # Unified modern design system
│   └── package.json
```
