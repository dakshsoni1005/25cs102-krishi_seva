const express = require("express");
const authController = require("./auth.controller");
const { authenticate } = require("../../middleware/auth");
const { validateBody } = require("../../middleware/validate");
const { registerSchema, loginSchema } = require("./auth.validation");
const { authLimiter } = require("../../middleware/rateLimiter");

const router = express.Router();

// Apply auth rate limiters to signup and login
router.post("/register", authLimiter, validateBody(registerSchema), authController.register);
router.post("/login", authLimiter, validateBody(loginSchema), authController.login);
router.post("/refresh", authController.refresh);

// Protected routes (Authenticate session needed)
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getMe);

module.exports = router;
