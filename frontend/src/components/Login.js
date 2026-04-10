import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Register from "./Register";
import Toast from "./Toast";

function Login() {

  const navigate = useNavigate();
  const location = useLocation();

  const [show, setShow] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

  const [data, setData] = useState({ email: "", password: "" });

  const [step, setStep] = useState("login");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");

  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const showMessage = (msg, type = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // 🔥 ROLE DETECT
  const role = location.pathname.includes("admin")
    ? "admin"
    : location.pathname.includes("student")
    ? "student"
    : "teacher";

  // 🔥 LOGIN
  const handleLogin = async () => {
    if (!data.email || !data.password) {
      showMessage("Fill all fields ⚠️", "error");
      return;
    }

    try {
      setLoadingLogin(true);

      let url = "";

      if (role === "admin") {
        url = "http://localhost:5000/api/auth/login";
      } else if (role === "student") {
        url = "http://localhost:5000/api/student/login";
      } else {
        url = "http://localhost:5000/api/teacher-auth/login";
      }

      const res = await axios.post(url, data);

      if (res.data.message === "Login success") {

        // ✅ ADMIN STORE FIX
        if (role === "admin") {
          localStorage.setItem("name", res.data.user.name);
          localStorage.setItem("email", res.data.user.email);
        }

        // ✅ STUDENT STORE
        if (role === "student") {
          localStorage.setItem("studentName", res.data.user.name);
          localStorage.setItem("studentEmail", res.data.user.email);
        }

        // ✅ TEACHER STORE (AS IT IS)
        if (role === "teacher") {
          localStorage.setItem("teacherName", res.data.user.name);
          localStorage.setItem("teacherEmail", res.data.user.email);
        }

        showMessage("Login success ✅");

        setTimeout(() => {
          if (role === "admin") navigate("/admin-dashboard");
          else if (role === "student") navigate("/student-dashboard");
          else navigate("/teacher-dashboard");
        }, 1000);

      } else {
        showMessage(res.data.message, "error");
      }

    } catch {
      showMessage("Server error ❌", "error");
    } finally {
      setLoadingLogin(false);
    }
  };

  // 🔥 SEND OTP
  const sendOtp = async () => {

    if (!data.email) return showMessage("Enter email", "error");

    let url = "";

    if (role === "admin") {
      url = "http://localhost:5000/api/auth/send-otp";
    } else if (role === "student") {
      url = "http://localhost:5000/api/student/send-otp";
    } else {
      url = "http://localhost:5000/api/teacher-auth/send-otp";
    }

    try {
      setLoadingOtp(true);

      showMessage("Sending OTP... ⏳", "info");

      await axios.post(url, { email: data.email, mode: "forgot" });

      showMessage("OTP Sent 📩");
      setStep("otp");

    } catch {
      showMessage("OTP failed ❌", "error");
    } finally {
      setLoadingOtp(false);
    }
  };

  const verifyOtp = () => {
    if (!otp) return showMessage("Enter OTP", "error");
    setStep("reset");
  };

  const resetPassword = async () => {

    let url = "";

    if (role === "admin") {
      url = "http://localhost:5000/api/auth/reset";
    } else if (role === "student") {
      url = "http://localhost:5000/api/student/reset";
    } else {
      url = "http://localhost:5000/api/teacher-auth/reset";
    }

    const res = await axios.post(url, {
      email: data.email,
      otp,
      newPassword: newPass
    });

    showMessage(res.data.message);
    setStep("login");
  };

  if (showRegister) {
    return <Register role={role} goBack={() => setShowRegister(false)} />;
  }

  return (
    <div className="login-container">

      {toastMsg && <Toast message={toastMsg} type={toastType} />}

      <div className="login-box">

        {/* LEFT */}
        <div className="login-left">
          <h1>Welcome Back 👋</h1>
          <p>Smart timetable & classroom system</p>

          <button onClick={() => setStep("login")}>SIGN IN</button>

          <button className="outline" onClick={() => setShowRegister(true)}>
            CREATE ACCOUNT
          </button>
        </div>

        {/* RIGHT */}
        <div className="login-right">

          <h2>{role.toUpperCase()} LOGIN</h2>

          {step === "login" && (
            <>
              <input name="email" placeholder="Email" onChange={handleChange} />

              <div className="password-box">
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                />
                <span onClick={() => setShow(!show)}>
                  {show ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <span
  style={{ color: "#2563eb", cursor: "pointer", fontWeight: "500" }}
  onClick={() => setStep("email")}
>
  Forgot password?
</span>

              <button className="main-btn" onClick={handleLogin} disabled={loadingLogin}>
                {loadingLogin ? "Logging in..." : "LOGIN"}
              </button>
            </>
          )}

          {step === "email" && (
            <>
              <input name="email" placeholder="Email" onChange={handleChange} />

              <button
                className="main-btn" 
                onClick={sendOtp}
                disabled={loadingOtp}
              >
                {loadingOtp ? "Sending..." : "Send OTP"}
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <input placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />

              <button className="main-btn" onClick={verifyOtp}>
                Verify OTP
              </button>
            </>
          )}

          {step === "reset" && (
            <>
              <input placeholder="New Password" onChange={(e) => setNewPass(e.target.value)} />

              <button className="main-btn" onClick={resetPassword}>
                Update Password
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
}

export default Login;