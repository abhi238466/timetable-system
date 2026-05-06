import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Landing.css";
import {
  FaUserShield,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaRocket,
  FaPlay,
  FaUniversity,
  FaCalendarCheck,
  FaBullseye,
  FaClock,
  FaBuilding,
  FaUsers,
  FaBookOpen,
  FaDoorOpen,
  FaLayerGroup,
  FaChartBar,
  FaCheckCircle,
  FaRobot,
  FaBell,
  FaSearch,
  FaCog,
  FaHeart,
  FaShieldAlt,   // ✅ ADD THIS
  FaSchool,      // ✅ ADD THIS
  FaDatabase
} from "react-icons/fa";

function LandingPage() {
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="landing-pro">
      <nav className="pro-navbar">
        <div className="pro-logo">
          <span>🎓</span>
          Automated Timetable <b>System</b>
        </div>

        <div className="pro-menu">
          <a href="#home">Home</a>
          <a href="#modules">Modules</a>
          <a href="#workflow">Workflow</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <div className="pro-actions">
          <button className="admin-btn" onClick={() => navigate("/login/admin")}>
            <FaUserShield /> Admin Login
          </button>
          <button className="student-btn" onClick={() => navigate("/login/student")}>
            <FaUserGraduate /> Student Login
          </button>
          <button className="teacher-btn" onClick={() => navigate("/login/teacher")}>
            <FaChalkboardTeacher /> Teacher Login
          </button>
        </div>
      </nav>

      <section id="home" className="pro-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <FaRocket /> MCA Final Project • Timetable Automation
          </div>

          <h1>
            Smart Classroom<br />
            Timetable & Allocation<br />
            <span>Management System</span>
          </h1>

          <p>
            A professional web-based system to manage teachers, students, rooms,
            sections and generate conflict-free timetables using smart scheduling logic.
          </p>

          <div className="hero-buttons">
            <button className="get-btn" onClick={() => navigate("/login/admin")}>
              <FaRocket /> Get Started
            </button>
            <button className="demo-btn" onClick={() => setDemoOpen(true)}>
              <FaPlay /> Live Demo
            </button>
          </div>

          <div className="hero-stats">
            <div><FaUniversity /><h3>500+</h3><p>Institutions</p></div>
            <div><FaCalendarCheck /><h3>1M+</h3><p>Schedules Generated</p></div>
            <div><FaBullseye /><h3>98%</h3><p>Accuracy Rate</p></div>
            <div><FaClock /><h3>24/7</h3><p>System Access</p></div>
          </div>
        </div>

        <div className="dashboard-preview">
          <div className="preview-shell">
            <aside className="preview-sidebar">
              <div className="preview-brand">🎓 Automated Timetable System</div>
              <p className="side-active">Dashboard</p>
              <p>Departments</p>
              <p>Teachers</p>
              <p>Students</p>
              <p>Subjects</p>
              <p>Rooms</p>
              <p>Sections</p>
              <p>Time Slots</p>
              <p>Timetable</p>
              <p>Reports</p>
              <p>Settings</p>
            </aside>

            <main className="preview-main">
              <div className="preview-top">
                <FaSearch />
                <input placeholder="Search anything..." />
                <FaBell />
                <div className="user-dot">A</div>
              </div>

              <h2>Dashboard</h2>

              <div className="preview-cards">
                <div><FaBuilding /><p>Departments</p><h3>12</h3></div>
                <div><FaChalkboardTeacher /><p>Teachers</p><h3>48</h3></div>
                <div><FaUserGraduate /><p>Students</p><h3>842</h3></div>
                <div><FaDoorOpen /><p>Rooms</p><h3>28</h3></div>
              </div>

              <div className="preview-bottom">
                <div className="chart-box">
                  <h3>Timetable Overview</h3>
                  <div className="bars">
                    <span style={{ height: "42%" }}></span>
                    <span style={{ height: "66%" }}></span>
                    <span style={{ height: "78%" }}></span>
                    <span style={{ height: "56%" }}></span>
                    <span style={{ height: "88%" }}></span>
                  </div>
                </div>

                <div className="recent-box">
                  <h3>Recent Timetables</h3>
                  <p>BCA - Sem 3 <b>Published</b></p>
                  <p>MCA - Sem 1 <b>Published</b></p>
                  <p>B.Sc IT - Sem 2 <b>Published</b></p>
                  <button>View All Timetables</button>
                </div>

                <div className="status-box">
                  <h3>System Status</h3>
                  <div className="circle">98%</div>
                  <p><FaCheckCircle /> Database Connected</p>
                  <p><FaCheckCircle /> Scheduling Engine Active</p>
                  <p><FaCheckCircle /> No Conflicts Found</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>

      <section id="modules" className="modules-pro">
        <div className="module-card admin-module">
          <FaUserShield />
          <h3>Admin Module</h3>
          <p>Manage departments, teachers, subjects, rooms, sections and generate timetable.</p>
          <button onClick={() => navigate("/login/admin")}>Access Admin Panel →</button>
        </div>

        <div className="module-card student-module">
          <FaUserGraduate />
          <h3>Student Module</h3>
          <p>Students can view class timetable, subjects and room details instantly.</p>
          <button onClick={() => navigate("/login/student")}>Access Student Panel →</button>
        </div>

        <div className="module-card teacher-module">
          <FaChalkboardTeacher />
          <h3>Teacher Module</h3>
          <p>Teachers can view assigned lectures, sections and daily classroom schedule.</p>
          <button onClick={() => navigate("/login/teacher")}>Access Teacher Panel →</button>
        </div>

        <div id="workflow" className="workflow-mini">
          <h2>Smart Scheduling Workflow</h2>
          <p>From data input to final timetable in 3 simple steps</p>

          <div className="steps">
            <div><b>1</b><h4>Add Master Data</h4><p>Admin adds departments, courses, teachers, rooms and timeslots.</p></div>
            <div><b>2</b><h4>Run Generator</h4><p>System checks availability and avoids room, teacher and section conflicts.</p></div>
            <div><b>3</b><h4>Publish Timetable</h4><p>Final timetable becomes available to admin, students and teachers.</p></div>
          </div>
        </div>

        <div id="features" className="feature-mini">
          <h2>Powerful Features</h2>

          <div className="feature-small-grid">
            <div><FaRobot /><h4>Smart Scheduling</h4><p>AI based timetable generation</p></div>
            <div><FaShieldAlt /><h4>Conflict Detection</h4><p>Automatic clash resolution</p></div>
            <div><FaDoorOpen /><h4>Room Management</h4><p>Efficient room allocation</p></div>
            <div><FaChartBar /><h4>Reports & Analytics</h4><p>Detailed insights</p></div>
            <div><FaUsers /><h4>Multi User Access</h4><p>Role based secure access</p></div>
            <div><FaClock /><h4>Real-time Updates</h4><p>Live timetable sync</p></div>
          </div>
        </div>
      </section>

      <section id="about" className="project-highlights">
      <div className="highlight-heading">
    <h2>Why Smart Classroom AI?</h2>
    <p>Built with real project modules, smart scheduling logic and role-based access.</p>
  </div>

  <div className="highlight-grid">
    <div>
      <FaRobot />
      <h3>DSA Based Logic</h3>
      <p>Smart timetable generation using conflict checking.</p>
    </div>

    <div>
      <FaShieldAlt />
      <h3>Zero Clash System</h3>
      <p>Avoids teacher, room and section clashes automatically.</p>
    </div>

    <div>
      <FaUsers />
      <h3>Role Based Access</h3>
      <p>Separate modules for admin, student and teacher.</p>
    </div>

    <div>
      <FaDatabase />
      <h3>MongoDB Backend</h3>
      <p>Stores users, rooms, subjects, sections and timetable data.</p>
    </div>
  </div>
</section>

      <footer className="pro-footer">
        <p>© 2026 Smart Classroom AI. All rights reserved.</p>
        <p>Made with <FaHeart /> for Education</p>
      </footer>

      {demoOpen && (
        <div className="demo-overlay">
          <div className="demo-modal">
            <button className="close-demo" onClick={() => setDemoOpen(false)}>×</button>
            <h2>Live Demo Preview</h2>
            <p>Sample generated timetable from the system.</p>

            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Room</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Monday</td><td>10:00 - 11:00</td><td>DSA</td><td>Mr. Sharma</td><td>Lab-1</td></tr>
                <tr><td>Tuesday</td><td>11:00 - 12:00</td><td>DBMS</td><td>Ms. Verma</td><td>Room-204</td></tr>
                <tr><td>Wednesday</td><td>01:00 - 02:00</td><td>OS</td><td>Dr. Singh</td><td>Room-301</td></tr>
              </tbody>
            </table>

            <button onClick={() => navigate("/login/admin")}>Try Admin Login</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Landing.css";
// import {
//   FaUserShield,
//   FaUserGraduate,
//   FaChalkboardTeacher,
//   FaCalendarAlt,
//   FaChartBar,
//   FaRocket,
//   FaCalendarCheck
// } from "react-icons/fa";

// function LandingPage() {
//   const navigate = useNavigate();
//   const [toast, setToast] = useState("");

//   const showToast = (msg) => {
//     setToast(msg);
//     setTimeout(() => setToast(""), 2500);
//   };

//   return (
//     <div className="landing">

//       {toast && <div className="toast">{toast}</div>}

//       {/* NAVBAR */}
//       <div className="navbar">
//         <div className="logo">🎓 Smart Classroom <span>AI</span></div>

//         <div className="nav-menu">
//           <span className="active">Home</span>
//           <span onClick={() => showToast("⚙️ About page under maintenance")}>
//             About
//           </span>
//         </div>

//         <div className="nav-buttons">
//           <button onClick={() => navigate("/login/admin")}>
//             <FaUserShield /> Admin
//           </button>

//           <button onClick={() => navigate("/login/student")}>
//             <FaUserGraduate /> Student
//           </button>

//           <button onClick={() => navigate("/login/teacher")}>
//   <FaChalkboardTeacher /> Teacher
// </button>
//         </div>
//       </div>

//       {/* HERO */}
//       <section className="hero">

//         <div className="hero-left">

//           <div className="ai-badge">
//             <FaRocket /> AI Powered Technology
//           </div>

//           <h1>
//             Smarter Timetables.<br />
//             Better Classrooms.<br />
//             <span>AI Powered.</span>
//           </h1>

//           <p>
//             Automatic timetable generation, smart classroom allocation
//             and zero conflict scheduling using DSA.
//           </p>

//           <div className="hero-buttons">
//             <button onClick={() => navigate("/login/admin")}>
//               🚀 Get Started
//             </button>

//             <button
//               className="secondary"
//               onClick={() => showToast("🎥 Live Demo under maintenance")}
//             >
//               Live Demo
//             </button>
//           </div>

//           <div className="stats">
//             <div><h3>500+</h3><p>Institutions</p></div>
//             <div><h3>1M+</h3><p>Schedules</p></div>
//             <div><h3>98%</h3><p>Accuracy</p></div>
//             <div><h3>24/7</h3><p>AI</p></div>
//           </div>
//         </div>

//         <div className="hero-right">
//           <FaCalendarCheck className="hero-icon timetable-icon" />

//           <div className="hero-card big-card">
//             <h4>Effortless Timetable Management</h4>
//             <p>
//               Manage classrooms, teachers & scheduling in one smart system with zero conflicts.
//             </p>
//           </div>
//         </div>

//       </section>

//       {/* FEATURES */}
//       <section className="features">

//         <div className="feature" onClick={() => showToast("🚀 Feature coming soon")}>
//           <FaChalkboardTeacher />
//           <h3>Smart Allocation</h3>
//           <p>Auto assign teachers & rooms intelligently</p>
//         </div>

//         <div className="feature" onClick={() => showToast("🚀 Feature coming soon")}>
//           <FaCalendarAlt />
//           <h3>Timetable Automation</h3>
//           <p>Zero-conflict scheduling using greedy + hashmap</p>
//         </div>

//         <div className="feature" onClick={() => showToast("🚀 Feature coming soon")}>
//           <FaChartBar />
//           <h3>Analytics Dashboard</h3>
//           <p>Track insights instantly</p>
//         </div>

//       </section>

//       {/* ✅ FIXED EXTRA SECTION */}
//       <section className="extra">

//         <div className="extra-inner">

//           {/* LEFT */}
//           <div className="extra-left">
//             <FaRocket className="big-rocket" />

//             <h2>AI Powered System</h2>

//             <p>
//               Our system uses smart algorithms to generate conflict-free timetables
//               with optimized classroom allocation.
//             </p>

//             <button onClick={() => showToast("⚙️ Feature under maintenance")}>
//               Explore More
//             </button>
//           </div>

//           {/* RIGHT */}
//           <div className="extra-right">

//             <div className="extra-card">
//               <h4>⚡ Smart Scheduling</h4>
//               <p>Auto-adjust timetable with zero clashes</p>
//             </div>

//             <div className="extra-card">
//               <h4>🏫 Classroom Optimization</h4>
//               <p>Efficient room usage with smart allocation</p>
//             </div>

//             <div className="extra-card">
//               <h4>📊 Real-Time Insights</h4>
//               <p>Track performance & scheduling analytics</p>
//             </div>

//           </div>

//         </div>

//       </section>

//       {/* FOOTER */}
//       <div className="footer">
//         © 2026 Smart Classroom AI • Final MCA Project
//       </div>

//     </div>
//   );
// }

// export default LandingPage;