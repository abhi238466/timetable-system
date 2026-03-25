const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["theory", "lab"],
    required: true
  },

  weeklyFrequency: {
    type: Number,
    required: true
  },

  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher"
    }
  ],

  sections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section"
    }
  ]

});

// ❌ REMOVE validation (for now)

module.exports = mongoose.model("Subject", SubjectSchema);