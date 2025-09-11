const pool = require("../db/connect");
const bcrypt = require("bcryptjs");

// --- MODIFIED FUNCTION ---
async function createUser({ username, email, password, role }) {
  // Hash the plain-text password received from the controller.
  // Since the controller checks if the password exists, it will never be null here.
  const hashedPassword = await bcrypt.hash(password, 10);

  // Call the stored procedure with the newly hashed password.
  return pool.query("CALL SP_DEALS_USERCREATION(?, ?, ?, ?)", [
    username, email, hashedPassword, role,
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

async function setPasswordResetToken(id, token, expires) {
    return pool.query("UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?", [token, expires, id]);
}

async function updateAvatar(id, avatarUrl) {
  return pool.query("UPDATE users SET avatar_url = ? WHERE id = ?", [avatarUrl, id]);
}

async function updateUsername(id, username) {
  return pool.query("UPDATE users SET username = ? WHERE id = ?", [username, id]);
}

module.exports = {
  createUser,
  findUserByEmail,
  getAll,
  updateUser,
  deleteUser,
  findUserById,
  findUsersByRole,
  updatePassword,
  setPasswordResetToken,
  updateAvatar,
  updateUsername,
};