const mongoose = require("mongoose");

// MongoDB shows schema
let ShowSchema = new mongoose.Schema(
  {
    Name: String,
    Genres: [String],
    Date: String,
    Image: String,
  },

  {
    versionKey: false, // Don't add __v for new documents
    toJSON: { virtuals: true }, // Create virtual fields when returning JSON
    id: false,
  }
);

module.exports = mongoose.model("shows", ShowSchema);
