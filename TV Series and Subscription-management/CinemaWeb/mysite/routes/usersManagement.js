var express = require("express");
var router = express.Router();
const usersBL = require("../BLs/usersBL");

/* GET usersManagement page. */
router.get("/", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if the user that want to post new user is Admin
    if (req.session.isAdmin === true) {
      // Turn to getUsers function in usersBL to get all the users
      const usersData = await usersBL.getUsers();
      // Render usersManagement page with Admin role
      // and with all the users
      res.status(200).render("usersManagement", {
        role: "Admin",
        users: usersData,
      });
      // If the user is not Admin, send user to login page
    } else {
      res.status(401).redirect("/login");
    }
  }
});

/* DELETE user */
router.post("/:_id", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if the user that want to post new user is Admin
    if (req.session.isAdmin === true) {
      // Get the user_id from the params
      const _id = req.params._id;
      // Turn to deleteUser function in usersBL to delete user
      await usersBL.deleteUser(_id);
      // Turn to getUsers function in usersBL to get all the users
      const usersData = await usersBL.getUsers();
      // Render usersManagement page with Admin role
      // and with all the users
      res.status(202).render("usersManagement", {
        role: "Admin",
        users: usersData,
      });
      // If the user is not Admin, send user to login page
    } else {
      res.status(401).redirect("/login");
    }
  }
});

module.exports = router;
