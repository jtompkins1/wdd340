// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const classValidate = require('../utilities/inventory-validation')


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);


// Route to build detail view
router.get("/detail/:invId", invController.buildByInvId);

// Route to trigger intentional error
router.get("/error", utilities.handleErrors(invController.triggerError));

// Route for management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to add-classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));


// Route to validate add classification form submission
router.post(
  "/add-classification",
  classValidate.classificationRules(),
  classValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);


// Route to add-inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to validate add inventory form submission
router.post(
  "/add-inventory",
  classValidate.inventoryRules(),
  classValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;

