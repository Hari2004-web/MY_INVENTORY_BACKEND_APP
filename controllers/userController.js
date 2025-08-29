const pool = require("../db/connect");


// Create User
const createUser = async (req, res) => {
  const { username, email, password_hash, role } = req.body;
  try {
    const [result] = await pool.query(
      "CALL SP_DEALS_USERCREATION(?, ?, ?, ?)",
      [username, email, password_hash, role]
    );
    res.status(201).json({ success: true, message: "User created", data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;
  try {
    const [result] = await pool.query(
      "CALL SP_DEALS_USERUPDATE(?, ?, ?, ?)",
      [id, username, email, role]
    );
    res.json({ success: true, message: "User updated", data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("CALL SP_DEALS_USERDELETE(?)", [id]);
    res.json({ success: true, message: "User deleted", data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// In userController.js

// View All Users
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("CALL SP_DEALS_USERVIEW()");
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// View Single User by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
};
