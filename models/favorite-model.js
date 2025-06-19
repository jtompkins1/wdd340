//models/favorite-model.js

const pool = require("../database/")

/* ***************************
 *  Add a new favorite
 * ************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = "INSERT INTO favorites (account_id, inv_id) VALUES ($1, $2) ON CONFLICT (account_id, inv_id) DO NOTHING RETURNING *"
    const result = await pool.query(sql, [account_id, inv_id])
    if (result.rowCount > 0) {
      return { success: true, message: "Favorite added" }
    } else {
      return { success: false, message: "Favorite already exists" }
    }
  } catch (error) {
    if (error.code === '23503') { // Foreign key violation
      return { success: false, message: "Invalid account or inventory item" }
    }
    return { success: false, message: error.message }
  }
}

/* ***************************
 *  Remove a favorite
 * ************************** */
async function removeFavorite(account_id, inv_id) {
  try {
    const sql = "DELETE FROM favorites WHERE account_id = $1 AND inv_id = $2"
    const result = await pool.query(sql, [account_id, inv_id])
    if (result.rowCount > 0) {
      return { success: true, message: "Favorite removed" }
    } else {
      return { success: false, message: "Favorite not found" }
    }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

/* ***************************
 *  Get all favorites for an account
 * ************************** */
async function getFavorites(account_id) {
  try {
    const sql = "SELECT i.* FROM favorites f JOIN inventory i ON f.inv_id = i.inv_id WHERE f.account_id = $1"
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    return { error: error.message }
  }
}

module.exports = { addFavorite, removeFavorite, getFavorites }