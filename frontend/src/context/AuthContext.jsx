import { useMemo, useState } from 'react'
import { AuthContext } from './auth.context'

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated: Boolean(admin),
      login: setAdmin,
      logout: () => setAdmin(null),
    }),
    [admin],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
