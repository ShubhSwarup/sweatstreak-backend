const express = require("express");
const router = express.Router();

const controller = require("./me.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/overview", controller.getOverview);

module.exports = router;
