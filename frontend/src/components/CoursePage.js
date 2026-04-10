import React, { useEffect, useState } from "react";
import "../App.css";

function CoursePage() {

  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");

  const [searchDept, setSearchDept] = useState("");
  const [searchCourse, setSearchCourse] = useState("");

  const [msg, setMsg] = useState("");
  const [type, setType] = useState("");

  // 🔥 FETCH
  const fetchData = async () => {
    const c = await fetch("http://localhost:5000/api/courses");
    const d = await fetch("http://localhost:5000/api/departments");

    setCourses(await c.json());
    setDepartments(await d.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 MESSAGE AUTO HIDE
  useEffect(() => {
    if (msg) {
      const t = setTimeout(() => setMsg(""), 3000);
      return () => clearTimeout(t);
    }
  }, [msg]);

  // 🔥 ADD
  const addCourse = async () => {

    if (!name || !department) {
      setMsg("Fill all fields ❌");
      setType("error");
      return;
    }

    // 🔥 DUPLICATE CHECK
    const exists = courses.some(c =>
      c.name.toLowerCase() === name.toLowerCase() &&
      c.department?._id === department
    );

    if (exists) {
      setMsg("Course already exists ❌");
      setType("error");
      return;
    }

    await fetch("http://localhost:5000/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, department })
    });

    setMsg("Course Added ✅");
    setType("success");

    setName("");
    setDepartment("");

    fetchData();
  };

  // 🔥 DELETE
  const deleteCourse = async (id) => {
    await fetch(`http://localhost:5000/api/courses/${id}`, {
      method: "DELETE"
    });

    setMsg("Deleted ✅");
    setType("success");

    fetchData();
  };

  return (

    <div className="container course-container">

      {/* HEADER */}
      <div className="course-header">
        <h2>🎓 Course Management</h2>
        <p>Manage courses with smart control</p>
      </div>

      {/* MESSAGE */}
      {msg && <div className={`course-msg ${type}`}>{msg}</div>}

      {/* FORM */}
      <div className="course-form">

        <input
          placeholder="Course Name (MCA, BCA)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 🔥 SEARCHABLE DEPARTMENT */}
        <div className="course-dropdown">
          <input
            placeholder="🔍 Search Department..."
            value={searchDept}
            onChange={(e) => setSearchDept(e.target.value)}
          />

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
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
        </div>

        <button onClick={addCourse}>+ Add Course</button>

      </div>

      {/* 🔥 SEARCH COURSE */}
      <input
        className="course-search"
        placeholder="🔍 Search course..."
        value={searchCourse}
        onChange={(e) => setSearchCourse(e.target.value)}
      />

      {/* LIST */}
      <div className="course-grid">

        {courses
          .filter(c => c.name.toLowerCase().includes(searchCourse.toLowerCase()))
          .map(course => (

            <div key={course._id} className="course-card">

              <h3>{course.name}</h3>

              <p className="dept">
                🏫 {course.department?.name}
              </p>

              <button
                className="delete-btn"
                onClick={() => deleteCourse(course._id)}
              >
                Delete
              </button>

            </div>

          ))}

      </div>

      {/* 🔥 CSS */}
      <style>{`

      .course-container {
        padding: 30px;
        border-radius: 16px;
        background: linear-gradient(135deg,#eef2ff,#f8fafc);
      }

      /* HEADER */
      .course-header h2 {
        font-size: 28px;
        font-weight: 700;
        background: linear-gradient(90deg,#4f46e5,#06b6d4);
        -webkit-background-clip: text;
        color: transparent;
      }

      .course-header p {
        color: #64748b;
      }

      /* MESSAGE */
      .course-msg {
        padding: 12px;
        border-radius: 10px;
        margin: 15px 0;
        color: white;
      }

      .course-msg.success { background:#16a34a; }
      .course-msg.error { background:#dc2626; }

      /* FORM */
      .course-form {
        background: white;
        padding: 25px;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        margin-bottom: 20px;
      }

      .course-form input,
      .course-form select {
        width: 100%;
        padding: 12px;
        margin: 10px 0;
        border-radius: 10px;
        border: 1px solid #cbd5f5;
      }

      .course-form button {
        background: linear-gradient(135deg,#6366f1,#4f46e5);
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        border: none;
        margin-top: 10px;
      }

      /* DROPDOWN */
      .course-dropdown {
        margin-top: 10px;
      }

      /* SEARCH */
      .course-search {
        width: 100%;
        padding: 12px;
        border-radius: 10px;
        border: 1px solid #cbd5f5;
        margin-bottom: 20px;
      }

      /* GRID */
      .course-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(250px,1fr));
        gap: 20px;
      }

      /* CARD */
      .course-card {
        padding: 20px;
        border-radius: 16px;
        background: linear-gradient(145deg,#ffffff,#eef2ff);
        box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        transition: 0.4s;
      }

      .course-card:hover {
        transform: translateY(-8px) scale(1.03);
      }

      .course-card h3 {
        font-size: 18px;
        margin-bottom: 10px;
      }

      .dept {
        color: #475569;
        margin-bottom: 10px;
      }

      /* DELETE */
      .delete-btn {
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

export default CoursePage;