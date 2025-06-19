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
  const account_id = req.user.account_id; // Set by checkJWTToken middleware
  const favorites = await favoriteModel.getFavorites(account_id);
  const nav = await utilities.getNav();
  res.render("account/favorites", {
    title: "My Favorites",
    nav,
    favorites,
    errors: null,
  });
};

// Add a favorite
favoriteController.addFavorite = async (req, res) => {
  if (!req.user || !req.user.account_id) {
    req.flash("notice", "Please log in to add favorites.");
    return res.redirect("/account/login");
  }
  const account_id = req.user.account_id;
  const invId = parseInt(req.params.invId);
  await favoriteModel.addFavorite(account_id, invId);
  res.json({ success: true });
};

// Remove a favorite
favoriteController.removeFavorite = async (req, res) => {
  if (!req.user || !req.user.account_id) {
    req.flash("notice", "Please log in to remove favorites.");
    return res.redirect("/account/login");
  }
  const account_id = req.user.account_id;
  const invId = parseInt(req.params.invId);
  await favoriteModel.removeFavorite(account_id, invId);
  res.json({ success: true });
};


module.exports = favoriteController;