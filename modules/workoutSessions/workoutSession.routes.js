const express = require("express");
const router = express.Router();

const controller = require("./workoutSession.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.use(authMiddleware);

/**
 * @swagger
 * /sessions/start:
 *   post:
 *     summary: Start a workout session
 *     tags: [WorkoutSessions]
 *     security:
 *       - bearerAuth: []
 */
router.post("/start", controller.startSession);

/**
 * @swagger
 * /sessions/{id}/exercises:
 *   post:
 *     summary: Add exercise to workout session
 *     tags: [WorkoutSessions]
 *     security:
 *       - bearerAuth: []
 */
router.post("/:id/exercises", controller.addExercise);

/**
 * @swagger
 * /sessions/{id}/sets:
 *   post:
 *     summary: Add set to exercise in session
 *     tags: [WorkoutSessions]
 *     security:
 *       - bearerAuth: []
 */
router.post("/:id/sets", controller.addSet);

/**
 * @swagger
 * /sessions/{id}/finish:
 *   post:
 *     summary: Finish workout session
 *     tags: [WorkoutSessions]
 *     security:
 *       - bearerAuth: []
 */
router.post("/:id/finish", controller.finishSession);

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Get workout history
 *     tags: [WorkoutSessions]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", controller.getSessions);

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Get workout session details
 *     tags: [WorkoutSessions]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", controller.getSessionById);

router.get("/active", controller.getActiveSession);

module.exports = router;
