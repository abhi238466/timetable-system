const express = require("express");
const router = express.Router();
const TimeSlot = require("../models/TimeSlot");

// Add timeslot
router.post("/", async (req, res) => {
  try {
    const timeslot = new TimeSlot(req.body);
    await timeslot.save();
    res.json(timeslot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all timeslots
router.get("/", async (req, res) => {
  try {
    const timeslots = await TimeSlot.find();
    res.json(timeslots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;