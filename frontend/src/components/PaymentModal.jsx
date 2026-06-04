// FILE: frontend/src/components/PaymentModal.jsx

import { useEffect, useState } from "react";

export default function PaymentModal({ circle, amount, onConfirm, onClose }) {
  const [step, setStep] = useState("upi");
  const [upiId, setUpiId] = useState("");

  async function handlePay() {
    setStep("processing");
    setTimeout(async () => {
      await onConfirm();
      setStep("success");
    }, 2000);
  }

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const hasRealQr = !!circle?.upi_qr_image;

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.logoBox}>
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="#1D9E75" strokeWidth="2" />
                <path d="M7 14 Q14 7 21 14 Q14 21 7 14Z" fill="#1D9E75" opacity="0.9" />
              </svg>
            </div>
            <div>
              <div style={styles.headerTitle}>TrustCircle Pay</div>
              <div style={styles.headerSub}>Secure UPI Payment</div>
            </div>
          </div>
          {step !== "processing" && step !== "success" && (
            <button onClick={onClose} style={styles.closeBtn}>✕</button>
          )}
        </div>

        {/* Amount banner */}
        <div style={styles.amountBanner}>
          <div style={styles.amountLabel}>Payment to</div>
          <div style={styles.circleName}>{circle?.name}</div>
          <div style={styles.amount}>₹{parseFloat(amount).toLocaleString("en-IN")}</div>
          <div style={styles.amountNote}>Monthly contribution · 0.5% reinsurance buffer included</div>
        </div>

        {/* UPI step */}
        {step === "upi" && (
          <div style={styles.body}>
            <div style={styles.qrSection}>
              {hasRealQr ? (
                <img
                  src={circle.upi_qr_image}
                  alt="UPI QR"
                  style={{ width: 160, height: 160, borderRadius: 12, border: "1px solid #E8EEF4", objectFit: "contain", background: "#fff", padding: 8 }}
                />
              ) : (
                <div style={styles.qrBox}>
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <rect width="140" height="140" fill="white" />
                    <rect x="10" y="10" width="35" height="35" fill="none" stroke="#1A2332" strokeWidth="4" />
                    <rect x="17" y="17" width="21" height="21" fill="#1A2332" />
                    <rect x="95" y="10" width="35" height="35" fill="none" stroke="#1A2332" strokeWidth="4" />
                    <rect x="102" y="17" width="21" height="21" fill="#1A2332" />
                    <rect x="10" y="95" width="35" height="35" fill="none" stroke="#1A2332" strokeWidth="4" />
                    <rect x="17" y="102" width="21" height="21" fill="#1A2332" />
                    {[
                      [55,10],[62,10],[69,10],[76,10],[55,17],[69,17],[76,17],[55,24],[62,24],
                      [55,31],[76,31],[62,38],[69,38],[55,55],[62,55],[76,55],[83,55],[90,55],
                      [55,62],[69,62],[83,62],[55,69],[62,69],[76,69],[90,69],[55,76],[69,76],[83,76],
                      [62,83],[76,83],[90,83],[95,55],[102,55],[109,55],[116,55],[123,55],
                      [95,62],[109,62],[123,62],[95,69],[102,69],[116,69],[102,76],[116,76],[123,76],
                      [95,83],[109,83],[10,55],[17,55],[24,55],[31,55],[38,55],[10,62],[24,62],[38,62],
                      [10,69],[17,69],[31,69],[17,76],[31,76],[38,76],[10,83],[24,83],[38,83],
                      [55,95],[69,95],[83,95],[97,95],[111,95],[125,95],[55,102],[62,102],[76,102],[90,102],[104,102],
                      [55,109],[69,109],[83,109],[97,109],[118,109],[62,116],[76,116],[90,116],[104,116],[125,116],
                      [55,123],[69,123],[83,123],[111,123],
                    ].map(([x, y], i) => (
                      <rect key={i} x={x} y={y} width="6" height="6" fill="#1A2332" />
                    ))}
                    <circle cx="70" cy="70" r="8" fill="white" />
                    <circle cx="70" cy="70" r="6" fill="#1D9E75" />
                  </svg>
                </div>
              )}
              <div style={styles.qrLabel}>
                {hasRealQr ? "Scan with any UPI app to pay directly" : "Demo QR — creator can upload real QR"}
              </div>
              <div style={styles.upiApps}>
                {["GPay", "PhonePe", "Paytm", "BHIM"].map(app => (
                  <div key={app} style={styles.upiApp}>{app}</div>
                ))}
              </div>
            </div>

            <div style={styles.dividerRow}>
              <span style={styles.dividerLine} />
              <span style={styles.dividerText}>or pay with UPI ID</span>
              <span style={styles.dividerLine} />
            </div>

            <div style={styles.upiInputRow}>
              <input
                style={styles.upiInput}
                placeholder="yourname@upi"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
              />
              <button style={styles.verifyBtn}>Verify</button>
            </div>

            <div style={styles.secureNote}>
              <span style={{ color: "#1D9E75" }}>🔒</span> 256-bit encrypted · RBI compliant · DPDP Act 2023
            </div>

            <button style={styles.payBtn} onClick={handlePay}>
              Pay ₹{parseFloat(amount).toLocaleString("en-IN")}
            </button>
          </div>
        )}

        {/* Processing step */}
        {step === "processing" && (
          <div style={{ ...styles.body, alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
            <div style={{ marginBottom: "16px" }}>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#E8F5F1" strokeWidth="6" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="#1D9E75" strokeWidth="6"
                  strokeLinecap="round" strokeDasharray="60 120"
                  style={{ transformOrigin: "center", animation: "spin 1s linear infinite" }} />
              </svg>
            </div>
            <div style={styles.processingTitle}>Processing Payment…</div>
            <div style={{ fontSize: "13px", color: "#8899AA" }}>Please do not close this window</div>
            <div style={styles.processingSteps}>
              {["Verifying UPI ID", "Deducting reinsurance buffer", "Updating circle pool"].map(s => (
                <div key={s} style={{ fontSize: "13px", color: "#4A5568" }}>
                  <span style={{ color: "#1D9E75", marginRight: "8px" }}>✓</span>{s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success step */}
        {step === "success" && (
          <div style={{ ...styles.body, alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
            <div style={{ marginBottom: "8px" }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#E8F5F1" />
                <path d="M14 24 L21 31 L34 17" stroke="#1D9E75" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={styles.successTitle}>Payment Successful!</div>
            <div style={styles.successAmt}>₹{parseFloat(amount).toLocaleString("en-IN")}</div>
            <div style={{ fontSize: "13px", color: "#6B7A8D" }}>contributed to <strong>{circle?.name}</strong></div>

            <div style={styles.receiptBox}>
              <div style={styles.receiptRow}>
                <span style={styles.receiptKey}>Transaction ID</span>
                <span style={styles.receiptVal}>TC{Date.now().toString().slice(-8)}</span>
              </div>
              <div style={styles.receiptRow}>
                <span style={styles.receiptKey}>UPI Ref</span>
                <span style={styles.receiptVal}>{Math.floor(Math.random() * 900000000000) + 100000000000}</span>
              </div>
              <div style={styles.receiptRow}>
                <span style={styles.receiptKey}>Reinsurance</span>
                <span style={styles.receiptVal}>₹{(parseFloat(amount) * 0.005).toFixed(2)}</span>
              </div>
              <div style={styles.receiptRow}>
                <span style={styles.receiptKey}>Net to Pool</span>
                <span style={{ ...styles.receiptVal, color: "#1D9E75", fontWeight: "700" }}>
                  ₹{(parseFloat(amount) * 0.995).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div style={styles.scoreBump}>🎉 Your Trust Score has been updated!</div>

            <button style={styles.doneBtn} onClick={onClose}>Done</button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
      `}</style>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px" },
  modal: { background: "#FFFFFF", borderRadius: "20px", width: "100%", maxWidth: "420px", boxShadow: "0 24px 60px rgba(0,0,0,0.2)", fontFamily: "'Sora', sans-serif", animation: "fadeIn 0.25s ease", maxHeight: "90vh", overflowY: "auto" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px", borderBottom: "1px solid #F0F4F8" },
  headerLeft: { display: "flex", alignItems: "center", gap: "10px" },
  logoBox: { width: "36px", height: "36px", background: "#E8F5F1", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: "15px", fontWeight: "700", color: "#1A2332" },
  headerSub: { fontSize: "11px", color: "#8899AA" },
  closeBtn: { background: "none", border: "none", fontSize: "16px", color: "#8899AA", cursor: "pointer", padding: "4px 8px", borderRadius: "6px" },
  amountBanner: { background: "linear-gradient(135deg, #0D1F2D, #0E3B2E)", padding: "20px 24px", textAlign: "center" },
  amountLabel: { fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "4px" },
  circleName: { fontSize: "13px", color: "rgba(255,255,255,0.8)", marginBottom: "8px", fontWeight: "500" },
  amount: { fontSize: "36px", fontWeight: "700", color: "#FFFFFF", lineHeight: 1, marginBottom: "6px" },
  amountNote: { fontSize: "11px", color: "rgba(255,255,255,0.4)" },
  body: { padding: "24px", display: "flex", flexDirection: "column", gap: "16px" },
  qrSection: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" },
  qrBox: { background: "#FAFAFA", border: "1px solid #E8EEF4", borderRadius: "12px", padding: "16px", display: "inline-flex" },
  qrLabel: { fontSize: "12px", color: "#8899AA" },
  upiApps: { display: "flex", gap: "8px" },
  upiApp: { background: "#F7F9FC", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "4px 12px", fontSize: "11px", fontWeight: "600", color: "#4A5568" },
  dividerRow: { display: "flex", alignItems: "center", gap: "10px" },
  dividerLine: { flex: 1, height: "1px", background: "#E8EEF4" },
  dividerText: { fontSize: "11px", color: "#A0ADB8", whiteSpace: "nowrap" },
  upiInputRow: { display: "flex", gap: "8px" },
  upiInput: { flex: 1, padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "'Sora', sans-serif", outline: "none" },
  verifyBtn: { background: "#F7F9FC", border: "1.5px solid #E2E8F0", borderRadius: "10px", padding: "10px 16px", fontSize: "13px", fontWeight: "600", color: "#4A5568", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  secureNote: { fontSize: "11px", color: "#A0ADB8", textAlign: "center" },
  payBtn: { background: "linear-gradient(135deg, #1D9E75, #0E7A5A)", color: "#fff", border: "none", borderRadius: "12px", padding: "16px", fontSize: "16px", fontWeight: "700", cursor: "pointer", fontFamily: "'Sora', sans-serif", boxShadow: "0 4px 16px rgba(29,158,117,0.35)" },
  processingTitle: { fontSize: "20px", fontWeight: "700", color: "#1A2332" },
  processingSteps: { display: "flex", flexDirection: "column", gap: "8px", background: "#F7F9FC", borderRadius: "12px", padding: "16px", width: "100%" },
  successTitle: { fontSize: "22px", fontWeight: "700", color: "#1A2332" },
  successAmt: { fontSize: "36px", fontWeight: "700", color: "#1D9E75", lineHeight: 1 },
  receiptBox: { background: "#F7F9FC", borderRadius: "12px", padding: "16px", width: "100%", display: "flex", flexDirection: "column", gap: "10px" },
  receiptRow: { display: "flex", justifyContent: "space-between", fontSize: "13px" },
  receiptKey: { color: "#8899AA" },
  receiptVal: { color: "#1A2332", fontWeight: "500" },
  scoreBump: { background: "#E8F5F1", border: "1px solid #B8E0D0", borderRadius: "10px", padding: "10px 16px", fontSize: "13px", color: "#0E7A5A", fontWeight: "500", textAlign: "center", width: "100%" },
  doneBtn: { background: "linear-gradient(135deg, #1D9E75, #0E7A5A)", color: "#fff", border: "none", borderRadius: "12px", padding: "14px", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "'Sora', sans-serif", width: "100%", boxShadow: "0 4px 16px rgba(29,158,117,0.35)" },
};
