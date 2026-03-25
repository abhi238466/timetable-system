const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");

// 🔥 ADD TEACHER
router.post("/", async (req, res) => {
  try {

    const teacher = new Teacher(req.body);
    await teacher.save();

    res.json(teacher);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 GET ALL TEACHERS
router.get("/", async (req, res) => {
  try {

    const teachers = await Teacher.find();
    res.json(teachers);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 DELETE TEACHER (FIX ADDED)
router.delete("/:id", async (req, res) => {
  try {

    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!deletedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({ message: "Teacher deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;