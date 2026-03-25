import React, { useEffect, useState } from "react";

function TimetableView() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/timetable")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (

    <div>

      <h2>Weekly Timetable</h2>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Day</th>
            <th>Time</th>
            <th>Subject</th>
            <th>Teacher</th>
            <th>Room</th>
          </tr>
        </thead>

        <tbody>

          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.timeslot.day}</td>
              <td>{item.timeslot.startTime} - {item.timeslot.endTime}</td>
              <td>{item.subject.name}</td>
              <td>{item.teacher.name}</td>
              <td>{item.room.name}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>

  );

}

export default TimetableView;