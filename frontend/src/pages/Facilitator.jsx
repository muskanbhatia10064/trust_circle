import { useState } from 'react'
import { facilitatorApi } from '../services/api'

export default function Facilitator() {
  const [member, setMember] = useState({ phone: '', name: '', circle_id: '' })
  const [proxy, setProxy] = useState({ member_phone: '', circle_id: '', amount: '' })
  const [msg, setMsg] = useState('')

  const notify = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  async function addMember(e) {
    e.preventDefault()
    try {
      await facilitatorApi.addMember(member)
      notify('Offline member added to circle!')
    } catch (err) {
      notify(err.response?.data?.detail || 'Error adding member')
    }
  }

  async function contribute(e) {
    e.preventDefault()
    try {
      const r = await facilitatorApi.proxyContribute({ ...proxy, amount: parseFloat(proxy.amount) })
      notify(`Proxy contribution recorded. Net to pool: ₹${r.data.net_to_pool}`)
    } catch (err) {
      notify(err.response?.data?.detail || 'Error recording contribution')
    }
  }

  return (
    <div className="page">
      <h1 style={{ marginBottom: '0.5rem' }}>NGO Facilitator Mode</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>Manage offline / feature-phone members on their behalf</p>
      {msg && <div className="alert success">{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card">
          <h3>Add Offline Member</h3>
          <form onSubmit={addMember}>
            <label>Member Phone</label>
            <input value={member.phone} onChange={e => setMember({ ...member, phone: e.target.value })} required />
            <label>Member Name</label>
            <input value={member.name} onChange={e => setMember({ ...member, name: e.target.value })} required />
            <label>Circle ID</label>
            <input value={member.circle_id} onChange={e => setMember({ ...member, circle_id: e.target.value })} required />
            <button type="submit">Add Member</button>
          </form>
        </div>

        <div className="card">
          <h3>Record Cash Contribution</h3>
          <form onSubmit={contribute}>
            <label>Member Phone</label>
            <input value={proxy.member_phone} onChange={e => setProxy({ ...proxy, member_phone: e.target.value })} required />
            <label>Circle ID</label>
            <input value={proxy.circle_id} onChange={e => setProxy({ ...proxy, circle_id: e.target.value })} required />
            <label>Amount (₹)</label>
            <input type="number" value={proxy.amount} onChange={e => setProxy({ ...proxy, amount: e.target.value })} required />
            <button type="submit">Record</button>
          </form>
        </div>
      </div>
    </div>
  )
}
