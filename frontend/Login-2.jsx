// FILE: frontend/src/pages/Login.jsx

import { useState } from "react";
import { login } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
    } catch (err) {
      setError(err?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left panel */}
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

          <div style={styles.leftBody}>
            <h2 style={styles.leftHeading}>
              Finance built on<br />
              <span style={styles.leftAccent}>community trust</span>
            </h2>
            <p style={styles.leftSub}>
              Join thousands of members across North India building
              verified credit through community savings circles.
            </p>

            <div style={styles.featureList}>
              {[
                { icon: "🏆", text: "Verified Trust Score" },
                { icon: "🔒", text: "Secure circle payments" },
                { icon: "📈", text: "Build real credit history" },
              ].map((f) => (
                <div key={f.text} style={styles.featureItem}>
                  <span style={styles.featureIcon}>{f.icon}</span>
                  <span style={styles.featureText}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.statsRow}>
            {[
              { value: "47+", label: "Members" },
              { value: "₹3.4L", label: "Secured" },
              { value: "12", label: "Circles" },
            ].map((s) => (
              <div key={s.label} style={styles.statItem}>
                <div style={styles.statVal}>{s.value}</div>
                <div style={styles.statLbl}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative orbs */}
        <div style={styles.orb1} />
        <div style={styles.orb2} />
      </div>

      {/* Right panel – form */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <div style={styles.formLogo}>
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="#1D9E75" strokeWidth="2" />
                <path d="M7 14 Q14 7 21 14 Q14 21 7 14Z" fill="#1D9E75" opacity="0.9" />
              </svg>
            </div>
            <h1 style={styles.formTitle}>Welcome back</h1>
            <p style={styles.formSub}>Sign in to your TrustCircle account</p>
          </div>

          {error && (
            <div style={styles.errorBanner}>
              <span style={styles.errorIcon}>⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form} noValidate>
            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="email">
                Email address
              </label>
              <div
                style={{
                  ...styles.inputWrapper,
                  borderColor:
                    focusedField === "email"
                      ? "#1D9E75"
                      : error && !email
                      ? "#E05252"
                      : "#E2E8F0",
                  boxShadow:
                    focusedField === "email"
                      ? "0 0 0 3px rgba(29,158,117,0.12)"
                      : "none",
                }}
              >
                <span style={styles.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0ADB8" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@example.com"
                  style={styles.input}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <div style={styles.labelRow}>
                <label style={styles.label} htmlFor="password">
                  Password
                </label>
                <a href="/forgot-password" style={styles.forgotLink}>
                  Forgot password?
                </a>
              </div>
              <div
                style={{
                  ...styles.inputWrapper,
                  borderColor:
                    focusedField === "password"
                      ? "#1D9E75"
                      : "#E2E8F0",
                  boxShadow:
                    focusedField === "password"
                      ? "0 0 0 3px rgba(29,158,117,0.12)"
                      : "none",
                }}
              >
                <span style={styles.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0ADB8" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  style={styles.input}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={styles.eyeBtn}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0ADB8" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0ADB8" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.75 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <span style={styles.spinnerRow}>
                  <span style={styles.spinner} />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>New to TrustCircle?</span>
            <span style={styles.dividerLine} />
          </div>

          <a href="/register" style={styles.registerLink}>
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
  page: {
    fontFamily: "'Sora', sans-serif",
    display: "flex",
    minHeight: "100vh",
    background: "#F7F9FC",
  },

  /* Left panel */
  leftPanel: {
    flex: "0 0 42%",
    background: "linear-gradient(160deg, #0D1F2D 0%, #0A3028 50%, #1D9E75 120%)",
    padding: "48px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
    "@media (max-width: 768px)": { display: "none" },
  },
  leftContent: {
    position: "relative",
    zIndex: 1,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  brandMark: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "0",
  },
  brandIcon: {
    width: "42px",
    height: "42px",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: "-0.3px",
  },
  leftBody: {
    paddingTop: "60px",
  },
  leftHeading: {
    fontSize: "clamp(28px, 3vw, 38px)",
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 1.2,
    margin: "0 0 16px",
  },
  leftAccent: {
    color: "#4DD4A8",
  },
  leftSub: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.65)",
    lineHeight: 1.75,
    margin: "0 0 36px",
    maxWidth: "340px",
  },
  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  featureIcon: {
    fontSize: "18px",
    width: "36px",
    height: "36px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureText: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
  },
  statsRow: {
    display: "flex",
    gap: "0",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  statItem: {
    flex: 1,
    textAlign: "center",
    borderRight: "1px solid rgba(255,255,255,0.12)",
  },
  statVal: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#4DD4A8",
    lineHeight: 1,
    marginBottom: "4px",
  },
  statLbl: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: "0.5px",
  },
  orb1: {
    position: "absolute",
    top: "-100px",
    right: "-100px",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(29,158,117,0.25) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  orb2: {
    position: "absolute",
    bottom: "-60px",
    left: "-60px",
    width: "250px",
    height: "250px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(77,212,168,0.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },

  /* Right panel */
  rightPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
  },
  formCard: {
    width: "100%",
    maxWidth: "420px",
  },
  formHeader: {
    marginBottom: "32px",
    textAlign: "center",
  },
  formLogo: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "52px",
    height: "52px",
    background: "#E8F5F1",
    borderRadius: "14px",
    marginBottom: "16px",
  },
  formTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1A2332",
    margin: "0 0 6px",
  },
  formSub: {
    fontSize: "14px",
    color: "#8899AA",
    margin: 0,
  },

  /* Error */
  errorBanner: {
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "13px",
    color: "#DC2626",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
  },
  errorIcon: {
    fontSize: "14px",
    flexShrink: 0,
  },

  /* Form */
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  },
  forgotLink: {
    fontSize: "12px",
    color: "#1D9E75",
    textDecoration: "none",
    fontWeight: "500",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    background: "#FFFFFF",
    border: "1.5px solid #E2E8F0",
    borderRadius: "10px",
    padding: "0 14px",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputIcon: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    marginRight: "10px",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "14px",
    color: "#1A2332",
    fontFamily: "'Sora', sans-serif",
    padding: "13px 0",
  },
  eyeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: "0",
    marginLeft: "8px",
    flexShrink: 0,
  },
  submitBtn: {
    background: "linear-gradient(135deg, #1D9E75, #0E7A5A)",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "10px",
    padding: "14px",
    fontSize: "15px",
    fontWeight: "600",
    fontFamily: "'Sora', sans-serif",
    cursor: "pointer",
    marginTop: "4px",
    boxShadow: "0 4px 16px rgba(29,158,117,0.35)",
    transition: "opacity 0.2s",
  },
  spinnerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  spinner: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "24px 0 16px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#E8EEF4",
  },
  dividerText: {
    fontSize: "12px",
    color: "#A0ADB8",
    whiteSpace: "nowrap",
  },
  registerLink: {
    display: "block",
    textAlign: "center",
    background: "#FFFFFF",
    border: "1.5px solid #E2E8F0",
    borderRadius: "10px",
    padding: "13px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#1A2332",
    textDecoration: "none",
    transition: "border-color 0.2s",
  },
};
