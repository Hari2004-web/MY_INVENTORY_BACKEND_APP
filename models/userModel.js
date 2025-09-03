const pool = require("../db/connect");

async function createUser({ username, email, password, role }) {
  return pool.query("CALL SP_DEALS_USERCREATION(?, ?, ?, ?)", [
    username,
    email,
    password, 
    role,
  ]);
}

async function findUserByEmail(email) {
  const [rows] = await pool.query("CALL SP_DEALS_USERBYEMAIL(?)", [email]);
  return rows[0][0];
}

async function findUserById(id) {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
}

async function updatePassword(id, hashedPassword) {
  // FIX: Replaced the non-existent stored procedure with a standard SQL UPDATE query.
  return pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [
    hashedPassword,
    id,
  ]);
}

async function getAll() {
  const [rows] = await pool.query("CALL SP_DEALS_USERVIEW()");
  return rows[0];
}

async function updateUser({ id, username, email, role }) {
  return pool.query("CALL SP_DEALS_USERUPDATE(?, ?, ?, ?)", [id, username, email, role]);
}

async function deleteUser(id) {
  return pool.query("CALL SP_DEALS_USERDELETE(?)", [id]);
}

module.exports = {
  createUser,
  findUserByEmail,
  getAll,
  updateUser,
  deleteUser,
  findUserById,
  updatePassword,
};