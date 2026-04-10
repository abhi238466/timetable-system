import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

function Layout({ children }) {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  const savedPhoto = localStorage.getItem("profilePhoto");

  const fileInputRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    navigate("/");
  };

  const goHome = () => {
    navigate("/");
  };

  // 🔥 PHOTO UPLOAD
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("profilePhoto", reader.result);
      window.location.reload(); // refresh to show image
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>

      {/* TOPBAR */}
      <div className="topbar">
        <span onClick={() => setOpen(!open)}>☰</span>
        <h3>Smart Timetable System</h3>
      </div>

      {/* SIDEBAR */}
      <div className={`sidebar ${open ? "show" : ""}`}>

        {/* PROFILE */}
        <div className="profile">

          <div className="photoBox" onClick={() => fileInputRef.current.click()}>
            <img
              src={
                savedPhoto ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="profile"
            />
            <div className="uploadIcon">📷</div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handlePhotoChange}
          />

          <h4>{name || "User"}</h4>
          <p>{email || ""}</p>
        </div>

        {/* MENU */}
        <Link to="/admin-dashboard">🏠 Dashboard</Link>
        <Link to="/departments">🏢 Departments</Link>
        <Link to="/teachers">👨‍🏫 Teachers</Link>
        <Link to="/subjects">📚 Subjects</Link>
        <Link to="/courses">🎓 Courses</Link>
        <Link to="/rooms">🏫 Rooms</Link>
        <Link to="/sections">📂 Sections</Link>
        <Link to="/timeslots">⏰ Timeslots</Link>
        <Link to="/generate">⚙️ Generate</Link>
        <Link to="/timetable">📅 Timetable</Link>

        <button className="homeBtn" onClick={goHome}>
          🏠 Home
        </button>

        <button className="logoutBtn" onClick={handleLogout}>
          🚪 Logout
        </button>

      </div>

      {/* OVERLAY */}
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      {/* MAIN */}
      <div className="main">
        {children}
      </div>

      {/* CSS */}
      <style>{`

      .topbar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 60px;
        background: linear-gradient(90deg,#0f172a,#1e293b);
        color: white;
        display: flex;
        align-items: center;
        padding: 0 20px;
        z-index: 1000;
      }

      .topbar span {
        font-size: 22px;
        cursor: pointer;
        margin-right: 15px;
      }

      .sidebar {
        position: fixed;
        top: 60px;
        left: -260px;
        width: 260px;
        height: calc(100% - 60px);
        background: linear-gradient(180deg,#0f172a,#020617);
        color: white;
        padding: 15px;
        transition: 0.3s;
        z-index: 1100;
        overflow-y: auto;
      }

      .sidebar.show {
        left: 0;
      }

      .profile {
        text-align: center;
        margin-bottom: 20px;
      }

      /* 🔥 PHOTO BOX */
      .photoBox {
        position: relative;
        width: 80px;
        height: 80px;
        margin: auto;
        cursor: pointer;
      }

      .photoBox img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 3px solid #6366f1;
        object-fit: cover;
        transition: 0.3s;
      }

      /* 🔥 HOVER EFFECT */
      .photoBox:hover img {
        transform: scale(1.05);
        box-shadow: 0 0 10px #6366f1;
      }

      /* 🔥 CAMERA ICON */
      .uploadIcon {
        position: absolute;
        bottom: -5px;
        right: -5px;
        background: #6366f1;
        color: white;
        border-radius: 50%;
        padding: 5px;
        font-size: 12px;
      }

      .profile h4 {
        margin: 10px 0 3px;
      }

      .profile p {
        font-size: 12px;
        color: #cbd5f5;
      }

      .sidebar a {
        display: block;
        padding: 10px;
        margin: 5px 0;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        transition: 0.2s;
      }

      .sidebar a:hover {
        background: #1e293b;
        transform: translateX(5px);
      }

      .homeBtn {
        margin-top: 15px;
        width: 100%;
        padding: 10px;
        background: #22c55e;
        border: none;
        color: white;
        border-radius: 8px;
        cursor: pointer;
      }

      .logoutBtn {
        margin-top: 10px;
        width: 100%;
        padding: 10px;
        background: #ef4444;
        border: none;
        color: white;
        border-radius: 8px;
        cursor: pointer;
      }

      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.3);
        z-index: 1000;
      }

      .main {
        margin-top: 60px;
        padding: 20px;
      }

      `}</style>

    </div>
  );
}

export default Layout;