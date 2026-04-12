import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ServerHealthContext } from './serverHealth.context'
import { checkServerHealth } from '../services/server.service'

const HEALTH_CHECK_INTERVAL_MS = 10000

export function ServerHealthProvider({ children }) {
  const [isHealthy, setIsHealthy] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const intervalRef = useRef(null)

  const runHealthCheck = useCallback(async () => {
    setIsChecking(true)

    try {
      const healthy = await checkServerHealth()
      setIsHealthy(healthy)
    } catch {
      setIsHealthy(false)
    } finally {
      setIsChecking(false)
    }
  }, [])

  useEffect(() => {
    runHealthCheck()

    intervalRef.current = window.setInterval(() => {
      runHealthCheck()
    }, HEALTH_CHECK_INTERVAL_MS)

    const handleOffline = () => {
      setIsHealthy(false)
      setIsChecking(false)
    }

    const handleOnline = () => {
      runHealthCheck()
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
      }
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [runHealthCheck])

  const value = useMemo(
    () => ({
      isHealthy,
      isChecking,
      isUnhealthy: !isHealthy,
      refreshHealth: runHealthCheck,
    }),
    [isHealthy, isChecking, runHealthCheck],
  )

  return <ServerHealthContext.Provider value={value}>{children}</ServerHealthContext.Provider>
}
