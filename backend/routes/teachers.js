const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");

// 🔥 ADD TEACHER
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    const exists = await Teacher.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Teacher already exists" });
    }

    const teacher = new Teacher(req.body);
    await teacher.save();

    res.json(teacher);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 GET ALL TEACHERS (FIXED ✅)
router.get("/", async (req, res) => {
  try {

    const teachers = await Teacher.find()
      .populate("primaryDepartment")
      .populate("canTeachDepartments");

    res.json(teachers);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 DELETE
router.delete("/:id", async (req, res) => {
  try {

    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;