import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import TeacherForm from "./components/TeacherForm";
import SubjectForm from "./components/SubjectForm";
import TimetableGrid from "./components/TimetableGrid";
import GeneratePage from "./components/GeneratePage";
import RoomPage from "./components/RoomPage";
import TimeslotPage from "./components/TimeslotPage";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import SectionPage from "./components/SectionPage";
import CoursePage from "./components/CoursePage";
import DepartmentPage from "./components/DepartmentPage";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true);

  // 🔥 FIXED AUTH LOAD
  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    const type = localStorage.getItem("userType");

    if (status === "true") {
      setIsLoggedIn(true);
      setUserType(type);
    }

    setLoadingAuth(false);
  }, []);

  // 🔥 FIXED LOGOUT
  const logout = () => {
    localStorage.clear();
    window.location.replace("/");
  };

  // 🔥 LOADING FIX (IMPORTANT)
  if (loadingAuth) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  if (!isLoggedIn) {
    return <Login setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <div>

      <Navbar />

      <div style={{ display: "flex" }}>

        {/* ADMIN SIDEBAR */}
        {userType === "admin" && (
          <div style={{
            width: "240px",
            background: "#1e293b",
            color: "white",
            minHeight: "100vh",
            padding: "20px"
          }}>

            <h2>📊 Admin Panel</h2>

            <SidebarLink to="/" label="Dashboard" />
            <SidebarLink to="/departments" label="Departments" />
            <SidebarLink to="/teachers" label="Teachers" />
            <SidebarLink to="/subjects" label="Subjects" />
            <SidebarLink to="/courses" label="Courses" />
            <SidebarLink to="/rooms" label="Rooms" />
            <SidebarLink to="/sections" label="Sections" />
            <SidebarLink to="/timeslots" label="Timeslots" />
            <SidebarLink to="/generate" label="Generate" />
            <SidebarLink to="/timetable" label="Timetable" />

            <button onClick={logout} style={{ marginTop: "20px" }}>
              Logout
            </button>

          </div>
        )}

        {/* STUDENT SIDEBAR */}
        {userType === "student" && (
          <div style={{
            width: "200px",
            background: "#1e293b",
            color: "white",
            minHeight: "100vh",
            padding: "20px"
          }}>
            <h2>🎓 Student</h2>

            <SidebarLink to="/student-dashboard" label="My Timetable" />

            <button onClick={logout} style={{ marginTop: "20px" }}>
              Logout
            </button>
          </div>
        )}

        {/* CONTENT */}
        <div style={{ flex: 1, padding: "30px" }}>

          <Routes>

            {userType === "admin" && (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/teachers" element={<TeacherForm />} />
                <Route path="/subjects" element={<SubjectForm />} />
                <Route path="/courses" element={<CoursePage />} />
                <Route path="/rooms" element={<RoomPage />} />
                <Route path="/sections" element={<SectionPage />} />
                <Route path="/timeslots" element={<TimeslotPage />} />
                <Route path="/generate" element={<GeneratePage />} />
                <Route path="/timetable" element={<TimetableGrid />} />
                <Route path="/departments" element={<DepartmentPage />} />
              </>
            )}

            {userType === "student" && (
              <Route path="/student-dashboard" element={<StudentDashboard />} />
            )}

            <Route path="*" element={<h2>Access Denied ❌</h2>} />

          </Routes>

        </div>

      </div>

    </div>
  );
}

function SidebarLink({ to, label }) {
  return (
    <p>
      <Link to={to} style={{ color: "white", textDecoration: "none" }}>
        {label}
      </Link>
    </p>
  );
}

export default App;