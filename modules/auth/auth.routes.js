const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const authLimiter = require("../../middlewares/rateLimit.middleware");

router.use(authLimiter);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

module.exports = router;
