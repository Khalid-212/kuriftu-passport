const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const dotenv = require("dotenv");

// Load environment variables from the root directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Check for required environment variables
const requiredEnvVars = ["PORT", "DATABASE_URL", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

const sequelize = require("./config/database");
const swaggerSpec = require("./config/swagger");

// Import routes
const authRoutes = require("./features/auth/routes");
const roomsRoutes = require("./features/rooms/routes");
const activitiesRoutes = require("./features/activities/routes");
const loyaltyRoutes = require("./features/loyalty/routes");
const bookingsRoutes = require("./features/bookings/routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads")
  )
);

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Kuriftu Passport API Documentation",
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/activities", activitiesRoutes);
app.use("/api/loyalty", loyaltyRoutes);
app.use("/api/bookings", bookingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `API Documentation available at http://localhost:${PORT}/api-docs`
  );
});
