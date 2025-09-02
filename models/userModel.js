const pool = require("../db/connect");

// This function now correctly assumes the password it receives is already hashed.
async function createUser({ username, email, password, role }) {
  // Pass the hashed password directly to the stored procedure.
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
};