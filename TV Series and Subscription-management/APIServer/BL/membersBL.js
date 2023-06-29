const axios = require("axios");
const MemberModel = require("../models/memberModel");
const SubscriptionModel = require("../models/subscriptionModel");

// GET all members
const getAllMembers = async () => {
  try {
    // GET all Members from DataBase
    const members = await MemberModel.find().exec();
    // If Members not found in DataBase, GET all Members from API Server and insert them into the DataBase
    if (members.length < 1) {
      const resp = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      const members = resp.data;
      members.forEach(async (m) => {
        const obj = { Name: m.name, Email: m.email, City: m.address.city };
        const member = new MemberModel(obj);
        await member.save();
      });
    }
    // Return all Members
    return members;
  } catch (error) {
    console.error("Error get all Members:", error);
    throw error;
  }
};

// GET one member
const getOneMember = async (_id) => {
  try {
    // Find Member in DataBase
    const member = await MemberModel.findById(_id);
    // Return Member
    return member;
  } catch (error) {
    console.error("Error getting one Member:", error);
    throw error;
  }
};

// ADD new member
const addMember = async (obj) => {
  try {
    // New Member model
    await new MemberModel(obj).save();
    // Get all members
    const members = await getAllMembers();
    // Return all Members
    return members;
  } catch (error) {
    console.error("Error adding Member:", error);
    throw error;
  }
};

// ADD new member
const editMember = async (obj) => {
  try {
    // Member model to edit
    await MemberModel.findByIdAndUpdate(obj._id, obj);
    // Get all members
    const members = await getAllMembers();
    // Return all Members
    return members;
  } catch (error) {
    console.error("Error editing Member:", error);
    throw error;
  }
};

// DELETE member
const deleteMember = async (_idObj) => {
  try {
    // find Member in DataBase and Delete it
    const member = await MemberModel.findByIdAndDelete(_idObj._id);
    // find Member and delete the Member and all the subscriptions assigned to it
    // from the subscription collection in DataBase and Delete it
    const subscriptions = await SubscriptionModel.deleteOne({
      MemberId: _idObj._id,
    });
    // If Member not found, consol.log error massage
    if (!member) {
      console.log("Member _id not found");
    }
    // If Subscriptions not found, consol.log error massage
    if (!subscriptions) {
      console.log("No subscriptions found fo this member");
    }
    // Return all Members
    const members = await getAllMembers();
    return members;
  } catch (error) {
    console.error("Error deleting Member:", error);
    throw error;
  }
};

module.exports = {
  getAllMembers,
  getOneMember,
  addMember,
  editMember,
  deleteMember,
};
