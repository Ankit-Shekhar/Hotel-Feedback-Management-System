import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, HotelCard, InputField, LuxuryButton } from '../../components/ui'
import Container from '../../components/layout/Container'
import { getHotels } from '../../services'
import { fadeInUp, hoverLift } from '../../utils/motion'

function HomePage() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

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
          setError(err?.response?.data?.message || 'Unable to load hotels right now.')
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
  }, [])

  const filteredHotels = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return hotels
    }

    return hotels.filter((hotel) => {
      const searchable = [hotel?.name, hotel?.city, hotel?.state].join(' ').toLowerCase()
      return searchable.includes(query)
    })
  }, [hotels, search])

  return (
    <main className="relative overflow-hidden bg-primary text-ivory">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_24%)]" />
      <Container className="relative py-10 sm:py-14 lg:py-16">
        <motion.section {...fadeInUp} className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-gold/30 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-goldSoft">
              Luxury hotel feedback system
            </div>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-ivory sm:text-5xl lg:text-6xl">
                Discover refined hotel experiences and collect feedback with elegance.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-ivory/70 sm:text-lg">
                Premium hotels, curated guest insights, and a polished feedback flow designed for modern hospitality teams.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <InputField
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by hotel, city, or state"
                  aria-label="Search hotels"
                />
              </div>
              <LuxuryButton as={Link} to="/feedback" className="sm:min-w-44">
                Leave Feedback
              </LuxuryButton>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {['Premium curation', 'Fast feedback collection', 'Admin-ready reporting'].map((item) => (
                <Card key={item} className="bg-white/5 p-4">
                  <p className="text-sm text-ivory/70">{item}</p>
                </Card>
              ))}
            </div>
          </div>

          <motion.div {...hoverLift} className="rounded-[2rem] border border-gold/20 bg-secondary/90 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-goldSoft">Featured experience</p>
              <h2 className="text-3xl font-semibold text-ivory">A premium system for hotel discovery and guest sentiment.</h2>
              <p className="text-sm leading-7 text-ivory/70">
                Build trust through a luxury interface that feels polished, calm, and fast.
              </p>
            </div>
          </motion.div>
        </motion.section>

        <motion.section {...fadeInUp} className="mt-12 space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-ivory">Available hotels</h2>
              <p className="text-sm text-ivory/60">Browse live hotel listings from the API.</p>
            </div>
            <p className="text-sm text-ivory/60">{filteredHotels.length} result(s)</p>
          </div>

          {loading ? (
            <Card className="p-6 text-ivory/70">Loading hotels...</Card>
          ) : error ? (
            <Card className="border-red-400/20 bg-red-500/10 p-6 text-red-100">{error}</Card>
          ) : filteredHotels.length === 0 ? (
            <Card className="p-6 text-ivory/70">No hotels matched your search.</Card>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredHotels.map((hotel) => (
                <motion.div key={hotel._id || hotel.id || hotel.name} {...hoverLift}>
                  <HotelCard
                    hotel={{
                      name: hotel.name,
                      location: [hotel.city, hotel.state].filter(Boolean).join(', '),
                      rating: hotel.ratingsSummary?.overall || 0,
                      description: `Total reviews: ${hotel.totalReviews || 0}`,
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </Container>
    </main>
  )
}

export default HomePage

