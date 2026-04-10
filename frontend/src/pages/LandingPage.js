
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";
import {
  FaUserShield,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaChartBar,
  FaRocket,
  FaCalendarCheck
} from "react-icons/fa";

function LandingPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className="landing">

      {toast && <div className="toast">{toast}</div>}

      {/* NAVBAR */}
      <div className="navbar">
        <div className="logo">🎓 Smart Classroom <span>AI</span></div>

        <div className="nav-menu">
          <span className="active">Home</span>
          <span onClick={() => showToast("⚙️ About page under maintenance")}>
            About
          </span>
        </div>

        <div className="nav-buttons">
          <button onClick={() => navigate("/login/admin")}>
            <FaUserShield /> Admin
          </button>

          <button onClick={() => navigate("/login/student")}>
            <FaUserGraduate /> Student
          </button>

          <button onClick={() => navigate("/login/teacher")}>
  <FaChalkboardTeacher /> Teacher
</button>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">

        <div className="hero-left">

          <div className="ai-badge">
            <FaRocket /> AI Powered Technology
          </div>

          <h1>
            Smarter Timetables.<br />
            Better Classrooms.<br />
            <span>AI Powered.</span>
          </h1>

          <p>
            Automatic timetable generation, smart classroom allocation
            and zero conflict scheduling using DSA.
          </p>

          <div className="hero-buttons">
            <button onClick={() => navigate("/login/admin")}>
              🚀 Get Started
            </button>

            <button
              className="secondary"
              onClick={() => showToast("🎥 Live Demo under maintenance")}
            >
              Live Demo
            </button>
          </div>

          <div className="stats">
            <div><h3>500+</h3><p>Institutions</p></div>
            <div><h3>1M+</h3><p>Schedules</p></div>
            <div><h3>98%</h3><p>Accuracy</p></div>
            <div><h3>24/7</h3><p>AI</p></div>
          </div>
        </div>

        <div className="hero-right">
          <FaCalendarCheck className="hero-icon timetable-icon" />

          <div className="hero-card big-card">
            <h4>Effortless Timetable Management</h4>
            <p>
              Manage classrooms, teachers & scheduling in one smart system with zero conflicts.
            </p>
          </div>
        </div>

      </section>

      {/* FEATURES */}
      <section className="features">

        <div className="feature" onClick={() => showToast("🚀 Feature coming soon")}>
          <FaChalkboardTeacher />
          <h3>Smart Allocation</h3>
          <p>Auto assign teachers & rooms intelligently</p>
        </div>

        <div className="feature" onClick={() => showToast("🚀 Feature coming soon")}>
          <FaCalendarAlt />
          <h3>Timetable Automation</h3>
          <p>Zero-conflict scheduling using greedy + hashmap</p>
        </div>

        <div className="feature" onClick={() => showToast("🚀 Feature coming soon")}>
          <FaChartBar />
          <h3>Analytics Dashboard</h3>
          <p>Track insights instantly</p>
        </div>

      </section>

      {/* ✅ FIXED EXTRA SECTION */}
      <section className="extra">

        <div className="extra-inner">

          {/* LEFT */}
          <div className="extra-left">
            <FaRocket className="big-rocket" />

            <h2>AI Powered System</h2>

            <p>
              Our system uses smart algorithms to generate conflict-free timetables
              with optimized classroom allocation.
            </p>

            <button onClick={() => showToast("⚙️ Feature under maintenance")}>
              Explore More
            </button>
          </div>

          {/* RIGHT */}
          <div className="extra-right">

            <div className="extra-card">
              <h4>⚡ Smart Scheduling</h4>
              <p>Auto-adjust timetable with zero clashes</p>
            </div>

            <div className="extra-card">
              <h4>🏫 Classroom Optimization</h4>
              <p>Efficient room usage with smart allocation</p>
            </div>

            <div className="extra-card">
              <h4>📊 Real-Time Insights</h4>
              <p>Track performance & scheduling analytics</p>
            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <div className="footer">
        © 2026 Smart Classroom AI • Final MCA Project
      </div>

    </div>
  );
}

export default LandingPage;