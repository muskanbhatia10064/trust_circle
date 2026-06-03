import { useEffect, useState } from 'react'
import { consentApi } from '../services/api'

const PURPOSES = [
  { key: 'trust_score', label: 'Trust Score Computation' },
  { key: 'partner_api', label: 'Share with NBFC/MFI Partners' },
  { key: 'analytics', label: 'Platform Analytics' },
  { key: 'marketing', label: 'Marketing Communications' },
]

export default function Consent() {
  const [consents, setConsents] = useState({})
  const [msg, setMsg] = useState('')

  useEffect(() => {
    consentApi.list().then(r => {
      const map = {}
      r.data.forEach(c => { map[c.purpose] = c.granted })
      setConsents(map)
    }).catch(() => {})
  }, [])

  async function toggle(purpose, granted) {
    await consentApi.update(purpose, granted)
    setConsents(prev => ({ ...prev, [purpose]: granted }))
    setMsg(`Consent for "${purpose}" ${granted ? 'granted' : 'revoked'}`)
    setTimeout(() => setMsg(''), 2500)
  }

  async function exportPassport() {
    const r = await consentApi.exportPassport()
    const url = URL.createObjectURL(new Blob([r.data]))
    const a = document.createElement('a')
    a.href = url
    a.download = 'financial_passport.json'
    a.click()
  }

  return (
    <div className="page">
      <h1 style={{ marginBottom: '1.5rem' }}>Consent Management</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>DPDP Act 2023 — granular per-purpose consent controls</p>
      {msg && <div className="alert success">{msg}</div>}

      <div className="card">
        {PURPOSES.map(({ key, label }) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 0', borderBottom: '1px solid #eee' }}>
            <span>{label}</span>
            <div>
              <button
                onClick={() => toggle(key, true)}
                style={{ background: consents[key] ? '#27ae60' : '#ccc', marginRight: '0.5rem' }}
              >Grant</button>
              <button
                onClick={() => toggle(key, false)}
                style={{ background: !consents[key] && consents[key] !== undefined ? '#c0392b' : '#ccc' }}
              >Revoke</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Financial Passport</h3>
        <p style={{ color: '#666', marginBottom: '1rem' }}>Export all your data — full data portability as per DPDP Act 2023.</p>
        <button onClick={exportPassport}>⬇ Download Financial Passport</button>
      </div>
    </div>
  )
}
