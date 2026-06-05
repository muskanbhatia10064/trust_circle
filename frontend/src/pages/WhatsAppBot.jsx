import { useState, useRef, useEffect } from "react";
import { circleApi } from "../services/api";

const C = {
  bg: "#F7F9FC",
  card: "#FFFFFF",
  border: "#E2E8F0",
  primary: "#1D9E75",
  primaryDark: "#0E7A5A",
  text: "#1A2332",
  muted: "#6B7A8D",
  light: "#8899AA",
  shadow: "0 2px 12px rgba(0,0,0,0.06)",
  radius: "12px",
  whatsapp: "#25D366",
  whatsappDark: "#128C7E",
};

function Badge({ children, color = C.primary }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500, letterSpacing: ".04em", color, background: `${color}18`, border: `1px solid ${color}35` }}>
      {children}
    </span>
  );
}

function WAIcon({ size = 14, color = C.whatsapp }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

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
    balance: (g) => `💰 *${g.name}*\n\nGroup Savings: ₹${g.savings.toLocaleString("en-IN")}\nActive Loans: ${g.loans}\nMembers: ${g.members} verified\n\nLast updated: ${g.lastActive}`,
    members: (g) => {
      const names = ["Priya Sharma", "Sunita Bai", "Rekha Devi", "Anita Patel", "Kamla Devi", "Geeta Bai", "Savitri", "Usha Devi", "Meena", "Pushpa Bai", "Radha Devi", "Lalita"];
      return `👥 *Members – ${g.name}*\n\n` + names.slice(0, g.members).map((n, i) => `${i + 1}. ${n} ✅`).join("\n");
    },
    report: (g) => `📊 *Monthly Report – ${g.name}*\nPeriod: June 2025\n\nTotal Savings: ₹${g.savings.toLocaleString("en-IN")}\nNew Deposits: ₹4,200\nLoans Disbursed: ₹${(g.loans * 5000).toLocaleString("en-IN")}\nRepayments Received: ₹3,800\nMeetings Held: 4/4 ✅\n\nFacilitator: ${g.facilitator}`,
    verify: () => `🪪 *Aadhaar Verification Started*\nAn OTP will be sent to the mobile linked with this Aadhaar.\n\nAsk the member to share the 6-digit OTP.\n\n⏳ Valid for 5 minutes.`,
    deposit: (g, amt) => `✅ *Deposit Recorded*\nAmount: ₹${parseInt(amt).toLocaleString("en-IN")}\nGroup: ${g.name}\nDate: ${new Date().toLocaleDateString("en-IN")}\n\nUpdated balance: ₹${(g.savings + parseInt(amt)).toLocaleString("en-IN")}\n\nThank you! 🙏`,
    loan: (g, amt) => `📝 *Loan Request Received*\nAmount: ₹${parseInt(amt).toLocaleString("en-IN")}\nGroup: ${g.name}\n\nForwarded to facilitator (${g.facilitator}) for approval.\nConfirmation within 24 hours.`,
    unknown: ["I didn't quite get that. Type *help* to see all commands.", "Hmm, not sure what you mean. Try *help*.", "Sorry, I only understand specific commands. Type *help*."],
    placeholder: "Type a message...", online: "online", typing: "typing...",
  },
  hi: {
    welcome: (g) => `नमस्ते! 🙏\nTrustCircle बचत संघ बॉट में आपका स्वागत है।\n\nसमूह: *${g.name}*\n\nसभी कमांड देखने के लिए *help* टाइप करें।\nमासिक सारांश के लिए *report* टाइप करें।`,
    help: (cmds) => `📋 *उपलब्ध कमांड:*\n\n` + cmds.map(c => `• *${c.cmd}* — ${c.desc}`).join("\n"),
    balance: (g) => `💰 *${g.name}*\n\nसमूह बचत: ₹${g.savings.toLocaleString("en-IN")}\nसक्रिय ऋण: ${g.loans}\nसदस्य: ${g.members} सत्यापित\n\nअंतिम अपडेट: ${g.lastActive}`,
    members: (g) => {
      const names = ["प्रिया शर्मा", "सुनीता बाई", "रेखा देवी", "अनिता पटेल", "कमला देवी", "गीता बाई", "सावित्री", "उषा देवी", "मीना", "पुष्पा बाई", "राधा देवी", "ललिता"];
      return `👥 *सदस्य – ${g.name}*\n\n` + names.slice(0, g.members).map((n, i) => `${i + 1}. ${n} ✅`).join("\n");
    },
    report: (g) => `📊 *मासिक रिपोर्ट – ${g.name}*\nअवधि: जून 2025\n\nकुल बचत: ₹${g.savings.toLocaleString("en-IN")}\nनई जमा: ₹4,200\nऋण वितरण: ₹${(g.loans * 5000).toLocaleString("en-IN")}\nभुगतान प्राप्त: ₹3,800\nबैठकें: 4/4 ✅\n\nसुविधाकर्ता: ${g.facilitator}`,
    verify: () => `🪪 *आधार सत्यापन शुरू हुआ*\nइस आधार से जुड़े मोबाइल पर OTP भेजा जाएगा।\n\nसदस्य से 6 अंकों का OTP साझा करने को कहें।\n\n⏳ 5 मिनट के लिए वैध।`,
    deposit: (g, amt) => `✅ *जमा दर्ज की गई*\nराशि: ₹${parseInt(amt).toLocaleString("en-IN")}\nसमूह: ${g.name}\nदिनांक: ${new Date().toLocaleDateString("en-IN")}\n\nअपडेटेड शेष: ₹${(g.savings + parseInt(amt)).toLocaleString("en-IN")}\n\nधन्यवाद! 🙏`,
    loan: (g, amt) => `📝 *ऋण अनुरोध प्राप्त हुआ*\nराशि: ₹${parseInt(amt).toLocaleString("en-IN")}\nसमूह: ${g.name}\n\nसुविधाकर्ता (${g.facilitator}) को अनुमोदन हेतु भेजा गया।\n24 घंटे में पुष्टि मिलेगी।`,
    unknown: ["समझ नहीं आया। सभी कमांड के लिए *help* टाइप करें।", "कृपया *help* टाइप करें।", "मुझे यह समझ नहीं आया। *help* टाइप करें।"],
    placeholder: "संदेश टाइप करें...", online: "ऑनलाइन", typing: "टाइप कर रहा है...",
  },
};

export default function WhatsAppBot() {
  const [lang, setLang] = useState("en");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  const makeWelcome = (g, l) => ({
    from: "bot",
    text: T[l].welcome(g),
    ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });

  useEffect(() => {
    circleApi.list().then(r => {
      const mapped = r.data.map(c => ({
        id: c.id,
        name: c.name,
        members: c.current_member_count,
        savings: c.pool_balance,
        loans: 0,
        lastActive: "recently",
        facilitator: "Admin",
      }));
      setGroups(mapped);
      if (mapped.length > 0) {
        setSelectedGroup(mapped[0]);
        setMessages([makeWelcome(mapped[0], "en")]);
      }
    }).catch(() => {}).finally(() => setFetching(false));
  }, []);

  const switchGroup = (g) => { setSelectedGroup(g); setMessages([makeWelcome(g, lang)]); setAttempts(0); };
  const switchLang = (l) => { setLang(l); if (selectedGroup) setMessages([makeWelcome(selectedGroup, l)]); };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async (rawText) => {
    if (!rawText.trim() || !selectedGroup) return;
    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(p => [...p, { from: "user", text: rawText.trim(), ts }]);
    setChatInput("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 700 + Math.random() * 500));

    const lower = rawText.toLowerCase().trim();
    const t = T[lang];
    let reply = "";

    if (lower === "help") {
      reply = t.help(CMDS[lang]);
    } else if (lower === "balance") {
      reply = t.balance(selectedGroup);
    } else if (lower === "members") {
      reply = t.members(selectedGroup);
    } else if (lower.startsWith("report")) {
      reply = t.report(selectedGroup);
    } else if (lower.startsWith("verify")) {
      reply = t.verify();
    } else if (lower.startsWith("deposit")) {
      const amt = parseInt(lower.split(" ")[1]) || 500;
      if (!isNaN(amt) && amt > 0) {
        const updated = { ...selectedGroup, savings: selectedGroup.savings + amt };
        setGroups(prev => prev.map(g => g.id === selectedGroup.id ? updated : g));
        setSelectedGroup(updated);
        reply = t.deposit(selectedGroup, amt);
      } else {
        reply = t.unknown[0];
      }
    } else if (lower.startsWith("loan")) {
      const amt = parseInt(lower.split(" ")[1]) || 5000;
      reply = t.loan(selectedGroup, amt);
    } else {
      setAttempts(p => p + 1);
      reply = t.unknown[Math.floor(Math.random() * t.unknown.length)];
    }

    const botTs = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(p => [...p, { from: "bot", text: reply, ts: botTs }]);
    setLoading(false);
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Sora', sans-serif", padding: "40px 24px 60px", maxWidth: 1100, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${C.whatsapp}18`, border: `1px solid ${C.border}` }}>
          <WAIcon size={18} />
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>WhatsApp Bot</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Bachat Sangha Portal · Field worker interface</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap", alignItems: "flex-start" }}>

        {/* Group selector */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.light, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 8 }}>Select Group</div>

          {fetching ? (
            <div style={{ background: C.card, borderRadius: C.radius, padding: "20px 16px", textAlign: "center", color: C.muted, fontSize: 13, boxShadow: C.shadow, border: `1px solid ${C.border}` }}>
              Loading your circles…
            </div>
          ) : groups.length === 0 ? (
            <div style={{ background: C.card, borderRadius: C.radius, padding: "20px 16px", textAlign: "center", color: C.muted, fontSize: 13, boxShadow: C.shadow, border: `1px solid ${C.border}` }}>
              You have no circles yet. Create one in the Circles page.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {groups.map(g => (
                <button key={g.id} onClick={() => switchGroup(g)} style={{ padding: "12px 14px", borderRadius: C.radius, background: selectedGroup?.id === g.id ? `${C.whatsapp}12` : C.card, border: `1.5px solid ${selectedGroup?.id === g.id ? C.whatsapp : C.border}`, color: C.text, textAlign: "left", cursor: "pointer", transition: "all .15s", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: C.shadow }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{g.name}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{g.members} members · ₹{g.savings.toLocaleString("en-IN")}</div>
                  </div>
                  {selectedGroup?.id === g.id && <span style={{ fontSize: 10, color: C.whatsapp }}>●</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat window */}
        <div style={{ flex: 2, minWidth: 300, borderRadius: C.radius, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
          {/* Chat header */}
          <div style={{ background: C.whatsappDark, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${C.whatsapp}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <WAIcon size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>TrustCircle Bot</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                {selectedGroup ? selectedGroup.name : "No circle selected"} · {loading ? T[lang].typing : T[lang].online}
              </div>
            </div>
            {/* Language toggle */}
            <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", border: "1px solid rgba(255,255,255,0.2)", flexShrink: 0 }}>
              {["en", "hi"].map(l => (
                <button key={l} onClick={() => switchLang(l)} style={{ padding: "4px 10px", background: lang === l ? "rgba(255,255,255,0.2)" : "transparent", border: "none", color: lang === l ? "#fff" : "rgba(255,255,255,0.5)", fontSize: 11, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>
                  {l === "en" ? "EN" : "हिं"}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div ref={chatRef} style={{ height: 370, overflowY: "auto", padding: "12px 10px", background: "#0a1612", display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "80%", padding: "8px 12px", borderRadius: m.from === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", background: m.from === "user" ? C.whatsappDark : "#1A2A20", border: `1px solid ${m.from === "user" ? C.whatsapp + "40" : "#2A3E2E"}` }}>
                  <div
                    style={{ fontSize: 12, color: "#E8F0EA", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'Sora', sans-serif" }}
                    dangerouslySetInnerHTML={{ __html: m.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\*(.*?)\*/g, `<strong style="color:${C.whatsapp}">$1</strong>`) }}
                  />
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 4, textAlign: "right" }}>{m.ts}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ padding: "8px 14px", borderRadius: "12px 12px 12px 2px", background: "#1A2A20", border: "1px solid #2A3E2E" }}>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {[0, 1, 2].map(n => (
                      <div key={n} style={{ width: 6, height: 6, borderRadius: "50%", background: C.whatsapp, animation: `pulse 1.2s ${n * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: "10px 12px", background: C.card, borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
            <input
              style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: C.bg, border: `1.5px solid ${C.border}`, color: C.text, fontSize: 13, fontFamily: "'Sora', sans-serif", outline: "none" }}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendMessage(chatInput); }}
              placeholder={T[lang].placeholder}
              autoComplete="off"
              disabled={!selectedGroup}
            />
            <button
              onClick={() => sendMessage(chatInput)}
              disabled={loading || !chatInput.trim() || !selectedGroup}
              style={{ padding: "10px 16px", borderRadius: 8, background: chatInput.trim() && selectedGroup ? C.whatsapp : C.border, color: chatInput.trim() && selectedGroup ? "#fff" : C.muted, border: "none", fontWeight: 700, fontSize: 13, cursor: chatInput.trim() && selectedGroup ? "pointer" : "default", transition: "all .15s", fontFamily: "'Sora', sans-serif" }}
            >→</button>
          </div>

          {/* Quick commands */}
          <div style={{ padding: "8px 12px 10px", background: C.bg, borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, color: C.light, marginBottom: 5 }}>{lang === "en" ? "Quick commands:" : "त्वरित कमांड:"}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["balance", "members", "report", "help"].map(cmd => (
                <span key={cmd} onClick={() => sendMessage(cmd)} style={{ padding: "3px 10px", borderRadius: 6, background: `${C.whatsapp}12`, border: `1px solid ${C.whatsapp}30`, color: C.primary, fontSize: 11, cursor: "pointer", fontWeight: 500 }}>{cmd}</span>
              ))}
              <span style={{ fontSize: 11, color: C.light, alignSelf: "center" }}>+ deposit / loan / verify</span>
              {attempts > 0 && <span style={{ fontSize: 11, color: "#E8A020", alignSelf: "center", marginLeft: "auto" }}>Unknown: {attempts}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Commands reference table */}
      <div style={{ borderRadius: C.radius, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: C.shadow, marginTop: 8 }}>
        <div style={{ padding: "14px 20px", background: C.card, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{lang === "en" ? "Bot Commands" : "बॉट कमांड"}</span>
          <Badge color={C.whatsapp}>{lang === "en" ? "English" : "हिंदी"}</Badge>
        </div>
        {CMDS[lang].map((c, i) => (
          <div key={c.cmd} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 20px", background: i % 2 === 0 ? C.card : C.bg, borderBottom: i < CMDS[lang].length - 1 ? `1px solid ${C.border}` : "none" }}>
            <code style={{ fontSize: 12, color: C.primary, background: `${C.primary}10`, padding: "2px 8px", borderRadius: 5, whiteSpace: "nowrap", flexShrink: 0, border: `1px solid ${C.primary}20` }}>{c.cmd}</code>
            <span style={{ fontSize: 13, color: C.muted }}>{c.desc}</span>
          </div>
        ))}
      </div>

      <style>{`@keyframes pulse { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}
