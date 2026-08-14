module.exports = {
  ROLES: {
    FARMER: "farmer",
    ADMIN: "admin"
  },
  
  CROP_STAGES: [
    "land_preparation",
    "sowing",
    "germination",
    "vegetative",
    "flowering",
    "fruit_development",
    "maturity",
    "harvest"
  ],

  STAGE_MAPPINGS: {
    "Land Preparation": "land_preparation",
    "Sowing": "sowing",
    "Germination": "germination",
    "Vegetative Growth": "vegetative",
    "Flowering": "flowering",
    "Fruit/Grain Development": "fruit_development",
    "Maturity": "maturity",
    "Harvest": "harvest"
  },

  STAGE_DISPLAY_MAPPINGS: {
    "land_preparation": "Land Preparation",
    "sowing": "Sowing",
    "germination": "Germination",
    "vegetative": "Vegetative Growth",
    "flowering": "Flowering",
    "fruit_development": "Fruit/Grain Development",
    "maturity": "Maturity",
    "harvest": "Harvest"
  },
  
  NOTIFICATION_TYPES: {
    WEATHER: "weather",
    CROP: "crop",
    PEST: "pest",
    MARKET: "market",
    GOVERNMENT: "government",
    RECOMMENDATION: "recommendation",
    SYSTEM: "system"
  },
  
  PRIORITY_LEVELS: {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    CRITICAL: "critical"
  },

  RECOMMENDATION_CATEGORIES: {
    IRRIGATION: "Irrigation",
    FERTILIZER: "Fertilizer",
    PEST_CONTROL: "Pest Control",
    CROP_HEALTH: "Crop Health",
    WEATHER_ACTION: "Weather Action",
    MARKET_TIMING: "Market Timing",
    HARVEST_TIMING: "Harvest Timing"
  }
};
