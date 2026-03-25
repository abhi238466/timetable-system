const express = require("express");
const router = express.Router();
const Department = require("../models/Department");

// 🔥 ADD
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.json({ message: "Enter name ❌" });
    }

    // 🔥 FIX: code manually generate
    const code = name.substring(0, 3).toUpperCase();

    const dep = new Department({
      name,
      code
    });

    await dep.save();

    res.json({
      message: "Department added ✅",
      data: dep
    });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({
      message: "Server error ❌"
    });
  }
});

// 🔥 GET
router.get("/", async (req, res) => {
  try {
    const data = await Department.find();
    res.json(data);
  } catch {
    res.status(500).json({ message: "Fetch error ❌" });
  }
});

// 🔥 DELETE
router.delete("/:id", async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);

    if (!dep) {
      return res.json({ message: "Not found ❌" });
    }

    await Department.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted ✅" });

  } catch {
    res.status(500).json({ message: "Delete error ❌" });
  }
});

module.exports = router;