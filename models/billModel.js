const pool = require("../db/connect");
const { v4: uuidv4 } = require('uuid');

// models/billModel.js

async function createBill(billData) {
  const { products, total_amount, gst_amount, created_by } = billData;
  const bill_id = uuidv4();

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Action 1: Create the main bill entry
    const billSql = "INSERT INTO bills (id, total_amount, gst_amount, created_by) VALUES (?, ?, ?, ?)";
    await connection.query(billSql, [bill_id, total_amount, gst_amount, created_by]);

    // Action 2: Insert each product as a bill item
    const billItemsSql = "INSERT INTO bill_items (bill_id, product_id, quantity, price) VALUES ?";
    const billItemsValues = products.map(p => [bill_id, p.id, p.quantity, p.price]);
    await connection.query(billItemsSql, [billItemsValues]);

    // Action 3: Decrease the stock for each product
    for (const product of products) {
      const stockSql = "UPDATE stocks SET quantity = quantity - ? WHERE product_id = ? AND quantity >= ?";
      const [stockResult] = await connection.query(stockSql, [product.quantity, product.id, product.quantity]);
      
      // If no rows were updated, it means there was not enough stock
      if (stockResult.affectedRows === 0) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }
    }

    // If all actions succeed, commit the transaction
    await connection.commit();
    return { id: bill_id };

  } catch (error) {
    // If any action fails, roll back all previous actions
    await connection.rollback();
    throw error; // Send the error back to the controller
  } finally {
    connection.release();
  }
}
async function getBills() {
    const [rows] = await pool.query("SELECT * FROM bills ORDER BY created_at DESC");
    return rows;
}

// ADD THIS NEW FUNCTION
async function getBillById(id) {
  const billSql = "SELECT * FROM bills WHERE id = ?";
  const itemsSql = `
    SELECT bi.quantity, bi.price, p.name 
    FROM bill_items bi
    JOIN products p ON bi.product_id = p.id
    WHERE bi.bill_id = ?
  `;

  const [billRows] = await pool.query(billSql, [id]);
  if (billRows.length === 0) {
    return null;
  }

  const [itemRows] = await pool.query(itemsSql, [id]);
  
  return { ...billRows[0], items: itemRows };
}

// ADD THIS NEW FUNCTION
async function getBillingStats() {
  // Get stats for today
  const todaySql = `
    SELECT 
      COUNT(*) as billsToday, 
      COALESCE(SUM(total_amount), 0) as revenueToday 
    FROM bills 
    WHERE DATE(created_at) = CURDATE()
  `;
  
  // Get overall stats
  const totalSql = `
    SELECT 
      COUNT(*) as totalBills, 
      COALESCE(SUM(total_amount), 0) as totalRevenue 
    FROM bills
  `;

  const [[todayStats]] = await pool.query(todaySql);
  const [[totalStats]] = await pool.query(totalSql);

  return { ...todayStats, ...totalStats };
}

module.exports = {
  createBill,
  getBills,
  getBillById, // EXPORT THE NEW FUNCTION 
  getBillingStats // EXPORT THE NEW FUNCTION
};