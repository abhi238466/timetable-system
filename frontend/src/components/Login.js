import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUniversity, FaBriefcase, FaLayerGroup, FaUsers, FaBook, FaVenusMars } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Toast from "./Toast";

/* ═══════════════════════════════════════════════════════
   REGISTER COMPONENT  (defined here — no separate file)
═══════════════════════════════════════════════════════ */
function Register({ role, goBack }) {
  const [step, setStep]           = useState("form");
  const [show, setShow]           = useState(false);
  const [toastMsg, setToastMsg]   = useState("");
  const [toastType, setToastType] = useState("success");
  const [loading, setLoading]     = useState(false);
  const [otpLoading, setOtpLoad]  = useState(false);
  const [otp, setOtp]             = useState("");

  // Admin fields
  const [adminData, setAdminData] = useState({
    name: "", email: "", password: "",
    phone: "", address: "", college: "",
  });

  // Teacher fields
  const [teacherData, setTeacherData] = useState({
    name: "", email: "", password: "",
    phone: "", experience: "",
  });

  // Student fields — matches backend exactly: name, email, password, college, department, course, section, gender
  const [studentData, setStudentData] = useState({
    name: "", email: "", password: "",
    college: "", department: "", course: "", section: "", gender: "",
  });

  const roleData = {
    admin:   { title: "Admin Registration",   icon: "👨‍💼", text: "Create your admin account"       },
    student: { title: "Student Registration", icon: "🎒",  text: "Join the smart classroom system" },
    teacher: { title: "Teacher Registration", icon: "👩‍🏫", text: "Create your teacher account"     },
  };

  const showMessage = (msg, type = "success") => {
    setToastMsg(msg); setToastType(type);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleAdminChange   = (e) => setAdminData({   ...adminData,   [e.target.name]: e.target.value });
  const handleTeacherChange = (e) => setTeacherData({ ...teacherData, [e.target.name]: e.target.value });
  const handleStudentChange = (e) => setStudentData({ ...studentData, [e.target.name]: e.target.value });

  const getFormData = () => {
    if (role === "admin")   return adminData;
    if (role === "teacher") return teacherData;
    return studentData;
  };

  const validateForm = () => {
    if (role === "admin") {
      const { name, email, password, phone, address, college } = adminData;
      return name && email && password && phone && address && college;
    }
    if (role === "teacher") {
      const { name, email, password, phone, experience } = teacherData;
      return name && email && password && phone && experience;
    }
    // student — matches backend required fields exactly
    const { name, email, password, college, department, course, section, gender } = studentData;
    return name && email && password && college && department && course && section && gender;
  };

  const sendOtp = async () => {
    if (!validateForm()) return showMessage("Fill all fields ⚠️", "error");

    const email = getFormData().email;

    const url =
      role === "admin"   ? "http://localhost:5000/api/auth/send-otp"
    : role === "student" ? "http://localhost:5000/api/student/send-otp"
    :                      "http://localhost:5000/api/teacher-auth/send-otp";

    try {
      setLoading(true);
      showMessage("Sending OTP... ⏳", "info");
      const res = await axios.post(url, { email, mode: "register" });
      if (res.data.message?.toLowerCase().includes("otp sent")) {
        showMessage("OTP sent to your email 📩", "success");
        setStep("otp");
      } else {
        showMessage(res.data.message, "error");
      }
    } catch { showMessage("Failed to send OTP ❌", "error"); }
    finally  { setLoading(false); }
  };

  const handleRegister = async () => {
    if (otp.length < 4) return showMessage("Enter 4-digit OTP ⚠️", "error");

    const url =
      role === "admin"   ? "http://localhost:5000/api/auth/register"
    : role === "student" ? "http://localhost:5000/api/student/register"
    :                      "http://localhost:5000/api/teacher-auth/register";

    try {
      setOtpLoad(true);
      const res = await axios.post(url, { ...getFormData(), otp });
      if (res.data.message?.toLowerCase().includes("success")) {
        showMessage("Account created! ✅", "success");
        setStep("done");
        setTimeout(() => goBack(), 1800);
      } else {
        showMessage(res.data.message, "error");
      }
    } catch { showMessage("Registration failed ❌", "error"); }
    finally  { setOtpLoad(false); }
  };

  const handleOtpInput = (e, i) => {
    const val = e.target.value.replace(/\D/, "");
    const arr = otp.split("");
    arr[i] = val;
    setOtp(arr.join("").slice(0, 4));
    if (val && i < 3) document.getElementById(`ob-${i + 1}`)?.focus();
  };

  const handleOtpKey = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      document.getElementById(`ob-${i - 1}`)?.focus();
    if (e.key === "Enter") handleRegister();
  };

  const handleFormEnter = (e) => {
    if (e.key === "Enter") sendOtp();
  };

  return (
    <div className={`login-container ${role}`}>
      {toastMsg && <Toast message={toastMsg} type={toastType} />}

      <div className="left-panel">
        <div className="hero-badge">🎓 Smart Classroom AI</div>
        <h1>Join the Professional Timetable & Classroom System</h1>
        <p>Register to access your role-based dashboard with secure login, conflict-free scheduling and real-time updates.</p>
        <div className="feature-box">✓ Instant OTP-verified registration</div>
        <div className="feature-box">✓ Role-based access — Admin, Teacher, Student</div>
        <div className="feature-box">✓ Zero-conflict timetable generation</div>
        <div className="feature-box">✓ Secure MongoDB-backed accounts</div>
        <div className="project-tag">MCA Final Project</div>
      </div>

      <div className="login-page-card register-card">
        <div className="school-bg">🏫</div>
        <div className="avatar">{roleData[role].icon}</div>
        <h1 style={{ fontSize: "26px", marginBottom: "6px" }}>{roleData[role].title}</h1>

        {/* ── FORM ── */}
        {step === "form" && (
          <>
            <p className="login-subtitle">{roleData[role].text}</p>

            {/* ── ADMIN FIELDS ── */}
            {role === "admin" && (
              <div className="reg-grid">
                <div className="line-input">
                  <FaUser className="reg-icon" />
                  <input name="name" placeholder="Full Name" value={adminData.name} onChange={handleAdminChange} onKeyDown={handleFormEnter} />
                </div>
                <div className="line-input">
                  <FaEnvelope className="reg-icon" />
                  <input name="email" placeholder="Email Address" value={adminData.email} onChange={handleAdminChange} onKeyDown={handleFormEnter} />
                </div>
                <div className="line-input">
                  <FaLock className="reg-icon" />
                  <input type={show ? "text" : "password"} name="password" placeholder="Create Password" value={adminData.password} onChange={handleAdminChange} onKeyDown={handleFormEnter} />
                  <button type="button" className="eye" onClick={() => setShow(!show)}>
                    {show ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="line-input">
                  <FaPhone className="reg-icon" />
                  <input name="phone" placeholder="Phone Number" value={adminData.phone} onChange={handleAdminChange} onKeyDown={handleFormEnter} />
                </div>
                <div className="line-input">
                  <FaMapMarkerAlt className="reg-icon" />
                  <input name="address" placeholder="Address" value={adminData.address} onChange={handleAdminChange} onKeyDown={handleFormEnter} />
                </div>
                <div className="line-input">
                  <FaUniversity className="reg-icon" />
                  <input name="college" placeholder="College / Institution" value={adminData.college} onChange={handleAdminChange} onKeyDown={handleFormEnter} />
                </div>
              </div>
            )}

            {/* ── TEACHER FIELDS ── */}
            {role === "teacher" && (
              <div className="reg-grid">
                <div className="line-input">
                  <FaUser className="reg-icon" />
                  <input name="name" placeholder="Full Name" value={teacherData.name} onChange={handleTeacherChange} onKeyDown={handleFormEnter} />
                </div>
                <div className="line-input">
                  <FaEnvelope className="reg-icon" />
                  <input name="email" placeholder="Email Address" value={teacherData.email} onChange={handleTeacherChange} onKeyDown={handleFormEnter} />
                </div>
                <div className="line-input">
                  <FaLock className="reg-icon" />
                  <input type={show ? "text" : "password"} name="password" placeholder="Create Password" value={teacherData.password} onChange={handleTeacherChange} onKeyDown={handleFormEnter} />
                  <button type="button" className="eye" onClick={() => setShow(!show)}>
                    {show ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="line-input">
                  <FaPhone className="reg-icon" />
                  <input name="phone" placeholder="Phone Number" value={teacherData.phone} onChange={handleTeacherChange} onKeyDown={handleFormEnter} />
                </div>
                <div className="line-input">
                  <FaBriefcase className="reg-icon" />
                  <input name="experience" placeholder="Years of Experience" value={teacherData.experience} onChange={handleTeacherChange} onKeyDown={handleFormEnter} />
                </div>
              </div>
            )}

            {/* ── STUDENT FIELDS — matches backend: name, email, password, college, department, course, section, gender ── */}
            {role === "student" && (
              <div className="reg-grid">
                <div className="line-input">
                  <FaUser className="reg-icon" />
                  <input name="name" placeholder="Full Name" value={studentData.name} onChange={handleStudentChange} onKeyDown={handleFormEnter} />
                </div>
                <div className="line-input">
                  <FaEnvelope className="reg-icon" />
                  <input name="email" placeholder="Email Address" value={studentData.email} onChange={handleStudentChange} onKeyDown={handleFormEnter} />
                </div>
                <div className="line-input" style={{ gridColumn: "1 / -1" }}>
                  <FaLock className="reg-icon" />
                  <input type={show ? "text" : "password"} name="password" placeholder="Create Password" value={studentData.password} onChange={handleStudentChange} onKeyDown={handleFormEnter} />
                  <button type="button" className="eye" onClick={() => setShow(!show)}>
                    {show ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="line-input">
                  <FaUniversity className="reg-icon" />
                  <input name="college" placeholder="College / Institution" value={studentData.college} onChange={handleStudentChange} onKeyDown={handleFormEnter} />
                </div>
                <div className="line-input">
                  <FaLayerGroup className="reg-icon" />
                  <input name="department" placeholder="Department (e.g. MCA)" value={studentData.department} onChange={handleStudentChange} onKeyDown={handleFormEnter} />
                </div>
                <div className="line-input">
                  <FaBook className="reg-icon" />
                  <input name="course" placeholder="Course (e.g. MCA)" value={studentData.course} onChange={handleStudentChange} onKeyDown={handleFormEnter} />
                </div>
                <div className="line-input">
                  <FaUsers className="reg-icon" />
                  <input name="section" placeholder="Section (e.g. G1)" value={studentData.section} onChange={handleStudentChange} onKeyDown={handleFormEnter} />
                </div>
                <div className="line-input" style={{ gridColumn: "1 / -1" }}>
                  <FaVenusMars className="reg-icon" />
                  <select
                    name="gender"
                    value={studentData.gender}
                    onChange={handleStudentChange}
                    style={{
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      outline: "none",
                      fontSize: "14px",
                      color: studentData.gender ? "inherit" : "#aaa",
                    }}
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            )}

            <button className="login-btn" style={{ marginTop: "6px" }} onClick={sendOtp} disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP & Continue →"}
            </button>
            <p className="signup-text">Already have an account? <span onClick={goBack}>Login here</span></p>
          </>
        )}

        {/* ── OTP ── */}
        {step === "otp" && (
          <>
            <p className="login-subtitle">Enter the OTP sent to <strong>{getFormData().email}</strong></p>
            <div className="otp-sent-badge">
              📩 Check your inbox and enter the <strong>4-digit OTP</strong> below.
            </div>
            <div className="otp-boxes">
              {[...Array(4)].map((_, i) => (
                <input key={i} id={`ob-${i}`} className="otp-box"
                  maxLength={1} value={otp[i] || ""}
                  onChange={(e) => handleOtpInput(e, i)}
                  onKeyDown={(e) => handleOtpKey(e, i)}
                  autoFocus={i === 0}
                />
              ))}
            </div>
            <button className="login-btn" onClick={handleRegister} disabled={otpLoading || otp.length < 4}>
              {otpLoading ? "Verifying..." : "Verify & Create Account ✓"}
            </button>
            <p className="signup-text">Wrong email? <span onClick={() => { setStep("form"); setOtp(""); }}>← Go back</span></p>
          </>
        )}

        {/* ── DONE ── */}
        {step === "done" && (
          <div className="reg-done">
            <span className="reg-done-emoji">🎉</span>
            <h2 className="reg-done-title">Account Created!</h2>
            <p className="reg-done-sub">Redirecting you to login...</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LOGIN COMPONENT  (original — completely unchanged)
═══════════════════════════════════════════════════════ */
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

  const role = location.pathname.includes("admin")
    ? "admin"
    : location.pathname.includes("student")
    ? "student"
    : "teacher";

  const roleData = {
    admin: {
      title: "Admin Login",
      icon: "👨‍💼",
      color: "admin",
      text: "Manage smart timetable system",
    },
    student: {
      title: "Student Login",
      icon: "🎒",
      color: "student",
      text: "Access your class timetable",
    },
    teacher: {
      title: "Teacher Login",
      icon: "👩‍🏫",
      color: "teacher",
      text: "Access your teaching schedule",
    },
  };

  const showMessage = (msg, type = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      if (step === "login") handleLogin();
      else if (step === "email") sendOtp();
      else if (step === "otp") verifyOtp();
      else if (step === "reset") resetPassword();
    }
  };

  const handleLogin = async () => {
    if (!data.email || !data.password) {
      showMessage("Fill all fields ⚠️", "error");
      return;
    }

    try {
      setLoadingLogin(true);

      const url =
        role === "admin"
          ? "http://localhost:5000/api/auth/login"
          : role === "student"
          ? "http://localhost:5000/api/student/login"
          : "http://localhost:5000/api/teacher-auth/login";

      const res = await axios.post(url, data);

      if (res.data.message === "Login success") {
        if (role === "admin") {
          localStorage.setItem("name", res.data.user.name);
          localStorage.setItem("email", res.data.user.email);
        }

        if (role === "student") {
          localStorage.setItem("studentName", res.data.user.name);
          localStorage.setItem("studentEmail", res.data.user.email);
        }

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

  const sendOtp = async () => {
    if (!data.email) return showMessage("Enter email", "error");

    const url =
      role === "admin"
        ? "http://localhost:5000/api/auth/send-otp"
        : role === "student"
        ? "http://localhost:5000/api/student/send-otp"
        : "http://localhost:5000/api/teacher-auth/send-otp";

    try {
      setLoadingOtp(true);
      showMessage("Sending OTP... ⏳", "info");

      const res = await axios.post(url, { email: data.email, mode: "forgot" });

      if (res.data.message.toLowerCase().includes("otp sent")) {
        showMessage("OTP Sent 📩", "success");
        setStep("otp");
      } else {
        showMessage(res.data.message, "error");
      }
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
    const url =
      role === "admin"
        ? "http://localhost:5000/api/auth/reset"
        : role === "student"
        ? "http://localhost:5000/api/student/reset"
        : "http://localhost:5000/api/teacher-auth/reset";

    try {
      const res = await axios.post(url, {
        email: data.email,
        otp,
        newPassword: newPass,
      });

      if (res.data.message.toLowerCase().includes("success")) {
        showMessage(res.data.message, "success");
        setStep("login");
      } else {
        showMessage(res.data.message, "error");
      }
    } catch {
      showMessage("Reset failed ❌", "error");
    }
  };

  if (showRegister) {
    return <Register role={role} goBack={() => setShowRegister(false)} />;
  }

  return (
    <div className={`login-container ${roleData[role].color}`}>
      {toastMsg && <Toast message={toastMsg} type={toastType} />}

      <div className="left-panel">
        <div className="hero-badge">🎓 Smart Classroom AI</div>

        <h1>Professional Timetable & Classroom Allocation System</h1>

        <p>
          A smart role-based platform for Admin, Student and Teacher access with secure login,
          classroom allocation and conflict-free scheduling.
        </p>

        <div className="feature-box">✓ Zero conflict timetable generation</div>
        <div className="feature-box">✓ Admin, Student & Teacher modules</div>
        <div className="feature-box">✓ MongoDB connected backend</div>
        <div className="feature-box">✓ Secure role based authentication</div>

        <div className="project-tag">MCA Final Project</div>
      </div>

      <div className="login-page-card">
        <div className="school-bg">🏫</div>
        <div className="avatar">{roleData[role].icon}</div>

        <h1>{roleData[role].title}</h1>
        <p className="login-subtitle">
          {step === "login" && roleData[role].text}
          {step === "email" && "Enter your registered email"}
          {step === "otp" && "Enter OTP sent to your email"}
          {step === "reset" && "Create your new password"}
        </p>

        {step === "login" && (
          <>
            <div className="line-input">
              <FaUser />
              <input
                name="email"
                placeholder="Username or E-mail"
                onChange={handleChange}
                onKeyDown={handleEnter}
              />
            </div>

            <div className="line-input">
              <FaLock />
              <input
                type={show ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                onKeyDown={handleEnter}
              />
              <button type="button" className="eye" onClick={() => setShow(!show)}>
                {show ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="login-options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <span onClick={() => setStep("email")}>Forgot Password?</span>
            </div>

            <button className="login-btn" onClick={handleLogin} disabled={loadingLogin}>
              {loadingLogin ? "Logging in..." : "Login ✓"}
            </button>

            <p className="signup-text">
              Not a member yet?{" "}
              <span onClick={() => setShowRegister(true)}>Sign up!</span>
            </p>
          </>
        )}

        {step === "email" && (
          <>
            <div className="line-input">
              <FaUser />
              <input
                name="email"
                placeholder="Enter email"
                onChange={handleChange}
                onKeyDown={handleEnter}
              />
            </div>

            <button className="login-btn" onClick={sendOtp} disabled={loadingOtp}>
              {loadingOtp ? "Sending..." : "Send OTP"}
            </button>

            <p className="signup-text">
              <span onClick={() => setStep("login")}>← Back to Login</span>
            </p>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="line-input">
              <FaLock />
              <input
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
                onKeyDown={handleEnter}
              />
            </div>

            <button className="login-btn" onClick={verifyOtp}>Verify OTP</button>
          </>
        )}

        {step === "reset" && (
          <>
            <div className="line-input">
              <FaLock />
              <input
                placeholder="New Password"
                onChange={(e) => setNewPass(e.target.value)}
                onKeyDown={handleEnter}
              />
            </div>

            <button className="login-btn" onClick={resetPassword}>Update Password</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;

// import React, { useState } from "react";
// import axios from "axios";
// import "./Login.css";
// import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";
// import Register from "./Register";
// import Toast from "./Toast";

// function Login() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [show, setShow] = useState(false);
//   const [showRegister, setShowRegister] = useState(false);
//   const [toastMsg, setToastMsg] = useState("");
//   const [toastType, setToastType] = useState("success");
//   const [data, setData] = useState({ email: "", password: "" });
//   const [step, setStep] = useState("login");
//   const [otp, setOtp] = useState("");
//   const [newPass, setNewPass] = useState("");
//   const [loadingOtp, setLoadingOtp] = useState(false);
//   const [loadingLogin, setLoadingLogin] = useState(false);

//   const role = location.pathname.includes("admin")
//     ? "admin"
//     : location.pathname.includes("student")
//     ? "student"
//     : "teacher";

//   const roleData = {
//     admin: {
//       title: "Admin Login",
//       icon: "👨‍💼",
//       color: "admin",
//       text: "Manage smart timetable system",
//     },
//     student: {
//       title: "Student Login",
//       icon: "🎒",
//       color: "student",
//       text: "Access your class timetable",
//     },
//     teacher: {
//       title: "Teacher Login",
//       icon: "👩‍🏫",
//       color: "teacher",
//       text: "Access your teaching schedule",
//     },
//   };

//   const showMessage = (msg, type = "success") => {
//     setToastMsg(msg);
//     setToastType(type);
//     setTimeout(() => setToastMsg(""), 3000);
//   };

//   const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

//   const handleEnter = (e) => {
//     if (e.key === "Enter") {
//       if (step === "login") handleLogin();
//       else if (step === "email") sendOtp();
//       else if (step === "otp") verifyOtp();
//       else if (step === "reset") resetPassword();
//     }
//   };

//   const handleLogin = async () => {
//     if (!data.email || !data.password) {
//       showMessage("Fill all fields ⚠️", "error");
//       return;
//     }

//     try {
//       setLoadingLogin(true);

//       const url =
//         role === "admin"
//           ? "http://localhost:5000/api/auth/login"
//           : role === "student"
//           ? "http://localhost:5000/api/student/login"
//           : "http://localhost:5000/api/teacher-auth/login";

//       const res = await axios.post(url, data);

//       if (res.data.message === "Login success") {
//         if (role === "admin") {
//           localStorage.setItem("name", res.data.user.name);
//           localStorage.setItem("email", res.data.user.email);
//         }

//         if (role === "student") {
//           localStorage.setItem("studentName", res.data.user.name);
//           localStorage.setItem("studentEmail", res.data.user.email);
//         }

//         if (role === "teacher") {
//           localStorage.setItem("teacherName", res.data.user.name);
//           localStorage.setItem("teacherEmail", res.data.user.email);
//         }

//         showMessage("Login success ✅");

//         setTimeout(() => {
//           if (role === "admin") navigate("/admin-dashboard");
//           else if (role === "student") navigate("/student-dashboard");
//           else navigate("/teacher-dashboard");
//         }, 1000);
//       } else {
//         showMessage(res.data.message, "error");
//       }
//     } catch {
//       showMessage("Server error ❌", "error");
//     } finally {
//       setLoadingLogin(false);
//     }
//   };

//   const sendOtp = async () => {
//     if (!data.email) return showMessage("Enter email", "error");

//     const url =
//       role === "admin"
//         ? "http://localhost:5000/api/auth/send-otp"
//         : role === "student"
//         ? "http://localhost:5000/api/student/send-otp"
//         : "http://localhost:5000/api/teacher-auth/send-otp";

//     try {
//       setLoadingOtp(true);
//       showMessage("Sending OTP... ⏳", "info");

//       const res = await axios.post(url, { email: data.email, mode: "forgot" });

//       if (res.data.message.toLowerCase().includes("otp sent")) {
//         showMessage("OTP Sent 📩", "success");
//         setStep("otp");
//       } else {
//         showMessage(res.data.message, "error");
//       }
//     } catch {
//       showMessage("OTP failed ❌", "error");
//     } finally {
//       setLoadingOtp(false);
//     }
//   };

//   const verifyOtp = () => {
//     if (!otp) return showMessage("Enter OTP", "error");
//     setStep("reset");
//   };

//   const resetPassword = async () => {
//     const url =
//       role === "admin"
//         ? "http://localhost:5000/api/auth/reset"
//         : role === "student"
//         ? "http://localhost:5000/api/student/reset"
//         : "http://localhost:5000/api/teacher-auth/reset";

//     try {
//       const res = await axios.post(url, {
//         email: data.email,
//         otp,
//         newPassword: newPass,
//       });

//       if (res.data.message.toLowerCase().includes("success")) {
//         showMessage(res.data.message, "success");
//         setStep("login");
//       } else {
//         showMessage(res.data.message, "error");
//       }
//     } catch {
//       showMessage("Reset failed ❌", "error");
//     }
//   };

//   if (showRegister) {
//     return <Register role={role} goBack={() => setShowRegister(false)} />;
//   }

//   return (
//     <div className={`login-container ${roleData[role].color}`}>
//       {toastMsg && <Toast message={toastMsg} type={toastType} />}

//       <div className="left-panel">
//         <div className="hero-badge">🎓 Smart Classroom AI</div>

//         <h1>Professional Timetable & Classroom Allocation System</h1>

//         <p>
//           A smart role-based platform for Admin, Student and Teacher access with secure login,
//           classroom allocation and conflict-free scheduling.
//         </p>

//         <div className="feature-box">✓ Zero conflict timetable generation</div>
//         <div className="feature-box">✓ Admin, Student & Teacher modules</div>
//         <div className="feature-box">✓ MongoDB connected backend</div>
//         <div className="feature-box">✓ Secure role based authentication</div>

//         <div className="project-tag">MCA Final Project</div>
//       </div>

//       <div className="login-page-card">
//         <div className="school-bg">🏫</div>
//         <div className="avatar">{roleData[role].icon}</div>

//         <h1>{roleData[role].title}</h1>
//         <p className="login-subtitle">
//           {step === "login" && roleData[role].text}
//           {step === "email" && "Enter your registered email"}
//           {step === "otp" && "Enter OTP sent to your email"}
//           {step === "reset" && "Create your new password"}
//         </p>

//         {step === "login" && (
//           <>
//             <div className="line-input">
//               <FaUser />
//               <input
//                 name="email"
//                 placeholder="Username or E-mail"
//                 onChange={handleChange}
//                 onKeyDown={handleEnter}
//               />
//             </div>

//             <div className="line-input">
//               <FaLock />
//               <input
//                 type={show ? "text" : "password"}
//                 name="password"
//                 placeholder="Password"
//                 onChange={handleChange}
//                 onKeyDown={handleEnter}
//               />
//               <button type="button" className="eye" onClick={() => setShow(!show)}>
//                 {show ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>

//             <div className="login-options">
//               <label>
//                 <input type="checkbox" /> Remember me
//               </label>
//               <span onClick={() => setStep("email")}>Forgot Password?</span>
//             </div>

//             <button className="login-btn" onClick={handleLogin} disabled={loadingLogin}>
//               {loadingLogin ? "Logging in..." : "Login ✓"}
//             </button>

//             <p className="signup-text">
//               Not a member yet?{" "}
//               <span onClick={() => setShowRegister(true)}>Sign up!</span>
//             </p>
//           </>
//         )}

//         {step === "email" && (
//           <>
//             <div className="line-input">
//               <FaUser />
//               <input
//                 name="email"
//                 placeholder="Enter email"
//                 onChange={handleChange}
//                 onKeyDown={handleEnter}
//               />
//             </div>

//             <button className="login-btn" onClick={sendOtp} disabled={loadingOtp}>
//               {loadingOtp ? "Sending..." : "Send OTP"}
//             </button>

//             <p className="signup-text">
//               <span onClick={() => setStep("login")}>← Back to Login</span>
//             </p>
//           </>
//         )}

//         {step === "otp" && (
//           <>
//             <div className="line-input">
//               <FaLock />
//               <input
//                 placeholder="Enter OTP"
//                 onChange={(e) => setOtp(e.target.value)}
//                 onKeyDown={handleEnter}
//               />
//             </div>

//             <button className="login-btn" onClick={verifyOtp}>Verify OTP</button>
//           </>
//         )}

//         {step === "reset" && (
//           <>
//             <div className="line-input">
//               <FaLock />
//               <input
//                 placeholder="New Password"
//                 onChange={(e) => setNewPass(e.target.value)}
//                 onKeyDown={handleEnter}
//               />
//             </div>

//             <button className="login-btn" onClick={resetPassword}>Update Password</button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Login;

// import React, { useState } from "react";
// import axios from "axios";
// import "./Login.css";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";
// import Register from "./Register";
// import Toast from "./Toast";

// function Login() {

//   const navigate = useNavigate();
//   const location = useLocation();

//   const [show, setShow] = useState(false);
//   const [showRegister, setShowRegister] = useState(false);

//   const [toastMsg, setToastMsg] = useState("");
//   const [toastType, setToastType] = useState("success");

//   const [data, setData] = useState({ email: "", password: "" });

//   const [step, setStep] = useState("login");
//   const [otp, setOtp] = useState("");
//   const [newPass, setNewPass] = useState("");

//   const [loadingOtp, setLoadingOtp] = useState(false);
//   const [loadingLogin, setLoadingLogin] = useState(false);

//   const showMessage = (msg, type = "success") => {
//     setToastMsg(msg);
//     setToastType(type);
//     setTimeout(() => setToastMsg(""), 3000);
//   };

//   const handleChange = (e) => {
//     setData({ ...data, [e.target.name]: e.target.value });
//   };

//   // 🔥 ENTER KEY HANDLER
//   const handleEnter = (e) => {
//     if (e.key === "Enter") {
//       if (step === "login") handleLogin();
//       else if (step === "email") sendOtp();
//       else if (step === "otp") verifyOtp();
//       else if (step === "reset") resetPassword();
//     }
//   };

//   // 🔥 ROLE DETECT
//   const role = location.pathname.includes("admin")
//     ? "admin"
//     : location.pathname.includes("student")
//     ? "student"
//     : "teacher";

//   // 🔥 LOGIN
//   const handleLogin = async () => {
//     if (!data.email || !data.password) {
//       showMessage("Fill all fields ⚠️", "error");
//       return;
//     }

//     try {
//       setLoadingLogin(true);

//       let url = "";

//       if (role === "admin") {
//         url = "http://localhost:5000/api/auth/login";
//       } else if (role === "student") {
//         url = "http://localhost:5000/api/student/login";
//       } else {
//         url = "http://localhost:5000/api/teacher-auth/login";
//       }

//       const res = await axios.post(url, data);

//       if (res.data.message === "Login success") {

//         if (role === "admin") {
//           localStorage.setItem("name", res.data.user.name);
//           localStorage.setItem("email", res.data.user.email);
//         }

//         if (role === "student") {
//           localStorage.setItem("studentName", res.data.user.name);
//           localStorage.setItem("studentEmail", res.data.user.email);
//         }

//         if (role === "teacher") {
//           localStorage.setItem("teacherName", res.data.user.name);
//           localStorage.setItem("teacherEmail", res.data.user.email);
//         }

//         showMessage("Login success ✅");

//         setTimeout(() => {
//           if (role === "admin") navigate("/admin-dashboard");
//           else if (role === "student") navigate("/student-dashboard");
//           else navigate("/teacher-dashboard");
//         }, 1000);

//       } else {
//         showMessage(res.data.message, "error");
//       }

//     } catch {
//       showMessage("Server error ❌", "error");
//     } finally {
//       setLoadingLogin(false);
//     }
//   };

//   // 🔥 SEND OTP
//   const sendOtp = async () => {

//     if (!data.email) return showMessage("Enter email", "error");

//     let url = "";

//     if (role === "admin") {
//       url = "http://localhost:5000/api/auth/send-otp";
//     } else if (role === "student") {
//       url = "http://localhost:5000/api/student/send-otp";
//     } else {
//       url = "http://localhost:5000/api/teacher-auth/send-otp";
//     }

//     try {
//       setLoadingOtp(true);

//       showMessage("Sending OTP... ⏳", "info");

//       const res = await axios.post(url, {
//         email: data.email,
//         mode: "forgot"
//       });

//       if (res.data.message.toLowerCase().includes("otp sent")) {
//         showMessage("OTP Sent 📩", "success");
//         setStep("otp");
//       } else {
//         showMessage(res.data.message, "error");
//       }

//     } catch {
//       showMessage("OTP failed ❌", "error");
//     } finally {
//       setLoadingOtp(false);
//     }
//   };

//   const verifyOtp = () => {
//     if (!otp) return showMessage("Enter OTP", "error");
//     setStep("reset");
//   };

//   const resetPassword = async () => {

//     let url = "";

//     if (role === "admin") {
//       url = "http://localhost:5000/api/auth/reset";
//     } else if (role === "student") {
//       url = "http://localhost:5000/api/student/reset";
//     } else {
//       url = "http://localhost:5000/api/teacher-auth/reset";
//     }

//     try {
//       const res = await axios.post(url, {
//         email: data.email,
//         otp,
//         newPassword: newPass
//       });

//       if (res.data.message.toLowerCase().includes("success")) {
//         showMessage(res.data.message, "success");
//         setStep("login");
//       } else {
//         showMessage(res.data.message, "error");
//       }

//     } catch {
//       showMessage("Reset failed ❌", "error");
//     }
//   };

//   if (showRegister) {
//     return <Register role={role} goBack={() => setShowRegister(false)} />;
//   }

//   return (
//     <div className="login-container">

//       {toastMsg && <Toast message={toastMsg} type={toastType} />}

//       <div className="login-box">

//         {/* LEFT */}
//         <div className="login-left">
//           <h1>Welcome Back 👋</h1>
//           <p>Smart timetable & classroom system</p>

//           <button onClick={() => setStep("login")}>SIGN IN</button>

//           <button className="outline" onClick={() => setShowRegister(true)}>
//             CREATE ACCOUNT
//           </button>
//         </div>

//         {/* RIGHT */}
//         <div className="login-right">

//           <h2>{role.toUpperCase()} LOGIN</h2>

//           {step === "login" && (
//             <>
//               <input
//                 name="email"
//                 placeholder="Email"
//                 onChange={handleChange}
//                 onKeyDown={handleEnter}
//               />

//               <div className="password-box">
//                 <input
//                   type={show ? "text" : "password"}
//                   name="password"
//                   placeholder="Password"
//                   onChange={handleChange}
//                   onKeyDown={handleEnter}
//                 />
//                 <span onClick={() => setShow(!show)}>
//                   {show ? <FaEyeSlash /> : <FaEye />}
//                 </span>
//               </div>

//               <span
//                 style={{ color: "#2563eb", cursor: "pointer", fontWeight: "500" }}
//                 onClick={() => setStep("email")}
//               >
//                 Forgot password?
//               </span>

//               <button className="main-btn" onClick={handleLogin} disabled={loadingLogin}>
//                 {loadingLogin ? "Logging in..." : "LOGIN"}
//               </button>
//             </>
//           )}

//           {step === "email" && (
//             <>
//               <input
//                 name="email"
//                 placeholder="Email"
//                 onChange={handleChange}
//                 onKeyDown={handleEnter}
//               />

//               <button className="main-btn" onClick={sendOtp} disabled={loadingOtp}>
//                 {loadingOtp ? "Sending..." : "Send OTP"}
//               </button>
//             </>
//           )}

//           {step === "otp" && (
//             <>
//               <input
//                 placeholder="OTP"
//                 onChange={(e) => setOtp(e.target.value)}
//                 onKeyDown={handleEnter}
//               />

//               <button className="main-btn" onClick={verifyOtp}>
//                 Verify OTP
//               </button>
//             </>
//           )}

//           {step === "reset" && (
//             <>
//               <input
//                 placeholder="New Password"
//                 onChange={(e) => setNewPass(e.target.value)}
//                 onKeyDown={handleEnter}
//               />

//               <button className="main-btn" onClick={resetPassword}>
//                 Update Password
//               </button>
//             </>
//           )}

//         </div>

//       </div>
//     </div>
//   );
// }

// export default Login;

