import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DriverNav from "../../components/DriverNav";
import { useAuth } from "../../context/AuthContext";
import { useDatabase } from "../../context/DatabaseContext";
import { MapPin, Navigation, DollarSign, Star, Check, X, Clock, Zap } from "lucide-react";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rides, users, acceptRide } = useDatabase();
  
  const [online, setOnline] = useState(true);
  const [declinedRides, setDeclinedRides] = useState([]);

  // Fetch driver profile in the DB to read live rating/trips
  const driverProfileInDb = users.find((u) => u.uid === user?.uid);
  const driverRating = driverProfileInDb ? driverProfileInDb.rating : 5.0;
  const driverTripsCount = driverProfileInDb ? driverProfileInDb.trips : 0;

  // Find any active ride accepted by this driver (enroute, arrived, etc.)
  const activeRide = rides.find(
    (r) => r.driverId === user?.uid && r.status !== "completed" && r.status !== "cancelled"
  );

  // Find completed trips by this driver
  const completedTrips = rides.filter(
    (r) => r.driverId === user?.uid && r.status === "completed"
  );

  // Calculate earnings dynamically
  const earnings = completedTrips.reduce(
    (sum, t) => sum + parseFloat(t.fare.replace("$", "")),
    0
  ).toFixed(2);

  // Find incoming requested ride (that has no driver yet and is not declined)
  const incomingRequest = rides.find(
    (r) => r.status === "requested" && !declinedRides.includes(r.id)
  );

  // Fetch target rider profile in the database
  const riderProfile = incomingRequest
    ? users.find((u) => u.uid === incomingRequest.riderId)
    : null;

  const handleAcceptRide = () => {
    if (incomingRequest && user) {
      acceptRide(incomingRequest.id, user.uid, user.displayName || "Marcus W.");
      navigate("/driver/map");
    }
  };

  const handleDeclineRide = () => {
    if (incomingRequest) {
      setDeclinedRides((prev) => [...prev, incomingRequest.id]);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <DriverNav />
      <div style={{ paddingTop: 64 }}>
        <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>

          {/* Status Toggle */}
          <div className="card" style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h3>Driver Status</h3>
              <p style={{ marginTop: 2, fontSize: "0.9rem" }}>
                You are currently{" "}
                <strong style={{ color: online ? "var(--accent-green)" : "var(--accent-red)" }}>
                  {online ? "Online" : "Offline"}
                </strong>
              </p>
            </div>
            <button
              onClick={() => setOnline(o => !o)}
              style={{
                width: 64, height: 34, borderRadius: 99, border: "none",
                background: online ? "var(--accent-green)" : "var(--text-muted)",
                position: "relative", cursor: "pointer", transition: "background 0.3s ease",
              }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: "50%", background: "#fff",
                position: "absolute", top: 4,
                left: online ? 34 : 4, transition: "left 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }} />
            </button>
          </div>

          {/* Today Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
            {[
              { label: "Today's Earnings", value: `$${earnings}`, icon: <DollarSign size={20} />, color: "rgba(0,212,138,0.15)", tc: "var(--accent-green)" },
              { label: "Trips Completed",  value: completedTrips.length.toString(), icon: <Check size={20} />,      color: "rgba(61,123,255,0.15)", tc: "var(--accent-blue)" },
              { label: "Driver Rating",      value: `${driverRating} ⭐`,  icon: <Star size={20} />,       color: "rgba(255,215,0,0.12)",  tc: "#FFD700" },
              { label: "Total Career Trips",     value: driverTripsCount.toString(), icon: <Clock size={20} />,      color: "rgba(155,109,255,0.15)",tc: "var(--accent-purple)" },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon" style={{ background: s.color, color: s.tc }}>{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>

            {/* Ride Request Card */}
            <div>
              {online && !activeRide && incomingRequest && (
                <div className="card animate-in" style={{
                  border: "2px solid var(--accent-blue)",
                  boxShadow: "var(--shadow-glow-blue)", marginBottom: 24,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <Zap size={16} color="var(--accent-blue)" />
                    <span style={{ fontWeight: 700, color: "var(--accent-blue)", fontSize: "0.875rem" }}>
                      NEW RIDE REQUEST
                    </span>
                    <span className="badge badge-orange" style={{ marginLeft: "auto" }}>
                      1.2x Surge
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg,#ec4899,#8b5cf6)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem",
                    }}>👩</div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{incomingRequest.riderName}</div>
                      <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={11} fill={i < Math.floor(riderProfile?.rating || 5) ? "#FFD700" : "transparent"} color="#FFD700" />
                        ))}
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {riderProfile ? `${riderProfile.rating} · ${riderProfile.trips} trips` : "4.8 · 14 trips"}
                        </span>
                      </div>
                    </div>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent-green)" }}>
                        {incomingRequest.fare}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        12.4 mi · 22 min
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                    {[
                      { icon: <MapPin size={14} color="var(--accent-blue)" />, label: incomingRequest.from },
                      { icon: <Navigation size={14} color="var(--accent-red)" />, label: incomingRequest.to },
                    ].map(row => (
                      <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {row.icon}
                        <span style={{ fontSize: "0.9rem" }}>{row.label}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <button className="btn btn-outline" style={{ flex: 1, justifyContent: "center", color: "var(--accent-red)", borderColor: "rgba(255,77,106,0.3)" }}
                      onClick={handleDeclineRide}>
                      <X size={16} /> Decline
                    </button>
                    <button className="btn btn-green" style={{ flex: 2, justifyContent: "center" }}
                      onClick={handleAcceptRide}>
                      <Check size={16} /> Accept Ride
                    </button>
                  </div>
                </div>
              )}

              {activeRide && (
                <div className="card animate-in" style={{
                  border: "2px solid var(--accent-green)", boxShadow: "var(--shadow-glow-green)", marginBottom: 24,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span className="pulse-dot" />
                    <span style={{ fontWeight: 700, color: "var(--accent-green)" }}>Ride Active — {activeRide.status.toUpperCase()}</span>
                  </div>
                  <p style={{ marginBottom: 16 }}>
                    Pickup: <strong>{activeRide.from}</strong><br/>
                    Dropoff: <strong>{activeRide.to}</strong><br/>
                    Rider: <strong>{activeRide.riderName}</strong>
                  </p>
                  <button className="btn btn-primary" onClick={() => navigate("/driver/map")}>
                    Open Navigation Map
                  </button>
                </div>
              )}

              {online && !activeRide && !incomingRequest && (
                <div className="card" style={{ textAlign: "center", padding: 40, marginBottom: 24 }}>
                  <div style={{ fontSize: "3rem", marginBottom: 16 }}>📡</div>
                  <h3>Searching for requests</h3>
                  <p style={{ marginTop: 8 }}>Waiting for riders to book a trip in your area...</p>
                </div>
              )}

              {!online && (
                <div className="card" style={{ textAlign: "center", padding: 40, marginBottom: 24 }}>
                  <div style={{ fontSize: "3rem", marginBottom: 16 }}>💤</div>
                  <h3>You're offline</h3>
                  <p style={{ marginTop: 8 }}>Toggle your status online to start receiving ride requests.</p>
                </div>
              )}

              {/* Recent Trips */}
              <h3 style={{ marginBottom: 16 }}>Recent Trips</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {completedTrips.length === 0 ? (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No trips completed today.</p>
                ) : (
                  completedTrips.map(t => (
                    <div key={t.id} className="card" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: "rgba(0,212,138,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <DollarSign size={16} color="var(--accent-green)" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t.from} → {t.to}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{t.time} · Rider: {t.riderName}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 700, color: "var(--accent-green)" }}>{t.fare}</div>
                        {t.rating && (
                          <div style={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                            {[...Array(t.rating)].map((_, i) => <Star key={i} size={11} fill="#FFD700" color="#FFD700" />)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Mini Map */}
            <div>
              <div className="map-placeholder" style={{ minHeight: 340, borderRadius: "var(--radius-lg)" }}>
                <Navigation size={36} color="rgba(0,212,138,0.4)" />
                <p>Your location on Google Maps</p>
              </div>
              <div className="card" style={{ marginTop: 16 }}>
                <h4 style={{ marginBottom: 12 }}>Surge Zone Nearby</h4>
                <div style={{
                  padding: "10px 14px", borderRadius: "var(--radius-md)",
                  background: "rgba(255,140,61,0.1)", border: "1px solid rgba(255,140,61,0.3)",
                }}>
                  <span style={{ color: "var(--accent-orange)", fontWeight: 600, fontSize: "0.9rem" }}>
                    🔥 1.5x Surge — Airport Area
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
