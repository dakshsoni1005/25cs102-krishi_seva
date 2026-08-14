const express = require("express");
const notificationsController = require("./notifications.controller");
const { authenticate } = require("../../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/", notificationsController.getNotifications);
router.patch("/:id/read", notificationsController.markAsRead);
router.patch("/read-all", notificationsController.markAllAsRead);

module.exports = router;
