import { useMemo, useState } from 'react'
import { AuthContext } from './auth.context'
import { ADMIN_TOKEN_KEY } from '../utils/constants'

function decodeTokenPayload(token) {
  if (!token) {
    return null
  }

  try {
    const payloadPart = token.split('.')[1]
    if (!payloadPart) {
      return null
    }

    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = window.atob(normalized)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

function readStoredToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStoredToken())
  const tokenPayload = useMemo(() => decodeTokenPayload(token), [token])
  const role = tokenPayload?.role || null
  const isSuperAdmin = role === 'super-admin'

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      role,
      isSuperAdmin,
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
    [token, role, isSuperAdmin],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

