// FILE: frontend/src/pages/Register.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";

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
  const colors = ["#E2E8F0", "#E05252", "#E8A020", "#27AE87", "#1D9E75"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const color = strength > 0 ? colors[strength] : colors[0];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
      <div style={{ display: "flex", gap: "4px", flex: 1 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ flex: 1, height: "3px", borderRadius: "100px", background: i <= strength ? color : "#E2E8F0", transition: "background 0.3s" }} />
        ))}
      </div>
      {password && <span style={{ fontSize: "11px", fontWeight: "600", color, width: "44px", textAlign: "right" }}>{labels[strength]}</span>}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [success, setSuccess] = useState(false);

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    setApiError("");
    try {
      await authApi.register({ name: form.name.trim(), phone: form.phone.trim(), password: form.password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setApiError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputBorder = (field) => ({
    borderColor: errors[field] ? "#E05252" : focusedField === field ? "#1D9E75" : "#E2E8F0",
    boxShadow: errors[field] ? "0 0 0 3px rgba(224,82,82,0.10)" : focusedField === field ? "0 0 0 3px rgba(29,158,117,0.12)" : "none",
  });

  if (success) {
    return (
      <div style={{ fontFamily: "'Sora', sans-serif", background: "#F7F9FC", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <div style={{ background: "#FFFFFF", borderRadius: "20px", padding: "52px 40px", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", textAlign: "center", maxWidth: "400px", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#E8F5F1" />
              <path d="M12 20 L18 26 L28 14" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#1A2332", margin: "0 0 10px" }}>You're in!</h2>
          <p style={{ fontSize: "14px", color: "#6B7A8D", lineHeight: 1.7, margin: "0 0 28px" }}>Welcome to TrustCircle, <strong>{form.name.split(" ")[0]}</strong>. Redirecting to login…</p>
        </div>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: "#F7F9FC", minHeight: "100vh", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px 60px" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px", justifyContent: "center" }}>
          <div style={{ width: "38px", height: "38px", background: "#E8F5F1", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="13" stroke="#1D9E75" strokeWidth="2" /><path d="M7 14 Q14 7 21 14 Q14 21 7 14Z" fill="#1D9E75" opacity="0.9" /></svg>
          </div>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#1A2332" }}>TrustCircle</span>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: "20px", padding: "36px 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#1A2332", margin: "0 0 6px" }}>Create your account</h1>
          <p style={{ fontSize: "13px", color: "#8899AA", margin: "0 0 24px" }}>Join the community finance revolution</p>

          {apiError && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#DC2626", marginBottom: "20px" }}>
              ⚠ {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }} noValidate>
            {[
              { id: "name", label: "Full Name", type: "text", value: form.name, placeholder: "Priya Sharma" },
              { id: "phone", label: "Phone Number", type: "tel", value: form.phone, placeholder: "9876543210" },
            ].map(({ id, label, type, value, placeholder }) => (
              <div key={id} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }} htmlFor={id}>{label}</label>
                <div style={{ display: "flex", alignItems: "center", background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "10px", padding: "0 14px", transition: "border-color 0.2s, box-shadow 0.2s", ...inputBorder(id) }}>
                  <input id={id} type={type} value={value} onChange={update(id)} onFocus={() => setFocusedField(id)} onBlur={() => setFocusedField(null)} placeholder={placeholder}
                    style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: "14px", color: "#1A2332", fontFamily: "'Sora', sans-serif", padding: "12px 0" }} />
                </div>
                {errors[id] && <span style={{ fontSize: "12px", color: "#E05252" }}>{errors[id]}</span>}
              </div>
            ))}

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }} htmlFor="password">Password</label>
              <div style={{ display: "flex", alignItems: "center", background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "10px", padding: "0 14px", transition: "border-color 0.2s, box-shadow 0.2s", ...inputBorder("password") }}>
                <input id="password" type={showPassword ? "text" : "password"} value={form.password} onChange={update("password")} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)} placeholder="Create a strong password"
                  style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: "14px", color: "#1A2332", fontFamily: "'Sora', sans-serif", padding: "12px 0" }} />
                <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginLeft: "8px", display: "flex" }} tabIndex={-1}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A0ADB8" strokeWidth="2">
                    {showPassword ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><line x1="1" y1="1" x2="23" y2="23" /></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                  </svg>
                </button>
              </div>
              {form.password && <StrengthBar password={form.password} />}
              {errors.password && <span style={{ fontSize: "12px", color: "#E05252" }}>{errors.password}</span>}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }} htmlFor="confirmPassword">Confirm Password</label>
              <div style={{ display: "flex", alignItems: "center", background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: "10px", padding: "0 14px", transition: "border-color 0.2s, box-shadow 0.2s", ...inputBorder("confirmPassword") }}>
                <input id="confirmPassword" type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={update("confirmPassword")} onFocus={() => setFocusedField("confirmPassword")} onBlur={() => setFocusedField(null)} placeholder="Re-enter your password"
                  style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: "14px", color: "#1A2332", fontFamily: "'Sora', sans-serif", padding: "12px 0" }} />
                <button type="button" onClick={() => setShowConfirm((v) => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginLeft: "8px", display: "flex" }} tabIndex={-1}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A0ADB8" strokeWidth="2">
                    {showConfirm ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><line x1="1" y1="1" x2="23" y2="23" /></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                  </svg>
                </button>
              </div>
              {form.confirmPassword && form.password === form.confirmPassword && !errors.confirmPassword && (
                <span style={{ fontSize: "12px", color: "#1D9E75", fontWeight: "600" }}>✓ Passwords match</span>
              )}
              {errors.confirmPassword && <span style={{ fontSize: "12px", color: "#E05252" }}>{errors.confirmPassword}</span>}
            </div>

            <button type="submit" disabled={loading} style={{ background: "linear-gradient(135deg, #1D9E75, #0E7A5A)", color: "#FFFFFF", border: "none", borderRadius: "10px", padding: "14px", fontSize: "15px", fontWeight: "600", fontFamily: "'Sora', sans-serif", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.75 : 1, boxShadow: "0 4px 16px rgba(29,158,117,0.35)", marginTop: "4px" }}>
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div style={{ textAlign: "center", fontSize: "13px", color: "#8899AA", marginTop: "20px" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#1D9E75", fontWeight: "600", textDecoration: "none" }}>Sign in</a>
          </div>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap'); @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
