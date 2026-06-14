import React, { useEffect, useState } from "react";

// "09:00" → "9:00 AM" | "13:00" → "1:00 PM"
const formatTime = (time) => {
  if (!time) return "";
  const [h, m] = time.split(":");
  const date = new Date();
  date.setHours(parseInt(h));
  date.setMinutes(parseInt(m));
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

function TimetableView() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/timetable")
      .then((res) => res.json())
      .then((res) => setData(Array.isArray(res) ? res : []));
  }, []);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Key = "startTime||endTime" — double pipe separator
  const times = [
    ...new Set(
      data
        .filter((d) => d.timeslot?.startTime && d.timeslot?.endTime)
        .map((d) => d.timeslot.startTime + "||" + d.timeslot.endTime)
    ),
  ]
    .filter(Boolean)
    .sort((a, b) => a.split("||")[0].localeCompare(b.split("||")[0]));

  // ✅ "09:00||10:00" → "9:00 AM – 10:00 AM"
  // ✅ "12:00||13:00" → "12:00 PM – 1:00 PM"
  const formatTimeRange = (key) => {
    const parts = key.split("||");
    return `${formatTime(parts[0])} – ${formatTime(parts[1])}`;
  };

  const getCell = (day, timeKey) => {
    const parts = timeKey.split("||");
    const start = parts[0];
    const end = parts[1];
    return data.filter(
      (d) =>
        d.timeslot?.startTime &&
        d.timeslot?.endTime &&
        d.timeslot.day === day &&
        d.timeslot.startTime === start &&
        d.timeslot.endTime === end
    );
  };

  return (
    <div className="tv-container">
      <h2 className="tv-title">📅 Weekly Timetable</h2>

      <div className="tv-scroll">
        <table className="tv-table">

          <thead>
            <tr>
              <th className="tv-th day-col">Day / Time</th>
              {times.map((t) => (
                <th key={t} className="tv-th">
                  {formatTimeRange(t)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td className="tv-td day-label">{day}</td>
                {times.map((timeKey) => {
                  const items = getCell(day, timeKey);
                  return (
                    <td key={timeKey} className="tv-td">
                      {items.length === 0 ? (
                        <div className="free">FREE</div>
                      ) : (
                        items.map((item, i) => (
                          <div
                            key={i}
                            className={`tv-card ${item.subject?.type === "lab" ? "lab" : ""}`}
                          >
                            <div className="sub">{item.subject?.name}</div>
                            <div className="info">
                              👨‍🏫{" "}
                              {Array.isArray(item.teacher)
                                ? item.teacher.map((t) => t.name).join(", ")
                                : item.teacher?.name || "N/A"}
                            </div>
                            <div className="info">
                              🏫{" "}
                              {Array.isArray(item.room)
                                ? item.room.map((r) => r.name).join(", ")
                                : item.room?.name || "N/A"}
                            </div>
                            <div className="info">
                              🎓{" "}
                              {Array.isArray(item.sections)
                                ? item.sections.map((s) => s.name).join(", ")
                                : "N/A"}
                            </div>
                          </div>
                        ))
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .tv-container {
          padding: 25px;
          background: linear-gradient(135deg, #eef2ff, #f8fafc);
          min-height: 100vh;
        }
        .tv-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 20px;
          background: linear-gradient(90deg, #4f46e5, #06b6d4);
          -webkit-background-clip: text;
          color: transparent;
        }
        .tv-scroll {
          overflow-x: auto;
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }
        .tv-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: white;
          border-radius: 14px;
          overflow: hidden;
        }
        .tv-th {
          background: #2563eb;
          color: white;
          font-weight: 600;
          font-size: 13px;
          padding: 14px 12px;
          text-align: center;
          white-space: nowrap;
          border-right: 1px solid rgba(255,255,255,0.15);
        }
        .tv-th:last-child { border-right: none; }
        .tv-th.day-col {
          background: #1e40af;
          min-width: 110px;
        }
        .tv-td.day-label {
          font-weight: 700;
          font-size: 13px;
          background: #f1f5f9;
          color: #1e293b;
          text-align: center;
          vertical-align: middle;
          white-space: nowrap;
          border-right: 2px solid #e2e8f0;
        }
        .tv-td {
          padding: 10px;
          vertical-align: top;
          min-width: 160px;
          border-right: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }
        .tv-td:last-child { border-right: none; }
        .tv-card {
          background: #dbeafe;
          border-left: 4px solid #2563eb;
          padding: 8px 10px;
          border-radius: 8px;
          margin-bottom: 6px;
        }
        .tv-card.lab {
          background: #fef9c3;
          border-left-color: #ca8a04;
        }
        .sub {
          font-weight: 700;
          font-size: 13px;
          color: #1e293b;
          margin-bottom: 4px;
        }
        .info {
          font-size: 11px;
          color: #475569;
          margin-top: 2px;
        }
        .free {
          text-align: center;
          color: #cbd5e1;
          font-weight: 600;
          font-size: 12px;
          padding: 20px 0;
        }
      `}</style>
    </div>
  );
}

export default TimetableView;
// import React, { useEffect, useState } from "react";

// // ✅ "09:00" → "9:00 AM", "13:00" → "1:00 PM"
// const formatTime = (time) => {
//   if (!time) return "";
//   const [h, m] = time.split(":");
//   const date = new Date();
//   date.setHours(parseInt(h));
//   date.setMinutes(parseInt(m));
//   return date.toLocaleTimeString([], {
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//   });
// };

// function TimetableView() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/timetable")
//       .then((res) => res.json())
//       .then((res) => setData(Array.isArray(res) ? res : []));
//   }, []);

//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//   // ✅ FIX: sirf wahi entries lo jinka timeslot valid hai (startTime + endTime dono ho)
//   const times = [
//     ...new Set(
//       data
//         .filter(
//           (d) => d.timeslot?.startTime && d.timeslot?.endTime
//         )
//         .map((d) => d.timeslot.startTime + "-" + d.timeslot.endTime)
//     ),
//   ]
//     .filter(Boolean)
//     .sort((a, b) => {
//       const aStart = a.split("-")[0];
//       const bStart = b.split("-")[0];
//       return aStart.localeCompare(bStart);
//     });

//   // ✅ "09:00-10:00" → "9:00 AM - 10:00 AM"
//   const formatTimeRange = (rawRange) => {
//     const [start, end] = rawRange.split("-");
//     return `${formatTime(start)} - ${formatTime(end)}`;
//   };

//   const getCell = (day, time) => {
//     return data.filter(
//       (d) =>
//         d.timeslot?.startTime &&
//         d.timeslot?.endTime &&
//         d.timeslot.day === day &&
//         d.timeslot.startTime + "-" + d.timeslot.endTime === time
//     );
//   };

//   return (
//     <div className="tv-container">
//       <h2 className="tv-title">📅 Weekly Timetable</h2>

//       <div className="tv-grid">
//         {/* HEADER */}
//         <div className="tv-row header">
//           <div className="tv-cell head">Day / Time</div>
//           {times.map((t) => (
//             <div key={t} className="tv-cell head">
//               {formatTimeRange(t)}
//             </div>
//           ))}
//         </div>

//         {days.map((day) => (
//           <div key={day} className="tv-row">
//             <div className="tv-cell day">{day}</div>

//             {times.map((time) => {
//               const items = getCell(day, time);

//               return (
//                 <div key={time} className="tv-cell">
//                   {items.length === 0 ? (
//                     <div className="free">FREE</div>
//                   ) : (
//                     items.map((item, i) => (
//                       <div
//                         key={i}
//                         className={`tv-card ${
//                           item.subject?.type === "lab" ? "lab" : ""
//                         }`}
//                       >
//                         <div className="sub">{item.subject?.name}</div>

//                         <div className="info">
//                           👨‍🏫 {item.teacher?.map((t) => t.name).join(", ")}
//                         </div>

//                         {/* ✅ FIX: room array bhi ho sakta hai */}
//                         <div className="info">
//                           🏫{" "}
//                           {Array.isArray(item.room)
//                             ? item.room.map((r) => r.name).join(", ")
//                             : item.room?.name || "N/A"}
//                         </div>

//                         <div className="info">
//                           🎓 {item.sections?.map((s) => s.name).join(", ")}
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         ))}
//       </div>

//       {/* 🔥 CSS */}
//       <style>{`

//       .tv-container {
//         padding: 25px;
//         background: linear-gradient(135deg,#eef2ff,#f8fafc);
//       }

//       .tv-title {
//         font-size: 28px;
//         font-weight: 700;
//         margin-bottom: 20px;
//       }

//       .tv-grid {
//         display: flex;
//         flex-direction: column;
//         gap: 8px;
//       }

//       .tv-row {
//         display: grid;
//         grid-template-columns: 140px repeat(auto-fit, minmax(160px,1fr));
//       }

//       .tv-cell {
//         background: white;
//         padding: 12px;
//         border-radius: 10px;
//         min-height: 100px;
//       }

//       .tv-cell.head {
//         background: #2563eb;
//         color: white;
//         text-align: center;
//         font-weight: bold;
//       }

//       .tv-cell.day {
//         font-weight: bold;
//         background: #f1f5f9;
//       }

//       .tv-card {
//         background: #e0ecff;
//         padding: 8px;
//         border-radius: 8px;
//         margin-bottom: 6px;
//       }

//       .tv-card.lab {
//         background: #fde68a;
//       }

//       .sub {
//         font-weight: bold;
//         margin-bottom: 4px;
//       }

//       .info {
//         font-size: 12px;
//         color: #475569;
//       }

//       .free {
//         text-align: center;
//         color: #999;
//         font-weight: bold;
//       }

//       `}</style>
//     </div>
//   );
// }

// export default TimetableView;