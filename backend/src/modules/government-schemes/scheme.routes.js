const express = require("express");
const schemeController = require("./scheme.controller");
const { authenticate } = require("../../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/", schemeController.getSchemes);
router.get("/recommended", schemeController.getRecommended);
router.post("/:id/check-eligibility", schemeController.checkEligibility);

module.exports = router;
