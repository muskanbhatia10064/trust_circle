import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { trustApi, circleApi } from '../services/api'

export default function Dashboard() {
  const [score, setScore] = useState(null)
  const [circles, setCircles] = useState([])

  useEffect(() => {
    trustApi.getMyScore().then(r => setScore(r.data)).catch(() => {})
    circleApi.list().then(r => setCircles(r.data)).catch(() => {})
  }, [])

  return (
    <div className="page">
      <h1 style={{ marginBottom: '1.5rem' }}>Dashboard</h1>

      <div className="card">
        <h3>My Trust Score</h3>
        {score ? (
          <div className="score-badge">{score.score}</div>
        ) : (
          <p>No score yet. <Link to="/trust-score">Compute now →</Link></p>
        )}
        {score && <small style={{ color: '#666' }}>Last updated: {new Date(score.computed_at).toLocaleDateString()}</small>}
      </div>

      <div className="card">
        <h3>My Circles <Link to="/circles" style={{ fontSize: '0.85rem', marginLeft: '1rem' }}>View all →</Link></h3>
        {circles.length === 0 ? (
          <p>You're not in any circle yet. <Link to="/circles">Join or create one →</Link></p>
        ) : (
          circles.map(c => (
            <div key={c.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
              <strong>{c.name}</strong>
              <span className="tag" style={{ marginLeft: '0.5rem' }}>{c.status}</span>
              <span style={{ float: 'right', color: '#0f3460' }}>₹{c.pool_balance} pool</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
