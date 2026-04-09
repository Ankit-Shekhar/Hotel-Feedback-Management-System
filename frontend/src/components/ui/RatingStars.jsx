import { useState } from 'react'

function RatingStars({
  value,
  rating = 0,
  onChange,
  max = 5,
  disabled = false,
  className = '',
}) {
  const [hoverValue, setHoverValue] = useState(0)
  const selectedValue = value ?? rating

  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      role="radiogroup"
      aria-label={`Rating: ${selectedValue} out of ${max}`}
      aria-valuemin={1}
      aria-valuemax={max}
      aria-valuenow={selectedValue}
    >
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1
        const activeValue = hoverValue || selectedValue
        const active = starValue <= activeValue

        return (
          <button
            key={starValue}
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(starValue)}
            onMouseEnter={() => setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(0)}
            className={`text-2xl leading-none transition duration-200 disabled:cursor-default ${
              active ? 'text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.35)]' : 'text-white/20'
            }`}
            aria-label={`Set rating to ${starValue}`}
            aria-checked={starValue === selectedValue}
            role="radio"
          >
            ★
          </button>
        )
      })}
    </div>
  )
}

export default RatingStars


