const { Booking, Payment, Room, Activity, User } = require("../models");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      bookingType,
      roomId,
      activityId,
      startDate,
      endDate,
      paymentMethod,
    } = req.body;

    // Validate booking type and corresponding ID
    if (bookingType === "room" && !roomId) {
      return res.status(400).json({
        status: "error",
        message: "Room ID is required for room bookings",
      });
    }

    if (bookingType === "activity" && !activityId) {
      return res.status(400).json({
        status: "error",
        message: "Activity ID is required for activity bookings",
      });
    }

    // Check if room/activity is available
    if (bookingType === "room") {
      const room = await Room.findByPk(roomId);
      if (!room || !room.available) {
        return res.status(400).json({
          status: "error",
          message: "Room is not available",
        });
      }

      // Check for overlapping bookings
      const overlappingBooking = await Booking.findOne({
        where: {
          roomId,
          status: {
            [Op.notIn]: ["cancelled", "completed"],
          },
          [Op.or]: [
            {
              startDate: {
                [Op.between]: [startDate, endDate],
              },
            },
            {
              endDate: {
                [Op.between]: [startDate, endDate],
              },
            },
          ],
        },
      });

      if (overlappingBooking) {
        return res.status(400).json({
          status: "error",
          message: "Room is already booked for these dates",
        });
      }
    } else {
      const activity = await Activity.findByPk(activityId);
      if (!activity || !activity.available) {
        return res.status(400).json({
          status: "error",
          message: "Activity is not available",
        });
      }
    }

    // Calculate total amount
    let totalAmount = 0;
    if (bookingType === "room") {
      const room = await Room.findByPk(roomId);
      const days = Math.ceil(
        (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
      );
      totalAmount = room.price * days;
    } else {
      const activity = await Activity.findByPk(activityId);
      totalAmount = activity.price;
    }

    // Create booking
    const booking = await Booking.create({
      userId: req.user.userId,
      bookingType,
      roomId,
      activityId,
      startDate,
      endDate,
      totalAmount,
    });

    // Create payment record
    const payment = await Payment.create({
      bookingId: booking.bookingId,
      amount: totalAmount,
      paymentMethod,
      status: "pending",
    });

    res.status(201).json({
      status: "success",
      data: {
        booking,
        payment,
      },
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({
      status: "error",
      message: "Error creating booking",
    });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.userId },
      include: [
        {
          model: Room,
          attributes: ["roomType", "description", "price"],
        },
        {
          model: Activity,
          attributes: ["name", "description", "price"],
        },
        {
          model: Payment,
          attributes: ["amount", "status", "paymentMethod"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      status: "success",
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching bookings",
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        bookingId: req.params.id,
        userId: req.user.userId,
      },
      include: [
        {
          model: Room,
          attributes: ["roomType", "description", "price"],
        },
        {
          model: Activity,
          attributes: ["name", "description", "price"],
        },
        {
          model: Payment,
          attributes: ["amount", "status", "paymentMethod"],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    res.json({
      status: "success",
      data: booking,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching booking",
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        bookingId: req.params.id,
        userId: req.user.userId,
      },
      include: [Payment],
    });

    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        status: "error",
        message: "Booking is already cancelled",
      });
    }

    // Update booking status
    await booking.update({ status: "cancelled" });

    // If payment was made, update payment status
    if (booking.Payment && booking.Payment.status === "completed") {
      await booking.Payment.update({ status: "refunded" });
    }

    res.json({
      status: "success",
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({
      status: "error",
      message: "Error cancelling booking",
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
};
