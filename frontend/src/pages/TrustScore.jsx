import { useEffect, useState } from 'react'
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts'
import { trustApi } from '../services/api'

export default function TrustScore() {
  const [score, setScore] = useState(null)
  const [auditResult, setAuditResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { trustApi.getMyScore().then(r => setScore(r.data)).catch(() => {}) }, [])

  async function computeScore() {
    setLoading(true)
    try {
      const r = await trustApi.compute()
      setScore(r.data)
    } finally { setLoading(false) }
  }

  async function runAudit() {
    const r = await trustApi.runAudit()
    setAuditResult(r.data)
  }

  const chartData = score ? [{ name: 'Score', value: score.score, fill: '#0f3460' }] : []

  return (
    <div className="page">
      <h1 style={{ marginBottom: '1.5rem' }}>Trust Score</h1>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <div className="score-badge">{score?.score ?? '—'}</div>
          <p style={{ color: '#666', fontSize: '0.85rem' }}>Range: 300–900</p>
        </div>
        {score && (
          <ResponsiveContainer width={180} height={180}>
            <RadialBarChart innerRadius="60%" outerRadius="100%" data={chartData} startAngle={180} endAngle={0}>
              <RadialBar dataKey="value" cornerRadius={6} background />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        )}
        <div>
          <button onClick={computeScore} disabled={loading}>{loading ? 'Computing…' : 'Recompute Score'}</button>
          <br /><br />
          <button onClick={runAudit} style={{ background: '#8e44ad' }}>Run Fairness Audit</button>
        </div>
      </div>

      {auditResult && (
        <div className="card">
          <h3>Fairness Audit Results</h3>
          <p>{auditResult.audits_created} audit(s) created</p>
          {auditResult.retraining_triggers.length > 0 ? (
            <>
              <div className="alert error">⚠️ Disparity &gt;15% detected — model retraining triggered</div>
              {auditResult.retraining_triggers.map((t, i) => (
                <div key={i} style={{ marginBottom: '0.5rem' }}>
                  <span className="tag">{t.dimension}</span>
                  {t.groups} — disparity: <strong>{(t.disparity * 100).toFixed(1)}%</strong>
                </div>
              ))}
            </>
          ) : (
            <div className="alert success">✅ No significant disparity found. No retraining needed.</div>
          )}
        </div>
      )}
    </div>
  )
}
