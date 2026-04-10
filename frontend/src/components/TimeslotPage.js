import React, { useEffect, useState } from "react";

function TimeslotPage() {

  const [slots, setSlots] = useState([]);
  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [msg, setMsg] = useState("");
  const [type, setType] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // 🔥 FETCH
  const fetchSlots = async () => {
    const res = await fetch("http://localhost:5000/api/timeslots");
    const data = await res.json();
    setSlots(data);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  // 🔥 AUTO MSG
  useEffect(() => {
    if (msg) {
      const t = setTimeout(() => setMsg(""), 3000);
      return () => clearTimeout(t);
    }
  }, [msg]);

  // 🔥 TIME FORMAT (AM/PM) ✅ FIXED ONLY THIS
  const formatTime = (time) => {
    if (!time) return "";

    const [h, m] = time.split(":");
    const date = new Date();
    date.setHours(h);
    date.setMinutes(m);

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  // 🔥 ADD SLOT
  const addSlot = async () => {

    if (!startTime || !endTime) {
      setMsg("Fill all fields ❌");
      setType("error");
      return;
    }

    if (startTime >= endTime) {
      setMsg("End time must be greater ❌");
      setType("error");
      return;
    }

    const exists = slots.some(
      s => s.day === day && s.startTime === startTime && s.endTime === endTime
    );

    if (exists) {
      setMsg("Slot already exists ❌");
      setType("error");
      return;
    }

    await fetch("http://localhost:5000/api/timeslots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ day, startTime, endTime })
    });

    setMsg("Slot Added ✅");
    setType("success");

    setStartTime("");
    setEndTime("");

    fetchSlots();
  };

  // 🔥 DELETE
  const deleteSlot = async (id) => {
    await fetch(`http://localhost:5000/api/timeslots/${id}`, {
      method: "DELETE"
    });

    setMsg("Deleted ✅");
    setType("success");

    fetchSlots();
  };

  const filteredSlots = slots.filter(slot => slot.day === day);

  return (

    <div className="timeslot-container">

      {/* HEADER */}
      <div className="timeslot-header">
        <h2>⏰ Timeslot Management</h2>
        <p>Create and manage time slots efficiently</p>
      </div>

      {/* MESSAGE */}
      {msg && <div className={`msg ${type}`}>{msg}</div>}

      {/* FORM */}
      <div className="timeslot-form">

        <select value={day} onChange={(e) => setDay(e.target.value)}>
          {days.map(d => <option key={d}>{d}</option>)}
        </select>

        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />

        <button onClick={addSlot}>+ Add Slot</button>

      </div>

      <div className="info">
        Showing slots for: <b>{day}</b>
      </div>

      {/* GRID */}
      <div className="grid">

        {filteredSlots.length === 0 ? (
          <div className="empty">No slots for {day}</div>
        ) : (
          filteredSlots.map(slot => (
            <div key={slot._id} className="card">

              <h3>{slot.day}</h3>

              <p>
                🕒 {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              </p>

              <button
                className="delete-btn"
                onClick={() => deleteSlot(slot._id)}
              >
                Delete
              </button>

            </div>
          ))
        )}

      </div>

      {/* 🔥 CSS */}
      <style>{`

      .timeslot-container {
        padding: 30px;
        background: linear-gradient(135deg,#eef2ff,#f8fafc);
        border-radius: 16px;
      }

      .timeslot-header h2 {
        font-size: 28px;
        font-weight: 700;
        background: linear-gradient(90deg,#4f46e5,#06b6d4);
        -webkit-background-clip: text;
        color: transparent;
      }

      .timeslot-header p {
        color: #64748b;
      }

      .msg {
        padding: 12px;
        border-radius: 10px;
        margin: 15px 0;
        color: white;
      }

      .msg.success { background:#16a34a; }
      .msg.error { background:#dc2626; }

      .timeslot-form {
        display: flex;
        gap: 12px;
        background: white;
        padding: 20px;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        flex-wrap: wrap;
      }

      .timeslot-form select,
      .timeslot-form input {
        padding: 12px;
        border-radius: 10px;
        border: 1px solid #cbd5f5;
      }

      .timeslot-form button {
        background: linear-gradient(135deg,#6366f1,#4f46e5);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 10px;
      }

      .info {
        margin: 20px 0;
        color: #475569;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
        gap: 20px;
      }

      .card {
        background: linear-gradient(145deg,#ffffff,#eef2ff);
        padding: 20px;
        border-radius: 16px;
        box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        transition: 0.3s;
      }

      .card:hover {
        transform: translateY(-8px) scale(1.03);
      }

      .delete-btn {
        margin-top: 10px;
        background: linear-gradient(135deg,#ef4444,#dc2626);
        color: white;
        border: none;
        padding: 8px 14px;
        border-radius: 8px;
      }

      .empty {
        padding: 25px;
        text-align: center;
        background: #f1f5f9;
        border-radius: 10px;
        grid-column: 1/-1;
      }

      `}</style>

    </div>
  );
}

export default TimeslotPage;