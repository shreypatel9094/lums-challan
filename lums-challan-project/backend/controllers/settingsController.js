const Settings = require("../models/Settings");

const getSettings = async (req, res) => {
  try {
    const settings = await Settings.get();
    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateSettings = async (req, res) => {
  try {
    const settingsData = req.body;

    const result = await Settings.update(settingsData);

    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getNextChallanNumber = async (req, res) => {
  try {
    const settings = await Settings.getNextChallanNumber();
    res.json(settings);
  } catch (error) {
    console.error("Error fetching challan number:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const incrementChallanNumber = async (req, res) => {
  try {
    const result = await Settings.incrementChallanNumber();
    res.json({ message: "Challan number incremented successfully" });
  } catch (error) {
    console.error("Error incrementing challan number:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getNextChallanNumber,
  incrementChallanNumber,
};