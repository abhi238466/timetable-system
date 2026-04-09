import React, { useEffect, useState } from "react";

function TimeslotPage() {

  const [slots, setSlots] = useState([]);
  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

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

  // 🔥 ADD SLOT
  const addSlot = async () => {

    if (!startTime || !endTime) {
      alert("⚠️ Fill all fields");
      return;
    }

    if (startTime >= endTime) {
      alert("⚠️ End time must be greater than start time");
      return;
    }

    const exists = slots.some(
      s => s.day === day && s.startTime === startTime && s.endTime === endTime
    );

    if (exists) {
      alert("⚠️ Slot already exists!");
      return;
    }

    await fetch("http://localhost:5000/api/timeslots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ day, startTime, endTime })
    });

    setStartTime("");
    setEndTime("");

    fetchSlots();
  };

  // 🔥 DELETE SLOT (NEW)
  const deleteSlot = async (id) => {
    await fetch(`http://localhost:5000/api/timeslots/${id}`, {
      method: "DELETE"
    });

    fetchSlots();
  };

  const filteredSlots = slots.filter(slot => slot.day === day);

  return (

    <div>

      <h2 style={title}>⏰ Timeslot Management</h2>

      {/* FORM */}
      <div style={form}>

        <select value={day} onChange={(e) => setDay(e.target.value)} style={input}>
          {days.map(d => <option key={d}>{d}</option>)}
        </select>

        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          style={input}
        />

        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          style={input}
        />

        <button style={btn} onClick={addSlot}>
          + Add Slot
        </button>

      </div>

      <div style={info}>
        Showing slots for: <b>{day}</b>
      </div>

      <div style={grid}>

        {filteredSlots.length === 0 ? (
          <div style={empty}>
            No slots for {day}
          </div>
        ) : (
          filteredSlots.map(slot => (
            <div key={slot._id} style={card}>

              <h3 style={{ marginBottom: "10px" }}>{slot.day}</h3>

              <p style={{ fontSize: "15px" }}>
                🕒 {slot.startTime} - {slot.endTime}
              </p>

              {/* 🔥 DELETE BUTTON (NEW) */}
              <button
                style={deleteBtn}
                onClick={() => deleteSlot(slot._id)}
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

/* 🔥 STYLES */

const deleteBtn = {
  marginTop: "10px",
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};

const title = {
  marginBottom: "25px",
  fontSize: "22px"
};

const form = {
  display: "flex",
  gap: "15px",
  marginBottom: "20px",
  padding: "20px",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  alignItems: "center"
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  minWidth: "120px"
};

const btn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
};

const info = {
  marginBottom: "15px",
  fontSize: "14px",
  color: "#475569"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px"
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  borderLeft: "5px solid #2563eb"
};

const empty = {
  padding: "30px",
  background: "#f1f5f9",
  borderRadius: "10px",
  textAlign: "center",
  gridColumn: "1/-1"
};

export default TimeslotPage;