const express = require("express");
const weatherController = require("./weather.controller");
const { authenticate } = require("../../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/", weatherController.getWeather);
router.get("/alerts", weatherController.getAlerts);

module.exports = router;
