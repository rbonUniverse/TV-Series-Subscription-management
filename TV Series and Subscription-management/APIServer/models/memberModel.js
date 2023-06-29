const mongoose = require("mongoose");

// MongoDB members schema
let MemberSchema = new mongoose.Schema(
  {
    Name: String,
    Email: String,
    City: String,
  },

  {
    versionKey: false, // Don't add __v for new documents
    toJSON: { virtuals: true }, // Create virtual fields when returning JSON
    id: false,
  }
);

module.exports = mongoose.model("members", MemberSchema);
