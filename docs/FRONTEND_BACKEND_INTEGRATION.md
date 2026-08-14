# KrishiSeva Frontend-Backend API Integration Map

This guide documents the communication contract between the React Frontend services and the Express/NodeJS Mongoose backend layer.

---

## 1. Authentication Module (`authService.js`)

| Service Method | HTTP Method | Backend Endpoint | Auth | Request Payload | Response Data Shape | UI Component / View |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `login` | `POST` | `/api/auth/login` | Public | `{ mobileNumber, password }` | `{ token, refreshToken, farmer }` | [Login.jsx](file:///e:/krishiseva/frontend/src/views/Login.jsx) |
| `register` | `POST` | `/api/auth/register` | Public | Farmer Profile details | `{ token, refreshToken, farmer }` | [Register.jsx](file:///e:/krishiseva/frontend/src/views/Register.jsx) |
| `logout` | `POST` | `/api/auth/logout` | Protected | None | `{ success: true }` | Sidebar logout click |
| `getCurrentFarmer` | `GET` | `/api/auth/me` | Protected | None | `{ farmer }` | AppContext startup restoration |

---

## 2. Farmer & Farm Modules (`farmerService.js`, `farmService.js`)

| Service Method | HTTP Method | Backend Endpoint | Auth | Request Payload | Response Data Shape | UI Component / View |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `farmerService.getProfile` | `GET` | `/api/farmers/profile` | Protected | None | `{ profile }` | Profile / Settings |
| `farmerService.updateProfile`| `PUT` | `/api/farmers/profile` | Protected | Updated profile object | `{ profile }` | [Settings.jsx](file:///e:/krishiseva/frontend/src/views/Settings.jsx) |
| `farmService.getFarms` | `GET` | `/api/farms` | Protected | None | `{ farms: [...] }` | Dashboard sidebar overview |
| `farmService.createFarm` | `POST` | `/api/farms` | Protected | `{ name, area, soilType, irrigationType }` | `{ farm }` | Farm Parcel addition form |
| `farmService.deleteFarm` | `DELETE` | `/api/farms/:id` | Protected | None | `{ message: "..." }` | Farm settings panel delete |

---

## 3. Crop Management Module (`cropService.js`)

| Service Method | HTTP Method | Backend Endpoint | Auth | Request Payload | Response Data Shape | UI Component / View |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `getActiveCrops` | `GET` | `/api/crops` | Protected | None | `{ crops: [...] }` | [CropManagement.jsx](file:///e:/krishiseva/frontend/src/views/CropManagement.jsx) |
| `createCropCycle` | `POST` | `/api/crops` | Protected | Crop cycle attributes | `{ cycle }` | New crop sowing modal |
| `createCropTask` | `POST` | `/api/crops/tasks` | Protected | `{ title, taskType, dueDate, cropCycleId }` | `{ task }` | Task management form |
| `toggleTaskStatus` | `PATCH` | `/api/crops/tasks/:taskId` | Protected | `{ status: "completed" / "skipped" / "pending" }` | `{ task }` | Interactive checklist tick |

---

## 4. Soil & Agronomy Advisories (`soilService.js`, `recommendationService.js`)

| Service Method | HTTP Method | Backend Endpoint | Auth | Request Payload | Response Data Shape | UI Component / View |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `getSoilAdvisory` | `GET` | `/api/soil/advisory` | Protected | None | NPK levels, health score, soil type, and crop recommendation arrays | [SoilAdvisory.jsx](file:///e:/krishiseva/frontend/src/views/SoilAdvisory.jsx) |
| `getRecommendations` | `GET` | `/api/smart-krishi/recommendations` | Protected | None | List of recommendations (title, description, priority, type) | [SmartKrishi.jsx](file:///e:/krishiseva/frontend/src/views/SmartKrishi.jsx) |
| `refreshRecommendations`| `POST` | `/api/smart-krishi/refresh` | Protected | None | List of recommendations | Refresh button action |

---

## 5. Weather Forecasting (`weatherService.js`)

| Service Method | HTTP Method | Backend Endpoint | Auth | Request Payload | Response Data Shape | UI Component / View |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `getWeatherReport` | `GET` | `/api/weather/forecast` | Protected | None | Current metrics (temp, humidity, rain probability) & 5-day forecasts | [Weather.jsx](file:///e:/krishiseva/frontend/src/views/Weather.jsx) |

---

## 6. APMC Mandi Rates (`marketService.js`)

| Service Method | HTTP Method | Backend Endpoint | Auth | Request Payload | Response Data Shape | UI Component / View |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `getMarketPrices` | `GET` | `/api/market/prices` | Protected | None | Current rates array | [MarketPrices.jsx](file:///e:/krishiseva/frontend/src/views/MarketPrices.jsx) |
| `getWatchlist` | `GET` | `/api/market/watchlist` | Protected | None | Watched mandis list | Mandatory watchlist panels |
| `toggleWatchlist` | `POST` | `/api/market/watchlist` | Protected | `{ cropName, market }` | Watchlist result object | Mandi watch tick toggles |

---

## 7. AI Pest Scanner (`pestScannerService.js`)

| Service Method | HTTP Method | Backend Endpoint | Auth | Request Payload | Response Data Shape | UI Component / View |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `analyzeLeafImage` | `POST` | `/api/pest-scanner/analyze` | Protected | FormData with file payload | Leaf disease names, confidence index, chemical/organic treatment guidelines | [PestScanner.jsx](file:///e:/krishiseva/frontend/src/views/PestScanner.jsx) |

---

## 8. Krishi AI Guru (`aiGuruService.js`)

| Service Method | HTTP Method | Backend Endpoint | Auth | Request Payload | Response Data Shape | UI Component / View |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `getConversations` | `GET` | `/api/ai-guru/conversations` | Protected | None | List of conversation headers | [AIGuru.jsx](file:///e:/krishiseva/frontend/src/views/AIGuru.jsx) history |
| `getConversationDetails`| `GET` | `/api/ai-guru/conversations/:id` | Protected | None | Message list thread | Chat dialog thread |
| `sendMessage` | `POST` | `/api/ai-guru/chat` | Protected | `{ messageText, conversationId }` | Updated conversation message logs | Live reply stream |
| `deleteConversation` | `DELETE` | `/api/ai-guru/conversations/:id` | Protected | None | Delete confirmation | Clear thread trash button |

---

## 9. Government Schemes & Eligibility (`schemeService.js`)

| Service Method | HTTP Method | Backend Endpoint | Auth | Request Payload | Response Data Shape | UI Component / View |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `getSchemesList` | `GET` | `/api/schemes` | Protected | None | Unified central/state schemes list | [GovernmentSchemes.jsx](file:///e:/krishiseva/frontend/src/views/GovernmentSchemes.jsx) |
| `checkEligibility` | `POST` | `/api/schemes/:id/check-eligibility` | Protected | None | Eligible flag, compatibility score, matched criteria, document lists | Eligibility validation checks |

---

## 10. Push Notifications (`notificationService.js`)

| Service Method | HTTP Method | Backend Endpoint | Auth | Request Payload | Response Data Shape | UI Component / View |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `getNotifications` | `GET` | `/api/notifications` | Protected | None | Unread messages registry | Header notification list |
| `markAsRead` | `PATCH` | `/api/notifications/:id/read` | Protected | None | Updated notifications state list | "Mark Read" hover buttons |
| `markAllAsRead` | `PATCH` | `/api/notifications/read-all` | Protected | None | Updated notifications state list | "Clear All" click actions |
