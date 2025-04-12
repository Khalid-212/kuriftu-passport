const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "user_id",
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "phone_number",
    },
    idPhotoUrl: {
      type: DataTypes.STRING(512),
      allowNull: true,
      field: "id_photo_url",
    },
    passwordHash: {
      type: DataTypes.STRING(512),
      allowNull: false,
      field: "password_hash",
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("passwordHash")) {
          user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
        }
      },
    },
  }
);

// Instance method to check password
User.prototype.checkPassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = User;
