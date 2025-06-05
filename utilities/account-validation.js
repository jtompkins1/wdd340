//utilities/account-validation.js

const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
const accountModel = require("../models/account-model")

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
        throw new Error("Email exists. Please log in or use different email")
        }
       }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

validate.loginRules = () => [
  body('account_email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('A valid email is required.'),
  body('account_password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters.')
]

validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await require('../utilities/').getNav()
    return res.status(400).render('account/login', {
      title: 'Login',
      nav,
      errors: errors.array(),
      account_email: req.body.account_email,
    })
  }
  next()
}

module.exports = validate