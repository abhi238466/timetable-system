import React, { useEffect, useState } from "react";
import "../App.css";

function RoomPage() {

  const [rooms, setRooms] = useState([]);

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [type, setType] = useState("classroom");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");

  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  // 🔥 FETCH
  const fetchRooms = async () => {
    const res = await fetch("http://localhost:5000/api/rooms");
    const data = await res.json();
    setRooms(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // 🔥 AUTO MESSAGE
  useEffect(() => {
    if (msg) {
      const t = setTimeout(() => setMsg(""), 3000);
      return () => clearTimeout(t);
    }
  }, [msg]);

  // 🔥 ADD ROOM
  const addRoom = async () => {

    if (!name || !capacity || !building || !floor) {
      setMsg("Fill all fields ❌");
      setMsgType("error");
      return;
    }

    // 🔥 DUPLICATE CHECK
    const exists = rooms.some(r =>
      r.name.toLowerCase() === name.toLowerCase() &&
      r.building.toLowerCase() === building.toLowerCase() &&
      r.floor === floor
    );

    if (exists) {
      setMsg("Room already exists ❌");
      setMsgType("error");
      return;
    }

    await fetch("http://localhost:5000/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        capacity: Number(capacity),
        type,
        building,
        floor: Number(floor)
      })
    });

    setMsg("Room Added ✅");
    setMsgType("success");

    setName("");
    setCapacity("");
    setType("classroom");
    setBuilding("");
    setFloor("");

    fetchRooms();
  };

  // 🔥 DELETE
  const deleteRoom = async (id) => {
    await fetch(`http://localhost:5000/api/rooms/${id}`, {
      method: "DELETE"
    });

    setMsg("Deleted ✅");
    setMsgType("success");

    fetchRooms();
  };

  return (

    <div className="container room-container">

      {/* HEADER */}
      <div className="room-header">
        <h2>🏫 Room Management</h2>
        <p>Manage rooms smartly with validation</p>
      </div>

      {/* MESSAGE */}
      {msg && <div className={`room-msg ${msgType}`}>{msg}</div>}

      {/* FORM */}
      <div className="room-form">

        <input placeholder="Room Name (A-101)" value={name} onChange={e => setName(e.target.value)} />

        <input type="number" placeholder="Capacity" value={capacity} onChange={e => setCapacity(e.target.value)} />

        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="classroom">Classroom</option>
          <option value="lab">Lab</option>
        </select>

        <input placeholder="Building (Block A)" value={building} onChange={e => setBuilding(e.target.value)} />

        <input type="number" placeholder="Floor (1,2,3)" value={floor} onChange={e => setFloor(e.target.value)} />

        <button onClick={addRoom}>+ Add Room</button>

      </div>

      {/* 🔍 SEARCH */}
      <input
        className="room-search"
        placeholder="🔍 Search room..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* LIST */}
      <div className="room-grid">

        {rooms
          .filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
          .map(room => (

            <div key={room._id} className="room-card">

              <h3>{room.name}</h3>

              <p className="cap">👥 {room.capacity}</p>

              <p className="loc">🏢 {room.building} • Floor {room.floor}</p>

              <span className={`badge ${room.type}`}>
                {room.type.toUpperCase()}
              </span>

              <button
                className="delete-btn"
                onClick={() => deleteRoom(room._id)}
              >
                Delete
              </button>

            </div>

          ))}

      </div>

      {/* 🔥 CSS */}
      <style>{`

      .room-container {
        padding: 30px;
        background: linear-gradient(135deg,#eef2ff,#f8fafc);
        border-radius: 16px;
      }

      .room-header h2 {
        font-size: 28px;
        font-weight: 700;
        background: linear-gradient(90deg,#4f46e5,#06b6d4);
        -webkit-background-clip: text;
        color: transparent;
      }

      .room-header p {
        color: #64748b;
      }

      .room-msg {
        padding: 12px;
        border-radius: 10px;
        margin: 15px 0;
        color: white;
      }

      .room-msg.success { background:#16a34a; }
      .room-msg.error { background:#dc2626; }

      .room-form {
        background: white;
        padding: 25px;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
      }

      .room-form input,
      .room-form select {
        width: 100%;
        padding: 12px;
        margin: 10px 0;
        border-radius: 10px;
        border: 1px solid #cbd5f5;
      }

      .room-form button {
        background: linear-gradient(135deg,#6366f1,#4f46e5);
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        border: none;
      }

      .room-search {
        width: 100%;
        padding: 12px;
        border-radius: 10px;
        border: 1px solid #cbd5f5;
        margin: 20px 0;
      }

      .room-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(240px,1fr));
        gap: 20px;
      }

      .room-card {
        padding: 20px;
        border-radius: 16px;
        background: linear-gradient(145deg,#ffffff,#eef2ff);
        box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        transition: 0.3s;
      }

      .room-card:hover {
        transform: translateY(-8px) scale(1.03);
      }

      .room-card h3 {
        font-size: 18px;
        margin-bottom: 8px;
      }

      .cap {
        font-weight: 500;
      }

      .loc {
        font-size: 13px;
        color: #475569;
      }

      .badge {
        display: inline-block;
        margin-top: 10px;
        padding: 5px 12px;
        border-radius: 10px;
        color: white;
        font-size: 12px;
      }

      .badge.classroom {
        background: #2563eb;
      }

      .badge.lab {
        background: #f59e0b;
      }

      .delete-btn {
        margin-top: 12px;
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

export default RoomPage;