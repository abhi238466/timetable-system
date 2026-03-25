const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  strength: {
    type: Number,
    required: true
  }

});

module.exports = mongoose.model("Section", SectionSchema);