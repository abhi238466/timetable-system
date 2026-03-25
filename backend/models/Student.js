const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  college: String,
  department: String,
  section: String
});

module.exports = mongoose.model("Student", studentSchema);