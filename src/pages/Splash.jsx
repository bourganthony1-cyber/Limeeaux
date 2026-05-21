import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 3;
      });
    }, 40);
    // Navigate after 2 seconds
    const timer = setTimeout(() => navigate("/login"), 2400);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [navigate]);

  return (
    <div style={{
      minHeight: "100vh", background: "#121414",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      fontFamily: "Inter, sans-serif",
    }}>
      {/* Bokeh city background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKTK-KqnaJuRlp6U7p-SNFl9cSeHb4lQtJES3p-DFqnIV4ymminpAG4H_FKp64l_JbCw0TAFi200qm7uxSXh6UQ_nuyGUXe5Raker_OKymHiJGnZrsGECcnoKPZz6HwOEyTHYfiFU78Wr1rmZhjTsmQAQDdMJKNymBystaGg9q4HFKuGqrPV0EuqwtG4_ik7Tgh300rO73dakA0TMZ4ygiCPHKZFDy6fA_hFeNM5sUBLjAK5l8sKPBGpFlMquDgZYBLLfvzhVERKk"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(12,15,15,0.85)", backdropFilter: "blur(2px)",
        }} />
      </div>

      {/* Center branding */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", flex: 1, justifyContent: "center" }}>
        {/* Logo icon */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(30,32,32,0.3)", backdropFilter: "blur(24px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 24,
          boxShadow: "0 0 30px rgba(46,91,255,0.2)",
        }}>
          {/* Location pin SVG */}
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#b8c3ff"/>
            <circle cx="12" cy="9" r="2.5" fill="#121414"/>
          </svg>
        </div>

        {/* App name */}
        <h1 style={{
          fontSize: 48, fontWeight: 700, letterSpacing: "-0.02em",
          color: "#e2e2e2", margin: 0,
          textShadow: "0 0 40px rgba(46,91,255,0.6), 0 0 20px rgba(184,195,255,0.3)",
        }}>
          Limeeaux
        </h1>
      </div>

      {/* Loading bar */}
      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", padding: "0 40px 48px",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <div style={{ width: 192, height: 2, background: "#333535", borderRadius: 99, overflow: "hidden", marginBottom: 16 }}>
          <div style={{
            height: "100%", borderRadius: 99,
            width: `${progress}%`,
            background: "#b8c3ff",
            boxShadow: "0 0 10px rgba(46,91,255,0.8)",
            transition: "width 0.05s linear",
          }} />
        </div>
        <p style={{
          fontSize: 12, fontWeight: 600, color: "#c4c5d9",
          textTransform: "uppercase", letterSpacing: "0.08em", margin: 0,
        }}>
          Initializing
        </p>
      </div>
    </div>
  );
}
