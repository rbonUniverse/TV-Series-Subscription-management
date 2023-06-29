var express = require("express");
var router = express.Router();
const usersBL = require("../BLs/usersBL");

/* GET user listing. */
router.get("/:_id", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if the user that want to post new user is Admin
    if (req.session.isAdmin === true) {
      // Get the user_id from the params
      const _id = req.params._id;
      // Turn to getSingleUserAndPermissions function in usersBL to get one the user
      // and the permissions of the user, and assign all to userWithPermissions variable
      const userWithPermissions = await usersBL.getSingleUserAndPermissions(
        _id
      );
      // Render updateUser page with Admin role
      // and the permission and user details of the user that needs to be updated
      res.render("updateUser", {
        role: "Admin",
        user: userWithPermissions,
      });
      // If the user is not Admin, send user to login page
    } else {
      res.status(401).redirect("/login");
    }
  }
});

/* PUT user listing. */
router.post("/:_id", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if the user that want to post new user is Admin
    if (req.session.isAdmin === true) {
      // Check if the user that want to post new user is Admin
      if (req.session.isAdmin === true) {
        // Get the new user details that the Admin created from the body (input) of newUser page (input)
        const obj = req.body;
        // Get the user_id from the params
        const _id = req.params._id;
        // Turn to updateUser function in usersBL to update existing user
        await usersBL.updateUser(_id, obj);
        // Turn to getUsers function in usersBL to get all the users and assign all to usersData variable
        const usersData = await usersBL.getUsers();
        // Render updateUser page with Admin role
        // and the permission and user details of the user that needs to be updated
        res.status(200).render("usersManagement", {
          role: "Admin",
          users: usersData,
        });
        // If the user is not Admin, render the Log-in page
      } else {
        res.render("login");
      }
      // If the user is not Admin, send user to login page
    } else {
      res.status(401).redirect("/login");
    }
  }
});

module.exports = router;
