const Customer = require("../models/Customer");

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    // Convert ObjectId to string for the response
    const customersWithId = customers.map(customer => ({
      ...customer,
      id: customer._id.toString()
    }));
    res.json(customersWithId);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    // Convert ObjectId to string for the response
    const customerWithId = {
      ...customer,
      id: customer._id.toString()
    };
    res.json(customerWithId);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, phone, address, gst_number, opening_balance } = req.body;

    const customerId = await Customer.create({
      name,
      phone,
      address,
      gst_number,
      opening_balance: opening_balance || 0,
    });

    res.status(201).json({
      message: "Customer created successfully",
      customer: {
        id: customerId.toString(),
        name,
        phone,
        address,
        gst_number,
        opening_balance: opening_balance || 0,
      },
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { name, phone, address, gst_number, opening_balance } = req.body;

    const result = await Customer.update(req.params.id, {
      name,
      phone,
      address,
      gst_number,
      opening_balance,
    });

    if (result === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer updated successfully" });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const result = await Customer.delete(req.params.id);

    if (result === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};