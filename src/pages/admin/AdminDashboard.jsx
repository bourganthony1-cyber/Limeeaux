import AdminSidebar from "../../components/AdminSidebar";
import { useDatabase } from "../../context/DatabaseContext";
import { Users, Car, DollarSign, TrendingUp, AlertCircle, Clock, CheckCircle } from "lucide-react";

const hours = ["12a","2a","4a","6a","8a","10a","12p","2p","4p","6p","8p","10p"];
const rideCounts = [4,2,1,3,18,42,65,88,102,134,98,72];
const maxCount = Math.max(...rideCounts);

export default function AdminDashboard() {
  const { rides, users } = useDatabase();

  // Compute live stats
  const completedRides = rides.filter(r => r.status === "completed");
  const totalRevenue = completedRides.reduce(
    (sum, r) => sum + parseFloat(r.fare.replace("$", "").replace(",", "")),
    0
  ).toFixed(2);

  const activeRidersCount = users.filter(u => u.role === "rider" && u.status === "active").length;
  const activeDriversCount = users.filter(u => u.role === "driver" && u.status === "active").length;
  const totalRidesCount = rides.length;

  // Generate dynamic activity feed
  const events = [];

  rides.forEach((r) => {
    const timeStr = r.time || "Just now";
    if (r.status === "completed") {
      events.push({
        icon: "🚗",
        text: `New ride completed — ${r.riderName} with ${r.driverName || "Marcus W."} (${r.fare})`,
        time: timeStr,
        color: "var(--accent-green)",
        timestamp: new Date(`${r.date} ${r.time}`).getTime() || Date.now() - 60000
      });
    } else if (r.status === "cancelled") {
      events.push({
        icon: "⚠️",
        text: `Ride ${r.id} cancelled: ${r.cancelReason || "Cancelled by user"}`,
        time: timeStr,
        color: "var(--accent-red)",
        timestamp: new Date(`${r.date} ${r.time}`).getTime() || Date.now() - 120000
      });
    } else if (r.status === "accepted") {
      events.push({
        icon: "🤝",
        text: `Driver ${r.driverName} matched with rider ${r.riderName} for Ride ${r.id}`,
        time: timeStr,
        color: "var(--accent-blue)",
        timestamp: new Date(`${r.date} ${r.time}`).getTime() || Date.now()
      });
    } else if (r.status === "requested") {
      events.push({
        icon: "🔔",
        text: `New booking request — ${r.riderName} requested ride ${r.id} (${r.fare})`,
        time: timeStr,
        color: "var(--accent-purple)",
        timestamp: new Date(`${r.date} ${r.time}`).getTime() || Date.now() + 1000
      });
    }
  });

  // Add suspended users
  users.forEach((u) => {
    if (u.status === "suspended") {
      events.push({
        icon: "🚫",
        text: `Admin action: Suspended user ${u.name} (${u.role.toUpperCase()})`,
        time: "Recently",
        color: "var(--accent-red)",
        timestamp: 0 // Place at bottom if timestamp isn't parseable
      });
    }
  });

  // Sort events newest first
  const sortedActivity = events
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 8);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <AdminSidebar />
      <div style={{ marginLeft: 260, padding: "36px 40px" }}>
        <div className="flex-between" style={{ marginBottom: 32 }}>
          <div>
            <h2 style={{ marginBottom: 4 }}>Platform Overview</h2>
            <p>Real-time insights across all operations</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: "0.875rem", color: "var(--accent-green)", fontWeight: 600 }}>Live</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Total Revenue",    value: `$${totalRevenue}`, change: "+14.2%", up: true,  icon: <DollarSign size={20} />, color: "rgba(0,212,138,0.15)",  tc: "var(--accent-green)"  },
            { label: "Active Riders",    value: activeRidersCount.toString(),    change: "+8.1%",  up: true,  icon: <Users size={20} />,      color: "rgba(61,123,255,0.15)", tc: "var(--accent-blue)"   },
            { label: "Active Drivers",   value: activeDriversCount.toString(),      change: "+3.4%",  up: true,  icon: <Car size={20} />,        color: "rgba(155,109,255,0.15)",tc: "var(--accent-purple)" },
            { label: "Total Bookings",      value: totalRidesCount.toString(),    change: "+12.1%",  up: true, icon: <TrendingUp size={20} />, color: "rgba(255,140,61,0.15)", tc: "var(--accent-orange)" },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.color, color: s.tc }}>{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-change ${s.up ? "up" : "down"}`}>
                {s.up ? "↑" : "↓"} {s.change} this week
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, marginBottom: 24 }}>

          {/* Hourly rides chart */}
          <div className="card">
            <h3 style={{ marginBottom: 24 }}>Rides by Hour — Today</h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 160, padding: "0 4px" }}>
              {hours.map((h, i) => (
                <div key={h} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: "100%", borderRadius: "4px 4px 0 0",
                    height: `${(rideCounts[i] / maxCount) * 130}px`,
                    background: rideCounts[i] === maxCount
                      ? "linear-gradient(180deg,var(--accent-orange),#e05f00)"
                      : "linear-gradient(180deg,var(--accent-blue),#2a5fd4)",
                    minHeight: 4, transition: "height 0.5s ease",
                  }} />
                  <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{h}</span>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 16, display: "flex", gap: 16,
              padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-md)",
            }}>
              <div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Peak Hour</div><div style={{ fontWeight: 700 }}>6 PM (134 rides)</div></div>
              <div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Total Bookings</div><div style={{ fontWeight: 700 }}>{totalRidesCount} rides</div></div>
              <div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Completed</div><div style={{ fontWeight: 700 }}>{completedRides.length} rides</div></div>
            </div>
          </div>

          {/* System Status */}
          <div className="card">
            <h3 style={{ marginBottom: 20 }}>System Status</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "API Gateway",      status: "Operational",  ok: true  },
                { label: "Payment Service",  status: "Operational",  ok: true  },
                { label: "Location Sync",    status: "Operational",  ok: true  },
                { label: "Broadcast Sync",   status: "Operational",  ok: true  },
                { label: "Local Database",   status: "Operational",  ok: true  },
              ].map(s => (
                <div key={s.label} className="flex-between" style={{
                  padding: "10px 14px", borderRadius: "var(--radius-md)",
                  background: "rgba(255,255,255,0.03)",
                }}>
                  <span style={{ fontSize: "0.875rem" }}>{s.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {s.ok
                      ? <CheckCircle size={14} color="var(--accent-green)" />
                      : <AlertCircle size={14} color="var(--accent-orange)" />
                    }
                    <span style={{ fontSize: "0.75rem", color: s.ok ? "var(--accent-green)" : "var(--accent-orange)", fontWeight: 600 }}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card">
          <h3 style={{ marginBottom: 20 }}>Live Activity Feed</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sortedActivity.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", padding: "10px 14px" }}>No activity logs yet.</p>
            ) : (
              sortedActivity.map((a, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "10px 14px",
                  borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.02)",
                  borderLeft: `3px solid ${a.color}`,
                }}>
                  <span style={{ fontSize: "1.1rem" }}>{a.icon}</span>
                  <span style={{ flex: 1, fontSize: "0.875rem" }}>{a.text}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    <Clock size={11} style={{ display: "inline", marginRight: 4 }} />{a.time}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
