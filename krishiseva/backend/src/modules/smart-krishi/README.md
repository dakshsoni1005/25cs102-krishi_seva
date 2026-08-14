# naitri_project
# Smart Krishi Decision Dashboard (React Frontend)

A premium, responsive single-page web dashboard built with **React** and **Vite** for the Smart Krishi agricultural recommendation platform. The UI features a glassmorphic design theme, custom interactive input dropdowns, dynamic weather forecast carousels, and responsive error/warning boundaries.

---

## ✨ Features

- 🌌 **Premium Aesthetics**: Styled with a dark/light glassmorphic HSL palette, dynamic backdrop filters, smooth focus ring indicators, and custom micro-animations.
- 🌾 **Interactive Query Filter**: Simple selectors for Gujarat districts, crop varieties, and seasonal parameters.
- ⚠️ **Soil Suitability Warnings**: Early-warning warning cards that intercept suitability mismatch errors (HTTP 400) and list alternative crops as click-to-query action buttons.
- 🌦️ **Meteo Weather Cards**: Renders live weather metrics (current temperature, wind speed, rain probability) alongside 7-day daily forecast graphs.
- 🧪 **Soil & Fertilizer Cards**: Shows NPK soil status, optimal pH thresholds, and basal/flowering/vegetative fertilizer dosing schedules.
- 🪲 **Disease & Pest Alerts**: Dynamic hazard indicators mapping grey root rot, pink bollworm, and chemical/biological control remedies.

---

## 🛠️ Technology Stack

- **Framework**: React 19 (via Vite)
- **Styling**: Vanilla CSS variables & custom media query layout grids
- **Icons**: Lucide React
- **API Client**: Axios (configured with proxy mapping)
- **Routing**: React Router DOM (HashRouting setup)

---

## 📂 Project Structure

```text
frontend/
├── dist/                  # Production-optimized build assets
├── src/
│   ├── components/        # Reusable dashboard widgets & drop panels
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── DistrictDropdown.jsx
│   │   ├── CropDropdown.jsx
│   │   ├── SeasonDropdown.jsx
│   │   ├── RecommendationForm.jsx
│   │   ├── SoilCard.jsx
│   │   ├── WeatherCard.jsx
│   │   ├── ForecastCard.jsx
│   │   ├── FertilizerCard.jsx
│   │   ├── IrrigationCard.jsx
│   │   ├── DiseaseCard.jsx
│   │   ├── PestCard.jsx
│   │   ├── AdvisoryCard.jsx
│   │   ├── AIRecommendationCard.jsx
│   │   ├── Loading.jsx
│   │   └── Footer.jsx
│   │
│   ├── pages/             # Layout view pages
│   │   ├── Home.jsx
│   │   ├── Recommendation.jsx
│   │   ├── Weather.jsx
│   │   ├── Market.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   │
│   ├── services/          # HTTP request handlers
│   │   └── api.js         # Axios queries pointing to localhost:5000
│   │
│   ├── App.jsx            # Application Router structure
│   ├── index.css          # Design system variables & media grids
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Installation
Navigate to the frontend folder and install all dependencies:
```bash
npm install
```

### 3. Running Locally
Launch the Vite development server:
```bash
npm run dev
```
The application will open at `http://localhost:5173`. Make sure your backend server is running on `http://localhost:5000` to handle API recommendations and drop-down loaders.

### 4. Build for Production
To bundle and optimize the project for deployment:
```bash
npm run build
```
Vite will output the static assets to the `dist/` directory.




# Smart Krishi Recommendation Backend API

A production-ready Node.js and Express REST API backend designed to deliver localized agricultural advisories, crop suitability analyses, and market trends for Gujarat. 

The backend architecture uses a normalized database of 13 separate MongoDB collections, integrates with the keyless Open-Meteo API for real-time weather/forecasting, calculates rule-based safety alerts, and leverages Google Gemini AI (`gemini-1.5-flash`) to generate tailor-made advisories.

---

## 🛠️ Stack & Technologies

- **Runtime & Web Framework**: Node.js & Express (JavaScript ES6 CommonJS)
- **Database**: MongoDB Atlas with Mongoose Schemas, Indexing, and populated references
- **Weather API**: Open-Meteo Forecast API (keyless, location-based query)
- **AI Recommendation Engine**: Google Generative AI SDK (`gemini-1.5-flash`)
- **Development Server**: Nodemon (hot-reloading)
- **HTTP Client**: Axios

---

## 📁 Project Directory Structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── db.js                   # Mongoose MongoDB connection
│   │   └── gemini.js               # Google Generative AI client setup
│   │
│   ├── models/                     # Mongoose Schema Definitions
│   │   ├── Crop.js                 # Crops
│   │   ├── CropCalendar.js         # Crop timings by district
│   │   ├── CropRequirement.js      # Ideal soil & nutrient targets
│   │   ├── Disease.js              # Plant disease remedies
│   │   ├── District.js             # District lat/lng and regions
│   │   ├── Fertilizer.js           # Target fertilizer applications
│   │   ├── Irrigation.js           # Water intervals by crop/district
│   │   ├── MarketPrice.js          # APMC price indexes
│   │   ├── Pest.js                 # Pest control guides
│   │   ├── SoilData.js             # Local soil ph/npk records
│   │   ├── User.js                 # Farmer, admin, and expert profiles
│   │   └── WeatherCache.js         # Cached district weather data
│   │
│   ├── controllers/                # Request Controllers
│   │   ├── cropCalendarController.js
│   │   ├── cropController.js
│   │   ├── diseaseController.js
│   │   ├── districtController.js
│   │   ├── fertilizerController.js
│   │   ├── governmentAdvisoryController.js
│   │   ├── irrigationController.js
│   │   ├── marketPriceController.js
│   │   ├── pestController.js
│   │   ├── recommendationController.js
│   │   ├── soilController.js
│   │   └── weatherController.js
│   │
│   ├── routes/                     # Express Routers
│   │   ├── cropCalendarRoutes.js
│   │   ├── cropRoutes.js
│   │   ├── diseaseRoutes.js
│   │   ├── districtRoutes.js
│   │   ├── fertilizerRoutes.js
│   │   ├── governmentAdvisoryRoutes.js
│   │   ├── irrigationRoutes.js
│   │   ├── marketPriceRoutes.js
│   │   ├── pestRoutes.js
│   │   ├── recommendationRoutes.js
│   │   ├── soilRoutes.js
│   │   └── weatherRoutes.js
│   │
│   ├── services/
│   │   ├── recommendationService.js # Compiles crop context + AI generation
│   │   └── weatherService.js        # Queries Open-Meteo with DB cache fallbacks
│   │
│   ├── utils/
│   │   └── resolve.js               # Helper to resolve names/IDs for crops & districts
│   │
│   ├── scripts/
│   │   └── seed.js                  # Idempotent database seeder
│   │
│   └── app.js                       # Express core middleware & route binding
│
├── .env                             # Port & Atlas Credentials (git-ignored)
├── .env.example                     # Environment template
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` root directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/your_db_name
GEMINI_API_KEY=AIzaSyABFrZEOLae3PMLmqE-lbHK9juIPyfd2WA
```
*Note: No weather API key is required as the WeatherService utilizes the free Open-Meteo API.*

---

## 🚀 Setup & Execution

### 1. Install Packages
```bash
npm install
```

### 2. Seeding & Normalizing the Database
Ensure the raw JSON dataset (`gujarat_agri_dataset.json`) is placed in the project root's `dataset.json/` folder, then execute the seeder script. This drops any old collections, parses the data, builds indexes, and normalizes it into 13 collections inside MongoDB Atlas:
```bash
npm run seed
```

### 3. Running the Server (Development)
```bash
npm run dev
```

---

## 📡 REST API Reference

All endpoints automatically resolve parameters (such as `:crop` or `:district`) by either their **Database ObjectId** or their **Name (case-insensitive)**.

### 1. Recommendations Engine (POST)
- **Endpoint**: `POST /api/recommendations`
- **Body Options**:
  ```json
  {
    "district": "Rajkot",
    "crop": "Cotton",
    "season": "Kharif"
  }
  ```
- **Description**: Pulls soil, calendar, fertilizer, and live weather conditions, applies rule-based alerts, feeds them to Gemini, and returns a tailored advisor.
- **Rule-Based Trigger Thresholds**:
  - `Rain probability > 70%` $\rightarrow$ Adds warning: "Skip irrigation today".
  - `Humidity > 85%` $\rightarrow$ Adds warning: "High fungal disease risk".
  - `Wind speed > 25 km/h` $\rightarrow$ Adds warning: "Avoid pesticide spraying".
  - `Temperature > 38°C` $\rightarrow$ Adds warning: "Heat stress alert".

### 2. Crops API
- `GET /api/crops` — Get all unique crops.
- `GET /api/crops/:id` — Get a specific crop's metadata.

### 3. Districts API
- `GET /api/districts` — Get all unique districts sorted alphabetically.
- `GET /api/districts/:id` — Get a specific district's details.

### 4. Soil API
- `GET /api/soil/:district` — Retrieve pH, textures, and NPK metrics.

### 5. Fertilizers API
- `GET /api/fertilizers/:crop` — Retrieve stage-by-stage crop fertilizer applications.

### 6. Irrigation API
- `GET /api/irrigation/:crop` — Retrieve watering intervals and target volume parameters.

### 7. Diseases API
- `GET /api/diseases/:crop` — List known crop diseases, symptoms, and cures.

### 8. Pests API
- `GET /api/pests/:crop` — List pests and biological/chemical controls.

### 9. Crop Calendar API
- `GET /api/crop-calendar/:crop` — Get sowing, growth, and harvesting timelines.

### 10. Weather API
- `GET /api/weather/:district` — Get live current weather conditions and 7-day forecast.

### 11. Market Price Index API
- `GET /api/market-prices/:crop` — Get latest APMC price per quintal mapped across regions.

### 12. Advisories API
- `GET /api/government-advisories` — Get government schema advisories.
  - Optional Query filter: `/api/government-advisories?district=Ahmedabad`
