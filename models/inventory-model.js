//inventory-model.js
const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(

      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,

      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get inventory by inv_id
 * ************************** */
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      WHERE i.inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  }
  catch (error) {
    console.error("getInventoryByInvId error " + error)
    throw error
  }
}

/* ***************************
 *  add Classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [classification_name]);
    return result.rowCount > 0;
  } catch (error) {
    if (error.code === "23505") { // Unique constraint violation (PostgreSQL)
      return { error: "Classification name already exists." };
    }
    console.error(error);
    return { error: "Database error." };
  }
}

module.exports = {addClassification,getClassifications, getInventoryByClassificationId, getInventoryByInvId}