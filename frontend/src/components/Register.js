import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import Toast from "./Toast";

function Register({ role = "admin", goBack }) {

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const [loadingOtp, setLoadingOtp] = useState(false);   // 🔥 NEW
  const [loadingRegister, setLoadingRegister] = useState(false); // 🔥 NEW

  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    phone: "",
    address: "",
    department: "",
    course: "",
    section: "",
    gender: "",
    experience: ""
  });

  const showMessage = (msg, type = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // ✅ VALIDATION (UNCHANGED)
  const validate = () => {

    if (!data.name || !data.email || !data.password) return false;

    if (role === "admin") {
      if (!data.phone || !data.address || !data.college) return false;
    }

    if (role === "student") {
      if (!data.department || !data.course || !data.section || !data.gender || !data.college) return false;
    }

    if (role === "teacher") {
      if (!data.phone || !data.experience) return false;
    }

    return true;
  };

  // 🔥 SEND OTP (UPDATED FAST)
  const sendOtp = async () => {

    if (!validate()) {
      showMessage("Fill all fields ⚠️", "error");
      return;
    }

    try {

      setLoadingOtp(true); // 🔥 START LOADING
      showMessage("Sending OTP... ⏳", "info"); // 🔥 INSTANT FEEDBACK

      let url = "";

      if (role === "admin") url = "http://localhost:5000/api/auth/send-otp";
      else if (role === "student") url = "http://localhost:5000/api/student/send-otp";
      else url = "http://localhost:5000/api/teacher-auth/send-otp";

      await axios.post(url, { email: data.email });

      showMessage("OTP Sent 📩");
      setStep(2);

    } catch {
      showMessage("OTP failed ❌", "error");
    } finally {
      setLoadingOtp(false); // 🔥 STOP LOADING
    }
  };

  // 🔥 REGISTER (UPDATED)
  const register = async () => {

    try {

      setLoadingRegister(true);
      showMessage("Registering... ⏳", "info");

      let url = "";

      if (role === "admin") url = "http://localhost:5000/api/auth/register";
      else if (role === "student") url = "http://localhost:5000/api/student/register";
      else url = "http://localhost:5000/api/teacher-auth/register";

      const res = await axios.post(url, {
        ...data,
        otp
      });

      showMessage(res.data.message);

      if (res.data.message.toLowerCase().includes("success")) {
        setTimeout(goBack, 1000);
      }

    } catch {
      showMessage("Register failed ❌", "error");
    } finally {
      setLoadingRegister(false);
    }
  };

  return (
    <div className="login-container">

      {toastMsg && <Toast message={toastMsg} type={toastType} />}

      <div className="login-box">

        {/* LEFT */}
        <div className="login-left">
          <h1>Create Account 🚀</h1>
          <p>{role.toUpperCase()} Registration</p>
          <button onClick={goBack}>⬅ Back</button>
        </div>

        {/* RIGHT */}
        <div className="login-right">

          {step === 1 && (
            <>
              <input name="name" placeholder="Name" onChange={handleChange} />
              <input name="email" placeholder="Email" onChange={handleChange} />
              <input name="password" placeholder="Password" onChange={handleChange} />

              {role === "admin" && (
                <>
                  <input name="phone" placeholder="Phone" onChange={handleChange} />
                  <input name="address" placeholder="Address" onChange={handleChange} />
                  <input name="college" placeholder="College" onChange={handleChange} />
                </>
              )}

              {role === "student" && (
                <>
                  <input name="department" placeholder="Department" onChange={handleChange} />
                  <input name="course" placeholder="Course" onChange={handleChange} />
                  <input name="section" placeholder="Section" onChange={handleChange} />
                  <input name="gender" placeholder="Gender" onChange={handleChange} />
                  <input name="college" placeholder="College" onChange={handleChange} />
                </>
              )}

              {role === "teacher" && (
                <>
                  <input name="phone" placeholder="Phone" onChange={handleChange} />
                  <input name="experience" placeholder="Experience (years)" onChange={handleChange} />
                </>
              )}

              <button
                className="main-btn"
                onClick={sendOtp}
                disabled={loadingOtp}
              >
                {loadingOtp ? "Sending..." : "Send OTP"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />

              <button
                className="main-btn"
                onClick={register}
                disabled={loadingRegister}
              >
                {loadingRegister ? "Registering..." : "Register"}
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Register;