import { useState } from "react";
import DriverNav from "../../components/DriverNav";
import { DollarSign, TrendingUp, Clock, Star } from "lucide-react";

const weeks = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const earnings = [52, 88, 64, 93, 120, 145, 87];
const maxEarning = Math.max(...earnings);

const payouts = [
  { date: "May 13 – May 19, 2026", amount: "$649.00", status: "Processing", trips: 42 },
  { date: "May  6 – May 12, 2026", amount: "$581.50", status: "Paid",       trips: 38 },
  { date: "Apr 29 – May  5, 2026", amount: "$720.25", status: "Paid",       trips: 47 },
];

export default function DriverEarnings() {
  const [period, setPeriod] = useState("week");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <DriverNav />
      <div style={{ paddingTop: 64 }}>
        <div className="container" style={{ paddingTop: 36, paddingBottom: 60 }}>
          <div className="flex-between" style={{ marginBottom: 28 }}>
            <div>
              <h2 style={{ marginBottom: 4 }}>Earnings</h2>
              <p>Your income breakdown</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["week","month","year"].map(p => (
                <button key={p} className={`btn btn-sm ${period===p?"btn-primary":"btn-outline"}`}
                  onClick={() => setPeriod(p)}>
                  {p.charAt(0).toUpperCase()+p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Top Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
            {[
              { label: "This Week",    value: "$649",  sub: "+12% vs last week", icon: <DollarSign size={20} />, up: true,  color: "rgba(0,212,138,0.15)", tc: "var(--accent-green)"  },
              { label: "This Month",   value: "$2,341",sub: "+8% vs last month", icon: <TrendingUp size={20} />, up: true,  color: "rgba(61,123,255,0.15)",tc: "var(--accent-blue)"   },
              { label: "Total Hours",  value: "38h",   sub: "This week",          icon: <Clock size={20} />,     up: null,  color: "rgba(155,109,255,0.15)",tc:"var(--accent-purple)" },
              { label: "Avg. Rating",  value: "4.92",  sub: "Based on 2,341 trips",icon:<Star size={20} />,     up: null,  color: "rgba(255,215,0,0.12)",  tc: "#FFD700"              },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon" style={{ background: s.color, color: s.tc }}>{s.icon}</div>
                <div className="stat-value" style={{ color: s.tc }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
                {s.sub && (
                  <div className={`stat-change ${s.up === true ? "up" : s.up === false ? "down" : ""}`}
                    style={{ color: s.up === null ? "var(--text-muted)" : undefined }}>
                    {s.up === true ? "↑" : s.up === false ? "↓" : ""} {s.sub}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

            {/* Bar Chart */}
            <div className="card">
              <h3 style={{ marginBottom: 24 }}>Daily Earnings — This Week</h3>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 180, padding: "0 8px" }}>
                {weeks.map((day, i) => (
                  <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                      ${earnings[i]}
                    </span>
                    <div
                      title={`$${earnings[i]}`}
                      style={{
                        width: "100%", borderRadius: "6px 6px 0 0",
                        height: `${(earnings[i] / maxEarning) * 140}px`,
                        background: i === 5
                          ? "linear-gradient(180deg, var(--accent-green), #00a86b)"
                          : "linear-gradient(180deg, var(--accent-blue), #2a5fd4)",
                        transition: "height 0.4s ease",
                        minHeight: 8,
                      }}
                    />
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{day}</span>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 20, padding: "14px 18px",
                background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-md)",
                display: "flex", justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Weekly Total</div>
                  <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--accent-green)" }}>$649.00</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Avg per day</div>
                  <div style={{ fontWeight: 700, fontSize: "1.25rem" }}>$92.71</div>
                </div>
              </div>
            </div>

            {/* Payout Schedule */}
            <div className="card">
              <h3 style={{ marginBottom: 20 }}>Payout History</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {payouts.map(p => (
                  <div key={p.date} style={{
                    padding: "14px 16px", borderRadius: "var(--radius-md)",
                    background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
                  }}>
                    <div className="flex-between" style={{ marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: "1.0625rem", color: "var(--accent-green)" }}>
                        {p.amount}
                      </span>
                      <span className={`badge ${p.status === "Paid" ? "badge-green" : "badge-orange"}`}>
                        {p.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{p.date}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>{p.trips} trips</div>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 16, padding: "12px 16px",
                background: "rgba(61,123,255,0.08)", borderRadius: "var(--radius-md)",
                fontSize: "0.8125rem", color: "var(--text-secondary)",
              }}>
                💳 Payouts sent every Monday to your linked bank account.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
