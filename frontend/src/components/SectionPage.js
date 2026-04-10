import React, { useEffect, useState } from "react";
import "../App.css";

function SectionPage() {

  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [strength, setStrength] = useState("");

  const [search, setSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  const [msg, setMsg] = useState("");
  const [type, setType] = useState("");

  // 🔥 FETCH
  const fetchData = async () => {
    const sec = await fetch("http://localhost:5000/api/sections");
    const courseRes = await fetch("http://localhost:5000/api/courses");

    setSections(await sec.json());
    setCourses(await courseRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 AUTO MESSAGE
  useEffect(() => {
    if (msg) {
      const t = setTimeout(() => setMsg(""), 3000);
      return () => clearTimeout(t);
    }
  }, [msg]);

  // 🔥 ADD
  const addSection = async () => {

    if (!name || !course || !strength) {
      setMsg("Fill all fields ❌");
      setType("error");
      return;
    }

    // 🔥 DUPLICATE CHECK
    const exists = sections.some(
      s =>
        s.name.toLowerCase() === name.toLowerCase() &&
        s.course?._id === course
    );

    if (exists) {
      setMsg("Section already exists in this course ❌");
      setType("error");
      return;
    }

    await fetch("http://localhost:5000/api/sections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        course,
        strength: Number(strength)
      })
    });

    setMsg("Section Added ✅");
    setType("success");

    setName("");
    setCourse("");
    setStrength("");

    fetchData();
  };

  // 🔥 DELETE
  const deleteSection = async (id) => {
    await fetch(`http://localhost:5000/api/sections/${id}`, {
      method: "DELETE"
    });

    setMsg("Deleted ✅");
    setType("success");

    fetchData();
  };

  return (

    <div className="container section-container">

      {/* HEADER */}
      <div className="section-header">
        <h2>🎓 Section Management</h2>
        <p>Manage sections smartly with validation</p>
      </div>

      {/* MESSAGE */}
      {msg && <div className={`section-msg ${type}`}>{msg}</div>}

      {/* FORM */}
      <div className="section-form">

        <input
          placeholder="Section Name (MCA-A)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 🔍 COURSE SEARCH */}
        <input
          placeholder="🔍 Search Course..."
          value={courseSearch}
          onChange={(e) => setCourseSearch(e.target.value)}
        />

        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses
            .filter(c =>
              c.name.toLowerCase().includes(courseSearch.toLowerCase())
            )
            .map(c => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>

        <input
          type="number"
          placeholder="Strength (70)"
          value={strength}
          onChange={(e) => setStrength(e.target.value)}
        />

        <button onClick={addSection}>+ Add Section</button>

      </div>

      {/* 🔍 SEARCH */}
      <input
        className="section-search"
        placeholder="🔍 Search section..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LIST */}
      <div className="section-grid">

        {sections
          .filter(sec =>
            sec.name.toLowerCase().includes(search.toLowerCase())
          )
          .map(sec => (

            <div key={sec._id} className="section-card">

              <h3>{sec.name}</h3>

              <p className="course">📘 {sec.course?.name}</p>

              <p className="strength">👥 {sec.strength} Students</p>

              <button
                className="delete-btn"
                onClick={() => deleteSection(sec._id)}
              >
                Delete
              </button>

            </div>

          ))}

      </div>

      {/* 🔥 CSS */}
      <style>{`

      .section-container {
        padding: 30px;
        background: linear-gradient(135deg,#eef2ff,#f8fafc);
        border-radius: 16px;
      }

      .section-header h2 {
        font-size: 28px;
        font-weight: 700;
        background: linear-gradient(90deg,#4f46e5,#06b6d4);
        -webkit-background-clip: text;
        color: transparent;
      }

      .section-header p {
        color: #64748b;
      }

      .section-msg {
        padding: 12px;
        border-radius: 10px;
        margin: 15px 0;
        color: white;
      }

      .section-msg.success { background:#16a34a; }
      .section-msg.error { background:#dc2626; }

      .section-form {
        background: white;
        padding: 25px;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
      }

      .section-form input,
      .section-form select {
        width: 100%;
        padding: 12px;
        margin: 10px 0;
        border-radius: 10px;
        border: 1px solid #cbd5f5;
      }

      .section-form button {
        background: linear-gradient(135deg,#6366f1,#4f46e5);
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        border: none;
      }

      .section-search {
        width: 100%;
        padding: 12px;
        border-radius: 10px;
        border: 1px solid #cbd5f5;
        margin: 20px 0;
      }

      .section-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(240px,1fr));
        gap: 20px;
      }

      .section-card {
        padding: 20px;
        border-radius: 16px;
        background: linear-gradient(145deg,#ffffff,#eef2ff);
        box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        transition: 0.3s;
      }

      .section-card:hover {
        transform: translateY(-8px) scale(1.03);
      }

      .section-card h3 {
        font-size: 18px;
      }

      .course {
        font-size: 14px;
      }

      .strength {
        font-size: 13px;
        color: #475569;
      }

      .delete-btn {
        margin-top: 12px;
        background: linear-gradient(135deg,#ef4444,#dc2626);
        color: white;
        border: none;
        padding: 8px 14px;
        border-radius: 8px;
      }

      `}</style>

    </div>
  );
}

export default SectionPage;