// controllers/favoritesController.js
const utilities = require("../utilities/")
const favoriteModel = require("../models/favorite-model")

const favoriteController = {}

/* ****************************************
*  Build favorites view
* *************************************** */
favoriteController.buildFavoritesView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const account_id = req.user.account_id
    const favorites = await favoriteModel.getFavorites(account_id)
    const fav = await utilities.buildFavoritesGrid(favorites)
    res.render("account/favorites", {
      title: "My Favorites",
      nav,
      fav,
      errors: null,
    })
  } catch (error) {
    console.error("Error in buildFavoritesView: ", error)
    next(error)
  }
}

/* ****************************************
*  Process add favorite
* *************************************** */
favoriteController.addFavorite = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const account_id = req.user.account_id
    const inv_id = parseInt(req.params.invId)
    const result = await favoriteModel.addFavorite(account_id, inv_id)
    if (result.success) {
      req.flash("notice", result.message || "Item added to favorites.")
      res.redirect(req.get('Referrer') || '/account/favorites')
    } else {
      req.flash("notice", result.message || "Failed to add item to favorites.")
      res.redirect(req.get('Referrer') || '/account/favorites')
    }
  } catch (error) {
      console.error("Error in addFavorite: ", error)
      next(error)
    }
}


/* ****************************************
*  Process remove favorite
* *************************************** */
favoriteController.removeFavorite = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const account_id = req.user.account_id
    const inv_id = parseInt(req.params.invId)
    const result = await favoriteModel.removeFavorite(account_id, inv_id)
    if (result.success) {
      req.flash("notice", result.message || "Item removed from favorites.")
      res.redirect(req.get('Referrer') || '/account/favorites')
    } else {
      req.flash("notice", result.message || "Failed to remove item from favorites.")
      res.redirect(req.get('Referrer') || '/account/favorites')
    }
  } catch (error) {
    console.error("Error in removeFavorite: ", error)
    next(error)
  }
}

module.exports = favoriteController