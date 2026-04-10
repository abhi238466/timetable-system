import React, { useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

function Dashboard() {

  const navigate = useNavigate();

  // ✅ LOGIN DATA
  const adminName = localStorage.getItem("name") || "Admin";
  const adminEmail = localStorage.getItem("email") || "admin@email.com";

  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);

  // 🔥 FETCH DATA
  const fetchData = async () => {

    const t = await fetch("http://localhost:5000/api/teachers");
    const s = await fetch("http://localhost:5000/api/subjects");
    const r = await fetch("http://localhost:5000/api/rooms");
    const ts = await fetch("http://localhost:5000/api/timeslots");
    const tt = await fetch("http://localhost:5000/api/timetable");

    const teachers = await t.json();
    const subjects = await s.json();
    const rooms = await r.json();
    const timeslots = await ts.json();
    const timetable = await tt.json();

    setStats({
      teachers: teachers.length,
      subjects: subjects.length,
      rooms: rooms.length,
      timeslots: timeslots.length,
      timetable: timetable.length
    });

    setChartData(
      subjects.map(sub => ({
        name: sub.name,
        classes: sub.weeklyFrequency
      }))
    );

    const theory = subjects.filter(s => s.type === "theory").length;
    const lab = subjects.filter(s => s.type === "lab").length;

    setPieData([
      { name: "Theory", value: theory },
      { name: "Lab", value: lab }
    ]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard-main">

      {/* 🔥 HEADER */}
      <h2 style={{ marginBottom: "20px" }}>
        📊 Welcome, {adminName}
      </h2>

      {/* 🔥 STATS */}
      <div className="grid">

        <Card title="Teachers" value={stats.teachers} go={()=>navigate("/teachers")} />
        <Card title="Subjects" value={stats.subjects} go={()=>navigate("/subjects")} />
        <Card title="Rooms" value={stats.rooms} go={()=>navigate("/rooms")} />
        <Card title="Timeslots" value={stats.timeslots} go={()=>navigate("/timeslots")} />
        <Card title="Classes" value={stats.timetable} go={()=>navigate("/timetable")} />

      </div>

      {/* 🔥 CHARTS */}
      <div className="chart-grid">

        <div className="chart-card">
          <h3>📊 Subject Distribution</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="classes" fill="#4f46e5" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>🥧 Theory vs Lab</h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={90} innerRadius={40}>
                <Cell fill="#6366f1" />
                <Cell fill="#f59e0b" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}

function Card({ title, value, go }) {
  return (
    <div className="card-new" onClick={go} style={{ cursor: "pointer" }}>
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}

export default Dashboard;


// import React, { useEffect, useState } from "react";
// import "../App.css";
// import { FaBars, FaSignOutAlt } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell
// } from "recharts";

// function Dashboard() {

//   const navigate = useNavigate();

//   // ✅ LOGIN DATA
//   const adminName = localStorage.getItem("name") || "Admin";
//   const adminEmail = localStorage.getItem("email") || "admin@email.com";

//   const profileKey = `adminProfile_${adminEmail}`;
//   const [profile, setProfile] = useState(localStorage.getItem(profileKey));

//   const [open, setOpen] = useState(false);
//   const [stats, setStats] = useState({});
//   const [chartData, setChartData] = useState([]);
//   const [pieData, setPieData] = useState([]);

//   // 🔥 PROFILE SAVE
//   const handleImage = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onloadend = () => {
//       localStorage.setItem(profileKey, reader.result);
//       setProfile(reader.result);
//     };

//     if (file) reader.readAsDataURL(file);
//   };

//   // 🔥 FETCH DATA
//   const fetchData = async () => {

//     const t = await fetch("http://localhost:5000/api/teachers");
//     const s = await fetch("http://localhost:5000/api/subjects");
//     const r = await fetch("http://localhost:5000/api/rooms");
//     const ts = await fetch("http://localhost:5000/api/timeslots");
//     const tt = await fetch("http://localhost:5000/api/timetable");

//     const teachers = await t.json();
//     const subjects = await s.json();
//     const rooms = await r.json();
//     const timeslots = await ts.json();
//     const timetable = await tt.json();

//     setStats({
//       teachers: teachers.length,
//       subjects: subjects.length,
//       rooms: rooms.length,
//       timeslots: timeslots.length,
//       timetable: timetable.length
//     });

//     setChartData(
//       subjects.map(sub => ({
//         name: sub.name,
//         classes: sub.weeklyFrequency
//       }))
//     );

//     const theory = subjects.filter(s => s.type === "theory").length;
//     const lab = subjects.filter(s => s.type === "lab").length;

//     setPieData([
//       { name: "Theory", value: theory },
//       { name: "Lab", value: lab }
//     ]);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // 🔥 LOGOUT
//   const logout = () => {
//     localStorage.removeItem("name");
//     localStorage.removeItem("email");
//     window.location.href = "/";
//   };

//   return (
//     <div className="dashboard-container">

//       {/* 🔥 OVERLAY */}
//       {open && (
//         <div
//           onClick={() => setOpen(false)}
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             background: "rgba(0,0,0,0.3)",
//             zIndex: 500
//           }}
//         />
//       )}

//       {/* 🔥 TOPBAR */}
//       <div className="topbar">
//         <FaBars onClick={() => setOpen(!open)} className="menu-btn" />
//         <h2>📊 Admin Dashboard</h2>
//       </div>

//       {/* 🔥 SIDEBAR */}
//       <div className={`sidebar ${open ? "show" : ""}`}>

//         <label style={{ textAlign: "center", display: "block" }}>
//           <img
//             src={profile || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
//             className="profile-img"
//             alt="profile"
//           />
//           <input type="file" hidden onChange={handleImage} />
//         </label>

//         <h3>{adminName}</h3>
//         <p className="small-text">{adminEmail}</p>

//         <div className="menu-list">
//           <div onClick={()=>navigate("/admin-dashboard")}>🏠 Dashboard</div>
//           <div onClick={()=>navigate("/departments")}>🏢 Departments</div>
//           <div onClick={()=>navigate("/teachers")}>👨‍🏫 Teachers</div>
//           <div onClick={()=>navigate("/subjects")}>📚 Subjects</div>
//           <div onClick={()=>navigate("/courses")}>🎓 Courses</div>
//           <div onClick={()=>navigate("/rooms")}>🏫 Rooms</div>
//           <div onClick={()=>navigate("/sections")}>📂 Sections</div>
//           <div onClick={()=>navigate("/timeslots")}>⏰ Timeslots</div>
//           <div onClick={()=>navigate("/generate")}>⚙ Generate</div>
//           <div onClick={()=>navigate("/timetable")}>📅 Timetable</div>
//         </div>

//         <button onClick={logout} className="logout-btn">
//           <FaSignOutAlt /> Logout
//         </button>

//       </div>

//       {/* 🔥 MAIN */}
//       <div className="dashboard-main">

//         {/* STATS */}
//         <div className="grid">

//           <Card title="Teachers" value={stats.teachers} go={()=>navigate("/teachers")} />
//           <Card title="Subjects" value={stats.subjects} go={()=>navigate("/subjects")} />
//           <Card title="Rooms" value={stats.rooms} go={()=>navigate("/rooms")} />
//           <Card title="Timeslots" value={stats.timeslots} go={()=>navigate("/timeslots")} />
//           <Card title="Classes" value={stats.timetable} go={()=>navigate("/timetable")} />

//         </div>

//         {/* CHARTS */}
// <div className="chart-grid">

//   <div className="chart-card">
//     <h3>📊 Subject Distribution</h3>

//     <ResponsiveContainer width="100%" height={260}>
//       <BarChart data={chartData}>
//         <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//         <YAxis />
//         <Tooltip />
//         <Bar dataKey="classes" fill="#4f46e5" radius={[6,6,0,0]} />
//       </BarChart>
//     </ResponsiveContainer>
//   </div>

//   <div className="chart-card">
//     <h3>🥧 Theory vs Lab</h3>

//     <ResponsiveContainer width="100%" height={260}>
//       <PieChart>
//         <Pie
//           data={pieData}
//           dataKey="value"
//           outerRadius={90}
//           innerRadius={40}
//           paddingAngle={4}
//         >
//           <Cell fill="#6366f1" />
//           <Cell fill="#f59e0b" />
//         </Pie>
//       </PieChart>
//     </ResponsiveContainer>
//   </div>

// </div>

//       </div>

//     </div>
//   );
// }

// function Card({ title, value, go }) {
//   return (
//     <div className="card-new" onClick={go} style={{ cursor: "pointer" }}>
//       <h3>{title}</h3>
//       <h1>{value}</h1>
//     </div>
//   );
// }

// export default Dashboard;