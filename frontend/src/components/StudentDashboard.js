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

  // 🔥 FETCH DATA
  useEffect(() => {
    fetch("http://localhost:5000/api/departments").then(res => res.json()).then(setDepartments);
    fetch("http://localhost:5000/api/courses").then(res => res.json()).then(setCourses);
    fetch("http://localhost:5000/api/sections").then(res => res.json()).then(setSections);
  }, []);

  // 🔥 FILTER
  const filteredCourses = courses.filter(c =>
    !selectedDept || c.department?.name === selectedDept
  );

  const filteredSections = sections.filter(s =>
    !selectedCourse || s.course?.name === selectedCourse
  );

  // 🔥 FETCH TIMETABLE
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
      setMessage(filtered.length ? "✅ Loaded" : "❌ No timetable");

    } catch {
      setMessage("❌ Error");
    }
  };

  // 🔥 DAYS
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // 🔥 SORTED TIMES
  const times = [
    ...new Set(
      timetable.map(t => `${t.timeslot?.startTime}-${t.timeslot?.endTime}`)
    )
  ].sort((a, b) => {
    const getStart = (t) => t.split("-")[0];
    return getStart(a).localeCompare(getStart(b));
  });

  // 🔥 GRID
  const grid = {};
  timetable.forEach(item => {
    const day = item.timeslot?.day;
    const time = `${item.timeslot?.startTime}-${item.timeslot?.endTime}`;

    if (!grid[day]) grid[day] = {};
    grid[day][time] = item;
  });

  // 🎨 COLOR
  const getColor = (type) => {
    if (type === "lab") return "#fef3c7";
    if (type === "theory") return "#dbeafe";
    return "#f1f5f9";
  };

  return (
    <div style={{ padding: "20px" }}>

      {/* HEADER */}
      <div style={header}>
        <h2>🎓 Student Dashboard</h2>
        <p>Welcome, {studentName || "Student"} 👋</p>
      </div>

      {/* MESSAGE */}
      {message && <div style={msg}>{message}</div>}

      {/* FILTER */}
      <div style={card}>

        <select value={selectedDept} onChange={(e)=>setSelectedDept(e.target.value)} style={input}>
          <option value="">Select Department</option>
          {departments.map(d=> <option key={d._id}>{d.name}</option>)}
        </select>

        <select value={selectedCourse} onChange={(e)=>setSelectedCourse(e.target.value)} style={input}>
          <option value="">Select Course</option>
          {filteredCourses.map(c=> <option key={c._id}>{c.name}</option>)}
        </select>

        <select value={selectedSection} onChange={(e)=>setSelectedSection(e.target.value)} style={input}>
          <option value="">Select Section</option>
          {filteredSections.map(s=> <option key={s._id}>{s.name}</option>)}
        </select>

        <button onClick={fetchTimetable} style={btn}>
          🚀 View Timetable
        </button>

        {/* PRINT */}
        <button onClick={() => window.print()} style={printBtn}>
          🖨 Print Timetable
        </button>

      </div>

      {/* 🔥 GRID TABLE */}
      {timetable.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead>
              <tr style={{ background: "#1e40af", color: "white" }}>
                <th style={th}>DAY / TIME</th>
                {times.map((t, i) => (
                  <th key={i} style={th}>{t}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {days.map((day, i) => (
                <tr key={i}>
                  <td style={{ ...td, fontWeight: "bold", background: "#f1f5f9" }}>
                    {day}
                  </td>

                  {times.map((time, j) => {
                    const item = grid[day]?.[time];

                    if (!item) {
                      return (
                        <td key={j} style={{ ...td, background: "#f1f5f9" }}>
                          FREE
                        </td>
                      );
                    }

                    return (
                      <td
                        key={j}
                        style={{
                          ...td,
                          background: getColor(item.subject?.type)
                        }}
                      >
                        <b>{item.subject?.name}</b><br />

                        👨‍🏫 {
                          item.teacher && item.teacher.length > 0
                            ? item.teacher.map(t => t.name).join(", ")
                            : "N/A"
                        }<br />

                        🏫 {item.room?.name || "N/A"}<br />

                        📚 {
                          item.sections?.map(s => s.name).join(", ")
                        }
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

// 🎨 STYLES
const header = {
  background: "#2563eb",
  color: "white",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "20px"
};

const msg = {
  background: "#dcfce7",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px"
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "20px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const input = {
  width: "100%",
  marginBottom: "10px",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const btn = {
  width: "100%",
  padding: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  marginBottom: "10px",
  borderRadius: "6px"
};

const printBtn = {
  width: "100%",
  padding: "10px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "6px"
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white"
};

const th = {
  border: "1px solid #ccc",
  padding: "10px"
};

const td = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "center"
};

export default StudentDashboard;