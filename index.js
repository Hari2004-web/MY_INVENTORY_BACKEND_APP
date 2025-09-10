const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require('path'); // Import the path module

// Import all of your route files
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const stockRoutes = require("./routes/stockRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
// Add this line near the top with your other route imports
const publicRoutes = require('./routes/publicRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve static files for avatars AND products
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes - This section tells your server to use the imported route files
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/users", userRoutes); // This line makes all user routes available
app.use("/api/messages", messageRoutes); // This line makes all message routes available
const PORT = process.env.PORT || 5000;

// Add this line with your other app.use() statements for routes
app.use('/api/public', publicRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});