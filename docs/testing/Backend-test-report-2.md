# RentMatch AI – Backend Re-test Report (Changes after 1 November 2026)
 
| | |
|---|---|
| **Prepared by** | RentMatchAI Testing Team |
| **Report date** | 20 November 2026 |
| **Exact commit tested** | `006771037db619a260b5b2a1f3bfc9d116948ae4` (short form `0067710`), tip of `main` at the time of testing |
| **Current repository state** | At the time of this review (20 Nov 2026) `origin/main` still points to the same commit. No commits exist after the tested commit. Branch `feat/rio` has the same head; branch `shyam` (head `ed46b54`) is fully merged into `main`. No untested later changes were found. Only the three branches `main`, `feat/rio` and `shyam` were checked |
| **Compared with** | Backend test report of 1 Nov (baseline commit `3e0a8fe`) |
| **Area** | `backend/` (FastAPI 0.162, SQLAlchemy 2.1.6, Alembic 1.20, PostgreSQL) |
| **Environment** | Linux sandbox, Python 3.13, PostgreSQL 16; throw-away database `rentmatch_test` rebuilt on every run from the real Alembic migrations |
| **Test types** | Automated API tests (pytest + FastAPI TestClient against real PostgreSQL), migration tests, static code review, seed-script run, supplementary manual probes |
| **Test suite location** | External archive `retest_scripts.zip` (not part of the repository). See section 8 |
 
**Evidence labels used in this report.** *Confirmed* = reproduced by an executed test or probe and traced to source code. *Unverified* = observed or reported but not reproduced against the tested commit. *Recommendation* = suggested action, not a finding. Severity criteria: **High** = authorization, security or credential-forgery weakness; **Medium** = incorrect behaviour or robustness failure; **Low** = minor or cosmetic.
 
## 1. Summary
 
| Check | Result |
|---|---|
| New re-test suite (changes after 1 Nov) | **124 tests: 87 passed, 37 failed.** The suite was run twice, independently, with identical results |
| Bugs behind the 37 failed tests | **11 bugs** (BUG-BE-01, 02, 03, 05, 06, 07, 08, 09, 10, 11, 13); mapping in section 4 |
| Bugs found by other checks (not by the 124 tests) | **3 by project checks** (BUG-BE-04 repository test suite, BUG-BE-12 `alembic check`, BUG-BE-14 seed script) and **1 by supplementary probe** (BUG-BE-15) |
| **Total confirmed bugs** | **15** (11 + 3 + 1) |
| The repository's own `pytest` (`backend/tests/`) | ❌ Cannot start: `ImportError: cannot import name 'hash_password'` (BUG-BE-04) |
| Alembic migrations | ✅ `0001 → 769d4e8016fe → 0002` apply; downgrade and upgrade with data preserve the data; `downgrade base` then `upgrade head` works |
| Model and database in sync (`alembic check`) | ❌ One difference on `users.last_name` (BUG-BE-12) |
| `pip check`, `compileall`, OpenAPI | ✅ No broken requirements, no compile errors, 12 paths generated |
| Seed script | ⚠️ Runs, but adds only 5 listings (project plan: 100 to 300) |
 
**Overall.** The new features (change password, Google sign-in, `/properties/mine`, `address_line`, `available_from`) behave as intended in 87 of 124 tests. The failures are concentrated in input validation and access rules for properties. Invalid data returns HTTP 500 instead of 422, any logged-in user can create a listing through the API, and draft listings are readable by anonymous users. Supplementary verification also showed that `SECRET_KEY` and the other JWT values written in `backend/.env` are not used when tokens are signed, so the public default key signs and verifies tokens (BUG-BE-15, High). The committed pytest suite no longer runs, so none of these features is protected by automated tests in the repository.
 
**Correction of earlier counts.** An earlier draft of this report stated "37 failures from 11 bugs, plus 3 more", and it listed 14 bugs. Re-checking showed that the 37 failures map to exactly 11 bug IDs (24 + 1 + 2 + 1 + 2 + 1 + 2 + 1 + 1 + 1 + 1 = 37; section 4), that section 4 of that draft linked those 11 IDs (BUG-BE-04 is intentionally absent from it because it was not found by a test), and that one further bug (BUG-BE-15) was found during verification. The correct totals are therefore 11 + 3 + 1 = **15**.
 
## 2. What changed in the backend since 1 Nov
 
| Change | Where |
|---|---|
| `POST /profile/change-password` (new) | `api/profile.py`, `schemas/profile.py` |
| `GET /profile/` returns the user's role | `api/profile.py` |
| `GET /properties/mine` (new): all listings of the logged-in user | `api/properties.py` |
| `POST /google` rewritten: verified-email check, account linking by `google_sub`, role on sign-up, 409 for a different Google account, 403 for an inactive user, 10-second timeout, IPv4 only | `api/auth.py`, `core/config.py` (`GOOGLE_CLIENT_ID`) |
| Login refuses Google-only accounts that have no password | `api/auth.py` |
| `last_name` is optional (new migration `0002_make_last_name_optional`) | `alembic/versions`, `db/models.py` |
| Cleanup of duplicate router lines in `main.py` | `main.py` |
 
**Note on `address_line` and `available_from`.** Backend support for these two property fields already existed before 1 Nov (commits `28795b0` and `23da899`, 13–14 Oct) and has not changed since baseline commit `3e0a8fe`. Only the frontend began using them after 1 Nov. They are therefore tested here as part of the property API (tests PA01–PA06) but are not a backend change since 1 Nov. An earlier draft listed them as a backend change; that was incorrect.
 
## 3. Results by area
 
| Area | Tests | Passed | Failed | Failed IDs |
|---|---|---|---|---|
| Register and login (RG, LG) | 14 | 13 | 1 | RG06 |
| Profile and preferences (PR01–PR07 in the auth file) | 7 | 4 | 3 | PR02, PR05, PR07 |
| Change password (CP) | 12 | 11 | 1 | CP11 |
| Google sign-in (GL) | 23 | 21 | 2 | GL03, GL04 |
| Security and platform (SC: JWT, CORS, health, secrets) | 7 | 5 | 2 | SC03, SC06 |
| Property create and roles (PC) | 4 | 3 | 1 | PC02 |
| New fields `address_line`, `available_from` (PA) | 6 | 5 | 1 | PA04 |
| `/properties/mine` (PM) | 4 | 4 | 0 | none |
| Property validation on create (PV) | 22 | 7 | 15 | PV01 (all 15 parametrised cases) |
| Property read, list, filters, pagination (PR01–PR04 in the property file) | 4 | 4 | 0 | none |
| Draft listing visibility (PS) | 2 | 0 | 2 | PS01, PS02 |
| Property update (PU) | 17 | 8 | 9 | PU04 (8 cases), PU06 |
| Property delete and special characters (PD) | 2 | 2 | 0 | none |
| **Total** | **124** | **87** | **37** | |
 
The auth/profile file contains 63 tests and the property file 61 (63 + 61 = 124). Test IDs `PR01`–`PR04` are used both in the profile area and in the property read area; they are different tests in different files.
 
**Passed (highlights).**
- **Change password:** the old password stops working and the new one works; a wrong current password is refused; the 8-character minimum and the 72-byte maximum (including Hindi characters) are enforced; reusing the same password is refused; Google-only accounts receive a clear message; the password is stored as a bcrypt hash.
- **Google sign-in (token verification mocked):** a new user is created with the chosen role; an existing email account is linked and can still log in with its password; the same email with another Google account gives 409; unverified email, missing email and missing `sub` are refused; an inactive user gets 403; single-name and no-name accounts are handled; the email is stored in lower case; the 10-second timeout is applied.
- **`/properties/mine`:** requires login, returns only the caller's listings including drafts, and is not captured by the `/{property_id}` route.
- **New fields:** `address_line` and `available_from` are saved, returned and updatable; an invalid date gives 422.
- **Security:** expired, forged (wrong key) and malformed tokens, and tokens of deleted users, give 401; CORS allows only the configured origins; SQL-injection text in login is harmless.
- **Migration `0002`:** a Google user with an empty last name survives downgrade and upgrade.
### 3.1 Test-design disclosures
 
These points affect how far a "passed" or "failed" result can be relied on.
 
| Test | Disclosure |
|---|---|
| RG05 | The expectation was first written as 201 and was changed to 422 after review, because the by-design rule rejects the case. It is counted as passed under the corrected expectation. |
| GL04 | Expected status is 502, 503 or 504 (any "upstream unavailable" code), not only 503. |
| PR07 | A single test with four sub-cases. It is counted as one failure. Probe V-01 (section 5.2) shows 500, 500, 500 and 200 for the four sub-cases. The expectation is 400 or 422. |
| PA06, PR04 (property read), LG05 | Permissive tests: they accept more than one outcome and would pass for either behaviour. They do not prove a specific rule. |
| GL tests | The Google token check is mocked; no live Google call is made. |
 
## 4. Failed test cases and bug mapping
 
| ID | Case | Expected | Actual | Bug |
|---|---|---|---|---|
| PV01 (15 cases) | Create listing with rent 0 or negative, negative bedrooms, area 0, negative deposit, empty or blank title, title over 150 characters, empty description, wrong property type, wrong listing type, wrong furnishing, latitude or longitude out of range, latitude without longitude | 422 | **500** (database CHECK constraint error) | BUG-BE-01 |
| PU04 (8 cases) | Update with `title: null`, `city: null`, `monthly_rent: null`, status `weird`, negative rent, negative bedrooms, empty title, wrong type | 422 | **500** | BUG-BE-01 |
| PA04 | `address_line` of 256 characters | 422 | **500** | BUG-BE-01 |
| PC02 | Tenant creates a listing through the API | 403 | **201 Created** | BUG-BE-02 |
| PS01 | Anonymous user lists `/properties/?status=draft` | other users' drafts hidden | drafts are returned | BUG-BE-03 |
| PS02 | Anonymous user opens a draft by id | 403 or 404 | 200 with full data | BUG-BE-03 |
| PR07 | Preferences: negative budget, minimum above maximum, very large number, unknown furnishing value | 400 or 422 | 500 for the first three; unknown furnishing accepted (200) | BUG-BE-05 |
| RG06 | Register response contains the role | `landlord` | `null` | BUG-BE-06 |
| PR02 | `PUT /profile/` response contains the role | `landlord` | `null` | BUG-BE-06 |
| CP11 | Old login token after a password change | 401 | still valid (200) | BUG-BE-07 |
| GL03 | Error text for a bad Google token | generic message | internal text such as "Wrong number of segments in token" | BUG-BE-08 |
| GL04 | Google servers unreachable | 502, 503 or 504 | 401 with internal error text | BUG-BE-08 |
| SC03 | Token with a non-UUID subject | 401 | **500** | BUG-BE-09 |
| SC06 | `ENVIRONMENT=production` with the default `SECRET_KEY` | startup refused | accepted silently | BUG-BE-10 |
| PR05 | User clears their phone number | phone empty | old number stays | BUG-BE-11 |
| PU06 | `updated_at` after a property update | newer time | unchanged | BUG-BE-13 |
 
**Reconciliation of counts.**
 
| Bug | Failed tests | Count |
|---|---|---|
| BUG-BE-01 | PV01 ×15, PU04 ×8, PA04 | 24 |
| BUG-BE-02 | PC02 | 1 |
| BUG-BE-03 | PS01, PS02 | 2 |
| BUG-BE-05 | PR07 | 1 |
| BUG-BE-06 | RG06, PR02 | 2 |
| BUG-BE-07 | CP11 | 1 |
| BUG-BE-08 | GL03, GL04 | 2 |
| BUG-BE-09 | SC03 | 1 |
| BUG-BE-10 | SC06 | 1 |
| BUG-BE-11 | PR05 | 1 |
| BUG-BE-13 | PU06 | 1 |
| **Total** | **11 bugs** | **37** |
 
Bugs without a failing test in the 124: BUG-BE-04 (repository test suite), BUG-BE-12 (`alembic check`), BUG-BE-14 (seed script), BUG-BE-15 (supplementary probe V-09).
 
## 5. Bug list
 
### 5.1 Confirmed bugs
 
Every bug below was re-verified against the source at commit `0067710`. Line numbers refer to that commit.
 
| ID | Severity | Title | Where (verified) | Details and suggested fix |
|---|---|---|---|---|
| BUG-BE-01 | 🟠 Medium | Invalid property data returns 500 instead of 422 | `app/schemas/property.py` (classes at lines 7, 27, 30, 51); `app/api/properties.py` `create_property` (l. 58), `update_property` (l. 71) | The schemas define no value limits, so invalid values reach PostgreSQL and fail on CHECK constraints. 24 failing cases. The frontend validates some fields, but any API client receives a server error. Fix: add `Field(gt=0)`, `ge=0`, `min_length`, `max_length` (title 150, `address_line` 255) and `Literal[...]` for type, listing type, furnishing and status; reject `null` for required fields on update. *Severity re-rated from High (earlier draft) to Medium: robustness and incorrect status code, no security impact.* |
| BUG-BE-02 | 🔴 High | A tenant can create listings through the API | `app/api/properties.py` `create_property` (l. 57–68) | Only a valid login is checked, not the role. The frontend shows "Role Restricted" but the API accepts the request (PC02 returned 201). Sprint 1 asks for role-based authorization. Fix: allow only `landlord` (and `admin` if intended) and return 403 otherwise. |
| BUG-BE-03 | 🔴 High | Draft and archived listings are readable by anonymous users | `app/api/properties.py` `get_properties` (l. 14–39), `get_property` (l. 49–55) | `GET /properties/?status=draft` returns other users' drafts, and `GET /properties/{id}` returns any listing regardless of status (probe V-03: archived listing, anonymous, 200; probe V-02: an empty `status=` value also returns the draft). Fix: public routes return only `published`; owners use `/mine`. |
| BUG-BE-04 | 🟠 Medium | The repository's pytest suite is broken and out of date | `backend/tests/conftest.py` (l. 20, 97) | `conftest.py` imports `hash_password`; the function in `core/security.py` is `get_password_hash` (l. 15). The tests also follow an older design (`app.models.user`, `full_name`, role `renter`, `/auth` URLs). There is no `test_properties.py` although the 1 Nov report counted property tests, and no CI configuration was found. Fix: rewrite the tests for the current code; the external suite can serve as a starting point. |
| BUG-BE-05 | 🟠 Medium | Preferences accept invalid values | `app/api/profile.py` `update_preferences` (l. 72–83), `app/schemas/profile.py` | Negative budget, minimum above maximum and a very large number return 500 (probe V-01); an unknown `furnishing_status` is stored (200). Fix: validate in `PreferenceBase` (`ge=0`, `budget_min <= budget_max`, `Literal` for furnishing). |
| BUG-BE-06 | 🟡 Low | `role` is missing from register and profile-update responses | `app/api/auth.py` (register), `app/api/profile.py` `update_profile` (l. 25–32) | Only `GET /profile/` returns the role; the others return `null`. The frontend works around it. Fix: return the same response shape everywhere. *Re-rated Medium → Low: minor inconsistency.* |
| BUG-BE-07 | 🟠 Medium | Old tokens keep working after a password change | `app/api/profile.py` `change_password` (l. 34–), `app/api/deps.py` | Tokens are stateless (claims `sub`, `exp` only) and live 60 minutes, so a stolen token still works after the owner changes the password (CP11). Fix: store `token_version` or `password_changed_at` and check it in `get_current_user`. |
| BUG-BE-08 | 🟡 Low | Google errors leak internal text and use the wrong status | `app/api/auth.py` (l. 119–128) | `ValueError` and any other exception are returned as 401 with `str(e)` in the message (l. 122, 127). Return a fixed message for a bad token and 502/503 when Google cannot be reached. Related to project reports BUG-GL-03 and BUG-GL-04 of 19 Nov. |
| BUG-BE-09 | 🟡 Low | Non-UUID token subject causes 500 | `app/api/deps.py` (l. 22–35) | Requires a correctly signed token; but see BUG-BE-15, which makes signing possible with the public default key. Return 401 when `sub` is not a UUID. |
| BUG-BE-10 | 🟠 Medium | No production check for `SECRET_KEY` | `app/core/security.py` (l. 8–10), `app/core/config.py` | The 1 Nov report (section 6.3) stated production would refuse the default key. The current code accepts it (SC06). `security.py` reads `os.getenv` separately from `settings`. Fix: validate in `Settings` and use `settings.SECRET_KEY` everywhere. See also BUG-BE-15. |
| BUG-BE-11 | 🟡 Low | Profile phone cannot be cleared | `app/api/profile.py` (l. 29) | `if profile_in.phone:` ignores an empty string. Use `is not None` for fields that may be cleared (names are required, so the same pattern on l. 27–28 is acceptable). |
| BUG-BE-12 | 🟡 Low | Model and database differ on `users.last_name` | `app/db/models.py` (l. 32), `alembic/versions/0002_make_last_name_optional.py` (l. 20) | The migration sets a database default of an empty string; the model has only a Python default. `alembic check` reports a difference, which would fail a CI drift check. Fix: add `server_default=""` to the model column. |
| BUG-BE-13 | 🟡 Low | `updated_at` is not updated on changes | `app/db/models.py` (users l. 41–43, properties l. 135–137) | No `onupdate`. Verified for property update (PU06) and for `PUT /profile/` (probe V-06: `users.updated_at` unchanged). Fix: `onupdate=func.now()`. Same as the 1 Nov observation. |
| BUG-BE-14 | 🟡 Low | Seed script is small and manual | `scripts/seed_listings.py` | Adds 5 listings, needs `user@example.com` to exist, and does not fill `address_line` or `available_from`. The plan asks for 100 to 300 listings. |
| BUG-BE-15 | 🔴 High | `SECRET_KEY` and other JWT settings in `.env` are ignored when signing tokens (**new**) | `app/core/security.py` (l. 8–10), `app/core/config.py` | `config.py` (pydantic-settings) loads `.env` into `settings` only, whereas `security.py` reads `os.getenv`. With `SECRET_KEY`, `JWT_ALGORITHM` and `ACCESS_TOKEN_EXPIRE_MINUTES` set only in `.env`, probe V-08 shows `settings` holding the `.env` values while `security.py` still uses the public defaults (`change-me-in-production-use-a-long-random-string`, `HS256`, 60). Probe V-09: a token forged with the public default key for an `owner_id` taken from the public listing endpoint was accepted by `GET /profile/` (200, correct account). Unless the real environment variables are exported on the server, anyone who has read the repository can impersonate any user whose id is public. Fix: use `settings.*` in `security.py` and refuse the default key outside development. **Scope:** shown for a deployment that configures secrets via `.env`; a host that exports real environment variables is not affected. *This is a new finding not present in earlier drafts and was not covered by the 124 tests.* |
 
**Note on BUG-BE-10 and BUG-BE-15.** BUG-BE-10 is the missing startup guard (SC06 failing: the default key is accepted silently). BUG-BE-15 is the separate, confirmed mechanism by which configured keys are not applied. They have different fixes and are listed separately.
 
### 5.2 Supplementary probes (not part of the 124 tests)
 
| Probe | Observation |
|---|---|
| V-01 | Preferences: `budget_min=-5` → 500; min 30000 > max 10000 → 500; very large `budget_max` → 500; `furnishing_status=weird` → 200 |
| V-02 | Anonymous `GET /properties/?status=` returns 1 listing while 1 draft exists |
| V-03 | An archived listing is readable anonymously by id (200) |
| V-04 | `available_from` in the past is accepted (201) |
| V-05 | A valid token of an inactive user is refused with 400 "Inactive user" (not 401/403; observation only) |
| V-06 | `PUT /profile/` does not change `users.updated_at` |
| V-07 | Email is stored as typed (`Mixed@Example.com`); uniqueness is case-insensitive per RG02 |
| V-08, V-09 | `.env` values ignored by `security.py`; forged token accepted (BUG-BE-15) |
 
Probe scripts `probes.py` and `probe_env_key.py` are included in the external archive (see section 8). `probe_env_key.py` works on a temporary copy of `backend/` and does not modify the project's `.env`.
 
### 5.3 Unverified observations
 
| Observation | Status |
|---|---|
| Login returns 400 for a wrong password (the 1 Nov report asked the team to choose 400 or 401) | Confirmed behaviour (`auth.py` l. 86–87); whether it is a defect is a team decision, not a bug |
| No rate limiting on `/login` | Not verified by testing (code review only; no limiter found) |
| `app/db/session.py` appears unused by the application | Static search only; unverified |
| Listing with `available_from` in the past is accepted | Confirmed (V-04); no requirement states it should be rejected |
 
### 5.4 Recommendations
 
1. Fix BUG-BE-15 and BUG-BE-02/03 first (authorization and token integrity), then BUG-BE-01 (validation).
2. Repair `backend/tests/` and add the external suite's property and auth tests so these checks run automatically; add a CI job running `pytest` and `alembic check`.
3. Add a startup validation that rejects the default `SECRET_KEY` outside development.
4. Decide on 400 versus 401 for wrong credentials and document it.
## 6. Status of the open items from the 1 Nov report
 
| Item from 1 Nov | Now |
|---|---|
| 6.1 Login 400 or 401 | Still 400; not yet decided |
| 6.2 Password minimum 6 on the frontend | Fixed in the signup and login modal; still 6 on the profile security tab (see frontend report) |
| 6.3 Production `SECRET_KEY` | Not enforced (BUG-BE-10); configured keys also not applied (BUG-BE-15) |
| 6.4 Seed script, unused session module, `updated_at` | Still open (BUG-BE-14, BUG-BE-13; session module unverified, section 5.3) |
| 7 Frontend and backend integration | Now connected; tested in the frontend report |
 
## 7. Not tested
 
- **Live Google sign-in** with a real Google ID token (requires the team's Client ID). The token check was replaced with fixed test data.
- **The deployed server** (Render or Railway).
- **The shared Supabase database.** All tests used a local throw-away PostgreSQL database.
- **Load and performance testing**, and rate limiting.
- **Sprint 3 and later features** (maps, geo queries, AI search, matching, shortlist API, questions, RAG). They are not implemented in the tested commit.
## 8. How to run (reproducibility)
 
The test suite is **not** part of the repository. It is delivered as the external archive `retest_scripts.zip` (folders `bt/` for the backend tests and `pw/` for the frontend tests, plus the probe scripts). It was written for this re-test and no project source file was modified.
 
1. **Check out the tested commit:** `git checkout 006771037db619a260b5b2a1f3bfc9d116948ae4`.
2. **Create the local PostgreSQL role and database server access.** The suite connects as role `rentmatch` / password `rentmatch` on `localhost:5432` and needs `SUPERUSER` or `CREATEDB` rights, because it creates and drops the database `rentmatch_test`:
   `CREATE ROLE rentmatch LOGIN SUPERUSER PASSWORD 'rentmatch';`
   The URL is set in `bt/conftest.py` (`rentmatch:rentmatch@localhost:5432/rentmatch_test`); edit it if your credentials differ.
3. **Edit the paths in `bt/conftest.py`:** the constant `BACKEND` (hard-coded to `/home/claude/repo_clone/rentmatchai/backend`) must point to your `backend/` folder. The Alembic subprocess also adds `/tmp/venv/bin` to `PATH`; change it to your virtual environment's `bin` folder.
4. **Install dependencies:** `pip install -r requirements.txt` from `backend/`. Note that this file is UTF-16 encoded; convert it to UTF-8 first if `pip` fails.
5. **Run:** `PYTHONPATH=<path to bt> pytest <path to bt> -q`. Expected result at the tested commit: 124 tests, 87 passed, 37 failed (failures listed in section 4).
6. **Supplementary probes:** from `backend/`, `PYTHONPATH=<path to bt> python <path to bt>/probes.py` (run after the suite has built `rentmatch_test`) and `python <path to bt>/probe_env_key.py <path to backend>`.
7. The suite creates and drops only the database `rentmatch_test`. It never uses the project's `DATABASE_URL`. Do not point it at a shared or production database.
A later commit may change the results; re-run the suite and record the commit hash with any new results.
