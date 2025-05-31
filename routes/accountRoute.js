// routes/accountRoute.js
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")


// Route to account view
router.get("/", utilities.handleErrors(accountController.buildAccountView));

//Route to login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to process registration
router.post("/register", utilities.handleErrors(accountController.registerAccount))

module.exports = router;

