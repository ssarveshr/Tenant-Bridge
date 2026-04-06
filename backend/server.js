require("dotenv").config();
const express = require("express");
const cors = require("cors");
const paymentRoutes = require("./routes/payment");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/payment", paymentRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
