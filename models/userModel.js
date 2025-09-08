const pool = require("../db/connect");
const bcrypt = require("bcryptjs");

async function createUser({ username, email, password, role }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return pool.query("CALL SP_DEALS_USERCREATION(?, ?, ?, ?)", [
    username, email, hashedPassword, role
  ]);
}

async function findUserByEmail(email) {
  const [rows] = await pool.query("CALL SP_DEALS_USERBYEMAIL(?)", [email]);
  return rows[0][0]; 
}

async function getAll() {
  const [rows] = await pool.query("CALL SP_DEALS_USERVIEW()");
  return rows[0];
}

async function findUserById(id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
}

async function findUsersByRole(role) {
  const [rows] = await pool.query("SELECT id, email, username FROM users WHERE role = ?", [role]);
  return rows;
}

async function updateUser({ id, username, email, role }) {
  return pool.query("CALL SP_DEALS_USERUPDATE(?, ?, ?, ?)", [id, username, email, role]);
}

async function deleteUser(id) {
  return pool.query("CALL SP_DEALS_USERDELETE(?)", [id]);
}

async function updatePassword(id, hashedPassword) {
    return pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [hashedPassword, id]);
}

module.exports = {
  createUser,
  findUserByEmail,
  getAll,
  updateUser,
  deleteUser,
  findUserById,
  findUsersByRole, // Ensure this is exported
  updatePassword,
};