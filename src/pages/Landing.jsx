import React from "react";
import { Link } from "react-router-dom";
import { Car, Navigation, Shield, Star, Zap, Clock, MapPin, ChevronRight } from "lucide-react";

const features = [
  { icon: <Zap size={22} />, title: "Instant Matching", desc: "Get paired with a driver in under 60 seconds, any time of day." },
  { icon: <Shield size={22} />, title: "Fully Insured", desc: "Every ride is covered. Verified drivers, background-checked." },
  { icon: <Clock size={22} />, title: "24 / 7 Support", desc: "Round-the-clock help through the app, chat, or phone." },
  { icon: <Star size={22} />, title: "5-Star Drivers", desc: "Only top-rated drivers stay on our platform." },
];

const stats = [
  { value: "2M+", label: "Rides Completed" },
  { value: "50K+", label: "Active Drivers" },
  { value: "98%", label: "On-Time Rate" },
  { value: "4.9", label: "Avg. Rating" },
];

export default function Landing() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 40px",
        background: "rgba(10,14,26,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg,var(--accent-blue),var(--accent-green))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Car size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.125rem", letterSpacing: "-0.5px" }}>RideFlow</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
          <Link to="/login" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "120px 40px 80px",
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(61,123,255,0.15) 0%, transparent 70%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background grid lines */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 680 }} className="animate-in">
            <div className="badge badge-blue" style={{ marginBottom: 24, fontSize: "0.8125rem" }}>
              <span className="pulse-dot" style={{ marginRight: 4 }} />
              Now live in 50+ cities
            </div>
            <h1 style={{ marginBottom: 24 }}>
              Move smarter,<br />
              <span className="gradient-text">arrive faster.</span>
            </h1>
            <p style={{ fontSize: "1.125rem", marginBottom: 40, maxWidth: 520, lineHeight: 1.7 }}>
              RideFlow connects riders with top-rated drivers in seconds. Safe, affordable, and always on time.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link to="/login?role=rider" className="btn btn-primary btn-lg">
                <Car size={20} />
                Book a Ride
              </Link>
              <Link to="/login?role=driver" className="btn btn-outline btn-lg">
                <Navigation size={20} />
                Become a Driver
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Floating card */}
          <div style={{
            position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)",
            display: "flex", flexDirection: "column", gap: 16,
          }} className="animate-in" id="hero-cards">
            <div className="glass-card" style={{ padding: 20, minWidth: 260 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "linear-gradient(135deg,var(--accent-blue),var(--accent-purple))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Car size={18} color="#fff" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>Marcus W.</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#FFD700" color="#FFD700" />)}
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>5.0</span>
                  </div>
                </div>
                <span className="badge badge-green" style={{ marginLeft: "auto" }}>En Route</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                <MapPin size={14} color="var(--accent-blue)" />
                Arriving in <strong style={{ color: "var(--accent-green)" }}>3 min</strong>
              </div>
              <div style={{
                marginTop: 12, height: 4, borderRadius: 99,
                background: "var(--border)", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", width: "75%", borderRadius: 99,
                  background: "linear-gradient(90deg, var(--accent-blue), var(--accent-green))",
                }} />
              </div>
            </div>

            <div className="glass-card" style={{ padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "rgba(0,212,138,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Shield size={16} color="var(--accent-green)" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>Ride Protected</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>$1M insurance coverage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: "60px 40px", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, textAlign: "center" }}>
            {stats.map(s => (
              <div key={s.label}>
                <div style={{ fontSize: "2.5rem", fontWeight: 900, background: "linear-gradient(135deg, var(--accent-blue), var(--accent-green))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {s.value}
                </div>
                <div style={{ color: "var(--text-secondary)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: "80px 40px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2>Why riders choose <span className="gradient-text">RideFlow</span></h2>
            <p style={{ marginTop: 12, maxWidth: 500, margin: "12px auto 0" }}>
              Built for modern cities, designed for real people.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {features.map(f => (
              <div key={f.title} className="card" style={{ textAlign: "center" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, margin: "0 auto 16px",
                  background: "rgba(61,123,255,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent-blue)",
                }}>
                  {f.icon}
                </div>
                <h4 style={{ marginBottom: 8 }}>{f.title}</h4>
                <p style={{ fontSize: "0.9rem" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: "80px 40px", textAlign: "center",
        background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(61,123,255,0.08) 0%, transparent 70%)",
      }}>
        <div className="container" style={{ maxWidth: 580 }}>
          <h2 style={{ marginBottom: 16 }}>Ready to move?</h2>
          <p style={{ marginBottom: 36 }}>Join millions of riders and thousands of drivers on the platform built for everyone.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/login?role=rider"  className="btn btn-primary btn-lg"><Car size={18} />Ride Now</Link>
            <Link to="/login?role=driver" className="btn btn-green btn-lg"><Navigation size={18} />Start Driving</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: "1px solid var(--border)", padding: "28px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        color: "var(--text-muted)", fontSize: "0.875rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--text-primary)" }}>
          <Car size={16} color="var(--accent-blue)" /> RideFlow
        </div>
        <div>© 2026 RideFlow. All rights reserved.</div>
      </footer>
    </div>
  );
}
