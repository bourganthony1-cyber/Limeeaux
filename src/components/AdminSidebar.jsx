import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Users, Car, LogOut, Settings, Shield } from "lucide-react";

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/admin",       icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { to: "/admin/users", icon: <Users size={18} />,           label: "Users" },
    { to: "/admin/rides", icon: <Car size={18} />,             label: "Rides" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg,var(--accent-blue),var(--accent-purple))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Shield size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.9375rem", lineHeight: 1.2 }}>Limeeaux</div>
            <div style={{ fontSize: "0.7rem", color: "var(--accent-purple)", fontWeight: 600 }}>ADMIN</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", padding: "0 14px", marginBottom: 8, letterSpacing: "1px" }}>
          NAVIGATION
        </div>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === "/admin"} style={{ textDecoration: "none" }}>
            {({ isActive }) => (
              <div className={`sidebar-item ${isActive ? "active" : ""}`}>
                <span className="sidebar-icon">{l.icon}</span>
                {l.label}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
        <div className="sidebar-item" style={{ marginBottom: 4 }}>
          <Settings size={18} /> Settings
        </div>
        <button className="sidebar-item" onClick={() => { logout(); navigate("/"); }}
          style={{ color: "var(--accent-red)", width: "100%" }}>
          <LogOut size={18} /> Sign Out
        </button>
        <div style={{ padding: "12px 14px", marginTop: 8 }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>{user?.displayName || "Admin"}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{user?.email || "admin@limeeaux.app"}</div>
        </div>
      </div>
    </aside>
  );
}
