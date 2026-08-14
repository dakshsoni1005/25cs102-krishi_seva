const express = require("express");
const smartKrishiController = require("./smartKrishi.controller");

const router = express.Router();

// Public / system health & dropdown routes for Smart Krishi integration
router.get("/health", smartKrishiController.getHealth);
router.get("/crops", smartKrishiController.getCrops);
router.get("/districts", smartKrishiController.getDistricts);
router.get("/crops/by-district/:district", smartKrishiController.getCropsByDistrict);

// Recommendations query endpoints (Supports both public POST and authenticated calls)
router.get("/recommendations", smartKrishiController.getRecommendations);
router.post("/recommendations", smartKrishiController.getRecommendations);
router.post("/refresh", smartKrishiController.refreshRecommendations);

// Feature proxy endpoints
router.get("/overview", smartKrishiController.getOverview);
router.get("/soil/:district", smartKrishiController.getSoil);
router.get("/fertilizers/:crop", smartKrishiController.getFertilizers);
router.get("/irrigation/:crop", smartKrishiController.getIrrigation);
router.get("/diseases/:crop", smartKrishiController.getDiseases);
router.get("/pests/:crop", smartKrishiController.getPests);
router.get("/crop-calendar/:crop", smartKrishiController.getCropCalendar);
router.get("/weather/:district", smartKrishiController.getWeather);
router.get("/market-prices/:crop", smartKrishiController.getMarketPrices);
router.get("/government-advisories", smartKrishiController.getGovernmentAdvisories);

module.exports = router;
