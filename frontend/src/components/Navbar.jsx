import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        TrustCircle
      </Link>

      {user ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/circles">Circles</Link>
          <Link to="/trust-score">Trust Score</Link>
          <Link to="/consent">Consent</Link>
          <Link to="/facilitator">Facilitator</Link>

          <button
            onClick={logout}
            className="btn logout-btn"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="ml-auto">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  )
}