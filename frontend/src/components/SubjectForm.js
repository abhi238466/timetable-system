import React, { useEffect, useState } from "react";
import "../App.css";

function SubjectForm() {

  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [sections, setSections] = useState([]);

  const [name, setName] = useState("");
  const [type, setType] = useState("theory");
  const [weeklyFrequency, setWeeklyFrequency] = useState("");

  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);

  const [message, setMessage] = useState("");

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      const sub = await fetch("http://localhost:5000/api/subjects");
      const teach = await fetch("http://localhost:5000/api/teachers");
      const sec = await fetch("http://localhost:5000/api/sections");

      setSubjects(await sub.json());
      setTeachers(await teach.json());
      setSections(await sec.json());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 MULTI SELECT HANDLER
  const handleMultiSelect = (e, setter) => {
    const values = Array.from(e.target.selectedOptions, option => option.value);
    setter(values);
  };

  // 🔥 ADD SUBJECT (FIXED)
  const addSubject = async () => {

    setMessage("");

    if (!name || !weeklyFrequency) {
      setMessage("❌ Fill all fields");
      return;
    }

    if (selectedTeachers.length === 0) {
      setMessage("❌ Select at least 1 teacher");
      return;
    }

    if (selectedSections.length === 0) {
      setMessage("❌ Select at least 1 section");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          type,
          weeklyFrequency: Number(weeklyFrequency),
          teachers: selectedTeachers,
          sections: selectedSections
        })
      });

      const data = await res.json();

      if (data.error) {
        setMessage("❌ " + data.error);
      } else {
        setMessage("✅ Subject added successfully");

        // RESET
        setName("");
        setType("theory");
        setWeeklyFrequency("");
        setSelectedTeachers([]);
        setSelectedSections([]);

        fetchData();
      }

    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  // 🔥 DELETE
  const deleteSubject = async (id) => {
    await fetch(`http://localhost:5000/api/subjects/${id}`, {
      method: "DELETE"
    });
    fetchData();
  };

  return (

    <div className="container">

      <h2>📚 Subject Management</h2>

      {/* 🔥 MESSAGE */}
      {message && (
        <div className="msg-box">{message}</div>
      )}

      {/* 🔥 FORM */}
      <div className="card">

        <input
          placeholder="Subject Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input"
        >
          <option value="theory">Theory</option>
          <option value="lab">Lab</option>
        </select>

        <input
          type="number"
          placeholder="Weekly Classes"
          value={weeklyFrequency}
          onChange={(e) => setWeeklyFrequency(e.target.value)}
          className="input"
        />

        <label className="small-text">Select Teachers</label>
        <select
          multiple
          value={selectedTeachers}
          onChange={(e) => handleMultiSelect(e, setSelectedTeachers)}
          className="input"
        >
          {teachers.map(t => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>

        <label className="small-text">Select Sections</label>
        <select
          multiple
          value={selectedSections}
          onChange={(e) => handleMultiSelect(e, setSelectedSections)}
          className="input"
        >
          {sections.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        <button onClick={addSubject}>Add Subject</button>

      </div>

      {/* 🔥 LIST */}
      <div className="grid">

        {subjects.length === 0 ? (
          <div className="empty">No subjects available</div>
        ) : (
          subjects.map(sub => (
            <div key={sub._id} className="card">

              <h3>{sub.name}</h3>

              <p>{sub.type}</p>
              <p>{sub.weeklyFrequency} classes/week</p>

              <p className="small-text">
                👨‍🏫 {sub.teachers?.map(t => t.name).join(", ")}
              </p>

              <p className="small-text">
                🎓 {sub.sections?.map(s => s.name).join(", ")}
              </p>

              <button
                className="btn-danger"
                onClick={() => deleteSubject(sub._id)}
              >
                Delete
              </button>

            </div>
          ))
        )}

      </div>

    </div>

  );
}

export default SubjectForm;