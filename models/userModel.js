const pool = require("../db/connect");
const bcrypt = require("bcryptjs");

async function createUser({ username, email, password, role }) {
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
  // This stored procedure call should match your database
  return pool.query("CALL SP_DEALS_USERCREATION(?, ?, ?, ?)", [
    username, email, hashedPassword, role,
  ]);
}

async function findUserByEmail(email) {
  const [rows] = await pool.query("CALL SP_DEALS_USERBYEMAIL(?)", [email]);
  return rows[0][0];
}

async function getAll() {
  // This is the function that is likely causing the error
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
// ADD THIS NEW FUNCTION AT THE END
async function updateAvatar(id, avatarUrl) {
  return pool.query("UPDATE users SET avatar_url = ? WHERE id = ?", [avatarUrl, id]);
}
// ... (keep all your existing functions)

// ADD THIS NEW FUNCTION
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