const JFile = require("jsonfile");
const UserModel = require("../models/userModel");

// GET Users form File
const readUsersFromFile = () => {
  return new Promise((resolve, reject) => {
    JFile.readFile("./data/users.json", function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.users);
      }
    });
  });
};

// GET users from DB
const getUsersFromDB = async () => {
  const respDB = await UserModel.find();
  return respDB;
};

// ADD new User to File
const writeUserToFile = (obj) => {
  return new Promise((resolve, reject) => {
    JFile.readFile("./data/users.json", function (err, data) {
      if (err) {
        reject(console.log(err));
      } else {
        let arr = data.users;
        arr.push(obj);
        let newUserData = { users: arr };

        resolve(
          JFile.writeFile("./data/users.json", newUserData, function (err) {
            if (err) {
              reject(console.log(err));
            } else {
              console.log("Created !!!");
            }
          })
        );
      }
    });
  });
};

// ADD user to DB
const addUserToDB = async (obj) => {
  // Create newObj and insert the obj argument as username (obj.username)
  // and use it to add a new user in the DB
  const newObj = {
    username: obj.username,
    password: "",
  };
  return await new UserModel(newObj).save();
};

// UPDATE new User to File
const updateUserToFile = (_id, obj) => {
  return new Promise((resolve, reject) => {
    JFile.readFile("./data/users.json", function (err, data) {
      if (err) {
        reject(console.log(err));
      } else {
        let arr = data.users;
        const indexOf_id = arr.indexOf(_id);
        console.log(indexOf_id);
        arr.splice(indexOf_id, 1, obj);

        let newUserData = { users: arr };

        resolve(
          JFile.writeFile("./data/users.json", newUserData, function (err) {
            if (err) {
              reject(console.log(err));
            } else {
              console.log("Updated !!!");
            }
          })
        );
      }
    });
  });
};

// UPDATE User in DB by _id
const updateUserInDB = async (_id, obj) => {
  // Take the _id and obj arguments and use it to update the username in the DB
  await UserModel.findByIdAndUpdate(_id, { username: obj.username });
};

// UPDATE User in DB by username
const updateUserPasswordInDB = async (obj) => {
  // Take the obj argument and use it to update the user password in the DB
  await UserModel.findOneAndUpdate(
    { username: obj.username },
    { password: obj.password }
  );
};

// DELETE User from File
const deleteUserFromFile = (_id) => {
  return new Promise((resolve, reject) => {
    JFile.readFile("./data/users.json", function (err, data) {
      if (err) {
        reject(console.log(err));
      } else {
        let arr = data.users;
        let objIndex = arr.findIndex((i) => i._id == _id);
        arr.splice(objIndex, 1);

        let newUserData = { users: arr };

        resolve(
          JFile.writeFile("./data/users.json", newUserData, function (err) {
            if (err) {
              reject(console.log(err));
            } else {
              console.log("Deleted !!!");
            }
          })
        );
      }
    });
  });
};

// GET users from DB
const deleteUsersFromDB = async (_id) => {
  const findUser = await UserModel.findByIdAndDelete(_id);
  if (!findUser) {
    console.log("User _id not found");
  }
};

module.exports = {
  readUsersFromFile,
  getUsersFromDB,
  writeUserToFile,
  addUserToDB,
  updateUserToFile,
  updateUserInDB,
  updateUserPasswordInDB,
  deleteUserFromFile,
  deleteUsersFromDB,
};
