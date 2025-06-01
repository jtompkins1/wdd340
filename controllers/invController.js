//invController.js
const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build By Inventory ID
 * ************************** */

invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  try {
    const data = await invModel.getInventoryByInvId(inv_id)
    if (!data) {
      const error = new Error("Inventory item not found")
      error.status = 404
      return next(error)
    }
    const detail = await utilities.buildVehicleDetail(data)
    let nav = await utilities.getNav()
    res.render("./inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      detail,
    })
  } catch (error) {
    console.error("Error in buildByInvId: ", error)
    next(error)
  }
}

/* ***************************
 *  Trigger an intentional error
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  const error = new Error("Intentional Error.")
  error.status = 500
  next(error)
}

/* ***************************
 *  Build management view
 * ************************** */

invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } catch (error) {
    console.error("Error in buildManagement: ", error)
    next(error)
  }
}


/* ***************************
 *  Build add-classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name: "",
    })
  } catch (error) {
    console.error("Error in buildAddClassification: ", error)
    next(error)
  }

}

/* ***************************
 *  Process add-classification form submission
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  try {
    const result = await invModel.addClassification(classification_name)
    if (typeof result === "object" && result.error) {
      const nav = await utilities.getNav()
      req.flash("notice", result.error);
      res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: [{ msg: result.error }],
        classification_name,
      });
    } else if (result) {
      req.flash("notice", "Classification added successfully.");
      const updatedNav = await utilities.getNav();
      res.render("inventory/management", {
        title: "Inventory Management",
        updatedNav,
      });
    } else {
      const nav = await utilities.getNav()
      req.flash("notice", "Classification could not be added.");
      res.render("/inventory/add-classification"),{
        title: "Add New Classification",
        nav,
        errors: [{ msg: "Database insertion failed." }],
        classification_name,
      };
    }
  } catch (error) {
    console.error("Error in addClassification: ", error)
    next(error)
  }
}

/* ***************************
 *  Build add-inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
    })
  } catch (error) {
    console.error("Error in buildAddInventory: ", error)
    next(error)
  }

}

module.exports = invCont
