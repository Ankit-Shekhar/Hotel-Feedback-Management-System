function FetchingNotice({
  message = 'The data is being fetched, kindly wait.',
  className = '',
}) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl border border-gold/20 bg-secondary/80 px-4 py-3 text-sm text-ivory/90 ${className}`} role="status" aria-live="polite">
      <span className="h-5 w-5 rounded-full border-2 border-white/20 border-t-gold animate-[spin_0.35s_linear_infinite]" />
      <span>{message}</span>
    </div>
  )
}

export default FetchingNotice
