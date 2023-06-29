const JFile = require("jsonfile");

// GET Permissions
const readPermissionsFromFile = () => {
  return new Promise((resolve, reject) => {
    JFile.readFile("./data/permissions.json", function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.permissions);
      }
    });
  });
};

// ADD new Permissions to File
const writePermissionsToFile = (obj) => {
    return new Promise((resolve, reject) => {
      JFile.readFile("./data/permissions.json", function (err, data) {
        if (err) {
          reject(console.log(err));
        } else {
          let arr = data.permissions;
          arr.push(obj);
          let newPermissionsData = { permissions: arr };
  
          resolve(
            JFile.writeFile("./data/permissions.json", newPermissionsData, function (err) {
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

  // UPDATE new Permissions to File
const updatePermissionsToFile = (_id, obj) => {
    return new Promise((resolve, reject) => {
      JFile.readFile("./data/permissions.json", function (err, data) {
        if (err) {
          reject(console.log(err));
        } else {
          let arr = data.permissions;
          const indexOf_id = arr.indexOf(_id);
          console.log(indexOf_id);
          arr.splice(indexOf_id, 1, obj);
  
          let newPermissionsData = { permissions: arr };
  
          resolve(
            JFile.writeFile("./data/permissions.json", newPermissionsData, function (err) {
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

  // DELETE Permissions from File
const deletePermissionsFromFile = (_id) => {
    return new Promise((resolve, reject) => {
      JFile.readFile("./data/permissions.json", function (err, data) {
        if (err) {
          reject(console.log(err));
        } else {
          let arr = data.permissions;
          let objIndex = arr.findIndex((i) => i == _id);
          arr.splice(objIndex, 1);
  
          let newPermissionsData = { permissions: arr };
  
          resolve(
            JFile.writeFile("./data/permissions.json", newPermissionsData, function (err) {
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

module.exports = {
  readPermissionsFromFile,
  writePermissionsToFile,
  updatePermissionsToFile,
  deletePermissionsFromFile
};
