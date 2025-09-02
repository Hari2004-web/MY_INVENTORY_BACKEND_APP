const pool = require("../db/connect");

async function create({ product_id, quantity, created_by }) {
  return pool.query("CALL SP_DEALS_STOCKCREATE(?, ?, ?)", [
    product_id, quantity, created_by
  ]);
}

async function getAll() {
  const [rows] = await pool.query("CALL SP_DEALS_STOCKVIEW()");
  return rows[0];
}

async function getById(id) {
  const [rows] = await pool.query("CALL SP_DEALS_STOCKVIEWBYID(?)", [id]);
  return rows[0][0];
}

async function update({ id, quantity, updated_by }) {
  return pool.query("CALL SP_DEALS_STOCKUPDATE(?, ?, ?)", [
    id, quantity, updated_by
  ]);
}

async function remove(id) {
  return pool.query("CALL SP_DEALS_STOCKDELETE(?)", [id]);
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};