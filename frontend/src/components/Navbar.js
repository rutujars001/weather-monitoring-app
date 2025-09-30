import React, { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-title">
        <h1>Path-Based Weather</h1>
        <span className="nav-subtitle">Korti → Pandharpur Weather Comparison</span>
      </div>
      <div className="nav-right">
        <span className="nav-time">{currentTime}</span>
        <button className="nav-refresh" title="Refresh">
          &#x21bb;
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
