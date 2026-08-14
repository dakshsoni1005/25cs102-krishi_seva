const express = require("express");
const smartKrishiController = require("./smartKrishi.controller");
const { authenticate } = require("../../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/overview", smartKrishiController.getOverview);
router.get("/recommendations", smartKrishiController.getRecommendations);
router.post("/refresh", smartKrishiController.refreshRecommendations);

module.exports = router;
