// FILE: frontend/src/pages/Circles.jsx

import { useEffect, useRef, useState } from "react";

const MEMBERS_DATA = [
  {
    id: 1,
    name: "Priya Sharma",
    city: "Lucknow",
    score: 742,
    status: "paid",
    amount: 2000,
    date: "01 Jun",
    initials: "PS",
  },
  {
    id: 2,
    name: "Rahul Verma",
    city: "Varanasi",
    score: 681,
    status: "paid",
    amount: 1500,
    date: "28 May",
    initials: "RV",
  },
  {
    id: 3,
    name: "Sunita Devi",
    city: "Gorakhpur",
    score: 598,
    status: "pending",
    amount: null,
    date: null,
    initials: "SD",
  },
  {
    id: 4,
    name: "Amit Yadav",
    city: "Patna",
    score: 720,
    status: "paid",
    amount: 1800,
    date: "30 May",
    initials: "AY",
  },
  {
    id: 5,
    name: "Meera Patel",
    city: "Kanpur",
    score: 655,
    status: "pending",
    amount: null,
    date: null,
    initials: "MP",
  },
];

function getScoreColor(score) {
  if (score >= 720) return "#1D9E75";
  if (score >= 650) return "#27AE87";
  if (score >= 580) return "#E8A020";
  return "#E05252";
}

function getScoreLabel(score) {
  if (score >= 720) return "Excellent";
  if (score >= 650) return "Good";
  if (score >= 580) return "Fair";
  return "Poor";
}

function FlipBadge({ status }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const prevStatus = useRef(status);

  useEffect(() => {
    if (prevStatus.current !== status) {
      setIsFlipped(true);
      const timer = setTimeout(() => {
        setCurrentStatus(status);
        prevStatus.current = status;
        setIsFlipped(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const isPaid = currentStatus === "paid";

  return (
    <div
      style={{
        ...styles.flipBadgeOuter,
        transform: isFlipped ? "rotateY(90deg)" : "rotateY(0deg)",
        transition: "transform 0.35s ease-in-out",
      }}
    >
      <div
        style={{
          ...styles.flipBadge,
          background: isPaid ? "#E8F5F1" : "#F5F5F5",
          color: isPaid ? "#1D9E75" : "#909090",
          border: `1.5px solid ${isPaid ? "#B8E0D0" : "#E0E0E0"}`,
        }}
      >
        <span style={styles.flipBadgeDot(isPaid)} />
        {isPaid ? "Paid" : "Pending"}
      </div>
    </div>
  );
}

function ScoreArc({ score }) {
  const RADIUS = 18;
  const STROKE = 3;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const percent = score / 850;
  const offset = CIRCUMFERENCE * (1 - percent);
  const color = getScoreColor(score);

  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r={RADIUS} fill="none" stroke="#F0F4F8" strokeWidth={STROKE} />
      <circle
        cx="24"
        cy="24"
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
          transition: "stroke-dashoffset 0.8s ease",
        }}
      />
    </svg>
  );
}

function MemberCard({ member, onToggle }) {
  const [hovered, setHovered] = useState(false);
  const scoreColor = getScoreColor(member.score);
  const scoreLabel = getScoreLabel(member.score);

  return (
    <div
      style={{
        ...styles.card,
        boxShadow: hovered
          ? "0 8px 28px rgba(0,0,0,0.10)"
          : styles.card.boxShadow,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top row */}
      <div style={styles.cardTop}>
        <div style={styles.avatarWrapper}>
          <div style={{ ...styles.avatar, background: `linear-gradient(135deg, ${scoreColor}, ${scoreColor}CC)` }}>
            {member.initials}
          </div>
          <div style={styles.scoreArcOverlay}>
            <ScoreArc score={member.score} />
          </div>
        </div>
        <div style={styles.nameBlock}>
          <div style={styles.memberName}>{member.name}</div>
          <div style={styles.memberCity}>
            <span style={styles.locationPin}>📍</span>
            {member.city}
          </div>
        </div>
        <FlipBadge status={member.status} />
      </div>

      {/* Score row */}
      <div style={styles.scoreRow}>
        <div style={styles.scoreBlock}>
          <div style={{ ...styles.scoreValue, color: scoreColor }}>{member.score}</div>
          <div style={styles.scoreText}>Trust Score</div>
        </div>
        <div style={{ ...styles.scorePill, background: `${scoreColor}18`, color: scoreColor }}>
          {scoreLabel}
        </div>
      </div>

      {/* Payment info */}
      <div style={styles.paymentRow}>
        {member.status === "paid" ? (
          <div style={styles.paymentInfo}>
            <span style={styles.paymentIcon}>✓</span>
            <span style={styles.paymentAmount}>₹{member.amount?.toLocaleString("en-IN")}</span>
            <span style={styles.paymentDate}>{member.date}</span>
          </div>
        ) : (
          <div style={styles.paymentPending}>
            <span style={styles.pendingIcon}>⏳</span>
            <span style={styles.pendingText}>Payment due</span>
          </div>
        )}

        {/* Demo toggle for badge flip */}
        <button
          style={styles.toggleBtn}
          onClick={() => onToggle(member.id)}
          title="Toggle payment status"
        >
          {member.status === "paid" ? "Mark Pending" : "Mark Paid"}
        </button>
      </div>
    </div>
  );
}

export default function Circles() {
  const [members, setMembers] = useState(MEMBERS_DATA);
  const [filter, setFilter] = useState("all");

  const handleToggle = (id) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: m.status === "paid" ? "pending" : "paid",
              amount: m.status === "pending" ? 2000 : null,
              date: m.status === "pending" ? "Now" : null,
            }
          : m
      )
    );
  };

  const filtered = members.filter((m) => {
    if (filter === "paid") return m.status === "paid";
    if (filter === "pending") return m.status === "pending";
    return true;
  });

  const paidCount = members.filter((m) => m.status === "paid").length;
  const pendingCount = members.filter((m) => m.status === "pending").length;
  const totalPool = members
    .filter((m) => m.status === "paid")
    .reduce((sum, m) => sum + (m.amount || 0), 0);

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Mahila Bachat Mandal</h1>
            <p style={styles.pageSub}>June 2025 cycle · 5 members</p>
          </div>
          <div style={styles.poolBadge}>
            <span style={styles.poolLabel}>Pool</span>
            <span style={styles.poolValue}>₹{totalPool.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{paidCount}</div>
            <div style={styles.statLabel}>Paid</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: "#E8A020" }}>{pendingCount}</div>
            <div style={styles.statLabel}>Pending</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{Math.round((paidCount / members.length) * 100)}%</div>
            <div style={styles.statLabel}>Completion</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>15 Jun</div>
            <div style={styles.statLabel}>Next Payout</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={styles.progressSection}>
          <div style={styles.progressLabel}>
            <span>Collection Progress</span>
            <span style={{ color: "#1D9E75", fontWeight: "600" }}>
              {paidCount}/{members.length}
            </span>
          </div>
          <div style={styles.progressBg}>
            <div
              style={{
                ...styles.progressFill,
                width: `${(paidCount / members.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div style={styles.filterRow}>
          {["all", "paid", "pending"].map((f) => (
            <button
              key={f}
              style={{
                ...styles.filterBtn,
                background: filter === f ? "#1D9E75" : "#FFFFFF",
                color: filter === f ? "#FFFFFF" : "#6B7A8D",
                boxShadow: filter === f
                  ? "0 2px 12px rgba(29,158,117,0.25)"
                  : "0 1px 4px rgba(0,0,0,0.06)",
              }}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span
                style={{
                  ...styles.filterCount,
                  background: filter === f ? "rgba(255,255,255,0.2)" : "#F0F4F8",
                  color: filter === f ? "#fff" : "#8899AA",
                }}
              >
                {f === "all" ? members.length : f === "paid" ? paidCount : pendingCount}
              </span>
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div style={styles.grid}>
          {filtered.map((member) => (
            <MemberCard key={member.id} member={member} onToggle={handleToggle} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={styles.empty}>No members match this filter.</div>
        )}
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
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  pageHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "16px",
  },
  pageTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1A2332",
    margin: "0 0 4px",
  },
  pageSub: {
    fontSize: "14px",
    color: "#8899AA",
    margin: 0,
  },
  poolBadge: {
    background: "linear-gradient(135deg, #1D9E75, #0E7A5A)",
    borderRadius: "14px",
    padding: "16px 24px",
    textAlign: "center",
    color: "#fff",
    boxShadow: "0 4px 16px rgba(29,158,117,0.3)",
  },
  poolLabel: {
    display: "block",
    fontSize: "11px",
    opacity: 0.8,
    marginBottom: "2px",
    letterSpacing: "0.5px",
  },
  poolValue: {
    display: "block",
    fontSize: "22px",
    fontWeight: "700",
  },

  /* Stats */
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    marginBottom: "24px",
  },
  statCard: {
    background: "#FFFFFF",
    borderRadius: "12px",
    padding: "16px",
    textAlign: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  statValue: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1D9E75",
    lineHeight: 1,
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "11px",
    color: "#8899AA",
    fontWeight: "500",
  },

  /* Progress */
  progressSection: {
    marginBottom: "24px",
  },
  progressLabel: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#6B7A8D",
    marginBottom: "8px",
  },
  progressBg: {
    height: "8px",
    background: "#E8F5F1",
    borderRadius: "100px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #1D9E75, #27AE87)",
    borderRadius: "100px",
    transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },

  /* Filter */
  filterRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  filterBtn: {
    border: "none",
    borderRadius: "100px",
    padding: "8px 18px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s",
  },
  filterCount: {
    borderRadius: "100px",
    padding: "1px 7px",
    fontSize: "11px",
    fontWeight: "700",
  },

  /* Member Cards */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#FFFFFF",
    borderRadius: "16px",
    padding: "22px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    transition: "box-shadow 0.25s, transform 0.25s",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "16px",
  },
  avatarWrapper: {
    position: "relative",
    flexShrink: 0,
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "700",
  },
  scoreArcOverlay: {
    position: "absolute",
    top: "-2px",
    left: "-2px",
    pointerEvents: "none",
  },
  nameBlock: {
    flex: 1,
    minWidth: 0,
  },
  memberName: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1A2332",
    marginBottom: "3px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  memberCity: {
    fontSize: "12px",
    color: "#8899AA",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  locationPin: {
    fontSize: "11px",
  },

  /* Flip Badge */
  flipBadgeOuter: {
    perspective: "600px",
    flexShrink: 0,
  },
  flipBadge: {
    borderRadius: "100px",
    padding: "5px 12px",
    fontSize: "12px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    whiteSpace: "nowrap",
  },
  flipBadgeDot: (isPaid) => ({
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: isPaid ? "#1D9E75" : "#BBBBBB",
    display: "inline-block",
  }),

  /* Score row */
  scoreRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#F7F9FC",
    borderRadius: "10px",
    padding: "12px 16px",
    marginBottom: "14px",
  },
  scoreBlock: {
    display: "flex",
    alignItems: "baseline",
    gap: "6px",
  },
  scoreValue: {
    fontSize: "24px",
    fontWeight: "700",
    fontVariantNumeric: "tabular-nums",
  },
  scoreText: {
    fontSize: "12px",
    color: "#8899AA",
  },
  scorePill: {
    borderRadius: "100px",
    padding: "4px 12px",
    fontSize: "11px",
    fontWeight: "700",
  },

  /* Payment row */
  paymentRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "8px",
  },
  paymentInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  paymentIcon: {
    fontSize: "14px",
    color: "#1D9E75",
    fontWeight: "700",
  },
  paymentAmount: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1A2332",
  },
  paymentDate: {
    fontSize: "12px",
    color: "#8899AA",
  },
  paymentPending: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  pendingIcon: {
    fontSize: "13px",
  },
  pendingText: {
    fontSize: "13px",
    color: "#B0A060",
    fontWeight: "500",
  },
  toggleBtn: {
    background: "transparent",
    border: "1px solid #E0E8F0",
    borderRadius: "8px",
    padding: "5px 10px",
    fontSize: "11px",
    color: "#7A8B9A",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    transition: "all 0.2s",
  },
  empty: {
    textAlign: "center",
    color: "#A0ADB8",
    padding: "48px",
    fontSize: "15px",
  },
};
