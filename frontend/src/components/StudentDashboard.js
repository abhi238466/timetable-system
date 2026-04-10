import React, { useState, useEffect } from "react";

function StudentDashboard() {

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);

  const [selectedDept, setSelectedDept] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [timetable, setTimetable] = useState([]);
  const [message, setMessage] = useState("");

  const studentName = localStorage.getItem("studentName");

  // ✅ AUTO HIDE MESSAGE (3 sec)
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    fetch("http://localhost:5000/api/departments").then(res => res.json()).then(setDepartments);
    fetch("http://localhost:5000/api/courses").then(res => res.json()).then(setCourses);
    fetch("http://localhost:5000/api/sections").then(res => res.json()).then(setSections);
  }, []);

  const filteredCourses = courses.filter(c =>
    !selectedDept || c.department?.name === selectedDept
  );

  const filteredSections = sections.filter(s =>
    !selectedCourse || s.course?.name === selectedCourse
  );

  const fetchTimetable = async () => {
    if (!selectedSection) {
      setMessage("⚠️ Select section");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/timetable`);
      const data = await res.json();

      const filtered = data.filter(item =>
        item.sections?.some(sec => sec.name === selectedSection)
      );

      setTimetable(filtered);
      setMessage(filtered.length ? "✅ Timetable Loaded" : "❌ No timetable found");

    } catch {
      setMessage("❌ Error loading timetable");
    }
  };

  const logout = () => {
    localStorage.removeItem("studentName");
    window.location.href = "/login/student";
  };

  const goHome = () => {
    window.location.href = "/";
  };

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  const times = [...new Set(
    timetable.map(t => `${t.timeslot?.startTime}-${t.timeslot?.endTime}`)
  )];

  const grid = {};
  timetable.forEach(item => {
    const day = item.timeslot?.day;
    const time = `${item.timeslot?.startTime}-${item.timeslot?.endTime}`;
    if (!grid[day]) grid[day] = {};
    grid[day][time] = item;
  });

  const getColor = (type) => {
    if (type === "lab") return "#fef3c7";
    if (type === "theory") return "#dbeafe";
    return "#f1f5f9";
  };

  return (
    <div style={container}>

      {/* HEADER */}
      <div style={header}>
        <div>
          <h2>📅 Smart Timetable Dashboard</h2>
          <p>Welcome, {studentName || "Student"} 👋</p>
        </div>

        {/* ✅ NEW BUTTONS */}
        <div style={{ display:"flex", gap:"10px" }}>
          <button style={homeBtn} onClick={goHome}>🏠 Home</button>
          <button style={logoutBtn} onClick={logout}>🚪 Logout</button>
        </div>
      </div>

      {/* MESSAGE */}
      {message && <div style={msg}>{message}</div>}

      {/* FILTER */}
      <div style={card}>

        <h3>🎯 Select Filters</h3>

        <div style={grid3}>
          <select value={selectedDept} onChange={(e)=>setSelectedDept(e.target.value)} style={input}>
            <option value="">Department</option>
            {departments.map(d=> <option key={d._id}>{d.name}</option>)}
          </select>

          <select value={selectedCourse} onChange={(e)=>setSelectedCourse(e.target.value)} style={input}>
            <option value="">Course</option>
            {filteredCourses.map(c=> <option key={c._id}>{c.name}</option>)}
          </select>

          <select value={selectedSection} onChange={(e)=>setSelectedSection(e.target.value)} style={input}>
            <option value="">Section</option>
            {filteredSections.map(s=> <option key={s._id}>{s.name}</option>)}
          </select>
        </div>

        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button onClick={fetchTimetable} style={btn}>
            🚀 View Timetable
          </button>

          <button onClick={() => window.print()} style={printBtn}>
            🖨 Print
          </button>
        </div>

      </div>

      {/* TABLE */}
      {timetable.length > 0 && (
        <div style={tableWrapper}>
          <table style={table}>
            <thead>
              <tr style={{ background: "#1e3a8a", color: "white" }}>
                <th style={th}>Day / Time</th>
                {times.map((t, i) => <th key={i} style={th}>{t}</th>)}
              </tr>
            </thead>

            <tbody>
              {days.map(day => (
                <tr key={day}>
                  <td style={{ ...td, fontWeight: "bold" }}>{day}</td>

                  {times.map(time => {
                    const item = grid[day]?.[time];

                    return (
                      <td key={time} style={{ ...td, background: getColor(item?.subject?.type) }}>
                        {item ? (
                          <>
                            <b>{item.subject?.name}</b><br/>
                            👨‍🏫 {item.teacher?.map(t => t.name).join(", ")}<br/>
                            🏫 {item.room?.name}<br/>
                            📚 {item.sections?.map(s => s.name).join(", ")}
                          </>
                        ) : "FREE"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
}

/* STYLES */

const container = { padding:"30px", background:"#f1f5f9" };

const header = {
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  background:"linear-gradient(45deg,#4f46e5,#6366f1)",
  color:"white",
  padding:"20px",
  borderRadius:"12px"
};

const msg = {
  background:"#dcfce7",
  padding:"10px",
  marginTop:"10px",
  borderRadius:"8px"
};

const card = {
  background:"white",
  padding:"20px",
  borderRadius:"12px",
  marginTop:"20px"
};

const grid3 = {
  display:"grid",
  gridTemplateColumns:"repeat(3,1fr)",
  gap:"10px"
};

const input = { padding:"10px", borderRadius:"8px" };

const btn = {
  flex:1,
  background:"#6366f1",
  color:"white",
  padding:"10px",
  border:"none",
  borderRadius:"8px"
};

const printBtn = {
  flex:1,
  background:"#16a34a",
  color:"white",
  padding:"10px",
  border:"none",
  borderRadius:"8px"
};

const homeBtn = {
  background:"#22c55e",
  color:"white",
  padding:"8px 12px",
  border:"none",
  borderRadius:"8px"
};

const logoutBtn = {
  background:"#ef4444",
  color:"white",
  padding:"8px 12px",
  border:"none",
  borderRadius:"8px"
};

const tableWrapper = { marginTop:"20px" };
const table = { width:"100%", borderCollapse:"collapse" };
const th = { padding:"10px" };
const td = { padding:"10px", textAlign:"center" };

export default StudentDashboard;