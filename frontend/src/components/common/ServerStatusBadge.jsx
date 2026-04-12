function ServerStatusBadge({
  isHealthy,
  showWhenHealthy = true,
  className = '',
}) {
  if (!showWhenHealthy && isHealthy) {
    return null
  }

  const message = isHealthy
    ? 'Server status : Healthy'
    : 'Server is being initialized. Kindly wait!'

  const ringClass = isHealthy
    ? 'border-emerald-300/35 border-t-emerald-400'
    : 'border-red-300/35 border-t-red-500 animate-spin'

  const dotClass = isHealthy ? 'bg-emerald-500' : 'bg-red-500'

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-secondary/90 px-3 py-2 text-xs sm:text-sm text-ivory/90 backdrop-blur ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className={`relative inline-flex h-5 w-5 items-center justify-center rounded-full border-2 ${ringClass}`}>
        <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      </span>
      <span>{message}</span>
    </div>
  )
}

export default ServerStatusBadge
