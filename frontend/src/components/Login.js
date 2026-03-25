import React, { useState, useEffect } from "react";

function Login({ setIsLoggedIn }) {

  const [key, setKey] = useState(0);
  const [userType, setUserType] = useState("admin");
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    college: "",
    department: "",
    course: "",
    section: "",
    gender: "",
    otp: "",
    newPassword: ""
  });

  useEffect(() => {
    setStep(1);
    setLoading(false);
    setShowPassword(false);
    setMessage({ text: "", type: "" });

    setForm({
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      college: "",
      department: "",
      course: "",
      section: "",
      gender: "",
      otp: "",
      newPassword: ""
    });

  }, [mode, userType]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ FULL VALIDATION
  const validate = () => {

    if (!form.email.trim()) return "Email required";

    if (mode === "login") {
      if (!form.password.trim()) return "Password required";
    }

    if (mode === "register") {

      if (!form.name || !form.password) return "Fill all fields";

      if (userType === "admin") {
        if (!form.phone || !form.address || !form.college) {
          return "Fill admin details";
        }
      }

      if (userType === "student") {
        if (!form.college || !form.department || !form.course || !form.section || !form.gender) {
          return "Fill student details";
        }
      }
    }

    if (mode === "forgot" && step === 2) {
      if (!form.newPassword) return "Enter new password";
    }

    return null;
  };

  // 🔥 SEND OTP (STRICT VALIDATION)
  const sendOtp = async () => {

    const error = validate();
    if (error) {
      setMessage({ text: error, type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "Sending OTP...", type: "info" });

    const url =
      userType === "admin"
        ? "http://localhost:5000/api/auth/send-otp"
        : "http://localhost:5000/api/student/send-otp";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          mode: mode
        })
      });

      const data = await res.json();

      setMessage({
        text: data.message,
        type: data.message.includes("success") ? "success" : "error"
      });

      if (data.message === "OTP sent successfully") {
        setStep(2);
      }

    } catch {
      setMessage({ text: "OTP failed", type: "error" });
    }

    setLoading(false);
  };

  // 🔥 FINAL LOGIN FIX (IMPORTANT)
  // 🔥 ONLY REPLACE HANDLE SUBMIT FUNCTION

const handleSubmit = async () => {

  if (loading) return;

  const error = validate();
  if (error) {
    setMessage({ text: error, type: "error" });
    return;
  }

  setLoading(true);
  setMessage({ text: "Processing...", type: "info" });

  let url = "";

  if (userType === "admin") {
    if (mode === "login") url = "/api/auth/login";
    if (mode === "register") url = "/api/auth/register";
    if (mode === "forgot") url = "/api/auth/reset";
  } else {
    if (mode === "login") url = "/api/student/login";
    if (mode === "register") url = "/api/student/register";
    if (mode === "forgot") url = "/api/student/reset";
  }

  try {
    const res = await fetch("http://localhost:5000" + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    setMessage({
      text: data.message,
      type: data.message.toLowerCase().includes("success") ? "success" : "error"
    });

    // ✅ FINAL FIX
    if (mode === "login" && data.message === "Login success") {

      // 🔥 CLEAN START
      localStorage.clear();

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userType", userType);
      localStorage.setItem("userName", data.user?.name || "");

      if (userType === "student") {
        localStorage.setItem("studentData", JSON.stringify(data.user));

        setTimeout(() => {
          window.location.replace("/student-dashboard");
        }, 1200);

      } else {
        setTimeout(() => {
          window.location.replace("/");
        }, 1200);
      }
    }

    if (mode === "register" && data.message.includes("success")) {
      setTimeout(() => setMode("login"), 1000);
    }

  } catch {
    setMessage({ text: "Server error", type: "error" });
  }

  setLoading(false);
};

  return (
    <div key={key} style={wrapper}>
      <div style={card}>

        {/* SWITCH */}
        <div style={switchBox}>
          <button style={userType === "admin" ? activeBtn : btn}
            onClick={() => { setUserType("admin"); setKey(prev => prev + 1); }}>
            Admin
          </button>

          <button style={userType === "student" ? activeBtn : btn}
            onClick={() => { setUserType("student"); setKey(prev => prev + 1); }}>
            Student
          </button>
        </div>

        <h2>{mode === "login" ? "Login" : mode === "register" ? "Create Account" : "Reset Password"}</h2>

        {/* MESSAGE */}
        {message.text && (
          <div style={{
            background:
              message.type === "success" ? "#dcfce7" :
              message.type === "error" ? "#fee2e2" : "#e2e8f0",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "10px"
          }}>
            {message.text}
          </div>
        )}

        {/* REGISTER */}
        {mode === "register" && step === 1 && (
          <>
            <input name="name" placeholder="Name *" onChange={handleChange} style={input} />

            {userType === "admin" && (
              <>
                <input name="phone" placeholder="Phone *" onChange={handleChange} style={input} />
                <input name="address" placeholder="Address *" onChange={handleChange} style={input} />
                <input name="college" placeholder="College *" onChange={handleChange} style={input} />
              </>
            )}

            {userType === "student" && (
              <>
                <input name="college" placeholder="College *" onChange={handleChange} style={input} />
                <input name="department" placeholder="Department *" onChange={handleChange} style={input} />
                <input name="course" placeholder="Course *" onChange={handleChange} style={input} />
                <input name="section" placeholder="Section *" onChange={handleChange} style={input} />

                <select name="gender" onChange={handleChange} style={input}>
                  <option value="">Select Gender *</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </>
            )}

            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password *"
                onChange={handleChange}
                style={input} />
              <span style={eye} onClick={() => setShowPassword(!showPassword)}>👁</span>
            </div>
          </>
        )}

        <input name="email" placeholder="Email *" onChange={handleChange} style={input} />

        {mode === "login" && (
          <div style={{ position: "relative" }}>
            <input type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password *"
              onChange={handleChange}
              style={input} />
            <span style={eye} onClick={() => setShowPassword(!showPassword)}>👁</span>
          </div>
        )}

        {(mode !== "login" && step === 2) && (
          <>
            <input name="otp" placeholder="Enter OTP *" onChange={handleChange} style={input} />
            {mode === "forgot" && (
              <input name="newPassword" placeholder="New Password *" onChange={handleChange} style={input} />
            )}
          </>
        )}

        {mode === "login" && (
          <button onClick={handleSubmit} style={mainBtn}>Login</button>
        )}

        {(mode !== "login" && step === 1) && (
          <button onClick={sendOtp} style={mainBtn}>Send OTP</button>
        )}

        {(mode !== "login" && step === 2) && (
          <button onClick={handleSubmit} style={mainBtn}>Submit</button>
        )}

        {mode === "login" && (
          <>
            <p style={link} onClick={() => setMode("forgot")}>Forgot Password?</p>
            <p style={link} onClick={() => setMode("register")}>Create Account</p>
          </>
        )}

        {mode !== "login" && (
          <p style={link} onClick={() => setMode("login")}>Back to Login</p>
        )}

      </div>
    </div>
  );
}

const eye = { position: "absolute", right: "10px", top: "12px", cursor: "pointer" };
const wrapper = { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg,#1e293b,#2563eb)" };
const card = { background: "white", padding: "30px", borderRadius: "15px", width: "350px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" };
const input = { width: "100%", padding: "12px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ccc" };
const mainBtn = { width: "100%", padding: "12px", marginTop: "10px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" };
const switchBox = { display: "flex", marginBottom: "15px" };
const btn = { flex: 1, padding: "10px", background: "#e2e8f0", border: "none" };
const activeBtn = { flex: 1, padding: "10px", background: "#2563eb", color: "white", border: "none" };
const link = { marginTop: "10px", color: "#2563eb", cursor: "pointer", fontSize: "14px" };

export default Login;