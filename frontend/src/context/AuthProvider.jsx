import { useMemo, useState } from 'react'
import { AuthContext } from './auth.context'
import { ADMIN_TOKEN_KEY } from '../utils/constants'

function readStoredToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStoredToken())

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login: (nextToken) => {
        setToken(nextToken)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(ADMIN_TOKEN_KEY, nextToken)
        }
      },
      logout: () => {
        setToken(null)
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(ADMIN_TOKEN_KEY)
        }
      },
    }),
    [token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

