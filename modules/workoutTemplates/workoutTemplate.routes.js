const express = require("express");
const router = express.Router();

const workoutController = require("./workoutTemplate.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/", workoutController.getTemplates);

router.get("/:id", workoutController.getTemplateById);

router.post("/", workoutController.createTemplate);

router.put("/:id", workoutController.updateTemplate);

router.delete("/:id", workoutController.deleteTemplate);

module.exports = router;
