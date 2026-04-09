import React, { useEffect, useState } from "react";
import "../App.css";

function TeacherForm() {

  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [primaryDept, setPrimaryDept] = useState("");
  const [canTeachDepartments, setCanTeachDepartments] = useState([]);

  // 🔥 FETCH TEACHERS (SAFE FIX)
  const fetchTeachers = async () => {
    const res = await fetch("http://localhost:5000/api/teachers");
    const data = await res.json();

    // ✅ FIX: ensure array
    setTeachers(Array.isArray(data) ? data : []);
  };

  // 🔥 FETCH DEPARTMENTS
  const fetchDepartments = async () => {
    const res = await fetch("http://localhost:5000/api/departments");
    const data = await res.json();

    setDepartments(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchTeachers();
    fetchDepartments();
  }, []);

  // 🔥 HANDLE CHECKBOX
  const handleCheckboxChange = (id) => {
    if (canTeachDepartments.includes(id)) {
      setCanTeachDepartments(
        canTeachDepartments.filter(d => d !== id)
      );
    } else {
      setCanTeachDepartments([...canTeachDepartments, id]);
    }
  };

  // 🔥 ADD TEACHER
  const addTeacher = async () => {

    if (!name || !email || !primaryDept) {
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
      body: JSON.stringify({
        name,
        email,
        primaryDepartment: primaryDept,
        canTeachDepartments
      })
    });

    setName("");
    setEmail("");
    setPrimaryDept("");
    setCanTeachDepartments([]);

    fetchTeachers();
  };

  // 🔥 DELETE
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
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* 🔥 PRIMARY DEPARTMENT */}
        <div className="label">Primary Department</div>
        <select
          value={primaryDept}
          onChange={(e) => setPrimaryDept(e.target.value)}
        >
          <option value="">Select Department</option>
          {departments.map(d => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* 🔥 OPTIONAL DEPARTMENTS */}
        <div className="label">Can Teach In (Optional)</div>

        <div className="checkbox-group">
          {departments.map(d => (
            <label key={d._id} className="checkbox-item">

              <input
                type="checkbox"
                checked={canTeachDepartments.includes(d._id)}
                onChange={() => handleCheckboxChange(d._id)}
              />

              <span>{d.name}</span>

            </label>
          ))}
        </div>

        <button onClick={addTeacher}>Add Teacher</button>

      </div>

      {/* 🔥 LIST */}
      <div className="grid">

        {!Array.isArray(teachers) || teachers.length === 0 ? (
          <div className="empty">No teachers</div>
        ) : (
          teachers.map(t => (
            <div key={t._id} className="card">

              <h3>{t.name}</h3>

<p>
  <b>Primary:</b> {t.primaryDepartment?.name || "-"}
</p>

{/* 🔥 OPTIONAL DEPARTMENTS SHOW */}
<p className="small-text">
  <b>Other Deparments:</b>{" "}
  {t.canTeachDepartments && t.canTeachDepartments.length > 0
    ? t.canTeachDepartments.map(d => d.name).join(", ")
    : "None"}
</p>

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