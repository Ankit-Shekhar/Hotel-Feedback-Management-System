import { useServerHealth } from '../../context/useServerHealth'
import ServerStatusBadge from './ServerStatusBadge'

function GlobalServerStatus() {
  const { isHealthy } = useServerHealth()

  return (
    <div className="pointer-events-none fixed right-3 top-[88px] z-[150] sm:right-5 sm:top-[96px]">
      <ServerStatusBadge isHealthy={isHealthy} showWhenHealthy={false} />
    </div>
  )
}

export default GlobalServerStatus
