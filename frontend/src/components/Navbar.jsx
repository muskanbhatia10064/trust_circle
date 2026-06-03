import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav>
      <Link to="/" style={{ fontWeight: 700, fontSize: '1.1rem' }}>🔵 TrustCircle</Link>
      {user ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/circles">Circles</Link>
          <Link to="/trust-score">Trust Score</Link>
          <Link to="/consent">Consent</Link>
          <Link to="/facilitator">Facilitator</Link>
          <button onClick={logout} style={{ marginLeft: 'auto' }} className="danger">Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginLeft: 'auto' }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  )
}
