const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes"); // ✅ FIXED
const stockRoutes = require("./routes/stockRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Public auth routes
app.use("/api/auth", authRoutes);

// Protected user routes
app.use("/api/users", userRoutes);

// Product routes
app.use("/api/products", productRoutes);
// Stock routes
app.use("/api/stocks", stockRoutes);

app.get("/", (req, res) => res.send("Inventory Backend Running 🚀"));

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
