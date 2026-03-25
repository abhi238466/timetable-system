const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const nodemailer = require("nodemailer");

let otpStore = {};

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

    if (!email) return res.json({ message: "Email required" });

    if (mode === "forgot") {
      const user = await Student.findOne({ email });
      if (!user) return res.json({ message: "Student not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    otpStore[email] = otp;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Student OTP",
      text: `Your OTP is ${otp}`
    });

    res.json({ message: "OTP sent successfully" });

  } catch {
    res.json({ message: "OTP failed" });
  }
});

// 🔥 REGISTER (UPDATED)
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      college,
      department,
      course,
      section,
      gender,
      otp
    } = req.body;

    if (!name || !email || !password || !college || !department || !course || !section || !gender || !otp) {
      return res.json({ message: "Fill all fields" });
    }

    if (otpStore[email] != otp) {
      return res.json({ message: "Invalid OTP" });
    }

    const exists = await Student.findOne({ email });
    if (exists) {
      return res.json({ message: "Student already exists" });
    }

    await Student.create({
      name,
      email,
      password,
      college,
      department,
      course,
      section,
      gender
    });

    delete otpStore[email];

    res.json({ message: "Student created successfully" });

  } catch (err) {
    res.json({ message: "Error creating student" });
  }
});

// 🔥 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Student.findOne({ email });

    if (!user) return res.json({ message: "User not found" });
    if (user.password !== password) return res.json({ message: "Invalid password" });

    res.json({ message: "Login success", user });

  } catch {
    res.json({ message: "Login failed" });
  }
});

// 🔥 RESET
router.post("/reset", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (otpStore[email] != otp) return res.json({ message: "Invalid OTP" });

    const user = await Student.findOne({ email });
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