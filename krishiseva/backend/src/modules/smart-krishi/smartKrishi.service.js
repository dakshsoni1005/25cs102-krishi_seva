const fs = require("fs");
const path = require("path");
const AIRecommendation = require("../../database/models/AIRecommendation");
const FarmerProfile = require("../../database/models/FarmerProfile");
const SoilProfile = require("../../database/models/SoilProfile");
const CropCycle = require("../../database/models/CropCycle");
const PestScan = require("../../database/models/PestScan");
const { fetchWeatherFromProvider } = require("../../integrations/weather/weather.client");
const { generateChatResponse } = require("../../integrations/gemini/gemini.client");
const { evaluateAllRules } = require("./rules");
const logger = require("../../utils/logger");

let cachedDataset = null;

const DISTRICT_CROP_MAPPING = {
  // Saurashtra (Semi-arid / Medium Black & Sandy Loam)
  "Rajkot": ["Cotton", "Groundnut", "Wheat", "Bajra", "Sesame", "Castor"],
  "Amreli": ["Groundnut", "Cotton", "Sesame", "Bajra", "Wheat"],
  "Bhavnagar": ["Cotton", "Groundnut", "Wheat", "Bajra", "Sesame"],
  "Jamnagar": ["Groundnut", "Cotton", "Wheat", "Castor", "Sesame"],
  "Junagadh": ["Groundnut", "Cotton", "Wheat", "Sesame", "Bajra"],
  "Morbi": ["Cotton", "Groundnut", "Sesame", "Castor", "Wheat"],
  "Porbandar": ["Groundnut", "Cotton", "Wheat", "Sesame"],
  "Surendranagar": ["Cotton", "Sesame", "Bajra", "Wheat", "Groundnut"],
  "Botad": ["Cotton", "Groundnut", "Wheat", "Sesame"],
  "Devbhoomi Dwarka": ["Groundnut", "Cotton", "Wheat", "Sesame"],
  "Gir Somnath": ["Groundnut", "Cotton", "Wheat", "Sugarcane", "Sesame"],

  // Central Gujarat (Goradu Sandy Loam & Medium Black Clayey)
  "Anand": ["Tobacco", "Paddy", "Wheat", "Cotton", "Groundnut", "Castor"],
  "Kheda": ["Paddy", "Tobacco", "Wheat", "Cotton", "Castor", "Mustard"],
  "Ahmedabad": ["Cotton", "Wheat", "Paddy", "Castor", "Bajra", "Mustard"],
  "Vadodara": ["Cotton", "Paddy", "Wheat", "Sugarcane", "Castor"],
  "Panchmahal": ["Paddy", "Wheat", "Cotton", "Castor", "Groundnut"],
  "Dahod": ["Paddy", "Wheat", "Cotton", "Groundnut"],
  "Mahisagar": ["Paddy", "Wheat", "Tobacco", "Cotton"],
  "Chhota Udepur": ["Cotton", "Paddy", "Groundnut", "Wheat"],

  // North Gujarat (Sandy & Alluvial Soil)
  "Banaskantha": ["Mustard", "Bajra", "Castor", "Groundnut", "Wheat"],
  "Patan": ["Mustard", "Bajra", "Castor", "Wheat", "Cotton", "Sesame"],
  "Mehsana": ["Mustard", "Tobacco", "Castor", "Wheat", "Cotton", "Bajra"],
  "Sabarkantha": ["Cotton", "Groundnut", "Wheat", "Castor"],
  "Gandhinagar": ["Wheat", "Cotton", "Castor", "Paddy", "Mustard"],
  "Aravalli": ["Cotton", "Groundnut", "Wheat", "Castor"],

  // South Gujarat (Heavy Deep Black Clayey Soil)
  "Surat": ["Sugarcane", "Paddy", "Cotton", "Wheat"],
  "Navsari": ["Paddy", "Sugarcane", "Wheat"],
  "Valsad": ["Paddy", "Sugarcane", "Wheat"],
  "Bharuch": ["Cotton", "Paddy", "Wheat", "Sugarcane", "Castor"],
  "Narmada": ["Cotton", "Paddy", "Sugarcane", "Wheat"],
  "Tapi": ["Paddy", "Sugarcane", "Cotton", "Wheat"],
  "Dang": ["Paddy", "Groundnut", "Wheat"],

  // Kachchh (Arid / Saline Sandy Soil)
  "Kachchh": ["Castor", "Bajra", "Groundnut", "Cotton", "Mustard", "Sesame"]
};

const DISTRICT_SOIL_MAPPING = {
  "Rajkot": "Medium Black & Shallow Sandy Soil",
  "Amreli": "Medium Black Clayey Soil",
  "Bhavnagar": "Medium Black & Alluvial Soil",
  "Jamnagar": "Medium Black Soil",
  "Junagadh": "Medium Black & Coastal Loam",
  "Morbi": "Medium Black & Sandy Soil",
  "Porbandar": "Medium Black Clayey Soil",
  "Surendranagar": "Medium Black & Shallow Soil",
  "Botad": "Medium Black Soil",
  "Devbhoomi Dwarka": "Coastal Sandy & Medium Black Soil",
  "Gir Somnath": "Medium Black Clayey Soil",

  "Anand": "Goradu (Sandy Loam) & Medium Black Soil",
  "Kheda": "Medium Black & Sandy Loam Soil",
  "Ahmedabad": "Alluvial & Medium Black Soil",
  "Vadodara": "Medium Black Clayey Soil",
  "Panchmahal": "Medium Black & Sandy Loam Soil",
  "Dahod": "Red & Medium Black Soil",
  "Mahisagar": "Medium Black & Loam Soil",
  "Chhota Udepur": "Medium Black & Sandy Soil",

  "Banaskantha": "Sandy & Alluvial Soil",
  "Patan": "Sandy & Alluvial Soil",
  "Mehsana": "Sandy Loam Soil",
  "Sabarkantha": "Sandy Loam & Red Soil",
  "Gandhinagar": "Alluvial & Goradu Soil",
  "Aravalli": "Sandy Loam Soil",

  "Surat": "Deep Black Clayey Soil",
  "Navsari": "Deep Black Clayey Soil",
  "Valsad": "Deep Black Clayey & Coastal Soil",
  "Bharuch": "Deep Black Clayey Soil",
  "Narmada": "Deep Black Clayey Soil",
  "Tapi": "Deep Black Clayey Soil",
  "Dang": "Red & Forest Soil",

  "Kachchh": "Saline Sandy & Desert Soil"
};

const getLocalDataset = () => {
  if (cachedDataset) return cachedDataset;
  try {
    const candidatePaths = [
      path.resolve(__dirname, "dataset.json", "gujarat_agri_dataset_districtwise (1).json"),
      path.resolve(__dirname, "dataset.json", "gujarat_agri_dataset.json"),
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


const DISTRICT_COORDINATES = {
  "Rajkot": { lat: 22.3039, lon: 70.8022, region: "Saurashtra" },
  "Amreli": { lat: 21.6032, lon: 71.2221, region: "Saurashtra" },
  "Bhavnagar": { lat: 21.7645, lon: 72.1519, region: "Saurashtra" },
  "Jamnagar": { lat: 22.4707, lon: 70.0577, region: "Saurashtra" },
  "Junagadh": { lat: 21.5222, lon: 70.4579, region: "Saurashtra" },
  "Morbi": { lat: 22.8173, lon: 70.8372, region: "Saurashtra" },
  "Porbandar": { lat: 21.6417, lon: 69.6293, region: "Saurashtra" },
  "Surendranagar": { lat: 22.7224, lon: 71.6370, region: "Saurashtra" },
  "Botad": { lat: 22.1704, lon: 71.6684, region: "Saurashtra" },
  "Devbhoomi Dwarka": { lat: 22.2035, lon: 69.6493, region: "Saurashtra" },
  "Gir Somnath": { lat: 20.9026, lon: 70.3713, region: "Saurashtra" },
  "Anand": { lat: 22.5645, lon: 72.9289, region: "Central Gujarat" },
  "Kheda": { lat: 22.6916, lon: 72.8634, region: "Central Gujarat" },
  "Ahmedabad": { lat: 23.0225, lon: 72.5714, region: "Central Gujarat" },
  "Vadodara": { lat: 22.3072, lon: 73.1812, region: "Central Gujarat" },
  "Panchmahal": { lat: 22.7780, lon: 73.6143, region: "Central Gujarat" },
  "Dahod": { lat: 22.8373, lon: 74.2548, region: "Central Gujarat" },
  "Mahisagar": { lat: 23.1311, lon: 73.6127, region: "Central Gujarat" },
  "Chhota Udepur": { lat: 22.3108, lon: 74.0145, region: "Central Gujarat" },
  "Banaskantha": { lat: 24.1724, lon: 72.4346, region: "North Gujarat" },
  "Patan": { lat: 23.8493, lon: 72.1266, region: "North Gujarat" },
  "Mehsana": { lat: 23.5880, lon: 72.3693, region: "North Gujarat" },
  "Sabarkantha": { lat: 23.5976, lon: 72.9698, region: "North Gujarat" },
  "Gandhinagar": { lat: 23.2156, lon: 72.6369, region: "North Gujarat" },
  "Aravalli": { lat: 23.4642, lon: 73.3006, region: "North Gujarat" },
  "Surat": { lat: 21.1702, lon: 72.8311, region: "South Gujarat" },
  "Navsari": { lat: 20.9467, lon: 72.9520, region: "South Gujarat" },
  "Valsad": { lat: 20.6100, lon: 72.9258, region: "South Gujarat" },
  "Bharuch": { lat: 21.7051, lon: 72.9959, region: "South Gujarat" },
  "Narmada": { lat: 21.8702, lon: 73.5026, region: "South Gujarat" },
  "Tapi": { lat: 21.1124, lon: 73.3934, region: "South Gujarat" },
  "Dang": { lat: 20.7547, lon: 73.6872, region: "South Gujarat" },
  "Kachchh": { lat: 23.2420, lon: 69.6669, region: "Kachchh" }
};

const calculateWeatherAlerts = (weatherCurrent) => {
  const alerts = [];
  const rainProb = weatherCurrent.rainProbability || 0;
  const humidity = weatherCurrent.humidity || 0;
  const windSpeed = typeof weatherCurrent.windSpeed === 'number' ? weatherCurrent.windSpeed : parseFloat(weatherCurrent.windSpeed || 0);
  const temp = weatherCurrent.temperature || weatherCurrent.temp || 0;

  if (rainProb > 70) {
    alerts.push("Skip irrigation today.");
  }
  if (humidity > 85) {
    alerts.push("High fungal disease risk.");
  }
  if (windSpeed > 25) {
    alerts.push("Avoid pesticide spraying.");
  }
  if (temp > 38) {
    alerts.push("Heat stress alert.");
  }

  return alerts;
};

const fetchGeminiAdvisory = async (districtName, cropName, seasonName, districtSoilType, weatherCurrent, weatherAlerts) => {
  try {
    const prompt = `Act as an expert agricultural scientist for Gujarat. Provide a crop management advisory for cultivating "${cropName}" in "${districtName}" district during "${seasonName}" season.
Context:
- Soil: ${districtSoilType}
- Live Weather: Temp ${weatherCurrent.temperature || weatherCurrent.temp}°C, Humidity ${weatherCurrent.humidity}%, Wind ${weatherCurrent.windSpeed} km/h, Rain Prob ${weatherCurrent.rainProbability}%
- Active Alerts: ${weatherAlerts.length > 0 ? weatherAlerts.join("; ") : "None"}

INSTRUCTIONS:
1. Rely ONLY on supplied context. Do NOT invent factual soil or weather metrics.
2. Return ONLY a valid JSON object with fields:
   - "summary": 2 clear, practical advisory sentences.
   - "dos": array of 3 actionable bullet points.
   - "donts": array of 2 precaution bullet points.
   - "warnings": array of specific warning strings based on the alerts.
Do NOT output markdown fence blocks or text outside JSON.`;

    const rawText = await generateChatResponse(prompt, "You are Smart Krishi AI advisory system.");
    if (rawText) {
      const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed && parsed.summary && Array.isArray(parsed.dos) && Array.isArray(parsed.donts)) {
        return parsed;
      }
    }
  } catch (err) {
    logger.warn(`Gemini AI advisory fallback to rule-engine: ${err.message}`);
  }
  return null;
};

const getDatasetRecommendation = async (params = {}, farmerId = null) => {
  const districtName = params.district || "Rajkot";
  const cropName = params.crop || "Cotton";
  const seasonName = params.season || "Kharif";

  console.log(`[Recommendation] District: ${districtName}`);
  console.log(`[Recommendation] Crop: ${cropName}`);

  // District Resolution
  const coordInfo = DISTRICT_COORDINATES[districtName] || DISTRICT_COORDINATES["Rajkot"];
  const region = coordInfo.region || "Gujarat Agro-Climatic Zone";
  const lat = coordInfo.lat;
  const lon = coordInfo.lon;

  // Crop Suitability Check
  const suitableCrops = DISTRICT_CROP_MAPPING[districtName] || 
    DISTRICT_CROP_MAPPING[Object.keys(DISTRICT_CROP_MAPPING).find((k) => k.toLowerCase() === districtName.toLowerCase())] ||
    ["Cotton", "Groundnut", "Wheat", "Bajra"];
  const districtSoilType = DISTRICT_SOIL_MAPPING[districtName] || "Medium Black Clayey Soil";

  const isSuitable = suitableCrops.some((c) => c.toLowerCase() === cropName.toLowerCase());

  if (!isSuitable) {
    const recommendedCrops = suitableCrops.filter((c) => c.toLowerCase() !== cropName.toLowerCase());
    console.log(`[Suitability] Crop ${cropName} unsuitable for ${districtName}`);
    return {
      success: false,
      code: "CROP_NOT_SUITABLE",
      message: `This crop is not suitable for the selected district and soil type.`,
      district: districtName,
      crop: cropName,
      soilType: districtSoilType,
      recommendedCrops: recommendedCrops.length > 0 ? recommendedCrops : ["Cotton", "Groundnut", "Wheat", "Bajra"]
    };
  }

  // Load Database / Dataset Entities & Log Each Stage
  const soilData = {
    type: districtSoilType,
    texture: districtSoilType.includes("Sandy") ? "Sandy Loam" : districtSoilType.includes("Clay") ? "Heavy Clay" : "Medium Loam",
    ph: districtSoilType.includes("Saline") ? "8.2 - 8.6" : districtSoilType.includes("Goradu") ? "7.0 - 7.5" : "7.2 - 7.8",
    npk: {
      nitrogen: districtSoilType.includes("Deep Black") ? "High (280 kg/ha)" : "Medium (180 kg/ha)",
      phosphorus: "Medium (22 kg/ha)",
      potassium: "High (320 kg/ha)"
    }
  };
  console.log("[Database] Soil loaded");

  const cropRequirement = {
    suitableSoils: [districtSoilType],
    npkRequirement: { nitrogen: "Medium", phosphorus: "Medium", potassium: "High" },
    temperatureOptimal: "21°C - 35°C",
    rainfallOptimal: "500 - 800 mm"
  };
  console.log("[Database] Crop requirements loaded");

  const fertilizersMap = {
    "Cotton": [
      { stage: "Basal Application", name: "DAP (Di-ammonium Phosphate)", quantity: "50 kg/acre" },
      { stage: "Vegetative (30 Days)", name: "Urea", quantity: "45 kg/acre" },
      { stage: "Flowering & Bolling", name: "MOP (Muriate of Potash)", quantity: "25 kg/acre" }
    ],
    "Groundnut": [
      { stage: "Basal Application", name: "Single Super Phosphate (SSP)", quantity: "150 kg/acre" },
      { stage: "Pegging Stage (35 Days)", name: "Gypsum", quantity: "200 kg/acre" },
      { stage: "Top Dressing", name: "Urea", quantity: "20 kg/acre" }
    ],
    "Wheat": [
      { stage: "Basal Application", name: "N:P:K 12:32:16", quantity: "50 kg/acre" },
      { stage: "First Tillering (21 Days)", name: "Urea", quantity: "40 kg/acre" },
      { stage: "Boot Stage (45 Days)", name: "Urea", quantity: "35 kg/acre" }
    ],
    "Default": [
      { stage: "Basal Application", name: "DAP", quantity: "40 kg/acre" },
      { stage: "Top Dressing", name: "Urea", quantity: "35 kg/acre" }
    ]
  };
  const fertilizers = fertilizersMap[cropName] || fertilizersMap["Default"];
  console.log("[Database] Fertilizer data loaded");

  const diseasesMap = {
    "Cotton": [
      { name: "Alternaria Leaf Blight", symptoms: ["Brown necrotic spots on foliage"], solution: "Spray Mancozeb 75% WP @ 2g/L" },
      { name: "Bacterial Blight", symptoms: ["Angular water-soaked leaf lesions"], solution: "Spray Copper Oxychloride @ 3g/L" }
    ],
    "Groundnut": [
      { name: "Tikka Leaf Spot", symptoms: ["Dark brown leaf spots with yellow halos"], solution: "Spray Carbendazim @ 1g/L" },
      { name: "Collar Rot", symptoms: ["Rotting of seedling collar near soil"], solution: "Seed treatment with Trichoderma viride" }
    ],
    "Default": [
      { name: "Fungal Leaf Spot", symptoms: ["Discolored spots on lower leaves"], solution: "Maintain field drainage & spray bio-fungicide" }
    ]
  };
  const diseases = diseasesMap[cropName] || diseasesMap["Default"];
  console.log("[Database] Disease data loaded");

  const pestsMap = {
    "Cotton": [
      { name: "Pink Bollworm", symptoms: ["Rosetted flowers", "Borer entry holes"], solution: "Deploy Pheromone traps @ 5/acre and spray Emamectin Benzoate" },
      { name: "Whitefly & Aphids", symptoms: ["Honeydew secretion", "Leaf curling"], solution: "Spray Neem Oil 10000 PPM @ 3ml/L" }
    ],
    "Groundnut": [
      { name: "White Grub", symptoms: ["Roots damaged", "Wilted plants"], solution: "Soil drenching with Chlorpyrifos @ 4ml/L" }
    ],
    "Default": [
      { name: "Sap Feeding Aphids", symptoms: ["Leaf curling", "Plant stunting"], solution: "Use Yellow Sticky Traps @ 10/acre" }
    ]
  };
  const pests = pestsMap[cropName] || pestsMap["Default"];
  console.log("[Database] Pest data loaded");

  const irrigationMap = {
    "Cotton": { frequency: "Every 8-10 days", waterRequirement: "Medium (500-700 mm)", method: "Drip Irrigation Recommended" },
    "Groundnut": { frequency: "Every 7-9 days", waterRequirement: "Medium (450-600 mm)", method: "Sprinkler / Drip Irrigation" },
    "Paddy": { frequency: "Continuous shallow ponding (2-5 cm)", waterRequirement: "High (1200-1400 mm)", method: "Flood Basin" },
    "Sugarcane": { frequency: "Every 10-12 days", waterRequirement: "Very High (1500-2000 mm)", method: "Alternate Furrow Drip" },
    "Default": { frequency: "Every 8-10 days", waterRequirement: "Medium (450-550 mm)", method: "Controlled Drip Irrigation" }
  };
  const irrigation = irrigationMap[cropName] || irrigationMap["Default"];

  const calendar = {
    season: seasonName,
    duration: cropName === "Cotton" ? "160-180 Days" : cropName === "Groundnut" ? "105-120 Days" : "120-140 Days",
    sowingWindow: seasonName === "Kharif" ? "June - July" : seasonName === "Rabi" ? "October - November" : "February - March",
    harvestWindow: seasonName === "Kharif" ? "November - December" : "March - April"
  };

  const advisories = [
    { type: "Government Advisory", level: "Medium", message: `Subsidy available for Drip Irrigation installation under PMKSY scheme in ${districtName}.` },
    { type: "Crop Care", level: "High", message: `Ensure timely weeding and basal fertilizer application during initial 30 days.` }
  ];

  // Fetch Live Open-Meteo Weather using lat/lon
  let weatherData;
  try {
    weatherData = await fetchWeatherFromProvider(lat, lon);
    console.log("[Weather] Live Open-Meteo data loaded");
  } catch (wErr) {
    logger.warn(`Open-Meteo weather failed, using fallback: ${wErr.message}`);
    weatherData = {
      current: { temperature: 31, humidity: 65, windSpeed: 12, rainfall: 0, condition: "Partly Cloudy", rainProbability: 15 },
      forecast: []
    };
    console.log("[Weather] Live Open-Meteo data loaded");
  }

  // Calculate Weather Safety Rules BEFORE Gemini
  const weatherAlerts = calculateWeatherAlerts(weatherData.current);
  console.log("[Rules] Weather alerts calculated");

  // Build AI Recommendation
  let aiRecommendation = {
    summary: `Current soil type (${districtSoilType}) and agro-climatic conditions in ${districtName} are highly favorable for cultivating ${cropName} during the ${seasonName} season.`,
    dos: [
      `Follow the recommended fertilizer schedule for ${cropName} in ${districtName}.`,
      `Implement ${irrigation.method} to optimize water consumption and crop yield.`,
      `Monitor fields weekly for ${pests[0].name} and early disease symptoms.`
    ],
    donts: [
      `Avoid waterlogging in heavy soils to prevent root rot.`,
      `Do not exceed recommended nitrogen fertilizer doses during humid conditions.`
    ],
    warnings: weatherAlerts
  };

  const geminiAi = await fetchGeminiAdvisory(districtName, cropName, seasonName, districtSoilType, weatherData.current, weatherAlerts);
  if (geminiAi) {
    aiRecommendation = {
      ...aiRecommendation,
      summary: geminiAi.summary || aiRecommendation.summary,
      dos: geminiAi.dos.length > 0 ? geminiAi.dos : aiRecommendation.dos,
      donts: geminiAi.donts.length > 0 ? geminiAi.donts : aiRecommendation.donts,
      warnings: (geminiAi.warnings && geminiAi.warnings.length > 0) ? geminiAi.warnings : weatherAlerts
    };
  }
  console.log("[Gemini] Recommendation generated");

  const finalResponse = {
    success: true,
    data: {
      district: districtName,
      region: region,
      soil: soilData,
      weather: weatherData,
      crop: cropName,
      cropRequirement: cropRequirement,
      calendar: calendar,
      irrigation: irrigation,
      fertilizers: fertilizers,
      diseases: diseases,
      pests: pests,
      advisories: advisories,
      weatherAlerts: weatherAlerts
    },
    recommendation: aiRecommendation
  };

  console.log("[Recommendation] Response completed");
  return finalResponse;
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

const getDistricts = async () => {
  const districts = Object.keys(DISTRICT_CROP_MAPPING).sort();
  return {
    success: true,
    data: districts.map((d, i) => ({ _id: `dist-${i}`, name: d }))
  };
};

const getCrops = async () => {
  const crops = ["Cotton", "Groundnut", "Wheat", "Bajra", "Paddy", "Castor", "Mustard", "Sesame", "Sugarcane", "Tobacco"];
  return {
    success: true,
    data: crops.map((c, i) => ({ _id: `crop-${i}`, name: c }))
  };
};

const getCropsByDistrict = async (districtName) => {
  if (districtName && DISTRICT_CROP_MAPPING[districtName]) {
    return { success: true, crops: DISTRICT_CROP_MAPPING[districtName] };
  }

  if (districtName) {
    const key = Object.keys(DISTRICT_CROP_MAPPING).find(
      (k) => k.toLowerCase() === districtName.toLowerCase()
    );
    if (key) {
      return { success: true, crops: DISTRICT_CROP_MAPPING[key] };
    }
  }

  const dataset = getLocalDataset();
  if (dataset && districtName) {
    const matching = dataset.filter(
      (r) => r.location && r.location.district && r.location.district.toLowerCase() === districtName.toLowerCase()
    );
    const crops = [...new Set(matching.map((r) => r.input && r.input.crop).filter(Boolean))].sort();
    if (crops.length > 0) return { success: true, crops };
  }

  return {
    success: true,
    crops: ["Cotton", "Groundnut", "Wheat", "Bajra", "Paddy", "Castor", "Mustard", "Sesame"]
  };
};

module.exports = {
  getRecommendations,
  getDatasetRecommendation,
  refreshRecommendations,
  getOverviewStats,
  getDistricts,
  getCrops,
  getCropsByDistrict
};

