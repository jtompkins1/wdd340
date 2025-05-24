// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);


// Route to build detail view
router.get("/detail/:invId", invController.buildByInvId);

// Route to trigger intentional error
router.get("/error", utilities.handleErrors(invController.triggerError));


module.exports = router;

