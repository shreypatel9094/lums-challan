const Challan = require("../models/Challan");

const getAllChallans = async (req, res) => {
  try {
    const challans = await Challan.findAll();
    // Convert ObjectId to string for the response
    const challansWithId = challans.map(challan => ({
      ...challan,
      id: challan._id.toString()
    }));
    res.json(challansWithId);
  } catch (error) {
    console.error("Error fetching challans:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getChallanById = async (req, res) => {
  try {
    const challan = await Challan.findById(req.params.id);
    if (!challan) {
      return res.status(404).json({ message: "Challan not found" });
    }
    // Convert ObjectId to string for the response
    const challanWithId = {
      ...challan,
      id: challan._id.toString()
    };
    res.json(challanWithId);
  } catch (error) {
    console.error("Error fetching challan:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createChallan = async (req, res) => {
  try {
    const challanData = req.body;

    const challanId = await Challan.create(challanData);

    res.status(201).json({
      message: "Challan created successfully",
      challan: {
        id: challanId.toString(),
        ...challanData
      },
    });
  } catch (error) {
    console.error("Error creating challan:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateChallan = async (req, res) => {
  try {
    const challanData = req.body;

    const result = await Challan.update(req.params.id, challanData);

    if (result === 0) {
      return res.status(404).json({ message: "Challan not found" });
    }

    res.json({ message: "Challan updated successfully" });
  } catch (error) {
    console.error("Error updating challan:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteChallan = async (req, res) => {
  try {
    const result = await Challan.delete(req.params.id);

    if (result === 0) {
      return res.status(404).json({ message: "Challan not found" });
    }

    res.json({ message: "Challan deleted successfully" });
  } catch (error) {
    console.error("Error deleting challan:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllChallans,
  getChallanById,
  createChallan,
  updateChallan,
  deleteChallan,
};