const express = require("express");
const { body } = require("express-validator");
const {
  getUserLoyaltyStatus,
  addPointsTransaction,
  getPointsHistory,
} = require("../controllers/loyaltyController");
const auth = require("../../../middleware/auth");

const router = express.Router();

// Validation middleware
const pointsTransactionValidation = [
  body("points").isInt().withMessage("Points must be an integer"),
  body("activityType")
    .trim()
    .notEmpty()
    .withMessage("Activity type is required"),
  body("description").optional().trim(),
];

// Protected routes
router.get("/status", auth, getUserLoyaltyStatus);
router.post(
  "/transaction",
  auth,
  pointsTransactionValidation,
  addPointsTransaction
);
router.get("/history", auth, getPointsHistory);

module.exports = router;
