const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");
const User = require("../../auth/models/User");
const LoyaltyLevel = require("./LoyaltyLevel");

const UserLoyaltyStatus = sequelize.define(
  "UserLoyaltyStatus",
  {
    loyaltyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "loyalty_id",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: User,
        key: "userId",
      },
    },
    levelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "level_id",
      references: {
        model: LoyaltyLevel,
        key: "levelId",
      },
    },
    activatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "activated_at",
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "expires_at",
    },
  },
  {
    tableName: "user_loyalty_status",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Define associations
UserLoyaltyStatus.belongsTo(User, { foreignKey: "userId" });
UserLoyaltyStatus.belongsTo(LoyaltyLevel, { foreignKey: "levelId" });

module.exports = UserLoyaltyStatus;
