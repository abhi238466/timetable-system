const mongoose = require("mongoose");

const TimetableSchema = new mongoose.Schema({

  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },

  teacher: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher"
    }
  ],

  sections: [   // 🔥 NEW (IMPORTANT)
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section"
    }
  ],

  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true
  },

  timeslot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TimeSlot",
    required: true
  }

});

module.exports = mongoose.model("Timetable", TimetableSchema);