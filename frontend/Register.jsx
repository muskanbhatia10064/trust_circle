// FILE: frontend/src/pages/Register.jsx

import { useState } from "react";
import { register } from "../services/api";

function StrengthBar({ password }) {
  const getStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#E2E8F0", "#E05252", "#E8A020", "#27AE87", "#1D9E75"];
  const color = strength > 0 ? colors[strength] : colors[0];

  return (
    <div style={sbStyles.wrapper}>
      <div style={sbStyles.bars}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              ...sbStyles.bar,
              background: i <= strength ? color : "#E2E8F0",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      {password && (
        <span style={{ ...sbStyles.label, color }}>{labels[strength]}</span>
      )}
    </div>
  );
}

const sbStyles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "6px",
  },
  bars: {
    display: "flex",
    gap: "4px",
    flex: 1,
  },
  bar: {
    flex: 1,
    height: "3px",
    borderRadius: "100px",
  },
  label: {
    fontSize: "11px",
    fontWeight: "600",
    width: "44px",
    textAlign: "right",
    flexShrink: 0,
  },
};

function CheckItem({ met, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
      <span
        style={{
          fontSize: "12px",
          color: met ? "#1D9E75" : "#CBD5E0",
          fontWeight: "700",
        }}
      >
        {met ? "✓" : "○"}
      </span>
      <span style={{ fontSize: "12px", color: met ? "#4A5568" : "#A0ADB8" }}>{text}</span>
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [step, setStep] = useState(1); // 1 = form, 2 = success

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError("");
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setStep(2);
    } catch (err) {
      setApiError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordChecks = [
    { met: form.password.length >= 8, text: "At least 8 characters" },
    { met: /[A-Z]/.test(form.password), text: "One uppercase letter" },
    { met: /[0-9]/.test(form.password), text: "One number" },
  ];

  if (step === 2) {
    return (
      <div style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.successIconWrap}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#E8F5F1" />
              <path d="M12 20 L18 26 L28 14" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 style={styles.successTitle}>You're in!</h2>
          <p style={styles.successSub}>
            Welcome to TrustCircle, <strong>{form.name.split(" ")[0]}</strong>. Your account has been created successfully.
          </p>
          <a href="/login" style={styles.successBtn}>Sign in to your account →</a>
        </div>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');`}</style>
      </div>
    );
  }

  const inputBorder = (field) => ({
    borderColor:
      errors[field]
        ? "#E05252"
        : focusedField === field
        ? "#1D9E75"
        : "#E2E8F0",
    boxShadow: errors[field]
      ? "0 0 0 3px rgba(224,82,82,0.10)"
      : focusedField === field
      ? "0 0 0 3px rgba(29,158,117,0.12)"
      : "none",
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Brand header */}
        <div style={styles.brandRow}>
          <div style={styles.brandIconWrap}>
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="#1D9E75" strokeWidth="2" />
              <path d="M7 14 Q14 7 21 14 Q14 21 7 14Z" fill="#1D9E75" opacity="0.9" />
            </svg>
          </div>
          <span style={styles.brandName}>TrustCircle</span>
        </div>

        <div style={styles.formCard}>
          {/* Header */}
          <div style={styles.formHeader}>
            <h1 style={styles.formTitle}>Create your account</h1>
            <p style={styles.formSub}>
              Join the community finance revolution
            </p>
          </div>

          {/* Progress dots */}
          <div style={styles.progressDots}>
            <div style={{ ...styles.dot, background: "#1D9E75" }} />
            <div style={styles.dotLine} />
            <div style={{ ...styles.dot, background: "#E2E8F0" }} />
            <div style={styles.dotLine} />
            <div style={{ ...styles.dot, background: "#E2E8F0" }} />
          </div>
          <p style={styles.stepLabel}>Step 1 of 3 — Personal details</p>

          {/* API Error */}
          {apiError && (
            <div style={styles.errorBanner}>
              <span>⚠</span> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form} noValidate>

            {/* Name */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="name">Full Name</label>
              <div style={{ ...styles.inputWrapper, ...inputBorder("name") }}>
                <span style={styles.inputIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A0ADB8" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={update("name")}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Priya Sharma"
                  style={styles.input}
                  autoComplete="name"
                />
              </div>
              {errors.name && <span style={styles.fieldError}>{errors.name}</span>}
            </div>

            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="email">Email Address</label>
              <div style={{ ...styles.inputWrapper, ...inputBorder("email") }}>
                <span style={styles.inputIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A0ADB8" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@example.com"
                  style={styles.input}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span style={styles.fieldError}>{errors.email}</span>}
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="password">Password</label>
              <div style={{ ...styles.inputWrapper, ...inputBorder("password") }}>
                <span style={styles.inputIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A0ADB8" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={update("password")}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Create a strong password"
                  style={styles.input}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={styles.eyeBtn}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A0ADB8" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A0ADB8" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {form.password && <StrengthBar password={form.password} />}
              {form.password && (
                <div style={styles.checksBox}>
                  {passwordChecks.map((c) => (
                    <CheckItem key={c.text} met={c.met} text={c.text} />
                  ))}
                </div>
              )}
              {errors.password && <span style={styles.fieldError}>{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="confirmPassword">Confirm Password</label>
              <div style={{ ...styles.inputWrapper, ...inputBorder("confirmPassword") }}>
                <span style={styles.inputIcon}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A0ADB8" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={update("confirmPassword")}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Re-enter your password"
                  style={styles.input}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  style={styles.eyeBtn}
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A0ADB8" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A0ADB8" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {form.confirmPassword && form.password === form.confirmPassword && !errors.confirmPassword && (
                <span style={styles.matchSuccess}>✓ Passwords match</span>
              )}
              {errors.confirmPassword && (
                <span style={styles.fieldError}>{errors.confirmPassword}</span>
              )}
            </div>

            {/* Terms */}
            <p style={styles.termsText}>
              By creating an account you agree to our{" "}
              <a href="/terms" style={styles.termsLink}>Terms of Service</a> and{" "}
              <a href="/privacy" style={styles.termsLink}>Privacy Policy</a>.
            </p>

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
                  Creating account…
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div style={styles.loginRow}>
            Already have an account?{" "}
            <a href="/login" style={styles.loginLink}>Sign in</a>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Sora', sans-serif",
    background: "#F7F9FC",
    minHeight: "100vh",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 16px 60px",
  },
  container: {
    width: "100%",
    maxWidth: "480px",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "24px",
    justifyContent: "center",
  },
  brandIconWrap: {
    width: "38px",
    height: "38px",
    background: "#E8F5F1",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1A2332",
  },
  formCard: {
    background: "#FFFFFF",
    borderRadius: "20px",
    padding: "36px 32px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
  },
  formHeader: {
    marginBottom: "24px",
  },
  formTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1A2332",
    margin: "0 0 6px",
  },
  formSub: {
    fontSize: "13px",
    color: "#8899AA",
    margin: 0,
  },
  progressDots: {
    display: "flex",
    alignItems: "center",
    marginBottom: "6px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  dotLine: {
    flex: 1,
    height: "2px",
    background: "#E2E8F0",
    margin: "0 4px",
  },
  stepLabel: {
    fontSize: "12px",
    color: "#A0ADB8",
    margin: "0 0 24px",
  },
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
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
    padding: "12px 0",
  },
  eyeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: 0,
    marginLeft: "8px",
    flexShrink: 0,
  },
  fieldError: {
    fontSize: "12px",
    color: "#E05252",
    marginTop: "2px",
  },
  matchSuccess: {
    fontSize: "12px",
    color: "#1D9E75",
    fontWeight: "600",
    marginTop: "2px",
  },
  checksBox: {
    background: "#F7F9FC",
    borderRadius: "8px",
    padding: "8px 12px",
    marginTop: "4px",
  },
  termsText: {
    fontSize: "12px",
    color: "#8899AA",
    margin: "4px 0 0",
    lineHeight: 1.6,
  },
  termsLink: {
    color: "#1D9E75",
    textDecoration: "none",
    fontWeight: "500",
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
  loginRow: {
    textAlign: "center",
    fontSize: "13px",
    color: "#8899AA",
    marginTop: "20px",
  },
  loginLink: {
    color: "#1D9E75",
    fontWeight: "600",
    textDecoration: "none",
  },

  /* Success screen */
  successCard: {
    background: "#FFFFFF",
    borderRadius: "20px",
    padding: "52px 40px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
  successIconWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  successTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1A2332",
    margin: "0 0 10px",
  },
  successSub: {
    fontSize: "14px",
    color: "#6B7A8D",
    lineHeight: 1.7,
    margin: "0 0 28px",
  },
  successBtn: {
    display: "inline-block",
    background: "linear-gradient(135deg, #1D9E75, #0E7A5A)",
    color: "#fff",
    borderRadius: "10px",
    padding: "13px 28px",
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none",
    boxShadow: "0 4px 16px rgba(29,158,117,0.3)",
  },
};
