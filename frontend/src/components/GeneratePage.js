import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GeneratePage() {

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    text: "",
    type: "" // success | error | warning
  });

  const navigate = useNavigate();

  // 🔥 AUTO HIDE MESSAGE
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const generateTimetable = async () => {
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const res = await fetch("http://localhost:5000/api/timetable/generate");
      const data = await res.json();

      // ❌ API ERROR
      if (!res.ok) {
        throw new Error(data.error || "Server error");
      }

      // ✅ SUCCESS (NO FAIL)
      if (!data.failedSubjects || data.failedSubjects.length === 0) {

        setMessage({
          text: "✅ Timetable Generated Successfully!",
          type: "success"
        });

        setTimeout(() => {
          navigate("/timetable");
        }, 1200);

        return;
      }

      // ⚠️ PARTIAL FAIL (DETAILED MESSAGE)
      else {

        let errorText = "⚠️ Some subjects could not be scheduled:\n\n";

        data.failedSubjects.forEach((f, i) => {
          errorText += `${i + 1}. ${f.subject} (${f.requiredPerWeek}/week) → ${f.reason}\n`;
        });

        setMessage({
          text: errorText,
          type: "warning"
        });
      }

    } catch (error) {

      setMessage({
        text: `❌ ${error.message || "Error generating timetable"}`,
        type: "error"
      });

    } finally {
      setLoading(false);
    }
  };

  return (

    <div>

      <h2>⚙️ Generate Timetable</h2>

      <button
        onClick={generateTimetable}
        disabled={loading}
        style={{
          padding: "12px 25px",
          background: loading ? "#94a3b8" : "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "16px"
        }}
      >
        {loading ? "Generating..." : "Generate Timetable"}
      </button>

      {/* 🔥 MESSAGE BOX */}
      {message.text && (
        <div style={{
          marginTop: "20px",
          padding: "15px",
          borderRadius: "8px",
          fontWeight: "500",
          whiteSpace: "pre-line", // 🔥 IMPORTANT (line break fix)
          background:
            message.type === "success" ? "#dcfce7" :
            message.type === "warning" ? "#fef3c7" :
            "#fee2e2",
          color:
            message.type === "success" ? "#166534" :
            message.type === "warning" ? "#92400e" :
            "#b91c1c"
        }}>
          {message.text}
        </div>
      )}

    </div>
  );
}

export default GeneratePage;