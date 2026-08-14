# KrishiSeva Dummy Data Removal Report

This document details the codebase-wide dummy data removal and real data enforcement across the **KrishiSeva** AgriTech platform.

---

## 1. Summary of Removed Dummy & Mock Files
The entire `frontend/src/mock/` directory containing mock data arrays was permanently removed:
- Deleted `frontend/src/mock/crops.js`
- Deleted `frontend/src/mock/farmer.js`
- Deleted `frontend/src/mock/chat.js`
- Deleted `frontend/src/mock/market.js`
- Deleted `frontend/src/mock/notifications.js`
- Deleted `frontend/src/mock/pests.js`
- Deleted `frontend/src/mock/recommendations.js`
- Deleted `frontend/src/mock/schemes.js`
- Deleted `frontend/src/mock/soil.js`
- Deleted `frontend/src/mock/weather.js`

*Note: The crop stage glossary descriptions were extracted from `crops.js` and preserved in [frontend/src/config/constants.js](file:///e:/krishiseva/frontend/src/config/constants.js) as a clean UI lookup object.*

---

## 2. Removed Backend & Service Fallback Logic
1. **Gemini AI Client ([gemini.client.js](file:///e:/krishiseva/backend/src/integrations/gemini/gemini.client.js)):** Removed local keyword-matching QA response fallback. Throws HTTP `503 AI_SERVICE_UNAVAILABLE` when `GEMINI_API_KEY` is missing or requests time out.
2. **Soil Service ([soil.service.js](file:///e:/krishiseva/backend/src/modules/soil-advisory/soil.service.js)):** Removed default mock soil report object. Returns `null` when no soil profile exists in MongoDB, prompting an honest `EmptyState` in the UI.
3. **Market Service ([market.service.js](file:///e:/krishiseva/backend/src/modules/market-prices/market.service.js)):** Removed hardcoded `mockPriceTrends` array. Queries historical MongoDB `MarketPrice` collection records.
4. **Weather Client ([weather.client.js](file:///e:/krishiseva/backend/src/integrations/weather/weather.client.js)):** Removed static `31°C` fallback weather object. Throws HTTP `503 WEATHER_SERVICE_UNAVAILABLE` on Open-Meteo REST API failure.
5. **Pest Scanner Service ([pestScannerService.js](file:///e:/krishiseva/frontend/src/services/pestScannerService.js)):** Removed mock image Blob construction fallback. Enforces valid `File` binary inputs.

---

## 3. UI Component Data Contracts (`data | loading | error | empty`)
Every API-driven view module was updated to follow strict state rendering rules:
- **`Dashboard.jsx`:** Renders live farmer profile, crop count, and unread notification metrics loaded from `farmerService`, `farmService`, and `notificationService`.
- **`PestScanner.jsx`:** Removed demo leaf selection buttons. Renders `<ErrorState>` with a `Try Again` retry button when the ML inference service returns 503.
- **`AiGuru.jsx`:** Pushes an explicit system warning message into the chat log when Gemini API is unconfigured or unavailable.
- **`SoilAdvisory.jsx`:** Renders an `<EmptyState>` card with a `Refresh Region Data` action when no soil report is present.
- **`Weather.jsx`:** Renders `<ErrorState title="Weather Data Unavailable">` with `Retry Weather Request` action on Open-Meteo query failure.
- **`MarketPrices.jsx`:** Expanded district dropdown filter to cover all **33 official Gujarat districts**. Renders `<ErrorState>` on database endpoint errors.
- **`GovernmentSchemes.jsx`:** Renders `<EmptyState>` when no scheme matches current filters and `<ErrorState>` on API failure.

---

## 4. Database Sources & Reference Datasets Retained
- **Official Districts:** 33 Gujarat districts ([districts.seed.js](file:///e:/krishiseva/backend/src/database/seed/districts.seed.js)).
- **Crop Reference Data:** Standard crops (Bt Cotton, GG-20 Groundnut, GW-496 Wheat, etc.) ([crops.seed.js](file:///e:/krishiseva/backend/src/database/seed/crops.seed.js)).
- **Verified APMC Rates:** APMC market database records ([market.seed.js](file:///e:/krishiseva/backend/src/database/seed/market.seed.js)).
- **Government Schemes:** Verified PM-KISAN, PMFBY, and iKhedut scheme records ([schemes.seed.js](file:///e:/krishiseva/backend/src/database/seed/schemes.seed.js)).
- **Development Demo Account:** "Ramesh Patel" (`9876543210`) in `seeder.js` for development seed population (`npm run seed`).

---

## 5. Audit Script
Created [scripts/auditDummy.js](file:///e:/krishiseva/scripts/auditDummy.js) linked to root `npm run audit:dummy` to scan for suspicious mock/dummy patterns across source files.
