import RatingStars from './RatingStars'

function HotelCard({ hotel }) {
  if (!hotel) {
    return null
  }

  const {
    name = 'Hotel Name',
    location = 'Location pending',
    rating = 0,
    description = 'Premium hospitality experience with curated services and refined comfort.',
    photoUrl = '',
  } = hotel

  return (
    <article className="group rounded-3xl border border-white/10 bg-secondary/90 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_20px_50px_rgba(212,175,55,0.12)]">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-primary/50">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="h-52 w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-52 items-center justify-center bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.2),transparent_55%)] text-sm uppercase tracking-[0.3em] text-ivory/45">
              No photo available
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-ivory">{name}</h3>
          <p className="text-sm text-ivory/60">{location}</p>
        </div>
        <p className="text-sm leading-6 text-ivory/75">{description}</p>
        <RatingStars value={rating} />
      </div>
    </article>
  )
}

export default HotelCard

