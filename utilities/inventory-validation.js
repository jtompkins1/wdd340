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


// Validation rules for inventory
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .matches(/^[a-zA-Z]{1,50}$/)
      .withMessage("Make must be alphabetic, up to 50 characters, no spaces or special characters."),
    body("inv_model")
      .trim()
      .notEmpty()
    .matches(/^[a-zA-Z0-9\s]{1,50}$/)
      .withMessage("Model must be alphanumeric with spaces, up to 50 characters."),
    body("inv_year")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage(`Year must be between 1900 and ${new Date().getFullYear() + 1}.`),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    body("inv_description")
      .trim()
      .notEmpty()
      .isLength({max: 500})
      .withMessage("Description must be 500 characters or less."),
    body("inv_image")
      .trim()
      .notEmpty()
      .matches(/^\/images\/vehicles\/[a-zA-Z0-9-]+\.(png|jpg|jpeg)$/)
      .withMessage("Image path must be in /images/vehicles/ with a .png, .jpg, or .jpeg extension."),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .matches(/^\/images\/vehicles\/[a-zA-Z0-9-]+\.(png|jpg|jpeg)$/)
      .withMessage("Thumbnail path must be in /images/vehicles/ with a .png, .jpg, or .jpeg extension."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive integer."),
    body("inv_color")
      .trim()
      .notEmpty()
      .matches(/^[a-zA-Z\s]{1,50}$/)
      .withMessage("Color must be alphabetic, up to 50 characters."),
    body("classification_id")
      .isInt()
      .withMessage("Valid classification must be selected.")
  ];
};

// Validate inventory data and handle errors
validate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
    return;
  }
  next();
};

// Validate edit-inventory data and handle errors
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(classification_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: errors.array(),
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
    return;
  }
  next();
};


module.exports = validate;