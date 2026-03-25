import React, { useEffect, useState } from "react";
import "../App.css";

function TeacherForm() {

  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");

  const fetchTeachers = async () => {
    const res = await fetch("http://localhost:5000/api/teachers");
    const data = await res.json();
    setTeachers(data);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const addTeacher = async () => {

    if (!name || !department || !email) {
      alert("Fill all fields");
      return;
    }

    const exists = teachers.some(t => t.email === email);
    if (exists) {
      alert("Teacher already exists");
      return;
    }

    await fetch("http://localhost:5000/api/teachers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, department, email })
    });

    setName("");
    setDepartment("");
    setEmail("");

    fetchTeachers();
  };

  const deleteTeacher = async (id) => {
    await fetch(`http://localhost:5000/api/teachers/${id}`, {
      method: "DELETE"
    });
    fetchTeachers();
  };

  return (

    <div className="container">

      <h2>👨‍🏫 Teacher Management</h2>

      <div className="card">

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />

        <input
          placeholder="Course"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="input"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />

        <button onClick={addTeacher}>Add Teacher</button>

      </div>

      <div className="grid">

        {teachers.length === 0 ? (
          <div className="empty">No teachers</div>
        ) : (
          teachers.map(t => (
            <div key={t._id} className="card">

              <h3>{t.name}</h3>
              <p>{t.department}</p>
              <p className="small-text">{t.email}</p>

              <button
                className="btn-danger"
                onClick={() => deleteTeacher(t._id)}
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

export default TeacherForm;