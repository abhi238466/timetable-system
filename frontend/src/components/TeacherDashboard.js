import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaPrint,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaHome,
  FaSignOutAlt
} from "react-icons/fa";

function TeacherDashboard() {

  const loggedInTeacher = localStorage.getItem("teacherName");
  const teacherEmail = localStorage.getItem("teacherEmail");

  const storageKey = `teacherProfile_${loggedInTeacher}`;

  const [profileImg, setProfileImg] = useState(
    localStorage.getItem(storageKey) || ""
  );

  const [showProfile, setShowProfile] = useState(true);

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      localStorage.setItem(storageKey, reader.result);
      setProfileImg(reader.result);
    };

    if (file) reader.readAsDataURL(file);
  };

  const [selectedTeacher, setSelectedTeacher] = useState(loggedInTeacher);
  const [selectedDay, setSelectedDay] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [search, setSearch] = useState("");

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  useEffect(() => {
    const fetchData = async () => {

      const res = await fetch("http://localhost:5000/api/timetable");
      const data = await res.json();

      let teachersSet = new Set();
      data.forEach(t =>
        t.teacher?.forEach(tt => teachersSet.add(tt.name))
      );
      setAllTeachers([...teachersSet]);

      const filtered = data.filter(item =>
        item.teacher?.some(t => t.name === selectedTeacher)
      );

      setTimetable(filtered);
    };

    fetchData();
  }, [selectedTeacher]);

  const times = [...new Set(
    timetable.map(t => t.timeslot?.startTime + "-" + t.timeslot?.endTime)
  )];

  const logout = () => {
    localStorage.removeItem("teacherName");
    localStorage.removeItem("teacherEmail");
    window.location.href = "/login/teacher";
  };

  const goHome = () => {
    window.location.href = "/";
  };

  const printTable = () => window.print();

  return (
    <div style={styles.wrapper}>

      {/* TOGGLE */}
      <div style={styles.topBar}>
        <button onClick={() => setShowProfile(!showProfile)} style={styles.toggleBtn}>
          {showProfile ? "Hide Profile" : "Show Profile"}
        </button>
      </div>

      {/* SIDEBAR */}
      {showProfile && (
        <div style={styles.sidebar}>

          {/* ✅ PERFECT PROFILE */}
          <div style={styles.profileWrapper}>

            <label className="photoBox">

              <img
                src={
                  profileImg ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                className="profileImg"
                alt="profile"
              />

              <div className="cameraIcon">📷</div>

              <input type="file" hidden onChange={handleImage} />

            </label>

            <h3 style={{ marginTop: "12px" }}>{loggedInTeacher}</h3>
            <p style={styles.email}>{teacherEmail}</p>

          </div>

          <button style={styles.homeBtn} onClick={goHome}>
            <FaHome /> Home
          </button>

          <button style={styles.logoutBtn} onClick={logout}>
            <FaSignOutAlt /> Logout
          </button>

        </div>
      )}

      {/* MAIN */}
      <div style={styles.main}>

        <div style={styles.card}>
          <h3><FaChalkboardTeacher /> Select Teacher</h3>

          <div style={styles.searchBox}>
            <input
              placeholder="Search teacher..."
              onChange={(e)=>setSearch(e.target.value)}
              style={styles.input}
            />
            <FaSearch style={styles.icon}/>
          </div>

          <select style={styles.select} onChange={(e)=>setSelectedTeacher(e.target.value)}>
            <option>{selectedTeacher}</option>
            {allTeachers
              .filter(t => t.toLowerCase().includes(search.toLowerCase()))
              .map((t,i)=>(<option key={i}>{t}</option>))}
          </select>
        </div>

        <div style={styles.card}>
          <h3><FaCalendarAlt /> Select Day</h3>
          <select style={styles.select} onChange={(e)=>setSelectedDay(e.target.value)}>
            <option value="">Full Week</option>
            {days.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        {/* TABLE */}
        <div style={styles.card}>

          <div style={styles.header}>
            <h3>📅 Timetable</h3>
            <FaPrint onClick={printTable} style={styles.print}/>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Time</th>
                {(selectedDay ? [selectedDay] : days).map(day => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {times.map((time,i)=>(
                <tr key={i}>
                  <td>{time}</td>

                  {(selectedDay ? [selectedDay] : days).map(day => {
                    const match = timetable.find(
                      t =>
                        (t.timeslot?.startTime + "-" + t.timeslot?.endTime) === time &&
                        t.timeslot?.day === day
                    );

                    return (
                      <td key={day}>
                        {match ? (
                          <>
                            <b>{match.subject?.name}</b><br/>
                            👨‍🏫 {match.teacher?.map(t => t.name).join(", ")}<br/>
                            🏫 {match.room?.name} ({match.room?.building})<br/>
                            🎓 {match.sections?.map(s => s.name).join(", ")}
                          </>
                        ) : "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>

      {/* 🔥 HOVER FIX */}
      <style>{`
        .photoBox {
          width: 85px;
          height: 85px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #6366f1;
          position: relative;
          cursor: pointer;
          display: block;
          margin: auto;
        }

        .profileImg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .cameraIcon {
          position: absolute;
          bottom: 4px;
          right: 4px;
          background: #6366f1;
          color: white;
          border-radius: 50%;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          opacity: 0;
          transition: 0.3s;
        }

        .photoBox:hover .cameraIcon {
          opacity: 1;
        }
      `}</style>

    </div>
  );
}

export default TeacherDashboard;

const styles = {
  wrapper:{ display:"flex", minHeight:"100vh" },
  topBar:{ position:"fixed", top:"10px", right:"20px", zIndex:1000 },
  toggleBtn:{ padding:"8px 15px", borderRadius:"8px", background:"#6366f1", color:"#fff", border:"none", cursor:"pointer" },
  sidebar:{ width:"250px", background:"#0f172a", color:"#fff", padding:"20px", textAlign:"center" },
  profileWrapper:{ marginBottom:"20px" },
  email:{ fontSize:"12px", opacity:0.7 },
  homeBtn:{ marginTop:"15px", width:"100%", padding:"10px", background:"#22c55e", border:"none", color:"#fff", borderRadius:"8px", cursor:"pointer" },
  logoutBtn:{ marginTop:"10px", width:"100%", padding:"10px", background:"#ef4444", border:"none", color:"#fff", borderRadius:"8px", cursor:"pointer" },
  main:{ flex:1, padding:"30px" },
  card:{ background:"#fff", padding:"20px", borderRadius:"15px", marginBottom:"20px" },
  searchBox:{ position:"relative" },
  input:{ width:"100%", padding:"10px" },
  icon:{ position:"absolute", right:"10px", top:"10px" },
  select:{ width:"100%", marginTop:"10px", padding:"10px" },
  header:{ display:"flex", justifyContent:"space-between" },
  table:{ width:"100%", marginTop:"15px", borderCollapse:"collapse" },
  print:{ cursor:"pointer" }
};