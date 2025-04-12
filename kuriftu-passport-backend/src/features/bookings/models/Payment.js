const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");
const Booking = require("./Booking");

const Payment = sequelize.define(
  "Payment",
  {
    paymentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "payment_id",
    },
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "booking_id",
      references: {
        model: Booking,
        key: "bookingId",
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM("credit_card", "debit_card", "bank_transfer"),
      allowNull: false,
      field: "payment_method",
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
      defaultValue: "pending",
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "transaction_id",
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "payment_date",
    },
  },
  {
    tableName: "payments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Define associations
Payment.belongsTo(Booking, { foreignKey: "bookingId" });

module.exports = Payment;
