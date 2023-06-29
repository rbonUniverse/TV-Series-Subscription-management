var express = require("express");
var router = express.Router();
const usersDAL = require("../DALs/usersDAL");
const permissionsDAL = require("../DALs/permissionsDAL");

/* GET login page. */
router.get("/", function (req, res) {
  // Render Log-in page
  res.render("login");
});

/* POST login page. */
router.post("/", async function (req, res) {
  // Get the username from input of the Log-in page
  let username = req.body.username;
  // Get the password from input of the Log-in page
  let password = req.body.password;
  // Get all the usernames and passwords from mongoDB
  const respArr = await usersDAL.getUsersFromDB();
  // Check if the username and the password that provided form the Log-in page
  // matching to one of the username and the password in the mongoDB
  const userObjectFromFile = respArr.find((u) => {
    return u.username === username && u.password === password;
  });
  // Check if the condition with the variable userObjectFromFile is true
  if (userObjectFromFile) {
    if (
      username === userObjectFromFile.username &&
      password === userObjectFromFile.password
    ) {
      // Check if the users array from mongoDB is not empty
      if (respArr.length >= 0) {
        // If there is a match of the username and the password that provided form the Log-in page
        // to one of the username and the password in the mongoDB,
        // than assign userObjectFromFile.username to username and userObjectFromFile.password to password
        username = userObjectFromFile.username;
        password = userObjectFromFile.password;
        // Check if username is an Admin
        if (username === "Admin") {
          // If username is an Admin set a new session as Admin to a true boolean default
          req.session.isAdmin = true;
          // If username is an Admin set a new Logged-in session as the Admin to a true boolean default
          req.session.isLogged = true;
          // If username is an Admin set a new permissions session to Admin [Admin has all permissions]
          req.session.permissions = [
            "viewSubscriptions",
            "createSubscriptions",
            "deleteSubscriptions",
            "updateSubscriptions",
            "viewShows",
            "createShows",
            "deleteShows",
            "updateShows",
          ];
          // Render mainPage as Admin role and permissions
          return res.render("mainPage", {
            role: "Admin",
            permissions: req.session.permissions,
          });
        }
        // If username is not "Admin" set a new Logged-in session as user to a true boolean default
        req.session.isLogged = true;
        // Read permissions from json file
        const filePermissions = await permissionsDAL.readPermissionsFromFile();
        // Find the current user permissions
        const userFromPermissions = filePermissions.find(
          (u) => u.userId == userObjectFromFile._id
        );
        // Assign the userPermissions that we found to the session.permissions that created
        req.session.permissions = userFromPermissions.userPermissions;

        const fileTimeOut = await usersDAL.readUsersFromFile();
        // Find the current user timeOut
        const timeOutFromUsersFile = fileTimeOut.find(
          (u) => u._id == userObjectFromFile._id
        );
        // Assign it to the session.timeOut that created
        req.session.timeOut = timeOutFromUsersFile.sessionTimeOut;
        // Render mainPage as user role and permissions
        return res.render("mainPage", {
          role: "user",
          permissions: req.session.permissions,
        });
        // If the array length returned is not smaller than 0, send "Incorrect username or password" message
      } else {
        return res.send("Incorrect username or password");
      }
      // If the username or password is not exist in the mongoDB, send "Please enter a valid username or password" message
    } else {
      return res.send("Please enter a valid username or password");
    }
    // If the user provided is not exist in the users file, send "User not found" message
  } else {
    return res.send("User not found");
  }
});

module.exports = router;
