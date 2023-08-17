const mongoose = require("mongoose");

// MongoDB connection path
const connectToDataBase = async () => {
  await mongoose.connect("mongodb+srv://robbyzigi:nUD1ZDyGX2O5SaOD@cluster0.zawahrr.mongodb.net/usersDB");
  console.log("Connected to Mongo");
};

connectToDataBase();
