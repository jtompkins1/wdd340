//controllers/accountController.js
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { hash } = require("bcryptjs")
require("dotenv").config()

const accountController = {}

/* ****************************************
*  Deliver account view
* *************************************** */
// accountController.buildAccountView = async (req, res, next) =>{
//   let nav = await utilities.getNav()
//   res.render("account/", {
//     title: "My Account",
//     nav,
//     errors: null,
//   })
// }


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
    res.redirect("account/login")
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

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async (req, res) => {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  try {
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
      return
    }
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      req.session.loggedIn = true
      req.session.userName = accountData.account_firstname
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    next(new Error('Access Forbidden'))
  }
}

//deliver account management view
accountController.buildAccountManagement = async (req, res, next) => {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Build logout process
 * ************************************ */
accountController.buildLogout = (req, res) => {
  res.clearCookie("jwt");
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.redirect("/account/");
    }
    res.redirect("/");
  });
};

/* ****************************************
 *  Build Update Account View
 * ************************************ */
accountController.buildUpdateAccount = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    let accountData = await accountModel.getAccountById(req.params.id);
    res.render("account/update", {
      title: "Update Account",
      nav,
      account: accountData,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Process Update Account
 * ************************************ */
accountController.updateUserAccount = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    const { account_id, account_firstname, account_lastname, account_email} = req.body;

    // Check if the email already exists for another account
    const existingAccount = await accountModel.getAccountByEmail(account_email);
    if (existingAccount && existingAccount.account_id !== parseInt(account_id)) {
      req.flash("notice", "Email already in use. Please choose a different email.");
      return res.status(400).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account: req.body,
      });
    }

    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult.rowCount === 1) {
      req.flash("notice", "Account updated successfully.");
      res.redirect("/account/");
    } else {
      req.flash("notice", "Failed to update the account. Please try again.");
      res.status(500).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account: req.body,
      });
    }
  } catch (error) {
    next(error);
  }
};


/* ****************************************
*  Process Password Change
* *************************************** */
accountController.changePassword = async (req, res, next) => {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  try {
    // regular password and cost (salt is generated automatically)
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const regResult = await accountModel.updatePassword(
      account_id,
      hashedPassword
    )
    if (regResult.rowCount === 1) {
      req.flash(
        "notice",
        `Congratulations, your password has been updated.`
      )
      res.redirect("/account/")
} else {
      req.flash("notice", "Sorry, the password update failed.");
      res.redirect(`/account/update/${account_id}`);
    }
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the password update.");
    res.redirect(`/account/update/${account_id}`);
  }
}

module.exports = accountController;

