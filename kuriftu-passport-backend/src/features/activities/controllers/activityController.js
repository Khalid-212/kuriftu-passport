const { Activity } = require("../models");
const { validationResult } = require("express-validator");

const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      where: { available: true },
    });

    res.json({
      status: "success",
      data: activities,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching activities",
    });
  }
};

const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id);

    if (!activity) {
      return res.status(404).json({
        status: "error",
        message: "Activity not found",
      });
    }

    res.json({
      status: "success",
      data: activity,
    });
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching activity",
    });
  }
};

const createActivity = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price } = req.body;

    const activity = await Activity.create({
      name,
      description,
      price,
      available: true,
    });

    res.status(201).json({
      status: "success",
      data: activity,
    });
  } catch (error) {
    console.error("Error creating activity:", error);
    res.status(500).json({
      status: "error",
      message: "Error creating activity",
    });
  }
};

const updateActivity = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, available } = req.body;
    const activity = await Activity.findByPk(req.params.id);

    if (!activity) {
      return res.status(404).json({
        status: "error",
        message: "Activity not found",
      });
    }

    await activity.update({
      name,
      description,
      price,
      available,
    });

    res.json({
      status: "success",
      data: activity,
    });
  } catch (error) {
    console.error("Error updating activity:", error);
    res.status(500).json({
      status: "error",
      message: "Error updating activity",
    });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id);

    if (!activity) {
      return res.status(404).json({
        status: "error",
        message: "Activity not found",
      });
    }

    await activity.destroy();

    res.json({
      status: "success",
      message: "Activity deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({
      status: "error",
      message: "Error deleting activity",
    });
  }
};

module.exports = {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
};
