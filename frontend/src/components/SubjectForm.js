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

  // ✅ CHECKBOX HANDLER
  const handleCheckbox = (id, selected, setter) => {
    if (selected.includes(id)) {
      setter(selected.filter(item => item !== id));
    } else {
      setter([...selected, id]);
    }
  };

  // 🔥 ADD SUBJECT
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

      {/* MESSAGE */}
      {message && (
        <div className="msg-box">{message}</div>
      )}

      {/* FORM */}
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

        {/* 🔥 TEACHERS BOX */}
        <div className="checkbox-container">
          <label className="checkbox-title">👨‍🏫 Select Teachers</label>

          <div className="checkbox-group">
            {teachers.map(t => (
              <label key={t._id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={selectedTeachers.includes(t._id)}
                  onChange={() =>
                    handleCheckbox(t._id, selectedTeachers, setSelectedTeachers)
                  }
                />
                <span>{t.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 🔥 SECTIONS BOX */}
        <div className="checkbox-container">
          <label className="checkbox-title">🎓 Select Sections</label>

          <div className="checkbox-group">
            {sections.map(s => (
              <label key={s._id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={selectedSections.includes(s._id)}
                  onChange={() =>
                    handleCheckbox(s._id, selectedSections, setSelectedSections)
                  }
                />
                <span>{s.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button onClick={addSubject}>Add Subject</button>

      </div>

      {/* LIST */}
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