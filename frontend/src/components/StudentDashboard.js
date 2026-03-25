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

  // 🔥 FETCH ALL DATA
  useEffect(() => {
    fetch("http://localhost:5000/api/departments")
      .then(res => res.json())
      .then(data => setDepartments(data));

    fetch("http://localhost:5000/api/courses")
      .then(res => res.json())
      .then(data => setCourses(data));

    fetch("http://localhost:5000/api/sections")
      .then(res => res.json())
      .then(data => setSections(data));
  }, []);

  // 🔥 AUTO HIDE MESSAGE
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 🔥 FILTERED LIST
  const filteredCourses = courses.filter(c =>
    !selectedDept || c.department?.name === selectedDept || c.department === selectedDept
  );

  const filteredSections = sections.filter(s =>
    (!selectedCourse || s.course?.name === selectedCourse || s.course === selectedCourse)
  );

  // 🔥 FETCH TIMETABLE (ONLY MY SECTION)
  const fetchTimetable = async () => {

    if (!selectedDept || !selectedCourse || !selectedSection) {
      setMessage("⚠️ Please select all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/timetable");
      const data = await res.json();

      // 🔥 ONLY MY SECTION FILTER
      const filtered = data.filter(item =>
        item.subject?.sections?.some(sec => sec.name === selectedSection)
      );

      if (filtered.length === 0) {
        setMessage("❌ Timetable not generated yet");
        setTimetable([]);
      } else {
        setMessage("✅ Timetable loaded");
        setTimetable(filtered);
      }

    } catch {
      setMessage("❌ Server error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      {/* HEADER */}
      <div style={{
        background: "linear-gradient(135deg,#2563eb,#1e40af)",
        color: "white",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px"
      }}>
        <h2>🎓 Student Dashboard</h2>
        <p>Welcome, {studentName || "Student"} 👋</p>
      </div>

      {/* MESSAGE */}
      {message && (
        <div style={{
          background: message.includes("❌") ? "#fee2e2" : "#dcfce7",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "10px"
        }}>
          {message}
        </div>
      )}

      {/* FILTER */}
      <div style={card}>

        {/* DEPARTMENT */}
        <select
          value={selectedDept}
          onChange={(e) => {
            setSelectedDept(e.target.value);
            setSelectedCourse("");
            setSelectedSection("");
          }}
          style={input}
        >
          <option value="">🏫 Select Department</option>
          {departments.map(d => (
            <option key={d._id} value={d.name}>{d.name}</option>
          ))}
        </select>

        {/* COURSE */}
        <select
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            setSelectedSection("");
          }}
          style={input}
        >
          <option value="">📘 Select Course</option>
          {filteredCourses.map(c => (
            <option key={c._id} value={c.name}>{c.name}</option>
          ))}
        </select>

        {/* SECTION */}
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          style={input}
        >
          <option value="">📗 Select Section</option>
          {filteredSections.map(s => (
            <option key={s._id} value={s.name}>
              Section {s.name}
            </option>
          ))}
        </select>

        <button onClick={fetchTimetable} style={btn}>
          🚀 View My Timetable
        </button>

      </div>

      {/* TIMETABLE */}
      <div>
        {timetable.length > 0 && (
          <table style={table}>
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
              {timetable.map((item, i) => (
                <tr key={i}>
                  <td>{item.timeslot?.day}</td>
                  <td>
                    {item.timeslot?.startTime} - {item.timeslot?.endTime}
                  </td>
                  <td>{item.subject?.name}</td>
                  <td>{item.teacher?.name}</td>
                  <td>{item.room?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

// STYLES
const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.1)"
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const btn = {
  width: "100%",
  padding: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white"
};

export default StudentDashboard;