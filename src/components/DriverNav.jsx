import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Car, DollarSign, Navigation, LogOut } from "lucide-react";

export default function DriverNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
          background: "linear-gradient(135deg,var(--accent-green),#00a86b)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Navigation size={16} color="#000" />
        </div>
        <span style={{ fontWeight: 800, fontSize: "1rem" }}>RideFlow Driver</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {[
          { to: "/driver",          icon: <Car size={15} />,        label: "Dashboard" },
          { to: "/driver/map",      icon: <Navigation size={15} />, label: "Navigation" },
          { to: "/driver/earnings", icon: <DollarSign size={15} />, label: "Earnings" },
        ].map(link => (
          <NavLink key={link.to} to={link.to} end={link.to === "/driver"} style={({ isActive }) => ({
            display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
            borderRadius: "var(--radius-md)", fontSize: "0.875rem", fontWeight: 500,
            color: isActive ? "var(--accent-green)" : "var(--text-secondary)",
            background: isActive ? "rgba(0,212,138,0.1)" : "transparent",
            transition: "var(--transition)",
          })}>
            {link.icon} {link.label}
          </NavLink>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{user?.displayName || "Driver"}</span>
        <button className="btn btn-ghost btn-icon-only btn-sm" onClick={() => { logout(); navigate("/"); }}>
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}
