const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  instaPostLink: {
    type: String,
  },
  linkdinPostLink: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const achievementModel = mongoose.model("achievements", achievementSchema);
module.exports = achievementModel;
