const express = require("express");
const router = express.Router();
const Teacher = require("../models/TeacherAuth");
const nodemailer = require("nodemailer"); // ✅ ADD

let otpStore = {};

// 🔥 MAIL CONFIG (SAME AS ADMIN/STUDENT)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 🔥 SEND OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email, mode } = req.body;

    console.log("EMAIL:", email);
    console.log("MODE:", mode);

    if (!email) return res.json({ message: "Email required" });

    if (mode === "forgot") {
      const user = await Teacher.findOne({ email });
      if (!user) {
        console.log("❌ Teacher not found");
        return res.json({ message: "Teacher not found" });
      }
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    otpStore[email] = otp;

    console.log("✅ OTP:", otp);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Teacher OTP",
      text: `Your OTP is ${otp}`
    });

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.log("❌ ERROR:", err);
    res.json({ message: "OTP failed" });
  }
});


// 🔥 REGISTER
router.post("/register", async (req, res) => {
  try {

    console.log("REGISTER BODY:", req.body);

    const {
      name,
      email,
      password,
      phone,
      experience,
      otp
    } = req.body;

    if (!name || !email || !password || !phone || !experience || !otp) {
      return res.json({ message: "Fill all fields" });
    }

    if (Number(otpStore[email]) !== Number(otp)) {
      return res.json({ message: "Invalid OTP" });
    }

    const exists = await Teacher.findOne({ email });
    if (exists) {
      return res.json({ message: "Teacher already exists" });
    }

    const newTeacher = await Teacher.create({
      name,
      email,
      password,
      phone,
      experience
    });

    console.log("✅ SAVED:", newTeacher);

    delete otpStore[email];

    res.json({ message: "Teacher created successfully" });

  } catch (err) {
    console.log("❌ ERROR:", err);
    res.json({ message: "Register failed" });
  }
});


// 🔥 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Teacher.findOne({ email });

    if (!user) return res.json({ message: "User not found" });

    if (user.password !== password) {
      return res.json({ message: "Invalid password" });
    }

    res.json({ message: "Login success", user });

  } catch {
    res.json({ message: "Login failed" });
  }
});


// 🔥 RESET PASSWORD
router.post("/reset", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (otpStore[email] != otp) {
      return res.json({ message: "Invalid OTP" });
    }

    const user = await Teacher.findOne({ email });
    if (!user) return res.json({ message: "User not found" });

    user.password = newPassword;
    await user.save();

    delete otpStore[email];

    res.json({ message: "Password updated successfully" });

  } catch {
    res.json({ message: "Reset failed" });
  }
});

module.exports = router;