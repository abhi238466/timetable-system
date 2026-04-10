import React, { useEffect, useState } from "react";
import "../App.css";

function TimetableGrid() {

  const [data, setData] = useState([]);

  const [selectedSection, setSelectedSection] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  const [searchSection, setSearchSection] = useState("");
  const [searchTeacher, setSearchTeacher] = useState("");
  const [searchRoom, setSearchRoom] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/timetable")
      .then(res => res.json())
      .then(res => setData(Array.isArray(res) ? res : []));
  }, []);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const times = [
    ...new Set(
      data.map(item =>
        item.timeslot
          ? item.timeslot.startTime + "-" + item.timeslot.endTime
          : ""
      )
    )
  ].filter(Boolean).sort();

  // 🔥 UNIQUE FILTER OPTIONS
  const sections = [...new Map(
    data.flatMap(d => d.sections || []).map(s => [s._id, s])
  ).values()];

  const teachers = [...new Map(
    data.flatMap(d => d.teacher || []).map(t => [t._id, t])
  ).values()];

  const rooms = [...new Map(
    data.flatMap(d => Array.isArray(d.room) ? d.room : [d.room]).map(r => [r?._id, r])
  ).values()];

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
        item.teacher?.some(t => t._id === selectedTeacher);

      const matchRoom =
        !selectedRoom ||
        (
          Array.isArray(item.room)
            ? item.room.some(r => r._id === selectedRoom)
            : item.room?._id === selectedRoom
        );

      return matchDayTime && matchSection && matchTeacher && matchRoom;
    });
  };

  return (

    <div className="tt-container">

      <h2 className="tt-title">📅 Weekly Timetable</h2>

      {/* 🔥 FILTER BAR */}
      <div className="tt-filters">

        <input
          placeholder="🔍 Search Section"
          value={searchSection}
          onChange={(e) => setSearchSection(e.target.value)}
        />

        <select onChange={(e) => setSelectedSection(e.target.value)}>
          <option value="">All Sections</option>
          {sections
            .filter(s => s.name.toLowerCase().includes(searchSection.toLowerCase()))
            .map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
        </select>

        <input
          placeholder="🔍 Search Teacher"
          value={searchTeacher}
          onChange={(e) => setSearchTeacher(e.target.value)}
        />

        <select onChange={(e) => setSelectedTeacher(e.target.value)}>
          <option value="">All Teachers</option>
          {teachers
            .filter(t => t.name.toLowerCase().includes(searchTeacher.toLowerCase()))
            .map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
        </select>

        <input
          placeholder="🔍 Search Room"
          value={searchRoom}
          onChange={(e) => setSearchRoom(e.target.value)}
        />

        <select onChange={(e) => setSelectedRoom(e.target.value)}>
          <option value="">All Rooms</option>
          {rooms
            .filter(r => r?.name?.toLowerCase().includes(searchRoom.toLowerCase()))
            .map(r => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
        </select>

        <button onClick={() => window.print()}>🖨 Print</button>

      </div>

      {/* 🔥 GRID TABLE */}
      <div className="tt-table">

        <div className="tt-row header">
          <div className="tt-cell head">Day / Time</div>
          {times.map(t => (
            <div key={t} className="tt-cell head">{t}</div>
          ))}
        </div>

        {days.map(day => (
          <div key={day} className="tt-row">

            <div className="tt-cell day">{day}</div>

            {times.map(time => {

              const cellData = getCellData(day, time);

              return (
                <div key={time} className="tt-cell">

                  {cellData.length === 0
                    ? <div className="free">FREE</div>
                    : cellData.map((item, i) => (

                      <div
                        key={i}
                        className={`tt-card ${item.subject?.type === "lab" ? "lab" : ""}`}
                      >

                        <div className="sub">{item.subject?.name}</div>

                        <div className="small">
                          🎓 {item.sections?.map(s => s.name).join(", ")}
                        </div>

                        <div className="small">
                          👨‍🏫 {item.teacher?.map(t => t.name).join(", ")}
                        </div>

                        <div className="small">
                          🏫 {
                            Array.isArray(item.room)
                              ? item.room.map(r => r.name).join(", ")
                              : item.room?.name
                          }
                        </div>

                      </div>

                    ))}
                </div>
              );

            })}

          </div>
        ))}

      </div>

      {/* 🔥 CSS */}
      <style>{`

      .tt-container {
        padding: 25px;
        background: linear-gradient(135deg,#eef2ff,#f8fafc);
      }

      .tt-title {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 20px;
      }

      .tt-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
      }

      .tt-filters input,
      .tt-filters select {
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #ccc;
      }

      .tt-table {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .tt-row {
        display: grid;
        grid-template-columns: 140px repeat(auto-fit, minmax(150px, 1fr));
      }

      .tt-cell {
        background: white;
        padding: 10px;
        border-radius: 10px;
        min-height: 100px;
      }

      .tt-cell.head {
        background: #2563eb;
        color: white;
        text-align: center;
        font-weight: bold;
      }

      .tt-cell.day {
        font-weight: bold;
        background: #f1f5f9;
      }

      .tt-card {
        background: #e0ecff;
        padding: 8px;
        border-radius: 8px;
        margin-bottom: 5px;
      }

      .tt-card.lab {
        background: #fde68a;
      }

      .sub {
        font-weight: bold;
      }

      .small {
        font-size: 12px;
        color: #475569;
      }

      .free {
        text-align: center;
        color: #999;
        font-weight: bold;
      }

      `}</style>

    </div>
  );
}

export default TimetableGrid;