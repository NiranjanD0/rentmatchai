# RentMatch AI: Sprint Plan

A short, easy to follow plan of the 9 sprints (Sprint 0 to Sprint 8) that take RentMatch AI from an empty repository to a deployed product.

## Sprint 0: Foundation and Planning

*Before writing features, we get the plan, the designs and the project setup ready so everyone can start coding together.*

**Goal:** Have a clear plan and a working skeleton ready for the mid evaluation.

**Main points:**

* Draft the SRS, user stories and product backlog
* Prepare the architecture diagram, ER diagram and wireframes
* Set up the GitHub repository, branch rules, Docker and the basic CI workflow
* Build a small skeleton that connects frontend, backend and database
* Create a seed script with sample property data

**Testing:** Write the overall test plan, check that CI runs on every pull request, and confirm that the health check endpoint responds from the backend.

**Deliverable:** A running project skeleton with documentation

## Sprint 1: User Authentication and Profile Management

*This sprint lets people join the platform as a tenant or a property lister and keep their own profile.*

**Goal:** Enable tenants and property listers to register, log in and manage their profiles.

**Main points:**

* User Registration: allow users to register as a tenant or property lister
* User Login and Logout: secure authentication using password hashing and JWT
* Role Based Authorization: restrict functionality based on the user's role
* Profile Management: let users view and update their personal details
* Database Integration: create the users table and connect it with FastAPI

**Testing:** Verify registration, login, profile updates and authorization, including wrong passwords, duplicate emails and access to pages meant for the other role.

**Deliverable:** A working authentication system with role based access and profile management.

## Sprint 2: Property Listing and Management

*Property listers get their own space to publish and look after rental properties.*

**Goal:** Enable property listers to publish and manage rental properties.

**Main points:**

* Create Property Listing: add details such as title, description, rent, location, bedrooms and amenities
* View Property Listings: display available properties to users
* Edit Property Details: allow listers to update their own property information
* Delete Property Listing: allow listers to remove or deactivate their own listings
* Database Integration: create the properties table and link each property to its lister using a foreign key

**Testing:** Verify property CRUD operations, input validation and ownership permissions, so that a lister can never edit or delete someone else's property.

**Deliverable:** A working property management system integrated with the database and backend APIs.

## Sprint 3: Search, Filters and Google Maps

*Tenants can now explore properties properly and see where each one is on the map.*

**Goal:** Help tenants find properties by filters and understand location and commute.

**Main points:**

* Filters for rent range, location, bedrooms and amenities, with pagination
* Property detail page with photos and full information
* Google Maps integration with markers and geocoding
* Nearby places and commute time to the user's office or college
* Location fields and distance queries in the database

**Testing:** Test every filter alone and in combination, empty results, invalid ranges, geo distance queries, and what happens when the Maps API fails or the key is missing.

**Deliverable:** A searchable and filterable property list with a working map view.

## Sprint 4: Natural Language Search

*Instead of filling many fields, a tenant simply types what they want, like "2BHK under 20k near my office".*

**Goal:** Let users describe their ideal home in plain words and get matching results.

**Main points:**

* LLM parser endpoint that turns text into structured JSON filters
* Search box and results page connected to the parser
* Validation of the LLM output before it is used
* Manual filter fallback when the AI is unavailable or unsure
* Query history for each user

**Testing:** Test normal sentences, vague or very long input, spelling mistakes, unrelated text, invalid JSON from the model, and the fallback when the LLM service is down.

**Deliverable:** A working text based search that falls back safely to normal filters.

## Sprint 5: Matching and Shortlist

*The app starts giving personal recommendations and helps tenants keep track of favourites.*

**Goal:** Rank properties by how well they suit each user and let users save and compare them.

**Main points:**

* Match score algorithm based on budget, location, commute and lifestyle needs
* A short "why this matches" explanation for each recommendation
* Save to shortlist and remove from shortlist
* Side by side comparison of saved properties

**Testing:** Unit tests for the score calculation with known inputs, tests for ranking order, shortlist permissions per user, and comparison with missing property data.

**Deliverable:** Ranked recommendations with explanations, plus a shortlist and compare page.

## Sprint 6: Landlord Question Generator

*Before visiting a property, tenants get smart questions to ask the landlord, so nothing important is missed.*

**Goal:** Generate useful, property specific questions and help users prepare for visits.

**Main points:**

* Question generation service using the property details and the user's needs
* Visit checklist for each shortlisted property
* Saved notes after a visit
* Edit, copy and delete generated questions

**Testing:** Check that questions are relevant and not repeated, that stated facts are not asked again, that notes belong only to their owner, and run feature and regression tests on earlier sprints.

**Deliverable:** A visit assistant with generated questions, checklist and notes.

## Sprint 7: RAG Integration

*Now the assistant can answer questions about a property using only the real listing information.*

**Goal:** Add grounded AI answers with sources, built on the data we already store.

**Main points:**

* Document ingestion of listing descriptions and details
* Embeddings stored in the vector database (pgvector)
* Chat assistant that answers with sources shown
* Improved question generation using the retrieved information

**Testing:** Check answer quality and accuracy, make sure the assistant says "not mentioned in the listing" instead of guessing, test prompt injection attempts, and test the fallback when retrieval fails.

**Deliverable:** A chat assistant that gives reliable answers grounded in listing data.

## Sprint 8: Hardening and Release

*The final sprint is about making everything stable, secure and ready to present.*

**Goal:** Deliver a polished, tested and deployed product with complete documentation.

**Main points:**

* Bug fixes and UI polish across all pages
* Performance improvements and security checks
* Deployment of frontend, backend and database
* Final report, presentation and demo script

**Testing:** Full regression testing, end to end journeys from registration to shortlist to assistant, security checks for authentication, secrets and permissions, and a final demo rehearsal.

**Deliverable:** The final deployed RentMatch AI, ready for the final evaluation.

> **Note:** if the team falls behind, Sprints 5 and 6 act as buffers. The core product must work without RAG, but Sprint 7 is what makes the project stand out, so it should be protected.
