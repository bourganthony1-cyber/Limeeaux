import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Car, MapPin, Clock, LogOut, User } from "lucide-react";

export default function RiderNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: 64,
      background: "rgba(10,14,26,0.9)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "linear-gradient(135deg,var(--accent-blue),var(--accent-green))",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Car size={16} color="#fff" />
        </div>
        <span style={{ fontWeight: 800, fontSize: "1rem" }}>Lumiere</span>
      </div>

      <div style={{ display: "flex", gap: 4 }}>
        {[
          { to: "/rider",          icon: <Car size={15} />,      label: "Book" },
          { to: "/rider/tracking", icon: <MapPin size={15} />,   label: "Track" },
          { to: "/rider/history",  icon: <Clock size={15} />,    label: "History" },
        ].map(link => (
          <NavLink key={link.to} to={link.to} end={link.to === "/rider"} style={({ isActive }) => ({
            display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
            borderRadius: "var(--radius-md)", fontSize: "0.875rem", fontWeight: 500,
            color: isActive ? "var(--accent-blue)" : "var(--text-secondary)",
            background: isActive ? "rgba(61,123,255,0.1)" : "transparent",
            transition: "var(--transition)",
          })}>
            {link.icon} {link.label}
          </NavLink>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg,var(--accent-blue),var(--accent-purple))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.875rem", fontWeight: 700,
          }}>
            {user?.displayName?.[0] || "R"}
          </div>
          <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            {user?.displayName || "Rider"}
          </span>
        </div>
        <button className="btn btn-ghost btn-icon-only btn-sm" onClick={handleLogout} title="Sign out">
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}
