const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./modules/auth/auth.routes");
const exerciseRoutes = require("./modules/exercises/exercise.routes");
const templateRoutes = require("./modules/workoutTemplates/workoutTemplate.routes.js");
const workoutSessionRoutes = require("./modules/workoutSessions/workoutSession.routes");
const progressionRoutes = require("./modules/progression/progression.routes");

const app = express();

// Helmet → security headers
// Morgan → request logging
// Rate limit → brute force protection
// JWT auth → authentication
app.use(cors());
app.use(helmet());
app.use(morgan("dev")); //HTTP request logging.
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "SweatStreak API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/workout-sessions", workoutSessionRoutes);
app.use("/api/progression", progressionRoutes);

module.exports = app;
