const express = require("express");
const router = express.Router();

const streakController = require("./streak.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
router.use(authMiddleware);

router.get("/", streakController.getStreak);

module.exports = router;
