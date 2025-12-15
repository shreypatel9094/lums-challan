const Payment = require("../models/Payment");

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    // Convert ObjectId to string for the response
    const paymentsWithId = payments.map(payment => ({
      ...payment,
      id: payment._id.toString()
    }));
    res.json(paymentsWithId);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    // Convert ObjectId to string for the response
    const paymentWithId = {
      ...payment,
      id: payment._id.toString()
    };
    res.json(paymentWithId);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPaymentsByCustomerId = async (req, res) => {
  try {
    const payments = await Payment.findByCustomerId(req.params.customerId);
    // Convert ObjectId to string for the response
    const paymentsWithId = payments.map(payment => ({
      ...payment,
      id: payment._id.toString()
    }));
    res.json(paymentsWithId);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPaymentsByChallanId = async (req, res) => {
  try {
    const payments = await Payment.findByChallanId(req.params.challanId);
    // Convert ObjectId to string for the response
    const paymentsWithId = payments.map(payment => ({
      ...payment,
      id: payment._id.toString()
    }));
    res.json(paymentsWithId);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createPayment = async (req, res) => {
  try {
    const paymentData = req.body;

    const paymentId = await Payment.create(paymentData);

    res.status(201).json({
      message: "Payment created successfully",
      payment: {
        id: paymentId.toString(),
        ...paymentData
      },
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updatePayment = async (req, res) => {
  try {
    const paymentData = req.body;

    const result = await Payment.update(req.params.id, paymentData);

    if (result === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment updated successfully" });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  getPaymentsByCustomerId,
  getPaymentsByChallanId,
  createPayment,
  updatePayment,
};