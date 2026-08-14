const express = require("express");
const mongoose = require("mongoose");

// Import Sub-Routers
const authRouter = require("../modules/auth/auth.routes");
const farmersRouter = require("../modules/farmers/farmers.routes");
const farmsRouter = require("../modules/farms/farms.routes");
const cropsRouter = require("../modules/crop-management/crop.routes");
const smartKrishiRouter = require("../modules/smart-krishi/smartKrishi.routes");
const pestScannerRouter = require("../modules/pest-scanner/pestScanner.routes");
const aiGuruRouter = require("../modules/ai-guru/aiGuru.routes");
const soilRouter = require("../modules/soil-advisory/soil.routes");
const weatherRouter = require("../modules/weather/weather.routes");
const marketRouter = require("../modules/market-prices/market.routes");
const schemesRouter = require("../modules/government-schemes/scheme.routes");
const notificationsRouter = require("../modules/notifications/notifications.routes");

const router = express.Router();

// Health Check Route
router.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  res.status(200).json({
    success: true,
    data: {
      application: "healthy",
      database: states[dbState] || "unknown"
    }
  });
});

// Register Feature Sub-Routers
router.use("/auth", authRouter);
router.use("/farmers", farmersRouter);
router.use("/farms", farmsRouter);
router.use("/crops", cropsRouter);
router.use("/smart-krishi", smartKrishiRouter);
router.use("/pest-scanner", pestScannerRouter);
router.use("/ai-guru", aiGuruRouter);
router.use("/soil", soilRouter);
router.use("/weather", weatherRouter);
router.use("/market", marketRouter);
router.use("/schemes", schemesRouter);
router.use("/notifications", notificationsRouter);

module.exports = router;
