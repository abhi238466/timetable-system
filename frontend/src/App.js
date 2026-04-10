import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";

import DepartmentPage from "./components/DepartmentPage";
import TeacherPage from "./components/TeacherForm";
import SubjectPage from "./components/SubjectForm";
import CoursePage from "./components/CoursePage";
import RoomPage from "./components/RoomPage";
import SectionPage from "./components/SectionPage";
import TimeslotPage from "./components/TimeslotPage";
import GeneratePage from "./components/GeneratePage";
import TimetableGrid from "./components/TimetableGrid";

import Layout from "./components/Layout"; // ✅ IMPORTANT

function App() {
  return (
    <Router>

      <Routes>

        {/* 🔥 LANDING */}
        <Route path="/" element={<LandingPage />} />

        {/* 🔥 LOGIN */}
        <Route path="/login/admin" element={<Login />} />
        <Route path="/login/student" element={<Login />} />
        <Route path="/login/teacher" element={<Login />} />

        {/* 🔥 DASHBOARDS */}
        <Route path="/admin-dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />

        {/* 🔥 ADMIN SIDEBAR ROUTES ONLY */}
        <Route path="/departments" element={<Layout><DepartmentPage /></Layout>} />
        <Route path="/teachers" element={<Layout><TeacherPage /></Layout>} />
        <Route path="/subjects" element={<Layout><SubjectPage /></Layout>} />
        <Route path="/courses" element={<Layout><CoursePage /></Layout>} />
        <Route path="/rooms" element={<Layout><RoomPage /></Layout>} />
        <Route path="/sections" element={<Layout><SectionPage /></Layout>} />
        <Route path="/timeslots" element={<Layout><TimeslotPage /></Layout>} />
        <Route path="/generate" element={<Layout><GeneratePage /></Layout>} />
        <Route path="/timetable" element={<Layout><TimetableGrid /></Layout>} />

      </Routes>

    </Router>
  );
}

export default App;


// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import LandingPage from "./pages/LandingPage";
// import Login from "./components/Login";
// import Dashboard from "./components/Dashboard";

// // 🔥 ADD THESE (NEW)
// import StudentDashboard from "./components/StudentDashboard";
// import TeacherDashboard from "./components/TeacherDashboard";

// import DepartmentPage from "./components/DepartmentPage";
// import TeacherPage from "./components/TeacherForm";
// import SubjectPage from "./components/SubjectForm";
// import CoursePage from "./components/CoursePage";
// import RoomPage from "./components/RoomPage";
// import SectionPage from "./components/SectionPage";
// import TimeslotPage from "./components/TimeslotPage";
// import GeneratePage from "./components/GeneratePage";
// import TimetableView from "./components/TimetableView";
// import TimetableGrid from "./components/TimetableGrid";

// function App() {
//   return (
//     <Router>

//       <Routes>

//         {/* 🔥 LANDING */}
//         <Route path="/" element={<LandingPage />} />

//         {/* 🔥 LOGIN ROUTES (FIXED) */}
//         <Route path="/login/admin" element={<Login />} />
//         <Route path="/login/student" element={<Login />} />
//         <Route path="/login/teacher" element={<Login />} />

//         {/* 🔥 DASHBOARDS */}
//         <Route path="/admin-dashboard" element={<Dashboard />} />
//         <Route path="/student-dashboard" element={<StudentDashboard />} />
//         <Route path="/teacher-dashboard" element={<TeacherDashboard />} />

//         {/* 🔥 SIDEBAR ROUTES (AS IT IS) */}
//         <Route path="/departments" element={<DepartmentPage />} />
//         <Route path="/teachers" element={<TeacherPage />} />
//         <Route path="/subjects" element={<SubjectPage />} />
//         <Route path="/courses" element={<CoursePage />} />
//         <Route path="/rooms" element={<RoomPage />} />
//         <Route path="/sections" element={<SectionPage />} />
//         <Route path="/timeslots" element={<TimeslotPage />} />
//         <Route path="/generate" element={<GeneratePage />} />
//         <Route path="/timetable" element={<TimetableGrid />} />

//       </Routes>

//     </Router>
//   );
// }

// export default App;