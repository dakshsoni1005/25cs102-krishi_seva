const express = require("express");
const pestScannerController = require("./pestScanner.controller");
const { authenticate } = require("../../middleware/auth");
const upload = require("../../middleware/upload");
const { pestScannerLimiter } = require("../../middleware/rateLimiter");

const router = express.Router();

router.use(authenticate);

// POST /api/pest-scanner/analyze accepts file upload
router.post("/analyze", pestScannerLimiter, upload.single("file"), pestScannerController.analyzeLeaf);
router.get("/history", pestScannerController.getHistory);

module.exports = router;
