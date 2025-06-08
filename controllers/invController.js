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
 *  Build inventory management view
 * ************************** */

invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()

    let classificationList = await utilities.buildClassificationList();

    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationList
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
      const nav = await utilities.getNav();
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
        nav: updatedNav,
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
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: null,
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      classification_id: ""
    })
  } catch (error) {
    console.error("Error in buildAddInventory: ", error)
    next(error)
  }

};

/* Process add-inventory form */
invCont.addInventory = async function (req, res, next) {
  try {
    const result = await invModel.addInventory(req.body); // Pass req.body directly
    let nav = await utilities.getNav();
    if (result) { // Check the boolean result
      req.flash("notice", "Inventory item added successfully.");
      res.render("inventory/management", {
        title: "Inventory Management",
        nav,
      });
    } else {
      let classificationList = await utilities.buildClassificationList(req.body.classification_id);
      req.flash("notice", "Failed to add inventory item.");
      res.render("inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        classificationList,
        errors: [{ msg: "Database insertion failed." }],
        ...req.body// Spread the req.body 
      });
    }
  } catch (error) {
    console.error("Error in addInventory controller:", error);
    next(error);
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit-inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* Process update inventory Data */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
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
    })
  }
}

/* ***************************
 *  Build delete-confirm view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  //const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* Process delete Data */
invCont.removeInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventory(inv_id)
  //let nav = await utilities.getNav()
  if (deleteResult.rowCount === 1) {
    req.flash("notice", "The inventory item was successfully deleted.");
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.redirect(`/inv/delete/${inv_id}`);
  }
}

module.exports = invCont
