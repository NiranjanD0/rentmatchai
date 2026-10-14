# RentMatchAI: Requirements

IT314 Software Engineering | Group 7 | Dhirubhai Ambani University

## 1. Introduction

This document lists all the requirements of RentMatchAI in one place: the user stories, the functional requirements and the non functional requirements. Each item has a unique ID so it can be referred to easily in design, testing and reviews.

### 1.1 Users of the System

* **Tenant:** a student, working professional or family looking for a rental home.
* **Property Lister:** an owner or manager who publishes and maintains rental properties.

### 1.2 How to Read the IDs

* **US:** User Story, written from the point of view of a user or team member.
* **FR:** Functional Requirement, something the system must do.
* **NFR:** Non Functional Requirement, how well the system must do it (security, performance, reliability and so on).

### 1.3 Summary

* 37 user stories
* 55 functional requirements
* 37 non functional requirements

## 2. User Stories

| ID | As a | I want to | So that |
| --- | --- | --- | --- |
| US-01 | Team member | have a shared repository with branch rules and automatic checks | we can work together without breaking each other's code |
| US-02 | Product owner | have the SRS, user stories and backlog documented | the whole team knows what to build |
| US-03 | Developer | have architecture and ER diagrams and wireframes | design decisions are clear before coding starts |
| US-04 | Developer | have a skeleton that connects the frontend, backend and database | every feature can be built on a working base |
| US-05 | Tester | have sample property data | features can be tested and demonstrated |
| US-06 | New user | register as a tenant or a property lister | I can use the features meant for my role |
| US-07 | Registered user | log in and log out securely | my account stays protected |
| US-08 | System owner | have access restricted by role | users can only reach the features they are allowed to use |
| US-09 | User | view and update my personal details | my profile always stays correct |
| US-10 | Property lister | add a property with its details | tenants can find it |
| US-11 | User | see the list of available properties | I can explore what is on offer |
| US-12 | Property lister | edit my own property details | the information stays accurate |
| US-13 | Property lister | remove or deactivate my own listing | tenants do not see properties that are no longer available |
| US-14 | Tenant | filter properties by rent, location, bedrooms and amenities | I only see homes that suit me |
| US-15 | Tenant | open a detail page for each property | I can see all its information in one place |
| US-16 | Tenant | see properties on a map | I understand where each one is |
| US-17 | Tenant | know the nearby places and commute time to my office or college | I can judge my daily travel |
| US-18 | Tenant | describe my ideal home in my own words | I do not have to fill many filters |
| US-19 | Tenant | see how my sentence was understood | I can correct it if needed |
| US-20 | Tenant | have normal filters work when the AI is unavailable | I can always search |
| US-21 | Tenant | see my earlier searches | I can run them again quickly |
| US-22 | Tenant | see properties ranked by how well they suit me | I look at the best options first |
| US-23 | Tenant | get a short reason for each recommendation | I understand why a property matches |
| US-24 | Tenant | save properties I like | I can come back to them later |
| US-25 | Tenant | compare saved properties side by side | I can decide between them |
| US-26 | Tenant | get questions generated for a specific property | I know what to ask the landlord |
| US-27 | Tenant | have a visit checklist | I do not forget anything during a visit |
| US-28 | Tenant | save notes after a visit | I can remember what I saw and heard |
| US-29 | Tenant | edit, copy and delete the generated questions | the list fits my needs |
| US-30 | Tenant | ask questions about a property and get answers from its listing | I can trust what I read |
| US-31 | Tenant | see the source of each answer | I can verify it myself |
| US-32 | Tenant | get better landlord questions that use the listing details | my preparation is more useful |
| US-33 | Property lister | have the assistant use my latest listing details | answers stay correct after I edit |
| US-34 | User | have a stable and polished app | I can use it without problems |
| US-35 | User | open the app from a public link | I do not need to run anything locally |
| US-36 | Team member | have security and performance verified | we can present the product with confidence |
| US-37 | Examiner | have a complete report and a clear demo | I can understand and evaluate the project |

## 3. Functional Requirements

| ID | Area | Requirement |
| --- | --- | --- |
| FR-01 | Project Setup | The backend shall provide a health check endpoint that reports the status of the API and the database. |
| FR-02 | Project Setup | The frontend shall be able to call a backend endpoint that reads data from the database. |
| FR-03 | Project Setup | A seed script shall generate 100 to 300 sample property listings, each with a text description. |
| FR-04 | Project Setup | The full environment (database and API) shall start with a single docker compose command. |
| FR-05 | Project Setup | The CI workflow shall run lint checks and tests on every pull request. |
| FR-06 | Authentication and Profile | The system shall allow a user to register with name, email, password and role (tenant or property lister). |
| FR-07 | Authentication and Profile | The system shall not allow two accounts with the same email address. |
| FR-08 | Authentication and Profile | The system shall store passwords only in hashed form. |
| FR-09 | Authentication and Profile | The system shall let a registered user log in and shall issue a JWT token on success. |
| FR-10 | Authentication and Profile | The system shall let a logged in user log out and end the session. |
| FR-11 | Authentication and Profile | The system shall restrict each API route and page according to the user's role. |
| FR-12 | Authentication and Profile | The system shall let a user view their profile details. |
| FR-13 | Authentication and Profile | The system shall let a user update their personal details. |
| FR-14 | Authentication and Profile | The system shall store user data in a users table connected to the FastAPI backend. |
| FR-15 | Property Listing | The system shall let a property lister create a listing with title, description, rent, location, bedrooms and amenities. |
| FR-16 | Property Listing | The system shall validate listing data, for example rent greater than zero and mandatory fields filled. |
| FR-17 | Property Listing | The system shall display available properties to users. |
| FR-18 | Property Listing | The system shall let a lister edit only the listings they own. |
| FR-19 | Property Listing | The system shall let a lister delete or deactivate only the listings they own. |
| FR-20 | Property Listing | The system shall hide deactivated listings from tenants. |
| FR-21 | Property Listing | The system shall store properties in a properties table linked to the lister through a foreign key. |
| FR-22 | Search, Filters and Maps | The system shall filter properties by rent range, location, bedrooms and amenities, alone or in combination. |
| FR-23 | Search, Filters and Maps | The system shall show results in pages (pagination). |
| FR-24 | Search, Filters and Maps | The system shall provide a property detail page with all stored information. |
| FR-25 | Search, Filters and Maps | The system shall convert property addresses to coordinates (geocoding) and show map markers. |
| FR-26 | Search, Filters and Maps | The system shall show nearby places for a property. |
| FR-27 | Search, Filters and Maps | The system shall calculate commute time and distance from a property to a place chosen by the tenant. |
| FR-28 | Search, Filters and Maps | The system shall store location fields and support distance queries such as within 5 km. |
| FR-29 | Natural Language Search | The system shall provide a search box that accepts a sentence such as "2BHK under 20k near my office". |
| FR-30 | Natural Language Search | The system shall use an LLM to convert the sentence into structured JSON filters. |
| FR-31 | Natural Language Search | The system shall validate the LLM output and reject or correct anything invalid before using it. |
| FR-32 | Natural Language Search | The system shall show the understood filters and return matching results. |
| FR-33 | Natural Language Search | The system shall fall back to manual filters when the LLM fails, times out or cannot understand the input. |
| FR-34 | Natural Language Search | The system shall store each user's search history and let them view and reuse it. |
| FR-35 | Matching and Shortlist | The system shall calculate a match score for each property based on budget, location, commute and lifestyle needs. |
| FR-36 | Matching and Shortlist | The system shall rank results by match score. |
| FR-37 | Matching and Shortlist | The system shall show a "why this matches" explanation for each recommendation. |
| FR-38 | Matching and Shortlist | The system shall let a tenant save a property to a shortlist and remove it again. |
| FR-39 | Matching and Shortlist | The system shall let a tenant compare selected properties side by side. |
| FR-40 | Question Generator | The system shall generate property specific questions using the property details and the tenant's needs. |
| FR-41 | Question Generator | The system shall not generate questions about facts already stated in the listing. |
| FR-42 | Question Generator | The system shall provide a visit checklist for each shortlisted property. |
| FR-43 | Question Generator | The system shall let a tenant save and view notes for each property. |
| FR-44 | Question Generator | The system shall let a tenant edit, copy and delete generated questions. |
| FR-45 | RAG Assistant | The system shall split listing text into chunks and store embeddings in the vector database (pgvector). |
| FR-46 | RAG Assistant | The system shall retrieve the most relevant chunks of one property for each question. |
| FR-47 | RAG Assistant | The system shall provide a chat assistant that answers using only the retrieved listing information. |
| FR-48 | RAG Assistant | The system shall show the sources used for each answer. |
| FR-49 | RAG Assistant | The system shall say that the listing does not mention something when the answer is not found, instead of guessing. |
| FR-50 | RAG Assistant | The system shall use the retrieved information to improve question generation. |
| FR-51 | RAG Assistant | The system shall update the stored embeddings whenever a listing is edited. |
| FR-52 | Release | The system shall support the complete journey from registration to listing, search, shortlist, questions and assistant without errors. |
| FR-53 | Release | The frontend, backend and database shall be deployed and reachable through a public URL. |
| FR-54 | Release | The interface shall be consistent and responsive across all pages. |
| FR-55 | Release | The team shall deliver a final report, presentation and demo script. |

## 4. Non Functional Requirements

| ID | Category | Requirement |
| --- | --- | --- |
| NFR-01 | Maintainability | The project shall follow one repository structure with protected main and develop branches, and every change shall go through a reviewed pull request. |
| NFR-02 | Security | Secrets such as API keys and database passwords shall live only in the .env file, which is never committed. |
| NFR-03 | Portability | All team members shall get an identical environment through Docker. |
| NFR-04 | Documentation | The README shall contain setup steps so a new member can run the project without help. |
| NFR-05 | Security | Passwords shall be hashed, JWT tokens shall expire after a fixed time, and login errors shall not reveal whether the email or the password was wrong. |
| NFR-06 | Validation | All input such as email format and password strength shall be validated on both frontend and backend. |
| NFR-07 | Performance | Login and registration shall respond within 2 seconds under normal use. |
| NFR-08 | Usability | Error messages shall be clear and shown next to the field that needs correction. |
| NFR-09 | Security | Ownership shall be checked on the server for every edit and delete request, so one lister can never change another lister's property. |
| NFR-10 | Data Integrity | The foreign key and database constraints shall prevent listings without a valid lister. |
| NFR-11 | Performance | The listing page shall load within 2 seconds for the seeded dataset. |
| NFR-12 | Documentation | All property APIs shall be documented automatically through Swagger. |
| NFR-13 | Performance | Filtered search shall return results within 2 seconds for the seeded dataset. |
| NFR-14 | Reliability | If the Maps service fails, the property list and details shall still work, with a clear message in place of the map. |
| NFR-15 | Security | The Google Maps key shall be restricted and kept in environment settings. |
| NFR-16 | Usability | Filters and the map shall work properly on both desktop and mobile screens. |
| NFR-17 | Reliability | Every LLM call shall have a timeout and a fallback, so an AI failure never breaks the search page. |
| NFR-18 | Security | The LLM key shall stay on the backend, and user text shall be treated only as data, never as instructions. |
| NFR-19 | Privacy | Personal details such as name, email and phone number shall not be sent to the LLM provider. |
| NFR-20 | Maintainability | All LLM calls shall go through one AI module so the model can be changed without rewriting other code. |
| NFR-21 | Explainability | Every match score shall be traceable to visible factors, and the same inputs shall always give the same score. |
| NFR-22 | Accuracy | Missing property data shall not be treated as a good or bad value and shall be shown as not stated. |
| NFR-23 | Privacy | A shortlist shall be visible only to the tenant who created it. |
| NFR-24 | Performance | Ranking and the compare page shall respond within 2 seconds. |
| NFR-25 | Relevance | Generated questions shall be specific to the property and shall not repeat each other. |
| NFR-26 | Reliability | If the AI is unavailable, a standard question list shall be shown instead. |
| NFR-27 | Privacy | Notes and saved questions shall be visible only to the tenant who wrote them. |
| NFR-28 | Usability | The checklist and notes shall be easy to use on a phone during a visit. |
| NFR-29 | Accuracy | Answers shall be grounded in listing data, and any number or fact in an answer shall appear in the retrieved text. |
| NFR-30 | Security | Text written inside a listing shall be treated as data, so instructions hidden in a description cannot change the assistant's behaviour. |
| NFR-31 | Performance | The assistant shall answer within 8 seconds and show a loading indicator while waiting. |
| NFR-32 | Reliability | If retrieval or the LLM fails, the assistant shall show the relevant listing text or a clear message instead of an error page. |
| NFR-33 | Quality | A full regression test shall pass, and no critical bug shall remain open. |
| NFR-34 | Security | Authentication, permissions and secrets shall be checked, and no key or password shall exist in the code or the frontend build. |
| NFR-35 | Performance | Main pages and searches shall respond within 2 seconds under normal use. |
| NFR-36 | Availability | The deployed app shall be reachable during demo and evaluation time, with a local backup ready. |
| NFR-37 | Documentation | The final documentation shall be complete and up to date. |
