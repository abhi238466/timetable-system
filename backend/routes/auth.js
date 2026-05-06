const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const nodemailer = require("nodemailer");

let otpStore = {};

// 🔥 ALLOWED ADMINS
const ALLOWED_ADMINS = [
  "abhikumar845422@gmail.com",
  "nimcet202425@gmail.com",
  "brajeshkumar953426@gmail.com",
  "krishnakumar13we@gmail.com"
];

// 🔥 MAIL CONFIG (FIXED → SAME AS STUDENT)
const transporter = nodemailer.createTransport({
  service: "gmail", // 🔥 CHANGE ONLY THIS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 🔥 SEND OTP (NO CHANGE)
router.post("/send-otp", async (req, res) => {
  try {
    let { email, mode } = req.body;

    if (!email) {
      return res.json({ message: "Email required" });
    }

    email = email.toLowerCase();

    // 🔐 ADMIN CHECK
    if (mode === "register" || mode === "login") {
      if (!ALLOWED_ADMINS.includes(email)) {
        return res.json({ message: "❌ Not authorized as admin" });
      }
    }

    // 🔐 FORGOT CHECK
    if (mode === "forgot") {
      if (!ALLOWED_ADMINS.includes(email)) {
        return res.json({ message: "❌ Not authorized as admin" });
      }

      const user = await Admin.findOne({ email });
      if (!user) {
        return res.json({ message: "❌ Admin not found" });
      }
    }

    // 🔥 GENERATE OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    };

    console.log("📩 OTP:", otp);

    // ✅ UI FAST RESPONSE
    res.json({ message: "OTP sent successfully" });

    // ✅ SAFE ASYNC EMAIL (NO CHANGE)
    setImmediate(async () => {
      try {
        const info = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "OTP Verification",
          text: `Your OTP is ${otp}. It is valid for 5 minutes.`
        });

        console.log("✅ Email sent:", info.response);
      } catch (err) {
        console.log("❌ Email error:", err);
      }
    });

  } catch (err) {
    console.log("❌ ERROR:", err);
    res.json({ message: "OTP failed" });
  }
});


// 🔥 REGISTER (NO CHANGE)
router.post("/register", async (req, res) => {
  try {
    let { name, phone, email, password, address, college, otp } = req.body;

    email = email.toLowerCase();

    if (!name || !phone || !email || !password || !address || !college || !otp) {
      return res.json({ message: "Fill all fields" });
    }

    if (!ALLOWED_ADMINS.includes(email)) {
      return res.json({ message: "❌ Not authorized as admin" });
    }

    if (!otpStore[email] || otpStore[email].otp != otp) {
      return res.json({ message: "Invalid OTP" });
    }

    if (Date.now() > otpStore[email].expires) {
      return res.json({ message: "OTP expired" });
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.json({ message: "Admin already exists" });
    }

    await Admin.create({ name, phone, email, password, address, college });

    delete otpStore[email];

    res.json({ message: "Admin created successfully" });

  } catch (err) {
    res.json({ message: "Error creating admin" });
  }
});


// 🔥 LOGIN (NO CHANGE)
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase();

    if (!ALLOWED_ADMINS.includes(email)) {
      return res.json({ message: "❌ Not authorized as admin" });
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


// 🔥 RESET PASSWORD (NO CHANGE)
router.post("/reset", async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;

    email = email.toLowerCase();

    if (!ALLOWED_ADMINS.includes(email)) {
      return res.json({ message: "❌ Not authorized as admin" });
    }

    if (!otpStore[email] || otpStore[email].otp != otp) {
      return res.json({ message: "Invalid OTP" });
    }

    if (Date.now() > otpStore[email].expires) {
      return res.json({ message: "OTP expired" });
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


// const express = require("express");
// const router = express.Router();
// const Admin = require("../models/Admin");
// const nodemailer = require("nodemailer");

// let otpStore = {};

// // 🔥 ALLOWED ADMINS
// const ALLOWED_ADMINS = [
//   "abhikumar845422@gmail.com",
//   "nimcet202425@gmail.com",
//   "krishnakumar13we@gmail.com"
// ];

// // 🔥 MAIL CONFIG
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// // 🔥 SEND OTP (FINAL BALANCED FIX)
// router.post("/send-otp", async (req, res) => {
//   try {
//     let { email, mode } = req.body;

//     if (!email) {
//       return res.json({ message: "Email required" });
//     }

//     email = email.toLowerCase();

//     // 🔐 ADMIN CHECK
//     if (mode === "register" || mode === "login") {
//       if (!ALLOWED_ADMINS.includes(email)) {
//         return res.json({ message: "❌ Not authorized as admin" });
//       }
//     }

//     // 🔐 FORGOT CHECK
//     if (mode === "forgot") {
//       if (!ALLOWED_ADMINS.includes(email)) {
//         return res.json({ message: "❌ Not authorized as admin" });
//       }

//       const user = await Admin.findOne({ email });
//       if (!user) {
//         return res.json({ message: "❌ Admin not found" });
//       }
//     }

//     // 🔥 GENERATE OTP
//     const otp = Math.floor(1000 + Math.random() * 9000);

//     otpStore[email] = {
//       otp,
//       expires: Date.now() + 5 * 60 * 1000
//     };

//     console.log("📩 OTP:", otp);

//     // ✅ UI FAST RESPONSE
//     res.json({ message: "OTP sent successfully" });

//     // ✅ SAFE ASYNC EMAIL (NO HANG)
//     setImmediate(async () => {
//       try {
//         const info = await transporter.sendMail({
//           from: process.env.EMAIL_USER,
//           to: email,
//           subject: "OTP Verification",
//           text: `Your OTP is ${otp}. It is valid for 5 minutes.`
//         });

//         console.log("✅ Email sent:", info.response);
//       } catch (err) {
//         console.log("❌ Email error:", err);
//       }
//     });

//   } catch (err) {
//     console.log("❌ ERROR:", err);
//     res.json({ message: "OTP failed" });
//   }
// });


// // 🔥 REGISTER
// router.post("/register", async (req, res) => {
//   try {
//     let { name, phone, email, password, address, college, otp } = req.body;

//     email = email.toLowerCase();

//     if (!name || !phone || !email || !password || !address || !college || !otp) {
//       return res.json({ message: "Fill all fields" });
//     }

//     if (!ALLOWED_ADMINS.includes(email)) {
//       return res.json({ message: "❌ Not authorized as admin" });
//     }

//     if (!otpStore[email] || otpStore[email].otp != otp) {
//       return res.json({ message: "Invalid OTP" });
//     }

//     if (Date.now() > otpStore[email].expires) {
//       return res.json({ message: "OTP expired" });
//     }

//     const exists = await Admin.findOne({ email });
//     if (exists) {
//       return res.json({ message: "Admin already exists" });
//     }

//     await Admin.create({ name, phone, email, password, address, college });

//     delete otpStore[email];

//     res.json({ message: "Admin created successfully" });

//   } catch (err) {
//     res.json({ message: "Error creating admin" });
//   }
// });


// // 🔥 LOGIN
// router.post("/login", async (req, res) => {
//   try {
//     let { email, password } = req.body;

//     email = email.toLowerCase();

//     if (!ALLOWED_ADMINS.includes(email)) {
//       return res.json({ message: "❌ Not authorized as admin" });
//     }

//     const user = await Admin.findOne({ email });

//     if (!user) {
//       return res.json({ message: "User not found" });
//     }

//     if (user.password !== password) {
//       return res.json({ message: "Invalid password" });
//     }

//     res.json({ message: "Login success", user });

//   } catch (err) {
//     res.json({ message: "Login failed" });
//   }
// });


// // 🔥 RESET PASSWORD
// router.post("/reset", async (req, res) => {
//   try {
//     let { email, otp, newPassword } = req.body;

//     email = email.toLowerCase();

//     if (!ALLOWED_ADMINS.includes(email)) {
//       return res.json({ message: "❌ Not authorized as admin" });
//     }

//     if (!otpStore[email] || otpStore[email].otp != otp) {
//       return res.json({ message: "Invalid OTP" });
//     }

//     if (Date.now() > otpStore[email].expires) {
//       return res.json({ message: "OTP expired" });
//     }

//     const user = await Admin.findOne({ email });

//     if (!user) {
//       return res.json({ message: "User not found" });
//     }

//     user.password = newPassword;
//     await user.save();

//     delete otpStore[email];

//     res.json({ message: "Password updated successfully" });

//   } catch (err) {
//     res.json({ message: "Reset failed" });
//   }
// });

// module.exports = router;