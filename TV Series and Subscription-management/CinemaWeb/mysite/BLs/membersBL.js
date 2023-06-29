const membersAndSubscriptionsDAL = require("../DALs/membersAndSubscriptionsDAL");
const showsDAL = require("../DALs/showsDAL");

// GET Members
const getAllMembers = async () => {
  // Get all members
  const members = await membersAndSubscriptionsDAL.getAllMembers();
  // Return all the members
  return members;
};

// GET Members
const getAllMembersAndShows = async () => {
  // Get all members from SubscriptionsDB Server
  const membersFromAPI = await getAllMembers();
  // Get all members that subscribed to shows from SubscriptionsDB Server
  const subscriptionsFromAPI =
    await membersAndSubscriptionsDAL.getAllSubscriptions();
  // Get all the shows from SubscriptionsDB Server
  const showsArr = await showsDAL.getAllShows();
  // Create Array of members with the shows properties the members subscribed too
  const membersWithShows = [];
  // Get in the membersFromAPI with forEach
  membersFromAPI.forEach((member) => {
    // Create a new member Object and add showsDetails Array that will contain
    // all the properties of the shows that the member subscribed to
    let obj = {
      _id: member._id,
      Name: member.Name,
      City: member.City,
      Email: member.Email,
      showsDetails: [],
    };
    // Get in the subscriptionsFromAPI and showsArr with forEach
    subscriptionsFromAPI.forEach((subs) => {
      subs.Shows.forEach((showsOfSubs) => {
        showsArr.forEach((show) => {
          // Find the show that a member subscribed to by the common argument, the _id
          if (show._id == showsOfSubs.showId && subs.MemberId == member._id) {
            // Create a new show Object with the relevant details of the show
            const showObj = {
              _id: show._id,
              Name: show.Name,
              Genres: show.Genres,
              Date: show.Date,
              Image: show.Image,
            };
            // If the condition it true,
            // insert all the properties of the show to showsDetails Array
            obj.showsDetails.push(showObj);
          }
        });
      });
    });
    // Than insert all the obj of a member that created in line 26 into membersWithShows Array
    membersWithShows.push(obj);
  });
  // Return Array of members with the shows properties the members subscribed too
  // like Genres, Premiere Date and Name
  return membersWithShows;
};

// GET single Member with shows subscriptions
const getOneMemberDetails = async (_id) => {
  // Get all members
  const singleMember = await membersAndSubscriptionsDAL.getOneMember(_id);
  const subsFromDB = await membersAndSubscriptionsDAL.getAllSubscriptions();
  const singleMemberSubsDB = subsFromDB.find((i) => i.MemberId == _id);
  const shows = await showsDAL.getAllShows();
  // Create a new array by the name - member
  const member = [];
  const obj = {
    _id: singleMember._id,
    name: singleMember.Name,
    email: singleMember.Email,
    city: singleMember.City,
    subscriptions: [],
  };
  // Iterate over singleSubDB to find the subscribed shows by the member
  singleMemberSubsDB.Shows.forEach((sub) => {
    shows.forEach((show) => {
      if (show._id == sub.showId) {
        // Make new object and push it to subscriptions Array
        obj.subscriptions.push(show);
      }
    });
  });
  member.push(obj);
  // Return a single member
  return member;
};

// GET one member to edit
const getOneMemberToEdit = async (_id) => {
  const memberToEdit = await membersAndSubscriptionsDAL.getOneMember(_id);
  return memberToEdit;
};

// ADD new member
const addMember = async (obj) => {
  // Create a new member by calling the function in the DAL
  await membersAndSubscriptionsDAL.addMember(obj);
  // Return members
  const members = await getAllMembersAndShows();
  return members;
};

// EDIT member
const editMember = async (obj, _id) => {
  const memberObj = {
    _id: _id,
    Name: obj.Name,
    Email: obj.Email,
    City: obj.City,
  };
  // Edit member by the editMember function from the DAL
  await membersAndSubscriptionsDAL.editMember(memberObj);
  // Return all members
  const members = await membersAndSubscriptionsDAL.getAllMembers();
  return members;
};

// ADD new member
const deleteMember = async (_id) => {
  // Calling the delete member function in the DAL
  await membersAndSubscriptionsDAL.deleteMember(_id);
  // Return members
  const members = await getAllMembersAndShows();
  return members;
};

module.exports = {
  getAllMembers,
  getAllMembersAndShows,
  getOneMemberDetails,
  getOneMemberToEdit,
  addMember,
  editMember,
  deleteMember,
};
