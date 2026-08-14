# KrishiSeva Unified Backend API Documentation

All API endpoints are prefixed with `/api`. Success and error responses follow strict specifications.

## Global Headers
For authenticated endpoints, send:
`Authorization: Bearer <your_jwt_access_token>`

---

## 1. Authentication Module (`/api/auth`)

### Register Farmer Profile
- **Method:** `POST`
- **URL:** `/api/auth/register`
- **Authentication:** None
- **Request Body:**
  ```json
  {
    "fullName": "Ramesh Patel",
    "mobileNumber": "9876543210",
    "email": "ramesh@smartfarm.com",
    "password": "password123",
    "state": "Gujarat",
    "district": "Anand",
    "taluka": "Anand",
    "village": "Hadgud",
    "farmSize": 12.5,
    "mainCrop": "Cotton",
    "irrigationType": "Drip Irrigation"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Farmer registered successfully",
    "data": {
      "token": "access_token_jwt",
      "refreshToken": "refresh_token_jwt",
      "farmer": { "fullName": "Ramesh Patel", ... }
    }
  }
  ```

### Login
- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Request Body:**
  ```json
  {
    "mobileNumber": "9876543210",
    "password": "password123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Logged in successfully",
    "data": {
      "token": "access_token_jwt",
      "refreshToken": "refresh_token_jwt",
      "farmer": { ... }
    }
  }
  ```

---

## 2. Smart Krishi Engine (`/api/smart-krishi`)

### Get Dashboard Overview Stats
- **Method:** `GET`
- **URL:** `/api/smart-krishi/overview`
- **Authentication:** Required
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Dashboard overview statistics retrieved",
    "data": {
      "fullName": "Ramesh Patel",
      "location": "Hadgud, Anand, Anand",
      "soilHealthScore": 78,
      "activeCropsCount": 2,
      "activeCropsArea": 12.5,
      "unreadNotificationsCount": 2
    }
  }
  ```

### Get Smart Recommendations List
- **Method:** `GET`
- **URL:** `/api/smart-krishi/recommendations`
- **Authentication:** Required
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Smart recommendations retrieved",
    "data": {
      "recommendations": [
        {
          "id": "60d000000000000000000001",
          "category": "Irrigation",
          "priority": "HIGH",
          "title": "Rain Expected: Delay Next Irrigation Cycle",
          "explanation": "...",
          "action": "Delay irrigation for 24-48 hours.",
          "timestamp": "2026-08-15T02:00:00.000Z"
        }
      ]
    }
  }
  ```

---

## 3. AI Pest Scanner (`/api/pest-scanner`)

### Analyze Leaf Disease
- **Method:** `POST`
- **URL:** `/api/pest-scanner/analyze`
- **Headers:** `Content-Type: multipart/form-data`
- **Authentication:** Required
- **Request Body (FormData):**
  - `file`: (binary image file, allowed: jpg, jpeg, png, webp)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Leaf disease scan completed successfully",
    "data": {
      "result": {
        "id": "60d000000000000000000009",
        "imageUrl": "/uploads/leaf_17182939102.png",
        "diseaseDetected": "Leaf Blight (Alternaria)",
        "confidence": 94,
        "severity": "Moderate",
        "symptoms": ["..."],
        "treatment": {
          "chemical": "...",
          "organic": "..."
        }
      }
    }
  }
  ```

---

## 4. Krishi AI Guru (`/api/ai-guru`)

### Send Chat Message
- **Method:** `POST`
- **URL:** `/api/ai-guru/chat`
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "message": "What fertilizer should I apply for cotton?",
    "conversationId": "optional_existing_id"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "AI response generated successfully",
    "data": {
      "conversationId": "60d000000000000000000005",
      "title": "What fertilizer should I...",
      "messages": [
        { "sender": "user", "text": "What fertilizer..." },
        { "sender": "ai", "text": "For Bt Cotton during..." }
      ]
    }
  }
  ```

---

## 5. Soil Advisory (`/api/soil`)

### Get Soil Analysis Report
- **Method:** `GET`
- **URL:** `/api/soil`
- **Authentication:** Required
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Soil health parameters retrieved",
    "data": {
      "healthScore": 78,
      "type": "Medium Black Clayey Soil",
      "ph": 7.2,
      "nutrients": {
        "nitrogen": { "value": 180, "status": "Low" },
        "phosphorus": { "value": 18, "status": "Medium" }
      }
    }
  }
  ```

---

## 6. Weather Forecast (`/api/weather`)

### Get Weather Condition and alerts
- **Method:** `GET`
- **URL:** `/api/weather`
- **Authentication:** Required
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Weather data retrieved successfully",
    "data": {
      "current": { "temp": 31, "humidity": 78, "condition": "Partly Cloudy" },
      "forecast": [ ... ],
      "alerts": [ ... ]
    }
  }
  ```

---

## 7. Market Prices (`/api/market`)

### Query Market Prices
- **Method:** `GET`
- **URL:** `/api/market`
- **Authentication:** Required
- **Query Params (Optional):**
  - `crop`: Filter by Crop name
  - `district`: Filter by District
  - `search`: search term
  - `sortBy`: `price_desc`, `price_asc`, `crop`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Market prices retrieved successfully",
    "data": {
      "prices": [
        { "id": "...", "crop": "Cotton", "market": "Gondal APMC", "avgPrice": 7200 }
      ]
    }
  }
  ```

---

## 8. Government Schemes (`/api/schemes`)

### Check Scheme Eligibility
- **Method:** `POST`
- **URL:** `/api/schemes/:id/check-eligibility`
- **Authentication:** Required
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Eligibility check completed",
    "data": {
      "eligible": true,
      "reason": "You meet all eligibility criteria...",
      "status": "Eligible"
    }
  }
  ```
