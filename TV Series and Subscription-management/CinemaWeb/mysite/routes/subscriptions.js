var express = require("express");
var router = express.Router();
const membersBL = require("../BLs/membersBL");
const showsBL = require("../BLs/showsBL");

/* GET all subscriptions. */
router.get("/", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if user has permissions
    if (req.session.permissions) {
      // If user has permissions check if the user has viewSubscriptions permission
      if (req.session.permissions.includes("viewSubscriptions")) {
        // Check if user has been giving number of actions (timeOut)
        if (req.session.timeOut > 0) {
          // Turn to the getAllMembersAndShows function in the membersBL for adding a new member
          const showsAndSubscriptions = await membersBL.getAllMembersAndShows();
          // If user has more than 0 action of navigation in the web site take one down
          req.session.timeOut -= 1;
          // Render Subscriptions page with members and current user permissions
          return res.status(200).render("subscriptions", {
            member: showsAndSubscriptions,
            permissions: req.session.permissions,
          });
        }
        // Check if user has (null) unlimited number of actions (only Admin has it)
        if (req.session.timeOut == null) {
          // Turn to the getAllMembersAndShows function in the membersBL for adding a new member
          const showsAndSubscriptions = await membersBL.getAllMembersAndShows();
          // Render Subscriptions page with members and current user permissions
          return res.status(200).render("subscriptions", {
            member: showsAndSubscriptions,
            permissions: req.session.permissions,
          });
          // If user doesn't have unlimited number of actions (Admin)
          // or not been given number of actions in the web site (user), send the user to login page
        } else {
          return res.status(401).render("login");
        }
        // If user doesn't viewSubscriptions permission send the user to login page
      } else {
        return res.status(401).render("login");
      }
      // If user doesn't have permissions send the user to login page
    } else {
      return res.status(401).render("login");
    }
  }
});

/* GET new member page. */
router.get("/new", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if user has permissions
    if (req.session.permissions) {
      // Check if user has been giving number of actions (timeOut)
      if (req.session.timeOut > 0) {
        // If user has more than 0 action of navigation in the web site take one down
        req.session.timeOut -= 1;
        // Render Subscriptions page with members and current user permissions
        return res.status(200).render("newMember");
      }
      // Check if user has (null) unlimited number of actions (only Admin has it)
      if (req.session.timeOut == null) {
        // Render Subscriptions page with members and current user permissions
        return res.status(200).render("newMember");
        // If user doesn't have unlimited number of actions (Admin)
        // or not been given number of actions in the web site (user), send the user to login page
      } else {
        return res.status(401).render("login");
      }
      // If user doesn't have permissions send the user to login page
    } else {
      return res.status(401).render("login");
    }
  }
});

/* ADD new member. */
router.post("/new", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if user has permissions
    if (req.session.permissions) {
      // Check if user has been giving number of actions (timeOut)
      if (req.session.timeOut > 0) {
        // Get the new member details from the body
        const obj = req.body;
        // Turn to the addMember function in the membersBL for adding a new member
        await membersBL.addMember(obj);
        // Turn to the getAllMembersAndShows function in the membersBL to get all the members and shows
        const showsAndSubscriptions = await membersBL.getAllMembersAndShows();
        // If user has more than 0 action of navigation in the web site take one down
        req.session.timeOut -= 1;
        // Render Subscriptions page with members and current user permissions
        return res.status(201).render("subscriptions", {
          member: showsAndSubscriptions,
          permissions: req.session.permissions,
        });
      }
      // Check if user has (null) unlimited number of actions (only Admin has it)
      if (req.session.timeOut == null) {
        // Get the new member details from the body
        const obj = req.body;
        // Turn to the addMember function in the memberBL for adding a new member
        await membersBL.addMember(obj);
        // Turn to the getAllMembersAndShows function in the membersBL to get all the members and shows
        const showsAndSubscriptions = await membersBL.getAllMembersAndShows();
        // Render Subscriptions page with members and current user permissions
        return res.status(201).render("subscriptions", {
          member: showsAndSubscriptions,
          permissions: req.session.permissions,
        });
        // If user doesn't have unlimited number of actions (Admin)
        // or not been given number of actions in the web site (user), send the user to login page
      } else {
        return res.status(401).render("login");
      }
      // If user doesn't have permissions send the user to login page
    } else {
      return res.status(401).render("login");
    }
  }
});

/* GET member to edit. */
router.get("/member/:_id", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if user has permissions
    if (req.session.permissions) {
      // Check if user has been giving number of actions (timeOut)
      if (req.session.timeOut > 0) {
        // Get the member _id from the params
        const _id = req.params._id;
        // Turn to the getOneMemberToEdit function in the membersBL to locate the member to edit
        const oneMember = await membersBL.getOneMemberToEdit(_id);
        // If user has more than 0 action of navigation in the web site take one down
        req.session.timeOut -= 1;
        // Render editMember page with members and current user permissions
        return res.status(200).render("editMember", {
          member: oneMember,
        });
      }
      // Check if user has (null) unlimited number of actions (only Admin has it)
      if (req.session.timeOut == null) {
        // Get the member _id from the params
        const _id = req.params._id;
        // Turn to the getOneMemberToEdit function in the membersBL to locate the member to edit
        const oneMember = await membersBL.getOneMemberToEdit(_id);
        // Render editMember page with members and current user permissions
        return res.status(200).render("editMember", {
          member: oneMember,
        });
        // If user doesn't have unlimited number of actions (Admin)
        // or not been given number of actions in the web site (user), send the user to login page
      } else {
        return res.status(401).render("login");
      }
      // If user doesn't have permissions send the user to login page
    } else {
      return res.status(401).render("login");
    }
  }
});

/* Edit member. */
router.post("/member/:_id", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if user has permissions
    if (req.session.permissions) {
      // If user has permissions check if the user has updateSubscriptions permission
      if (req.session.permissions.includes("updateSubscriptions")) {
        // Check if user has been giving number of actions (timeOut)
        if (req.session.timeOut > 0) {
          // Get the member to edit details from the body
          const obj = req.body;
          // Get the member to edit _id from the params
          const _id = req.params._id;
          // Turn to the editMember function from the membersBL for member editing
          await membersBL.editMember(obj, _id);
          // Turn to the getAllMembersAndShows function from the membersBL to get all the members and the shows
          const showsAndSubscriptions = await membersBL.getAllMembersAndShows();
          // I user has more than 0 action of navigation in the web site take one down
          req.session.timeOut -= 1;
          // Render Subscriptions page with members and current user permissions
          return res.status(200).render("subscriptions", {
            member: showsAndSubscriptions,
            permissions: req.session.permissions,
          });
        }
        // Check if user has (null) unlimited number of actions (only Admin has it)
        if (req.session.timeOut == null) {
          // Get the member to edit details from the body
          const obj = req.body;
          // Get the member to edit _id from the params
          const _id = req.params._id;
          await membersBL.editMember(obj, _id);
          // Turn to the getAllMembersAndShows function from the membersBL to get all the members and the shows
          const showsAndSubscriptions = await membersBL.getAllMembersAndShows();
          // Render editMember page with members and current user permissions
          return res.status(200).render("subscriptions", {
            member: showsAndSubscriptions,
            permissions: req.session.permissions,
          });
          // If user doesn't have unlimited number of actions (Admin)
          // or not been given number of actions in the web site (user), send the user to login page
        } else {
          return res.status(401).render("login");
        }
        // If user doesn't have updateSubscriptions permission send the user to login page
      } else {
        return res.status(401).render("login");
      }
      // If user doesn't have permissions turn the send to login page
    } else {
      return res.status(401).render("login");
    }
  }
});

/* GET page to a new show subscription. */
router.get("/new/:_id", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if user has permissions
    if (req.session.permissions) {
      // Check if user has been giving number of actions (timeOut)
      if (req.session.timeOut > 0) {
        // Get the member_id from the params for the subscription
        const _id = req.params._id;
        // Turn to the getAllShows function from the showsBL to get all the shows
        const shows = await showsBL.getAllShows();
        req.session.timeOut -= 1;
        return res.status(200).render("newShowSubscription", {
          sub: shows,
          memberId: _id,
        });
      }
      // Check if user has (null) unlimited number of actions (only Admin has it)
      if (req.session.timeOut == null) {
        // Get the member_id from the params for the subscription
        const _id = req.params._id;
        // Turn to the getAllShows function from the showsBL to get all the shows
        const shows = await showsBL.getAllShows();
        return res.status(200).render("newShowSubscription", {
          sub: shows,
          memberId: _id,
        });
        // If user doesn't have unlimited number of actions (Admin)
        // or not been given number of actions in the web site (user), send the user to login page
      } else {
        return res.status(401).render("login");
      }
      // If user doesn't have permissions send the user to login page
    } else {
      return res.status(401).render("login");
    }
  }
});

/* POST new show subscription. */
router.post("/new/:_id", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if user has permissions
    if (req.session.permissions) {
      // If user has permissions check if the user has createSubscriptions permission
      if (req.session.permissions.includes("createSubscriptions")) {
        // Check if user has been giving number of actions (timeOut)
        if (req.session.timeOut > 0) {
          // Get the member_id from the params for the subscription
          const _id = req.params._id;
          // Get the show details that the member want to subscribe too from the body
          const showId = req.body.subscribe;
          // Turn to the subscriptionToNewShow function from the showsBL to for a new show subscription
          await showsBL.subscriptionToNewShow(showId, _id);
          // Turn to the getAllMembersAndShows function from the membersBL to get all the members and the shows
          const showsAndSubscriptions = await membersBL.getAllMembersAndShows();
          // If user has more than 0 action of navigation in the web site take one down
          req.session.timeOut -= 1;
          // Render Subscriptions page with members and current user permissions
          return res.status(201).render("subscriptions", {
            member: showsAndSubscriptions,
            permissions: req.session.permissions,
          });
        }
        // Check if user has (null) unlimited number of actions (only Admin has it)
        if (req.session.timeOut == null) {
          // Get the member_id from the params for the subscription
          const _id = req.params._id;
          // Get the show details that the member want to subscribe too from the body
          const showId = req.body.subscribe;
          // Turn to the subscriptionToNewShow function from the showsBL to for a new show subscription
          await showsBL.subscriptionToNewShow(showId, _id);
          // Turn to the getAllMembersAndShows function from the membersBL to get all the members and the shows
          const showsAndSubscriptions = await membersBL.getAllMembersAndShows();
          // Render Subscriptions page with members and current user permissions
          return res.status(201).render("subscriptions", {
            member: showsAndSubscriptions,
            permissions: req.session.permissions,
          });
          // If user doesn't have unlimited number of actions (Admin)
          // or not been given number of actions in the web site (user), send the user to login page
        } else {
          return res.status(401).render("login");
        }
        // If user doesn't createSubscriptions permission send the user to login page
      } else {
        return res.status(401).render("login");
      }
      // If user doesn't have permissions send the user to login page
    } else {
      return res.status(401).render("login");
    }
  }
});

/* DELETE member. */
router.post("/delete/:_id", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if user has permissions
    if (req.session.permissions) {
      // If user has permissions check if the user has deleteSubscriptions permission
      if (req.session.permissions.includes("deleteSubscriptions")) {
        // Check if user has number of actions above 0 (timeOut)
        if (req.session.timeOut > 0) {
          // Get the member_id from the params for the delete member
          const _id = req.params._id;
          // Turn to the deleteMember function from the membersBL for delete member
          await membersBL.deleteMember(_id);
          // Turn to the getAllMembersAndShows function from the membersBL to get all the members and the shows
          const showsAndSubscriptions = await membersBL.getAllMembersAndShows();
          // If user has more than 0 action of navigation in the web site take one down
          req.session.timeOut -= 1;
          // Render Subscriptions page with members and current user permissions
          return res.status(204).render("subscriptions", {
            member: showsAndSubscriptions,
            permissions: req.session.permissions,
          });
        }
        // Check if user has (null) unlimited number of actions (only Admin has it)
        if (req.session.timeOut == null) {
          // Get the member_id from the params for the delete member
          const _id = req.params._id;
          // Turn to the deleteMember function from the membersBL for delete member
          await membersBL.deleteMember(_id);
          // Turn to the getAllMembersAndShows function from the membersBL to get all the members and the shows
          const showsAndSubscriptions = await membersBL.getAllMembersAndShows();
          // Render Subscriptions page with members and current user permissions
          return res.status(204).render("subscriptions", {
            member: showsAndSubscriptions,
            permissions: req.session.permissions,
          });
          // If user doesn't have unlimited number of actions (Admin)
          // or not been given number of actions in the web site (user), send the user to login page
        } else {
          return res.status(401).render("login");
        }
        // If user doesn't deleteSubscriptions permission send the user to login page
      } else {
        return res.status(401).render("login");
      }
      // If user doesn't have permissions send the user to login page
    } else {
      return res.status(401).render("login");
    }
  }
});

module.exports = router;
