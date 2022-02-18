const mongoose = require("mongoose");

const HouseSchema = new mongoose.Schema({
  images: [{ type: String }],
  title: String,
  location: String,
  price: Number,
  conforts: { habitaciones: Number, camas: Number, baños: Number },
  services: [{ type: String }],
  stars: Number,
  numReviews: Number,
  reviewList: [{ author: String, description: String, date: String }],
  url: String,
});

module.exports = mongoose.model("House", HouseSchema);
