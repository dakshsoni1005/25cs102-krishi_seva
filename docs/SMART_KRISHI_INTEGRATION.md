# Smart Krishi Pipeline Integration Documentation

This document describes the server-to-server integration between **KrishiSeva** and the standalone **Smart Krishi** backend application.

---

## 1. Architecture Overview

```
React Frontend (Browser)
      ↓ (Calls /api/smart-krishi/*)
KrishiSeva Backend (Express)
      ↓ (Server-to-Server Adapter: http://localhost:5001)
Smart Krishi Backend (Node.js/Express)
      ↓
Smart Krishi MongoDB Atlas
      ↓
Smart Krishi Dataset / Gemini AI / Open-Meteo
```

> [!IMPORTANT]
> The browser NEVER communicates directly with the standalone Smart Krishi backend. All requests proxy through KrishiSeva backend's `/api/smart-krishi/` adapter layer.

---

## 2. API Mapping Table

| KrishiSeva Endpoint | HTTP Method | Target Smart Krishi Endpoint | Auth Required | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/api/smart-krishi/recommendations` | `POST` | `/api/recommendations` | Yes (JWT) | Primary advisory recommendation pipeline |
| `/api/smart-krishi/crops` | `GET` | `/api/crops` | Yes (JWT) | Catalog of crops supported by Smart Krishi |
| `/api/smart-krishi/districts` | `GET` | `/api/districts` | Yes (JWT) | Catalog of Gujarat districts |
| `/api/smart-krishi/soil/:district` | `GET` | `/api/soil/:district` | Yes (JWT) | District soil health profiles |
| `/api/smart-krishi/fertilizers/:crop` | `GET` | `/api/fertilizers/:crop` | Yes (JWT) | Fertilizer scheduling recommendations |
| `/api/smart-krishi/irrigation/:crop` | `GET` | `/api/irrigation/:crop` | Yes (JWT) | Irrigation guidelines |
| `/api/smart-krishi/diseases/:crop` | `GET` | `/api/diseases/:crop` | Yes (JWT) | Disease profiles for crop |
| `/api/smart-krishi/pests/:crop` | `GET` | `/api/pests/:crop` | Yes (JWT) | Pest profiles for crop |
| `/api/smart-krishi/crop-calendar/:crop` | `GET` | `/api/crop-calendar/:crop` | Yes (JWT) | Growth stage timelines |
| `/api/smart-krishi/weather/:district` | `GET` | `/api/weather/:district` | Yes (JWT) | District micro-climate forecast |
| `/api/smart-krishi/market-prices/:crop` | `GET` | `/api/market-prices/:crop` | Yes (JWT) | APMC crop prices |
| `/api/smart-krishi/government-advisories` | `GET` | `/api/government-advisories` | Yes (JWT) | Regional agricultural advisories |
| `/api/integrations/smart-krishi/health` | `GET` | `/health` | Public | Integration status check |

---

## 3. Recommendation Request Format

`POST /api/smart-krishi/recommendations`

```json
{
  "district": "Rajkot",
  "crop": "Cotton",
  "season": "Kharif"
}
```

---

## 4. Response Shape

```json
{
  "success": true,
  "data": {
    "source": "smart_krishi",
    "recommendations": [
      {
        "id": "sk-rec-0",
        "category": "Irrigation",
        "priority": "HIGH",
        "title": "Rain Expected: Delay Next Irrigation Cycle",
        "explanation": "High precipitation probability (85%) detected in your area.",
        "reason": "Applying irrigation prior to rain risks root rot.",
        "action": "Pause drip irrigation for 24-48 hours.",
        "benefit": "Saves water and prevents root saturation.",
        "timestamp": "2026-08-15T03:50:00.000Z"
      }
    ],
    "weather": {},
    "soil": {},
    "fertilizer": {},
    "irrigation": {},
    "disease": [],
    "pests": [],
    "cropCalendar": {},
    "market": {},
    "governmentAdvisories": []
  }
}
```

---

## 5. Environment Variables Configuration

Add the following parameters to [backend/.env](file:///e:/krishiseva/backend/.env):

```env
# Smart Krishi Adapter Parameters
SMART_KRISHI_API_URL=http://localhost:5001
SMART_KRISHI_TIMEOUT_MS=15000
SMART_KRISHI_API_KEY=
```

---

## 6. Health Check Endpoint

Check integration status:

`GET http://localhost:5000/api/integrations/smart-krishi/health`

Response when healthy:
```json
{
  "success": true,
  "data": {
    "service": "smart-krishi",
    "status": "healthy"
  }
}
```

Response when offline / 503:
```json
{
  "success": false,
  "message": "Smart Krishi service is temporarily unavailable.",
  "code": "SMART_KRISHI_UNAVAILABLE"
}
```

---

## 7. Local Development Setup

1. Start KrishiSeva Backend on Port 5000:
   ```bash
   cd e:\krishiseva\backend
   npm run dev
   ```
2. Start Smart Krishi Backend on Port 5001:
   ```bash
   cd d:\smart_krishi\naitri_project-main
   npm start
   ```
3. Start KrishiSeva Frontend on Port 5173:
   ```bash
   cd e:\krishiseva\frontend
   npm run dev
   ```
