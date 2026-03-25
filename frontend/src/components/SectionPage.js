import React, { useEffect, useState } from "react";
import "../App.css";

function SectionPage() {

  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [strength, setStrength] = useState("");

  // 🔥 FETCH DATA
  const fetchData = async () => {
    const sec = await fetch("http://localhost:5000/api/sections");
    const courseRes = await fetch("http://localhost:5000/api/courses");

    setSections(await sec.json());
    setCourses(await courseRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 ADD SECTION
  const addSection = async () => {

    if (!name || !course || !strength) {
      alert("Fill all fields");
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
    fetchData();
  };

  return (

    <div className="container">

      <h2>🎓 Section Management</h2>

      {/* FORM */}
      <div className="card">

        <input
          placeholder="Section Name (MCA-A)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />

        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="input"
        >
          <option value="">Select Course</option>
          {courses.map(c => (
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
          className="input"
        />

        <button onClick={addSection}>
          + Add Section
        </button>

      </div>

      {/* LIST */}
      <div className="grid">

        {sections.map(sec => (

          <div key={sec._id} className="card">

            <h3>{sec.name}</h3>

            <p>📘 {sec.course?.name}</p>

            <p>👥 Strength: {sec.strength}</p>

            <button
              className="btn-danger"
              onClick={() => deleteSection(sec._id)}
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>

  );
}

export default SectionPage;