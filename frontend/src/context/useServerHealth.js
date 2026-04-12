import { useContext } from 'react'
import { ServerHealthContext } from './serverHealth.context'

export function useServerHealth() {
  const context = useContext(ServerHealthContext)

  if (!context) {
    throw new Error('useServerHealth must be used within ServerHealthProvider')
  }

  return context
}
