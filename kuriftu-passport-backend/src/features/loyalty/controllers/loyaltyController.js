const {
  LoyaltyLevel,
  UserLoyaltyStatus,
  PointsTransaction,
  User,
} = require("../models");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

// Get user's loyalty status
const getUserLoyaltyStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const currentYear = new Date().getFullYear();

    // Get current loyalty status
    const loyaltyStatus = await UserLoyaltyStatus.findOne({
      where: { userId },
      include: [
        {
          model: LoyaltyLevel,
          attributes: ["levelName", "minPoints", "maxPoints"],
        },
      ],
      order: [["activatedAt", "DESC"]],
    });

    // Calculate current year's points
    const points = await PointsTransaction.sum("points", {
      where: {
        userId,
        pointsYear: currentYear,
      },
    });

    res.json({
      status: "success",
      data: {
        currentPoints: points || 0,
        loyaltyLevel: loyaltyStatus?.LoyaltyLevel?.levelName || "None",
        tierActivatedAt: loyaltyStatus?.activatedAt,
        tierExpiresAt: loyaltyStatus?.expiresAt,
      },
    });
  } catch (error) {
    console.error("Error fetching loyalty status:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching loyalty status",
    });
  }
};

// Add points transaction
const addPointsTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { points, activityType, description } = req.body;
    const currentYear = new Date().getFullYear();

    // Create points transaction
    const transaction = await PointsTransaction.create({
      userId,
      points,
      activityType,
      description,
      pointsYear: currentYear,
    });

    // Update loyalty level if necessary
    await updateUserLoyaltyLevel(userId);

    res.status(201).json({
      status: "success",
      data: transaction,
    });
  } catch (error) {
    console.error("Error adding points transaction:", error);
    res.status(500).json({
      status: "error",
      message: "Error adding points transaction",
    });
  }
};

// Helper function to update user's loyalty level
const updateUserLoyaltyLevel = async (userId) => {
  const currentYear = new Date().getFullYear();

  // Calculate total points for the current year
  const totalPoints = await PointsTransaction.sum("points", {
    where: {
      userId,
      pointsYear: currentYear,
    },
  });

  // Get all loyalty levels
  const loyaltyLevels = await LoyaltyLevel.findAll({
    order: [["minPoints", "DESC"]],
  });

  // Find the appropriate level based on points
  const newLevel = loyaltyLevels.find(
    (level) =>
      totalPoints >= level.minPoints &&
      (!level.maxPoints || totalPoints <= level.maxPoints)
  );

  if (!newLevel) return;

  // Check if user already has this level
  const currentStatus = await UserLoyaltyStatus.findOne({
    where: { userId },
    order: [["activatedAt", "DESC"]],
  });

  if (currentStatus && currentStatus.levelId === newLevel.levelId) return;

  // Create new loyalty status
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + newLevel.validityInMonths);

  await UserLoyaltyStatus.create({
    userId,
    levelId: newLevel.levelId,
    activatedAt: new Date(),
    expiresAt,
  });
};

// Get points history
const getPointsHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { year } = req.query;
    const currentYear = new Date().getFullYear();
    const targetYear = year || currentYear;

    const transactions = await PointsTransaction.findAll({
      where: {
        userId,
        pointsYear: targetYear,
      },
      order: [["transactionDate", "DESC"]],
    });

    res.json({
      status: "success",
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching points history:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching points history",
    });
  }
};

module.exports = {
  getUserLoyaltyStatus,
  addPointsTransaction,
  getPointsHistory,
};
