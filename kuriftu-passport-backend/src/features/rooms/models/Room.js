const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

const Room = sequelize.define(
  "Room",
  {
    roomId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "room_id",
    },
    roomType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "room_type",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "rooms",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Room;
