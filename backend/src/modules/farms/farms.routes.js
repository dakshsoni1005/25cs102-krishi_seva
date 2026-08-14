const express = require("express");
const farmsController = require("./farms.controller");
const { authenticate } = require("../../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/", farmsController.getFarms);
router.post("/", farmsController.createFarm);
router.delete("/:id", farmsController.deleteFarm);

module.exports = router;
