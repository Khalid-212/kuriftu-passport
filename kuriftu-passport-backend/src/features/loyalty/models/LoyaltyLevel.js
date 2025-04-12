const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

const LoyaltyLevel = sequelize.define(
  "LoyaltyLevel",
  {
    levelId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "level_id",
    },
    levelName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "level_name",
    },
    minPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "min_points",
    },
    maxPoints: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "max_points",
    },
    validityInMonths: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 12,
      field: "validity_in_months",
    },
  },
  {
    tableName: "loyalty_levels",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = LoyaltyLevel;
