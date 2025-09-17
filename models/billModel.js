const pool = require("../db/connect");
const { v4: uuidv4 } = require('uuid');

async function createBill(billData) {
  // This function now only creates a PENDING bill record.
  // The official bill_no is only assigned upon payment confirmation.
  const { products, total_amount, gst_amount, created_by } = billData;
  const bill_uuid = uuidv4();
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const billSql = "INSERT INTO bills (id, total_amount, gst_amount, created_by, status) VALUES (?, ?, ?, ?, 'pending')";
    await connection.query(billSql, [bill_uuid, total_amount, gst_amount, created_by]);

    if (products && products.length > 0) {
      const billItemsSql = "INSERT INTO bill_items (bill_id, product_id, quantity, price) VALUES ?";
      const billItemsValues = products.map(p => [bill_uuid, p.id, p.quantity, p.price]);
      await connection.query(billItemsSql, [billItemsValues]);
    }
    
    await connection.commit();
    return { id: bill_uuid };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function finalizeBillAndDeductStock(billId, products) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // --- THE SOLUTION LOGIC ---

        // Step 1: Create a new, separate table to safely manage the invoice sequence.
        await connection.query(`
          CREATE TABLE IF NOT EXISTS invoice_sequence (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY
          )
        `);

        // Step 2: Insert a dummy record to get the next unique, sequential number.
        const [result] = await connection.query('INSERT INTO invoice_sequence VALUES (NULL)');
        const sequential_bill_no = result.insertId;

        // Step 3: Create the final, formatted invoice ID.
        const formatted_bill_no = `NEXUS_INV_${String(sequential_bill_no).padStart(3, '0')}`;

        // Step 4: Update the bill with the new formatted bill_no and set status to 'paid'.
        const updateBillSql = "UPDATE bills SET status = 'paid', bill_no = ? WHERE id = ? AND status = 'pending'";
        const [billResult] = await connection.query(updateBillSql, [formatted_bill_no, billId]);

        if (billResult.affectedRows === 0) {
            throw new Error("Bill was not found or was already processed.");
        }
        
        // Step 5: Decrease the stock for each product.
        for (const product of products) {
            const stockSql = "UPDATE stocks SET quantity = quantity - ? WHERE product_id = ? AND quantity >= ?";
            const [stockResult] = await connection.query(stockSql, [product.quantity, product.id, product.quantity]);
            
            if (stockResult.affectedRows === 0) {
                throw new Error(`Insufficient stock for product: ${product.name}`);
            }
        }

        await connection.commit();
        return { success: true, bill_no: formatted_bill_no };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// The functions below now correctly read the formatted `bill_no` directly from the database.
async function getBills() {
    const sql = "SELECT * FROM bills WHERE bill_no IS NOT NULL ORDER BY created_at DESC";
    const [rows] = await pool.query(sql);
    return rows;
}

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

async function getBillingStats() {
  const sql = "SELECT COUNT(*) as totalBills, COALESCE(SUM(total_amount), 0) as totalRevenue FROM bills WHERE status = 'paid'";
  const [[stats]] = await pool.query(sql);
  return stats;
}

async function getBillsByUserId(userId) {
  const sql = "SELECT * FROM bills WHERE created_by = ? AND bill_no IS NOT NULL ORDER BY created_at DESC";
  const [rows] = await pool.query(sql, [userId]);
  return rows;
}

module.exports = {
  createBill,
  getBills,
  getBillById,
  getBillingStats,
  getBillsByUserId,
  finalizeBillAndDeductStock,
};