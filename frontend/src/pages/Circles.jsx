// FILE: frontend/src/pages/Circles.jsx

import { useEffect, useRef, useState } from "react";
import { circleApi } from "../services/api";
import PaymentModal from "../components/PaymentModal";
import { useAuth } from "../hooks/useAuth";

function getScoreColor(score) {
  if (!score) return "#A0ADB8";
  if (score >= 800) return "#1D9E75";
  if (score >= 600) return "#27AE87";
  if (score >= 400) return "#E8A020";
  return "#E05252";
}

function getScoreLabel(score) {
  if (!score) return "N/A";
  if (score >= 800) return "Excellent";
  if (score >= 600) return "Good";
  if (score >= 400) return "Fair";
  return "Poor";
}

function initials(name) {
  if (!name) return "?";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function FlipBadge({ status }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [current, setCurrent] = useState(status);
  const prev = useRef(status);
  useEffect(() => {
    if (prev.current !== status) {
      setIsFlipped(true);
      const t = setTimeout(() => { setCurrent(status); prev.current = status; setIsFlipped(false); }, 350);
      return () => clearTimeout(t);
    }
  }, [status]);
  const isPaid = current === "paid";
  return (
    <div style={{ perspective: "600px", flexShrink: 0, transform: isFlipped ? "rotateY(90deg)" : "rotateY(0deg)", transition: "transform 0.35s ease-in-out" }}>
      <div style={{ borderRadius: "100px", padding: "5px 12px", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px", whiteSpace: "nowrap", background: isPaid ? "#E8F5F1" : "#F5F5F5", color: isPaid ? "#1D9E75" : "#909090", border: `1.5px solid ${isPaid ? "#B8E0D0" : "#E0E0E0"}` }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isPaid ? "#1D9E75" : "#BBBBBB", display: "inline-block" }} />
        {isPaid ? "Paid" : "Pending"}
      </div>
    </div>
  );
}

function ScoreArc({ score }) {
  const RADIUS = 18, STROKE = 3;
  const C = 2 * Math.PI * RADIUS;
  const offset = C * (1 - (score || 0) / 1000);
  const color = getScoreColor(score);
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r={RADIUS} fill="none" stroke="#F0F4F8" strokeWidth={STROKE} />
      <circle cx="24" cy="24" r={RADIUS} fill="none" stroke={color} strokeWidth={STROKE} strokeLinecap="round"
        strokeDasharray={C} strokeDashoffset={offset}
        style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 0.8s ease" }} />
    </svg>
  );
}

function MemberCard({ member }) {
  const [hovered, setHovered] = useState(false);
  const scoreColor = getScoreColor(member.trust_score);
  const isPaid = member.payment_status === "paid";
  return (
    <div style={{ ...styles.card, boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.10)" : styles.card.boxShadow, transform: hovered ? "translateY(-2px)" : "translateY(0)" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={styles.cardTop}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "13px", fontWeight: "700", background: `linear-gradient(135deg, ${scoreColor}, ${scoreColor}CC)` }}>
            {initials(member.name)}
          </div>
          <div style={{ position: "absolute", top: "-2px", left: "-2px", pointerEvents: "none" }}>
            <ScoreArc score={member.trust_score} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "15px", fontWeight: "600", color: "#1A2332", marginBottom: "3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{member.name}</div>
          <div style={{ fontSize: "12px", color: "#8899AA" }}>📍 {member.district || member.state || "—"}</div>
        </div>
        <FlipBadge status={member.payment_status || "pending"} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F7F9FC", borderRadius: "10px", padding: "12px 16px", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <div style={{ fontSize: "24px", fontWeight: "700", color: scoreColor, fontVariantNumeric: "tabular-nums" }}>{member.trust_score ?? "—"}</div>
          <div style={{ fontSize: "12px", color: "#8899AA" }}>Trust Score</div>
        </div>
        <div style={{ borderRadius: "100px", padding: "4px 12px", fontSize: "11px", fontWeight: "700", background: `${scoreColor}18`, color: scoreColor }}>{getScoreLabel(member.trust_score)}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {isPaid ? (
          <>
            <span style={{ fontSize: "14px", color: "#1D9E75", fontWeight: "700" }}>✓</span>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#1A2332" }}>₹{member.last_paid_amount?.toLocaleString("en-IN") || "—"}</span>
            <span style={{ fontSize: "12px", color: "#8899AA" }}>{member.last_paid_at ? new Date(member.last_paid_at).toLocaleDateString("en-IN") : ""}</span>
          </>
        ) : (
          <>
            <span>⏳</span>
            <span style={{ fontSize: "13px", color: "#B0A060", fontWeight: "500" }}>Payment due</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function Circles() {
  const { user } = useAuth();
  const [circles, setCircles] = useState([]);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", contribution_amount: "", cycle_days: 30 });
  const [contributing, setContributing] = useState(false);
  const [payModal, setPayModal] = useState(null); // { circle, amount }
  const [msg, setMsg] = useState("");

  const loadCircles = () =>
    circleApi.list().then(r => setCircles(r.data)).catch(() => {});

  useEffect(() => {
    loadCircles().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCircle) return;
    setMembersLoading(true);
    circleApi.getMembers(selectedCircle.id)
      .then(r => setMembers(r.data))
      .catch(() => setMembers([]))
      .finally(() => setMembersLoading(false));
  }, [selectedCircle]);

  async function createCircle(e) {
    e.preventDefault();
    try {
      const payload = { name: form.name.trim(), contribution_amount: parseFloat(form.contribution_amount), cycle_days: parseInt(form.cycle_days) || 30 };
      await circleApi.create(payload);
      setMsg("Circle created!"); setShowCreate(false);
      setForm({ name: "", contribution_amount: "", cycle_days: 30 });
      await loadCircles();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setMsg(typeof detail === 'string' ? detail : JSON.stringify(detail) || "Failed to create circle");
    }
    setTimeout(() => setMsg(""), 3000);
  }

  function contribute(circleId) {
    const circle = circles.find(c => c.id === circleId);
    setPayModal({ circle, amount: circle?.contribution_amount || "" });
  }

  async function handlePayConfirm() {
    if (!payModal) return;
    setContributing(true);
    try {
      const r = await circleApi.contribute(payModal.circle.id, parseFloat(payModal.amount));
      setMsg(`✅ Pool: ₹${r.data.pool_balance} | Trust Score: ${r.data.trust_score?.updated}`);
      await loadCircles();
      if (selectedCircle?.id === payModal.circle.id) {
        const mr = await circleApi.getMembers(payModal.circle.id);
        setMembers(mr.data);
      }
    } catch (err) {
      setMsg(err.response?.data?.detail || "Contribution failed");
    } finally {
      setContributing(false);
      setTimeout(() => setMsg(""), 4000);
    }
  }

  const filtered = members.filter(m => filter === "all" ? true : m.payment_status === filter);
  const paidCount = members.filter(m => m.payment_status === "paid").length;
  const pendingCount = members.filter(m => m.payment_status !== "paid").length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {msg && <div style={styles.msgBanner}>{msg}</div>}

        {/* My Circles list */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>My Circles</h1>
            <p style={styles.pageSub}>{circles.length} active circle{circles.length !== 1 ? "s" : ""}</p>
          </div>
          <button style={styles.createBtn} onClick={() => setShowCreate(v => !v)}>+ New Circle</button>
        </div>

        {showCreate && (
          <div style={styles.formCard}>
            <h3 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "700" }}>Create Circle</h3>
            <form onSubmit={createCircle} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input placeholder="Circle name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={styles.input} />
              <input type="number" placeholder="Monthly contribution (₹)" value={form.contribution_amount} onChange={e => setForm({ ...form, contribution_amount: e.target.value })} required style={styles.input} />
              <input type="number" placeholder="Cycle days (default 30)" value={form.cycle_days} onChange={e => setForm({ ...form, cycle_days: +e.target.value })} style={styles.input} />
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" style={styles.createBtn}>Create</button>
                <button type="button" onClick={() => setShowCreate(false)} style={styles.cancelBtn}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div style={styles.emptyBox}>Loading your circles…</div>
        ) : circles.length === 0 ? (
          <div style={styles.emptyBox}>You're not in any circle yet. Create one above!</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginBottom: "40px" }}>
            {circles.map(c => (
              <div key={c.id} style={{ ...styles.circleListCard, border: selectedCircle?.id === c.id ? "2px solid #1D9E75" : "2px solid transparent" }}
                onClick={() => setSelectedCircle(selectedCircle?.id === c.id ? null : c)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ fontSize: "15px", fontWeight: "600", color: "#1A2332" }}>{c.name}</div>
                  <span style={{ fontSize: "11px", fontWeight: "600", color: "#1D9E75", background: "#E8F5F1", borderRadius: "100px", padding: "3px 10px" }}>{c.status}</span>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                  <span style={styles.chip}>💰 ₹{c.pool_balance?.toLocaleString("en-IN")} pool</span>
                  <span style={styles.chip}>📅 ₹{c.contribution_amount}/cycle</span>
                </div>
                <button style={styles.payBtn} onClick={e => { e.stopPropagation(); contribute(c.id); }} disabled={contributing}>
                  {contributing ? "Processing…" : "Pay Contribution"}
                </button>
                {c.upi_qr_image && <div style={{ fontSize: "11px", color: "#1D9E75", marginTop: "6px", textAlign: "center" }}>✅ UPI QR uploaded</div>}
                <label style={{ ...styles.payBtn, background: "#F0FAF5", color: "#1D9E75", border: "1px solid #B8E0D0", marginTop: "6px", cursor: "pointer", textAlign: "center", display: "block" }}>
                  📷 {c.upi_qr_image ? "Update QR" : "Upload UPI QR"}
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={async e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    try {
                      await circleApi.uploadQr(c.id, file);
                      setMsg("✅ QR uploaded! Members will see your real QR when paying.");
                      await loadCircles();
                    } catch { setMsg("Failed to upload QR"); }
                    setTimeout(() => setMsg(""), 3000);
                  }} />
                </label>
              </div>
            ))}
          </div>
        )}

        {/* Members of selected circle */}
        {selectedCircle && (
          <>
            <div style={styles.pageHeader}>
              <div>
                <h2 style={styles.pageTitle}>{selectedCircle.name}</h2>
                <p style={styles.pageSub}>{members.length} members</p>
              </div>
              <div style={styles.poolBadge}>
                <span style={{ display: "block", fontSize: "11px", opacity: 0.8, marginBottom: "2px" }}>Pool</span>
                <span style={{ display: "block", fontSize: "22px", fontWeight: "700" }}>₹{selectedCircle.pool_balance?.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {members.length > 0 && (
              <>
                <div style={styles.statsRow}>
                  {[
                    { value: paidCount, label: "Paid", color: "#1D9E75" },
                    { value: pendingCount, label: "Pending", color: "#E8A020" },
                    { value: `${Math.round((paidCount / members.length) * 100)}%`, label: "Completion", color: "#1D9E75" },
                  ].map(s => (
                    <div key={s.label} style={styles.statCard}>
                      <div style={{ fontSize: "22px", fontWeight: "700", color: s.color, lineHeight: 1, marginBottom: "4px" }}>{s.value}</div>
                      <div style={{ fontSize: "11px", color: "#8899AA" }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#6B7A8D", marginBottom: "8px" }}>
                    <span>Collection Progress</span>
                    <span style={{ color: "#1D9E75", fontWeight: "600" }}>{paidCount}/{members.length}</span>
                  </div>
                  <div style={{ height: "8px", background: "#E8F5F1", borderRadius: "100px", overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "linear-gradient(90deg, #1D9E75, #27AE87)", borderRadius: "100px", width: `${(paidCount / members.length) * 100}%`, transition: "width 0.8s ease" }} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                  {["all", "paid", "pending"].map(f => (
                    <button key={f} style={{ ...styles.filterBtn, background: filter === f ? "#1D9E75" : "#FFF", color: filter === f ? "#FFF" : "#6B7A8D" }} onClick={() => setFilter(f)}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                      <span style={{ borderRadius: "100px", padding: "1px 7px", fontSize: "11px", fontWeight: "700", background: filter === f ? "rgba(255,255,255,0.2)" : "#F0F4F8", color: filter === f ? "#fff" : "#8899AA" }}>
                        {f === "all" ? members.length : f === "paid" ? paidCount : pendingCount}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {membersLoading ? (
              <div style={styles.emptyBox}>Loading members…</div>
            ) : members.length === 0 ? (
              <div style={styles.emptyBox}>No members found for this circle.</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                {filtered.map((m, i) => <MemberCard key={m.user_id || i} member={m} />)}
              </div>
            )}
          </>
        )}
      </div>
      {payModal && (
        <PaymentModal
          circle={payModal.circle}
          amount={payModal.amount}
          onConfirm={handlePayConfirm}
          onClose={() => setPayModal(null)}
        />
      )}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}

const styles = {
  page: { fontFamily: "'Sora', sans-serif", background: "#F7F9FC", minHeight: "100vh", paddingBottom: "60px" },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" },
  pageHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "16px" },
  pageTitle: { fontSize: "26px", fontWeight: "700", color: "#1A2332", margin: "0 0 4px" },
  pageSub: { fontSize: "14px", color: "#8899AA", margin: 0 },
  poolBadge: { background: "linear-gradient(135deg, #1D9E75, #0E7A5A)", borderRadius: "14px", padding: "16px 24px", textAlign: "center", color: "#fff", boxShadow: "0 4px 16px rgba(29,158,117,0.3)" },
  createBtn: { background: "linear-gradient(135deg, #1D9E75, #0E7A5A)", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  cancelBtn: { background: "#F0F4F8", color: "#6B7A8D", border: "none", borderRadius: "10px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  payBtn: { background: "#E8F5F1", color: "#1D9E75", border: "1.5px solid #B8E0D0", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "'Sora', sans-serif", width: "100%" },
  formCard: { background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" },
  input: { width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "14px", fontFamily: "'Sora', sans-serif", outline: "none", boxSizing: "border-box" },
  circleListCard: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", cursor: "pointer", transition: "all 0.2s" },
  chip: { fontSize: "12px", color: "#6B7A8D", background: "#F7F9FC", borderRadius: "6px", padding: "4px 10px" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" },
  statCard: { background: "#FFFFFF", borderRadius: "12px", padding: "16px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
  filterBtn: { border: "none", borderRadius: "100px", padding: "8px 18px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Sora', sans-serif", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  card: { background: "#FFFFFF", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "box-shadow 0.25s, transform 0.25s" },
  cardTop: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" },
  msgBanner: { background: "#E8F5F1", border: "1px solid #B8E0D0", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#0E7A5A", fontWeight: "500", marginBottom: "20px" },
  emptyBox: { background: "#fff", borderRadius: "12px", padding: "40px", textAlign: "center", color: "#8899AA", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" },
};
