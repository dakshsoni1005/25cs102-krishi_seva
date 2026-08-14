const genAI = require('../config/gemini');
const District = require('../models/District');
const SoilData = require('../models/SoilData');
const Crop = require('../models/Crop');
const CropRequirement = require('../models/CropRequirement');
const Fertilizer = require('../models/Fertilizer');
const Irrigation = require('../models/Irrigation');
const Disease = require('../models/Disease');
const Pest = require('../models/Pest');
const CropCalendar = require('../models/CropCalendar');
const WeatherCache = require('../models/WeatherCache');
const GovernmentAdvisory = require('../models/GovernmentAdvisory');
const { getLiveWeather } = require('./weatherService');
const { resolveDistrict, resolveCrop } = require('../utils/resolve');
const fs = require('fs');
const path = require('path');

const getLocalDatasetFallback = () => {
  try {
    const datasetPath = process.env.DATASET_PATH || path.join(__dirname, '../../../dataset.json/gujarat_agri_dataset_districtwise (1).json');
    if (fs.existsSync(datasetPath)) {
      const rawData = fs.readFileSync(datasetPath, 'utf8');
      return JSON.parse(rawData);
    }
  } catch (err) {
    console.error('Failed to load local dataset fallback:', err.message);
  }
  return null;
};

const isSoilSuitable = (districtSoilType, suitableSoilsList) => {
  if (!districtSoilType || !suitableSoilsList || !suitableSoilsList.length) return false;
  const cleanDistrictSoil = districtSoilType.toLowerCase().trim();
  return suitableSoilsList.some(suitableSoil => {
    const cleanSuitableSoil = suitableSoil.toLowerCase().trim();
    return cleanDistrictSoil === cleanSuitableSoil || 
           cleanDistrictSoil.includes(cleanSuitableSoil) || 
           cleanSuitableSoil.includes(cleanDistrictSoil);
  });
};

const getRecommendation = async (districtName, cropName, seasonName) => {
  // Resolve district
  const district = await resolveDistrict(districtName);
  if (!district) throw new Error(`District '${districtName}' not found.`);

  // Validate crop existence
  const crop = await resolveCrop(cropName);
  if (!crop) {
    return {
      success: false,
      message: 'Crop not found.'
    };
  }

  // Fetch soil and crop requirements
  let soil = null;
  let cropReq = null;
  let soilType = 'N/A';
  let suitableSoils = [];
  
  try {
    soil = await SoilData.findOne({ district_id: district._id });
    cropReq = await CropRequirement.findOne({ crop_id: crop._id });
    soilType = soil?.type || 'N/A';
    suitableSoils = cropReq?.suitableSoils || [];
    

  } catch (dbError) {
    console.warn('Database query failed during suitability check, trying local dataset fallback:', dbError.message);
    const dataset = getLocalDatasetFallback();
    if (dataset) {
      const districtRecord = dataset.find(r => r.location.district.toLowerCase() === districtName.toLowerCase());
      soilType = districtRecord?.soil?.type || 'N/A';
      
      soil = {
        type: soilType,
        texture: districtRecord?.soil?.texture || 'Sandy Loam',
        ph: districtRecord?.soil?.ph || '7.0-8.0',
        npk: districtRecord?.soil?.npk || { nitrogen: 'Medium', phosphorus: 'Medium', potassium: 'High' }
      };

      const cropRecords = dataset.filter(r => r.crop.name.toLowerCase() === crop.name.toLowerCase());
      const suitableSoilsSet = new Set(cropRecords.map(r => r.soil?.type).filter(Boolean));
      suitableSoils = [...suitableSoilsSet];



      cropReq = {
        crop_id: crop._id,
        suitableSoils: suitableSoils,
        npkRequirement: {
          nitrogen: 'Medium',
          phosphorus: 'Medium',
          potassium: 'High'
        }
      };
    }
  }

  // Compare soil suitability
  const isSuitable = isSoilSuitable(soilType, suitableSoils);
  if (!isSuitable) {
    let uniqueRecommended = [];
    try {
      const allReqs = await CropRequirement.find({}).populate('crop_id');
      const recommendedCrops = [];
      for (const req of allReqs) {
        if (req.crop_id && isSoilSuitable(soilType, req.suitableSoils)) {
          recommendedCrops.push(req.crop_id.name);
        }
      }
      uniqueRecommended = [...new Set(recommendedCrops)].filter(name => name.toLowerCase() !== crop.name.toLowerCase()).sort();
    } catch (dbError) {
      console.warn('Database alternative query failed, using local dataset fallback:', dbError.message);
      const dataset = getLocalDatasetFallback();
      if (dataset) {
        const recommendedSet = new Set();
        dataset.forEach(r => {
          if (r.crop?.name && r.soil?.type && isSoilSuitable(soilType, [r.soil.type])) {
            recommendedSet.add(r.crop.name);
          }
        });
        uniqueRecommended = [...recommendedSet].filter(name => name.toLowerCase() !== crop.name.toLowerCase()).sort();
      }
    }

    return {
      success: false,
      code: 'CROP_NOT_SUITABLE',
      message: 'This crop is not suitable for the selected district and soil type.',
      district: district.name,
      crop: crop.name,
      soilType: soilType,
      recommendedCrops: uniqueRecommended
    };
  }

  // Get live weather from WeatherService (falls back to cache if API key is invalid/unavailable)
  const weather = await getLiveWeather(district);

  // Fetch remaining database models with safe database fallback logic
  let calendar, irrigation, fertilizers = [], diseases = [], pests = [], dbAdvisories = [];
  
  try {
    calendar = await CropCalendar.findOne({ crop_id: crop._id, district_id: district._id });
    irrigation = await Irrigation.findOne({ crop_id: crop._id, district_id: district._id });
    fertilizers = await Fertilizer.find({ crop_id: crop._id });
    diseases = await Disease.find({ affectedCrops: crop._id });
    pests = await Pest.find({ affectedCrops: crop._id });
    dbAdvisories = await GovernmentAdvisory.find({ district_id: district._id });
  } catch (dbError) {
    console.warn('Database query failed for metadata, trying local dataset fallback:', dbError.message);
    const dataset = getLocalDatasetFallback();
    if (dataset) {
      const match = dataset.find(r => 
        r.location.district.toLowerCase() === district.name.toLowerCase() &&
        r.crop.name.toLowerCase() === crop.name.toLowerCase()
      ) || dataset.find(r => r.crop.name.toLowerCase() === crop.name.toLowerCase());

      if (match) {
        calendar = { season: match.crop.season || seasonName || 'Kharif', duration: match.crop.duration || 'N/A' };
        irrigation = match.irrigation || 'N/A';
        fertilizers = match.fertilizer || [];
        diseases = match.diseases || [];
        pests = match.pests || [];
        dbAdvisories = match.alerts || [];
      }
    }
  }

  // Generate rule-based alerts based on current weather criteria
  const ruleAlerts = [];
  if (weather && weather.current) {
    const { temperature, humidity, windSpeed, rainProbability } = weather.current;

    if (rainProbability > 70) {
      ruleAlerts.push({
        type: 'Irrigation',
        level: 'High',
        message: 'Rain probability > 70%: Skip irrigation today.'
      });
    }

    if (humidity > 85) {
      ruleAlerts.push({
        type: 'Disease',
        level: 'High',
        message: 'Humidity > 85%: High fungal disease risk.'
      });
    }

    if (windSpeed > 25) {
      ruleAlerts.push({
        type: 'Pest',
        level: 'High',
        message: 'Wind speed > 25 km/h: Avoid pesticide spraying.'
      });
    }

    if (temperature > 38) {
      ruleAlerts.push({
        type: 'Weather',
        level: 'Critical',
        message: 'Temperature > 38°C: Heat stress alert.'
      });
    }
  }

  // Merge MongoDB government advisories and rule-based weather alerts
  const mergedAdvisories = [
    ...dbAdvisories.map(a => ({ type: a.type, message: a.message, level: a.level })),
    ...ruleAlerts
  ];

  const dataPayload = {
    district: district.name,
    region: district.region,
    soil: soil ? { type: soil.type, texture: soil.texture, ph: soil.ph, npk: soil.npk } : 'N/A',
    weather: weather ? { current: weather.current, forecast: weather.forecast } : 'N/A',
    crop: crop.name,
    cropRequirement: cropReq ? { suitableSoils: cropReq.suitableSoils, npkRequirement: cropReq.npkRequirement } : 'N/A',
    calendar: calendar ? { season: calendar.season, duration: calendar.duration } : 'N/A',
    irrigation: irrigation ? { frequency: irrigation.frequency, waterRequirement: irrigation.waterRequirement } : 'N/A',
    fertilizers: fertilizers.map(f => ({ stage: f.stage, name: f.name, quantity: f.quantity })),
    diseases: diseases.map(d => ({ name: d.name, symptoms: d.symptoms, solution: d.solution })),
    pests: pests.map(p => ({ name: p.name, solution: p.solution })),
    advisories: mergedAdvisories
  };

  let aiRecommendation = null;

  // Run Gemini if client is initialized
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        As an expert agricultural AI advisor for Gujarat, analyze the following farmer's dataset and provide action-oriented recommendations.
        
        Context Details:
        - District: ${district.name} (Region: ${district.region})
        - Season: ${seasonName || calendar?.season || 'Kharif'}
        - Crop: ${crop.name}
        - Soil Properties: Type: ${dataPayload.soil.type}, pH: ${dataPayload.soil.ph}, NPK: ${JSON.stringify(dataPayload.soil.npk)}
        - Current Weather: ${JSON.stringify(dataPayload.weather.current)}
        - Weather Forecast: ${JSON.stringify(dataPayload.weather.forecast)}
        - Rule-Based Alerts: ${JSON.stringify(ruleAlerts)}
        - Recommended Fertilizers: ${JSON.stringify(dataPayload.fertilizers)}
        - Irrigation Schedule: ${JSON.stringify(dataPayload.irrigation)}
        - Potential Diseases: ${JSON.stringify(dataPayload.diseases)}
        - Potential Pests: ${JSON.stringify(dataPayload.pests)}
        - Advisories: ${JSON.stringify(mergedAdvisories)}

        Output a clean JSON object with precisely these fields (do not output any markdown formatting like \`\`\`json):
        {
          "summary": "Short 2-3 sentence overview of suitability and status",
          "dos": ["Array of specific things the farmer SHOULD do right now based on weather/soil/alerts"],
          "donts": ["Array of specific things the farmer SHOULD AVOID doing right now"],
          "warnings": ["Array of specific critical alerts or disease warnings based on weather conditions and rule-based alerts"]
        }
      `;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleanJsonText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      aiRecommendation = JSON.parse(cleanJsonText);
    } catch (err) {
      console.warn('AI recommendation generation failed, using static fallback rules:', err.message);
    }
  }

  // Fallback static rules if AI is unavailable/fails
  if (!aiRecommendation) {
    const warnings = ruleAlerts.map(a => a.message);
    aiRecommendation = {
      summary: `Current conditions in ${district.name} are suitable for cultivating ${crop.name}. Please monitor weather changes closely.`,
      dos: [
        `Apply recommended fertilizer schedule: ${fertilizers.map(f => f.name).join(', ') || 'N/A'}.`,
        `Apply irrigation as required: ${irrigation ? irrigation.frequency : 'Every 10-12 days'}.`
      ],
      donts: [
        `Avoid overhead watering if rain is forecast.`,
        `Do not apply fertilizers right before heavy rains.`
      ],
      warnings: warnings.length > 0 ? warnings : ['No active weather warnings.']
    };
  }

  return {
    success: true,
    data: dataPayload,
    recommendation: aiRecommendation
  };
};

module.exports = {
  getRecommendation
};
