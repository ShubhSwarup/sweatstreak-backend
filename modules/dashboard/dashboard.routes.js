const express = require("express");
const router = express.Router();

const controller = require("./dashboard.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/", controller.getDashboard);

module.exports = router;
