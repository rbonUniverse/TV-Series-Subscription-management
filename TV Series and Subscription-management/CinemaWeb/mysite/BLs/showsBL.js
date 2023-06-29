const showsDAL = require("../DALs/showsDAL");
const subscriptionsDAL = require("../DALs/membersAndSubscriptionsDAL");
const membersAndSubscriptionsDAL = require("../DALs/membersAndSubscriptionsDAL");

// GET All Shows And Subscriptions and make the one array
const getAllShowsAndSubscriptions = async () => {
  // Get all members from SubscriptionsDB Server
  const membersFromAPI = await subscriptionsDAL.getAllMembers();
  // Get all subscribers from SubscriptionsDB Server
  const subscriptionsFromAPI = await subscriptionsDAL.getAllSubscriptions();
  // Get all shows from SubscriptionsDB Server
  const showsArr = await showsDAL.getAllShows();
  // Create Array of shows that members subscribed to with the member properties
  // like Name, Email and City
  const showsWithSubscribers = [];
  // Get in the showsArr with forEach
  showsArr.forEach((show) => {
    // Create a new show Object and add membersDetails Array that will contain
    // all the properties of the members that the show got
    const obj = {
      _id: show._id,
      Name: show.Name,
      Genres: show.Genres,
      Date: show.Date,
      Image: show.Image,
      membersDetails: [],
    };
    // Get in the subscriptionsFromAPI and membersFromAPI with forEach
    subscriptionsFromAPI.forEach((subscription) => {
      subscription.Shows.forEach((showFromSubs) => {
        membersFromAPI.forEach((member) => {
          // Find the show that a member subscribed to by the common argument, the _id
          if (
            showFromSubs.showId == show._id &&
            member._id == subscription.MemberId
          ) {
            const memberObj = {
              _id: member._id,
              Name: member.Name,
              Email: member.Email,
              City: member.City,
            };
            // If the condition it true,
            // insert all the properties of the member to membersDetails Array
            obj.membersDetails.push(memberObj);
          }
        });
      });
    });
    // Than insert all the obj of a show that created in line 20 into showsWithSubscribers Array
    showsWithSubscribers.push(obj);
  });
  // Return Array of shows with the members properties that subscribed to each show
  // like Name, Email and City
  return showsWithSubscribers;
};

// GET all Shows
const getAllShows = async () => {
  // Get all shows from SubscriptionsDB
  const shows = await showsDAL.getAllShows();
  // Return all shows
  return shows;
};

// Add new show
const addNewShow = async (obj) => {
  // Add new show to SubscriptionsDB
  await showsDAL.addNewShow(obj);
  // Get all shows from SubscriptionsDB
  const allShows = await getAllShowsAndSubscriptions();
  // Return all shows
  return allShows;
};

// Search show - if it got subscribers add them to the searched show
const searchShowsWithSubscriptions = async (obj) => {
  // Get all members from SubscriptionsDB Server
  const membersFromAPI = await subscriptionsDAL.getAllMembers();
  // Get all subscriptions from SubscriptionsDB Server
  const subscriptionsFromAPI = await subscriptionsDAL.getAllSubscriptions();
  // Get all shows from SubscriptionsDB Server
  const showsArr = await showsDAL.getAllShows();
  // Create Array of filtered shows
  // if the filtered shows got subscribed
  // add the properties of the members to each of the filtered show
  const filteredShowsWithSubscribers = [];
  // Create a new filteredShows variable
  let filteredShows;
  if (obj == undefined) {
    // If the function got undefined obj (user pressed on search button with empty search field)
    const showsWithSubscribers = getAllShowsAndSubscriptions();
    // Return Shows with subscribers
    return showsWithSubscribers;
  } else {
    // Assign the filtered shows Array by the search text to the filteredShows variable
    filteredShows = showsArr.filter((m) =>
      m.Name.toLowerCase().includes(obj.name.toLowerCase())
    );

    filteredShows.forEach((show) => {
      // Create a new show Object and add membersDetails Array that will contain
      // all the properties of the member that subscribed to the show
      const obj = {
        _id: show._id,
        Name: show.Name,
        Genres: show.Genres,
        Date: show.Date,
        Image: show.Image,
        membersDetails: [],
      };
      // Get in the subscriptionsFromAPI and membersFromAPI with forEach
      subscriptionsFromAPI.forEach((subscription) => {
        subscription.Shows.forEach((showFromSubs) => {
          membersFromAPI.forEach((member) => {
            // Find the show that a member subscribed to by the common argument, the _id
            if (
              showFromSubs.showId == show._id &&
              member._id == subscription.MemberId
            ) {
              // Create a new member Object with the relevant member details
              const memberObj = {
                _id: member._id,
                Name: member.Name,
                Email: member.Email,
                City: member.City,
              };
              // If the condition it true,
              // insert all the properties of the member to membersDetails Array
              obj.membersDetails.push(memberObj);
            }
          });
        });
      });
      // Than insert all the obj of a member that created in line 101
      // into filteredShowsWithSubscribers Array
      filteredShowsWithSubscribers.push(obj);
    });
  }
  // Return filtered shows with subscribers
  return filteredShowsWithSubscribers;
};

// Get one show with its details
const getOneShowDetails = async (_id) => {
  let show = await showsDAL.getOneShowDetails(_id);
  const subscribers = await subscriptionsDAL.getAllSubscriptions();
  const members = await membersAndSubscriptionsDAL.getAllMembers();
  const filteredMembersArray = members.filter((member) =>
    subscribers.some((sub) => member._id == sub.MemberId)
  );
  if (filteredMembersArray) {
    let obj = {
      Name: show.Name,
      Genres: show.Genres,
      Date: show.Date,
      Image: show.Image,
      membersDetails: [],
    };
    obj.membersDetails.push(...filteredMembersArray);
    show = obj;
  }
  // Return single show
  return show;
};

// Get one show
const getOneShowForEditingPage = async (_id) => {
  //Get one show from SubscriptionsDB
  const show = await showsDAL.getOneShow(_id);
  // Return single show
  return show;
};

// Edit show
const editShow = async (obj, _id) => {
  // Create member object
  const newObj = {
    _id: _id,
    Name: obj.Name,
    Genres: obj.Genres,
    Date: obj.Date,
    Image: obj.Image,
  };
  // Edit show
  await showsDAL.editShow(newObj);
  // Get all shows from SubscriptionsDB
  const allShows = await getAllShowsAndSubscriptions();
  // Return all shows
  return allShows;
};

// Subscribe to a new show
const subscriptionToNewShow = async (showId, _id) => {
  // Crete new subscription object to a show
  const newObj = {
    MemberId: _id,
    showId: showId,
  };
  // Create new show subscription
  const subscription = await membersAndSubscriptionsDAL.newSubscription(newObj);
  // Return All subscription
  return subscription;
};

// Delete show
const deleteShow = async (_id) => {
  // Delete show from SubscriptionsDB
  await showsDAL.deleteShow(_id);
  //Get all shows from SubscriptionsDB
  const shows = await getAllShowsAndSubscriptions();
  // Return All shows
  return shows;
};

module.exports = {
  getAllShowsAndSubscriptions,
  getAllShows,
  addNewShow,
  searchShowsWithSubscriptions,
  getOneShowDetails,
  getOneShowForEditingPage,
  editShow,
  subscriptionToNewShow,
  deleteShow,
};
