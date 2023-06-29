var express = require("express");
var router = express.Router();
const showsBL = require("../BLs/showsBL");
const membersBL = require("../BLs/membersBL");

/* GET shows listing. */
router.get("/", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if user has permissions
    if (req.session.permissions) {
      // If user has permissions check if the user has viewShows permission
      if (req.session.permissions.includes("viewShows")) {
        // Check if user has been giving number of actions (timeOut)
        if (req.session.timeOut > 0) {
          // Turn to the getAllShowsAndSubscriptions function from the showsBL to get the shows with their subscribers
          const showsAndSubscriptions =
            await showsBL.getAllShowsAndSubscriptions();
          // If user has more than 0 action of navigation in the web site take one down
          req.session.timeOut -= 1;
          // Render Shows page with shows and current user permissions
          return res.status(200).render("shows", {
            show: showsAndSubscriptions,
            permissions: req.session.permissions,
          });
        }
        // Check if user has (null) unlimited number of actions (only Admin has it)
        if (req.session.timeOut == null) {
          // Turn to the getAllShowsAndSubscriptions function from the showsBL to get the shows with their subscribers
          const showsAndSubscriptions =
            await showsBL.getAllShowsAndSubscriptions();
          // Render Shows page with shows and current user permissions
          return res.status(200).render("shows", {
            show: showsAndSubscriptions,
            permissions: req.session.permissions,
          });
          // If user doesn't have unlimited number of actions (Admin)
          // or not been given number of actions in the web site (user), send the user to login page
        } else {
          return res.status(401).render("login");
        }
        // If user doesn't viewShows permission send the user to login page
      } else {
        return res.status(401).render("login");
      }
      // If user doesn't have permissions send the user to login page
    } else {
      return res.status(401).render("login");
    }
  }
});

/* POST shows search. */
router.post("/search", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if user has permissions
    if (req.session.permissions) {
      // If user has permissions check if the user has viewShows permission
      if (req.session.permissions.includes("viewShows")) {
        // Check if user has been giving number of actions (timeOut)
        if (req.session.timeOut > 0) {
          // Get the characters that the user want to search a show by them from the body(input)
          const showObj = req.body;
          // Turn to the searchShowsWithSubscriptions function from the showsBL to get the shows with there subscribers
          const searchedShowsWithSubscriptions =
            await showsBL.searchShowsWithSubscriptions(showObj);
          // If user has more than 0 action of navigation in the web site take one down
          req.session.timeOut -= 1;
          // Render Shows page with the relevant show/shows search and current user permissions
          return res.status(200).render("shows", {
            show: searchedShowsWithSubscriptions,
            permissions: req.session.permissions,
          });
        }
        // Check if user has (null) unlimited number of actions (only Admin has it)
        if (req.session.timeOut == null) {
          // Get the characters that the user want to search a show by them from the body(input)
          const showObj = req.body;
          // Turn to the searchShowsWithSubscriptions function from the showsBL to get the shows with there subscribers
          const searchedShowsWithSubscriptions =
            await showsBL.searchShowsWithSubscriptions(showObj);
          // Render Shows page with the relevant show/shows search and current user permissions
          return res.status(200).render("shows", {
            show: searchedShowsWithSubscriptions,
            permissions: req.session.permissions,
          });
          // If user doesn't have unlimited number of actions (Admin)
          // or not been given number of actions in the web site (user), send the user to login page
        } else {
          return res.status(401).render("login");
        }
        // If user doesn't viewShows permission send the user to login page
      } else {
        return res.status(401).render("login");
      }
      // If user doesn't have permissions send the user to login page
    } else {
      return res.status(401).render("login");
    }
  }
});

/* GET details of one show. */
router.get("/details/:_id", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if user has permissions
    if (req.session.permissions) {
      // Check if user has been giving number of actions (timeOut)
      if (req.session.timeOut > 0) {
        // Get the show_id from the params
        const _id = req.params._id;
        // Turn to the getOneShowDetails function from the showsBL to get the show details
        const oneShowWithDetails = await showsBL.getOneShowDetails(_id);
        // If user has more than 0 action of navigation in the web site take one down
        req.session.timeOut -= 1;
        // Render showDetails page with the show details
        return res.status(200).render("showDetails", {
          show: oneShowWithDetails,
        });
      }
      // Check if user has (null) unlimited number of actions (only Admin has it)
      if (req.session.timeOut == null) {
        // Get the show_id from the params
        const _id = req.params._id;
        // Turn to the getOneShowDetails function from the showsBL to get the show details
        const oneShowWithDetails = await showsBL.getOneShowDetails(_id);
        // Render showDetails page with the show details
        return res.status(200).render("showDetails", {
          show: oneShowWithDetails,
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

/* GET member. */
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
        // Get the member_id from the params
        const _id = req.params._id;
        // Turn to the getOneMemberDetails function from the membersBL to get the member details
        const oneMemberDetails = await membersBL.getOneMemberDetails(_id);
        // If user has more than 0 action of navigation in the web site take one down
        req.session.timeOut -= 1;
        // Render memberDetails page with member details
        return res
          .status(200)
          .render("memberDetails", { member: oneMemberDetails });
      }
      // Check if user has (null) unlimited number of actions (only Admin has it)
      if (req.session.timeOut == null) {
        // Get the member_id from the params
        const _id = req.params._id;
        // Turn to the getOneMemberDetails function from the membersBL to get the member details
        const oneMemberDetails = await membersBL.getOneMemberDetails(_id);
        // Render memberDetails page with member details
        return res
          .status(200)
          .render("memberDetails", { member: oneMemberDetails });
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

/* GET new show to add. */
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
        // Render addNewShow page
        return res.status(200).render("addNewShow");
      }
      // Check if user has (null) unlimited number of actions (only Admin has it)
      if (req.session.timeOut == null) {
        // Render addNewShow page
        return res.status(200).render("addNewShow");
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

/* ADD new show. */
router.post("/new", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if user has permissions
    if (req.session.permissions) {
      // If user has permissions check if the user has createShows permission
      if (req.session.permissions.includes("createShows")) {
        // Check if user has been giving number of actions (timeOut)
        if (req.session.timeOut > 0) {
          // Get the show to edit details from the body
          const obj = req.body;
          // Turn to the addNewShow function from the showsBL to add a new show
          await showsBL.addNewShow(obj);
          // Turn to the getAllShowsAndSubscriptions function from the showsBL to get the shows with their subscribers
          const showsAndSubscriptions =
            await showsBL.getAllShowsAndSubscriptions();
          // If user has more than 0 action of navigation in the web site take one down
          req.session.timeOut -= 1;
          // Render Shows page with shows and with the Shows subscribers the current user permissions
          return res.status(201).render("shows", {
            show: showsAndSubscriptions,
            permissions: req.session.permissions,
          });
        }
        // Check if user has (null) unlimited number of actions (only Admin has it)
        if (req.session.timeOut == null) {
          // Get the show to edit details from the body
          const obj = req.body;
          // Turn to the addNewShow function from the showsBL to add a new show
          await showsBL.addNewShow(obj);
          // Turn to the getAllShowsAndSubscriptions function from the showsBL to get the shows with their subscribers
          const showsAndSubscriptions =
            await showsBL.getAllShowsAndSubscriptions();
          // Render Shows page with shows and the Shows subscribers and current user permissions
          return res.status(201).render("shows", {
            show: showsAndSubscriptions,
            permissions: req.session.permissions,
          });
          // If user doesn't have unlimited number of actions (Admin)
          // or not been given number of actions in the web site (user), send the user to login page
        } else {
          return res.status(401).render("login");
        }
        // If user doesn't createShows permission send the user to login page
      } else {
        return res.status(401).render("login");
      }
      // If user doesn't have permissions send the user to login page
    } else {
      return res.status(401).render("login");
    }
  }
});

/* GET new show to edit. */
router.get("/:_id", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if user has permissions
    if (req.session.permissions) {
      // Check if user has been giving number of actions (timeOut)
      if (req.session.timeOut > 0) {
        // Get the show_id from the params
        const _id = req.params._id;
        // Turn to the getOneShowForEditingPage function from the showsBL to get new show to edit
        const showToEdit = await showsBL.getOneShowForEditingPage(_id);
        // If user has more than 0 action of navigation in the web site take one down
        req.session.timeOut -= 1;
        // Render editShow page with the details of the show to edit
        return res.status(200).render("editShow", {
          presentShow: showToEdit,
        });
      }
      // Check if user has (null) unlimited number of actions (only Admin has it)
      if (req.session.timeOut == null) {
        // Get the show_id from the params to edit the show
        const _id = req.params._id;
        // Turn to the getOneShowForEditingPage function from the showsBL to get new show to edit
        const showToEdit = await showsBL.getOneShowForEditingPage(_id);
        // Render editShow page with the details of the show to edit
        return res.status(200).render("editShow", {
          presentShow: showToEdit,
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

/* Edit show. */
router.post("/:_id", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if user has permissions
    if (req.session.permissions) {
      // If user has permissions check if the user has updateShows permission
      if (req.session.permissions.includes("updateShows")) {
        // Check if user has been giving number of actions (timeOut)
        if (req.session.timeOut > 0) {
          // Get the show to edit details from the body
          const obj = req.body;
          // Get the show_id from the params
          const _id = req.params._id;
          // Turn to the editShow function from the showsBL to edit the show
          await showsBL.editShow(obj, _id);
          // Turn to the getAllShowsAndSubscriptions function from the showsBL to get the shows with their subscribers
          const showsAndSubscriptions =
            await showsBL.getAllShowsAndSubscriptions();
          // If user has more than 0 action of navigation in the web site take one down
          req.session.timeOut -= 1;
          // Render Shows page with shows and current user permissions
          return res.status(200).render("shows", {
            show: showsAndSubscriptions,
            permissions: req.session.permissions,
          });
        }
        // Check if user has (null) unlimited number of actions (only Admin has it)
        if (req.session.timeOut == null) {
          // Get the show to edit details from the body
          const obj = req.body;
          // Get the show_id from the params
          const _id = req.params._id;
          // Turn to the editShow function from the showsBL to edit the show
          await showsBL.editShow(obj, _id);
          // Turn to the getAllShowsAndSubscriptions function from the showsBL to get the shows with their subscribers
          const showsAndSubscriptions =
            await showsBL.getAllShowsAndSubscriptions();
          // Render Shows page with shows and current user permissions
          return res.status(200).render("shows", {
            show: showsAndSubscriptions,
            permissions: req.session.permissions,
          });
          // If user doesn't have unlimited number of actions (Admin)
          // or not been given number of actions in the web site (user), send the user to login page
        } else {
          return res.status(401).render("login");
        }
        // If user doesn't updateShows permission send the user to login page
      } else {
        return res.status(401).render("login");
      }
      // If user doesn't have permissions send the user to login page
    } else {
      return res.status(401).render("login");
    }
  }
});

/* DELETE shows listing. */
router.post("/delete/:_id", async function (req, res, next) {
  /* NEW, get session data to check if a user is logged in or not */
  if (req.session.isLogged != true) {
    // If not, send user to login page
    res.status(401).render("login");
  } else {
    // Check if user has permissions
    if (req.session.permissions) {
      // If user has permissions check if the user has deleteShows permission
      if (req.session.permissions.includes("deleteShows")) {
        // Check if user has been giving number of actions (timeOut)
        if (req.session.timeOut > 0) {
          // Get the show_id from the params to delete show
          const _id = req.params._id;
          // Turn to the deleteShow function from the showsBL for delete show
          await showsBL.deleteShow(_id);
          // Turn to the getAllShowsAndSubscriptions function from the showsBL to get the shows with their subscribers
          const showsAndSubscriptions =
            await showsBL.getAllShowsAndSubscriptions();
          // If user has more than 0 action of navigation in the web site take one down
          req.session.timeOut -= 1;
          // Render Shows page with shows and current user permissions
          return res.status(204).render("shows", {
            show: showsAndSubscriptions,
            permissions: req.session.permissions,
          });
        }
        // Check if user has (null) unlimited number of actions (only Admin has it)
        if (req.session.timeOut == null) {
          // Get the show_id from the params to delete show
          const _id = req.params._id;
          // Turn to the deleteShow function from the showsBL for delete show
          await showsBL.deleteShow(_id);
          // Turn to the getAllShowsAndSubscriptions function from the showsBL to get the shows with their subscribers
          const showsAndSubscriptions =
            await showsBL.getAllShowsAndSubscriptions();
          // Render Shows page with shows and current user permissions
          return res.status(204).render("shows", {
            show: showsAndSubscriptions,
            permissions: req.session.permissions,
          });
          // If user doesn't have unlimited number of actions (Admin)
          // or not been given number of actions in the web site (user), send the user to login page
        } else {
          return res.status(401).render("login");
        }
        // If user doesn't deleteShows permission send the user to login page
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
