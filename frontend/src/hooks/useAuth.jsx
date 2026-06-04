import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  // If stored user has no id (old format), re-fetch from /auth/me
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && user && !user.id) {
      api.get('/auth/me').then(({ data: me }) => {
        const userData = { id: me.id, phone: me.phone_number, name: me.full_name }
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
      }).catch(() => {})
    }
  }, [])

  async function login(phone, password) {
    const res = await authApi.login(phone, password)
    const token = res.data.access_token
    localStorage.setItem('token', token)
    const { data: me } = await api.get('/auth/me')
    const userData = { id: me.id, phone: me.phone_number, name: me.full_name }
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
