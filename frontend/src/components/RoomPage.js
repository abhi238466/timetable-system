import React, { useEffect, useState } from "react";
import "../App.css";

function RoomPage() {

  const [rooms, setRooms] = useState([]);

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [type, setType] = useState("classroom");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");

  // FETCH
  const fetchRooms = async () => {
    const res = await fetch("http://localhost:5000/api/rooms");
    const data = await res.json();
    setRooms(data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // ADD ROOM
  const addRoom = async () => {

    if (!name || !capacity || !building || !floor) {
      alert("Fill all fields");
      return;
    }

    const res = await fetch("http://localhost:5000/api/rooms", {
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

    const data = await res.json();
    console.log(data);

    // RESET
    setName("");
    setCapacity("");
    setType("classroom");
    setBuilding("");
    setFloor("");

    fetchRooms();
  };

  // DELETE
  const deleteRoom = async (id) => {
    await fetch(`http://localhost:5000/api/rooms/${id}`, {
      method: "DELETE"
    });
    fetchRooms();
  };

  return (

    <div className="container">

      <h2>🏫 Room Management</h2>

      <div className="card">

        <input
          placeholder="Room Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />

        <input
          type="number"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="input"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input"
        >
          <option value="classroom">Classroom</option>
          <option value="lab">Lab</option>
        </select>

        {/* 🔥 NEW FIELDS */}
        <input
          placeholder="Building (Block A)"
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
          className="input"
        />

        <input
          type="number"
          placeholder="Floor (1,2,3)"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          className="input"
        />

        <button onClick={addRoom}>
          + Add Room
        </button>

      </div>

      <div className="grid">

        {rooms.map(room => (

          <div key={room._id} className="card">

            <h3>{room.name}</h3>

            <p>👥 Capacity: {room.capacity}</p>

            <p>🏢 {room.building} | Floor {room.floor}</p>

            <span
              style={{
                padding: "5px 10px",
                borderRadius: "10px",
                background:
                  room.type === "lab" ? "#f59e0b" : "#2563eb",
                color: "white"
              }}
            >
              {room.type.toUpperCase()}
            </span>

            <br /><br />

            <button
              className="btn-danger"
              onClick={() => deleteRoom(room._id)}
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>

  );
}

export default RoomPage;