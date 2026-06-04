import { createContext, useContext, useState } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  async function login(phone, password) {
    const res = await authApi.login(phone, password)
    const token = res.data.access_token
    localStorage.setItem('token', token)
    // Fetch full user profile to get id
    const { data: me } = await import('../services/api').then(m => m.default.get('/auth/me'))
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
