import React, { useEffect, useState } from "react";

function TimetableView() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/timetable")
      .then(res => res.json())
      .then(res => setData(Array.isArray(res) ? res : []));
  }, []);

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  const times = [
    ...new Set(
      data.map(d => d.timeslot?.startTime + "-" + d.timeslot?.endTime)
    )
  ].filter(Boolean).sort();

  const getCell = (day, time) => {
    return data.filter(d =>
      d.timeslot?.day === day &&
      (d.timeslot.startTime + "-" + d.timeslot.endTime) === time
    );
  };

  return (

    <div className="tv-container">

      <h2 className="tv-title">📅 Weekly Timetable</h2>

      <div className="tv-grid">

        {/* HEADER */}
        <div className="tv-row header">
          <div className="tv-cell head">Day / Time</div>
          {times.map(t => (
            <div key={t} className="tv-cell head">{t}</div>
          ))}
        </div>

        {days.map(day => (
          <div key={day} className="tv-row">

            <div className="tv-cell day">{day}</div>

            {times.map(time => {

              const items = getCell(day, time);

              return (
                <div key={time} className="tv-cell">

                  {items.length === 0 ? (
                    <div className="free">FREE</div>
                  ) : items.map((item, i) => (

                    <div
                      key={i}
                      className={`tv-card ${item.subject?.type === "lab" ? "lab" : ""}`}
                    >

                      <div className="sub">
                        {item.subject?.name}
                      </div>

                      <div className="info">
                        👨‍🏫 {item.teacher?.map(t => t.name).join(", ")}
                      </div>

                      <div className="info">
                        🏫 {item.room?.name}
                      </div>

                      <div className="info">
                        🎓 {item.sections?.map(s => s.name).join(", ")}
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

      .tv-container {
        padding: 25px;
        background: linear-gradient(135deg,#eef2ff,#f8fafc);
      }

      .tv-title {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 20px;
      }

      .tv-grid {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .tv-row {
        display: grid;
        grid-template-columns: 140px repeat(auto-fit, minmax(160px,1fr));
      }

      .tv-cell {
        background: white;
        padding: 12px;
        border-radius: 10px;
        min-height: 100px;
      }

      .tv-cell.head {
        background: #2563eb;
        color: white;
        text-align: center;
        font-weight: bold;
      }

      .tv-cell.day {
        font-weight: bold;
        background: #f1f5f9;
      }

      .tv-card {
        background: #e0ecff;
        padding: 8px;
        border-radius: 8px;
        margin-bottom: 6px;
      }

      .tv-card.lab {
        background: #fde68a;
      }

      .sub {
        font-weight: bold;
        margin-bottom: 4px;
      }

      .info {
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

export default TimetableView;