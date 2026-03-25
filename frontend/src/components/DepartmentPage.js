import React, { useEffect, useState } from "react";
import "../App.css";

function DepartmentPage() {

  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");

  const [msg, setMsg] = useState("");
  const [type, setType] = useState("");

  // 🔥 AUTO HIDE MESSAGE
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => {
        setMsg("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [msg]);

  // 🔥 FETCH
  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/departments");
      const data = await res.json();

      if (Array.isArray(data)) {
        setDepartments(data);
      } else {
        setDepartments([]);
      }

    } catch {
      setDepartments([]);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // 🔥 ADD
  const addDepartment = async () => {

    if (!name.trim()) {
      setMsg("Enter department name ❌");
      setType("error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
      });

      const data = await res.json();

      setMsg(data.message || "Added successfully ✅");
      setType("success");

      setName("");
      fetchDepartments();

    } catch {
      setMsg("Error ❌");
      setType("error");
    }
  };

  // 🔥 DELETE
  const deleteDepartment = async (id) => {

    try {
      const res = await fetch(`http://localhost:5000/api/departments/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      setMsg(data.message || "Deleted successfully ✅");
      setType("success");

      fetchDepartments();

    } catch {
      setMsg("Delete error ❌");
      setType("error");
    }
  };

  return (

    <div className="container">

      <h2>🏫 Department Management</h2>

      {/* 🔥 MESSAGE */}
      {msg && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "6px",
            color: "white",
            background: type === "success" ? "#16a34a" : "#dc2626"
          }}
        >
          {msg}
        </div>
      )}

      {/* FORM */}
      <div className="card">

        <input
          placeholder="Department Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />

        <button onClick={addDepartment}>
          + Add Department
        </button>

      </div>

      {/* LIST */}
      <div className="grid">

        {departments.length === 0 ? (
          <p>No Departments</p>
        ) : (
          departments.map(dep => (
            <div key={dep._id} className="card">

              <h3>{dep.name}</h3>

              <button
                className="btn-danger"
                onClick={() => deleteDepartment(dep._id)}
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

export default DepartmentPage;