import React, { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { useDatabase } from "../../context/DatabaseContext";
import { useAuth } from "../../context/AuthContext";
import { Search, Shield, UserCheck, UserX, Star } from "lucide-react";

const roleColor  = { admin: "badge-purple", driver: "badge-blue", rider: "badge-green" };
const statusColor = { active: "badge-green", suspended: "badge-red" };

export default function AdminUsers() {
  const { users, suspendUser, activateUser } = useDatabase();
  const { user: currentAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = users.filter(u => {
    const nameMatch = u.name ? u.name.toLowerCase().includes(search.toLowerCase()) : false;
    const emailMatch = u.email ? u.email.toLowerCase().includes(search.toLowerCase()) : false;
    const matchSearch = nameMatch || emailMatch;
    const matchRole   = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleToggleStatus = (uid, currentStatus) => {
    if (uid === currentAdmin?.uid) {
      alert("Security rule: You cannot suspend your own admin account.");
      return;
    }
    
    if (currentStatus === "active") {
      if (confirm("Are you sure you want to suspend this user? They will be logged out and their active rides cancelled immediately.")) {
        suspendUser(uid);
      }
    } else {
      activateUser(uid);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <AdminSidebar />
      <div style={{ marginLeft: 260, padding: "36px 40px" }}>
        <div className="flex-between" style={{ marginBottom: 32 }}>
          <div>
            <h2 style={{ marginBottom: 4 }}>Users</h2>
            <p>{users.length} total users registered</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => alert("Mock feature: User creation modal.")}>
            <UserCheck size={15} /> Add User
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input className="input" placeholder="Search users…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 42 }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["all","rider","driver","admin"].map(r => (
              <button key={r} className={`btn btn-sm ${roleFilter===r?"btn-primary":"btn-outline"}`}
                onClick={() => setRoleFilter(r)}>
                {r.charAt(0).toUpperCase()+r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Trips</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const isSelf = u.uid === currentAdmin?.uid;
                return (
                  <tr key={u.uid}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                          background: `linear-gradient(135deg, var(--accent-blue), var(--accent-purple))`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontWeight: 700, fontSize: "0.875rem",
                        }}>
                          {u.name ? u.name[0].toUpperCase() : "U"}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
                            {u.name} {isSelf && <span style={{ fontSize: "0.75rem", color: "var(--accent-purple)", fontWeight: 600 }}>(You)</span>}
                          </div>
                          <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${roleColor[u.role] || "badge-blue"}`}>{u.role}</span></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {u.status === "active" && <span className="pulse-dot" />}
                        <span className={`badge ${statusColor[u.status] || "badge-blue"}`}>{u.status}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{u.joined || "May 2026"}</td>
                    <td style={{ fontWeight: 600 }}>{u.trips !== undefined ? u.trips : 0}</td>
                    <td>
                      {u.role !== "admin" && u.rating !== undefined ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Star size={13} fill="#FFD700" color="#FFD700" />
                          <span style={{ fontWeight: 600 }}>{u.rating}</span>
                        </div>
                      ) : "—"}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: "6px 10px" }} onClick={() => alert("Mock feature: User edit modal.")}>Edit</button>
                        <button 
                          className="btn btn-sm" 
                          style={{ 
                            padding: "6px 10px", 
                            background: u.status === "active" ? "rgba(255,77,106,0.1)" : "rgba(0,212,138,0.1)", 
                            color: u.status === "active" ? "var(--accent-red)" : "var(--accent-green)", 
                            border: u.status === "active" ? "1px solid rgba(255,77,106,0.3)" : "1px solid rgba(0,212,138,0.3)",
                            opacity: isSelf ? 0.5 : 1,
                            cursor: isSelf ? "not-allowed" : "pointer"
                          }}
                          disabled={isSelf}
                          onClick={() => handleToggleStatus(u.uid, u.status)}
                          title={isSelf ? "You cannot suspend yourself" : u.status === "active" ? "Suspend user" : "Reactivate user"}
                        >
                          {u.status === "active" ? <UserX size={13} /> : <UserCheck size={13} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
