# Changelog

All notable changes to RentMatch AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.3] - 2026-11-23

### Changed
- Refactored dashboard views to remove hyper-rounded "capsule" styling in favor of standard clean dashboard cards and buttons:
  - Replaced `rounded-3xl` header banners, key metric tiles, empty states, and comparison matrix tables with standard clean `rounded-xl`.
  - Replaced `rounded-full` action buttons with `rounded-lg`.
  - Replaced `rounded-full` status badges and criteria tags with `rounded-md`.
  - Standardized form inputs and search fields to `rounded-lg`.
  - Updated segmented control tabs and toggle containers to `rounded-lg` with `rounded-md` active tab buttons.
  - Normalized across Tenant Dashboard, Landlord Dashboard, Properties Portfolio, Profile, Shortlist, Compare, and Explore views.

## [0.2.2] - 2026-11-21

### Fixed
- Fixed Google Sign-In button becoming non-functional after switching between `/login` and `/signup` routes without full page refresh:
  - Initialized `scriptLoaded` state from `window.google?.accounts?.id` to detect already loaded Google Identity Services (GIS) on client-side route transitions.
  - Added `id="google-identity-services"` and `onReady` listener to Next.js `<Script>` to handle repeated component mounting across SPA navigations.
  - Kept Google button overlay DOM container always mounted and active with `requestAnimationFrame` render measurement to ensure the Google OAuth popup triggers accurately even during curtain or fade animations.

## [0.2.1] - 2026-11-20

### Added
- Created dedicated dashboard profile tab route at `/dashboard/profile` (`frontend/src/app/dashboard/profile/page.tsx`) with segmented tabs for Personal Details & Search Preferences and Security & Password updates.
- Added dynamic topbar title mapping for `/dashboard/profile` in `DashboardLayout.tsx`.

### Changed
- Updated all navigation links, sidebar settings triggers, account dropdown options, tenant dashboard shortcuts, and privacy page references from `/profile` to `/dashboard/profile`.

### Removed
- Completely deleted legacy standalone `/profile` route directory (`frontend/src/app/profile/`).

## [0.2.0] - 2026-11-20

### Added
- Added dedicated Privacy Policy route (`/privacy`) formatted with structured legal cards, DPDP / IT Act compliance guidelines, and grievance redressal officer contact channels.
- Added dedicated Terms of Service route (`/terms`) detailing platform zero-brokerage rules, verification standards, tenant diligence recommendations, and listing abuse reporting protocols.
- Linked Privacy Policy and Terms of Service across the global landing page footer (`page.tsx`) and the user registration flow (`signup-form.tsx`).

## [0.1.25] - 2026-11-20

### Added
- Modernized property dropdowns in `PropertyFormModal.tsx` (`Property Type`, `Bedrooms (BHK)`, `Bathrooms`, `Furnishing Status`) with custom `ModernSelect` component featuring portaled popovers, animated chevron indicator, icon pairing, active checkmark states, and option descriptions.
- Expanded property form modal width to `max-w-5xl` (1024px) for a wider, more spacious desktop layout.

## [0.1.24] - 2026-11-20

### Changed
- Moved Property Description textarea from Section 4 into Section 1 ("Basic Information & Location") directly beneath Listing Title in `PropertyFormModal.tsx`.
- Increased modal maximum width from `max-w-2xl` (672px) to `max-w-4xl` (896px) for an expansive, comfortable editing layout.
- Renamed Section 4 to "Listing Photos & Presets".

## [0.1.23] - 2026-11-20

### Added
- Added Building / Society / Street Address (`address_line`) field to Property creation and editing modal (`PropertyFormModal.tsx`) and mapped end-to-end to backend model.
- Added explicit date picker and availability handling (`available_from`) to Section 2 of `PropertyFormModal.tsx`.
- Added address display under location in `LandlordPropertiesView.tsx` table and detailed property view (`/properties/[id]`).
- Added availability date subtext to furnishing column in `LandlordPropertiesView.tsx` table.

### Changed
- Improved `getLocationFields` in `propertyService.ts` to default safely to `Gandhinagar` when a single locality token is provided, satisfying the database `NOT NULL` constraint for `city`.
- Marked `description` with required `*` and validation (minimum 10 characters) matching the PostgreSQL `properties_description_not_empty` constraint.

## [0.1.22] - 2026-11-20

### Removed
- Completely removed the Inbox feature (`/dashboard/inbox`) and its route directory across the project.
- Removed Inbox navigation links and unread message badges from `DashboardSidebar.tsx` for both tenants and landlords.
- Removed the mock "Active Conversations" chat stream and "Direct Inquiries" metric card from `TenantDashboardView.tsx`, replacing it with an active available homes count.
- Removed the mock "Recent Tenant Enquiries" stream and enquiry metric card from `LandlordDashboardView.tsx`, replacing it with a portfolio drafts/inactive count.
- Removed inbox route title handling and 100dvh layout overrides from `DashboardLayout.tsx`.

## [0.1.21] - 2026-11-19

### Added
- Added explicit "Please wait, redirecting..." loading feedback and animated status confirmation banner on both login (`login-form.tsx`) and signup (`signup-form.tsx`) flows to reassure users while the dashboard route resolves and page curtains animate.
- Disabled inputs, submit triggers, and role selectors once authentication succeeds to prevent duplicate submissions during navigation.

### Changed
- Streamlined `LandlordDashboardView.tsx` by removing header status badge, quick enquiries action button, and view switcher toggles.
- Simplified empty state messaging in `LandlordPropertiesView.tsx` instructing landlords to use the top button to add properties.

## [0.1.20] - 2026-11-19

### Added
- Added eye toggle button to password fields in both login and signup forms (`login-form.tsx` and `signup-form.tsx`) allowing users to show or hide their password.
- Installed `@reui/c-dropdown-menu-10` via shadcn CLI and adopted its `DropdownMenu` architecture across all dropdowns on the website (`DropdownAccountCardMD`, `TableRowActionsDropdown`, and `Navbar`).

### Fixed
- Fixed non-scrollable "Add New Property" modal (`PropertyFormModal.tsx`) by pinning the header and action buttons, constraining modal height to `max-h-[90svh] overflow-hidden`, and making the inner form fields container `flex-1 min-h-0 overflow-y-auto` with `overscroll-contain`.

### Removed
- Removed all three "Add Property" buttons from the landlord `/dashboard` view (`LandlordDashboardView.tsx`), centralizing property creation under the dedicated "My Properties" page (`/dashboard/properties`).

## [0.1.19] - 2026-11-19

### Added
- Integrated Untitled UI `Table` component via `npx untitledui@latest add table` for rich landlord property listings management with sorting, status badges, action dropdowns, and responsive density.
- Created dedicated `/dashboard/properties` page (`DashboardPropertiesPage` & `LandlordPropertiesView`) featuring portfolio KPI cards, live search, status filtering, sort options, and Table vs Grid view modes.

### Changed
- Updated Landlord dashboard sidebar navigation to route "My Properties" directly to `/dashboard/properties` with live portfolio counter badge and active route indicator.
- Updated `LandlordDashboardView` to use the Untitled UI `Table` component for its table view mode and added a "Manage All" link to `/dashboard/properties`.

### Removed
- Completely removed the `/profile?tab=listings` tab from `profile/page.tsx`, eliminating redundant property management UI and routing from the personal profile page.
- Added automatic redirect from `/profile?tab=listings` to `/dashboard/properties`.

## [0.1.18] - 2026-11-19

### Removed
- Removed the "Add Property" button from the Landlord dashboard sidebar in `DashboardSidebar.tsx`, streamlining the navigation roster.

## [0.1.17] - 2026-11-18

### Security
- Upgraded `next` and `eslint-config-next` from 16.4.3 to 16.4.6 to address published security advisories.

## [0.1.16] - 2026-11-15

### Changed
- Unified all dashboard routing under the single, clean `/dashboard` URL for all users regardless of role (Tenant/Renter or Landlord/Lister).
- Extracted `TenantDashboardView` and `LandlordDashboardView` to dedicated dashboard components, conditionally rendered at `/dashboard` via `AuthContext`.
- Updated login redirects, signup redirects, Navbar dashboard links, and Sidebar navigation to route directly to `/dashboard`.
- Added automatic permanent redirects in `next.config.ts` as well as route fallbacks in `tenant/page.tsx` and `landlord/page.tsx` so legacy links `/dashboard/tenant`, `/dashboard/landlord`, and `/dashboard/renter` redirect cleanly to `/dashboard`.

## [0.1.15] - 2026-11-15

### Fixed
- Fixed unscrollable conversation list and active chat stream by adding `overflow-hidden` to `ScrollAreaPrimitive.Root` in `scroll-area.tsx`, enforcing `min-h-0 overflow-hidden` on parent flex containers, and moving scroll area padding to inner wrappers so `clientHeight < scrollHeight` and scrollbars trigger properly.
- Removed global `select-none` from inbox layout to allow normal text selection and copying in message threads.

## [0.1.14] - 2026-11-15

### Added
- Expanded Inbox conversation roster with 10 additional realistic users (total 16 conversations) with Unsplash photo avatars, `@handles`, Gandhinagar property listings, and category tags.
- Enriched message histories across multiple chats (Olivia, Phoenix, Demi, Natali, Drew, Orlando, Candice, etc.) with multi-turn discussions on amenities, lease clauses, walk-throughs, and utility provisions.

## [0.1.13] - 2026-11-15

### Added
- Animated vertical active indicator bar in the Inbox conversation list using `motion/react` shared `layoutId="active-chat-indicator"` with spring physics (`stiffness: 380, damping: 32`), creating a fluid glide between conversations when selected.

## [0.1.12] - 2026-11-15

### Changed
- Redesigned the Inbox conversation list to match the modern Untitled UI contact list aesthetic with edge-to-edge subtle dividers, circular photographic portraits, bold participant names, and `@handles`.
- Replaced sample conversations with the full roster from the design spec (Olivia Rhye, Phoenix Baker, Demi Wilkinson, Natali Craig, Drew Cano, Orlando Diggs).
- Updated active chat header, message avatars, and contact information panels to use high-resolution portrait avatars and handles.
- Centered the profile avatar in `DropdownAccountCard.tsx` along the sidebar's $X = 34\text{px}$ icon axis and removed the status indicator bubble.

## [0.1.11] - 2026-11-15

### Fixed
- Completely removed focus outlines, press rings, and double border rings from the account card button, dropdown popover, and menu items (`outline-none focus:outline-none ring-0`).
- Streamlined popover rendering by eliminating competing CSS animation keyframes and restricting button transitions to `transition-[width,background-color]`.

## [0.1.10] - 2026-11-15

### Fixed
- Fixed account dropdown popover width (`w-[236px]`) to match the card and sidebar width pixel-for-pixel, preventing it from overflowing past the sidebar border.
- Replaced aggressive popover zoom animation with clean `fade-in slide-in-from-bottom-1` ease-out transition.

### Removed
- Removed redundant Dark Mode toggle from the account dropdown menu (theme toggle is cleanly housed in the dashboard header).

## [0.1.9] - 2026-11-15

### Fixed
- Fixed sidebar vertical jitter/shake by giving `BrandLogo` and its header container a fixed 40px/44px height, eliminating vertical height shifts when expanding or collapsing.
- Suppressed subscript badge numbers when the respective route is active (e.g., viewing Inbox or Shortlist hides its collapsed unread badge).

### Changed
- Redesigned the bottom profile card with a floating, prominent circular avatar (`size-10`) layered over the card box, where the box sits underneath on the left and smoothly extends outward to the right on hover and retracts under it when collapsed.

## [0.1.8] - 2026-11-15

### Fixed
- Fixed inbox page UI scrolling up out of view when selecting long chat threads (e.g. Dr. Ramesh Patel) by replacing unconstrained `scrollIntoView()` with container-scoped `viewport.scrollTo()`, and locking `DashboardLayout` with `h-[100dvh] overflow-hidden`.
- Removed outline and focus rings from text boxes, textareas, and search inputs in both Inbox and AI Search pages.
- Fixed sidebar transition glitches by unifying button padding, removing flex alignment jumping, and applying fixed `duration-250 ease-out` transition.

### Changed
- Displayed unread inbox number (and shortlist count) as a neat badge/subscript attached to the icon when sidebar is collapsed.
- Configured Support button to directly trigger email to `me@niranjan.lol` with a single click.

## [0.1.7] - 2026-11-15

### Added
- Permanent-collapsed dashboard sidebar that displays icons only by default (68px width) and smoothly expands to full width (256px) on hover with Apple-grade fluid easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Floating overlay expansion in `DashboardLayout.tsx` so the main content never undergoes layout shifts when hovering the sidebar.
- Seamless menu awareness: sidebar remains expanded while Support or Account popover menus are open.
- Refactored `SidebarButton` and `DropdownAccountCardMD` for unified icon alignment and graceful text reveal.

## [0.1.6] - 2026-11-15

### Changed
- Moved Settings and Support navigation directly into the sidebar above the bottom profile account card in `DashboardSidebar.tsx`.
- Streamlined `DropdownAccountCard.tsx` menu to focus cleanly on Profile, Dark Mode, and Sign Out.

## [0.1.5] - 2026-11-15

### Fixed
- Fixed single-name Google profiles by dropping PostgreSQL `users_last_name_not_empty` constraint, updating Alembic schema migration, and removing the placeholder "User" string from display names and database records.

## [0.1.4] - 2026-11-15

### Fixed
- Resolved backend IPv6 connect timeout when verifying Google OAuth tokens against `googleapis.com` by enforcing IPv4 resolution with connection timeout adapter.
- Added direct fallback navigation to ensure authenticated Google sessions immediately transition to Dashboard without hanging on the form.

## [0.1.3] - 2026-11-15

### Removed & Fixed
- Completely removed fallback dummy user sessions and mock tokens; inoperative Google sign-in strictly halts and displays the error without logging in.
- Introduced `GoogleAuthButton` preserving the custom theme button UI from `fb4c61d` with native Google Identity Services popup triggering and backend token verification.

## [0.1.2] - 2026-11-15

### Added
- Explicit alert notification informing users whenever the fallback demo Google account is used due to Google OAuth or backend inoperability.

## [0.1.1] - 2026-11-15

### Fixed
- Restored custom Google authentication button with warm theme styling and Google SVG from commit `fb4c61d`.
- Removed clashing Google GSI iframe button (`GoogleSignInButton.tsx`).
- Updated `loginWithGoogle` and `AuthContext` to support both real Google ID tokens and resilient demo authentication fallback when the local backend is offline or cloud origins mismatch.
- Hardened session persistence so users remain logged in across page refreshes even if the backend API is temporarily offline.
