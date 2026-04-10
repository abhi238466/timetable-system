import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GeneratePage() {

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    text: "",
    type: ""
  });

  const navigate = useNavigate();

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

      if (!res.ok) {
        throw new Error(data.error || "Server error");
      }

      if (!data.failedSubjects || data.failedSubjects.length === 0) {

        setMessage({
          text: "Timetable Generated Successfully!",
          type: "success"
        });

        setTimeout(() => {
          navigate("/timetable");
        }, 1200);

        return;
      }

      else {

        let errorText = "Some subjects could not be scheduled:\n\n";

        data.failedSubjects.forEach((f, i) => {
          errorText += `${i + 1}. ${f.subject} (${f.requiredPerWeek}/week)\n   → ${f.reason}\n\n`;
        });

        setMessage({
          text: errorText,
          type: "warning"
        });
      }

    } catch (error) {

      setMessage({
        text: `${error.message || "Error generating timetable"}`,
        type: "error"
      });

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="gen-container">

      {/* HEADER */}
      <div className="gen-header">
        <h2>⚙️ Generate Timetable</h2>
        <p>Smart scheduling using DSA-based allocation</p>
      </div>

      {/* BUTTON BOX */}
      <div className="gen-box">

        <button
          onClick={generateTimetable}
          disabled={loading}
          className={`gen-btn ${loading ? "loading" : ""}`}
        >
          {loading ? "Generating..." : "Generate Timetable"}
        </button>

      </div>

      {/* MESSAGE */}
      {message.text && (
        <div className={`gen-msg ${message.type}`}>

          <div className="msg-title">
            {message.type === "success" && "✅ Success"}
            {message.type === "warning" && "⚠️ Partial Issue"}
            {message.type === "error" && "❌ Error"}
          </div>

          <div className="msg-text">
            {message.text}
          </div>

        </div>
      )}

      {/* 🔥 CSS */}
      <style>{`

      .gen-container {
        padding: 40px;
        text-align: center;
        background: linear-gradient(135deg,#eef2ff,#f8fafc);
        min-height: 100vh;
      }

      .gen-header h2 {
        font-size: 30px;
        font-weight: 700;
        background: linear-gradient(90deg,#4f46e5,#06b6d4);
        -webkit-background-clip: text;
        color: transparent;
      }

      .gen-header p {
        color: #64748b;
        margin-top: 5px;
      }

      .gen-box {
        margin-top: 40px;
      }

      .gen-btn {
        padding: 14px 35px;
        border-radius: 12px;
        border: none;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        color: white;
        background: linear-gradient(135deg,#6366f1,#4f46e5);
        transition: 0.3s;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      }

      .gen-btn:hover {
        transform: translateY(-3px) scale(1.05);
      }

      .gen-btn.loading {
        background: #94a3b8;
        cursor: not-allowed;
      }

      /* MESSAGE BOX */
      .gen-msg {
        margin: 30px auto;
        max-width: 600px;
        padding: 20px;
        border-radius: 16px;
        text-align: left;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        animation: fadeIn 0.3s ease;
      }

      .gen-msg.success {
        background: #dcfce7;
        color: #166534;
      }

      .gen-msg.warning {
        background: #fef3c7;
        color: #92400e;
      }

      .gen-msg.error {
        background: #fee2e2;
        color: #b91c1c;
      }

      .msg-title {
        font-weight: 700;
        margin-bottom: 10px;
        font-size: 16px;
      }

      .msg-text {
        white-space: pre-line;
        line-height: 1.6;
        font-size: 14px;
      }

      @keyframes fadeIn {
        from {opacity:0; transform: translateY(10px);}
        to {opacity:1; transform: translateY(0);}
      }

      `}</style>

    </div>
  );
}

export default GeneratePage;