import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone: '', name: '', password: '', gender: '', state: '', language: 'en' })
  const [msg, setMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await authApi.register(form)
      setMsg('Registered! Please login.')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setMsg(err.response?.data?.detail || 'Registration failed')
    }
  }

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 460, margin: '3rem auto' }}>
        <h2 style={{ marginBottom: '1rem' }}>Create Account</h2>
        {msg && <div className="alert success">{msg}</div>}
        <form onSubmit={handleSubmit}>
          <label>Phone</label>
          <input value={form.phone} onChange={update('phone')} required />
          <label>Full Name</label>
          <input value={form.name} onChange={update('name')} required />
          <label>Password</label>
          <input type="password" value={form.password} onChange={update('password')} required />
          <label>Gender</label>
          <select value={form.gender} onChange={update('gender')}>
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <label>State</label>
          <input value={form.state} onChange={update('state')} placeholder="e.g. Maharashtra" />
          <label>Preferred Language</label>
          <select value={form.language} onChange={update('language')}>
            {['en','hi','ta','te','mr','bn','gu','kn','ml','or','pa','ur'].map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <button type="submit" style={{ width: '100%' }}>Register</button>
        </form>
      </div>
    </div>
  )
}
