const mongoose = require("mongoose");

// MongoDB members schema
let UserSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
  },

  {
    versionKey: false, // Don't add __v for new documents
    toJSON: { virtuals: true }, // Create virtual fields when returning JSON
    id: false,
  }
);

module.exports = mongoose.model("users", UserSchema);
