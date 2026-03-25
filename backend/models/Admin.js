const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  password: String,
  address: String,
  college: String
});

module.exports = mongoose.model("Admin", adminSchema);