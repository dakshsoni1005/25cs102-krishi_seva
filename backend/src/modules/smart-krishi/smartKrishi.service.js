const AIRecommendation = require("../../database/models/AIRecommendation");
const FarmerProfile = require("../../database/models/FarmerProfile");
const SoilProfile = require("../../database/models/SoilProfile");
const CropCycle = require("../../database/models/CropCycle");
const CropTask = require("../../database/models/CropTask");
const { fetchWeatherFromProvider } = require("../../integrations/weather/weather.client");
const MarketPrice = require("../../database/models/MarketPrice");
const logger = require("../../utils/logger");

const getRecommendations = async (farmerId) => {
  let recs = await AIRecommendation.find({ farmerId }).lean();
  
  // If empty, trigger a mock rules refresh to populate initially
  if (recs.length === 0) {
    recs = await refreshRecommendations(farmerId);
  }

  return formatRecommendations(recs);
};

const refreshRecommendations = async (farmerId) => {
  logger.info(`Re-evaluating agronomy rules engine for farmer: ${farmerId}`);

  // 1. Gather all inputs
  const profile = await FarmerProfile.findOne({ userId: farmerId });
  const soil = await SoilProfile.findOne({ farmerId });
  const crops = await CropCycle.find({ farmerId, status: "active" });
  
  // Coordinates for Anand or profile mapping
  let lat = 22.5694;
  let lon = 72.9904;
  if (profile && profile.district === "Rajkot") {
    lat = 22.3039;
    lon = 70.8022;
  }
  const weather = await fetchWeatherFromProvider(lat, lon);

  // Clear existing recommendation records
  await AIRecommendation.deleteMany({ farmerId });

  const newRecs = [];

  // ==========================================
  // agronomic rule 1: IRRIGATION vs RAINFALL
  // ==========================================
  if (weather.current.rainProbability > 70) {
    newRecs.push({
      farmerId,
      type: "irrigation",
      priority: "high",
      title: "Rain Expected: Delay Next Irrigation Cycle",
      description: `Weather forecast indicates a high probability (${weather.current.rainProbability}%) of heavy rain in your village. Irrigation now will cause waterlogging.`,
      reason: `Precipitation probability exceeds 70% under SW wind directions.`,
      action: "Delay irrigation for 24-48 hours. Inspect field drainage blocks.",
      source: "rule_engine",
      metadata: {
        benefit: "Prevents root saturation, limits nutrient leaching, and saves water."
      }
    });
  } else {
    newRecs.push({
      farmerId,
      type: "irrigation",
      priority: "medium",
      title: "Monitor Soil Moisture",
      description: `Weather is clear, but soil moisture is currently at ${soil ? soil.moisture : 30}%. Maintain regular intervals.`,
      reason: `No heavy rainfall forecasted for the next 5 days.`,
      action: "Maintain normal irrigation intervals for active blocks.",
      source: "rule_engine",
      metadata: {
        benefit: "Ensures uniform plant moisture feeds."
      }
    });
  }

  // ==========================================
  // agronomic rule 2: SOIL NPK DEFICIENCIES
  // ==========================================
  if (soil && soil.nitrogen < 200) {
    newRecs.push({
      farmerId,
      type: "fertilizer",
      priority: "medium",
      title: "Nitrogen Deficient: Schedule Urea Top Dressing",
      description: `Your soil test reports low nitrogen levels (${soil.nitrogen} kg/ha vs ideal >280 kg/ha).`,
      reason: `Chlorophyll production will decrease, causing leaf yellowing.`,
      action: "Apply 50 kg/acre of Urea. Spread on damp soil.",
      source: "rule_engine",
      metadata: {
        benefit: "Restores vegetative leaf growth rate and color."
      }
    });
  }

  // ==========================================
  // agronomic rule 3: MARKET PRICE PEAKS
  // ==========================================
  const cottonAPMC = await MarketPrice.findOne({ cropName: "Cotton" }).sort({ modalPrice: -1 });
  if (cottonAPMC && cottonAPMC.modalPrice > 7000) {
    newRecs.push({
      farmerId,
      type: "market",
      priority: "low",
      title: "Cotton Price Peak: Liquidate Stored Stocks",
      description: `APMC rates for Cotton have touched ₹${cottonAPMC.modalPrice}/quintal, representing a seasonal high.`,
      reason: `Short-term supply shortages in spinning mills are driving rates up.`,
      action: "Liquidate 30-40% of stored cotton inventory immediately.",
      source: "rule_engine",
      metadata: {
        benefit: "Locks in optimal margins before harvest volume imports flatten prices."
      }
    });
  }

  const seeded = await AIRecommendation.create(newRecs);
  return seeded;
};

const getOverviewStats = async (farmerId) => {
  const [profile, crops, soil, notifications] = await Promise.all([
    FarmerProfile.findOne({ userId: farmerId }),
    CropCycle.find({ farmerId, status: "active" }),
    SoilProfile.findOne({ farmerId }),
    require("../../database/models/Notification").find({ farmerId })
  ]);

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;
  const activeAcres = crops.reduce((acc, c) => acc + c.area, 0);

  return {
    fullName: profile ? profile.fullName : "Farmer",
    location: profile ? `${profile.village}, ${profile.taluka}, ${profile.district}` : "Gujarat",
    soilHealthScore: soil ? soil.healthScore : 75,
    activeCropsCount: crops.length,
    activeCropsArea: activeAcres,
    unreadNotificationsCount: unreadNotifs
  };
};

const formatRecommendations = (list) => {
  return list.map((r) => {
    // Map category name back to capitalized format
    const categoryDisplay = r.type ? r.type.charAt(0).toUpperCase() + r.type.slice(1) : "Other";
    
    return {
      id: r._id ? r._id.toString() : "rec-mock",
      category: categoryDisplay,
      priority: r.priority ? r.priority.toUpperCase() : "MEDIUM",
      title: r.title,
      explanation: r.description,
      reason: r.reason,
      action: r.action,
      benefit: r.metadata && r.metadata.benefit ? r.metadata.benefit : r.description,
      timestamp: r.createdAt || new Date()
    };
  });
};

module.exports = {
  getRecommendations,
  refreshRecommendations,
  getOverviewStats
};
