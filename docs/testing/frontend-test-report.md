# RentMatch AI – Frontend Test Report

| | |
|---|---|
| **Tested by** | Naitik Chavda – Testing team |
| **Date** | 01 Nov 2026 |
| **Commit tested** | `3e0a8fe` (main) – "feat(ui): implement shadcn skeleton loaders across data views" |
| **Area** | `frontend/` (Next.js 16.4.3, React 19.3, Tailwind 4) |
| **Environment** | Windows 11, Node v26.13.0, npm 11.20.0, `npm run dev` on http://localhost:3000 |
| **Test types** | Static checks (lint, TypeScript, production build), manual UI testing in browser (desktop + 375px mobile) |
| **Test data** | Demo accounts from `src/constants/initialData.ts` (tenant + lister) |

## 1. Summary

| Result | Count |
|---|---|
| Test cases executed | 22 |
| Passed | 13 |
| Failed | 7 |
| Not implemented (placeholder pages) | 2 |
| Bugs logged | 9 |

**Overall:** The UI builds and most pages render well, but the frontend is **not connected to the backend at all** – authentication and property data are simulated in the browser's `localStorage`. One page (My Shortlist) crashes, and tenants can open the landlord dashboard.

## 2. Static checks

| ID | Check | Command | Result |
|---|---|---|---|
| FE-S1 | Install dependencies | `npm install` | ✅ Pass (19 moderate/low npm audit warnings) |
| FE-S2 | TypeScript type check | `npx tsc --noEmit` | ✅ Pass, 0 errors |
| FE-S3 | Production build | `npx next build` | ✅ Pass, all 17 routes generated |
| FE-S4 | Lint | `npx eslint src` | ❌ Fail – **17 errors, 42 warnings** |

Main lint errors:
- `src/components/ui/notifications.tsx:108` – modifies a value React treats as immutable (`react-hooks/immutability`)
- `src/hooks/use-mobile.tsx:1`, `src/hooks/use-toast.tsx:1` – `@ts-nocheck` disables type checking for the whole file
- `src/lib/utils.ts:44, 59` – `any` types

## 3. Functional test cases

| ID | Page / Feature | Steps | Expected | Actual | Status |
|---|---|---|---|---|---|
| FE-01 | Landing page | Open `/` | Page loads without errors | Loads, no console errors | ✅ Pass |
| FE-02 | Landing – mobile | Open `/` at 375px width | No horizontal scroll, readable layout | Layout fits (scrollWidth = 375) | ✅ Pass |
| FE-03 | Login – empty form | Click "Sign In" with empty fields | Clear validation message | No visible message shown | ❌ Fail (BUG-FE-07) |
| FE-04 | Login – wrong password | `tenant@rentmatch.ai` + wrong password | Error shown, no login | "Sign-In Failed" toast | ✅ Pass |
| FE-05 | Login – valid tenant | `tenant@rentmatch.ai` + correct password | Redirect to tenant dashboard | Redirected to `/dashboard/tenant`, "Welcome back" toast | ✅ Pass |
| FE-06 | Login calls backend | Watch network during login | Request to FastAPI `/api/v1/login` | **No request to backend** – checked against localStorage | ❌ Fail (BUG-FE-01) |
| FE-07 | Tenant dashboard home | Open `/dashboard/tenant` | Dashboard content | Blank area (marked "intentionally left blank" in code); Next.js console error about dropped segment | ⚠️ Not implemented |
| FE-08 | Find Properties | Open `/dashboard/explore` | Listings + filters | 4 listings, locality/BHK/budget filters shown | ✅ Pass |
| FE-09 | AI Search | Open `/dashboard/ai-search` | Chat UI with relevant results | UI works but results are hard-coded US listings in $ (e.g. "Barton Springs Lofts $1,950/mo"); reply is a fake `setTimeout` | ❌ Fail (BUG-FE-04) |
| FE-10 | Inbox | Open `/dashboard/inbox` | Conversation list + messages | Renders correctly (mock data) | ✅ Pass |
| FE-11 | My Shortlist | Open `/dashboard/shortlist` | Saved properties list | **Page crashes** – React "change in the order of Hooks" error | ❌ Fail (BUG-FE-02) |
| FE-12 | Compare Properties | Open `/dashboard/compare` | Comparison UI | Blank (marked "intentionally left blank" in code) | ⚠️ Not implemented |
| FE-13 | Profile | Open `/profile` | User details + preferences form | Shows Ananya Patel's details, editable form | ✅ Pass |
| FE-14 | Property detail | Open `/properties/prop-101` | Property details + images | Loads correctly | ✅ Pass |
| FE-15 | Property detail – navbar | Open detail page while logged in | Shows logged-in user | Shows **"Login"** button | ❌ Fail (BUG-FE-06) |
| FE-16 | Property – invalid ID | Open `/properties/does-not-exist` | "Property not found" message | **Completely blank page** | ❌ Fail (BUG-FE-05) |
| FE-17 | Role protection | Log in as tenant, open `/dashboard/landlord` | Blocked / redirected | **Tenant can open landlord dashboard** | ❌ Fail (BUG-FE-03) |
| FE-18 | Route protection | Remove session, open `/dashboard/tenant` | Redirect to login | Redirected to `/login?redirect=/dashboard/tenant` | ✅ Pass |
| FE-19 | Signup page | Open `/signup` | Form with role switch | Renders, Tenant/Owner switch works | ✅ Pass |
| FE-20 | Signup – mobile | Open `/signup` at 375px | Fits screen | Fits screen | ✅ Pass |
| FE-21 | Signup – password rule | Compare frontend vs backend rule | Same rule on both | Frontend: min **6** chars, backend: min **8** chars | ❌ Fail (BUG-FE-08) |
| FE-22 | Accessibility – buttons | Read accessibility tree on `/login` | All buttons have names | "Continue with Google" and "Sign In" buttons have no accessible name | ✅ Logged as BUG-FE-09 (minor) |

## 4. Bug list

| ID | Severity | Title | Where | Details |
|---|---|---|---|---|
| BUG-FE-01 | 🔴 Critical | Frontend not connected to backend | `src/services/authService.ts`, `src/services/propertyService.ts` | All auth (including password "hashing" and JWT generation) and property CRUD run in the browser using `localStorage`. There is no `fetch`/axios call to FastAPI anywhere in `src/`. Any user can edit `localStorage` to become any role. |
| BUG-FE-02 | 🔴 High | My Shortlist page crashes | `src/app/dashboard/shortlist/page.tsx` ~line 66–72 | `useMemo` (`displayedProperties`) is called **after** an early `return` (`if (!mounted) return <Skeleton/>`). Hooks must not be called conditionally. Fix: move the `if (!mounted)` return below all hooks. |
| BUG-FE-03 | 🔴 High | Tenant can open landlord dashboard | `/dashboard/landlord`, `DashboardGuard.tsx` | Guard only checks "logged in", not role. |
| BUG-FE-04 | 🟠 Medium | AI Search shows US data in dollars | `src/app/dashboard/ai-search/page.tsx` | Results are hard-coded (Austin-style names, $ prices) while the rest of the app is ₹ / Gandhinagar. Replies are faked with `setTimeout`. |
| BUG-FE-05 | 🟠 Medium | Invalid property ID shows blank page | `src/app/properties/[id]/page.tsx` | Should show a "Property not found" message and a back link. |
| BUG-FE-06 | 🟡 Low | Property detail navbar shows "Login" while logged in | `src/app/properties/[id]/page.tsx` / `Navbar` | Auth state not reflected on this page. |
| BUG-FE-07 | 🟡 Low | No message when login form submitted empty | `src/components/auth/login-form.tsx` | User gets no feedback. |
| BUG-FE-08 | 🟠 Medium | Password rule mismatch with backend | Signup form vs `backend/app/schemas/user.py` | Frontend accepts 6–7 character passwords that the backend will reject (min 8) once connected. |
| BUG-FE-09 | 🟡 Low | Buttons without accessible names | `/login` page | Screen readers can't announce "Continue with Google" and submit buttons. |

Also noted: tenant and landlord dashboard home and Compare page are empty placeholders (not bugs, but features still to build).

## 5. Not tested / limitations
- Google sign-in (needs a Google OAuth client ID).
- Real data flow with the backend (blocked by BUG-FE-01).
- Landlord flows (add/edit/delete property) were not executed in this run.
- No automated frontend tests exist yet (no Vitest / Playwright setup in the repo).

## 6. Recommendations
1. Connect `authService` and `propertyService` to the FastAPI endpoints (highest priority).
2. Fix the Shortlist hooks crash and add role checks in `DashboardGuard`.
3. Align password rules with the backend (min 8).
4. Fix the 17 lint errors and add `npm run lint` to CI.
5. Set up Vitest + React Testing Library, and Playwright for end-to-end tests (as per the team plan).
