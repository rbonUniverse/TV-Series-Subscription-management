const SubscriptionModel = require("../models/subscriptionModel");
const showsBL = require("./showsBL");

// GET all Subscriptions
const getAllSubscriptions = async () => {
  try {
    // GET all Subscriptions from DataBase and populate them
    const subscriptions = await SubscriptionModel.find().populate(
      "member show date"
    );
    // Return all Subscriptions
    return subscriptions;
  } catch (error) {
    console.error("Error get all Subscription:", error);
    throw error;
  }
};

// ADD Subscription
const newSubscription = async (obj) => {
  try {
    const show = await showsBL.getOneShow(obj.showId);
    const allSubscriptionsFromDB = await getAllSubscriptions();

    if (allSubscriptionsFromDB.length < 1) {
      obj = {
        MemberId: obj.MemberId,
        Shows: [{ showId: show._id.toString(), date: show.Date }],
      };
      await new SubscriptionModel(obj).save();
    } else {
      const matchingSubscription = allSubscriptionsFromDB.find(
        (subscription) => subscription.MemberId == obj.MemberId
      );

      if (matchingSubscription) {
        const existingShow = matchingSubscription.Shows.find(
          (s) => s.showId == obj.showId
        );
        if (existingShow) {
          console.log("Cannot subscribe to the same show twice");
          return getAllSubscriptions();
        } else {
          matchingSubscription.Shows.push({
            showId: show._id.toString(),
            date: show.Date,
          });
          await matchingSubscription.save();
        }
      } else {
        obj = {
          MemberId: obj.MemberId,
          Shows: [{ showId: show._id.toString(), date: show.Date }],
        };
        await new SubscriptionModel(obj).save();
      }
    }
    return getAllSubscriptions();
  } catch (error) {
    console.error("Error during adding new Subscription:", error);
    throw error;
  }
};

// Remove Subscription
const removeSubscription = async (_id) => {
  try {
    // Find Subscription in DataBase and Remove it
    const subscription = await SubscriptionModel.findByIdAndRemove(_id).exec();
    if (!subscription) {
      console.log("Subscription _id not found");
    }
    // Return all Subscriptions
    return getAllSubscriptions();
  } catch (error) {
    console.error("Error removing Subscription:", error);
    throw error;
  }
};

module.exports = { getAllSubscriptions, newSubscription, removeSubscription };
