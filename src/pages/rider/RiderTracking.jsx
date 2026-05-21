import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RiderNav from "../../components/RiderNav";
import { useAuth } from "../../context/AuthContext";
import { useDatabase } from "../../context/DatabaseContext";
import { MapPin, Phone, MessageCircle, Star, Shield, Navigation, ChevronRight, X, AlertCircle } from "lucide-react";

export default function RiderTracking() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rides, users, submitRating, cancelRide } = useDatabase();
  const [rating, setRating] = useState(0);

  // Find current active ride
  const activeRide = rides.find(
    (r) => r.riderId === user?.uid && r.status !== "completed" && r.status !== "cancelled"
  );

  // Find last completed, unrated ride
  const lastUnratedRide = rides.find(
    (r) => r.riderId === user?.uid && r.status === "completed" && r.rating === null
  );

  // If no active ride and no unrated ride, redirect back home
  useEffect(() => {
    if (!activeRide && !lastUnratedRide) {
      const timer = setTimeout(() => navigate("/rider"), 1000);
      return () => clearTimeout(timer);
    }
  }, [activeRide, lastUnratedRide, navigate]);

  // Find driver profile in database if matched
  const driverProfile = activeRide?.driverId
    ? users.find((u) => u.uid === activeRide.driverId)
    : lastUnratedRide?.driverId
    ? users.find((u) => u.uid === lastUnratedRide.driverId)
    : null;

  // Compute status metrics based on real database state
  const getStage = () => {
    if (!activeRide) return { label: "Completed", pct: 100, index: 4 };
    
    switch (activeRide.status) {
      case "requested":
        return { label: "Finding a driver...", pct: 15, index: 0 };
      case "accepted":
        return { label: "Driver matched", pct: 40, index: 1 };
      case "enroute":
        return { label: "Driver en route", pct: 65, index: 2 };
      case "arriving":
        return { label: "Almost there", pct: 85, index: 3 };
      case "arrived":
        return { label: "Driver arrived", pct: 100, index: 4 };
      default:
        return { label: "Live tracking", pct: 50, index: 2 };
    }
  };

  const stage = getStage();
  const eta = activeRide ? activeRide.eta : 0;

  const handleRatingSubmit = () => {
    const rideToRate = lastUnratedRide || activeRide;
    if (rideToRate) {
      submitRating(rideToRate.id, rating || 5);
    }
    navigate("/rider/history");
  };

  const handleSkipRating = () => {
    const rideToRate = lastUnratedRide || activeRide;
    if (rideToRate) {
      submitRating(rideToRate.id, 5); // default to 5 stars on skip
    }
    navigate("/rider/history");
  };

  const handleCancelRide = () => {
    if (activeRide) {
      cancelRide(activeRide.id, "rider");
      navigate("/rider");
    }
  };

  // Find if there is a recently cancelled ride to show a notification
  const recentlyCancelled = rides.find(
    (r) => r.riderId === user?.uid && r.status === "cancelled" && r.cancelReason?.includes("cancelled")
  );

  return (
    <div style={{ minHeight: "100vh" }}>
      <RiderNav />
      <div className="tracking-layout" style={{ paddingTop: 64, display: "flex", height: "100vh" }}>

        {/* ── Info Panel ── */}
        <div className="tracking-panel" style={{
          width: 380, flexShrink: 0, height: "calc(100vh - 64px)",
          overflowY: "auto", borderRight: "1px solid var(--border)",
          background: "var(--bg-secondary)", padding: 28,
        }}>

          {/* Status */}
          <div style={{ marginBottom: 28 }}>
            <div className={`badge ${activeRide?.status === "arrived" ? "badge-green" : activeRide?.status === "requested" ? "badge-orange" : "badge-blue"}`} style={{ marginBottom: 12 }}>
              <span className="pulse-dot" style={{ marginRight: 4 }} />
              {activeRide ? activeRide.status.toUpperCase().replace("_", " ") : "COMPLETED"}
            </div>
            <h3 style={{ marginBottom: 4 }}>{stage.label}</h3>
            {eta > 0 && (
              <p style={{ fontSize: "0.9rem" }}>
                Estimated arrival in <strong style={{ color: "var(--accent-blue)" }}>{eta} min</strong>
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: i <= stage.index ? "var(--accent-blue)" : "var(--border)",
                  transition: "background 0.4s ease",
                }} />
              ))}
            </div>
            <div style={{ height: 6, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 99,
                background: "linear-gradient(90deg, var(--accent-blue), var(--accent-green))",
                width: `${stage.pct}%`, transition: "width 1s ease",
              }} />
            </div>
          </div>

          {/* Driver Card */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem",
              }}>
                {driverProfile ? "👨‍✈️" : "🔍"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "1rem" }}>
                  {driverProfile ? driverProfile.name : "Finding your driver..."}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                  <Star key="star" size={12} fill="#FFD700" color="#FFD700" />
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {driverProfile 
                      ? `${driverProfile.rating} · ${driverProfile.trips} trips` 
                      : "Matching with nearest active drivers"}
                  </span>
                </div>
              </div>
              {driverProfile && <Shield size={18} color="var(--accent-green)" />}
            </div>

            {driverProfile && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 2 }}>Vehicle</div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{driverProfile.vehicle || "Toyota Camry"}</div>
                </div>
                <div style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 2 }}>License</div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{driverProfile.license || "ABC 1234"}</div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button className="btn btn-outline" style={{ flex: 1, justifyContent: "center" }} disabled={!driverProfile}>
              <Phone size={16} /> Call
            </button>
            <button className="btn btn-outline" style={{ flex: 1, justifyContent: "center" }} disabled={!driverProfile}>
              <MessageCircle size={16} /> Message
            </button>
          </div>

          {/* Trip Info */}
          <div className="card">
            <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Trip Details
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <MapPin size={14} color="var(--accent-blue)" />, label: "From", val: activeRide?.from || "123 Main St" },
                { icon: <Navigation size={14} color="var(--accent-red)" />, label: "To", val: activeRide?.to || "Airport Terminal B" },
                { icon: <span style={{ fontSize: "0.75rem" }}>💳</span>, label: "Payment", val: "Simulated Wallet" },
                { icon: <span style={{ fontSize: "0.75rem" }}>💰</span>, label: "Fare", val: activeRide ? activeRide.fare : "$14.50" },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 20, display: "flex", justifyContent: "center" }}>{row.icon}</div>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.8125rem", width: 60 }}>{row.label}</span>
                  <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          {activeRide && (
            <button className="btn btn-outline btn-full btn-sm" style={{ marginTop: 16, color: "var(--accent-red)", borderColor: "rgba(255,77,106,0.3)" }}
              onClick={handleCancelRide}>
              <X size={15} /> Cancel Ride
            </button>
          )}
        </div>

        {/* ── Map ── */}
        <div style={{ flex: 1, position: "relative", background: "#0d1520" }}>
          <div className="map-placeholder" style={{ height: "100%", borderRadius: 0, border: "none" }}>
            <Navigation size={56} color="rgba(61,123,255,0.3)" />
            <p>Live driver location on Google Maps</p>
            {/* Simulated car dot: only show if driver is matched */}
            {activeRide?.driverId && (
              <div style={{
                position: "absolute", 
                top: activeRide.status === "accepted" ? "40%" : activeRide.status === "enroute" ? "45%" : activeRide.status === "arriving" ? "48%" : "50%", 
                left: activeRide.status === "accepted" ? "35%" : activeRide.status === "enroute" ? "45%" : activeRide.status === "arriving" ? "52%" : "50%",
                width: 40, height: 40, borderRadius: "50%",
                background: "var(--accent-blue)", boxShadow: "0 0 0 12px rgba(61,123,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.25rem", transition: "all 3s ease-in-out",
                zIndex: 2,
              }}>🚗</div>
            )}
          </div>

          {/* ETA badge overlay */}
          <div style={{
            position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)", padding: "12px 24px",
            display: "flex", alignItems: "center", gap: 12, boxShadow: "var(--shadow-lg)",
          }}>
            <span className="pulse-dot" />
            <span style={{ fontWeight: 600 }}>
              {activeRide 
                ? activeRide.status === "requested" 
                  ? "Looking for nearby drivers..." 
                  : activeRide.status === "arrived" 
                  ? "Your driver has arrived!" 
                  : `Arriving in ${eta} min`
                : "Your ride has ended!"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Rating Modal ── */}
      {lastUnratedRide && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24,
        }}>
          <div className="card animate-in" style={{ maxWidth: 400, width: "100%", textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎉</div>
            <h2 style={{ marginBottom: 8 }}>You've arrived!</h2>
            <p style={{ marginBottom: 28 }}>How was your ride with {lastUnratedRide.driverName || "Marcus"}?</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 28 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setRating(n)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  transform: rating >= n ? "scale(1.2)" : "scale(1)",
                  transition: "transform 0.15s ease",
                }}>
                  <Star size={36} fill={rating >= n ? "#FFD700" : "transparent"} color="#FFD700" />
                </button>
              ))}
            </div>
            <button className="btn btn-primary btn-full"
              onClick={handleRatingSubmit} disabled={rating === 0}>
              Submit Rating <ChevronRight size={16} />
            </button>
            <button className="btn btn-ghost btn-full btn-sm" style={{ marginTop: 10 }}
              onClick={handleSkipRating}>
              Skip
            </button>
          </div>
        </div>
      )}

      {/* ── Cancelled Alert ── */}
      {!activeRide && !lastUnratedRide && recentlyCancelled && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24,
        }}>
          <div className="card animate-in" style={{ maxWidth: 400, width: "100%", textAlign: "center", padding: 32, border: "1px solid var(--accent-red)" }}>
            <div style={{ color: "var(--accent-red)", marginBottom: 16 }}><AlertCircle size={48} style={{ margin: "0 auto" }} /></div>
            <h3 style={{ marginBottom: 8 }}>Ride Cancelled</h3>
            <p style={{ marginBottom: 24, fontSize: "0.9375rem" }}>
              {recentlyCancelled.cancelReason || "This ride request was cancelled by the user or administrator."}
            </p>
            <button className="btn btn-primary btn-full" onClick={() => navigate("/rider")}>
              Return Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
