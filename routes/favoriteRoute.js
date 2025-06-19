//routes/favoriteRoute.js

const express = require("express")
const router = new express.Router()
const favoriteController = require("../controllers/favoriteController")
const utilities = require("../utilities")

router.get("/favorites", utilities.checkLogin, favoriteController.buildFavorites)
router.post("/favorites/:invId", utilities.checkLogin, favoriteController.addFavorite)
router.post("/favorites/remove/:invId", utilities.checkLogin, favoriteController.removeFavorite)

module.exports = router