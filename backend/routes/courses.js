const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// ADD
router.post("/", async (req, res) => {
  try {
    const { name, department } = req.body;

    if (!name || !department) {
      return res.json({ message: "All fields required ❌" });
    }

    const course = new Course({ name, department });
    await course.save();

    res.json({ message: "Course added successfully ✅", course });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("department");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.json({ message: "Course not found ❌" });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: "Course deleted successfully ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;