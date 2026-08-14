const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Load Models
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
const MarketPrice = require('../models/MarketPrice');
const User = require('../models/User');

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing collections...');
    await District.deleteMany();
    await SoilData.deleteMany();
    await Crop.deleteMany();
    await CropRequirement.deleteMany();
    await Fertilizer.deleteMany();
    await Irrigation.deleteMany();
    await Disease.deleteMany();
    await Pest.deleteMany();
    await CropCalendar.deleteMany();
    await WeatherCache.deleteMany();
    await GovernmentAdvisory.deleteMany();
    await MarketPrice.deleteMany();
    await User.deleteMany();
    console.log('Collections cleared!');

    // Read the dataset
    const filePath = path.join(__dirname, '../../../dataset.json/gujarat_agri_dataset_districtwise (1).json');
    if (!fs.existsSync(filePath)) {
      throw new Error(`Dataset not found at ${filePath}`);
    }
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const dataset = JSON.parse(rawData);
    console.log(`Loaded ${dataset.length} records to process.`);

    // 1. Process Unique Districts
    console.log('Processing Districts...');
    const districtMap = {}; // name -> ObjectId
    const districtsToInsert = [];
    const uniqueDistrictsSet = new Set();
    const districtCropsMap = {}; // districtName -> Set of cropName

    // Collect suitable crops for each district
    dataset.forEach(record => {
      const loc = record.location;
      const suitableCrops = record.suitableCrops;
      if (loc && loc.district && Array.isArray(suitableCrops)) {
        districtCropsMap[loc.district] = new Set(suitableCrops);
      }
    });

    dataset.forEach(record => {
      const loc = record.location;
      if (loc && loc.district && !uniqueDistrictsSet.has(loc.district)) {
        uniqueDistrictsSet.add(loc.district);
        districtsToInsert.push({
          name: loc.district,
          region: loc.region || 'Unknown',
          taluka: loc.taluka || '',
          coordinates: {
            lat: loc.latitude || 0,
            lng: loc.longitude || 0
          },
          suitableCrops: Array.from(districtCropsMap[loc.district] || [])
        });
      }
    });

    const insertedDistricts = await District.insertMany(districtsToInsert);
    insertedDistricts.forEach(d => {
      districtMap[d.name] = d._id;
    });
    console.log(`Successfully created ${insertedDistricts.length} districts.`);

    // 2. Process Unique Crops
    console.log('Processing Crops...');
    const cropMap = {}; // name -> ObjectId
    const cropsToInsert = [];
    const uniqueCropsSet = new Set();

    dataset.forEach(record => {
      const c = record.crop;
      if (c && c.name && !uniqueCropsSet.has(c.name)) {
        uniqueCropsSet.add(c.name);
        cropsToInsert.push({ name: c.name });
      }
    });

    const insertedCrops = await Crop.insertMany(cropsToInsert);
    insertedCrops.forEach(c => {
      cropMap[c.name] = c._id;
    });
    console.log(`Successfully created ${insertedCrops.length} crops.`);

    // 3. Process Remaining Collections
    console.log('Normalizing and processing records...');

    const soilDataMap = new Set();
    const soilDataToInsert = [];

    const cropReqMap = {}; // cropId -> Set of soil types
    const cropReqToInsert = [];

    const fertilizerMap = new Set();
    const fertilizersToInsert = [];

    const irrigationMap = new Set();
    const irrigationToInsert = [];

    const diseaseMap = {}; // name -> { affectedCrops: Set, symptoms: Set, solution }
    const pestMap = {}; // name -> { affectedCrops: Set, solution }

    const calendarMap = new Set();
    const calendarsToInsert = [];

    const weatherMap = new Set();
    const weatherToInsert = [];

    const advisoryMap = new Set();
    const advisoriesToInsert = [];

    dataset.forEach(record => {
      const districtId = districtMap[record.location.district];
      const cropId = cropMap[record.crop.name];

      // A. Soil Data
      const soil = record.soil;
      if (soil && soil.type && districtId) {
        const soilKey = `${districtId}_${soil.type}`;
        if (!soilDataMap.has(soilKey)) {
          soilDataMap.add(soilKey);
          soilDataToInsert.push({
            district_id: districtId,
            type: soil.type,
            texture: soil.texture || '',
            color: soil.color || '',
            ph: soil.ph || '',
            npk: {
              nitrogen: (soil.npk && soil.npk.nitrogen) || 'Medium',
              phosphorus: (soil.npk && soil.npk.phosphorus) || 'Medium',
              potassium: (soil.npk && soil.npk.potassium) || 'Medium'
            },
            organicCarbon: soil.organicCarbon || '',
            drainage: soil.drainage || ''
          });
        }
      }

      // B. Crop Requirement suitable soils collector
      if (cropId && soil && soil.type) {
        if (!cropReqMap[cropId]) {
          cropReqMap[cropId] = {
            suitableSoils: new Set(),
            npkRequirement: {
              nitrogen: (soil.npk && soil.npk.nitrogen) || 'Medium',
              phosphorus: (soil.npk && soil.npk.phosphorus) || 'Medium',
              potassium: (soil.npk && soil.npk.potassium) || 'Medium'
            }
          };
        }
        cropReqMap[cropId].suitableSoils.add(soil.type);
      }

      // C. Fertilizer
      if (record.fertilizer && Array.isArray(record.fertilizer)) {
        record.fertilizer.forEach(f => {
          if (cropId && f.name && f.stage) {
            const fertKey = `${cropId}_${f.stage}_${f.name}`;
            if (!fertilizerMap.has(fertKey)) {
              fertilizerMap.add(fertKey);
              fertilizersToInsert.push({
                crop_id: cropId,
                stage: f.stage,
                name: f.name,
                quantity: f.quantity || ''
              });
            }
          }
        });
      }

      // D. Irrigation
      const irr = record.irrigation;
      if (irr && cropId && districtId) {
        const irrKey = `${cropId}_${districtId}`;
        if (!irrigationMap.has(irrKey)) {
          irrigationMap.add(irrKey);
          irrigationToInsert.push({
            crop_id: cropId,
            district_id: districtId,
            frequency: irr.frequency || 'N/A',
            waterRequirement: irr.waterRequirement || 'N/A',
            nextIrrigation: irr.nextIrrigation || ''
          });
        }
      }

      // E. Diseases (extract multi-crop associations)
      if (record.diseases && Array.isArray(record.diseases)) {
        record.diseases.forEach(d => {
          if (d.name && d.name !== 'No major disease widely reported') {
            if (!diseaseMap[d.name]) {
              diseaseMap[d.name] = {
                affectedCrops: new Set(),
                symptoms: new Set(),
                solution: d.solution || ''
              };
            }
            if (cropId) diseaseMap[d.name].affectedCrops.add(cropId.toString());
            if (d.symptoms && Array.isArray(d.symptoms)) {
              d.symptoms.forEach(s => diseaseMap[d.name].symptoms.add(s));
            }
          }
        });
      }

      // F. Pests (extract multi-crop associations)
      if (record.pests && Array.isArray(record.pests)) {
        record.pests.forEach(p => {
          if (p.name && p.name !== 'No major pest widely reported') {
            if (!pestMap[p.name]) {
              pestMap[p.name] = {
                affectedCrops: new Set(),
                solution: p.solution || ''
              };
            }
            if (cropId) pestMap[p.name].affectedCrops.add(cropId.toString());
          }
        });
      }

      // G. Crop Calendar
      const cr = record.crop;
      if (cr && cropId && districtId) {
        const calKey = `${cropId}_${districtId}`;
        if (!calendarMap.has(calKey)) {
          calendarMap.add(calKey);
          calendarsToInsert.push({
            crop_id: cropId,
            district_id: districtId,
            season: cr.season || 'Kharif',
            duration: cr.duration || ''
          });
        }
      }

      // H. Weather Cache
      const w = record.weather;
      if (w && districtId) {
        const weatherKey = districtId.toString();
        if (!weatherMap.has(weatherKey)) {
          weatherMap.add(weatherKey);
          weatherToInsert.push({
            district_id: districtId,
            current: {
              temperature: w.current.temperature || 0,
              humidity: w.current.humidity || 0,
              rainfall: w.current.rainfall || 0,
              windSpeed: w.current.windSpeed || 0,
              condition: w.current.condition || ''
            },
            forecast: (w.forecast || []).map(f => ({
              day: f.day,
              max: f.max || 0,
              min: f.min || 0,
              rain: f.rain || 0
            }))
          });
        }
      }

      // I. Government Advisories
      if (record.alerts && Array.isArray(record.alerts)) {
        record.alerts.forEach(a => {
          if (districtId && a.message) {
            const advKey = `${districtId}_${a.message.substring(0, 30)}`;
            if (!advisoryMap.has(advKey)) {
              advisoryMap.add(advKey);
              advisoriesToInsert.push({
                district_id: districtId,
                type: a.type || 'Weather',
                level: a.level || 'Medium',
                message: a.message
              });
            }
          }
        });
      }
    });

    // Process SoilData Inserts
    const insertedSoilData = await SoilData.insertMany(soilDataToInsert);
    console.log(`Created ${insertedSoilData.length} SoilData entries.`);

    // Process CropRequirements Inserts
    Object.keys(cropReqMap).forEach(cropId => {
      cropReqToInsert.push({
        crop_id: new mongoose.Types.ObjectId(cropId),
        suitableSoils: Array.from(cropReqMap[cropId].suitableSoils),
        npkRequirement: cropReqMap[cropId].npkRequirement
      });
    });
    const insertedCropReqs = await CropRequirement.insertMany(cropReqToInsert);
    console.log(`Created ${insertedCropReqs.length} CropRequirement profiles.`);

    // Process Fertilizers Inserts
    const insertedFertilizers = await Fertilizer.insertMany(fertilizersToInsert);
    console.log(`Created ${insertedFertilizers.length} Fertilizer recommendations.`);

    // Process Irrigation Inserts
    const insertedIrrigation = await Irrigation.insertMany(irrigationToInsert);
    console.log(`Created ${insertedIrrigation.length} Irrigation profiles.`);

    // Process Diseases Inserts
    const diseasesToInsert = Object.keys(diseaseMap).map(name => ({
      name,
      affectedCrops: Array.from(diseaseMap[name].affectedCrops).map(cid => new mongoose.Types.ObjectId(cid)),
      symptoms: Array.from(diseaseMap[name].symptoms),
      solution: diseaseMap[name].solution
    }));
    const insertedDiseases = await Disease.insertMany(diseasesToInsert);
    console.log(`Created ${insertedDiseases.length} Disease entries.`);

    // Process Pests Inserts
    const pestsToInsert = Object.keys(pestMap).map(name => ({
      name,
      affectedCrops: Array.from(pestMap[name].affectedCrops).map(cid => new mongoose.Types.ObjectId(cid)),
      solution: pestMap[name].solution
    }));
    const insertedPests = await Pest.insertMany(pestsToInsert);
    console.log(`Created ${insertedPests.length} Pest entries.`);

    // Process Crop Calendars
    const insertedCalendars = await CropCalendar.insertMany(calendarsToInsert);
    console.log(`Created ${insertedCalendars.length} CropCalendar profiles.`);

    // Process Weather Caches
    const insertedWeather = await WeatherCache.insertMany(weatherToInsert);
    console.log(`Created ${insertedWeather.length} WeatherCache records.`);

    // Process Government Advisories
    const insertedAdvisories = await GovernmentAdvisory.insertMany(advisoriesToInsert);
    console.log(`Created ${insertedAdvisories.length} GovernmentAdvisory entries.`);

    // 4. Seed Mock Market Prices (generate prices for crops in districts)
    console.log('Generating mock MarketPrices...');
    const marketPricesToInsert = [];
    const uniqueCropNames = Object.keys(cropMap);
    const uniqueDistrictNames = Object.keys(districtMap);

    uniqueCropNames.forEach(cropName => {
      const cropId = cropMap[cropName];
      // Select 3 random districts to list this crop price
      const shuffledDistricts = [...uniqueDistrictNames].sort(() => 0.5 - Math.random()).slice(0, 3);
      shuffledDistricts.forEach(distName => {
        const distId = districtMap[distName];
        const basePrice = Math.floor(Math.random() * (6000 - 2000) + 2000);
        marketPricesToInsert.push({
          crop_id: cropId,
          district_id: distId,
          pricePerQuintal: basePrice,
          marketName: `${distName} APMC Market`,
          dateReported: new Date()
        });
      });
    });
    const insertedPrices = await MarketPrice.insertMany(marketPricesToInsert);
    console.log(`Created ${insertedPrices.length} MarketPrice records.`);

    // 5. Seed Mock Users
    console.log('Generating mock Users...');
    const dummyUsers = [
      {
        name: 'Ramesh Patel',
        email: 'ramesh.farmer@agri.com',
        password: 'hashed_password_1234',
        role: 'farmer',
        district_id: districtMap['Ahmedabad']
      },
      {
        name: 'Dr. Anil Shah',
        email: 'anil.expert@agri.com',
        password: 'hashed_password_5678',
        role: 'expert',
        district_id: districtMap['Gandhinagar']
      },
      {
        name: 'Admin User',
        email: 'admin@agri.com',
        password: 'admin_secure_pass',
        role: 'admin'
      }
    ];
    const insertedUsers = await User.insertMany(dummyUsers);
    console.log(`Created ${insertedUsers.length} mock system Users.`);

    console.log('Seeding completed successfully!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding process encountered an error:', error);
    process.exit(1);
  }
};

seedDatabase();
