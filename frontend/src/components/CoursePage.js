import React, { useEffect, useState } from "react";
import "../App.css";

function CoursePage() {

  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");

  // 🔥 FETCH DATA
  const fetchData = async () => {
    const c = await fetch("http://localhost:5000/api/courses");
    const d = await fetch("http://localhost:5000/api/departments");

    setCourses(await c.json());
    setDepartments(await d.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 ADD COURSE
  const addCourse = async () => {

    if (!name || !department) {
      alert("Fill all fields");
      return;
    }

    await fetch("http://localhost:5000/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        department
      })
    });

    setName("");
    setDepartment("");

    fetchData();
  };

  // 🔥 DELETE
  const deleteCourse = async (id) => {
    await fetch(`http://localhost:5000/api/courses/${id}`, {
      method: "DELETE"
    });
    fetchData();
  };

  return (

    <div className="container">

      <h2>📘 Course Management</h2>

      {/* FORM */}
      <div className="card">

        <input
          placeholder="Course Name (MCA, BCA)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="input"
        >
          <option value="">Select Department</option>
          {departments.map(d => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>

        <button onClick={addCourse}>
          + Add Course
        </button>

      </div>

      {/* LIST */}
      <div className="grid">

        {courses.map(course => (

          <div key={course._id} className="card">

            <h3>{course.name}</h3>

            <p>🏫 {course.department?.name}</p>

            <button
              className="btn-danger"
              onClick={() => deleteCourse(course._id)}
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>

  );
}

export default CoursePage;