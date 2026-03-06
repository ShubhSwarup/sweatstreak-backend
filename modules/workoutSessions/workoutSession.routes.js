const express = require("express");
const router = express.Router();

const controller = require("./workoutSession.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.use(authMiddleware);

router.post("/start", controller.startSession);

router.post("/:id/exercises", controller.addExercise);

router.post("/:id/sets", controller.addSet);

router.post("/:id/finish", controller.finishSession);

router.get("/", controller.getSessions);

router.get("/:id", controller.getSessionById);

module.exports = router;