const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  eligibilityCriteria: {
    type: String,
  },
  linkEvent: {
    type: String,
    required: true,
  },
  registrationEnd: {
    type: String,
    required: true,
    // validate: {
    //   validator: (value) => {
    //     return value > Date.now();
    //   },
    //   message: "Registration end date must be in the future",
    // },
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  backgroundBanner: {
    type: [[String]],
    required: true,
  },
});

const ongoingEventModel = mongoose.model("ongoingEvents", eventSchema);
module.exports = ongoingEventModel;
