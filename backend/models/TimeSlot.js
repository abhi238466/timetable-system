const mongoose = require("mongoose");

const TimeSlotSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true
  },

  startTime: {
    type: String,
    required: true
  },

  endTime: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("TimeSlot", TimeSlotSchema);