const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

const accountController = {}

/* ****************************************
*  Deliver account view
* *************************************** */
accountController.buildAccountView = async (req, res, next) =>{
  let nav = await utilities.getNav()
  res.render("account/account", {
    title: "My Account",
    nav,
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
  })
}

/* ****************************************
*  Deliver register view
* *************************************** */
accountController.buildRegister = async (req, res, next) => {
  let nav = await utilities.getNav()
  let register = await utilities.buildRegister(req, res, next)
  res.render("account/register", {
    title: "Register",
    nav,
    register,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async (req, res, next) => {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

module.exports = accountController

