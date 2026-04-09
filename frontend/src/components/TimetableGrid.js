import React, { useEffect, useState } from "react";
import "../App.css";

function TimetableGrid() {

  const [data, setData] = useState([]);

  const [selectedSection, setSelectedSection] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

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

  // ✅ DAYS (LEFT SIDE)
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // ✅ TIMES (TOP SIDE)
  const times = [
    ...new Set(
      data.map(item =>
        item.timeslot
          ? item.timeslot.startTime + "-" + item.timeslot.endTime
          : ""
      )
    )
  ].filter(Boolean).sort();

  // FILTER DATA
  const getCellData = (day, time) => {
    return data.filter(item => {

      if (!item.timeslot) return false;

      const matchDayTime =
        item.timeslot.day === day &&
        (item.timeslot.startTime + "-" + item.timeslot.endTime) === time;

      const matchSection =
        !selectedSection ||
        (item.sections || []).some(sec => sec._id === selectedSection);

      const matchTeacher =
        !selectedTeacher ||
        item.teacher?.some(t => t.name === selectedTeacher);

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

      {/* FILTER */}
      <div className="card" style={{ marginBottom: "20px" }}>

        <select className="input" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
          <option value="">All Sections</option>
        </select>

        <select className="input" value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
          <option value="">All Teachers</option>
        </select>

        <select className="input" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
          <option value="">All Rooms</option>
        </select>

        <button onClick={() => {
          setSelectedSection("");
          setSelectedTeacher("");
          setSelectedRoom("");
        }}>
          Reset
        </button>

      </div>

      {/* PRINT */}
      <button onClick={() => window.print()}>🖨 Print</button>

      {/* ✅ FINAL TABLE (COLLEGE STYLE) */}
      <table>

        <thead>
          <tr>
            <th>Day / Time</th>
            {times.map(time => (
              <th key={time}>{time}</th>
            ))}
          </tr>
        </thead>

        <tbody>

          {days.map(day => (
            <tr key={day}>

              {/* LEFT SIDE DAY */}
              <td><b>{day}</b></td>

              {times.map(time => {

                const cellData = getCellData(day, time);

                return (
                  <td key={time}>

                    {cellData.length === 0
                      ? <div style={{ color: "#999", fontWeight: "bold" }}>FREE</div>
                      : cellData.map((item, i) => (

                        <div
                          key={i}
                          className="card"
                          style={{
                            marginBottom: "8px",
                            borderLeft:
                              item.subject?.type === "lab"
                                ? "5px solid orange"
                                : "5px solid #2563eb"
                          }}
                        >

                          <div style={{ fontWeight: "bold" }}>
                            {item.subject?.name}
                          </div>

                          <div style={{ color: "green", fontSize: "12px" }}>
                            🎓 {item.sections?.map(sec => sec.name).join(", ")}
                          </div>

                          <div className="small-text">
                            👨‍🏫 {item.teacher?.map(t => t.name).join(", ")}
                          </div>

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