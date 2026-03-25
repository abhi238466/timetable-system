const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  capacity: {
    type: Number,
    required: true
  },

  type: {
    type: String,
    enum: ["classroom", "lab"],
    required: true
  },

  // 🔥 NEW FIELDS (IMPORTANT)
  building: {
    type: String,
    required: true   // e.g. Block A, Block B
  },

  floor: {
    type: Number,
    required: true   // e.g. 1, 2, 3
  }

});

module.exports = mongoose.model("Room", RoomSchema);