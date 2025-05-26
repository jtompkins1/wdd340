const pool = require("../database/")
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}





// Route to account view
router.get("/", utilities.handleErrors(accountController.buildAccountView));

//Route to login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to process registration
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;
module.exports = {
  registerAccount
}

