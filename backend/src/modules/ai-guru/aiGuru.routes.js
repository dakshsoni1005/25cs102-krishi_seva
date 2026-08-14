const express = require("express");
const aiGuruController = require("./aiGuru.controller");
const { authenticate } = require("../../middleware/auth");
const { aiGuruLimiter } = require("../../middleware/rateLimiter");

const router = express.Router();

router.use(authenticate);

router.get("/conversations", aiGuruController.getConversations);
router.get("/conversations/:id", aiGuruController.getDetails);
router.post("/chat", aiGuruLimiter, aiGuruController.chat);
router.delete("/conversations/:id", aiGuruController.deleteConvo);

module.exports = router;
