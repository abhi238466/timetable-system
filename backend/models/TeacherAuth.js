const mongoose = require("mongoose");

const teacherAuthSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  experience: String
});

module.exports = mongoose.model("TeacherAuth", teacherAuthSchema);