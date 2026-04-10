import React, { useEffect, useState } from "react";

/*
USAGE:

import Toast from "./Toast";

<Toast message="Login success ✅" type="success" />

type = success | error | info
*/

function Toast({ message, type = "success" }) {

  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  const styles = {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "15px 20px",
    borderRadius: "10px",
    color: "white",
    fontWeight: "500",
    zIndex: 9999,
    minWidth: "250px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    animation: "slideIn 0.4s ease"
  };

  const typeStyles = {
    success: {
      background: "linear-gradient(45deg,#22c55e,#16a34a)"
    },
    error: {
      background: "linear-gradient(45deg,#ef4444,#dc2626)"
    },
    info: {
      background: "linear-gradient(45deg,#3b82f6,#2563eb)"
    }
  };

  return (
    <div style={{ ...styles, ...typeStyles[type] }}>
      {message}

      <style>
        {`
        @keyframes slideIn {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        `}
      </style>
    </div>
  );
}

export default Toast;