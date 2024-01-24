const mongoose = require("mongoose");
const loginSchema = mongoose.Schema({
  userid: {
    type: String,
    required: true,
    maxLength: 100,
  },
  password: {
    type: String,
    required: false,
    maxLength: 100,
  },
  role: {
    type: String,
    maxLength: 100,
  },
});
module.exports = mongoose.model("adminAuth", loginSchema);
