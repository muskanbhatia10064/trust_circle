import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone: '', password: '' })
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await login(form.phone, form.password)
      navigate('/dashboard')
    } catch {
      setError('Invalid phone or password')
    }
  }

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 420, margin: '4rem auto' }}>
        <h2 style={{ marginBottom: '1rem' }}>Login to TrustCircle</h2>
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Phone Number</label>
          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          <label>Password</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button type="submit" style={{ width: '100%' }}>Login</button>
        </form>
      </div>
    </div>
  )
}
