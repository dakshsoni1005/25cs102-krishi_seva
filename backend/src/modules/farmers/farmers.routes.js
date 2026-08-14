const express = require("express");
const farmersController = require("./farmers.controller");
const { authenticate } = require("../../middleware/auth");

const router = express.Router();

// All routes are protected by authentication guard
router.use(authenticate);

router.get("/profile", farmersController.getProfile);
router.put("/profile", farmersController.updateProfile);

module.exports = router;
