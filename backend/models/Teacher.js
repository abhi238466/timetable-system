const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  name: String,
  email: String,

  primaryDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },

  canTeachDepartments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department"
    }
  ]
});

module.exports = mongoose.model("Teacher", TeacherSchema);