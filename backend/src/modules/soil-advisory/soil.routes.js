const express = require("express");
const soilController = require("./soil.controller");
const { authenticate } = require("../../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/", soilController.getSoil);
router.get("/region/:region", soilController.getSoilByRegion);
router.post("/retest", soilController.retestSoil);

module.exports = router;
