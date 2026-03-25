const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");

// 🔥 GET ALL
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("teachers")
      .populate("sections");

    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 ADD SUBJECT (FIXED)
router.post("/", async (req, res) => {
  try {

    const { name, type, weeklyFrequency, teachers, sections } = req.body;

    if (!name || !type || !weeklyFrequency || !teachers || !sections) {
      return res.json({ error: "All fields required" });
    }

    const subject = new Subject({
      name,
      type,
      weeklyFrequency,
      teachers,
      sections
    });

    await subject.save();

    res.json({ message: "Subject added", subject });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// 🔥 DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;