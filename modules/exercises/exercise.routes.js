const express = require("express");
const router = express.Router();

const exerciseController = require("./exercise.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
router.use(authMiddleware);

router.get("/", exerciseController.getExercises);
router.get("/:id", exerciseController.getExercise);

module.exports = router;
