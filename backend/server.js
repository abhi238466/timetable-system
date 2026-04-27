const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // 🔥 ENV LOAD


// 🔥 IMPORT ROUTES
const teacherRoutes = require("./routes/teachers");
const subjectRoutes = require("./routes/subjects");
const roomRoutes = require("./routes/rooms");
const timeSlotRoutes = require("./routes/timeslots");
const timetableRoutes = require("./routes/timetable");
const departmentRoutes = require("./routes/departments");
const courseRoutes = require("./routes/courses");
const sectionRoutes = require("./routes/sections");

// 🔥 AUTH ROUTES
const authRoutes = require("./routes/auth"); // Admin
const studentAuthRoutes = require("./routes/studentAuth"); // Student


const app = express();


// 🔥 MIDDLEWARE
app.use(cors());
app.use(express.json());


// 🔥 ROUTES
app.use("/api/teachers", teacherRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/timeslots", timeSlotRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/teacher-auth", require("./routes/teacherAuth"));

// 🔥 AUTH
app.use("/api/auth", authRoutes); // Admin login
app.use("/api/student", studentAuthRoutes); // Student login


// 🔥 TEST ROUTE
app.get("/", (req, res) => {
  res.send("🚀 Timetable System Backend Running");
});


// 🔥 DATABASE CONNECTION
mongoose.connect("mongodb://127.0.0.1:27017/timetable_db")
  .then(() => {
    console.log("✅ MongoDB Connected");

    // 🔥 ENV CHECK
    console.log("📧 EMAIL USER:", process.env.EMAIL_USER ? "Loaded ✅" : "Not Loaded ❌");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err);
  });


// 🔥 SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});