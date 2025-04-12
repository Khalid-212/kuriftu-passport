require("dotenv").config();
const bcrypt = require("bcryptjs");
const {
  User,
  Room,
  Activity,
  LoyaltyLevel,
  UserLoyaltyStatus,
  PointsTransaction,
} = require("../models");

const seedDatabase = async () => {
  try {
    // Create users
    const users = await User.bulkCreate([
      {
        name: "John Doe",
        email: "john@example.com",
        phoneNumber: "1234567890",
        passwordHash: await bcrypt.hash("password123", 10),
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        phoneNumber: "0987654321",
        passwordHash: await bcrypt.hash("password123", 10),
      },
    ]);

    // Create rooms
    const rooms = await Room.bulkCreate([
      {
        roomType: "Deluxe",
        description: "Spacious room with ocean view",
        price: 200.0,
        available: true,
      },
      {
        roomType: "Suite",
        description: "Luxury suite with private balcony",
        price: 350.0,
        available: true,
      },
      {
        roomType: "Standard",
        description: "Comfortable room with city view",
        price: 150.0,
        available: true,
      },
    ]);

    // Create activities
    const activities = await Activity.bulkCreate([
      {
        name: "Spa Treatment",
        description: "Relaxing spa treatment for 2 hours",
        price: 100.0,
        available: true,
      },
      {
        name: "Yoga Class",
        description: "Morning yoga session with instructor",
        price: 50.0,
        available: true,
      },
      {
        name: "Cooking Class",
        description: "Learn to cook local cuisine",
        price: 75.0,
        available: true,
      },
    ]);

    // Create loyalty levels
    const loyaltyLevels = await LoyaltyLevel.bulkCreate([
      {
        levelName: "Bronze",
        minPoints: 0,
        maxPoints: 1000,
        validityInMonths: 12,
      },
      {
        levelName: "Silver",
        minPoints: 1001,
        maxPoints: 5000,
        validityInMonths: 12,
      },
      {
        levelName: "Gold",
        minPoints: 5001,
        maxPoints: null,
        validityInMonths: 12,
      },
    ]);

    // Create user loyalty statuses
    await UserLoyaltyStatus.bulkCreate([
      {
        userId: users[0].userId,
        levelId: loyaltyLevels[1].levelId,
        activatedAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      },
      {
        userId: users[1].userId,
        levelId: loyaltyLevels[0].levelId,
        activatedAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      },
    ]);

    // Create points transactions
    await PointsTransaction.bulkCreate([
      {
        userId: users[0].userId,
        points: 2000,
        activityType: "booking",
        description: "Room booking points",
        pointsYear: new Date().getFullYear(),
      },
      {
        userId: users[1].userId,
        points: 500,
        activityType: "booking",
        description: "Activity booking points",
        pointsYear: new Date().getFullYear(),
      },
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Run the seeding function
seedDatabase();
