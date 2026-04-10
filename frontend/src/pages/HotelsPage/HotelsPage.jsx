import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { Card, HotelCard, LuxuryButton } from '../../components/ui'
import { HotelCardSkeleton } from '../../components/common'
import Container from '../../components/layout/Container'
import { useToast } from '../../context/useToast'
import { getHotels } from '../../services'
import { fadeInUp, hoverLift } from '../../utils/motion'

function HotelsPage() {
  const { showToast } = useToast()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadHotels = async () => {
      try {
        setLoading(true)
        setError('')
        const result = await getHotels()

        if (active) {
          setHotels(result)
        }
      } catch (err) {
        if (active) {
          const message = err?.response?.data?.message || 'Unable to load hotels right now.'
          setError(message)
          showToast({ title: 'Hotels load failed', message, variant: 'error' })
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadHotels()

    return () => {
      active = false
    }
  }, [showToast])

  return (
    <main className="bg-primary text-ivory">
      <Container className="py-10 sm:py-14 lg:py-16">
        <Motion.section {...fadeInUp} className="mb-8 space-y-4">
          <div className="inline-flex rounded-full border border-gold/25 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-goldSoft">
            All hotels
          </div>
          <h1 className="text-4xl font-semibold sm:text-5xl">Browse every listed hotel.</h1>
          <p className="max-w-3xl text-base leading-7 text-ivory/70">
            Click any card to open that hotel&apos;s feedback page.
          </p>
          <div>
            <LuxuryButton as={Link} to="/" className="border border-gold/30 bg-transparent text-gold hover:text-primary">
              Back to Home
            </LuxuryButton>
          </div>
        </Motion.section>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading hotel cards">
            {Array.from({ length: 6 }).map((_, index) => (
              <HotelCardSkeleton key={`all-hotels-skeleton-${index}`} />
            ))}
          </div>
        ) : error ? (
          <Card className="border border-red-400/20 bg-red-500/10 p-6 text-red-100">{error}</Card>
        ) : hotels.length === 0 ? (
          <Card className="space-y-4 p-7 text-center">
            <p className="text-xl font-semibold text-ivory">No hotels available yet.</p>
            <p className="text-sm leading-7 text-ivory/65">Ask admin to add hotels first.</p>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {hotels.map((hotel) => (
              <Motion.div key={hotel._id || hotel.id || hotel.name} {...hoverLift}>
                <Link to={`/feedback?hotelId=${hotel._id || hotel.id}`} className="block">
                  <HotelCard
                    hotel={{
                      name: hotel.name,
                      location: [hotel.city, hotel.state].filter(Boolean).join(', '),
                      rating: hotel.ratingsSummary?.overall || 0,
                      photoUrl: hotel.photoUrl,
                      description: `Total reviews: ${hotel.totalReviews || 0}`,
                    }}
                  />
                </Link>
              </Motion.div>
            ))}
          </div>
        )}
      </Container>
    </main>
  )
}

export default HotelsPage
