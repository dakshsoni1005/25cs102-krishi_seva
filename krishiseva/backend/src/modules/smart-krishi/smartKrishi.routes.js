const express = require("express");
const smartKrishiController = require("./smartKrishi.controller");
const { authenticate } = require("../../middleware/auth");

const router = express.Router();

// Public / system health route for Smart Krishi integration
router.get("/health", smartKrishiController.getHealth);

// Protected routes (Require farmer JWT authentication)
router.use(authenticate);

router.get("/overview", smartKrishiController.getOverview);
router.get("/recommendations", smartKrishiController.getRecommendations);
router.post("/recommendations", smartKrishiController.getRecommendations);
router.post("/refresh", smartKrishiController.refreshRecommendations);

// Smart Krishi feature proxy endpoints
router.get("/crops", smartKrishiController.getCrops);
router.get("/districts", smartKrishiController.getDistricts);
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
