const express = require("express");
const router = express.Router();
const Section = require("../models/Section");

// 🔥 ADD SECTION
router.post("/", async (req, res) => {
  try {
    const { name, course, strength } = req.body;

    if (!name || !course || !strength) {
      return res.json({ message: "All fields required ❌" });
    }

    const section = new Section({
      name,
      course,
      strength
    });

    await section.save();

    res.json({ message: "Section added successfully ✅", section });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔥 GET ALL
router.get("/", async (req, res) => {
  try {
    const sections = await Section.find().populate("course");
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔥 DELETE SECTION (FULL FIX)
router.delete("/:id", async (req, res) => {
  try {

    const section = await Section.findById(req.params.id);

    if (!section) {
      return res.json({ message: "Section not found ❌" });
    }

    await Section.findByIdAndDelete(req.params.id);

    res.json({ message: "Section deleted successfully ✅" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;