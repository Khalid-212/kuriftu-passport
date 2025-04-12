const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");
const User = require("../../auth/models/User");
const Room = require("../../rooms/models/Room");
const Activity = require("../../activities/models/Activity");

const Booking = sequelize.define(
  "Booking",
  {
    bookingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "booking_id",
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
    bookingType: {
      type: DataTypes.ENUM("room", "activity"),
      allowNull: false,
      field: "booking_type",
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "room_id",
      references: {
        model: Room,
        key: "roomId",
      },
    },
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "activity_id",
      references: {
        model: Activity,
        key: "activityId",
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "end_date",
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
      defaultValue: "pending",
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "total_amount",
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "paid", "refunded"),
      defaultValue: "pending",
      field: "payment_status",
    },
  },
  {
    tableName: "bookings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Define associations
Booking.belongsTo(User, { foreignKey: "userId" });
Booking.belongsTo(Room, { foreignKey: "roomId" });
Booking.belongsTo(Activity, { foreignKey: "activityId" });

module.exports = Booking;
