function SkeletonBlock({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-gold/35 bg-gradient-to-r from-white/20 via-gold/30 to-white/20 shadow-[0_0_0_1px_rgba(212,175,55,0.15)] ${className}`}
      aria-hidden="true"
    />
  )
}

export default SkeletonBlock
