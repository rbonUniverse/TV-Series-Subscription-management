const mongoose = require("mongoose");

// MongoDB connection path
const connectToDataBase = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/subscriptionsDB");
  console.log("Connected to Mongo");
};

connectToDataBase();