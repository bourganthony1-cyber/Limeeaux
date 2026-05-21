import { useState, useMemo } from "react";
import RiderNav from "../../components/RiderNav";
import { Star, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDatabase } from "../../context/DatabaseContext";

const statusColor = {
  completed: "badge-green",
  cancelled: "badge-red",
  requested: "badge-orange",
  accepted: "badge-blue",
};

const typeLabels = {
  standard: "Limeeaux",
  comfort: "Comfort",
  xl: "RideXL",
  green: "EcoRide",
};

export default function RiderHistory() {
  const { user } = useAuth();
  const { rides } = useDatabase();
  const [filter, setFilter] = useState("all");

  const myRides = useMemo(
    () =>
      rides.filter(
        (r) =>
          r.riderId === user?.uid &&
          (r.status === "completed" || r.status === "cancelled")
      ),
    [rides, user]
  );

  const filtered = useMemo(() => {
    if (filter === "all") return myRides;
    if (filter === "eco") return myRides.filter((r) => r.type === "green");
    return myRides.filter((r) => r.type === filter);
  }, [myRides, filter]);

  const total = myRides
    .reduce((sum, r) => sum + parseFloat(String(r.fare).replace("$", "")), 0)
    .toFixed(2);

  const avgRating = useMemo(() => {
    const rated = myRides.filter((r) => r.rating != null);
    if (rated.length === 0) return "—";
    const avg = rated.reduce((s, r) => s + r.rating, 0) / rated.length;
    return `${avg.toFixed(1)} ⭐`;
  }, [myRides]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <RiderNav />
      <div style={{ paddingTop: 64 }}>
        <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
          <div className="flex-between" style={{ marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h2 style={{ marginBottom: 4 }}>Ride History</h2>
              <p>
                You&apos;ve spent{" "}
                <strong style={{ color: "var(--accent-blue)" }}>${total}</strong> across{" "}
                {myRides.length} trips
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["all", "standard", "comfort", "green", "xl"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline"}`}
                >
                  {f === "all" ? "All" : f === "green" ? "Eco" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[
              { label: "Total Trips", value: myRides.length, icon: "🚗", color: "rgba(61,123,255,0.12)" },
              { label: "Total Spent", value: `$${total}`, icon: "💳", color: "rgba(0,212,138,0.12)" },
              { label: "Avg. Rating", value: avgRating, icon: "⭐", color: "rgba(255,215,0,0.12)" },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon" style={{ background: s.color, fontSize: "1.25rem" }}>
                  {s.icon}
                </div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: 48 }}>
                <p style={{ color: "var(--text-muted)" }}>No trips yet. Book your first ride from the home screen.</p>
              </div>
            ) : (
              filtered.map((ride) => (
                <div
                  key={ride.id}
                  className="card"
                  style={{ display: "flex", alignItems: "center", gap: 20 }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      flexShrink: 0,
                      background: "rgba(61,123,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                    }}
                  >
                    🚗
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 600 }}>{ride.from}</span>
                      <ChevronRight size={14} color="var(--text-muted)" />
                      <span style={{ fontWeight: 600 }}>{ride.to}</span>
                      <span className={`badge ${statusColor[ride.status] || "badge-blue"}`}>
                        {ride.status}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        color: "var(--text-muted)",
                        fontSize: "0.8125rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span>
                        {ride.date} · {ride.time}
                      </span>
                      {ride.driverName && <span>· {ride.driverName}</span>}
                      <span>· {typeLabels[ride.type] || ride.type}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "1.0625rem", marginBottom: 4 }}>{ride.fare}</div>
                    {ride.rating != null && (
                      <div style={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < ride.rating ? "#FFD700" : "transparent"}
                            color="#FFD700"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
