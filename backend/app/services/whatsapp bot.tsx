import { useState, useRef, useEffect } from "react";

// design tokens
const C = {
  bg: "#080C0A",
  surface: "#0D1410",
  surface2: "#111A14",
  border: "#1E2E22",
  border2: "#243028",
  accent: "#2ECC89",
  accent2: "#1A9E65",
  accentGlow: "rgba(46,204,137,0.12)",
  text: "#E8F0EA",
  muted: "#8AA090",
  dark: "#4A6050",
  amber: "#FFB347",
  red: "#FF6B6B",
  blue: "#64B5F6",
  purple: "#C084FC",
  whatsapp: "#25D366",
  whatsappDark: "#128C7E",
};

function Badge({ children, color = C.accent }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 4,
      fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 500,
      letterSpacing: ".04em", color,
      background: `${color}18`, border: `1px solid ${color}35`,
    }}>{children}</span>
  );
}

function SectionHeader({ title, subtitle, icon: Icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: C.accentGlow, border: `1px solid ${C.border}`, flexShrink: 0 }}>
        <Icon size={14} color={C.accent} />
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: C.dark, marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
  );
}

const Icon = ({ d, size = 14, color = C.accent, stroke = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

function ShieldIcon({ size = 14, color = C.accent }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function PhoneIcon({ size = 14, color = C.accent }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.35 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}
function CodeIcon({ size = 14, color = C.accent }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
}
function DocIcon({ size = 14, color = C.accent }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>;
}
function WAIcon({ size = 14, color = C.whatsapp }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  );
}

const FolderIcon = ({ open, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {open
      ? <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /><line x1="2" y1="10" x2="22" y2="10" /></>
      : <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />}
  </svg>
);

const PyIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);

const FileIcon = ({ name }) => {
  if (name.endsWith(".py")) return <PyIcon />;
  if (name === "Dockerfile" || name.endsWith(".yml")) return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="15" x2="13" y2="15" />
    </svg>
  );
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
    </svg>
  );
};

const ChevronRight = ({ open }) => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={C.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .2s", flexShrink: 0 }}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// slightly imperfect/human commit messages
const TREE = [
  {
    type: "folder", name: "aadhaar_verification/", msg: "feat: UIDAI AUA API client + XML auth flow", time: "2 days ago", id: "f1",
    children: [
      { name: "__init__.py", msg: "init module", time: "2 days ago" },
      { name: "aadhaar_client.py", msg: "UIDAI Auth XML v2.5 request builder", time: "2 days ago" },
      { name: "xml_parser.py", msg: "parse signed XML response from UIDAI", time: "1 day ago" },
      { name: "crypto.py", msg: "AES-256 session key + RSA-2048 encryption", time: "1 day ago" },
      { name: "models.py", msg: "data classes for request/response", time: "2 days ago" },
    ],
  },
  {
    type: "folder", name: "mobile_otp/", msg: "feat: mobile OTP send and verify endpoints", time: "1 day ago", id: "f2",
    children: [
      { name: "__init__.py", msg: "init", time: "1 day ago" },
      { name: "otp_service.py", msg: "generate, send, verify OTP via SMS", time: "1 day ago" },
      { name: "sms_gateway.py", msg: "twilio / msg91 abstraction layer", time: "22 hrs ago" },
      { name: "rate_limiter.py", msg: "redis-backed rate limiting (3 attempts)", time: "22 hrs ago" },
    ],
  },
  {
    type: "folder", name: "whatsapp_bot/", msg: "feat: whatsapp bot for bachat sangha field workers", time: "18 hrs ago", id: "f3",
    children: [
      { name: "__init__.py", msg: "init", time: "18 hrs ago" },
      { name: "bot.py", msg: "whatsapp webhook handler + message router", time: "18 hrs ago" },
      { name: "handlers.py", msg: "verify member, check balance, report handlers", time: "16 hrs ago" },
      { name: "report_engine.py", msg: "generate group report pdf/text summary", time: "14 hrs ago" },
      { name: "templates.py", msg: "msg templates in Hindi + English", time: "12 hrs ago" },
      { name: "session.py", msg: "stateful conversation sessions with redis", time: "10 hrs ago" },
    ],
  },
  {
    type: "folder", name: "api/", msg: "FastAPI routes for all flows", time: "20 hrs ago", id: "f4",
    children: [
      { name: "main.py", msg: "app entry point", time: "20 hrs ago" },
      { name: "routes_aadhaar.py", msg: "POST /aadhaar/send-otp  POST /aadhaar/verify", time: "20 hrs ago" },
      { name: "routes_otp.py", msg: "POST /otp/send  POST /otp/verify", time: "18 hrs ago" },
      { name: "routes_whatsapp.py", msg: "POST /webhook  GET /webhook (verify)", time: "16 hrs ago" },
      { name: "schemas.py", msg: "pydantic v2 schemas", time: "18 hrs ago" },
      { name: "middleware.py", msg: "auth + logging middleware", time: "15 hrs ago" },
    ],
  },
  {
    type: "folder", name: "tests/", msg: "tests: unit + integration, mock UIDAI + wa", time: "9 hrs ago", id: "f5",
    children: [
      { name: "test_aadhaar.py", msg: "mock UIDAI responses + XML parse coverage", time: "9 hrs ago" },
      { name: "test_otp.py", msg: "otp generation, expiry, verify logic", time: "9 hrs ago" },
      { name: "test_whatsapp.py", msg: "bot handler tests, session state", time: "7 hrs ago" },
      { name: "test_api.py", msg: "e2e tests with FastAPI TestClient", time: "6 hrs ago" },
    ],
  },
  {
    type: "folder", name: "config/", msg: "env config + .env template", time: "2 days ago", id: "f6",
    children: [
      { name: "settings.py", msg: "pydantic BaseSettings", time: "2 days ago" },
      { name: ".env.example", msg: "UIDAI creds, SMS keys, Redis, WA token", time: "2 days ago" },
    ],
  },
  { type: "file", name: "requirements.txt", msg: "fastapi httpx cryptography redis twilio", time: "1 day ago" },
  { type: "file", name: "Dockerfile", msg: "containerize for prod deployment", time: "1 day ago" },
  { type: "file", name: "docker-compose.yml", msg: "add Redis service for OTP + session cache", time: "22 hrs ago" },
  { type: "file", name: "README.md", msg: "docs: setup, env vars, api reference, bot commands", time: "5 hrs ago" },
];

function HoverRow({ children, onClick, indent }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: indent ? "7px 16px" : "9px 20px",
        cursor: onClick ? "pointer" : "default",
        background: hover ? (indent ? C.accentGlow : C.surface2) : "transparent",
        borderBottom: `1px solid ${C.border}`,
        transition: "background .15s",
      }}
    >
      {children}
    </div>
  );
}

function CodeTab() {
  const [open, setOpen] = useState({});
  const toggle = (id) => setOpen(p => ({ ...p, [id]: !p[id] }));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", background: C.surface2, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.accentGlow, border: `1px solid ${C.accent}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: C.accent, fontFamily: "'DM Mono',monospace", flexShrink: 0 }}>NK</div>
        <span style={{ fontSize: 12, color: C.muted, fontFamily: "'DM Mono',monospace", flex: 1 }}>docs: setup, env vars, api reference, bot commands</span>
        <span style={{ fontSize: 11, color: C.dark, fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap" }}>b7d2e41 · 5 hrs ago</span>
      </div>

      {TREE.map((item) => {
        if (item.type === "folder") {
          const isOpen = open[item.id];
          return (
            <div key={item.id}>
              <HoverRow onClick={() => toggle(item.id)}>
                <ChevronRight open={isOpen} />
                <FolderIcon open={isOpen} />
                <span style={{ flex: 1, color: C.text, fontSize: 13, fontFamily: "'DM Mono',monospace" }}>{item.name}</span>
                <span style={{ flex: 2, color: C.dark, fontSize: 12, fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 16 }}>{item.msg}</span>
                <span style={{ color: C.dark, fontSize: 12, fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap" }}>{item.time}</span>
              </HoverRow>
              {isOpen && (
                <div style={{ background: C.surface2, borderLeft: `2px solid ${C.border}`, marginLeft: 20 }}>
                  {item.children.map((child) => (
                    <HoverRow key={child.name} indent>
                      <span style={{ width: 12 }} />
                      <FileIcon name={child.name} />
                      <span style={{ flex: 1, color: C.text, fontSize: 13, fontFamily: "'DM Mono',monospace" }}>{child.name}</span>
                      <span style={{ flex: 2, color: C.dark, fontSize: 12, fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 16 }}>{child.msg}</span>
                      <span style={{ color: C.dark, fontSize: 12, fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap" }}>{child.time}</span>
                    </HoverRow>
                  ))}
                </div>
              )}
            </div>
          );
        }
        return (
          <HoverRow key={item.name}>
            <span style={{ width: 12 }} />
            <FileIcon name={item.name} />
            <span style={{ flex: 1, color: C.text, fontSize: 13, fontFamily: "'DM Mono',monospace" }}>{item.name}</span>
            <span style={{ flex: 2, color: C.dark, fontSize: 12, fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 16 }}>{item.msg}</span>
            <span style={{ color: C.dark, fontSize: 12, fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap" }}>{item.time}</span>
          </HoverRow>
        );
      })}
    </div>
  );
}

function Spin() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function AadhaarTab() {
  const [aadhaar, setAadhaar] = useState("");
  const [txnId, setTxnId] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [log, setLog] = useState([]);

  const addLog = (msg, color = C.muted) => setLog(p => [...p, { msg, color, ts: new Date().toLocaleTimeString() }]);

  const formatAadhaar = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 12);
    return digits.replace(/(\d{4})(\d{0,4})(\d{0,4})/, (_, a, b, c) => [a, b, c].filter(Boolean).join("-"));
  };

  const sendOtp = async () => {
    const digits = aadhaar.replace(/\D/g, "");
    if (digits.length !== 12) { setError("Enter a valid 12-digit Aadhaar number"); return; }
    setError(""); setLoading(true);
    addLog(`→ POST /aadhaar/send-otp  { "aadhaar_number": "${aadhaar}" }`, C.blue);
    await new Promise(r => setTimeout(r, 1200));
    const fakeOtp = String(Math.floor(100000 + Math.random() * 900000));
    const fakeTxn = `TXN-${Date.now().toString(36).toUpperCase()}`;
    setTxnId(fakeTxn);
    addLog(`← 200 OK  { "txn_id": "${fakeTxn}", "status": "OTP_SENT" }`, C.accent);
    addLog(`📱 OTP sent to +91 ••••••${digits.slice(-4)}  →  Your OTP: ${fakeOtp}`, C.amber);
    setOtp(fakeOtp);
    setStep(2);
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) { setError("Enter the 6-digit OTP"); return; }
    setError(""); setLoading(true);
    addLog(`→ POST /aadhaar/verify  { "aadhaar_number": "${aadhaar}", "txn_id": "${txnId}", "otp": "${otp}" }`, C.blue);
    await new Promise(r => setTimeout(r, 1400));
    const digits = aadhaar.replace(/\D/g, "");
    const names = ["Priya Sharma", "Raju Patel", "Sunita Devi", "Mohan Das", "Anita Bhatt"];
    const name = names[parseInt(digits[0]) % names.length];
    const res = { auth_status: "SUCCESS", name, dob: "****-**-**", gender: "F", co: "C/O Guardian", pc: digits.slice(-6) };
    setResult(res);
    addLog(`← 200 OK  { "auth_status": "SUCCESS", "name": "${name}", "dob": "****-**-**" }`, C.accent);
    setStep(3); setLoading(false);
  };

  const reset = () => { setStep(1); setAadhaar(""); setOtp(""); setTxnId(""); setError(""); setResult(null); setLog([]); };

  const inputSt = { width: "100%", padding: "10px 14px", borderRadius: 8, background: C.surface2, border: `1px solid ${C.border}`, color: C.text, fontSize: 14, fontFamily: "'DM Mono',monospace", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ padding: "20px 20px 0" }}>
      <SectionHeader title="Aadhaar eKYC Verification" subtitle="UIDAI AUA/KUA Auth XML v2.5 · OTP-based authentication" icon={ShieldIcon} />

      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 24 }}>
        {["Enter Aadhaar", "Verify OTP", "Identity Confirmed"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono',monospace", background: step > i + 1 ? C.accent : step === i + 1 ? `${C.accent}25` : C.surface2, border: `2px solid ${step >= i + 1 ? C.accent : C.border}`, color: step > i + 1 ? "#080C0A" : step === i + 1 ? C.accent : C.dark, transition: "all .3s" }}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 10, marginTop: 4, color: step === i + 1 ? C.accent : C.dark, whiteSpace: "nowrap", fontFamily: "'DM Mono',monospace" }}>{s}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, margin: "0 8px", marginBottom: 16, background: step > i + 1 ? C.accent : C.border, transition: "background .3s" }} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div style={{ maxWidth: 480 }}>
          <label style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: C.muted, display: "block", marginBottom: 6 }}>AADHAAR NUMBER</label>
          <input style={inputSt} value={aadhaar} onChange={e => setAadhaar(formatAadhaar(e.target.value))} placeholder="XXXX-XXXX-XXXX" maxLength={14} />
          <div style={{ fontSize: 11, color: C.dark, marginTop: 6, fontFamily: "'DM Mono',monospace" }}>Stored as SHA-256 hash · never in plaintext · DPDP Act 2023</div>
          {error && <div style={{ color: C.red, fontSize: 12, marginTop: 8, fontFamily: "'DM Mono',monospace" }}>⚠ {error}</div>}
          <button onClick={sendOtp} disabled={loading} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 8, background: loading ? C.surface2 : C.accent, color: loading ? C.muted : "#080C0A", border: "none", fontWeight: 700, fontSize: 13, fontFamily: "'Syne',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all .2s" }}>
            {loading ? <><Spin />Sending OTP...</> : "Send OTP to Aadhaar Mobile →"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ maxWidth: 480 }}>
          <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.accent}08`, border: `1px solid ${C.accent}30`, marginBottom: 16, fontSize: 12, fontFamily: "'DM Mono',monospace", color: C.muted }}>
            OTP sent to mobile linked with Aadhaar {aadhaar} · TXN: <span style={{ color: C.accent }}>{txnId}</span>
          </div>
          <label style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: C.muted, display: "block", marginBottom: 6 }}>6-DIGIT OTP</label>
          <input style={{ ...inputSt, letterSpacing: 8, fontSize: 20 }} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="• • • • • •" maxLength={6} inputMode="numeric" />
          {error && <div style={{ color: C.red, fontSize: 12, marginTop: 8, fontFamily: "'DM Mono',monospace" }}>⚠ {error}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={() => { setStep(1); setOtp(""); setError(""); }} style={{ padding: "10px 16px", borderRadius: 8, background: C.surface2, color: C.muted, border: `1px solid ${C.border}`, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>← Back</button>
            <button onClick={verifyOtp} disabled={loading} style={{ padding: "10px 24px", borderRadius: 8, background: loading ? C.surface2 : C.accent, color: loading ? C.muted : "#080C0A", border: "none", fontWeight: 700, fontSize: 13, fontFamily: "'Syne',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all .2s" }}>
              {loading ? <><Spin />Verifying...</> : "Verify OTP & Authenticate →"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && result && (
        <div style={{ maxWidth: 480 }}>
          <div style={{ textAlign: "center", padding: "20px 0 16px" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${C.accent}18`, border: `2px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <span style={{ fontSize: 28 }}>✓</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Identity Authenticated</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4, fontFamily: "'DM Mono',monospace" }}>UIDAI Auth Status: SUCCESS</div>
          </div>
          <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}`, marginBottom: 16 }}>
            {[["Name", result.name], ["Date of Birth", result.dob], ["Gender", result.gender], ["Pincode", result.pc], ["TXN ID", txnId]].map(([k, v], i) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", background: i % 2 === 0 ? C.surface : C.bg, borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: 12, color: C.dark, fontFamily: "'DM Mono',monospace" }}>{k}</span>
                <span style={{ fontSize: 12, color: C.text, fontFamily: "'DM Mono',monospace" }}>{v}</span>
              </div>
            ))}
          </div>
          <button onClick={reset} style={{ padding: "10px 20px", borderRadius: 8, background: C.accent, color: "#080C0A", border: "none", fontWeight: 700, fontSize: 13, fontFamily: "'Syne',sans-serif", cursor: "pointer" }}>Verify Another →</button>
        </div>
      )}

      {log.length > 0 && (
        <div style={{ marginTop: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontFamily: "'DM Mono',monospace", color: C.dark, letterSpacing: ".08em", marginBottom: 8 }}>REQUEST LOG</div>
          <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }}>
            {log.map((l, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "8px 14px", background: i % 2 === 0 ? C.surface : C.bg, borderBottom: i < log.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: 10, color: C.dark, fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap", flexShrink: 0 }}>{l.ts}</span>
                <span style={{ fontSize: 12, color: l.color, fontFamily: "'DM Mono',monospace", wordBreak: "break-all" }}>{l.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileOTPTab() {
  const [mobile, setMobile] = useState("");
  const [gateway, setGateway] = useState("twilio");
  const [ref, setRef] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [log, setLog] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);

  const addLog = (msg, color = C.muted) => setLog(p => [...p, { msg, color, ts: new Date().toLocaleTimeString() }]);

  const startCountdown = () => {
    setCountdown(30);
    timerRef.current = setInterval(() => {
      setCountdown(c => { if (c <= 1) { clearInterval(timerRef.current); return 0; } return c - 1; });
    }, 1000);
  };

  const sendOtp = async () => {
    const digits = mobile.replace(/\D/g, "");
    if (digits.length !== 10 || !/^[6-9]/.test(digits)) { setError("Enter a valid 10-digit Indian mobile number"); return; }
    setError(""); setLoading(true);
    addLog(`→ POST /otp/send  { "mobile": "+91${digits}", "gateway": "${gateway}" }`, C.blue);
    await new Promise(r => setTimeout(r, 1000));
    const fakeRef = `OTP-REF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const fakeOtp = String(Math.floor(100000 + Math.random() * 900000));
    setRef(fakeRef);
    addLog(`← 200 OK  { "ref": "${fakeRef}", "expires_in": 300 }`, C.accent);
    addLog(`📱 SMS sent via ${gateway.toUpperCase()} → +91 ••••••${digits.slice(-4)}  OTP: ${fakeOtp}`, C.amber);
    setOtp(fakeOtp);
    setStep(2); setLoading(false); setAttempts(0);
    startCountdown();
  };

  const verifyOtp = async () => {
    const digits = mobile.replace(/\D/g, "");
    if (otp.length !== 6) { setError("Enter the 6-digit OTP"); return; }
    setError(""); setLoading(true);
    addLog(`→ POST /otp/verify  { "mobile": "+91${digits}", "ref": "${ref}", "otp": "${otp}" }`, C.blue);
    await new Promise(r => setTimeout(r, 900));
    addLog(`← 200 OK  { "verified": true, "mobile": "+91••••••${digits.slice(-4)}" }`, C.accent);
    setStep(3); setLoading(false);
    clearInterval(timerRef.current);
  };

  const reset = () => { setStep(1); setMobile(""); setOtp(""); setRef(""); setError(""); setLog([]); setAttempts(0); clearInterval(timerRef.current); setCountdown(0); };

  const inputSt = { width: "100%", padding: "10px 14px", borderRadius: 8, background: C.surface2, border: `1px solid ${C.border}`, color: C.text, fontSize: 14, fontFamily: "'DM Mono',monospace", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ padding: "20px 20px 0" }}>
      <SectionHeader title="Mobile OTP Verification" subtitle="SMS gateway (Twilio / MSG91) · Redis-backed expiry & rate limiting" icon={PhoneIcon} />

      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        {["Enter Mobile", "Verify OTP", "Verified"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono',monospace", background: step > i + 1 ? C.accent : step === i + 1 ? `${C.accent}25` : C.surface2, border: `2px solid ${step >= i + 1 ? C.accent : C.border}`, color: step > i + 1 ? "#080C0A" : step === i + 1 ? C.accent : C.dark, transition: "all .3s" }}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 10, marginTop: 4, color: step === i + 1 ? C.accent : C.dark, whiteSpace: "nowrap", fontFamily: "'DM Mono',monospace" }}>{s}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, margin: "0 8px", marginBottom: 16, background: step > i + 1 ? C.accent : C.border, transition: "background .3s" }} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div style={{ maxWidth: 480 }}>
          <label style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: C.muted, display: "block", marginBottom: 6 }}>MOBILE NUMBER</label>
          <div style={{ display: "flex", gap: 0, marginBottom: 4 }}>
            <div style={{ padding: "10px 12px", borderRadius: "8px 0 0 8px", background: C.surface, border: `1px solid ${C.border}`, borderRight: "none", color: C.dark, fontSize: 13, fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap" }}>+91</div>
            <input style={{ ...inputSt, borderRadius: "0 8px 8px 0", flex: 1 }} value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" maxLength={10} inputMode="numeric" />
          </div>
          <label style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: C.muted, display: "block", marginTop: 14, marginBottom: 6 }}>SMS GATEWAY</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {["twilio", "msg91"].map(g => (
              <button key={g} onClick={() => setGateway(g)} style={{ padding: "10px 14px", borderRadius: 8, background: gateway === g ? `${C.accent}18` : C.surface2, border: `1px solid ${gateway === g ? C.accent : C.border}`, color: gateway === g ? C.accent : C.muted, fontSize: 13, fontFamily: "'DM Mono',monospace", fontWeight: 600, cursor: "pointer", transition: "all .2s" }}>
                {g === "twilio" ? "Twilio" : "MSG91"}
                <div style={{ fontSize: 10, color: gateway === g ? C.accent2 : C.dark, marginTop: 2 }}>{g === "twilio" ? "Global · REST API" : "India · Bulk SMS"}</div>
              </button>
            ))}
          </div>
          {error && <div style={{ color: C.red, fontSize: 12, marginTop: 8, fontFamily: "'DM Mono',monospace" }}>⚠ {error}</div>}
          <button onClick={sendOtp} disabled={loading} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 8, background: loading ? C.surface2 : C.accent, color: loading ? C.muted : "#080C0A", border: "none", fontWeight: 700, fontSize: 13, fontFamily: "'Syne',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all .2s" }}>
            {loading ? <><Spin />Sending SMS...</> : "Send OTP via SMS →"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ maxWidth: 480 }}>
          <div style={{ padding: "10px 14px", borderRadius: 8, background: `${C.blue}10`, border: `1px solid ${C.blue}30`, marginBottom: 16, fontSize: 12, fontFamily: "'DM Mono',monospace", color: C.muted }}>
            SMS dispatched via <span style={{ color: C.blue }}>{gateway.toUpperCase()}</span> · REF: <span style={{ color: C.accent }}>{ref}</span> · Expires in 5 min
          </div>
          <label style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: C.muted, display: "block", marginBottom: 6 }}>6-DIGIT OTP</label>
          <input style={{ ...inputSt, letterSpacing: 8, fontSize: 20 }} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="• • • • • •" maxLength={6} inputMode="numeric" />
          {error && <div style={{ color: C.red, fontSize: 12, marginTop: 8, fontFamily: "'DM Mono',monospace" }}>⚠ {error}</div>}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            {countdown > 0
              ? <span style={{ fontSize: 12, color: C.dark, fontFamily: "'DM Mono',monospace" }}>Resend in {countdown}s</span>
              : <button onClick={() => { setStep(1); setOtp(""); }} style={{ fontSize: 12, color: C.accent, fontFamily: "'DM Mono',monospace", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Resend OTP</button>}
            <span style={{ fontSize: 12, color: C.dark, fontFamily: "'DM Mono',monospace" }}>Attempts: {attempts}/3</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={() => { setStep(1); setOtp(""); setError(""); clearInterval(timerRef.current); }} style={{ padding: "10px 16px", borderRadius: 8, background: C.surface2, color: C.muted, border: `1px solid ${C.border}`, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Syne',sans-serif" }}>← Back</button>
            <button onClick={verifyOtp} disabled={loading} style={{ padding: "10px 24px", borderRadius: 8, background: loading ? C.surface2 : C.accent, color: loading ? C.muted : "#080C0A", border: "none", fontWeight: 700, fontSize: 13, fontFamily: "'Syne',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all .2s" }}>
              {loading ? <><Spin />Verifying...</> : "Verify OTP →"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ maxWidth: 480 }}>
          <div style={{ textAlign: "center", padding: "20px 0 16px" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${C.accent}18`, border: `2px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <span style={{ fontSize: 28 }}>✓</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Mobile Verified</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4, fontFamily: "'DM Mono',monospace" }}>+91 ••••••{mobile.slice(-4)} · Gateway: {gateway}</div>
          </div>
          <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}`, marginBottom: 16 }}>
            {[["Mobile", `+91 ••••••${mobile.slice(-4)}`], ["Gateway", gateway.toUpperCase()], ["OTP Ref", ref], ["Status", "VERIFIED"], ["Attempts used", "1 / 3"]].map(([k, v], i) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", background: i % 2 === 0 ? C.surface : C.bg, borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: 12, color: C.dark, fontFamily: "'DM Mono',monospace" }}>{k}</span>
                <span style={{ fontSize: 12, color: k === "Status" ? C.accent : C.text, fontFamily: "'DM Mono',monospace" }}>{v}</span>
              </div>
            ))}
          </div>
          <button onClick={reset} style={{ padding: "10px 20px", borderRadius: 8, background: C.accent, color: "#080C0A", border: "none", fontWeight: 700, fontSize: 13, fontFamily: "'Syne',sans-serif", cursor: "pointer" }}>Verify Another →</button>
        </div>
      )}

      {log.length > 0 && (
        <div style={{ marginTop: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontFamily: "'DM Mono',monospace", color: C.dark, letterSpacing: ".08em", marginBottom: 8 }}>REQUEST LOG</div>
          <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }}>
            {log.map((l, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "8px 14px", background: i % 2 === 0 ? C.surface : C.bg, borderBottom: i < log.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: 10, color: C.dark, fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap", flexShrink: 0 }}>{l.ts}</span>
                <span style={{ fontSize: 12, color: l.color, fontFamily: "'DM Mono',monospace", wordBreak: "break-all" }}>{l.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── WhatsApp Bot Tab ───────────────────────────────────────────────────────────
const SAMPLE_GROUPS = [
  { id: "G001", name: "Savitri Bachat Sangha", village: "Barwani", members: 12, savings: 48600, loans: 2, lastActive: "2 hrs ago", facilitator: "Meena Bai" },
  { id: "G002", name: "Jyoti Mahila Mandal", village: "Sendhwa", members: 15, savings: 72400, loans: 4, lastActive: "5 hrs ago", facilitator: "Rekha Devi" },
  { id: "G003", name: "Pragati SHG", village: "Rajpur", members: 10, savings: 31500, loans: 1, lastActive: "1 day ago", facilitator: "Sunita Bai" },
];

const CMDS = {
  en: [
    { cmd: "balance", desc: "Check group savings balance" },
    { cmd: "members", desc: "List verified members" },
    { cmd: "report", desc: "Monthly activity report" },
    { cmd: "verify <aadhaar>", desc: "Verify member via Aadhaar OTP" },
    { cmd: "loan <amount>", desc: "Request loan from group fund" },
    { cmd: "deposit <amount>", desc: "Record your deposit" },
    { cmd: "help", desc: "Show all commands" },
  ],
  hi: [
    { cmd: "balance", desc: "समूह की बचत देखें" },
    { cmd: "members", desc: "सत्यापित सदस्यों की सूची" },
    { cmd: "report", desc: "मासिक गतिविधि रिपोर्ट" },
    { cmd: "verify <आधार>", desc: "आधार OTP से सदस्य सत्यापन" },
    { cmd: "loan <राशि>", desc: "समूह निधि से ऋण अनुरोध" },
    { cmd: "deposit <राशि>", desc: "अपनी जमा राशि दर्ज करें" },
    { cmd: "help", desc: "सभी कमांड देखें" },
  ],
};

const T = {
  en: {
    welcome: (g) => `Namaste! 🙏\nWelcome to TrustCircle Bachat Sangha Bot.\n\nGroup: *${g.name}*\n\nType *help* to see all commands.\nType *report* to get your monthly summary.`,
    help: (cmds) => `📋 *Available commands:*\n\n` + cmds.map(c => `• *${c.cmd}* — ${c.desc}`).join("\n"),
    balance: (g) => `💰 *${g.name}*\nVillage: ${g.village}\n\nGroup Savings: ₹${g.savings.toLocaleString("en-IN")}\nActive Loans: ${g.loans}\nMembers: ${g.members} verified\n\nLast updated: ${g.lastActive}`,
    members: (g) => {
      const names = ["Priya Sharma", "Sunita Bai", "Rekha Devi", "Anita Patel", "Kamla Devi", "Geeta Bai", "Savitri", "Usha Devi", "Meena", "Pushpa Bai", "Radha Devi", "Lalita"];
      return `👥 *Members – ${g.name}*\n\n` + names.slice(0, g.members).map((n, i) => `${i + 1}. ${n} ✅`).join("\n");
    },
    report: (g) => `📊 *Monthly Report – ${g.name}*\nPeriod: June 2025\n\nTotal Savings: ₹${g.savings.toLocaleString("en-IN")}\nNew Deposits: ₹4,200\nLoans Disbursed: ₹${(g.loans * 5000).toLocaleString("en-IN")}\nRepayments Received: ₹3,800\nMeetings Held: 4/4 ✅\n\n*Recent transactions:*\n• 15 Jun  Sunita Bai  Deposit  +₹500\n• 12 Jun  Rekha Devi  Deposit  +₹500\n• 10 Jun  Kamla Devi  Repay  +₹1,200\n• 05 Jun  Priya Sharma  Loan  -₹5,000\n• 01 Jun  Geeta Bai  Deposit  +₹500\n\nFacilitator: ${g.facilitator} · Village: ${g.village}`,
    verify: () => `🪪 *Aadhaar Verification Started*\nAn OTP will be sent to the mobile linked with this Aadhaar.\n\nAsk the member to share the 6-digit OTP.\n\n⏳ Valid for 5 minutes.`,
    deposit: (g, amt) => `✅ *Deposit Recorded*\nAmount: ₹${parseInt(amt).toLocaleString("en-IN")}\nGroup: ${g.name}\nDate: ${new Date().toLocaleDateString("en-IN")}\n\nUpdated balance: ₹${(g.savings + parseInt(amt)).toLocaleString("en-IN")}\n\nThank you! 🙏`,
    loan: (g, amt) => `📝 *Loan Request Received*\nAmount: ₹${parseInt(amt).toLocaleString("en-IN")}\nGroup: ${g.name}\n\nForwarded to facilitator (${g.facilitator}) for approval.\nConfirmation within 24 hours.`,
    unknown: ["I didn't quite get that. Type *help* to see all commands.", "Hmm, not sure what you mean. Try *help*.", "Sorry, I only understand specific commands. Type *help*."],
    placeholder: "Type a message...",
    online: "online",
    typing: "typing...",
    langLabel: "EN",
  },
  hi: {
    welcome: (g) => `नमस्ते! 🙏\nTrustCircle बचत संघ बॉट में आपका स्वागत है।\n\nसमूह: *${g.name}*\n\nसभी कमांड देखने के लिए *help* टाइप करें।\nमासिक सारांश के लिए *report* टाइप करें।`,
    help: (cmds) => `📋 *उपलब्ध कमांड:*\n\n` + cmds.map(c => `• *${c.cmd}* — ${c.desc}`).join("\n"),
    balance: (g) => `💰 *${g.name}*\nगाँव: ${g.village}\n\nसमूह बचत: ₹${g.savings.toLocaleString("en-IN")}\nसक्रिय ऋण: ${g.loans}\nसदस्य: ${g.members} सत्यापित\n\nअंतिम अपडेट: ${g.lastActive}`,
    members: (g) => {
      const names = ["प्रिया शर्मा", "सुनीता बाई", "रेखा देवी", "अनिता पटेल", "कमला देवी", "गीता बाई", "सावित्री", "उषा देवी", "मीना", "पुष्पा बाई", "राधा देवी", "ललिता"];
      return `👥 *सदस्य – ${g.name}*\n\n` + names.slice(0, g.members).map((n, i) => `${i + 1}. ${n} ✅`).join("\n");
    },
    report: (g) => `📊 *मासिक रिपोर्ट – ${g.name}*\nअवधि: जून 2025\n\nकुल बचत: ₹${g.savings.toLocaleString("en-IN")}\nनई जमा: ₹4,200\nऋण वितरण: ₹${(g.loans * 5000).toLocaleString("en-IN")}\nभुगतान प्राप्त: ₹3,800\nबैठकें: 4/4 ✅\n\n*हालिया लेनदेन:*\n• 15 जून  सुनीता बाई  जमा  +₹500\n• 12 जून  रेखा देवी  जमा  +₹500\n• 10 जून  कमला देवी  भुगतान  +₹1,200\n• 05 जून  प्रिया शर्मा  ऋण  -₹5,000\n• 01 जून  गीता बाई  जमा  +₹500\n\nसुविधाकर्ता: ${g.facilitator} · गाँव: ${g.village}`,
    verify: () => `🪪 *आधार सत्यापन शुरू हुआ*\nइस आधार से जुड़े मोबाइल पर OTP भेजा जाएगा।\n\nसदस्य से 6 अंकों का OTP साझा करने को कहें।\n\n⏳ 5 मिनट के लिए वैध।`,
    deposit: (g, amt) => `✅ *जमा दर्ज की गई*\nराशि: ₹${parseInt(amt).toLocaleString("en-IN")}\nसमूह: ${g.name}\nदिनांक: ${new Date().toLocaleDateString("en-IN")}\n\nअपडेटेड शेष: ₹${(g.savings + parseInt(amt)).toLocaleString("en-IN")}\n\nधन्यवाद! 🙏`,
    loan: (g, amt) => `📝 *ऋण अनुरोध प्राप्त हुआ*\nराशि: ₹${parseInt(amt).toLocaleString("en-IN")}\nसमूह: ${g.name}\n\nसुविधाकर्ता (${g.facilitator}) को अनुमोदन हेतु भेजा गया।\n24 घंटे में पुष्टि मिलेगी।`,
    unknown: ["समझ नहीं आया। सभी कमांड के लिए *help* टाइप करें।", "कृपया *help* टाइप करें।", "मुझे यह समझ नहीं आया। *help* टाइप करें।"],
    placeholder: "संदेश टाइप करें...",
    online: "ऑनलाइन",
    typing: "टाइप कर रहा है...",
    langLabel: "हिंदी",
  },
};

function WABotTab() {
  const [lang, setLang] = useState("en");
  const [selectedGroup, setSelectedGroup] = useState(SAMPLE_GROUPS[0]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const makeWelcome = (g, l) => ({
    from: "bot",
    text: T[l].welcome(g),
    ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });

  const [messages, setMessages] = useState(() => [makeWelcome(SAMPLE_GROUPS[0], "en")]);

  // When group changes, reset chat with new welcome
  const switchGroup = (g) => {
    setSelectedGroup(g);
    setMessages([makeWelcome(g, lang)]);
  };

  // When language changes, reset chat with welcome in new lang (keep group)
  const switchLang = (l) => {
    setLang(l);
    setMessages([makeWelcome(selectedGroup, l)]);
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async (rawText) => {
    if (!rawText.trim()) return;
    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(p => [...p, { from: "user", text: rawText.trim(), ts }]);
    setChatInput("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 700 + Math.random() * 500));

    const lower = rawText.toLowerCase().trim();
    const t = T[lang];
    const cmds = CMDS[lang];
    let reply = "";

    if (lower === "help") {
      reply = t.help(cmds);
    } else if (lower === "balance") {
      reply = t.balance(selectedGroup);
    } else if (lower === "members") {
      reply = t.members(selectedGroup);
    } else if (lower.startsWith("report")) {
      reply = t.report(selectedGroup);
    } else if (lower.startsWith("verify")) {
      reply = t.verify();
    } else if (lower.startsWith("deposit")) {
      const amt = lower.split(" ")[1] || "500";
      reply = t.deposit(selectedGroup, amt);
    } else if (lower.startsWith("loan")) {
      const amt = lower.split(" ")[1] || "5000";
      reply = t.loan(selectedGroup, amt);
    } else {
      reply = t.unknown[Math.floor(Math.random() * t.unknown.length)];
    }

    const botTs = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(p => [...p, { from: "bot", text: reply, ts: botTs }]);
    setLoading(false);
  };

  const inputSt = {
    flex: 1, padding: "10px 14px", borderRadius: 8,
    background: C.surface2, border: `1px solid ${C.border}`,
    color: C.text, fontSize: 13, fontFamily: "'DM Mono',monospace", outline: "none",
  };

  return (
    <div style={{ padding: "20px 20px 24px" }}>
      <SectionHeader
        title="WhatsApp Bot — Bachat Sangha Portal"
        subtitle="Field worker interface · Aadhaar-linked member verification"
        icon={WAIcon}
      />

      {/* Group + Language row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Group selector */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: C.muted, marginBottom: 6 }}>SELECT GROUP</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {SAMPLE_GROUPS.map(g => (
              <button key={g.id} onClick={() => switchGroup(g)} style={{ padding: "8px 12px", borderRadius: 8, background: selectedGroup.id === g.id ? `${C.whatsapp}12` : C.surface2, border: `1px solid ${selectedGroup.id === g.id ? C.whatsapp : C.border}`, color: selectedGroup.id === g.id ? C.whatsapp : C.muted, textAlign: "left", cursor: "pointer", transition: "all .15s", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, fontFamily: "'Syne',sans-serif" }}>{g.name}</div>
                  <div style={{ fontSize: 10, fontFamily: "'DM Mono',monospace", color: C.dark, marginTop: 1 }}>{g.village} · {g.members} members · ₹{g.savings.toLocaleString("en-IN")}</div>
                </div>
                {selectedGroup.id === g.id && <span style={{ fontSize: 10, color: C.whatsapp }}>●</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div style={{ flex: 2, minWidth: 300, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}` }}>
          {/* Chat header with language toggle */}
          <div style={{ background: C.whatsappDark, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${C.whatsapp}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <WAIcon size={17} color={C.whatsapp} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>TrustCircle Bot</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", fontFamily: "'DM Mono',monospace" }}>
                {selectedGroup.name} · {loading ? T[lang].typing : T[lang].online}
              </div>
            </div>
            {/* Language toggle */}
            <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", border: `1px solid rgba(255,255,255,0.15)`, flexShrink: 0 }}>
              {["en", "hi"].map(l => (
                <button key={l} onClick={() => switchLang(l)} style={{ padding: "4px 10px", background: lang === l ? "rgba(255,255,255,0.18)" : "transparent", border: "none", color: lang === l ? "#fff" : "rgba(255,255,255,0.45)", fontSize: 11, fontFamily: "'DM Mono',monospace", cursor: "pointer", transition: "all .15s" }}>
                  {l === "en" ? "EN" : "हिं"}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div ref={chatRef} style={{ height: 370, overflowY: "auto", padding: "12px 10px", background: "#0a1612", display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "80%", padding: "8px 12px", borderRadius: m.from === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", background: m.from === "user" ? C.whatsappDark : C.surface2, border: `1px solid ${m.from === "user" ? C.whatsapp + "40" : C.border}` }}>
                  <div
                    style={{ fontSize: 12, color: C.text, fontFamily: "'DM Mono',monospace", lineHeight: 1.7, whiteSpace: "pre-wrap" }}
                    dangerouslySetInnerHTML={{ __html: m.text.replace(/\*(.*?)\*/g, '<strong style="color:#2ECC89">$1</strong>') }}
                  />
                  <div style={{ fontSize: 10, color: C.dark, marginTop: 4, textAlign: "right", fontFamily: "'DM Mono',monospace" }}>{m.ts}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ padding: "8px 14px", borderRadius: "12px 12px 12px 2px", background: C.surface2, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {[0, 1, 2].map(n => (
                      <div key={n} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, animation: `pulse 1.2s ${n * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: "10px 12px", background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
            <input
              style={inputSt}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendMessage(chatInput); }}
              placeholder={T[lang].placeholder}
              autoComplete="off"
            />
            <button
              onClick={() => sendMessage(chatInput)}
              disabled={loading || !chatInput.trim()}
              style={{ padding: "10px 16px", borderRadius: 8, background: chatInput.trim() ? C.whatsapp : C.surface2, color: chatInput.trim() ? "#080C0A" : C.dark, border: "none", fontWeight: 700, fontSize: 13, cursor: chatInput.trim() ? "pointer" : "default", transition: "all .15s" }}
            >→</button>
          </div>

          {/* Commands hint — small, below input */}
          <div style={{ padding: "8px 12px 10px", background: C.bg, borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, color: C.dark, fontFamily: "'DM Mono',monospace", marginBottom: 5 }}>
              {lang === "en" ? "commands:" : "कमांड:"}
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {["balance", "members", "report", "help"].map(cmd => (
                <span
                  key={cmd}
                  onClick={() => sendMessage(cmd)}
                  style={{ padding: "3px 8px", borderRadius: 4, background: `${C.whatsapp}10`, border: `1px solid ${C.whatsapp}25`, color: C.whatsapp, fontSize: 10, fontFamily: "'DM Mono',monospace", cursor: "pointer" }}
                >{cmd}</span>
              ))}
              <span style={{ fontSize: 10, color: C.dark, fontFamily: "'DM Mono',monospace", alignSelf: "center" }}>
                {lang === "en" ? "+ deposit/loan/verify" : "+ deposit/loan/verify"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Commands reference — full table below */}
      <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}`, marginTop: 8 }}>
        <div style={{ padding: "10px 16px", background: C.surface2, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{lang === "en" ? "Bot Commands" : "बॉट कमांड"}</span>
          <Badge color={C.whatsapp}>{lang === "en" ? "English" : "हिंदी"}</Badge>
        </div>
        {CMDS[lang].map((c, i) => (
          <div key={c.cmd} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "9px 16px", background: i % 2 === 0 ? C.surface : C.bg, borderBottom: i < CMDS[lang].length - 1 ? `1px solid ${C.border}` : "none" }}>
            <code style={{ fontSize: 11, color: C.whatsapp, fontFamily: "'DM Mono',monospace", background: `${C.whatsapp}10`, padding: "2px 7px", borderRadius: 4, whiteSpace: "nowrap", flexShrink: 0 }}>{c.cmd}</code>
            <span style={{ fontSize: 12, color: C.muted }}>{c.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReadmeTab() {
  const pre = (code, color = C.accent) => (
    <pre style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", fontSize: 12, fontFamily: "'DM Mono',monospace", color, overflowX: "auto", marginBottom: 20, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{code}</pre>
  );

  const setup = `git clone https://github.com/your-org/aadhaar-otp-verification.git
cd aadhaar-otp-verification
cp config/.env.example .env        # fill UIDAI + SMS + Redis + WA creds
pip install -r requirements.txt
uvicorn api.main:app --reload`;

  const envVars = `UIDAI_AUA_CODE=your_aua_code
UIDAI_LICENSE_KEY=your_license_key
UIDAI_CERT_PATH=./certs/uidai_auth_prod.cer
SMS_GATEWAY=twilio                 # or msg91
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_FROM_NUMBER=+1234567890
REDIS_URL=redis://localhost:6379/0
OTP_EXPIRY_SECONDS=300
OTP_MAX_ATTEMPTS=3
WA_TOKEN=your_whatsapp_cloud_api_token
WA_PHONE_NUMBER_ID=1234567890
WA_VERIFY_TOKEN=your_webhook_verify_token`;

  const features = [
    "Aadhaar OTP auth via UIDAI AUA/KUA API (Auth XML v2.5)",
    "AES-256 session key + RSA-2048 encryption per UIDAI spec",
    "Mobile OTP with Redis-backed expiry and rate limiting",
    "Pluggable SMS gateway — Twilio or MSG91",
    "WhatsApp Bot for field workers: balance, member list, reports, Aadhaar verify",
    "Bilingual bot responses (Hindi + English)",
    "Full test suite with mocked UIDAI + SMS + WhatsApp responses",
    "DPDP Act 2023 compliant — Aadhaar never stored in plaintext",
    "Docker + docker-compose ready with Redis service",
  ];

  const endpoints = [
    { method: "POST", path: "/aadhaar/send-otp", body: '{ "aadhaar_number": "XXXX-XXXX-XXXX" }', resp: '{ "txn_id": "TXN-XXXXXXXX", "status": "OTP_SENT" }', color: C.accent },
    { method: "POST", path: "/aadhaar/verify", body: '{ "aadhaar_number": "...", "txn_id": "...", "otp": "123456" }', resp: '{ "auth_status": "SUCCESS", "name": "Priya S.", "dob": "****-**-**" }', color: C.accent },
    { method: "POST", path: "/otp/send", body: '{ "mobile": "+919876543210" }', resp: '{ "ref": "OTP-REF-XXXX", "expires_in": 300 }', color: C.blue },
    { method: "POST", path: "/otp/verify", body: '{ "mobile": "+919876543210", "otp": "748291" }', resp: '{ "verified": true, "mobile": "+91••••••3210" }', color: C.blue },
    { method: "POST", path: "/webhook", body: '{ WhatsApp Cloud API webhook payload }', resp: '200 OK (handled by bot router)', color: C.whatsapp },
    { method: "GET", path: "/webhook", body: '?hub.verify_token=...&hub.challenge=...', resp: 'hub.challenge (webhook verification)', color: C.whatsapp },
  ];

  const chips = ["Python 3.11+", "FastAPI", "Redis", "UIDAI API", "Twilio / MSG91", "WhatsApp Cloud API", "DPDP 2023"];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 6 }}>🪪 Aadhaar + Mobile OTP + WhatsApp Bot</div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 14, lineHeight: 1.6 }}>Python/FastAPI service for Aadhaar-based identity verification (UIDAI), mobile OTP via SMS, and a WhatsApp bot for Bachat Sangha field workers.</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {chips.map(c => <span key={c} style={{ padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'DM Mono',monospace", color: C.accent, background: C.accentGlow, border: `1px solid ${C.accent}30` }}>{c}</span>)}
      </div>
      <div style={{ height: 1, background: C.border, margin: "0 0 20px" }} />

      <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>⚙ Setup</div>
      {pre(setup)}

      <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>🔑 Environment variables</div>
      {pre(envVars, C.muted)}

      <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>📡 API endpoints</div>
      {endpoints.map(ep => (
        <div key={ep.path} style={{ marginBottom: 12, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: C.surface2 }}>
            <Badge color={ep.color}>{ep.method}</Badge>
            <span style={{ fontSize: 13, fontFamily: "'DM Mono',monospace", color: C.text }}>{ep.path}</span>
          </div>
          <div style={{ padding: "10px 14px", background: C.bg, borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: C.dark, marginBottom: 4 }}>REQUEST BODY</div>
            <pre style={{ fontSize: 11, color: ep.color, margin: "0 0 8px", fontFamily: "'DM Mono',monospace" }}>{ep.body}</pre>
            <div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: C.dark, marginBottom: 4 }}>RESPONSE</div>
            <pre style={{ fontSize: 11, color: C.blue, margin: 0, fontFamily: "'DM Mono',monospace" }}>{ep.resp}</pre>
          </div>
        </div>
      ))}

      <div style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: "20px 0 12px" }}>✅ Key features</div>
      <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", background: i % 2 === 0 ? C.surface : C.bg, borderBottom: i < features.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, marginTop: 5, flexShrink: 0, boxShadow: `0 0 6px ${C.accent}` }} />
            <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AadhaarOTPRepo() {
  const [activeTab, setActiveTab] = useState("code");

  const TABS = [
    { id: "code", label: "Code", Icon: CodeIcon },
    { id: "aadhaar", label: "Aadhaar OTP", Icon: ShieldIcon },
    { id: "mobile", label: "Mobile OTP", Icon: PhoneIcon },
    { id: "whatsapp", label: "WhatsApp Bot", Icon: WAIcon },
    { id: "readme", label: "README", Icon: DocIcon },
  ];

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; }
    body { margin: 0; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: #080C0A; }
    ::-webkit-scrollbar-thumb { background: #1E2E22; border-radius: 2px; }
    ::-webkit-scrollbar-thumb:hover { background: #2ECC89; }
    select option { background: #0D1410; color: #E8F0EA; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse {
      0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
      40% { opacity: 1; transform: scale(1); }
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'Syne', sans-serif" }}>

        {/* Top Bar */}
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: C.accentGlow, border: `1px solid ${C.accent}40` }}>
                  <ShieldIcon size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                    <span style={{ color: C.muted }}>your-org / </span>aadhaar-otp-verification
                  </div>
                  <div style={{ fontSize: 10, fontFamily: "'DM Mono',monospace", color: C.dark, marginTop: 1 }}>Public · Python · DPDP Act 2023 Compliant</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Badge color={C.muted}>⭐ Star</Badge>
                <Badge color={C.muted}>🍴 Fork</Badge>
                <Badge color={C.accent}>Public</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 56, zIndex: 40 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", display: "flex", overflowX: "auto" }}>
            {TABS.map(({ id, label, Icon }) => {
              const active = activeTab === id;
              const isWA = id === "whatsapp";
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "11px 16px", background: "transparent", border: "none",
                    borderBottom: `2px solid ${active ? (isWA ? C.whatsapp : C.accent) : "transparent"}`,
                    color: active ? (isWA ? C.whatsapp : C.accent) : C.muted,
                    fontSize: 13, fontWeight: 500, fontFamily: "'Syne',sans-serif",
                    cursor: "pointer", transition: "color .15s", marginBottom: -1, whiteSpace: "nowrap",
                  }}
                  onMouseOver={e => { if (!active) e.currentTarget.style.color = C.text; }}
                  onMouseOut={e => { if (!active) e.currentTarget.style.color = C.muted; }}
                >
                  <Icon size={13} color={active ? (isWA ? C.whatsapp : C.accent) : C.muted} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Meta Bar */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", gap: 20, padding: "10px 0", borderBottom: `1px solid ${C.border}`, flexWrap: "wrap" }}>
            {[["⎇", "main"], ["◎", "17 commits"], ["⚉", "1 contributor"]].map(([icon, text]) => (
              <span key={text} style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", color: C.dark, display: "flex", alignItems: "center", gap: 5 }}>{icon} {text}</span>
            ))}
            <span style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", color: C.accent, marginLeft: "auto" }}>Updated 5 hrs ago</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {activeTab === "code" && <CodeTab />}
          {activeTab === "aadhaar" && <AadhaarTab />}
          {activeTab === "mobile" && <MobileOTPTab />}
          {activeTab === "whatsapp" && <WABotTab />}
          {activeTab === "readme" && <ReadmeTab />}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, padding: "20px 16px", textAlign: "center", borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: C.dark }}>
            TrustCircle · NGO Facilitator Portal · DPDP Act 2023 Compliant · Data encrypted at rest &amp; in transit
          </div>
        </div>
      </div>
    </>
  );
}
