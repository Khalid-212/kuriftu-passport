const { Room } = require("../models");
const { validationResult } = require("express-validator");

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      where: { available: true },
    });

    res.json({
      status: "success",
      data: rooms,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching rooms",
    });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);

    if (!room) {
      return res.status(404).json({
        status: "error",
        message: "Room not found",
      });
    }

    res.json({
      status: "success",
      data: room,
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching room",
    });
  }
};

const createRoom = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { roomType, description, price } = req.body;

    const room = await Room.create({
      roomType,
      description,
      price,
      available: true,
    });

    res.status(201).json({
      status: "success",
      data: room,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      status: "error",
      message: "Error creating room",
    });
  }
};

const updateRoom = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { roomType, description, price, available } = req.body;
    const room = await Room.findByPk(req.params.id);

    if (!room) {
      return res.status(404).json({
        status: "error",
        message: "Room not found",
      });
    }

    await room.update({
      roomType,
      description,
      price,
      available,
    });

    res.json({
      status: "success",
      data: room,
    });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({
      status: "error",
      message: "Error updating room",
    });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);

    if (!room) {
      return res.status(404).json({
        status: "error",
        message: "Room not found",
      });
    }

    await room.destroy();

    res.json({
      status: "success",
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({
      status: "error",
      message: "Error deleting room",
    });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
