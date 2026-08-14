# KrishiSeva Dummy Data Audit Report

This audit documents every data source, seed file, service layer fallback, and frontend mock array across the codebase.

---

## Data Audit Classification Table

| File Path | Data Description | Data Type | Used By Component / Service | Action |
| :--- | :--- | :--- | :--- | :--- |
| `backend/src/database/seed/districts.seed.js` | Official 33 Gujarat Districts | REFERENCE | Seeder & District Selector | KEEP |
| `backend/src/database/seed/crops.seed.js` | Standard Gujarat Crops & Stages | REFERENCE | Seeder & Crop Services | KEEP |
| `backend/src/database/seed/schemes.seed.js` | Real PM-KISAN / iKhedut Schemes | DATABASE | Seeder & Scheme Module | KEEP |
| `backend/src/database/seed/market.seed.js` | APMC Market Prices (Cotton, Wheat) | DATABASE | Seeder & Market Service | KEEP |
| `backend/src/integrations/gemini/gemini.client.js` | Keyword-based QA Fallback Array | MOCK | AI Guru Module | REMOVE |
| `backend/src/modules/soil-advisory/soil.service.js` | Default Soil Health Object Fallback | MOCK | Soil Advisory Module | REMOVE |
| `backend/src/modules/market-prices/market.service.js` | Hardcoded `mockPriceTrends` Dictionary | MOCK | Market Prices Module | REMOVE |
| `backend/src/modules/pest-scanner/pestScanner.service.js` | Mock Leaf Disease Logic | MOCK | Pest Scanner Module | REMOVE |
| `frontend/src/mock/crops.js` | Mock Crops & Stage Timeline | MOCK | Crop Management View | REMOVE |
| `frontend/src/mock/farmer.js` | Mock Profile Object ("Raj Patel") | MOCK | Auth / Context | REMOVE |
| `frontend/src/mock/chat.js` | Hardcoded AI Guru Chat Array | MOCK | AI Guru View | REMOVE |
| `frontend/src/mock/market.js` | Hardcoded APMC Price Cards | MOCK | Market Prices View | REMOVE |
| `frontend/src/mock/notifications.js` | Hardcoded Notification Items | MOCK | Notification Service | REMOVE |
| `frontend/src/mock/pests.js` | Hardcoded Disease Scan Results | MOCK | Pest Scanner View | REMOVE |
| `frontend/src/mock/recommendations.js` | Hardcoded Recommendation Cards | MOCK | Smart Krishi View | REMOVE |
| `frontend/src/mock/schemes.js` | Hardcoded Scheme Submissions | MOCK | Schemes View | REMOVE |
| `frontend/src/mock/soil.js` | Hardcoded NPK Soil Test Metrics | MOCK | Soil Advisory View | REMOVE |
| `frontend/src/mock/weather.js` | Hardcoded 7-Day Forecast | MOCK | Weather View | REMOVE |

---

## Action Legend
- **KEEP:** Legitimate reference dataset required for production database seeding or lookup dictionaries.
- **REMOVE:** Fake, simulated, or fallback mock data that must be deleted or replaced with honest error/empty states.
- **REPLACE_WITH_API:** Hardcoded data that will be replaced with real backend API invocations.
- **REPLACE_WITH_DATABASE:** Hardcoded fallback replaced with direct Mongoose collection queries.
