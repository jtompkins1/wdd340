//controllers/favoriteController.js
const utilities = require("../utilities/")
const favoriteModel = require("../models/favorite-model")
//const bcrypt = require("bcryptjs")
//const jwt = require("jsonwebtoken")
//const { hash } = require("bcryptjs")
//require("dotenv").config()

const favoriteController = {}

/* ****************************************
*  Build Favorites View
* *************************************** */

favoriteController.buildFavorites = async (req, res) => {
const account_id = req.session.account_id;

  if (!req.session.loggedIn || !account_id) {
    req.flash("notice", "Please log in to view favorites.");
    return res.redirect("/account/login")
  }
  
  const favorites = await favoriteModel.getFavorites(account_id);
  const nav = await utilities.getNav();
  res.render("account/favorites", {
    title: "My Favorites",
    nav,
    favorites,
    errors: null,
  })
}

favoriteController.addFavorite = async (req, res) => {
  if (!res.locals.loggedIn || !res.locals.accountData) {
    return res.status(401).json({ success: false, message: "Please log in to add favorites." })
  }
  const account_id = res.locals.accountData.account_id
  const invId = parseInt(req.params.invId)
  const result = await favoriteModel.addFavorite(account_id, invId)
  res.json(result)
}

favoriteController.removeFavorite = async (req, res) => {
  if (!res.locals.loggedIn || !res.locals.accountData) {
    return res.status(401).json({ success: false, message: "Please log in to remove favorites." })
  }
  const account_id = res.locals.accountData.account_id
  const invId = parseInt(req.params.invId)
  const result = await favoriteModel.removeFavorite(account_id, invId)
  res.json(result)
}


module.exports = favoriteController;