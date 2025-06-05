// routes/accountRoute.js
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')


// Route to account view
router.get("/", utilities.handleErrors(accountController.buildAccountView));

//Route to login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to account management view
router.get("/management",
    utilities.checkJWTToken,
    utilities.handleErrors(accountController.buildAccountManagement))

// Route to register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to process registration
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)


//route to process login
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;

