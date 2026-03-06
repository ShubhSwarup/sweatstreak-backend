const express = require("express");
const router = express.Router();

const controller = require("./xp.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/", controller.getXP);

module.exports = router;
