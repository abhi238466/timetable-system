import React, { useEffect, useState } from "react";
import "../App.css";

function SubjectForm() {

  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [sections, setSections] = useState([]);

  const [name, setName] = useState("");
  const [type, setType] = useState("theory");
  const [weeklyClasses, setWeeklyClasses] = useState("");

  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);

  const [searchTeacher, setSearchTeacher] = useState("");
  const [searchSection, setSearchSection] = useState("");
  const [searchSubject, setSearchSubject] = useState("");

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  // 🔥 FETCH
  const fetchData = async () => {
    const s = await fetch("http://localhost:5000/api/subjects").then(r => r.json());
    const t = await fetch("http://localhost:5000/api/teachers").then(r => r.json());
    const sec = await fetch("http://localhost:5000/api/sections").then(r => r.json());

    setSubjects(Array.isArray(s) ? s : []);
    setTeachers(Array.isArray(t) ? t : []);
    setSections(Array.isArray(sec) ? sec : []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 MESSAGE AUTO HIDE
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  // 🔥 ADD SUBJECT
  const addSubject = async () => {

    if (!name || !weeklyClasses || selectedTeachers.length === 0 || selectedSections.length === 0) {
      setMsg("Fill all fields ❌");
      setMsgType("error");
      return;
    }

    // 🔥 DUPLICATE CHECK (FULL MATCH ONLY)
    const exists = subjects.some(s =>
      s.name.toLowerCase() === name.toLowerCase() &&
      s.type === type &&
      s.weeklyClasses == weeklyClasses &&
      JSON.stringify(s.teachers?.map(t => t._id).sort()) === JSON.stringify(selectedTeachers.sort()) &&
      JSON.stringify(s.sections?.map(sec => sec._id).sort()) === JSON.stringify(selectedSections.sort())
    );

    if (exists) {
      setMsg("Duplicate subject ❌");
      setMsgType("error");
      return;
    }

    await fetch("http://localhost:5000/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        type,
        weeklyClasses,
        teachers: selectedTeachers,
        sections: selectedSections
      })
    });

    setMsg("Subject Added ✅");
    setMsgType("success");

    // 🔥 RESET FIXED
    setName("");
    setWeeklyClasses("");
    setSelectedTeachers([]);
    setSelectedSections([]);
    setType("theory"); // 🔥 FIX

    fetchData();
  };

  // 🔥 DELETE
  const deleteSubject = async (id) => {
    await fetch(`http://localhost:5000/api/subjects/${id}`, {
      method: "DELETE"
    });
    fetchData();
  };

  return (

    <div className="container subject-container">

      <div className="subject-header">
        <h2>📘 Subject Management</h2>
        <p>Create & manage subjects smartly</p>
      </div>

      {msg && <div className={`msg ${msgType}`}>{msg}</div>}

      {/* FORM */}
      <div className="subject-card">

        <input placeholder="Subject Name" value={name} onChange={e => setName(e.target.value)} />

        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="theory">Theory</option>
          <option value="lab">Lab</option>
        </select>

        <input placeholder="Weekly Classes" value={weeklyClasses} onChange={e => setWeeklyClasses(e.target.value)} />

        {/* 🔥 TEACHERS */}
        <details className="dropdown">
          <summary>👨‍🏫 Select Teachers</summary>

          <input placeholder="🔍 Search Teacher..." value={searchTeacher} onChange={e => setSearchTeacher(e.target.value)} />

          <div className="checkbox-grid">
            {teachers
              .filter(t => t.name.toLowerCase().includes(searchTeacher.toLowerCase()))
              .map(t => (
                <label key={t._id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedTeachers.includes(t._id)}
                    onChange={() =>
                      setSelectedTeachers(prev =>
                        prev.includes(t._id)
                          ? prev.filter(x => x !== t._id)
                          : [...prev, t._id]
                      )
                    }
                  />
                  {t.name}
                </label>
              ))}
          </div>
        </details>

        {/* 🔥 SECTIONS */}
        <details className="dropdown">
          <summary>🎓 Select Sections</summary>

          <input placeholder="🔍 Search Section..." value={searchSection} onChange={e => setSearchSection(e.target.value)} />

          <div className="checkbox-grid">
            {sections
              .filter(s => s.name.toLowerCase().includes(searchSection.toLowerCase()))
              .map(s => (
                <label key={s._id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(s._id)}
                    onChange={() =>
                      setSelectedSections(prev =>
                        prev.includes(s._id)
                          ? prev.filter(x => x !== s._id)
                          : [...prev, s._id]
                      )
                    }
                  />
                  {s.name}
                </label>
              ))}
          </div>
        </details>

        <button onClick={addSubject}>+ Add Subject</button>

      </div>

      {/* 🔥 SEARCH SUBJECT */}
      <input
        className="subject-search"
        placeholder="🔍 Search subject..."
        value={searchSubject}
        onChange={e => setSearchSubject(e.target.value)}
      />

      {/* LIST */}
      <div className="subject-grid">
        {subjects
          .filter(s => s.name.toLowerCase().includes(searchSubject.toLowerCase()))
          .map(s => (
            <div key={s._id} className="subject-box">

              <h3>{s.name}</h3>
              <p>{s.type}</p>
              <p className="small-text">{s.weeklyClasses} classes/week</p>

              <p className="small-text">
                👨‍🏫 {s.teachers?.map(t => t.name).join(", ")}
              </p>

              <p className="small-text">
                🎓 {s.sections?.map(sec => sec.name).join(", ")}
              </p>

              <button className="delete-btn" onClick={() => deleteSubject(s._id)}>
                Delete
              </button>

            </div>
          ))}
      </div>

      {/* 🔥 CSS */}
      <style>{`

      .subject-container {
        padding: 30px;
        background: linear-gradient(135deg,#eef2ff,#f8fafc);
        border-radius: 16px;
      }

      .subject-header h2 {
        font-size: 28px;
        font-weight: 700;
        background: linear-gradient(90deg,#4f46e5,#06b6d4);
        -webkit-background-clip: text;
        color: transparent;
      }

      .msg {
        padding: 12px;
        border-radius: 10px;
        margin-bottom: 15px;
        color: white;
      }

      .msg.success { background: #16a34a; }
      .msg.error { background: #dc2626; }

      .subject-card {
        background: white;
        padding: 25px;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
      }

      .subject-card input, .subject-card select {
        width: 100%;
        padding: 12px;
        margin: 8px 0;
        border-radius: 10px;
        border: 1px solid #cbd5f5;
      }

      .dropdown {
        margin-top: 10px;
        padding: 10px;
        background: #f8fafc;
        border-radius: 10px;
      }

      .checkbox-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill,minmax(180px,1fr));
        gap: 10px;
        max-height: 200px;
        overflow-y: auto;
      }

      .checkbox-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border-radius: 8px;
        background: white;
        white-space: nowrap;
      }

      .subject-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(250px,1fr));
        gap: 20px;
        margin-top: 20px;
      }

      .subject-box {
        padding: 20px;
        border-radius: 14px;
        background: white;
        box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        transition: 0.3s;
      }

      .subject-box:hover {
        transform: translateY(-5px);
      }

      .delete-btn {
        margin-top: 10px;
        background: red;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 8px;
      }

      `}</style>

    </div>
  );
}

export default SubjectForm;