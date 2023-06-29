var express = require("express");
var router = express.Router();
const usersBL = require("../BLs/usersBL");

/* GET newUser page. */
router.get("/", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if the user that want to post new user is Admin
    if (req.session.isAdmin === true) {
      // Render newUser only for Admin
      res.render("newUser", {
        role: "Admin",
      });
      // If the user is not Admin, send user to login page
    } else {
      res.status(401).redirect("/login");
    }
  }
});

/* POST new user. */
router.post("/add", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if the user that want to post new user is Admin
    if (req.session.isAdmin === true) {
      // Get the new user details that the Admin created from the body of newUser page (input)
      const obj = req.body;
      // Turn to addUser function in usersBL to add new user
      await usersBL.addUser(obj);
      // Turn to getUsers function in usersBL to get all the users and assign all to usersData variable
      const usersData = await usersBL.getUsers();
      // Render usersManagement page with Admin role and users data
      res.status(201).render("usersManagement", {
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
