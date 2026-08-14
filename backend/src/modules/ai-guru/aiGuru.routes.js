const express = require("express");
const aiGuruController = require("./aiGuru.controller"); // Wait, let's look at controller export name: aiGuru.controller.js
const { authenticate } = require("../../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/conversations", aiGuruController.getConversations);
router.get("/conversations/:id", aiGuruController.getDetails);
router.post("/chat", aiGuruController.chat);
router.delete("/conversations/:id", aiGuruController.deleteConvo);

module.exports = router;
