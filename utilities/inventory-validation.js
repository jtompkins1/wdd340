// inventory-validation.js
const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

const inventoryModel = require("../models/inventory-model");

// Validation rules
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .isAlpha()
      .withMessage("Classification name must be alphabetic characters only, no spaces or special characters."),
  ];
};

// Check data and handle errors
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors: errors.array(),
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

module.exports = validate;