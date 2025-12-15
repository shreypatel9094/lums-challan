const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/auth");
const customerRoutes = require("./routes/customers");

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "LUMS Challan Management Backend API" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
