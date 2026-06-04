// FILE: frontend/src/pages/Dashboard.jsx

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../components/MapView";
import { adminApi, circleApi } from "../services/api";

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (!start || target === 0) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
      else setCount(target);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, start]);
  return count;
}

function ImpactCard({ item, animate }) {
  const count = useCountUp(item.value, 2200, animate);
  const display = item.value >= 1000
    ? `${item.prefix}${count.toLocaleString("en-IN")}`
    : `${item.prefix}${count}`;
  return (
    <div style={styles.impactCard}>
      <div style={styles.impactValue}>{display}</div>
      <div style={styles.impactLabel}>{item.label}</div>
      <div style={styles.impactBar}>
        <div style={{ ...styles.impactBarFill, width: animate ? "100%" : "0%" }} />
      </div>
    </div>
  );
}

function CircleCard({ circle }) {
  const [hovered, setHovered] = useState(false);
  const colors = ["#1D9E75", "#0E7A5A", "#27AE87"];
  const color = colors[circle.id % colors.length] || "#1D9E75";
  return (
    <div
      style={{ ...styles.circleCard, boxShadow: hovered ? "0 6px 24px rgba(29,158,117,0.15)" : styles.circleCard.boxShadow }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...styles.circleAccent, background: color }} />
      <div style={styles.circleContent}>
        <div style={styles.circleName}>{circle.name}</div>
        <div style={styles.circleStats}>
          <span style={styles.circleStat}>💰 ₹{circle.pool_balance?.toLocaleString("en-IN") || 0} pool</span>
          <span style={styles.circleStat}>📅 ₹{circle.contribution_amount}/cycle</span>
        </div>
        <div style={styles.circleStatusBadge}>
          <span style={styles.circleStatusDot} /> {circle.status || "Active"}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [animateImpact, setAnimateImpact] = useState(false);
  const [stats, setStats] = useState({ credit_identities_created: 0, total_pooled: 0, active_circles: 0 });
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.getStats().then(r => setStats(r.data)).catch(() => {}),
      circleApi.list().then(r => setCircles(r.data)).catch(() => {}),
    ]).finally(() => {
      setLoading(false);
      setTimeout(() => setAnimateImpact(true), 400);
    });
  }, []);

  const impactItems = [
    { label: "Credit Identities Created", value: stats.credit_identities_created, prefix: "" },
    { label: "Total Pooled", value: Math.round(stats.total_pooled), prefix: "₹" },
    { label: "Active Circles", value: stats.active_circles, prefix: "" },
  ];

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroGlow} />
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🇮🇳 Community Finance Platform</div>
          <h1 style={styles.heroTitle}>Build Trust,<br /><span style={styles.heroAccent}>Grow Together</span></h1>
          <p style={styles.heroSub}>Building verified credit through community savings circles across India.</p>
          <div style={styles.heroActions}>
            <button style={styles.btnPrimary} onClick={() => navigate("/circles")}>Join a Circle</button>
            <button style={styles.btnOutline} onClick={() => navigate("/trust-score")}>View My Score</button>
          </div>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.heroRing}>
            <div style={styles.heroRingInner}>
              <span style={styles.heroScore}>{stats.credit_identities_created || "—"}</span>
              <span style={styles.heroScoreLabel}>Members</span>
            </div>
          </div>
          <div style={styles.heroPulse1} />
          <div style={styles.heroPulse2} />
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Our Impact</h2>
          <p style={styles.sectionSub}>Live numbers from the platform</p>
        </div>
        <div style={styles.impactGrid}>
          {impactItems.map((item) => (
            <ImpactCard key={item.label} item={item} animate={animateImpact} />
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>My Circles</h2>
          <a href="/circles" style={styles.viewAll}>View all →</a>
        </div>
        {loading ? (
          <div style={styles.loadingBox}>Loading your circles…</div>
        ) : circles.length === 0 ? (
          <div style={styles.emptyBox}>
            <p>You're not in any circle yet.</p>
            <button style={{ ...styles.btnPrimary, marginTop: "12px" }} onClick={() => navigate("/circles")}>Create or Join a Circle</button>
          </div>
        ) : (
          <div style={styles.circlesGrid}>
            {circles.map((c) => <CircleCard key={c.id} circle={c} />)}
          </div>
        )}
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Circle Map</h2>
          <p style={styles.sectionSub}>Members across North India</p>
        </div>
        <div style={styles.mapWrapper}><MapView /></div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.06);opacity:.2} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>
    </div>
  );
}

const styles = {
  page: { fontFamily: "'Sora', sans-serif", background: "#F7F9FC", minHeight: "100vh", color: "#1A2332" },
  hero: { position: "relative", background: "linear-gradient(135deg, #0D1F2D 0%, #0E3B2E 50%, #1D9E75 100%)", padding: "72px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px", overflow: "hidden", flexWrap: "wrap" },
  heroGlow: { position: "absolute", top: "-80px", right: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(29,158,117,0.35) 0%, transparent 70%)", pointerEvents: "none" },
  heroContent: { flex: "1 1 340px", position: "relative", zIndex: 1 },
  heroBadge: { display: "inline-block", background: "rgba(29,158,117,0.2)", border: "1px solid rgba(29,158,117,0.4)", borderRadius: "100px", padding: "6px 16px", fontSize: "12px", color: "#7EDFC0", marginBottom: "20px" },
  heroTitle: { fontSize: "clamp(32px, 5vw, 52px)", fontWeight: "700", color: "#FFFFFF", lineHeight: 1.15, margin: "0 0 16px" },
  heroAccent: { color: "#1D9E75" },
  heroSub: { fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: "400px", margin: "0 0 32px" },
  heroActions: { display: "flex", gap: "12px", flexWrap: "wrap" },
  btnPrimary: { background: "#1D9E75", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 28px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  btnOutline: { background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: "10px", padding: "12px 28px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  heroVisual: { flex: "0 0 auto", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "220px", height: "220px" },
  heroRing: { width: "180px", height: "180px", borderRadius: "50%", background: "conic-gradient(#1D9E75 0% 74%, rgba(255,255,255,0.1) 74% 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(29,158,117,0.4)", position: "relative", zIndex: 2 },
  heroRingInner: { width: "140px", height: "140px", borderRadius: "50%", background: "#0D1F2D", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  heroScore: { fontSize: "36px", fontWeight: "700", color: "#1D9E75", lineHeight: 1 },
  heroScoreLabel: { fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "4px" },
  heroPulse1: { position: "absolute", width: "210px", height: "210px", borderRadius: "50%", border: "2px solid rgba(29,158,117,0.2)", animation: "pulse 2.5s ease-in-out infinite" },
  heroPulse2: { position: "absolute", width: "240px", height: "240px", borderRadius: "50%", border: "1px solid rgba(29,158,117,0.1)", animation: "pulse 2.5s ease-in-out infinite 0.8s" },
  section: { padding: "48px 48px 0", maxWidth: "1200px", margin: "0 auto" },
  sectionHeader: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "8px" },
  sectionTitle: { fontSize: "22px", fontWeight: "700", color: "#1A2332", margin: 0 },
  sectionSub: { fontSize: "14px", color: "#8899AA", margin: 0 },
  viewAll: { fontSize: "13px", color: "#1D9E75", textDecoration: "none", fontWeight: "600" },
  impactGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "8px" },
  impactCard: { background: "#FFFFFF", borderRadius: "12px", padding: "28px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" },
  impactValue: { fontSize: "clamp(28px, 4vw, 38px)", fontWeight: "700", color: "#1D9E75", lineHeight: 1, marginBottom: "8px", fontVariantNumeric: "tabular-nums" },
  impactLabel: { fontSize: "13px", color: "#6B7A8D", fontWeight: "500", marginBottom: "16px" },
  impactBar: { height: "3px", background: "#E8F5F1", borderRadius: "100px", overflow: "hidden" },
  impactBarFill: { height: "100%", background: "linear-gradient(90deg, #1D9E75, #27AE87)", borderRadius: "100px", transition: "width 2.2s cubic-bezier(0.19, 1, 0.22, 1)" },
  circlesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "8px" },
  circleCard: { background: "#FFFFFF", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden", transition: "box-shadow 0.25s", display: "flex", cursor: "pointer" },
  circleAccent: { width: "4px", flexShrink: 0 },
  circleContent: { padding: "20px", flex: 1 },
  circleName: { fontSize: "15px", fontWeight: "600", color: "#1A2332", marginBottom: "12px" },
  circleStats: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" },
  circleStat: { fontSize: "12px", color: "#6B7A8D", background: "#F7F9FC", borderRadius: "6px", padding: "4px 10px" },
  circleStatusBadge: { display: "inline-flex", alignItems: "center", gap: "6px", background: "#E8F5F1", color: "#1D9E75", borderRadius: "100px", padding: "4px 12px", fontSize: "11px", fontWeight: "600" },
  circleStatusDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#1D9E75", animation: "blink 1.5s ease-in-out infinite" },
  mapWrapper: { background: "#FFFFFF", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: "48px" },
  loadingBox: { background: "#fff", borderRadius: "12px", padding: "40px", textAlign: "center", color: "#8899AA", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
  emptyBox: { background: "#fff", borderRadius: "12px", padding: "40px", textAlign: "center", color: "#6B7A8D", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
};
