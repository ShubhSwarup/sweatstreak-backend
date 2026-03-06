const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const authRoutes = require("./modules/auth/auth.routes");
const exerciseRoutes = require("./modules/exercises/exercise.routes");
const templateRoutes = require("./modules/workoutTemplates/workoutTemplate.routes.js");
const workoutSessionRoutes = require("./modules/workoutSessions/workoutSession.routes");
const progressionRoutes = require("./modules/progression/progression.routes");
const streakRoutes = require("./modules/streak/streak.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");
const analyticsRoutes = require("./modules/analytics/analytics.routes");
const xpRoutes = require("./modules/xp/xp.routes");
const plateRoutes = require("./modules/plateCalculator/plate.routes");

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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/sessions", workoutSessionRoutes);
app.use("/api/progression", progressionRoutes);
app.use("/api/streak", streakRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/xp", xpRoutes);
app.use("/api/plateCalculator", plateRoutes);
module.exports = app;
