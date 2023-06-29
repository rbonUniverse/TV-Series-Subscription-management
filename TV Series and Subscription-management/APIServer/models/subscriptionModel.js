const mongoose = require("mongoose");
const MemberModel = require("./memberModel");
const ShowModel = require("./showModel");

// MongoDB shows schema
let SubscriptionSchema = new mongoose.Schema(
  {
    MemberId: String,
    Shows: [{ showId: String, date: String }],
  },

  {
    versionKey: false, // Don't add __v for new documents
    toJSON: { virtuals: true }, // Create virtual fields when returning JSON
    id: false,
  }
);

SubscriptionSchema.virtual("member", {
  ref: MemberModel,
  localField: "MemberId",
  foreignField: "_id",
  justOne: true,
});

SubscriptionSchema.virtual("show", {
  ref: ShowModel,
  localField: "showId",
  foreignField: "_id",
  justOne: true,
});

SubscriptionSchema.virtual("date", {
  ref: ShowModel,
  localField: "date",
  foreignField: "Date",
  justOne: true,
});

module.exports = mongoose.model("subscriptions", SubscriptionSchema);
