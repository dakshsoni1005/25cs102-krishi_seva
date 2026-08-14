const SoilProfile = require("../../database/models/SoilProfile");

const getSoilData = async (farmerId) => {
  const profile = await SoilProfile.findOne({ farmerId });
  if (!profile) {
    // Return a default mock profile if no records seeded
    return {
      healthScore: 78,
      type: "Medium Black Clayey Soil",
      moisture: 38,
      ph: 7.2,
      nutrients: {
        nitrogen: { value: 180, status: "Low", ideal: "280-560 kg/ha" },
        phosphorus: { value: 18, status: "Medium", ideal: "23-57 kg/ha" },
        potassium: { value: 310, status: "High", ideal: "140-280 kg/ha" },
        organicCarbon: { value: 0.45, status: "Low", ideal: "0.5% - 0.75%" }
      }
    };
  }

  return formatSoilReport(profile);
};

const getSoilByRegion = async (farmerId, regionName) => {
  let profile = await SoilProfile.findOne({ farmerId, region: regionName });
  
  if (!profile) {
    // If not customized for farmer yet, load general seeded region parameters or create one
    profile = await SoilProfile.findOne({ region: regionName });
    if (!profile) {
      const err = new Error(`Soil profile for region '${regionName}' not found.`);
      err.statusCode = 404;
      throw err;
    }
  }

  return formatSoilReport(profile);
};

const triggerRetest = async (farmerId, regionName) => {
  const profile = await SoilProfile.findOne({ farmerId, region: regionName });
  if (!profile) {
    const err = new Error(`No soil profile logged for region '${regionName}' to re-test.`);
    err.statusCode = 404;
    throw err;
  }

  // Slightly randomize potassium and moisture values to simulate live re-test
  profile.potassium = Math.max(140, profile.potassium + Math.round((Math.random() - 0.5) * 30));
  profile.moisture = Math.max(10, Math.min(95, profile.moisture + Math.round((Math.random() - 0.5) * 10)));
  profile.healthScore = Math.max(50, Math.min(100, profile.healthScore + Math.round((Math.random() - 0.5) * 4)));
  
  await profile.save();
  return formatSoilReport(profile);
};

// Helper to format soil DB document into frontend service schema
const formatSoilReport = (profile) => {
  const nStatus = profile.nitrogen < 280 ? "Low" : profile.nitrogen > 560 ? "High" : "Medium";
  const pStatus = profile.phosphorus < 23 ? "Low" : profile.phosphorus > 57 ? "High" : "Medium";
  const kStatus = profile.potassium < 140 ? "Low" : profile.potassium > 280 ? "High" : "Medium";
  const ocStatus = profile.organicCarbon < 0.5 ? "Low" : profile.organicCarbon > 0.75 ? "High" : "Medium";

  // Regional crop mappings
  const regionalCrops = {
    "Central Gujarat": [
      { name: "Cotton", suitability: 95, reason: "Soil pH and black clay structure is excellent for cotton taproot development." },
      { name: "Groundnut", suitability: 88, reason: "Moderate potassium level and clay-loam properties support pod filling." },
      { name: "Wheat", suitability: 82, reason: "Excellent water retention capacity during rabi season." }
    ],
    "Saurashtra": [
      { name: "Groundnut", suitability: 96, reason: "Calcareous sandy clay loam is ideal for groundnut pegging." },
      { name: "Cotton", suitability: 90, reason: "Drought resistant Bt Cotton performs well in medium black soil blocks." },
      { name: "Sesame", suitability: 85, reason: "Grows well on light textured soil sections with minimal winter dew." }
    ],
    "North Gujarat": [
      { name: "Castor", suitability: 94, reason: "Sandy loam soils with high drainage optimize castor deep root feeds." },
      { name: "Mustard", suitability: 89, reason: "Highly responsive to winter morning temperatures on alluvial soils." },
      { name: "Bajra", suitability: 85, reason: "Highly drought tolerant millet suited for low organic carbon index." }
    ],
    "South Gujarat": [
      { name: "Sugarcane", suitability: 95, reason: "Deep clayey soil blocks combined with high irrigation support heavy cane stalks." },
      { name: "Banana", suitability: 90, reason: "High organic matter and potassium levels enhance bunch sizing." },
      { name: "Paddy", suitability: 88, reason: "Excellent waterlogging tolerance in low-lying clay plots." }
    ],
    "Kachchh": [
      { name: "Date Palm", suitability: 92, reason: "Highly tolerant to saline sandy profiles and arid desert climates." },
      { name: "Pomegranate", suitability: 85, reason: "Performs well in alkaline pH levels under drip irrigation systems." },
      { name: "Castor", suitability: 80, reason: "Grows in light sand pockets using tubewell water support." }
    ]
  };

  const crops = regionalCrops[profile.region] || regionalCrops["Central Gujarat"];

  return {
    healthScore: profile.healthScore,
    type: profile.soilType,
    moisture: profile.moisture,
    ph: profile.ph,
    nutrients: {
      nitrogen: { value: profile.nitrogen, status: nStatus, ideal: "280-560 kg/ha" },
      phosphorus: { value: profile.phosphorus, status: pStatus, ideal: "23-57 kg/ha" },
      potassium: { value: profile.potassium, status: kStatus, ideal: "140-280 kg/ha" },
      organicCarbon: { value: profile.organicCarbon, status: ocStatus, ideal: "0.5% - 0.75%" }
    },
    recommendedCrops: crops,
    recommendedFertilizers: [
      { name: "Urea (Nitrogen Source)", dosage: "50 kg/acre", timing: "Basal dressing at sowing and top dressing at 30 days" },
      { name: "Single Super Phosphate (SSP)", dosage: "35 kg/acre", timing: "Basal application during land preparation" },
      { name: "Organic Compost / Farm Yard Manure", dosage: "5 tonnes/acre", timing: "Mix thoroughly into soil 3 weeks before sowing" }
    ],
    suggestions: [
      "Grow leguminous cover crops (like Sunn hemp) during fallow periods to fix atmospheric nitrogen.",
      "Apply bio-fertilizers such as Azotobacter and Phosphate Solubilizing Bacteria (PSB) to boost nutrient uptake.",
      "Adopt deep summer plowing to improve soil aeration and kill soil-borne pathogens."
    ]
  };
};

module.exports = {
  getSoilData,
  getSoilByRegion,
  triggerRetest
};
