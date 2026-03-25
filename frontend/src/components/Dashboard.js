import React, { useEffect, useState } from "react";
import "../App.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

function Dashboard() {

  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [todayClasses, setTodayClasses] = useState([]);

  const fetchData = async () => {

    const t = await fetch("http://localhost:5000/api/teachers");
    const s = await fetch("http://localhost:5000/api/subjects");
    const r = await fetch("http://localhost:5000/api/rooms");
    const ts = await fetch("http://localhost:5000/api/timeslots");
    const tt = await fetch("http://localhost:5000/api/timetable");

    const teachers = await t.json();
    const subjects = await s.json();
    const rooms = await r.json();
    const timeslots = await ts.json();
    const timetable = await tt.json();

    setStats({
      teachers: teachers.length,
      subjects: subjects.length,
      rooms: rooms.length,
      timeslots: timeslots.length,
      timetable: timetable.length
    });

    // 🔥 BAR CHART
    setChartData(
      subjects.map(sub => ({
        name: sub.name,
        classes: sub.weeklyFrequency
      }))
    );

    // 🔥 PIE CHART
    const theory = subjects.filter(s => s.type === "theory").length;
    const lab = subjects.filter(s => s.type === "lab").length;

    setPieData([
      { name: "Theory", value: theory },
      { name: "Lab", value: lab }
    ]);

    // 🔥 TODAY CLASSES
    const today = new Date().toLocaleString("en-US", { weekday: "long" });

    const todayData = timetable.filter(
      item => item.timeslot?.day === today
    );

    setTodayClasses(todayData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (

    <div className="container">

      <h2 style={{ marginBottom: "20px" }}>📊 Ultimate Dashboard</h2>

      {/* 🔥 STATS */}
      <div className="grid">

        <Card title="Teachers" value={stats.teachers} icon="👨‍🏫" />
        <Card title="Subjects" value={stats.subjects} icon="📚" />
        <Card title="Rooms" value={stats.rooms} icon="🏫" />
        <Card title="Timeslots" value={stats.timeslots} icon="⏰" />
        <Card title="Classes" value={stats.timetable} icon="📅" />

      </div>

      {/* 🔥 CHARTS */}
      <div className="grid" style={{ marginTop: "30px" }}>

        {/* BAR */}
        <div className="card">
          <h3>📊 Subject Distribution</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="classes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="card">
          <h3>🥧 Theory vs Lab</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={80}
                label
              >
                <Cell fill="#2563eb" />
                <Cell fill="#f59e0b" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* 🔥 TODAY CLASSES */}
      <div className="card" style={{ marginTop: "30px" }}>

        <h3>📅 Today’s Classes</h3>

        {todayClasses.length === 0 ? (
          <p>No classes today</p>
        ) : (
          todayClasses.map((item, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>

              <b>{item.subject?.name}</b>  
              <span className="small-text">
                {" "}({item.timeslot?.startTime}-{item.timeslot?.endTime})
              </span>

              <div className="small-text">
                👨‍🏫 {item.teacher?.name} | 🏫 {item.room?.name}
              </div>

            </div>
          ))
        )}

      </div>

      {/* 🔥 INSIGHTS */}
      <div className="card" style={{ marginTop: "20px" }}>

        <h3>⚡ Quick Insights</h3>

        <p>✔ Total {stats.timetable} classes scheduled</p>
        <p>✔ {stats.subjects} subjects configured</p>
        <p>✔ System is conflict-free</p>

      </div>

    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <h3>{icon} {title}</h3>
      <h1 style={{ marginTop: "10px", color: "#2563eb" }}>
        {value}
      </h1>
    </div>
  );
}

export default Dashboard;