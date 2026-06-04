// FILE: frontend/src/pages/TrustScore.jsx

import { useEffect, useRef, useState } from "react";
import { trustApi } from "../services/api";

const MAX_SCORE = 1000;
const ANIMATION_DURATION = 1500;

const SCORE_FACTORS = [
  { label: "Payment Reliability", icon: "💳", description: "On-time payment rate across all circles", color: "#1D9E75" },
  { label: "Community Participation", icon: "🤝", description: "Active engagement in circle activities", color: "#27AE87" },
  { label: "Circle Longevity", icon: "🏛️", description: "Duration of active circle memberships", color: "#0E7A5A" },
];

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function getBand(score) {
  if (score >= 800) return "EXCELLENT";
  if (score >= 600) return "GOOD";
  if (score >= 400) return "FAIR";
  return "POOR";
}

function ScoreRing({ score, animating }) {
  const RADIUS = 90, STROKE = 14;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const offset = CIRCUMFERENCE * (1 - score / MAX_SCORE);
  let color = "#1D9E75";
  if (score < 600) color = "#E8A020";
  if (score < 400) color = "#E05252";

  return (
    <svg width="240" height="240" viewBox="0 0 240 240" style={{ overflow: "visible" }}>
      <circle cx="120" cy="120" r={RADIUS} fill="none" stroke="#E8F5F1" strokeWidth={STROKE} />
      <circle cx="120" cy="120" r={RADIUS} fill="none" stroke={color} strokeWidth={STROKE}
        strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={offset}
        style={{ transform: "rotate(-90deg)", transformOrigin: "center",
          transition: animating ? `stroke-dashoffset ${ANIMATION_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1)` : "none",
          filter: `drop-shadow(0 0 8px ${color}80)` }}
      />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const inner = RADIUS - STROKE / 2 - 6;
        const outer = RADIUS + STROKE / 2 + 4;
        return <line key={i} x1={120 + inner * Math.cos(rad)} y1={120 + inner * Math.sin(rad)}
          x2={120 + outer * Math.cos(rad)} y2={120 + outer * Math.sin(rad)} stroke="#E8F5F1" strokeWidth="1" opacity="0.5" />;
      })}
    </svg>
  );
}

function FactorBar({ factor, score, animate }) {
  const value = Math.round((score / MAX_SCORE) * 100);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setWidth(value), 300);
    return () => clearTimeout(t);
  }, [animate, value]);

  return (
    <div style={styles.factorCard}>
      <div style={styles.factorHeader}>
        <div style={styles.factorIconWrap}><span style={{ fontSize: "20px" }}>{factor.icon}</span></div>
        <div style={{ flex: 1, minWidth: "140px" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#1A2332" }}>{factor.label}</div>
          <div style={{ fontSize: "12px", color: "#8899AA", marginTop: "2px" }}>{factor.description}</div>
        </div>
        <div style={{ fontSize: "20px", fontWeight: "700", color: factor.color }}>{value}%</div>
      </div>
      <div style={styles.factorBarBg}>
        <div style={{ ...styles.factorBarFill, width: `${width}%`, background: factor.color, transition: "width 1.2s cubic-bezier(0.34, 1.2, 0.64, 1)" }} />
      </div>
    </div>
  );
}

export default function TrustScore() {
  const [scoreData, setScoreData] = useState(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [animRingScore, setAnimRingScore] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [factorsVisible, setFactorsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [computing, setComputing] = useState(false);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  function animateToScore(from, to) {
    setAnimating(true);
    setAnimRingScore(to);
    startTimeRef.current = null;
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      const eased = easeOutCubic(progress);
      setDisplayScore(Math.round(from + eased * (to - from)));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      else { setDisplayScore(to); setFactorsVisible(true); }
    };
    rafRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
    trustApi.getMyScore()
      .then(r => {
        setScoreData(r.data);
        const prev = r.data.previous_score || 0;
        const curr = r.data.score;
        setDisplayScore(prev);
        setTimeout(() => animateToScore(prev, curr), 600);
      })
      .catch(() => setError("No score yet. Click 'Compute Score' to generate yours."))
      .finally(() => setLoading(false));
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  async function computeScore() {
    setComputing(true);
    setError("");
    try {
      const r = await trustApi.compute();
      const prev = scoreData?.score || 0;
      setScoreData(r.data);
      setFactorsVisible(false);
      setTimeout(() => animateToScore(prev, r.data.score), 200);
    } catch {
      setError("Failed to compute score. Try again.");
    } finally {
      setComputing(false);
    }
  }

  const currentScore = scoreData?.score || 0;
  const previousScore = scoreData?.previous_score || 0;
  const gained = currentScore - previousScore;
  const band = getBand(currentScore);

  if (loading) return (
    <div style={{ fontFamily: "'Sora', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "#8899AA" }}>
      Loading your trust score…
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Trust Score</h1>
          <p style={styles.pageSub}>Your financial credibility in the community</p>
        </div>

        {error && !scoreData && (
          <div style={styles.emptyCard}>
            <p style={{ color: "#6B7A8D", marginBottom: "16px" }}>{error}</p>
            <button style={styles.computeBtn} onClick={computeScore} disabled={computing}>
              {computing ? "Computing…" : "🚀 Compute My Score"}
            </button>
          </div>
        )}

        {scoreData && (
          <>
            <div style={styles.scoreCard}>
              <div style={styles.scoreCardBg} />
              <div style={styles.ringSection}>
                <div style={styles.ringWrapper}>
                  <ScoreRing score={animRingScore} animating={animating} />
                  <div style={styles.ringCenter}>
                    <div style={styles.scoreNumber}>{displayScore}</div>
                    <div style={{ fontSize: "13px", color: "#6B7A8D", marginTop: "4px", fontWeight: "500" }}>Trust Score</div>
                    <div style={{ fontSize: "11px", color: "#A0ADB8", marginTop: "2px" }}>out of {MAX_SCORE}</div>
                  </div>
                </div>
                <div style={styles.scoreMeta}>
                  {gained !== 0 && (
                    <div style={styles.gainBadge}>
                      <span style={{ fontSize: "18px", color: gained > 0 ? "#1D9E75" : "#E05252", fontWeight: "700" }}>{gained > 0 ? "↑" : "↓"}</span>
                      <span style={{ fontSize: "15px", fontWeight: "700", color: gained > 0 ? "#1D9E75" : "#E05252" }}>
                        {gained > 0 ? "+" : ""}{gained.toFixed(1)} points
                      </span>
                    </div>
                  )}
                  {previousScore > 0 && <div style={{ fontSize: "12px", color: "#A0ADB8", marginBottom: "20px" }}>Previous: {previousScore}</div>}
                  <div style={styles.percentileBox}>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#1A2332" }}>{band}</div>
                    <div style={{ fontSize: "12px", color: "#6B7A8D", marginTop: "2px" }}>Score rating</div>
                  </div>
                  <div style={{ display: "flex", gap: "6px", alignItems: "flex-end" }}>
                    {[{ label: "Poor", max: 400 }, { label: "Fair", max: 600 }, { label: "Good", max: 800 }, { label: "Excellent", max: 1000 }].map((b) => {
                      const active = band === b.label.toUpperCase();
                      return (
                        <div key={b.label} style={{ textAlign: "center" }}>
                          <div style={{ height: "8px", borderRadius: "4px", width: "42px", marginBottom: "4px", background: active ? "#1D9E75" : "#E8F5F1", transition: "background 0.3s" }} />
                          <div style={{ fontSize: "10px", color: active ? "#1D9E75" : "#A0ADB8", fontWeight: active ? "700" : "400" }}>{b.label}</div>
                        </div>
                      );
                    })}
                  </div>
                  <button style={{ ...styles.computeBtn, marginTop: "20px" }} onClick={computeScore} disabled={computing}>
                    {computing ? "Computing…" : "↻ Recompute Score"}
                  </button>
                </div>
              </div>
            </div>

            <div style={styles.factorsSection}>
              <h2 style={styles.factorsTitle}>Score Breakdown</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {SCORE_FACTORS.map((f) => (
                  <FactorBar key={f.label} factor={f} score={currentScore} animate={factorsVisible} />
                ))}
              </div>
            </div>
          </>
        )}

        <div style={styles.tipsCard}>
          <div style={{ fontSize: "24px", flexShrink: 0, marginTop: "2px" }}>💡</div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#0E7A5A", marginBottom: "8px" }}>How to improve your score</div>
            <ul style={{ margin: 0, padding: "0 0 0 18px", color: "#2D6A4F", fontSize: "13px", lineHeight: 1.9 }}>
              <li>Make all circle payments on time</li>
              <li>Join more circles and stay active</li>
              <li>Complete full circle cycles to earn completion bonus</li>
            </ul>
          </div>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');`}</style>
    </div>
  );
}

const styles = {
  page: { fontFamily: "'Sora', sans-serif", background: "#F7F9FC", minHeight: "100vh", paddingBottom: "60px" },
  container: { maxWidth: "860px", margin: "0 auto", padding: "40px 24px" },
  pageHeader: { marginBottom: "32px" },
  pageTitle: { fontSize: "28px", fontWeight: "700", color: "#1A2332", margin: "0 0 6px" },
  pageSub: { fontSize: "14px", color: "#6B7A8D", margin: 0 },
  emptyCard: { background: "#fff", borderRadius: "20px", padding: "48px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" },
  scoreCard: { background: "#FFFFFF", borderRadius: "20px", padding: "40px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", position: "relative", overflow: "hidden", marginBottom: "24px" },
  scoreCardBg: { position: "absolute", top: 0, right: 0, width: "300px", height: "300px", background: "radial-gradient(circle, rgba(29,158,117,0.06) 0%, transparent 70%)", pointerEvents: "none" },
  ringSection: { display: "flex", alignItems: "center", gap: "48px", flexWrap: "wrap", justifyContent: "center" },
  ringWrapper: { position: "relative", width: "240px", height: "240px", flexShrink: 0 },
  ringCenter: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" },
  scoreNumber: { fontSize: "48px", fontWeight: "700", color: "#1A2332", lineHeight: 1, fontVariantNumeric: "tabular-nums" },
  scoreMeta: { flex: 1, minWidth: "220px" },
  gainBadge: { display: "inline-flex", alignItems: "center", gap: "6px", background: "linear-gradient(135deg, #E8F5F1, #D0EDE3)", border: "1px solid #B8E0D0", borderRadius: "100px", padding: "8px 20px", marginBottom: "10px" },
  percentileBox: { background: "#F7F9FC", borderRadius: "12px", padding: "16px 20px", marginBottom: "20px" },
  factorsSection: { marginBottom: "24px" },
  factorsTitle: { fontSize: "18px", fontWeight: "700", color: "#1A2332", marginBottom: "16px" },
  factorCard: { background: "#FFFFFF", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
  factorHeader: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px", flexWrap: "wrap" },
  factorIconWrap: { width: "42px", height: "42px", background: "#F0FAF5", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  factorBarBg: { height: "6px", background: "#F0F4F8", borderRadius: "100px", overflow: "hidden" },
  factorBarFill: { height: "100%", borderRadius: "100px", width: "0%" },
  tipsCard: { background: "linear-gradient(135deg, #F0FAF5, #E4F5EC)", border: "1px solid #B8E0D0", borderRadius: "12px", padding: "20px 24px", display: "flex", gap: "16px", alignItems: "flex-start" },
  computeBtn: { background: "linear-gradient(135deg, #1D9E75, #0E7A5A)", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "'Sora', sans-serif", boxShadow: "0 4px 16px rgba(29,158,117,0.3)" },
};
