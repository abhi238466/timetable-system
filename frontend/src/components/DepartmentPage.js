import React, { useEffect, useState } from "react";

function DepartmentPage() {

  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");

  const [msg, setMsg] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/departments");
      const data = await res.json();
      setDepartments(Array.isArray(data) ? data : []);
    } catch {
      setDepartments([]);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const addDepartment = async () => {

    if (!name.trim()) {
      setMsg("Enter department name ❌");
      setType("error");
      return;
    }

    const exists = departments.some(
      d => d.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      setMsg("Department already exists ❌");
      setType("error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const deleteDepartment = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/departments/${id}`, {
        method: "DELETE"
      });

      setMsg("Deleted successfully ✅");
      setType("success");

      fetchDepartments();

    } catch {
      setMsg("Delete error ❌");
      setType("error");
    }
  };

  const filtered = departments.filter(dep =>
    dep.name.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="dept-container">

      {/* 🔥 HEADER */}
      <div className="dept-header">
        <h2>🏫 Department Management</h2>
        <p>Smartly manage all departments</p>
      </div>

      {/* MESSAGE */}
      {msg && (
        <div className={`dept-msg ${type}`}>
          {msg}
        </div>
      )}

      {/* FORM */}
      <div className="dept-form">
        <input
          placeholder="Enter department name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={addDepartment}>
          ➕ Add Department
        </button>
      </div>

      {/* SEARCH */}
      <input
        className="dept-search"
        placeholder="🔍 Search department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* GRID */}
      <div className="dept-grid">

        {filtered.length === 0 ? (
          <p className="empty">No Departments Found</p>
        ) : (
          filtered.map(dep => (
            <div key={dep._id} className="dept-card">

              <h3>{dep.name}</h3>

              <button
                className="delete-btn"
                onClick={() => deleteDepartment(dep._id)}
              >
                🗑 Delete
              </button>

            </div>
          ))
        )}

      </div>

      {/* 🔥 ADVANCED CSS */}
      <style>{`

      .dept-container {
        padding: 30px;
        border-radius: 16px;
        background: linear-gradient(135deg,#eef2ff,#f8fafc);
      }

      /* HEADER */
      .dept-header {
        margin-bottom: 25px;
      }

      .dept-header h2 {
        font-size: 28px;
        font-weight: 700;
        background: linear-gradient(90deg,#4f46e5,#06b6d4);
        -webkit-background-clip: text;
         color: black;
      }

      .dept-header p {
        color: #64748b;
      }

      /* MESSAGE */
      .dept-msg {
        padding: 12px;
        border-radius: 10px;
        margin-bottom: 20px;
        color: white;
        font-weight: 500;
      }

      .dept-msg.success {
        background: linear-gradient(135deg,#22c55e,#16a34a);
      }

      .dept-msg.error {
        background: linear-gradient(135deg,#ef4444,#dc2626);
      }

      /* FORM */
      .dept-form {
        display: flex;
        gap: 12px;
        margin-bottom: 20px;
      }

      .dept-form input {
        flex: 1;
        padding: 14px;
        border-radius: 12px;
        border: 1px solid #cbd5f5;
        background: rgba(255,255,255,0.6);
        backdrop-filter: blur(8px);
        transition: 0.3s;
      }

      .dept-form input:focus {
        border-color: #6366f1;
        box-shadow: 0 0 10px rgba(99,102,241,0.3);
      }

      .dept-form button {
        padding: 14px 20px;
        border-radius: 12px;
        background: linear-gradient(135deg,#6366f1,#4f46e5);
        color: white;
        font-weight: 500;
        border: none;
        transition: 0.3s;
      }

      .dept-form button:hover {
        transform: scale(1.05);
      }

      /* SEARCH */
      .dept-search {
        width: 100%;
        padding: 14px;
        border-radius: 12px;
        margin-bottom: 25px;
        border: 1px solid #cbd5f5;
        background: white;
      }

      /* GRID */
      .dept-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(260px,1fr));
        gap: 22px;
      }

      /* CARD */
      .dept-card {
        padding: 25px;
        border-radius: 16px;
        text-align: center;
        background: rgba(255,255,255,0.6);
        backdrop-filter: blur(10px);
        box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        transition: 0.4s;
        position: relative;
      }

      .dept-card::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 16px;
        padding: 1px;
        background: linear-gradient(135deg,#6366f1,#06b6d4);
        -webkit-mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;

        pointer-events: none; /* ✅ FIX */
      }

      .dept-card:hover {
        transform: translateY(-8px) scale(1.04);
      }

      .dept-card h3 {
        font-size: 18px;
        margin-bottom: 15px;
      }

      /* DELETE */
      .delete-btn {
        background: linear-gradient(135deg,#ef4444,#dc2626);
        padding: 10px 18px;
        border-radius: 10px;
        color: white;
        border: none;
        transition: 0.3s;

        cursor: pointer;     /* ✅ FIX */
        position: relative;  /* ✅ FIX */
        z-index: 1;          /* ✅ FIX */
      }

      .delete-btn:hover {
        transform: scale(1.1);
      }

      /* EMPTY */
      .empty {
        text-align: center;
        color: #64748b;
        font-weight: 500;
      }

      `}</style>

    </div>
  );
}

export default DepartmentPage;