// controllers/authController.js
const pool = require("../db/connect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Register
const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("CALL SP_DEALS_USERCREATION(?, ?, ?, ?)", [
      username,
      email,
      hashedPassword,
      role || "manager",
    ]);

    res.status(201).json({ success: true, message: "User registered" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }

  try {
    const [rows] = await pool.query("CALL SP_DEALS_USERBYEMAIL(?)", [email]);
    const user = rows[0][0]; // first row, first record
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ success: false, message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { register, login };
