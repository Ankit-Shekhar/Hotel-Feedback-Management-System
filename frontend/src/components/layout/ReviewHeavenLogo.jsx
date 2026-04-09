function ReviewHeavenLogo({ className = '' }) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="21" cy="21" r="18.5" stroke="#D8BB74" strokeOpacity="0.9" strokeWidth="1.6" />
        <circle cx="21" cy="21" r="12.8" stroke="#E7D8AA" strokeOpacity="0.75" strokeWidth="1.1" />
        <path d="M12.5 24C14.8 17.5 18.2 14.5 21 14.5C23.8 14.5 27.2 17.5 29.5 24" stroke="#D8BB74" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M16 24.5C17.3 20.3 19.1 18.5 21 18.5C22.9 18.5 24.7 20.3 26 24.5" stroke="#E7D8AA" strokeWidth="0.95" strokeLinecap="round" />
      </svg>
      <div className="leading-none">
        <div className="text-[1.08rem] font-semibold tracking-[0.28em] text-transparent" style={{ WebkitTextStroke: '1px #D8BB74' }}>
          REVIEW HEAVEN
        </div>
        <div className="mt-1 text-[0.58rem] uppercase tracking-[0.34em] text-goldSoft/75">
          Luxury Hospitality Reviews
        </div>
      </div>
    </div>
  )
}

export default ReviewHeavenLogo
