import React, { useEffect, useState } from "react";
import "../App.css";

function TimetableGrid() {

  const [data, setData] = useState([]);

  const [selectedSection, setSelectedSection] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  // 🔥 FETCH DATA
  useEffect(() => {
    fetch("http://localhost:5000/api/timetable")
      .then(res => res.json())
      .then(res => {
        if (Array.isArray(res)) {
          setData(res);
        } else {
          setData([]);
        }
      });
  }, []);

  // 🔥 DAYS
  const days = [
    ...new Set(data.map(item => item.timeslot?.day))
  ].filter(Boolean);

  // 🔥 TIME
  const times = [
    ...new Set(
      data.map(item =>
        item.timeslot
          ? item.timeslot.startTime + "-" + item.timeslot.endTime
          : ""
      )
    )
  ].filter(Boolean);

  // 🔥 UNIQUE SECTIONS
  const uniqueSections = [
    ...new Map(
      data.flatMap(item =>
        item.sections?.map(sec => [sec._id, sec]) || []
      )
    ).values()
  ];

  const uniqueTeachers = [
    ...new Set(
      data.flatMap(item =>
        item.teacher?.map(t => t.name) || []
      )
    )
  ];

  // 🔥 FIX ROOM (MULTIPLE ROOMS SUPPORT)
  const uniqueRooms = [
    ...new Set(
      data.flatMap(item =>
        Array.isArray(item.room)
          ? item.room.map(r => r.name)
          : [item.room?.name]
      )
    )
  ].filter(Boolean);

  // 🔥 CELL DATA (FINAL FIX)
  const getCellData = (day, time) => {
    return data.filter(item => {

      if (!item.timeslot) return false;

      const matchDayTime =
        item.timeslot.day === day &&
        (item.timeslot.startTime + "-" + item.timeslot.endTime) === time;

      // ✅ SECTION FIX
      const matchSection =
        !selectedSection ||
        (item.sections || []).some(sec =>
          sec._id === selectedSection
        );

      const matchTeacher =
        !selectedTeacher ||
        item.teacher?.some(t => t.name === selectedTeacher);

      // ✅ ROOM FIX (MULTIPLE ROOMS)
      const matchRoom =
        !selectedRoom ||
        (
          Array.isArray(item.room)
            ? item.room.some(r => r.name === selectedRoom)
            : item.room?.name === selectedRoom
        );

      return matchDayTime && matchSection && matchTeacher && matchRoom;
    });
  };

  return (

    <div className="container">

      <h2>📅 Timetable</h2>

      {/* 🔥 FILTER */}
      <div className="card" style={{ marginBottom: "20px" }}>

        <select
          className="input"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
        >
          <option value="">All Sections</option>
          {uniqueSections.map(sec => (
            <option key={sec._id} value={sec._id}>
              {sec.name}
            </option>
          ))}
        </select>

        <select
          className="input"
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
        >
          <option value="">All Teachers</option>
          {uniqueTeachers.map(t => <option key={t}>{t}</option>)}
        </select>

        <select
          className="input"
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
        >
          <option value="">All Rooms</option>
          {uniqueRooms.map(r => <option key={r}>{r}</option>)}
        </select>

        <button onClick={() => {
          setSelectedSection("");
          setSelectedTeacher("");
          setSelectedRoom("");
        }}>
          Reset
        </button>

      </div>

      {/* 🔥 PRINT */}
      <button onClick={() => window.print()}>
        🖨 Print
      </button>

      {/* 🔥 TABLE */}
      <table>

        <thead>
          <tr>
            <th>Time</th>
            {days.map(day => <th key={day}>{day}</th>)}
          </tr>
        </thead>

        <tbody>

          {times.map(time => (
            <tr key={time}>

              <td><b>{time}</b></td>

              {days.map(day => {

                const cellData = getCellData(day, time);

                return (
                  <td key={day}>

                    {cellData.length === 0
                      ? "-"
                      : cellData.map((item, i) => (

                        <div
                          key={i}
                          className="card"
                          style={{
                            marginBottom: "10px",
                            borderLeft:
                              item.subject?.type === "lab"
                                ? "5px solid orange"
                                : "5px solid #2563eb"
                          }}
                        >

                          <div style={{ fontWeight: "bold" }}>
                            {item.subject?.name}
                          </div>

                          <div style={{ color: "green", fontSize: "13px" }}>
                            🎓 {item.sections?.map(sec => sec.name).join(", ")}
                          </div>

                          <div className="small-text">
                            👨‍🏫 {item.teacher?.map(t => t.name).join(", ")}
                          </div>

                          {/* ✅ MULTI ROOM DISPLAY */}
                          <div className="small-text">
                            🏫 {
                              Array.isArray(item.room)
                                ? item.room.map(r => r.name).join(", ")
                                : item.room?.name
                            }
                          </div>

                        </div>

                      ))}
                  </td>
                );

              })}

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default TimetableGrid;