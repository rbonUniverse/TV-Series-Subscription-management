var express = require("express");
var router = express.Router();
const usersBL = require("../BLs/usersBL");

/* GET users listing. */
router.get("/", function (req, res, next) {
  // Render createAccountThroughLink
  res.render("createAccountThroughLink");
});

/* POST users listing. */
router.post("/", async function (req, res, next) {
  // Create new object
  const obj = {
    // Get the username from input of the Create Account page
    username: req.body.username,
    // Get the password from input of the Create Account page
    password: req.body.password,
  };
  // Redirect to Log-in page after calling the createUserPassword in usersBL
  // for creating password for a user created by the Admin
  await usersBL.createUserPassword(obj);
  res.status(200).redirect("/login");
});

module.exports = router;
