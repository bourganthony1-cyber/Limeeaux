import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RiderNav from "../../components/RiderNav";
import { Navigation, Car, Zap, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDatabase } from "../../context/DatabaseContext";

const rideTypes = [
  { id: "standard", label: "Limeeaux",  desc: "Affordable everyday rides", price: "$8–12",  time: "4 min",  icon: "🚗" },
  { id: "comfort",  label: "Comfort",   desc: "Extra legroom & AC",         price: "$14–18", time: "6 min",  icon: "🚙" },
  { id: "xl",       label: "RideXL",    desc: "Up to 6 passengers",         price: "$18–24", time: "8 min",  icon: "🚐" },
  { id: "green",    label: "EcoRide",   desc: "100% electric vehicles",     price: "$10–15", time: "5 min",  icon: "🌿" },
];

const MapPlaceholder = () => (
  <div className="map-placeholder" style={{ minHeight: 360 }}>
    <div className="map-placeholder-icon">
      <Navigation size={48} color="rgba(61,123,255,0.4)" />
    </div>
    <p>Interactive map loads with your Google Maps API key</p>
    <div style={{
      position: "absolute", top: "50%", left: "50%",
      transform: "translate(-50%,-50%)",
      width: 24, height: 24, borderRadius: "50%",
      background: "var(--accent-blue)", boxShadow: "0 0 0 8px rgba(61,123,255,0.2)",
      zIndex: 2,
    }} />
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      height: 80,
      background: "linear-gradient(to top, var(--bg-primary), transparent)",
    }} />
  </div>
);

export default function RiderHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rides, requestRide } = useDatabase();
  const [pickup,     setPickup]     = useState("");
  const [dropoff,    setDropoff]    = useState("");
  const [selected,   setSelected]   = useState("standard");
  const [searching,  setSearching]  = useState(false);

  // Check if rider already has an active ride in progress
  const activeRide = rides.find(
    (r) => r.riderId === user?.uid && r.status !== "completed" && r.status !== "cancelled"
  );

  useEffect(() => {
    if (activeRide) {
      navigate("/rider/tracking");
    }
  }, [activeRide, navigate]);

  const handleBookRide = async () => {
    if (!pickup || !dropoff || !user) return;
    setSearching(true);

    const priceMap = { standard: "$10.50", comfort: "$16.20", xl: "$22.00", green: "$12.80" };
    const price = priceMap[selected] || "$12.00";

    // Request the ride in the database. This will save to localStorage and broadcast to the Driver.
    requestRide(user.uid, user.displayName || "Rider", pickup, dropoff, selected, price);
    setSearching(false);
    navigate("/rider/tracking");
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <RiderNav />
      <div className="rider-layout" style={{ paddingTop: 64, display: "flex", height: "100vh" }}>

        {/* ── Left Panel ── */}
        <div className="rider-panel" style={{
          width: 400, flexShrink: 0, height: "calc(100vh - 64px)",
          overflowY: "auto", borderRight: "1px solid var(--border)",
          background: "var(--bg-secondary)", padding: 28,
        }}>
          <h3 style={{ marginBottom: 24 }}>Where to?</h3>

          {/* Location Inputs */}
          <div style={{ position: "relative", marginBottom: 20 }}>
            <div style={{
              position: "absolute", left: 16, top: 0, bottom: 0,
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 4, zIndex: 1,
            }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent-blue)" }} />
              <div style={{ width: 2, height: 24, background: "var(--border)" }} />
              <div style={{ width: 10, height: 10, borderRadius: 2, background: "var(--accent-red)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input className="input" placeholder="Pickup location"
                value={pickup} onChange={e => setPickup(e.target.value)}
                style={{ paddingLeft: 40 }} />
              <input className="input" placeholder="Where are you going?"
                value={dropoff} onChange={e => setDropoff(e.target.value)}
                style={{ paddingLeft: 40 }} />
            </div>
          </div>

          {/* Ride Type Selection */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ marginBottom: 12, color: "var(--text-secondary)", fontWeight: 500, fontSize: "0.875rem" }}>
              CHOOSE RIDE TYPE
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {rideTypes.map(rt => (
                <button key={rt.id} onClick={() => setSelected(rt.id)} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                  borderRadius: "var(--radius-md)",
                  border: `2px solid ${selected === rt.id ? "var(--accent-blue)" : "var(--border)"}`,
                  background: selected === rt.id ? "rgba(61,123,255,0.08)" : "rgba(255,255,255,0.02)",
                  cursor: "pointer", transition: "var(--transition)", textAlign: "left", width: "100%",
                }}>
                  <span style={{ fontSize: 22 }}>{rt.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9375rem" }}>{rt.label}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{rt.desc}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{rt.price}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end" }}>
                      <Clock size={11} />{rt.time}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Book Button */}
          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={handleBookRide}
            disabled={!pickup || !dropoff || searching}
          >
            {searching
              ? <><div className="spinner spinner-sm" /> Finding your driver...</>
              : <><Car size={18} /> Request Ride</>
            }
          </button>

          {/* Promo */}
          <div style={{
            marginTop: 20, padding: "14px 16px", borderRadius: "var(--radius-md)",
            background: "rgba(0,212,138,0.08)", border: "1px solid rgba(0,212,138,0.2)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <Zap size={18} color="var(--accent-green)" />
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--accent-green)" }}>First ride free!</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Use code LIMEEAUX at checkout</div>
            </div>
          </div>
        </div>

        {/* ── Map Panel ── */}
        <div style={{ flex: 1, position: "relative" }}>
          <MapPlaceholder />
        </div>
      </div>
    </div>
  );
}
