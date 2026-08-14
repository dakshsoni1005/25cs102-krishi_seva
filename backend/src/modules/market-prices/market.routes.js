const express = require("express");
const marketController = require("./market.controller");
const { authenticate } = require("../../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/", marketController.getPrices);
router.get("/trends", marketController.getTrends);
router.get("/watchlist", marketController.getWatchlist);
router.post("/watchlist", marketController.toggleWatchlist);

module.exports = router;
