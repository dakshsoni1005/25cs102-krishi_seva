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
