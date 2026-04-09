function RatingStars({ rating = 0 }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'text-amber-500' : 'text-slate-300'}>
          ★
        </span>
      ))}
    </div>
  )
}

export default RatingStars
