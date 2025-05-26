const invModel = require("../models/inventory-model")

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  console.log(data)
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Build the detail view HTML
* ************************************ */

Util.buildVehicleDetail = async function(data){
  let detail = '';
  if(data){
    detail = '<div class="detail">'
    detail += '<div class="detail-image">'
    detail += '<img src="' + data.inv_image + '" alt="Image of ' 
    + data.inv_make + ' ' + data.inv_model + '." />'
    detail += '</div>'
    detail += '<div class="detail-info">'
    detail += '<p>Price: $' 
    + new Intl.NumberFormat('en-US').format(data.inv_price) + '</p>'
    detail += '<p>Color: ' + data.inv_color + '</p>'
    detail += '<p>Mileage: ' 
    + new Intl.NumberFormat('en-US').format(data.inv_miles) + ' miles</p>'
    detail += '<p>Description: ' + data.inv_description + '</p>'
    detail += '</div>'
    detail += '</div>'
  } else { 
    detail += '<p class="notice">Sorry, vehicle could not be found.</p>'
  }
  return detail
}



/* **************************************
* Build the login view HTML
* ************************************ */
Util.buildLogin= async function(req, res, next){
  let login = '';
  login = '<div class="login">'
  login += '<form class="login-form" action="/account/login" method="post">'
  login += '<label for="username">Username:</label>'
  login += '<input type="text" id="username" name="username" required>'
  login += '<label for="password">Password:</label>'
  login += '<input type="password" id="password" name="password" required>'
  login += '<button type="submit">Login</button>'
  login += '</form>'
  login += '<p>No account? <a href="/account/register">Sign-up</a></p>'
  login += '</div>'
  return login
}


/* **************************************
* Build the register view HTML
* ************************************ */
Util.buildRegister= async function(req, res, next){
  let register = '';
  register = '<div class="register">'
  register += '<form class="register-form" action="/account/register" method="post">'
  register += '<label for="account_firstname">First Name <span class="required">*</span>:</label>'
  register += '<input type="text" id="firstname" name="account_firstname" required>'
  register += '<label for="account_lastname">Last Name <span class="required">*</span>:</label>'
  register += '<input type="text" id="account_lastname" name="account_lastname" required>'
  register += '<label for="account_email">Email <span class="required">*</span>:</label>'
  register += '<input type="email" id="account_email" name="account_email" required>'
  register += '<label for="account_password">Password <span class="required">*</span>:</label>'
  register += '<input type="password" id="account_password" name="account_password" required>'
  register += '<div class="psw-req"><p>Password must be at least 12 characters long, include 1 capital letter, 1 number, and 1 special character.</p> <p>* Indicates required field.</p></div>'
  register += '<button type="submit">Register</button>'
  register += '</div>'
  register += '</form>'
  register += '</div>'
  return register
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util