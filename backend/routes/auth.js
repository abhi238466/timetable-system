const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const nodemailer = require("nodemailer");

let otpStore = {};

// 🔥 ALLOWED ADMINS (IMPORTANT)
const ALLOWED_ADMINS = [
  "abhikumar845422@gmail.com",
  "nimcet202425@gmail.com"
];

// 🔥 MAIL CONFIG
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

    if (!email) {
      return res.json({ message: "Email required" });
    }

    // 🔐 CHECK: only allowed admin emails
    if (!ALLOWED_ADMINS.includes(email)) {
      return res.json({ message: "❌ This email is not registered as admin. Contact system admin." });
    }

    if (mode === "forgot") {
      const user = await Admin.findOne({ email });
      if (!user) {
        return res.json({ message: "Admin not found" });
      }
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    otpStore[email] = otp;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Admin OTP",
      text: `Your OTP is ${otp}`
    });

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    res.json({ message: "OTP failed" });
  }
});


// 🔥 REGISTER (SECURE)
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      address,
      college,
      otp
    } = req.body;

    if (!name || !phone || !email || !password || !address || !college || !otp) {
      return res.json({ message: "Fill all fields" });
    }

    // 🔐 ONLY ALLOWED ADMIN
    if (!ALLOWED_ADMINS.includes(email)) {
      return res.json({ message: "❌ This email is not registered as admin. Contact admin" });
    }

    if (otpStore[email] != otp) {
      return res.json({ message: "Invalid OTP" });
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.json({ message: "Admin already exists" });
    }

    await Admin.create({
      name,
      phone,
      email,
      password,
      address,
      college
    });

    delete otpStore[email];

    res.json({ message: "Admin created successfully" });

  } catch (err) {
    res.json({ message: "Error creating admin" });
  }
});


// 🔥 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔐 BLOCK UNAUTHORIZED EMAIL
    if (!ALLOWED_ADMINS.includes(email)) {
      return res.json({ message: "❌ Not authorized admin" });
    }

    const user = await Admin.findOne({ email });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.json({ message: "Invalid password" });
    }

    res.json({ message: "Login success", user });

  } catch (err) {
    res.json({ message: "Login failed" });
  }
});


// 🔥 RESET PASSWORD
router.post("/reset", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!ALLOWED_ADMINS.includes(email)) {
      return res.json({ message: "❌ Not authorized" });
    }

    if (otpStore[email] != otp) {
      return res.json({ message: "Invalid OTP" });
    }

    const user = await Admin.findOne({ email });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    delete otpStore[email];

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.json({ message: "Reset failed" });
  }
});

module.exports = router;