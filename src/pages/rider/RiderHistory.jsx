import React, { useState } from "react";
import { Link } from "react-router-dom";
import RiderNav from "../../components/RiderNav";
import { MapPin, Navigation, Star, ChevronRight, Filter } from "lucide-react";

const rides = [
  { id: 1, date: "May 19, 2026", time: "9:14 AM",  from: "Home",              to: "Downtown Office",  fare: "$11.20", rating: 5, driver: "Marcus W.", type: "Lumiere",  status: "completed" },
  { id: 2, date: "May 18, 2026", time: "6:45 PM",  from: "Downtown Office",   to: "Airport T-B",      fare: "$22.80", rating: 4, driver: "Priya K.",  type: "Comfort",   status: "completed" },
  { id: 3, date: "May 17, 2026", time: "11:00 AM", from: "Airport T-B",       to: "Hotel Grand",      fare: "$18.50", rating: 5, driver: "Luis R.",   type: "Comfort",   status: "completed" },
  { id: 4, date: "May 15, 2026", time: "2:30 PM",  from: "Coffee District",   to: "Midtown Mall",     fare: "$7.90",  rating: 3, driver: "Aisha M.",  type: "Lumiere",  status: "completed" },
  { id: 5, date: "May 14, 2026", time: "8:00 AM",  from: "Home",              to: "Gym Central",      fare: "$5.40",  rating: 5, driver: "Carlos D.", type: "EcoRide",   status: "completed" },
  { id: 6, date: "May 12, 2026", time: "10:45 PM", from: "Skybar Rooftop",    to: "Home",             fare: "$13.60", rating: 4, driver: "Sam T.",    type: "Lumiere",  status: "completed" },
];

const statusColor = { completed: "badge-green", cancelled: "badge-red" };

export default function RiderHistory() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? rides : rides.filter(r => r.type.toLowerCase().includes(filter));
  const total = rides.reduce((sum, r) => sum + parseFloat(r.fare.replace("$", "")), 0).toFixed(2);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <RiderNav />
      <div style={{ paddingTop: 64 }}>
        <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>

          {/* Header */}
          <div className="flex-between" style={{ marginBottom: 32 }}>
            <div>
              <h2 style={{ marginBottom: 4 }}>Ride History</h2>
              <p>You've spent <strong style={{ color: "var(--accent-blue)" }}>${total}</strong> across {rides.length} trips</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["all", "comfort", "eco", "xl"].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline"}`}>
                  {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
            {[
              { label: "Total Trips",  value: rides.length,    icon: "🚗", color: "rgba(61,123,255,0.12)" },
              { label: "Total Spent",  value: `$${total}`,     icon: "💳", color: "rgba(0,212,138,0.12)" },
              { label: "Avg. Rating",  value: "4.5 ⭐",        icon: "⭐", color: "rgba(255,215,0,0.12)" },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon" style={{ background: s.color, fontSize: "1.25rem" }}>
                  {s.icon}
                </div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Rides List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(ride => (
              <div key={ride.id} className="card" style={{ display: "flex", alignItems: "center", gap: 20, cursor: "pointer" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: "rgba(61,123,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem",
                }}>
                  🚗
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{ride.from}</span>
                    <ChevronRight size={14} color="var(--text-muted)" />
                    <span style={{ fontWeight: 600 }}>{ride.to}</span>
                    <span className={`badge ${statusColor[ride.status]}`} style={{ marginLeft: 4 }}>
                      {ride.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                    <span>{ride.date} · {ride.time}</span>
                    <span>·</span>
                    <span>{ride.driver}</span>
                    <span>·</span>
                    <span>{ride.type}</span>
                  </div>
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "1.0625rem", marginBottom: 4 }}>{ride.fare}</div>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < ride.rating ? "#FFD700" : "transparent"} color="#FFD700" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
