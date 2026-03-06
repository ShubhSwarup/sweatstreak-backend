const express = require("express");
const router = express.Router();
const plateController = require("./plate.controller");

router.get("/:targetWeight/:barWeight", plateController.getPlateCalculation);

module.exports = router;
