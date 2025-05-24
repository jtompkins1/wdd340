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

module.exports = invCont
