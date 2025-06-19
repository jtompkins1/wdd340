// routes/accountRoute.js
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

router.use(utilities.checkJWTToken); // Apply to all routes under /account


// Route to account view
//router.get("/", utilities.handleErrors(accountController.buildAccountView));

//Route to login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));



// Route to account management view
router.get("/",
  utilities.checkLogin,
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

//Route to logout view
router.get("/logout", utilities.handleErrors(accountController.buildLogout));

// Route to process logout
router.post(
  "/logout",
  utilities.checkLogin,
  utilities.handleErrors(accountController.accountLogout)
)

// route to build account update view
router.get("/update/:id", utilities.handleErrors(accountController.buildUpdateAccount));

// route to process the account update
router.post("/update", utilities.handleErrors(accountController.updateUserAccount));

// route to process change password
router.post('/change-password', utilities.handleErrors(accountController.changePassword));

module.exports = router;

