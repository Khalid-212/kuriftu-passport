const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");
const User = require("../../auth/models/User");

const PointsTransaction = sequelize.define(
  "PointsTransaction",
  {
    transactionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "transaction_id",
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
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    activityType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "activity_type",
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "transaction_date",
    },
    pointsYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "points_year",
    },
  },
  {
    tableName: "points_transactions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Define associations
PointsTransaction.belongsTo(User, { foreignKey: "userId" });

module.exports = PointsTransaction;
