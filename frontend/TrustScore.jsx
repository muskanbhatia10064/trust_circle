// FILE: frontend/src/pages/TrustScore.jsx

import { useEffect, useRef, useState } from "react";

const PREVIOUS_SCORE = 681;
const CURRENT_SCORE = 742;
const MAX_SCORE = 850;
const ANIMATION_DURATION = 1500;

const SCORE_FACTORS = [
  {
    label: "Payment Reliability",
    icon: "💳",
    value: 96,
    description: "On-time payment rate across all circles",
    color: "#1D9E75",
  },
  {
    label: "Community Participation",
    icon: "🤝",
    value: 82,
    description: "Active engagement in circle activities",
    color: "#27AE87",
  },
  {
    label: "Circle Longevity",
    icon: "🏛️",
    value: 74,
    description: "Duration of active circle memberships",
    color: "#0E7A5A",
  },
];

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function ScoreRing({ score, animating }) {
  const RADIUS = 90;
  const STROKE = 14;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const percent = score / MAX_SCORE;
  const offset = CIRCUMFERENCE * (1 - percent);

  let color = "#1D9E75";
  if (score < 600) color = "#E8A020";
  if (score < 500) color = "#E05252";

  return (
    <svg width="240" height="240" viewBox="0 0 240 240" style={{ overflow: "visible" }}>
      {/* Background ring */}
      <circle
        cx="120"
        cy="120"
        r={RADIUS}
        fill="none"
        stroke="#E8F5F1"
        strokeWidth={STROKE}
      />
      {/* Score ring */}
      <circle
        cx="120"
        cy="120"
        r={RADIUS}
        fill="none"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "center",
          transition: animating
            ? `stroke-dashoffset ${ANIMATION_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1)`
            : "none",
          filter: `drop-shadow(0 0 8px ${color}80)`,
        }}
      />
      {/* Tick marks */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const inner = RADIUS - STROKE / 2 - 6;
        const outer = RADIUS + STROKE / 2 + 4;
        const x1 = 120 + inner * Math.cos(rad);
        const y1 = 120 + inner * Math.sin(rad);
        const x2 = 120 + outer * Math.cos(rad);
        const y2 = 120 + outer * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#E8F5F1"
            strokeWidth="1"
            opacity="0.5"
          />
        );
      })}
    </svg>
  );
}

function FactorBar({ factor, animate }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setWidth(factor.value), 300);
    return () => clearTimeout(t);
  }, [animate, factor.value]);

  return (
    <div style={styles.factorCard}>
      <div style={styles.factorHeader}>
        <div style={styles.factorIconWrap}>
          <span style={styles.factorIcon}>{factor.icon}</span>
        </div>
        <div style={styles.factorInfo}>
          <div style={styles.factorLabel}>{factor.label}</div>
          <div style={styles.factorDesc}>{factor.description}</div>
        </div>
        <div style={{ ...styles.factorScore, color: factor.color }}>{factor.value}%</div>
      </div>
      <div style={styles.factorBarBg}>
        <div
          style={{
            ...styles.factorBarFill,
            width: `${width}%`,
            background: factor.color,
            transition: "width 1.2s cubic-bezier(0.34, 1.2, 0.64, 1)",
          }}
        />
      </div>
    </div>
  );
}

export default function TrustScore() {
  const [displayScore, setDisplayScore] = useState(PREVIOUS_SCORE);
  const [animRingScore, setAnimRingScore] = useState(PREVIOUS_SCORE);
  const [animating, setAnimating] = useState(false);
  const [factorsVisible, setFactorsVisible] = useState(false);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const delay = setTimeout(() => {
      setAnimating(true);
      setAnimRingScore(CURRENT_SCORE);

      startTimeRef.current = null;
      const animate = (timestamp) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
        const eased = easeOutCubic(progress);
        const current = Math.round(PREVIOUS_SCORE + eased * (CURRENT_SCORE - PREVIOUS_SCORE));
        setDisplayScore(current);
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayScore(CURRENT_SCORE);
          setFactorsVisible(true);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    }, 600);

    return () => {
      clearTimeout(delay);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const gained = CURRENT_SCORE - PREVIOUS_SCORE;
  const percentile = 15;

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Trust Score</h1>
          <p style={styles.pageSub}>Your financial credibility in the community</p>
        </div>

        {/* Score Card */}
        <div style={styles.scoreCard}>
          <div style={styles.scoreCardBg} />

          <div style={styles.ringSection}>
            <div style={styles.ringWrapper}>
              <ScoreRing score={animRingScore} animating={animating} />
              <div style={styles.ringCenter}>
                <div style={styles.scoreNumber}>{displayScore}</div>
                <div style={styles.scoreLabel}>Trust Score</div>
                <div style={styles.scoreMax}>out of {MAX_SCORE}</div>
              </div>
            </div>

            <div style={styles.scoreMeta}>
              <div style={styles.gainBadge}>
                <span style={styles.gainArrow}>↑</span>
                <span style={styles.gainText}>+{gained} points gained</span>
              </div>
              <div style={styles.prevScore}>Previous: {PREVIOUS_SCORE}</div>

              <div style={styles.percentileBox}>
                <div style={styles.percentileValue}>Top {percentile}%</div>
                <div style={styles.percentileLabel}>in your district</div>
              </div>

              <div style={styles.ratingRow}>
                {[
                  { label: "Poor", min: 0, max: 500 },
                  { label: "Fair", min: 500, max: 600 },
                  { label: "Good", min: 600, max: 700 },
                  { label: "Great", min: 700, max: 800 },
                  { label: "Elite", min: 800, max: 850 },
                ].map((band) => {
                  const active = CURRENT_SCORE >= band.min && CURRENT_SCORE < band.max;
                  return (
                    <div key={band.label} style={{ textAlign: "center" }}>
                      <div
                        style={{
                          ...styles.ratingBar,
                          background: active ? "#1D9E75" : "#E8F5F1",
                        }}
                      />
                      <div
                        style={{
                          ...styles.ratingBandLabel,
                          color: active ? "#1D9E75" : "#A0ADB8",
                          fontWeight: active ? "700" : "400",
                        }}
                      >
                        {band.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* History Chip */}
        <div style={styles.historyRow}>
          {[
            { month: "Jan", score: 620 },
            { month: "Feb", score: 635 },
            { month: "Mar", score: 648 },
            { month: "Apr", score: 661 },
            { month: "May", score: 681 },
            { month: "Jun", score: 742, current: true },
          ].map((h) => (
            <div
              key={h.month}
              style={{
                ...styles.historyChip,
                background: h.current ? "#1D9E75" : "#FFFFFF",
                color: h.current ? "#fff" : "#4A5568",
                boxShadow: h.current
                  ? "0 4px 16px rgba(29,158,117,0.35)"
                  : "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: "16px", fontWeight: "700" }}>{h.score}</div>
              <div style={{ fontSize: "11px", opacity: 0.8 }}>{h.month}</div>
            </div>
          ))}
        </div>

        {/* Score Factors */}
        <div style={styles.factorsSection}>
          <h2 style={styles.factorsTitle}>Score Breakdown</h2>
          <div style={styles.factorsList}>
            {SCORE_FACTORS.map((f) => (
              <FactorBar key={f.label} factor={f} animate={factorsVisible} />
            ))}
          </div>
        </div>

        {/* Tips */}
        <div style={styles.tipsCard}>
          <div style={styles.tipsIcon}>💡</div>
          <div>
            <div style={styles.tipsTitle}>How to improve your score</div>
            <ul style={styles.tipsList}>
              <li>Make all circle payments on time</li>
              <li>Participate in more community discussions</li>
              <li>Stay active in your circles for longer periods</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Sora', sans-serif",
    background: "#F7F9FC",
    minHeight: "100vh",
    paddingBottom: "60px",
  },
  container: {
    maxWidth: "860px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  pageHeader: {
    marginBottom: "32px",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1A2332",
    margin: "0 0 6px",
  },
  pageSub: {
    fontSize: "14px",
    color: "#6B7A8D",
    margin: 0,
  },

  /* Score Card */
  scoreCard: {
    background: "#FFFFFF",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    position: "relative",
    overflow: "hidden",
    marginBottom: "24px",
  },
  scoreCardBg: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, rgba(29,158,117,0.06) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  ringSection: {
    display: "flex",
    alignItems: "center",
    gap: "48px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  ringWrapper: {
    position: "relative",
    width: "240px",
    height: "240px",
    flexShrink: 0,
  },
  ringCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    pointerEvents: "none",
  },
  scoreNumber: {
    fontSize: "48px",
    fontWeight: "700",
    color: "#1A2332",
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
  },
  scoreLabel: {
    fontSize: "13px",
    color: "#6B7A8D",
    marginTop: "4px",
    fontWeight: "500",
  },
  scoreMax: {
    fontSize: "11px",
    color: "#A0ADB8",
    marginTop: "2px",
  },
  scoreMeta: {
    flex: 1,
    minWidth: "220px",
  },
  gainBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "linear-gradient(135deg, #E8F5F1, #D0EDE3)",
    border: "1px solid #B8E0D0",
    borderRadius: "100px",
    padding: "8px 20px",
    marginBottom: "10px",
  },
  gainArrow: {
    fontSize: "18px",
    color: "#1D9E75",
    fontWeight: "700",
  },
  gainText: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1D9E75",
  },
  prevScore: {
    fontSize: "12px",
    color: "#A0ADB8",
    marginBottom: "20px",
  },
  percentileBox: {
    background: "#F7F9FC",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "20px",
  },
  percentileValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1A2332",
  },
  percentileLabel: {
    fontSize: "12px",
    color: "#6B7A8D",
    marginTop: "2px",
  },
  ratingRow: {
    display: "flex",
    gap: "6px",
    alignItems: "flex-end",
  },
  ratingBar: {
    height: "8px",
    borderRadius: "4px",
    width: "42px",
    marginBottom: "4px",
    transition: "background 0.3s",
  },
  ratingBandLabel: {
    fontSize: "10px",
    textAlign: "center",
  },

  /* History */
  historyRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "32px",
    overflowX: "auto",
    paddingBottom: "4px",
  },
  historyChip: {
    flexShrink: 0,
    borderRadius: "12px",
    padding: "12px 16px",
    textAlign: "center",
    cursor: "default",
    minWidth: "60px",
  },

  /* Factors */
  factorsSection: {
    marginBottom: "24px",
  },
  factorsTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1A2332",
    marginBottom: "16px",
  },
  factorsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  factorCard: {
    background: "#FFFFFF",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  factorHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "14px",
    flexWrap: "wrap",
  },
  factorIconWrap: {
    width: "42px",
    height: "42px",
    background: "#F0FAF5",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  factorIcon: {
    fontSize: "20px",
  },
  factorInfo: {
    flex: 1,
    minWidth: "140px",
  },
  factorLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1A2332",
  },
  factorDesc: {
    fontSize: "12px",
    color: "#8899AA",
    marginTop: "2px",
  },
  factorScore: {
    fontSize: "20px",
    fontWeight: "700",
  },
  factorBarBg: {
    height: "6px",
    background: "#F0F4F8",
    borderRadius: "100px",
    overflow: "hidden",
  },
  factorBarFill: {
    height: "100%",
    borderRadius: "100px",
    width: "0%",
  },

  /* Tips */
  tipsCard: {
    background: "linear-gradient(135deg, #F0FAF5, #E4F5EC)",
    border: "1px solid #B8E0D0",
    borderRadius: "12px",
    padding: "20px 24px",
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },
  tipsIcon: {
    fontSize: "24px",
    flexShrink: 0,
    marginTop: "2px",
  },
  tipsTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0E7A5A",
    marginBottom: "8px",
  },
  tipsList: {
    margin: 0,
    padding: "0 0 0 18px",
    color: "#2D6A4F",
    fontSize: "13px",
    lineHeight: 1.9,
  },
};
