import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ── Stitch "Lumiere" Design System — Electric Blue glassmorphic dark theme ── */
const S = {
  bg:            "#121414",
  surface:       "rgba(18,20,20,0.4)",
  surfaceCont:   "#1e2020",
  surfaceHigh:   "#282a2b",
  primary:       "#b8c3ff",
  primaryCont:   "#2e5bff",
  onPrimCont:    "#efefff",
  onSurface:     "#e2e2e2",
  onSurfaceVar:  "#c4c5d9",
  outlineVar:    "#434656",
  outline:       "#8e90a2",
  error:         "#ffb4ab",
};

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

const ROLES = [
  { id: "rider",  emoji: "🚗", label: "Rider",  sub: "Book rides instantly" },
  { id: "driver", emoji: "🚙", label: "Driver", sub: "Earn on your schedule" },
];

// Admin access is URL-only (/login?role=admin) — not shown in the public picker
const ALL_ROLES = [...ROLES, { id: "admin", emoji: "⚙️", label: "Admin", sub: "Manage the platform" }];

export default function Login() {
  const [params]      = useSearchParams();
  const navigate      = useNavigate();
  const { loginWithGoogle, loginWithPhone, user } = useAuth();

  const [step,    setStep]    = useState(params.get("role") ? "method" : "role");
  const [role,    setRole]    = useState(params.get("role") || "rider");
  const [phone,   setPhone]   = useState("");
  const [otp,     setOtp]     = useState(["","","","","",""]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const glassCard = {
    background: "rgba(18,20,20,0.5)",
    backdropFilter: "blur(32px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 24,
    padding: 32,
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  };

  const inputStyle = {
    width: "100%", background: "rgba(30,32,32,0.6)", backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, outline: "none",
    padding: "12px 16px", color: S.onSurface, fontSize: 16, fontFamily: "Inter, sans-serif",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  const primaryBtn = {
    width: "100%", background: S.primaryCont, color: S.onPrimCont,
    border: "none", borderRadius: 12, padding: "14px 0",
    fontSize: 16, fontWeight: 600, fontFamily: "Inter, sans-serif",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    boxShadow: "0 0 20px rgba(46,91,255,0.25)", transition: "opacity 0.2s, transform 0.15s",
  };

  const ghostBtn = {
    width: "100%", background: "rgba(30,32,32,0.4)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 0",
    color: S.onSurface, fontSize: 15, fontFamily: "Inter, sans-serif",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    transition: "background 0.2s",
  };

  const handleGoogle = async () => {
    setError(""); setLoading(true);
    try { await loginWithGoogle(role); navigate("/dashboard"); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleSendOTP = async () => {
    if (phone.length < 10) { setError("Enter a valid 10-digit number."); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false); setStep("otp");
  };

  const handleOTPChange = (val, idx) => {
    const next = [...otp]; next[idx] = val.slice(-1); setOtp(next);
    if (val && idx < 5) document.getElementById(`otp-${idx+1}`)?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Enter all 6 digits."); return; }
    setError(""); setLoading(true);
    try { await loginWithPhone(phone, code, role); navigate("/dashboard"); }
    catch (err) { setError(err.message || "Invalid verification code. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100vh", background: S.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, position: "relative", overflow: "hidden",
      fontFamily: "Inter, sans-serif",
    }}>
      {/* Atmospheric BG */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOPk1VsLdN2EkLPJdcDx-8KAVJErGMb7nfakG6EkmFyT--zsc2BN0AGhiUBbJtuoavood1xoAMIIVnfmx0oD9LADBt4g6Ga1X8ybqyEHkXbQ8QnmuZ_xhepKt40w6B0kK31M0cy_r_M7iyeK1JuLeBjOU1hOdV5cBEiIY2vSIj3R8jSNV25Md6lENfBRBXfKYlk2G9b5gLTEi7ePPU0XfKLqz97pm8xeYCZUUQg_mQg243PW608FPHZEDqFr2tu2zsM62RpBgrHy8"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4, mixBlendMode: "luminosity" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(18,20,20,0.8), rgba(18,20,20,0.97))" }} />
        {/* Blue glow orb */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: "rgba(46,91,255,0.08)", filter: "blur(120px)",
        }} />
      </div>

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", color: S.onSurface, margin: 0 }}>
            Limeeaux<span style={{ color: S.primaryCont }}>.</span>
          </h1>
        </div>

        <div style={glassCard}>

          {/* ── ROLE STEP ── */}
          {step === "role" && (
            <>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: S.onSurface, marginBottom: 6 }}>Join Limeeaux</h2>
              <p style={{ color: S.onSurfaceVar, fontSize: 15, marginBottom: 24 }}>How will you use the app?</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {ROLES.map(r => (
                  <button key={r.id} onClick={() => setRole(r.id)} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                    borderRadius: 14, border: `1.5px solid ${role === r.id ? S.primaryCont : "rgba(255,255,255,0.1)"}`,
                    background: role === r.id ? "rgba(46,91,255,0.12)" : "rgba(30,32,32,0.4)",
                    cursor: "pointer", transition: "all 0.2s", textAlign: "left", width: "100%",
                  }}>
                    <span style={{ fontSize: 24 }}>{r.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 600, color: S.onSurface, fontSize: 15 }}>{r.label}</div>
                      <div style={{ color: S.onSurfaceVar, fontSize: 13 }}>{r.sub}</div>
                    </div>
                    {role === r.id && (
                      <div style={{
                        marginLeft: "auto", width: 20, height: 20, borderRadius: "50%",
                        background: S.primaryCont, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, color: "#fff", fontWeight: 700,
                      }}>✓</div>
                    )}
                  </button>
                ))}
              </div>
              <button style={primaryBtn} onClick={() => setStep("method")}>
                Continue as {ALL_ROLES.find(r => r.id === role)?.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </>
          )}

          {/* ── METHOD STEP ── */}
          {step === "method" && (
            <>
              <button onClick={() => setStep("role")} style={{
                background: "none", border: "none", color: S.onSurfaceVar, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6, fontSize: 14, marginBottom: 20, padding: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Back
              </button>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: S.onSurface, marginBottom: 4 }}>Welcome back</h2>
              <p style={{ color: S.onSurfaceVar, fontSize: 15, marginBottom: 28 }}>
                Sign in as <strong style={{ color: S.primary }}>{ALL_ROLES.find(r=>r.id===role)?.label}</strong>
              </p>

              <button style={primaryBtn} onClick={handleGoogle} disabled={loading}>
                {loading ? <div style={{ width:18,height:18,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite" }} /> : <GoogleIcon />}
                Continue with Google
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                <span style={{ color: S.outlineVar, fontSize: 13 }}>or continue with</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
              </div>

              <button style={ghostBtn} onClick={() => setStep("phone")}>
                <PhoneIcon /> Phone Number
              </button>

              {error && <p style={{ color: S.error, marginTop: 14, fontSize: 13, textAlign: "center" }}>{error}</p>}

              <div style={{ marginTop: 24, textAlign: "center" }}>
                <p style={{ color: S.onSurfaceVar, fontSize: 14 }}>
                  Don't have an account?{" "}
                  <span onClick={() => setStep("role")} style={{ color: S.primaryCont, fontWeight: 600, cursor: "pointer" }}>Create one</span>
                </p>
              </div>
            </>
          )}

          {/* ── PHONE STEP ── */}
          {step === "phone" && (
            <>
              <button onClick={() => setStep("method")} style={{
                background: "none", border: "none", color: S.onSurfaceVar, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6, fontSize: 14, marginBottom: 20, padding: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Back
              </button>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: S.onSurface, marginBottom: 4 }}>Your number</h2>
              <p style={{ color: S.onSurfaceVar, fontSize: 15, marginBottom: 24 }}>We'll text you a verification code.</p>

              <label style={{ fontSize: 11, fontWeight: 600, color: S.onSurfaceVar, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                Phone Number
              </label>
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <div style={{ ...inputStyle, width: "auto", padding: "12px 14px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  🇺🇸 <span style={{ color: S.onSurfaceVar }}>+1</span>
                </div>
                <input style={{ ...inputStyle, flex: 1 }} type="tel" placeholder="(555) 000-0000"
                  value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={e => e.key === "Enter" && handleSendOTP()}
                  onFocus={e => e.target.style.borderColor = S.primaryCont}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
              {error && <p style={{ color: S.error, marginBottom: 14, fontSize: 13 }}>{error}</p>}
              <button style={primaryBtn} onClick={handleSendOTP} disabled={loading}>
                {loading
                  ? <><div style={{ width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite" }} /> Sending...</>
                  : "Send Verification Code"
                }
              </button>
            </>
          )}

          {/* ── OTP STEP ── */}
          {step === "otp" && (
            <>
              <button onClick={() => setStep("phone")} style={{
                background: "none", border: "none", color: S.onSurfaceVar, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6, fontSize: 14, marginBottom: 20, padding: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Back
              </button>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: S.onSurface, marginBottom: 4 }}>Enter code</h2>
              <p style={{ color: S.onSurfaceVar, fontSize: 15, marginBottom: 6 }}>
                Sent to <strong style={{ color: S.onSurface }}>+1 {phone}</strong>
              </p>
              <p style={{ color: "#ffb347", fontSize: 13, marginBottom: 28 }}>Demo: use <strong>000000</strong></p>

              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28 }}>
                {otp.map((d, i) => (
                  <input key={i} id={`otp-${i}`}
                    style={{
                      width: 48, height: 56, borderRadius: 12, textAlign: "center",
                      fontSize: 22, fontWeight: 700, fontFamily: "Inter, sans-serif",
                      background: "rgba(30,32,32,0.6)", border: `1.5px solid ${d ? S.primaryCont : "rgba(255,255,255,0.1)"}`,
                      color: S.onSurface, outline: "none", transition: "border-color 0.2s",
                    }}
                    type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={e => handleOTPChange(e.target.value, i)}
                    onKeyDown={e => { if (e.key==="Backspace" && !d && i>0) document.getElementById(`otp-${i-1}`)?.focus(); }}
                    onFocus={e => e.target.style.borderColor = S.primaryCont}
                  />
                ))}
              </div>

              {error && <p style={{ color: S.error, marginBottom: 14, fontSize: 13, textAlign: "center" }}>{error}</p>}

              <button style={primaryBtn} onClick={handleVerify} disabled={loading}>
                {loading
                  ? <><div style={{ width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite" }} /> Verifying...</>
                  : "Verify & Sign In"
                }
              </button>

              <button onClick={handleSendOTP} style={{
                background: "none", border: "none", color: S.primaryCont, fontSize: 14,
                marginTop: 16, width: "100%", cursor: "pointer", fontFamily: "Inter, sans-serif",
              }}>Resend code</button>
            </>
          )}

        </div>

        <p style={{ textAlign: "center", marginTop: 24, color: S.outlineVar, fontSize: 13 }}>
          Demo mode · Google mock login · Phone OTP <strong style={{ color: S.primaryCont }}>000000</strong>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
