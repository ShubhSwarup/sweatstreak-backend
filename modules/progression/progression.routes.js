const express = require("express");
const router = express.Router();

const progressionController = require("./progression.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
router.use(authMiddleware);

router.get("/:exerciseId", progressionController.getSuggestion);

module.exports = router;
