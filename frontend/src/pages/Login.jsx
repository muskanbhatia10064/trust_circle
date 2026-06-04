// FILE: frontend/src/pages/Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputBorder = (field) => ({
    borderColor: focusedField === field ? "#1D9E75" : "#E2E8F0",
    boxShadow: focusedField === field ? "0 0 0 3px rgba(29,158,117,0.12)" : "none",
  });

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <div style={styles.brandMark}>
            <div style={styles.brandIcon}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="white" strokeWidth="2" />
                <path d="M7 14 Q14 7 21 14 Q14 21 7 14Z" fill="white" opacity="0.9" />
              </svg>
            </div>
            <span style={styles.brandName}>TrustCircle</span>
          </div>
          <div style={{ paddingTop: "60px" }}>
            <h2 style={styles.leftHeading}>Finance built on<br /><span style={{ color: "#4DD4A8" }}>community trust</span></h2>
            <p style={styles.leftSub}>Join thousands of members across North India building verified credit through community savings circles.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[{ icon: "🏆", text: "Verified Trust Score" }, { icon: "🔒", text: "Secure circle payments" }, { icon: "📈", text: "Build real credit history" }].map((f) => (
                <div key={f.text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "18px", width: "36px", height: "36px", background: "rgba(255,255,255,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>{f.icon}</span>
                  <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", fontWeight: "500" }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px", border: "1px solid rgba(255,255,255,0.1)" }}>
            {[{ value: "47+", label: "MEMBERS" }, { value: "₹3.4L", label: "SECURED" }, { value: "12", label: "CIRCLES" }].map((s) => (
              <div key={s.label} style={{ flex: 1, textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ fontSize: "22px", fontWeight: "700", color: "#4DD4A8", lineHeight: 1, marginBottom: "4px" }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(29,158,117,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "250px", height: "250px", borderRadius: "50%", background: "radial-gradient(circle, rgba(77,212,168,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      </div>

      <div style={styles.rightPanel}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <div style={{ marginBottom: "32px", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "52px", height: "52px", background: "#E8F5F1", borderRadius: "14px", marginBottom: "16px" }}>
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="#1D9E75" strokeWidth="2" />
                <path d="M7 14 Q14 7 21 14 Q14 21 7 14Z" fill="#1D9E75" opacity="0.9" />
              </svg>
            </div>
            <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#1A2332", margin: "0 0 6px" }}>Welcome back</h1>
            <p style={{ fontSize: "14px", color: "#8899AA", margin: 0 }}>Sign in to your TrustCircle account</p>
          </div>

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#DC2626", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <span>⚠</span>{error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }} noValidate>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={styles.label} htmlFor="email">Email address</label>
              <div style={{ ...styles.inputWrapper, ...inputBorder("email") }}>
                <span style={styles.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0ADB8" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </span>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} placeholder="you@example.com" style={styles.input} autoComplete="email" />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label style={styles.label} htmlFor="password">Password</label>
                <a href="/forgot-password" style={{ fontSize: "12px", color: "#1D9E75", textDecoration: "none", fontWeight: "500" }}>Forgot password?</a>
              </div>
              <div style={{ ...styles.inputWrapper, ...inputBorder("password") }}>
                <span style={styles.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0ADB8" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </span>
                <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)} placeholder="Enter your password" style={styles.input} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0, marginLeft: "8px" }} tabIndex={-1}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0ADB8" strokeWidth="2">
                    {showPassword ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.75 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}><span style={styles.spinner} />Signing in…</span> : "Sign In"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0 16px" }}>
            <span style={{ flex: 1, height: "1px", background: "#E8EEF4" }} />
            <span style={{ fontSize: "12px", color: "#A0ADB8" }}>New to TrustCircle?</span>
            <span style={{ flex: 1, height: "1px", background: "#E8EEF4" }} />
          </div>
          <a href="/register" style={{ display: "block", textAlign: "center", background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "10px", padding: "13px", fontSize: "14px", fontWeight: "600", color: "#1A2332", textDecoration: "none" }}>
            Create an account
          </a>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  page: { fontFamily: "'Sora', sans-serif", display: "flex", minHeight: "100vh", background: "#F7F9FC" },
  leftPanel: { flex: "0 0 42%", background: "linear-gradient(160deg, #0D1F2D 0%, #0A3028 50%, #1D9E75 120%)", padding: "48px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" },
  leftContent: { position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  brandMark: { display: "flex", alignItems: "center", gap: "10px" },
  brandIcon: { width: "42px", height: "42px", background: "rgba(255,255,255,0.15)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" },
  brandName: { fontSize: "18px", fontWeight: "700", color: "#FFFFFF" },
  leftHeading: { fontSize: "clamp(28px, 3vw, 38px)", fontWeight: "700", color: "#FFFFFF", lineHeight: 1.2, margin: "0 0 16px" },
  leftSub: { fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 36px", maxWidth: "340px" },
  rightPanel: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  inputWrapper: { display: "flex", alignItems: "center", background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "10px", padding: "0 14px", transition: "border-color 0.2s, box-shadow 0.2s" },
  inputIcon: { display: "flex", alignItems: "center", flexShrink: 0, marginRight: "10px" },
  input: { flex: 1, border: "none", outline: "none", background: "transparent", fontSize: "14px", color: "#1A2332", fontFamily: "'Sora', sans-serif", padding: "13px 0" },
  submitBtn: { background: "linear-gradient(135deg, #1D9E75, #0E7A5A)", color: "#FFFFFF", border: "none", borderRadius: "10px", padding: "14px", fontSize: "15px", fontWeight: "600", fontFamily: "'Sora', sans-serif", boxShadow: "0 4px 16px rgba(29,158,117,0.35)", transition: "opacity 0.2s" },
  spinner: { display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" },
};
