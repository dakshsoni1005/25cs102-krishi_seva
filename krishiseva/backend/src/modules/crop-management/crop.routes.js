const express = require("express");
const cropController = require("./crop.controller");
const { authenticate } = require("../../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/", cropController.getCrops);
router.post("/", cropController.addCrop);
router.patch("/:id/stage", cropController.updateStage);
router.patch("/:id/tasks/:taskId", cropController.toggleTask);
router.post("/:id/tasks", cropController.addTask);

module.exports = router;
