const pool = require("../db/connect");

async function create({ name, description, sku, price, created_by }) {
  return pool.query("CALL SP_DEALS_PRODUCTCREATION(?, ?, ?, ?, ?)", [
    name, description, sku, price, created_by
  ]);
}

async function getAll() {
  const [rows] = await pool.query("CALL SP_DEALS_PRODUCTVIEW()");
  return rows[0];
}

async function getById(id) {
  const [rows] = await pool.query("CALL SP_DEALS_PRODUCTVIEWBYID(?)", [id]);
  return rows[0][0];
}

async function update({ id, name, description, sku, price, updated_by }) {
  return pool.query("CALL SP_DEALS_PRODUCTUPDATE(?, ?, ?, ?, ?, ?)", [
    id, name, description, sku, price, updated_by
  ]);
}

async function remove(id) {
  return pool.query("CALL SP_DEALS_PRODUCTDELETE(?)", [id]);
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};