var express = require("express");
var router = express.Router();

/* GET users listing. */
router.post("/", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if the Logged-in user is Admin user
    if (req.session.isAdmin === true) {
      // Check if the Admin has permissions
      if (req.session.permissions) {
        // Render to mainPage with Admin role and permissions
        res.render("mainPage", {
          role: "Admin",
          permissions: req.session.permissions,
        });
        // If the Admin has no permissions, send Admin to login page
      } else {
        res.status(401).redirect("/login");
      }
    } else {
      // If the Logged-in user is not Admin user, check if it got permissions
      if (req.session.permissions) {
        // Render to mainPage with user role and permissions
        res.render("mainPage", {
          role: "user",
          permissions: req.session.permissions,
        });
        // If the user is no permissions, send user to login page
      } else {
        res.status(401).redirect("/login");
      }
    }
  }
});

module.exports = router;
