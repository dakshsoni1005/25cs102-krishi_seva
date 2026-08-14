const AIRecommendation = require("../../database/models/AIRecommendation");
const FarmerProfile = require("../../database/models/FarmerProfile");
const SoilProfile = require("../../database/models/SoilProfile");
const CropCycle = require("../../database/models/CropCycle");
const PestScan = require("../../database/models/PestScan");
const { fetchWeatherFromProvider } = require("../../integrations/weather/weather.client");
const { evaluateAllRules } = require("./rules");
const logger = require("../../utils/logger");

const getRecommendations = async (farmerId) => {
  let recs = await AIRecommendation.find({ farmerId }).sort({ createdAt: -1 }).lean();
  
  // If empty, trigger rules engine to evaluate recommendations initially
  if (recs.length === 0) {
    recs = await refreshRecommendations(farmerId);
  }

  return formatRecommendations(recs);
};

const refreshRecommendations = async (farmerId) => {
  logger.info(`Evaluating Smart Krishi Rule Engine for farmer: ${farmerId}`);

  // 1. Gather context
  const [profile, soil, crops, pestScans] = await Promise.all([
    FarmerProfile.findOne({ userId: farmerId }),
    SoilProfile.findOne({ farmerId }),
    CropCycle.find({ farmerId, status: "active" }),
    PestScan.find({ farmerId }).sort({ createdAt: -1 }).limit(3)
  ]);
  
  // Determine coordinates
  let lat = 22.5694;
  let lon = 72.9904;
  if (profile && profile.district === "Rajkot") {
    lat = 22.3039;
    lon = 70.8022;
  }
  const weather = await fetchWeatherFromProvider(lat, lon);

  // 2. Evaluate all rules
  const evaluated = evaluateAllRules({ profile, soil, crops, pestScans, weather });

  // Clear existing recommendation records for this farmer
  await AIRecommendation.deleteMany({ farmerId });

  const newRecs = evaluated.map((r) => ({
    farmerId,
    type: r.type || "general",
    priority: r.priority || "medium",
    title: r.title,
    description: r.description,
    reason: r.reason,
    action: r.action,
    source: "rule_engine",
    metadata: {
      benefit: r.description
    }
  }));

  // Fallback if no specific rule triggered
  if (newRecs.length === 0) {
    newRecs.push({
      farmerId,
      type: "irrigation",
      priority: "medium",
      title: "Optimal Weather Conditions",
      description: "Weather conditions are clear. Maintain standard irrigation and crop monitoring routines.",
      reason: "No acute rain, drought, or pest threats detected.",
      action: "Maintain regular drip irrigation schedules.",
      source: "rule_engine",
      metadata: { benefit: "Ensures stable vegetative plant growth." }
    });
  }

  return await AIRecommendation.create(newRecs);
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
    const categoryDisplay = r.type ? r.type.charAt(0).toUpperCase() + r.type.slice(1) : "General";
    
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
