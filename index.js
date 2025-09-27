// FIX: Load environment variables FIRST, before any other code runs.
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require('path');

// Import all route files
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const stockRoutes = require("./routes/stockRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const publicRoutes = require('./routes/publicRoutes');
const billRoutes = require('./routes/billRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const customerAuthRoutes = require('./routes/customerAuthRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/bills', billRoutes);
app.use('/api/customer-auth', customerAuthRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use('/api/public', publicRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});