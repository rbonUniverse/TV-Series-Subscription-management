const axios = require("axios");
const ShowModel = require("../models/showModel");
const SubscriptionModel = require("../models/subscriptionModel");

// Get all shows
const getAllShows = async () => {
  try {
    // GET all shows from DataBase
    const shows = await ShowModel.find().exec();
    // If shows not found in DataBase, GET all shows from API Server and insert them into the DataBase
    if (shows.length < 1) {
      const resp = await axios.get("https://api.tvmaze.com/shows");
      const shows = resp.data;
      shows.forEach(async (s) => {
        // Formate the date to dd/mm/yyyy
        const yyyy = s.premiered.slice(0, 4);
        let mm = s.premiered.slice(5, 7);
        let dd = s.premiered.slice(8);
        const formatted = dd + "/" + mm + "/" + yyyy;
        const obj = {
          Name: s.name,
          Genres: s.genres,
          Date: formatted,
          Image: s.image.medium,
        };
        // Save into the show model
        const show = new ShowModel(obj);
        await show.save();
      });
    }
    // Return all Shows
    return shows;
  } catch (error) {
    console.error("Error of getting all shows:", error);
    throw error;
  }
};

// Get one show
const getOneShow = async (_id) => {
  try {
    // GET one show from DataBase
    const show = await ShowModel.findById(_id);
    // Return all Shows
    return show;
  } catch (error) {
    console.error("Error of get show:", error);
    throw error;
  }
};

// Get one show
const getOneShowDetails = async (_id) => {
  try {
    // GET one show from DataBase
    const show = await ShowModel.findById(_id);
    // Return all Shows
    return show;
  } catch (error) {
    console.error("Error of get show:", error);
    throw error;
  }
};

// Add Show
const addNewShow = async (obj) => {
  try {
    // Formate the date to dd/mm/yyyy
    const yyyy = obj.Date.slice(0, 4);
    let mm = obj.Date.slice(5, 7);
    let dd = obj.Date.slice(8);
    const formatted = dd + "/" + mm + "/" + yyyy;
    obj.Date = formatted;
    // Create new Show Model and Save
    await new ShowModel(obj).save();
    // Return all Shows
    const shows = await getAllShows();
    return shows;
  } catch (error) {
    console.error("Error adding show:", error);
    throw error;
  }
};

// Edit Show
const editShow = async (obj) => {
  try {
    // Formate the date to dd/mm/yyyy
    const yyyy = obj.Date.slice(0, 4);
    let mm = obj.Date.slice(5, 7);
    let dd = obj.Date.slice(8);
    const formatted = dd + "/" + mm + "/" + yyyy;
    // Create show Object
    let showObj = {
      _id: obj._id,
      Name: obj.Name,
      Genres: obj.Genres,
      Date: formatted,
      Image: obj.Image,
    };
    // Find one show
    await ShowModel.findByIdAndUpdate(obj._id, showObj);
    // Return all Shows
    const allShows = await getAllShows();
    return allShows;
  } catch (error) {
    console.error("Error of editing show:", error);
    throw error;
  }
};

// Delete show
const deleteShow = async (_idObj) => {
  try {
    const subscriptions = await SubscriptionModel.find().populate(
      "member show date"
    );

    for (const show of subscriptions) {
      for (const i of show.Shows) {
        if (i.showId == _idObj._id && show.Shows.length <= 1) {
          await SubscriptionModel.findByIdAndRemove(show._id);
        }
        if (i.showId == _idObj._id && show.Shows.length > 1) {
          await SubscriptionModel.updateMany(
            { "Shows.showId": i.showId },
            { $pull: { Shows: { showId: i.showId } } }
          );
        }
      }
    }

    await ShowModel.findByIdAndDelete(_idObj._id);

    const shows = await getAllShows();
    return shows;
  } catch (error) {
    console.error("Error deleting show:", error);
    throw error;
  }
};

module.exports = {
  getAllShows,
  getOneShow,
  getOneShowDetails,
  editShow,
  addNewShow,
  editShow,
  deleteShow,
};
