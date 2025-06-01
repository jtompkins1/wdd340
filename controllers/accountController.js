//controllers/accountController.js
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

const accountController = {}

/* ****************************************
*  Deliver account view
* *************************************** */
accountController.buildAccountView = async (req, res, next) =>{
  let nav = await utilities.getNav()
  res.render("account/account", {
    title: "My Account",
    nav,
    errors: null,
  })
}


/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async (req, res, next) => {
  let nav = await utilities.getNav()
  let login = await utilities.buildLogin(req, res, next)
  res.render("account/login", {
    title: "Login",
    nav,
    login,
    errors: null,
  })
}

/* ****************************************
*  Deliver register view
* *************************************** */
accountController.buildRegister = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      account_firstname: "",
      account_lastname: "", 
      account_email: "",
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async (req, res, next) => {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult.rowCount === 1) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.redirect("/account/login")
    // res.status(201).render("account/login", {
    //   title: "Login",
    //   nav,
    // })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }
}

module.exports = accountController

