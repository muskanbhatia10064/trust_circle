// FILE: frontend/src/pages/Dashboard.jsx

import { useEffect, useRef, useState } from "react";

let MapView = null;
try {
  MapView = require("../components/MapView").default;
} catch (_) {
  MapView = null;
}

const CIRCLES = [
  {
    id: 1,
    name: "Mahila Bachat Mandal",
    members: 12,
    pool: "₹24,000",
    nextPayout: "15 Jun",
    status: "active",
    color: "#1D9E75",
  },
  {
    id: 2,
    name: "Kisan Sahayata Group",
    members: 8,
    pool: "₹16,000",
    nextPayout: "22 Jun",
    status: "active",
    color: "#0E7A5A",
  },
  {
    id: 3,
    name: "Varanasi Vyapar Circle",
    members: 15,
    pool: "₹45,000",
    nextPayout: "30 Jun",
    status: "active",
    color: "#27AE87",
  },
];

const IMPACT_TARGETS = [
  { label: "Credit Identities Created", value: 47, prefix: "", suffix: "" },
  { label: "Total Secured", value: 340000, prefix: "₹", suffix: "" },
  { label: "Active Circles", value: 12, prefix: "", suffix: "" },
];

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, start]);

  return count;
}

function ImpactCard({ item, animate }) {
  const count = useCountUp(item.value, 2200, animate);

  const display =
    item.value >= 1000
      ? `${item.prefix}${count.toLocaleString("en-IN")}`
      : `${item.prefix}${count}${item.suffix}`;

  return (
    <div style={styles.impactCard}>
      <div style={styles.impactValue}>{display}</div>
      <div style={styles.impactLabel}>{item.label}</div>
      <div style={styles.impactBar}>
        <div
          style={{
            ...styles.impactBarFill,
            width: animate ? "100%" : "0%",
          }}
        />
      </div>
    </div>
  );
}

function CircleCard({ circle }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ ...styles.circleCard, boxShadow: hovered ? "0 6px 24px rgba(29,158,117,0.15)" : styles.circleCard.boxShadow }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...styles.circleAccent, background: circle.color }} />
      <div style={styles.circleContent}>
        <div style={styles.circleName}>{circle.name}</div>
        <div style={styles.circleStats}>
          <span style={styles.circleStat}>
            <span style={styles.circleStatIcon}>👥</span> {circle.members} members
          </span>
          <span style={styles.circleStat}>
            <span style={styles.circleStatIcon}>💰</span> {circle.pool} pool
          </span>
          <span style={styles.circleStat}>
            <span style={styles.circleStatIcon}>📅</span> Payout {circle.nextPayout}
          </span>
        </div>
        <div style={styles.circleStatusBadge}>
          <span style={styles.circleStatusDot} />
          Active
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [animateImpact, setAnimateImpact] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateImpact(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.page}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroGlow} />
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🇮🇳 Community Finance Platform</div>
          <h1 style={styles.heroTitle}>
            Build Trust,<br />
            <span style={styles.heroAccent}>Grow Together</span>
          </h1>
          <p style={styles.heroSub}>
            Join 47+ members across Uttar Pradesh and Bihar building verified
            credit through community savings circles.
          </p>
          <div style={styles.heroActions}>
            <button style={styles.btnPrimary}>Join a Circle</button>
            <button style={styles.btnOutline}>View My Score</button>
          </div>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.heroRing}>
            <div style={styles.heroRingInner}>
              <span style={styles.heroScore}>742</span>
              <span style={styles.heroScoreLabel}>Trust Score</span>
            </div>
          </div>
          <div style={styles.heroPulse1} />
          <div style={styles.heroPulse2} />
        </div>
      </section>

      {/* Impact Counters */}
      <section style={styles.section} ref={sectionRef}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Our Impact</h2>
          <p style={styles.sectionSub}>Real numbers, real lives changed</p>
        </div>
        <div style={styles.impactGrid}>
          {IMPACT_TARGETS.map((item) => (
            <ImpactCard key={item.label} item={item} animate={animateImpact} />
          ))}
        </div>
      </section>

      {/* Circles Overview */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Active Circles</h2>
          <a href="/circles" style={styles.viewAll}>View all →</a>
        </div>
        <div style={styles.circlesGrid}>
          {CIRCLES.map((c) => (
            <CircleCard key={c.id} circle={c} />
          ))}
        </div>
      </section>

      {/* Map Section */}
      {MapView && (
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Circle Map</h2>
            <p style={styles.sectionSub}>Members across North India</p>
          </div>
          <div style={styles.mapWrapper}>
            <MapView />
          </div>
        </section>
      )}

      {/* Activity Feed */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Recent Activity</h2>
        </div>
        <div style={styles.activityList}>
          {[
            { name: "Priya Sharma", action: "contributed ₹2,000", circle: "Mahila Bachat Mandal", time: "2h ago", avatar: "PS" },
            { name: "Amit Yadav", action: "contributed ₹1,800", circle: "Kisan Sahayata Group", time: "5h ago", avatar: "AY" },
            { name: "Rahul Verma", action: "received payout ₹12,000", circle: "Varanasi Vyapar Circle", time: "1d ago", avatar: "RV" },
          ].map((a, i) => (
            <div key={i} style={styles.activityItem}>
              <div style={styles.activityAvatar}>{a.avatar}</div>
              <div style={styles.activityText}>
                <span style={styles.activityName}>{a.name}</span>
                <span style={styles.activityAction}> {a.action} </span>
                <span style={styles.activityCircle}>in {a.circle}</span>
              </div>
              <div style={styles.activityTime}>{a.time}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Sora', sans-serif",
    background: "#F7F9FC",
    minHeight: "100vh",
    color: "#1A2332",
  },

  /* Hero */
  hero: {
    position: "relative",
    background: "linear-gradient(135deg, #0D1F2D 0%, #0E3B2E 50%, #1D9E75 100%)",
    padding: "72px 48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "40px",
    overflow: "hidden",
    flexWrap: "wrap",
  },
  heroGlow: {
    position: "absolute",
    top: "-80px",
    right: "-80px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(29,158,117,0.35) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroContent: {
    flex: "1 1 340px",
    position: "relative",
    zIndex: 1,
  },
  heroBadge: {
    display: "inline-block",
    background: "rgba(29,158,117,0.2)",
    border: "1px solid rgba(29,158,117,0.4)",
    borderRadius: "100px",
    padding: "6px 16px",
    fontSize: "12px",
    color: "#7EDFC0",
    marginBottom: "20px",
    letterSpacing: "0.5px",
  },
  heroTitle: {
    fontSize: "clamp(32px, 5vw, 52px)",
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 1.15,
    margin: "0 0 16px",
  },
  heroAccent: {
    color: "#1D9E75",
  },
  heroSub: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.7)",
    lineHeight: 1.7,
    maxWidth: "400px",
    margin: "0 0 32px",
  },
  heroActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  btnPrimary: {
    background: "#1D9E75",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "12px 28px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    transition: "background 0.2s",
  },
  btnOutline: {
    background: "transparent",
    color: "#fff",
    border: "1.5px solid rgba(255,255,255,0.3)",
    borderRadius: "10px",
    padding: "12px 28px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
  },
  heroVisual: {
    flex: "0 0 auto",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "220px",
    height: "220px",
  },
  heroRing: {
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    background: "conic-gradient(#1D9E75 0% 74%, rgba(255,255,255,0.1) 74% 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 40px rgba(29,158,117,0.4)",
    position: "relative",
    zIndex: 2,
  },
  heroRingInner: {
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    background: "#0D1F2D",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  heroScore: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#1D9E75",
    lineHeight: 1,
  },
  heroScoreLabel: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.5)",
    marginTop: "4px",
  },
  heroPulse1: {
    position: "absolute",
    width: "210px",
    height: "210px",
    borderRadius: "50%",
    border: "2px solid rgba(29,158,117,0.2)",
    animation: "pulse 2.5s ease-in-out infinite",
  },
  heroPulse2: {
    position: "absolute",
    width: "240px",
    height: "240px",
    borderRadius: "50%",
    border: "1px solid rgba(29,158,117,0.1)",
    animation: "pulse 2.5s ease-in-out infinite 0.8s",
  },

  /* Sections */
  section: {
    padding: "48px 48px 0",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "8px",
  },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1A2332",
    margin: 0,
  },
  sectionSub: {
    fontSize: "14px",
    color: "#8899AA",
    margin: 0,
  },
  viewAll: {
    fontSize: "13px",
    color: "#1D9E75",
    textDecoration: "none",
    fontWeight: "600",
  },

  /* Impact Cards */
  impactGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "8px",
  },
  impactCard: {
    background: "#FFFFFF",
    borderRadius: "12px",
    padding: "28px 24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    position: "relative",
    overflow: "hidden",
  },
  impactValue: {
    fontSize: "clamp(28px, 4vw, 38px)",
    fontWeight: "700",
    color: "#1D9E75",
    lineHeight: 1,
    marginBottom: "8px",
    fontVariantNumeric: "tabular-nums",
  },
  impactLabel: {
    fontSize: "13px",
    color: "#6B7A8D",
    fontWeight: "500",
    lineHeight: 1.4,
    marginBottom: "16px",
  },
  impactBar: {
    height: "3px",
    background: "#E8F5F1",
    borderRadius: "100px",
    overflow: "hidden",
  },
  impactBarFill: {
    height: "100%",
    background: "linear-gradient(90deg, #1D9E75, #27AE87)",
    borderRadius: "100px",
    transition: "width 2.2s cubic-bezier(0.19, 1, 0.22, 1)",
  },

  /* Circle Cards */
  circlesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "8px",
  },
  circleCard: {
    background: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    overflow: "hidden",
    transition: "box-shadow 0.25s",
    display: "flex",
    cursor: "pointer",
  },
  circleAccent: {
    width: "4px",
    flexShrink: 0,
  },
  circleContent: {
    padding: "20px",
    flex: 1,
  },
  circleName: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1A2332",
    marginBottom: "12px",
  },
  circleStats: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "12px",
  },
  circleStat: {
    fontSize: "12px",
    color: "#6B7A8D",
    background: "#F7F9FC",
    borderRadius: "6px",
    padding: "4px 10px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  circleStatIcon: {
    fontSize: "12px",
  },
  circleStatusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#E8F5F1",
    color: "#1D9E75",
    borderRadius: "100px",
    padding: "4px 12px",
    fontSize: "11px",
    fontWeight: "600",
  },
  circleStatusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#1D9E75",
    animation: "blink 1.5s ease-in-out infinite",
  },

  /* Map */
  mapWrapper: {
    background: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    overflow: "hidden",
    minHeight: "300px",
    marginBottom: "8px",
  },

  /* Activity */
  activityList: {
    background: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    overflow: "hidden",
    marginBottom: "48px",
  },
  activityItem: {
    display: "flex",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #F0F4F8",
    gap: "14px",
  },
  activityAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1D9E75, #0E7A5A)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "700",
    flexShrink: 0,
  },
  activityText: {
    flex: 1,
    fontSize: "13px",
    lineHeight: 1.5,
    color: "#4A5568",
  },
  activityName: {
    fontWeight: "600",
    color: "#1A2332",
  },
  activityAction: {
    color: "#4A5568",
  },
  activityCircle: {
    color: "#1D9E75",
    fontWeight: "500",
  },
  activityTime: {
    fontSize: "12px",
    color: "#A0ADB8",
    flexShrink: 0,
  },
};

// Inject keyframes globally once
if (typeof document !== "undefined" && !document.getElementById("tc-keyframes")) {
  const style = document.createElement("style");
  style.id = "tc-keyframes";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.06); opacity: 0.2; }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `;
  document.head.appendChild(style);
}
