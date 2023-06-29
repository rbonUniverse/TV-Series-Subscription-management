const usersDAL = require("../DALs/usersDAL");
const permissionsDAL = require("../DALs/permissionsDAL");

// GET Users
const getUsers = async () => {
  // Get all users from the users.Json File
  const usersFromFile = await usersDAL.readUsersFromFile();
  // Create a new array without the Admin so it wont upere on the usersManagement page
  const newArrayUsersFromFile = usersFromFile.splice(1);
  // Get all users from the DB
  const respDB = await usersDAL.getUsersFromDB();

  // Create a new array by the name - users
  const users = [];
  // Iterate the newArrayUsersFromFile and find the _id from the file and the _id from the DB
  // Than make a new object out of them and push the object to users Array
  newArrayUsersFromFile.forEach((user) => {
    userInfo = respDB.filter((userFromDB) => userFromDB._id == user._id);
    users.push({ ...user, ...userInfo });
  });
  // Return all the users
  return users;
};

// GET single user and permissions
const getSingleUserAndPermissions = async (_id) => {
  // Get all users from DB
  const userArrayFromDB = await usersDAL.getUsersFromDB();
  // Find single user from DB
  const singleUserFromDB = userArrayFromDB.find((user) => user._id == _id);
  // Get all users from users json file
  const usersFromFile = await usersDAL.readUsersFromFile();
  // Find single user according the _id
  const singleUserFromFile = usersFromFile.find((user) => user._id == _id);
  // Get all permissions from permissions json file
  const permissionsFromFile = await permissionsDAL.readPermissionsFromFile();
  // Find the user permissions according the _id
  const singleUserPermissions = permissionsFromFile.find(
    (permissions) => permissions.userId === _id
  );
  // Get only the permissions from the array
  const permissions = singleUserPermissions.userPermissions;
  // Create a new user with subscriptions object
  const userWithPermissionsObj = {
    _id: singleUserFromFile._id,
    firstName: singleUserFromFile.firstName,
    lastName: singleUserFromFile.lastName,
    username: singleUserFromDB.username,
    sessionTimeOut: singleUserFromFile.sessionTimeOut,
    createdDate: singleUserFromFile.createdDate,
    permissions: [],
  };
  userWithPermissionsObj.permissions.push(...permissions);
  // Return userWithPermissionsObj
  return userWithPermissionsObj;
};

// ADD User
const addUser = async (obj) => {
  // Get all the users from DB
  const usersDB = await usersDAL.getUsersFromDB();
  // Check if the username already taken by comparing the obj.username from the front
  // to the usernames from the DB
  const usernameFromDB = usersDB.find(
    (u) => u.username == obj.username || u._id == obj._id
  );
  // If there is an identical username, send a massage to choose a different username
  if (usernameFromDB == true) {
    res.send("Username already taken, please choose a different username");
    res.end();
    return;
  } else {
    // If there is no identical username create a new username in the DB
    await usersDAL.addUserToDB(obj);
    // Get all the users from DB after added the new user
    const usersDataFromDB = await usersDAL.getUsersFromDB();
    // Get the last user from the DB (we know this is the new user)
    const user_IdFromDB = usersDataFromDB[usersDataFromDB.length - 1];

    // Make a dd/mm/yyyy date format
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    const formattedToday = dd + "/" + mm + "/" + yyyy;

    // Make a new permissions object and insert the user _id argument from the new user created in the DB
    // and insert to the object the permissions the we got (obj.permissions) from the front by the argument
    const permissionsObj = {
      userId: user_IdFromDB._id,
      userPermissions: obj.permissions,
    };
    // Insert the object into the writePermissionsToFile function from permissionsDAL
    await permissionsDAL.writePermissionsToFile(permissionsObj);

    // Make all the unnecessary elements from the obj argument undefined
    // before writing the data to the users.Json File.
    // Make the date to insert as dd/mm/yyyy format.
    // Give the _id in the object that will be insert to users.Json File te exact _id there is in the DB
    obj.username = undefined;
    obj.sessionTimeOut = +obj.sessionTimeOut;
    obj.permissions = undefined;
    obj.createdDate = formattedToday;
    obj._id = user_IdFromDB._id;
    // insert the object into the writeUserToFile function from usersDAL after the modifications
    await usersDAL.writeUserToFile(obj);

    // Return all users
    return usersDAL.readUsersFromFile();
  }
};

// UPDATE User
const updateUser = async (_id, obj) => {
  // Send user _id and user obj arguments to the updateUserInDB
  // to update the user info in DB
  await usersDAL.updateUserInDB(_id, obj);

  // Make a new object and insert
  // the relevant info from the argument to the newObj
  const newObj = {
    userId: _id,
    userPermissions: obj.permissions,
  };
  // Insert the user _id argument and the newObj to updatePermissionsToFile function
  // to update the info in the permissions.Json File
  await permissionsDAL.updatePermissionsToFile(_id, newObj);

  // Make all the unnecessary elements from the obj argument undefined
  // before writing the data to the users.Json File.
  obj.username = undefined;
  obj.sessionTimeOut = +obj.sessionTimeOut;
  obj.permissions = undefined;
  obj._id = _id;
  await usersDAL.updateUserToFile(_id, obj);

  // Return all users
  const users = getUsers();
  return users;
};

const createUserPassword = async (obj) => {
  // Check if the user choose empty password
  if (obj.password == "") {
    console.log("Please choose password");
    return;
  } else {
    // if not the send the object with the info to the function in the usersDAL
    const user = await usersDAL.updateUserPasswordInDB(obj);
    return user;
  }
};

// DELETE User
const deleteUser = async (_id) => {
  // Send the user _id argument
  // to the delete functions from usersDAL and permissionsDAL
  await usersDAL.deleteUserFromFile(_id);
  await usersDAL.deleteUsersFromDB(_id);
  await permissionsDAL.deletePermissionsFromFile(_id);
};

module.exports = {
  getUsers,
  getSingleUserAndPermissions,
  addUser,
  updateUser,
  createUserPassword,
  deleteUser,
};
