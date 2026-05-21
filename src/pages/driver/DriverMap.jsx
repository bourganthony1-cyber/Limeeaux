import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DriverNav from "../../components/DriverNav";
import { useAuth } from "../../context/AuthContext";
import { useDatabase } from "../../context/DatabaseContext";
import { Navigation, MapPin } from "lucide-react";

export default function DriverMap() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rides, updateRideStatus } = useDatabase();

  // Find active ride for this driver
  const activeRide = rides.find(
    (r) => r.driverId === user?.uid && r.status !== "completed" && r.status !== "cancelled"
  );

  // If no active ride, redirect back to dashboard
  useEffect(() => {
    if (!activeRide) {
      const timer = setTimeout(() => navigate("/driver"), 1000);
      return () => clearTimeout(timer);
    }
  }, [activeRide, navigate]);

  if (!activeRide) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-muted)" }}>Redirecting to dashboard...</p>
      </div>
    );
  }

  // Determine button text and next status based on current active ride status
  let buttonText = "Arrived at Pickup";
  let nextStatus = "arrived";
  let instructionsText = `Drive to pickup: ${activeRide.from}`;

  if (activeRide.status === "accepted") {
    buttonText = "Arrived at Pickup";
    nextStatus = "arrived";
    instructionsText = `Pick up rider: ${activeRide.riderName} at ${activeRide.from}`;
  } else if (activeRide.status === "arrived") {
    buttonText = "Start Trip";
    nextStatus = "enroute";
    instructionsText = `Waiting for passenger. Start trip when ${activeRide.riderName} enters the vehicle.`;
  } else if (activeRide.status === "enroute") {
    buttonText = "Complete Ride";
    nextStatus = "completed";
    instructionsText = `En route to destination: ${activeRide.to}`;
  }

  const handleStatusChange = () => {
    updateRideStatus(activeRide.id, nextStatus);
    if (nextStatus === "completed") {
      navigate("/driver");
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <DriverNav />
      <div style={{ paddingTop: 64, height: "100vh", display: "flex", flexDirection: "column" }}>

        {/* Navigation Info Bar */}
        <div style={{
          background: "rgba(10,14,26,0.9)", borderBottom: "1px solid var(--border)",
          padding: "12px 24px", display: "flex", alignItems: "center", gap: 12
        }}>
          <Navigation size={18} color="var(--accent-green)" />
          <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)" }}>
            {instructionsText}
          </span>
        </div>

        {/* Map View */}
        <div className="map-placeholder" style={{ flex: 1, borderRadius: 0, border: "none" }}>
          <Navigation size={64} color="rgba(0,212,138,0.35)" />
          <p style={{ fontSize: "1rem", fontWeight: 500 }}>Turn-by-turn navigation live simulation</p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Pickup: {activeRide.from} &rarr; Dropoff: {activeRide.to}
          </p>

          {/* Mock driver dot */}
          <div style={{
            position: "absolute",
            top: activeRide.status === "accepted" ? "45%" : activeRide.status === "arrived" ? "35%" : "28%",
            left: activeRide.status === "accepted" ? "48%" : activeRide.status === "arrived" ? "58%" : "62%",
            width: 48, height: 48, borderRadius: "50%",
            background: "var(--accent-green)", boxShadow: "0 0 0 16px rgba(0,212,138,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem", zIndex: 2, transition: "all 3s ease-in-out"
          }}>🚙</div>

          {/* Mock destination */}
          <div style={{
            position: "absolute", top: "28%", left: "62%",
            width: 36, height: 36, borderRadius: "50%",
            background: "var(--accent-red)", boxShadow: "0 0 0 8px rgba(255,77,106,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
            zIndex: 2,
          }}>📍</div>

          {/* Mock route line */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }}>
            <line x1="48%" y1="45%" x2="62%" y2="28%"
              stroke="rgba(61,123,255,0.5)" strokeWidth="3" strokeDasharray="8,6" />
          </svg>
        </div>

        {/* Bottom Bar */}
        <div style={{
          background: "var(--bg-secondary)", borderTop: "1px solid var(--border)",
          padding: "16px 32px", display: "flex", alignItems: "center", gap: 24,
        }}>
          <div>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Destination</div>
            <div style={{ fontWeight: 700 }}>{activeRide.to}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--accent-green)", fontWeight: 600 }}>Rider: {activeRide.riderName}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 20 }}>
            {[
              { label: "Distance",  value: activeRide.status === "enroute" ? "3.1 mi" : "8.2 mi" },
              { label: "ETA",       value: `${activeRide.eta} min` },
              { label: "Fare",      value: activeRide.fare },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: "1.125rem" }}>{s.value}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <button className={`btn btn-${nextStatus === "completed" ? "green" : "primary"}`} onClick={handleStatusChange}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
