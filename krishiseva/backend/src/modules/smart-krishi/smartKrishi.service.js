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

    const districtSoilType = districtRecords.length > 0 && districtRecords[0].soil ? districtRecords[0].soil.type : (DISTRICT_SOIL_MAPPING[districtName] || "Medium Black Soil");

    if (match) {
      const isDistrictMatch = districtRecords.some((r) => r.input && r.input.crop && r.input.crop.toLowerCase() === cropName.toLowerCase());
      const isMappedCrop = DISTRICT_CROP_MAPPING[districtName] && DISTRICT_CROP_MAPPING[districtName].some((c) => c.toLowerCase() === cropName.toLowerCase());
      const suitableSoils = (match.crop && match.crop.suitableSoils) || ["Black", "Medium Black", "Alluvial", "Loamy", "Sandy", "Sandy Loam", "Goradu", "Desert"];
      const suitable = isDistrictMatch || isMappedCrop || isSoilSuitable(districtSoilType, suitableSoils);

      if (!suitable) {
        // Collect recommended crops for this district soil
        const suitableCrops = DISTRICT_CROP_MAPPING[districtName] || ["Cotton", "Groundnut", "Wheat", "Bajra"];
        const recommendedCrops = suitableCrops.filter((c) => c.toLowerCase() !== cropName.toLowerCase());

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

  // Dynamic Rule-Engine fallback for built-in Gujarat district agro-climate
  const suitableCrops = DISTRICT_CROP_MAPPING[districtName] || 
    DISTRICT_CROP_MAPPING[Object.keys(DISTRICT_CROP_MAPPING).find((k) => k.toLowerCase() === districtName.toLowerCase())] ||
    ["Cotton", "Groundnut", "Wheat", "Bajra"];

  const districtSoilType = DISTRICT_SOIL_MAPPING[districtName] || "Medium Black Clayey Soil";

  const isSuitable = suitableCrops.some((c) => c.toLowerCase() === cropName.toLowerCase());

  if (!isSuitable) {
    const recommendedCrops = suitableCrops.filter((c) => c.toLowerCase() !== cropName.toLowerCase());
    return {
      success: false,
      source: "local_rule_engine",
      code: "CROP_NOT_SUITABLE",
      message: `The crop '${cropName}' is not ideally suitable for ${districtName}'s ${districtSoilType}.`,
      suggestion: `Consider cultivating one of the recommended crops suitable for ${districtName}'s soil and agro-climate.`,
      district: districtName,
      crop: cropName,
      soilType: districtSoilType,
      recommendedCrops: recommendedCrops.length > 0 ? recommendedCrops : ["Cotton", "Groundnut", "Wheat", "Bajra"]
    };
  }

  // Generate detailed recommendations for the crop & district combination
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

  const weatherCurrent = {
    temperature: 30,
    humidity: 68,
    rainfall: 15,
    windSpeed: 12
  };

  const weatherForecast = [
    { day: "Today", temp: "31°C", condition: "Partly Cloudy", rainProb: "20%" },
    { day: "Tomorrow", temp: "32°C", condition: "Sunny", rainProb: "10%" },
    { day: "Day 3", temp: "30°C", condition: "Light Rain", rainProb: "40%" },
    { day: "Day 4", temp: "29°C", condition: "Cloudy", rainProb: "30%" },
    { day: "Day 5", temp: "31°C", condition: "Clear Sky", rainProb: "5%" }
  ];

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

  const irrigationMap = {
    "Cotton": { frequency: "Every 8-10 days", waterRequirement: "Medium (500-700 mm)", method: "Drip Irrigation Recommended" },
    "Groundnut": { frequency: "Every 7-9 days", waterRequirement: "Medium (450-600 mm)", method: "Sprinkler / Drip Irrigation" },
    "Paddy": { frequency: "Continuous shallow ponding (2-5 cm)", waterRequirement: "High (1200-1400 mm)", method: "Flood Basin" },
    "Sugarcane": { frequency: "Every 10-12 days", waterRequirement: "Very High (1500-2000 mm)", method: "Alternate Furrow Drip" },
    "Default": { frequency: "Every 8-10 days", waterRequirement: "Medium (450-550 mm)", method: "Controlled Drip Irrigation" }
  };

  const irrigation = irrigationMap[cropName] || irrigationMap["Default"];

  const diseasesMap = {
    "Cotton": [
      { name: "Alternaria Leaf Blight", symptoms: "Brown necrotic spots on foliage", prevention: "Spray Mancozeb 75% WP @ 2g/L" },
      { name: "Bacterial Blight", symptoms: "Angular water-soaked leaf lesions", prevention: "Spray Copper Oxychloride @ 3g/L" }
    ],
    "Groundnut": [
      { name: "Tikka Leaf Spot", symptoms: "Dark brown leaf spots with yellow halos", prevention: "Spray Carbendazim @ 1g/L" },
      { name: "Collar Rot", symptoms: "Rotting of seedling collar near soil", prevention: "Seed treatment with Trichoderma viride" }
    ],
    "Default": [
      { name: "Fungal Leaf Spot", symptoms: "Discolored spots on lower leaves", prevention: "Maintain field drainage & spray bio-fungicide" }
    ]
  };

  const pestsMap = {
    "Cotton": [
      { name: "Pink Bollworm", symptoms: "Rosetted flowers and borer entry holes", prevention: "Deploy Pheromone traps @ 5/acre and spray Emamectin Benzoate" },
      { name: "Whitefly & Aphids", symptoms: "Honeydew secretion & leaf curling", prevention: "Spray Neem Oil 10000 PPM @ 3ml/L" }
    ],
    "Groundnut": [
      { name: "White Grub", symptoms: "Roots damaged leading to wilted plants", prevention: "Soil drenching with Chlorpyrifos @ 4ml/L" }
    ],
    "Default": [
      { name: "Sap Feeding Aphids", symptoms: "Leaf curling & stunting", prevention: "Use Yellow Sticky Traps @ 10/acre" }
    ]
  };

  const diseases = diseasesMap[cropName] || diseasesMap["Default"];
  const pests = pestsMap[cropName] || pestsMap["Default"];

  const mergedAdvisories = [
    { type: "Irrigation", level: "Medium", message: `Maintain ${irrigation.method} schedule tailored to ${districtName}'s ${districtSoilType}.` },
    { type: "Fertilizer", level: "High", message: `Apply basal dose of ${fertilizers[0].name} before sowing/transplanting.` },
    { type: "Pest Management", level: "Medium", message: `Regular scouting recommended for early identification of ${pests[0].name}.` }
  ];

  const dataPayload = {
    district: districtName,
    region: "Gujarat Agro-Climatic Zone",
    soil: soilData,
    weather: { current: weatherCurrent, forecast: weatherForecast },
    crop: cropName,
    cropRequirement: { suitableSoils: [districtSoilType] },
    calendar: { season: seasonName, duration: "120-150 days", sowingWindow: "Optimal Sowing Season" },
    irrigation: irrigation,
    fertilizers: fertilizers,
    diseases: diseases,
    pests: pests,
    advisories: mergedAdvisories
  };

  const aiRecommendation = {
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
    warnings: mergedAdvisories.map((a) => a.message)
  };

  return {
    success: true,
    source: "local_rule_engine",
    data: dataPayload,
    recommendation: aiRecommendation
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

