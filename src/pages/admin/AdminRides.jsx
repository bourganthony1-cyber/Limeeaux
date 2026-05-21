import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { useDatabase } from "../../context/DatabaseContext";
import { Search, MapPin, Navigation, Star, Trash2 } from "lucide-react";

const statusMap = {
  requested:   { label: "Requested",   cls: "badge-orange" },
  accepted:    { label: "Accepted",    cls: "badge-blue"   },
  enroute:     { label: "En Route",    cls: "badge-blue"   },
  arriving:    { label: "Arriving",    cls: "badge-blue"   },
  arrived:     { label: "Arrived",     cls: "badge-green"  },
  completed:   { label: "Completed",   cls: "badge-green"  },
  cancelled:   { label: "Cancelled",   cls: "badge-red"    },
};

export default function AdminRides() {
  const { rides, cancelRide } = useDatabase();
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");

  const filtered = rides.filter(r => {
    const q = search.toLowerCase();
    const idMatch = r.id ? r.id.toLowerCase().includes(q) : false;
    const riderMatch = r.riderName ? r.riderName.toLowerCase().includes(q) : false;
    const driverMatch = r.driverName ? r.driverName.toLowerCase().includes(q) : false;
    const matchS = idMatch || riderMatch || driverMatch;

    const matchSt =
      statusF === "all"
        ? true
        : statusF === "active"
          ? r.status !== "completed" && r.status !== "cancelled"
          : r.status === statusF;

    return matchS && matchSt;
  });

  const totalRevenue = rides
    .filter(r => r.status === "completed")
    .reduce((s, r) => s + parseFloat(r.fare.replace("$", "").replace(",", "")), 0)
    .toFixed(2);

  const handleCancelActiveRide = (rideId) => {
    if (confirm(`Are you sure you want to cancel ride ${rideId}? This will instantly notify both the rider and the driver tabs.`)) {
      cancelRide(rideId, "administrator");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <AdminSidebar />
      <div style={{ marginLeft: 260, padding: "36px 40px" }}>
        <div className="flex-between" style={{ marginBottom: 32 }}>
          <div>
            <h2 style={{ marginBottom: 4 }}>All Rides</h2>
            <p>{rides.length} rides · <strong style={{ color: "var(--accent-green)" }}>${totalRevenue}</strong> total revenue</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Active / Requested", count: rides.filter(r => r.status !== "completed" && r.status !== "cancelled").length, color: "var(--accent-blue)"   },
            { label: "Completed",   count: rides.filter(r => r.status === "completed").length,   color: "var(--accent-green)"  },
            { label: "Cancelled",   count: rides.filter(r => r.status === "cancelled").length,   color: "var(--accent-red)"    },
          ].map(s => (
            <div key={s.label} className="card" style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: s.color }}>{s.count}</div>
              <div style={{ color: "var(--text-secondary)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input className="input" placeholder="Search ride ID, rider, driver…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 42 }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["all", "active", "completed", "cancelled"].map(s => (
              <button key={s} className={`btn btn-sm ${statusF===s?"btn-primary":"btn-outline"}`}
                onClick={() => setStatusF(s)}>
                {s === "all" ? "All" : s === "active" ? "Active" : s.charAt(0).toUpperCase()+s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Ride ID</th>
                <th>Rider</th>
                <th>Driver</th>
                <th>Route</th>
                <th>Fare</th>
                <th>Status</th>
                <th>Date / Time</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const st = statusMap[r.status] || { label: r.status, cls: "badge-blue" };
                const isActive = r.status !== "completed" && r.status !== "cancelled";

                return (
                  <tr key={r.id}>
                    <td style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--accent-blue)", fontSize: "0.875rem" }}>{r.id}</td>
                    <td style={{ fontWeight: 500 }}>{r.riderName}</td>
                    <td style={{ fontWeight: 500 }}>{r.driverName || <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontStyle: "italic" }}>Unassigned</span>}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem" }}>
                        <MapPin size={12} color="var(--accent-blue)" />
                        <span style={{ color: "var(--text-secondary)" }}>{r.from}</span>
                        <span style={{ color: "var(--text-muted)" }}>&rarr;</span>
                        <Navigation size={12} color="var(--accent-red)" />
                        <span style={{ color: "var(--text-secondary)" }}>{r.to}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700 }}>{r.fare}</td>
                    <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "0.8125rem" }}>{r.date} · {r.time}</td>
                    <td>
                      {r.rating
                        ? <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Star size={13} fill="#FFD700" color="#FFD700" />
                            <span style={{ fontWeight: 600 }}>{r.rating}</span>
                          </div>
                        : <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>—</span>
                      }
                    </td>
                    <td>
                      {isActive ? (
                        <button 
                          className="btn btn-sm" 
                          style={{ 
                            padding: "6px 10px", 
                            background: "rgba(255,77,106,0.1)", 
                            color: "var(--accent-red)", 
                            border: "1px solid rgba(255,77,106,0.3)" 
                          }}
                          onClick={() => handleCancelActiveRide(r.id)}
                          title="Cancel Active Ride"
                        >
                          <Trash2 size={13} />
                        </button>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>—</span>
                      )}
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
