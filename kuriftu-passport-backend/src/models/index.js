const User = require("../features/auth/models/User");
const Room = require("../features/rooms/models/Room");
const Activity = require("../features/activities/models/Activity");
const LoyaltyLevel = require("../features/loyalty/models/LoyaltyLevel");
const UserLoyaltyStatus = require("../features/loyalty/models/UserLoyaltyStatus");
const PointsTransaction = require("../features/loyalty/models/PointsTransaction");
const { Booking, Payment } = require("../features/bookings/models");

module.exports = {
  User,
  Room,
  Activity,
  LoyaltyLevel,
  UserLoyaltyStatus,
  PointsTransaction,
  Booking,
  Payment,
}; 