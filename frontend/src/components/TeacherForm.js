import React, { useEffect, useState } from "react";
import "../App.css";

function TeacherForm() {

  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [primaryDept, setPrimaryDept] = useState("");
  const [canTeachDepartments, setCanTeachDepartments] = useState([]);

  const [searchDept, setSearchDept] = useState("");
  const [searchTeach, setSearchTeach] = useState("");
  const [searchTeacherList, setSearchTeacherList] = useState("");

  useEffect(() => {
    fetchTeachers();
    fetchDepartments();
  }, []);

  const fetchTeachers = async () => {
    const res = await fetch("http://localhost:5000/api/teachers");
    const data = await res.json();
    setTeachers(Array.isArray(data) ? data : []);
  };

  const fetchDepartments = async () => {
    const res = await fetch("http://localhost:5000/api/departments");
    const data = await res.json();
    setDepartments(Array.isArray(data) ? data : []);
  };

  const handleCheckboxChange = (id) => {
    if (canTeachDepartments.includes(id)) {
      setCanTeachDepartments(canTeachDepartments.filter(d => d !== id));
    } else {
      setCanTeachDepartments([...canTeachDepartments, id]);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addTeacher = async () => {

    if (!name || !email || !primaryDept) {
      alert("Fill all fields");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Invalid Email ❌");
      return;
    }

    const exists = teachers.some(t => t.email === email);
    if (exists) {
      alert("Email already exists ❌");
      return;
    }

    await fetch("http://localhost:5000/api/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  const deleteTeacher = async (id) => {
    await fetch(`http://localhost:5000/api/teachers/${id}`, {
      method: "DELETE"
    });
    fetchTeachers();
  };

  return (

    <div className="teacher-container">

      {/* 🔥 HEADER FIX */}
      <div className="teacher-header">
        <h2>👨‍🏫 Teacher Management</h2>
        <p>Manage teachers with smart filtering & assignment</p>
      </div>

      {/* 🔥 FORM */}
      <div className="teacher-card">

        <input
          placeholder="Teacher Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PRIMARY SEARCH */}
        <input
          placeholder="Search Department..."
          value={searchDept}
          onChange={(e) => setSearchDept(e.target.value)}
        />

        <select
          value={primaryDept}
          onChange={(e) => setPrimaryDept(e.target.value)}
        >
          <option value="">Select Department</option>
          {departments
            .filter(d => d.name.toLowerCase().includes(searchDept.toLowerCase()))
            .map(d => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
        </select>

        {/* 🔥 DROPDOWN FIX */}
        <details className="dropdown">
          <summary>Can Teach In (Optional)</summary>

          <input
            placeholder="Search..."
            value={searchTeach}
            onChange={(e) => setSearchTeach(e.target.value)}
          />

          <div className="checkbox-grid">
            {departments
              .filter(d => d.name.toLowerCase().includes(searchTeach.toLowerCase()))
              .map(d => (
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

        </details>

        <button onClick={addTeacher}>+ Add Teacher</button>

      </div>

      {/* 🔥 SEARCH LIST */}
      <input
        className="teacher-search"
        placeholder="Search teachers..."
        value={searchTeacherList}
        onChange={(e) => setSearchTeacherList(e.target.value)}
      />

      {/* 🔥 LIST */}
      <div className="teacher-grid">

        {teachers
          .filter(t =>
            t.name.toLowerCase().includes(searchTeacherList.toLowerCase()) ||
            t.email.toLowerCase().includes(searchTeacherList.toLowerCase())
          )
          .map(t => (
            <div key={t._id} className="teacher-box">

              <h3>{t.name}</h3>

              <p><b>Primary:</b> {t.primaryDepartment?.name || "-"}</p>

              <p className="small-text">
                {t.canTeachDepartments?.length > 0
                  ? t.canTeachDepartments.map(d => d.name).join(", ")
                  : "None"}
              </p>

              <p className="small-text">{t.email}</p>

              <button
                className="delete-btn"
                onClick={() => deleteTeacher(t._id)}
              >
                Delete
              </button>

            </div>
          ))}

      </div>

      {/* 🔥 FINAL CSS FIX */}
      <style>{`

      .teacher-container {
        padding: 30px;
        background: #f8fafc;
      }

      /* HEADER FIX */
      .teacher-header h2 {
        font-size: 28px;
        font-weight: 700;
        color: #1e293b;
      }

      .teacher-header p {
        color: #64748b;
        margin-top: 5px;
      }

      /* FORM */
      .teacher-card {
        background: white;
        padding: 25px;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        margin-bottom: 20px;
      }

      .teacher-card input,
      .teacher-card select {
        width: 100%;
        padding: 12px;
        margin: 8px 0;
        border-radius: 10px;
        border: 1px solid #cbd5f5;
      }

      /* DROPDOWN */
      .dropdown summary {
        cursor: pointer;
        font-weight: 600;
        margin: 10px 0;
      }

      /* 🔥 CHECKBOX GRID FIX */
      .checkbox-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px,1fr));
        gap: 10px;
        max-height: 180px;
        overflow-y: auto;
        margin-top: 10px;
      }

      .checkbox-item {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #f1f5f9;
        padding: 8px;
        border-radius: 8px;
        cursor: pointer;
      }

      .checkbox-item input {
        width: 16px;
        height: 16px;
      }

      /* SEARCH */
      .teacher-search {
        width: 100%;
        padding: 12px;
        margin: 15px 0;
        border-radius: 10px;
        border: 1px solid #cbd5f5;
      }

      /* GRID */
      .teacher-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(240px,1fr));
        gap: 20px;
      }

      .teacher-box {
        background: white;
        padding: 20px;
        border-radius: 14px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        text-align: center;
        transition: 0.3s;
      }

      .teacher-box:hover {
        transform: translateY(-6px);
      }

      .delete-btn {
        background: #ef4444;
        color: white;
        border: none;
        padding: 8px 14px;
        border-radius: 8px;
        margin-top: 10px;
      }

      `}</style>

    </div>
  );
}

export default TeacherForm;