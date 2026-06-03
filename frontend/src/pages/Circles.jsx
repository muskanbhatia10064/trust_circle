import { useEffect, useState } from 'react'
import { circleApi } from '../services/api'

export default function Circles() {
  const [circles, setCircles] = useState([])
  const [form, setForm] = useState({ name: '', contribution_amount: '', cycle_days: 30 })
  const [joinId, setJoinId] = useState('')
  const [contribution, setContribution] = useState({ circle_id: '', amount: '' })
  const [msg, setMsg] = useState('')

  const load = () => circleApi.list().then(r => setCircles(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const notify = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  async function createCircle(e) {
    e.preventDefault()
    await circleApi.create({ ...form, contribution_amount: parseFloat(form.contribution_amount) })
    notify('Circle created!')
    load()
  }

  async function joinCircle(e) {
    e.preventDefault()
    await circleApi.join(joinId)
    notify('Joined circle!')
    load()
  }

  async function contribute(e) {
    e.preventDefault()
    const r = await circleApi.contribute(contribution.circle_id, parseFloat(contribution.amount))
    notify(`Contributed! Pool: ₹${r.data.pool_balance} | Reinsurance: ₹${r.data.reinsurance_balance}`)
    load()
  }

  return (
    <div className="page">
      <h1 style={{ marginBottom: '1.5rem' }}>My Circles</h1>
      {msg && <div className="alert success">{msg}</div>}

      <div className="card">
        <h3>My Active Circles</h3>
        {circles.length === 0 ? <p>No circles yet.</p> : circles.map(c => (
          <div key={c.id} style={{ padding: '0.6rem 0', borderBottom: '1px solid #eee' }}>
            <strong>{c.name}</strong>
            <span className="tag">{c.status}</span>
            <span style={{ float: 'right' }}>Pool: ₹{c.pool_balance} | Buffer: ₹{c.reinsurance_balance}</span>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>ID: {c.id} | ₹{c.contribution_amount}/cycle</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="card">
          <h3>Create Circle</h3>
          <form onSubmit={createCircle}>
            <label>Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <label>Monthly Contribution (₹)</label>
            <input type="number" value={form.contribution_amount} onChange={e => setForm({ ...form, contribution_amount: e.target.value })} required />
            <label>Cycle Days</label>
            <input type="number" value={form.cycle_days} onChange={e => setForm({ ...form, cycle_days: +e.target.value })} />
            <button type="submit">Create</button>
          </form>
        </div>

        <div className="card">
          <h3>Join a Circle</h3>
          <form onSubmit={joinCircle}>
            <label>Circle ID</label>
            <input value={joinId} onChange={e => setJoinId(e.target.value)} required />
            <button type="submit">Join</button>
          </form>

          <h3 style={{ marginTop: '1.5rem' }}>Pay Contribution</h3>
          <form onSubmit={contribute}>
            <label>Circle ID</label>
            <input value={contribution.circle_id} onChange={e => setContribution({ ...contribution, circle_id: e.target.value })} required />
            <label>Amount (₹)</label>
            <input type="number" value={contribution.amount} onChange={e => setContribution({ ...contribution, amount: e.target.value })} required />
            <button type="submit">Pay</button>
          </form>
        </div>
      </div>
    </div>
  )
}
