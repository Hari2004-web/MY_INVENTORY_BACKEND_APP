const pool = require("../db/connect");


// Modified to handle optional password and include token fields
async function createUser({ username, email, password, role, reset_token, reset_token_expires }) {
  const sql = "INSERT INTO users (username, email, password_hash, role, reset_token, reset_token_expires) VALUES (?, ?, ?, ?, ?, ?)";
  const [result] = await pool.query(sql, [
    username,
    email,
    password || null, // Store null if no password is provided
    role,
    reset_token || null,
    reset_token_expires || null,
  ]);
  // Return the email to be used in the controller
  return { id: result.insertId, email };
}

// ... (the rest of the file remains the same)
async function findUserByEmail(email) {
  const sql = "SELECT * FROM users WHERE email = ?";
  const [rows] = await pool.query(sql, [email]);
  return rows[0];
}

async function getAll() {
  const sql = "SELECT id, username, email, role, created_at, updated_at, avatar_url FROM users";
  const [rows] = await pool.query(sql);
  return rows;
}

async function findUserById(id) {
  const sql = "SELECT * FROM users WHERE id = ?";
  const [rows] = await pool.query(sql, [id]);
  return rows[0];
}

async function findUsersByRole(role) {
  const sql = "SELECT id, email, username FROM users WHERE role = ?";
  const [rows] = await pool.query(sql, [role]);
  return rows;
}

async function findUserByResetToken(token) {
  const sql = "SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?";
  const [rows] = await pool.query(sql, [token, new Date()]); // Use new Date() for comparison
  return rows[0];
}

async function updateUser({ id, username, email, role }) {
    const sql = "UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?";
    return pool.query(sql, [username, email, role, id]);
}

async function deleteUser(id) {
    const sql = "DELETE FROM users WHERE id = ?";
    return pool.query(sql, [id]);
}

async function updatePassword(id, hashedPassword) {
  return pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [hashedPassword, id]);
}

async function updatePasswordAndClearToken(id, hashedPassword) {
  const sql = "UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?";
  return pool.query(sql, [hashedPassword, id]);
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
  findUserByResetToken,
  updatePasswordAndClearToken
};