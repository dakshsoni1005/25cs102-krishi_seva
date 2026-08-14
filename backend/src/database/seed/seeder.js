const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const connectDB = require("../../config/database");

// Models
const User = require("../models/User");
const FarmerProfile = require("../models/FarmerProfile");
const Farm = require("../models/Farm");
const SoilProfile = require("../models/SoilProfile");
const SoilAdvisory = require("../models/SoilAdvisory");
const Crop = require("../models/Crop");
const CropCycle = require("../models/CropCycle");
const CropTask = require("../models/CropTask");
const MarketPrice = require("../models/MarketPrice");
const GovernmentScheme = require("../models/GovernmentScheme");
const SchemeEligibility = require("../models/SchemeEligibility");
const AIRecommendation = require("../models/AIRecommendation");
const Notification = require("../models/Notification");
const Region = require("../models/Region");
const District = require("../models/District");
const Taluka = require("../models/Taluka");

const logger = require("../../utils/logger");

// Split data imports
const regionsData = require("./regions.seed");
const districtsData = require("./districts.seed");
const talukasData = require("./talukas.seed");
const cropsData = require("./crops.seed");
const schemesData = require("./schemes.seed");
const marketData = require("./market.seed");
const soilData = require("./soil.seed");

const runSeeder = async (isReset = false) => {
  try {
    logger.info("Starting safe upsert-based database seeding...");
    
    // Connect to database if not already connected
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    // 1. Seed Regions
    logger.info("Upserting Regions...");
    const regionMap = {};
    for (const r of regionsData) {
      const doc = await Region.findOneAndUpdate(
        { name: r.name },
        r,
        { upsert: true, new: true }
      );
      regionMap[r.name] = doc._id;
    }

    // 2. Seed Districts
    logger.info("Upserting Districts...");
    const districtMap = {};
    for (const d of districtsData) {
      const regionId = regionMap[d.regionName];
      if (!regionId) continue;
      
      const doc = await District.findOneAndUpdate(
        { name: d.name, regionId },
        { name: d.name, regionId },
        { upsert: true, new: true }
      );
      districtMap[d.name] = doc._id;
    }

    // 3. Seed Talukas
    logger.info("Upserting Talukas...");
    for (const t of talukasData) {
      const districtId = districtMap[t.districtName];
      if (!districtId) continue;

      await Taluka.findOneAndUpdate(
        { name: t.name, districtId },
        { name: t.name, districtId },
        { upsert: true, new: true }
      );
    }

    // 4. Seed Crops
    logger.info("Upserting Crops...");
    const cropMap = {};
    for (const c of cropsData) {
      const doc = await Crop.findOneAndUpdate(
        { name: c.name },
        c,
        { upsert: true, new: true }
      );
      cropMap[c.name] = doc._id;
    }

    // 5. Seed Government Schemes
    logger.info("Upserting Schemes...");
    const schemeMap = {};
    for (const s of schemesData) {
      const doc = await GovernmentScheme.findOneAndUpdate(
        { name: s.name },
        s,
        { upsert: true, new: true }
      );
      schemeMap[s.name] = doc._id;
    }

    // 6. Seed Market Prices
    logger.info("Upserting Market Prices...");
    for (const m of marketData) {
      const cropId = cropMap[m.cropName] || null;
      await MarketPrice.findOneAndUpdate(
        { cropName: m.cropName, market: m.market, date: m.date, source: m.source },
        { ...m, crop: cropId },
        { upsert: true, new: true }
      );
    }

    // 7. Seed Demo Farmer (Ramesh Patel)
    logger.info("Upserting Demo Farmer user...");
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("password123", salt);
    
    // Upsert demo user
    const demoUser = await User.findOneAndUpdate(
      { phone: "9876543210" },
      {
        name: "Ramesh Patel",
        phone: "9876543210",
        email: "ramesh.patel@smartfarm.com",
        passwordHash,
        role: "farmer",
        isActive: true
      },
      { upsert: true, new: true }
    );

    // Upsert farmer profile context
    const demoProfile = await FarmerProfile.findOneAndUpdate(
      { userId: demoUser._id },
      {
        userId: demoUser._id,
        fullName: "Ramesh Patel",
        phone: "9876543210",
        email: "ramesh.patel@smartfarm.com",
        language: "en",
        state: "Gujarat",
        district: "Anand",
        taluka: "Anand",
        village: "Hadgud",
        farmSize: 12.5,
        farmSizeUnit: "acres",
        irrigationType: "Drip Irrigation",
        primaryCrops: ["Cotton", "Groundnut"],
        soilType: "Medium Black Clayey Soil",
        profileCompletion: 85
      },
      { upsert: true, new: true }
    );

    // Upsert demo farm
    const demoFarm = await Farm.findOneAndUpdate(
      { farmerId: demoUser._id, name: "Hadgud Block A" },
      {
        farmerId: demoUser._id,
        name: "Hadgud Block A",
        area: 8.5,
        areaUnit: "acres",
        state: "Gujarat",
        district: "Anand",
        taluka: "Anand",
        village: "Hadgud",
        soilType: "Medium Black Clayey Soil",
        irrigationType: "Drip Irrigation",
        waterSource: "Tubewell",
        latitude: 22.5694,
        longitude: 72.9904
      },
      { upsert: true, new: true }
    );

    // 8. Seed Soil Profiles & Advisories for Ramesh
    logger.info("Upserting Soil Profiles & Advisories...");
    for (const s of soilData) {
      // Check if profile belongs to Anand (associated to Ramesh's farm)
      const isRameshProfile = s.region === "Central Gujarat";
      const farmerId = isRameshProfile ? demoUser._id : new mongoose.Types.ObjectId(); // Generate a random ID for other region templates

      const soilDoc = await SoilProfile.findOneAndUpdate(
        { region: s.region, farmerId },
        { ...s, farmerId, farmId: isRameshProfile ? demoFarm._id : null },
        { upsert: true, new: true }
      );

      // Create linked SoilAdvisory record
      const cropsAdvice = s.region === "Central Gujarat" ? [
        { cropName: "Cotton", suitabilityPercentage: 95, reason: "Excellent black clay drainage." },
        { cropName: "Groundnut", suitabilityPercentage: 88, reason: "Moderate potassium level support." }
      ] : [
        { cropName: "Wheat", suitabilityPercentage: 90, reason: "Sufficient nutrient balance." }
      ];

      await SoilAdvisory.findOneAndUpdate(
        { soilProfileId: soilDoc._id },
        {
          farmerId,
          farmId: isRameshProfile ? demoFarm._id : null,
          soilProfileId: soilDoc._id,
          recommendedCrops: cropsAdvice,
          fertilizerRecommendations: [
            { fertilizerName: "Urea", dosage: "50 kg/acre", timing: "At sowing" },
            { fertilizerName: "SSP", dosage: "35 kg/acre", timing: "Basal plowing" }
          ],
          soilImprovement: ["Add leguminous crops to fix nitrogen content."],
          irrigationAdvice: "Schedule light drip cycles in evening hours.",
          generatedBy: "rule_engine"
        },
        { upsert: true, new: true }
      );
    }

    // 9. Seed Demo Crop Cycles & Tasks for Ramesh
    logger.info("Upserting Demo Crop Cycles & Tasks...");
    const sowingDate = new Date();
    sowingDate.setDate(sowingDate.getDate() - 60);
    const harvestDate = new Date();
    harvestDate.setDate(harvestDate.getDate() + 90);

    const cottonCropCycle = await CropCycle.findOneAndUpdate(
      { farmerId: demoUser._id, cropName: "Cotton", status: "active" },
      {
        farmerId: demoUser._id,
        farmId: demoFarm._id,
        cropId: cropMap["Cotton"] || null,
        cropName: "Cotton",
        variety: "Bt Cotton (BG-II)",
        area: 8.5,
        areaUnit: "acres",
        sowingDate,
        expectedHarvestDate: harvestDate,
        currentGrowthStage: "vegetative",
        healthStatus: "Good",
        status: "active",
        timeline: [
          { stage: "Land Preparation", status: "completed", date: sowingDate },
          { stage: "Sowing", status: "completed", date: sowingDate },
          { stage: "Germination", status: "completed", date: new Date(sowingDate.getTime() + 10*24*60*60*1000) },
          { stage: "Vegetative Growth", status: "active", date: new Date() }
        ]
      },
      { upsert: true, new: true }
    );

    // Upsert tasks
    await CropTask.findOneAndUpdate(
      { cropCycleId: cottonCropCycle._id, title: "Apply nitrogenous top dressing (Urea)" },
      {
        farmerId: demoUser._id,
        farmId: demoFarm._id,
        cropCycleId: cottonCropCycle._id,
        title: "Apply nitrogenous top dressing (Urea)",
        description: "Apply Urea based on nitrogen test deficiencies.",
        taskType: "fertilizer",
        dueDate: new Date(),
        status: "pending",
        priority: "high"
      },
      { upsert: true, new: true }
    );

    // 10. Seed Demo Recommendations & Notifications for Ramesh
    logger.info("Upserting Demo Recommendations & Notifications...");
    await AIRecommendation.findOneAndUpdate(
      { farmerId: demoUser._id, title: "Rain Expected: Delay Next Irrigation Cycle" },
      {
        farmerId: demoUser._id,
        farmId: demoFarm._id,
        cropCycleId: cottonCropCycle._id,
        type: "irrigation",
        priority: "high",
        title: "Rain Expected: Delay Next Irrigation Cycle",
        description: "Heavy rain forecasted tomorrow. Delaying your irrigation block avoids saturation.",
        reason: "Precipitation probability is 85% tomorrow.",
        action: "Delay irrigation for 24-48 hours. Clear drainage channels.",
        source: "rule_engine",
        metadata: { benefit: "Saves water and energy." }
      },
      { upsert: true, new: true }
    );

    await Notification.findOneAndUpdate(
      { farmerId: demoUser._id, title: "Heavy Rainfall Warning" },
      {
        farmerId: demoUser._id,
        type: "weather",
        title: "Heavy Rainfall Warning",
        message: "Thunderstorms expected in Anand tomorrow afternoon. Secure open fields.",
        priority: "high",
        isRead: false
      },
      { upsert: true, new: true }
    );

    logger.info("Database Seeding Completed Successfully.");
    if (!isReset) {
      process.exit(0);
    }
  } catch (error) {
    logger.error(`Database Seeding Failed: ${error.message}`);
    logger.error(error.stack);
    if (!isReset) {
      process.exit(1);
    }
  }
};

// Check if file run directly in node
if (require.main === module) {
  runSeeder();
}

module.exports = runSeeder;
