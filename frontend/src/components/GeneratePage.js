import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ NEW

function GeneratePage() {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // ✅ NEW

  const generateTimetable = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("http://localhost:5000/api/timetable/generate");
      const data = await res.json();

      setMessage("✅ Timetable Generated Successfully!");

      // 🔥 AUTO REDIRECT
      setTimeout(() => {
        navigate("/timetable");
      }, 1000);

    } catch (error) {
      setMessage("❌ Error generating timetable");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div>

      <h2>⚙️ Generate Timetable</h2>

      <button
        onClick={generateTimetable}
        style={{
          padding: "12px 25px",
          background: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        {loading ? "Generating..." : "Generate Timetable"}
      </button>

      {message && (
        <p style={{
          marginTop: "20px",
          fontWeight: "bold",
          color: message.includes("Error") ? "red" : "green"
        }}>
          {message}
        </p>
      )}

    </div>

  );
}

export default GeneratePage;