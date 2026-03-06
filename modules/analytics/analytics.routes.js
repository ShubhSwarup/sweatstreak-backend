const express = require("express");
const router = express.Router();

const controller = require("./analytics.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/weekly", controller.getWeeklyStats);

module.exports = router;
