const fs = require("fs");
const path = require("path");
const AIRecommendation = require("../../database/models/AIRecommendation");
const FarmerProfile = require("../../database/models/FarmerProfile");
const SoilProfile = require("../../database/models/SoilProfile");
const CropCycle = require("../../database/models/CropCycle");
const PestScan = require("../../database/models/PestScan");
const { fetchWeatherFromProvider } = require("../../integrations/weather/weather.client");
const { evaluateAllRules } = require("./rules");
const logger = require("../../utils/logger");

let cachedDataset = null;

const getLocalDataset = () => {
  if (cachedDataset) return cachedDataset;
  try {
    const candidatePaths = [
      path.resolve(process.cwd(), "..", "smart_krishi", "naitri_project-main", "dataset.json", "gujarat_agri_dataset_districtwise (1).json"),
      path.resolve(__dirname, "..", "..", "..", "..", "..", "smart_krishi", "naitri_project-main", "dataset.json", "gujarat_agri_dataset_districtwise (1).json"),
      path.resolve(__dirname, "..", "..", "..", "..", "smart_krishi", "naitri_project-main", "dataset.json", "gujarat_agri_dataset_districtwise (1).json")
    ];

    for (const datasetPath of candidatePaths) {
      if (fs.existsSync(datasetPath)) {
        const rawData = fs.readFileSync(datasetPath, "utf8");
        cachedDataset = JSON.parse(rawData);
        logger.info(`Loaded Smart Krishi dataset from [${datasetPath}] with ${cachedDataset.length} records.`);
        return cachedDataset;
      }
    }
  } catch (err) {
    logger.error(`Failed to load Smart Krishi dataset JSON: ${err.message}`);
  }
  return null;
};

const isSoilSuitable = (districtSoilType, suitableSoilsList) => {
  if (!districtSoilType || !suitableSoilsList || !suitableSoilsList.length) return true;
  const cleanDistrictSoil = districtSoilType.toLowerCase().trim();
  return suitableSoilsList.some((suitableSoil) => {
    const cleanSuitableSoil = suitableSoil.toLowerCase().trim();
    return cleanDistrictSoil.includes(cleanSuitableSoil) || cleanSuitableSoil.includes(cleanDistrictSoil);
  });
};

const getDatasetRecommendation = async (params = {}, farmerId = null) => {
  const districtName = params.district || "Rajkot";
  const cropName = params.crop || "Cotton";
  const seasonName = params.season || "Kharif";

  const dataset = getLocalDataset();

  if (dataset) {
    // Find district matching records
    const districtRecords = dataset.filter(
      (r) => r.location && r.location.district && r.location.district.toLowerCase() === districtName.toLowerCase()
    );

    // Find specific crop match in district
    let match = districtRecords.find(
      (r) => r.input && r.input.crop && r.input.crop.toLowerCase() === cropName.toLowerCase()
    );

    if (!match) {
      match = dataset.find(
        (r) => r.input && r.input.crop && r.input.crop.toLowerCase() === cropName.toLowerCase()
      );
    }

    const districtSoilType = districtRecords.length > 0 && districtRecords[0].soil ? districtRecords[0].soil.type : "Medium Black Soil";

    if (match) {
      const suitableSoils = (match.crop && match.crop.suitableSoils) || ["Black", "Medium Black", "Alluvial", "Loamy"];
      const suitable = isSoilSuitable(districtSoilType, suitableSoils);

      if (!suitable) {
        // Collect recommended crops for this district soil
        const recommendedCrops = [...new Set(
          districtRecords
            .map((r) => r.input && r.input.crop)
            .filter((c) => c && c.toLowerCase() !== cropName.toLowerCase())
        )].sort();

        return {
          success: false,
          source: "local_dataset",
          code: "CROP_NOT_SUITABLE",
          message: `The crop '${cropName}' is not ideally suitable for ${districtName}'s ${districtSoilType} soil.`,
          suggestion: "Consider cultivating one of the recommended suitable crops for optimal yield and soil health.",
          district: districtName,
          crop: cropName,
          soilType: districtSoilType,
          recommendedCrops: recommendedCrops.length > 0 ? recommendedCrops : ["Cotton", "Groundnut", "Wheat", "Bajra"]
        };
      }

      // Build Advisories & Alerts
      const ruleAlerts = [];
      const weatherCurrent = match.weather ? match.weather.current : { temperature: 30, humidity: 75, rainfall: 40, windSpeed: 12 };
      
      if (weatherCurrent.rainfall > 70) {
        ruleAlerts.push({ type: "Irrigation", level: "High", message: "Rain probability high (> 70%): Skip scheduled irrigation today." });
      }
      if (weatherCurrent.humidity > 85) {
        ruleAlerts.push({ type: "Disease", level: "High", message: "Humidity > 85%: High fungal disease and blight risk." });
      }
      if (weatherCurrent.windSpeed > 25) {
        ruleAlerts.push({ type: "Pest", level: "High", message: "Wind speed > 25 km/h: Postpone pesticide spray applications." });
      }
      if (weatherCurrent.temperature > 38) {
        ruleAlerts.push({ type: "Weather", level: "Critical", message: "Temperature > 38°C: Crop heat stress warning." });
      }

      const mergedAdvisories = [
        ...(match.alerts ? match.alerts.map((a) => ({ type: a.type || "General", message: a.message || a.title, level: a.level || "Medium" })) : []),
        ...ruleAlerts
      ];

      const dataPayload = {
        district: districtName,
        region: match.location ? match.location.region : "Gujarat",
        soil: match.soil || { type: districtSoilType, texture: "Clay Loam", ph: "7.2-7.8", npk: { nitrogen: "Medium", phosphorus: "Medium", potassium: "High" } },
        weather: match.weather || { current: weatherCurrent, forecast: [] },
        crop: cropName,
        cropRequirement: match.crop || { suitableSoils: suitableSoils },
        calendar: match.cropCalendar || { season: seasonName, duration: "120-140 days" },
        irrigation: match.irrigation || { frequency: "Every 8-10 days", waterRequirement: "Medium" },
        fertilizers: match.fertilizer || [
          { stage: "Basal", name: "DAP", quantity: "50 kg/acre" },
          { stage: "Top Dressing", name: "Urea", quantity: "45 kg/acre" }
        ],
        diseases: match.diseases || [],
        pests: match.pests || [],
        advisories: mergedAdvisories
      };

      const aiRecommendation = {
        summary: `Current soil and climatic conditions in ${districtName} are favorable for cultivating ${cropName} during the ${seasonName} season.`,
        dos: [
          `Apply recommended fertilizer schedule for ${cropName} as per stage requirements.`,
          `Monitor crop foliage weekly for early signs of pest or fungal infection.`,
          `Maintain controlled irrigation according to daily soil moisture levels.`
        ],
        donts: [
          `Avoid overhead chemical spraying during high winds or imminent rainfall.`,
          `Do not over-fertilize with nitrogen during humid weather conditions.`
        ],
        warnings: mergedAdvisories.map((a) => a.message)
      };

      return {
        success: true,
        source: "local_dataset",
        data: dataPayload,
        recommendation: aiRecommendation
      };
    }
  }

  // Generic fallback if dataset match missing
  const recs = await getRecommendations(farmerId || "guest");
  return {
    success: true,
    source: "local_rule_engine",
    recommendations: recs
  };
};

const mongoose = require("mongoose");

const getRecommendations = async (farmerId) => {
  if (!farmerId || !mongoose.Types.ObjectId.isValid(farmerId)) {
    return [];
  }
  let recs = await AIRecommendation.find({ farmerId }).sort({ createdAt: -1 }).lean();
  
  if (recs.length === 0) {
    recs = await refreshRecommendations(farmerId);
  }

  return formatRecommendations(recs);
};

const refreshRecommendations = async (farmerId) => {
  logger.info(`Evaluating Smart Krishi Rule Engine for farmer: ${farmerId}`);

  const [profile, soil, crops, pestScans] = await Promise.all([
    FarmerProfile.findOne({ userId: farmerId }),
    SoilProfile.findOne({ farmerId }),
    CropCycle.find({ farmerId, status: "active" }),
    PestScan.find({ farmerId }).sort({ createdAt: -1 }).limit(3)
  ]);
  
  let lat = 22.5694;
  let lon = 72.9904;
  if (profile && profile.district === "Rajkot") {
    lat = 22.3039;
    lon = 70.8022;
  }
  const weather = await fetchWeatherFromProvider(lat, lon);

  const evaluated = evaluateAllRules({ profile, soil, crops, pestScans, weather });

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

  const unreadNotifs = notifications ? notifications.filter((n) => !n.isRead).length : 0;
  const activeAcres = crops ? crops.reduce((acc, c) => acc + c.area, 0) : 0;

  return {
    fullName: profile ? profile.fullName : "Farmer",
    location: profile ? `${profile.village}, ${profile.taluka}, ${profile.district}` : "Gujarat",
    soilHealthScore: soil ? soil.healthScore : 75,
    activeCropsCount: crops ? crops.length : 0,
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
  getDatasetRecommendation,
  refreshRecommendations,
  getOverviewStats
};

