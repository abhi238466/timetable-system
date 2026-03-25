const express = require("express");
const router = express.Router();
const Timetable = require("../models/Timetable");

// 🔥 IMPORT SCHEDULER
const { generateTimetable } = require("../scheduler/algorithm");


// 🔥 GET FILTERED TIMETABLE (IMPORTANT FIX)
router.get("/", async (req, res) => {
  try {
    const { department, course, section } = req.query;

    let filter = {};

    // 🔥 SECTION FILTER (MAIN)
    if (section) {
      filter.sections = { $in: [section] };  
    }

    const timetable = await Timetable.find(filter)
      .populate("subject")
      .populate("room")
      .populate("timeslot")
      .populate("teacher")
      .populate("sections");

    res.json(timetable);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔥 GENERATE TIMETABLE
router.get("/generate", async (req, res) => {
  try {

    const data = await generateTimetable();

    res.json({
      message: "✅ Timetable generated & saved",
      total: data.length
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔥 OPTIONAL MANUAL ADD
router.post("/", async (req, res) => {
  try {
    const timetable = new Timetable(req.body);
    await timetable.save();
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;