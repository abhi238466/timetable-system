const express = require("express");
const router = express.Router();
const Timetable = require("../models/Timetable");

// 🔥 IMPORT SCHEDULER
const { generateTimetable } = require("../scheduler/algorithm");


/*
====================================================
📌 GET ALL TIMETABLE (STUDENT + ADMIN SAFE)
====================================================
*/
router.get("/", async (req, res) => {
  try {

    const timetable = await Timetable.find({})
      .populate("subject")   // subject name + type
      .populate("room")      // room name
      .populate("timeslot")  // day + time
      .populate("teacher")   // multiple teachers
      .populate("sections"); // multiple sections

    res.json(timetable);

  } catch (error) {
    console.error("❌ Timetable Fetch Error:", error);
    res.status(500).json({
      error: "Error fetching timetable",
      details: error.message
    });
  }
});


/*
====================================================
📌 GENERATE TIMETABLE (ALGORITHM)
====================================================
*/
router.get("/generate", async (req, res) => {
  try {

    const { timetable, failedSubjects } = await generateTimetable();

    res.json({
      message: "✅ Timetable generated successfully",
      totalScheduled: timetable.length,
      failedSubjects: failedSubjects || []
    });

  } catch (error) {
    console.error("❌ Generate Error:", error);

    res.status(500).json({
      error: "❌ Error generating timetable",
      details: error.message
    });
  }
});


/*
====================================================
📌 ADD MANUAL ENTRY (OPTIONAL)
====================================================
*/
router.post("/", async (req, res) => {
  try {

    const timetable = new Timetable(req.body);
    await timetable.save();

    res.json({
      message: "✅ Entry added",
      data: timetable
    });

  } catch (error) {
    console.error("❌ Add Error:", error);
    res.status(500).json({
      error: "Error adding timetable",
      details: error.message
    });
  }
});


/*
====================================================
📌 CLEAR ALL TIMETABLE (RESET)
====================================================
*/
router.delete("/clear", async (req, res) => {
  try {

    await Timetable.deleteMany({});

    res.json({
      message: "🧹 Timetable cleared successfully"
    });

  } catch (error) {
    console.error("❌ Clear Error:", error);
    res.status(500).json({
      error: "Error clearing timetable",
      details: error.message
    });
  }
});


module.exports = router;