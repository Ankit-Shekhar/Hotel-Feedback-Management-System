import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { Card, HotelCard, InputField, LuxuryButton, RatingStars, TextareaField } from '../../components/ui'
import { FetchingNotice, HotelCardSkeleton } from '../../components/common'
import Container from '../../components/layout/Container'
import { useToast } from '../../context/useToast'
import { getHotels, submitFeedback } from '../../services'
import { fadeInUp, hoverLift } from '../../utils/motion'

const createReviewForm = () => ({
  userName: '',
  email: '',
  contactNumber: '',
  suggestion: '',
  ratings: {
    overall: 0,
    food: 0,
    service: 0,
    ambience: 0,
  },
})

function HomePage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [reviewForm, setReviewForm] = useState(createReviewForm)
  const [reviewLoading, setReviewLoading] = useState(false)
  const heroImage = '/background.jfif'
  const galleryImages = ['/below1.jfif', '/below2.jfif', '/below3.jfif']
  const galleryCaptions = ['Subtle', 'Spacious', 'Premium']

  useEffect(() => {
    let active = true
    let retryTimeoutId

    const loadHotels = async () => {
      try {
        setLoading(true)
        const result = await getHotels()
        if (active) {
          setHotels(result)
          setError('')
          setLoading(false)
        }
      } catch (err) {
        if (active) {
          const message = err?.response?.data?.message || 'Unable to load hotels right now.'
          setError(message)
          retryTimeoutId = window.setTimeout(loadHotels, 4500)
        }
      }
    }

    loadHotels()

    return () => {
      active = false
      if (retryTimeoutId) {
        window.clearTimeout(retryTimeoutId)
      }
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

  const topRatedHotels = useMemo(() => {
    return [...hotels]
      .sort((a, b) => (b?.ratingsSummary?.overall || 0) - (a?.ratingsSummary?.overall || 0))
      .slice(0, 3)
  }, [hotels])

  const selectedHotel = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return null
    }

    return (
      hotels.find((hotel) => hotel?.name?.trim().toLowerCase() === query) ||
      (filteredHotels.length === 1 ? filteredHotels[0] : null)
    )
  }, [filteredHotels, hotels, search])

  useEffect(() => {
    setReviewForm(createReviewForm())
  }, [selectedHotel?._id])

  const updateReviewField = (field, value) => {
    setReviewForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const updateReviewRating = (field, value) => {
    setReviewForm((current) => ({
      ...current,
      ratings: {
        ...current.ratings,
        [field]: value,
      },
    }))
  }

  const handleReviewSubmit = async (event) => {
    event.preventDefault()

    if (!selectedHotel) {
      return
    }

    if (Object.values(reviewForm.ratings).some((value) => value < 1 || value > 5)) {
      showToast({
        title: 'Validation error',
        message: 'Please select all four ratings from 1 to 5 before submitting.',
        variant: 'error',
      })
      return
    }

    setReviewLoading(true)

    try {
      await submitFeedback({
        hotelId: selectedHotel._id,
        userName: reviewForm.userName,
        email: reviewForm.email,
        contactNumber: reviewForm.contactNumber,
        suggestion: reviewForm.suggestion,
        ratings: reviewForm.ratings,
      })

      showToast({
        title: 'Feedback submitted',
        message: 'Your review has been saved for this hotel.',
        variant: 'success',
      })

      setReviewForm(createReviewForm())
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to submit feedback right now.'
      showToast({ title: 'Submission failed', message, variant: 'error' })
    } finally {
      setReviewLoading(false)
    }
  }

  const handleLeaveFeedbackSearch = () => {
    const query = search.trim().toLowerCase()

    const matchedHotel =
      hotels.find((hotel) => hotel?.name?.trim().toLowerCase() === query) ||
      filteredHotels[0] ||
      null

    if (!matchedHotel?._id && !matchedHotel?.id) {
      showToast({
        title: 'Hotel not found',
        message: 'Please search for a valid hotel name first.',
        variant: 'error',
      })
      return
    }

    navigate(`/feedback?hotelId=${matchedHotel._id || matchedHotel.id}`)
  }

  return (
    <main className="relative overflow-hidden bg-primary text-ivory">
      <div className="absolute inset-0 z-0">
        <video
          className="h-full w-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={heroImage}
        >
          <source src="/backVideo.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(11,11,11,0.62)_0%,rgba(11,11,11,0.76)_100%),radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_24%)]" />
      <Container className="relative z-20 py-10 sm:py-14 lg:py-16">
        <Motion.section
          {...fadeInUp}
          className="relative overflow-hidden rounded-[3rem] border border-gold/20 bg-secondary/80 shadow-[0_25px_70px_rgba(0,0,0,0.35)]"
        >
          <img
            src={heroImage}
            alt="Luxury hotel interior"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.96]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,11,11,0.78)_0%,rgba(11,11,11,0.42)_45%,rgba(11,11,11,0.78)_100%),linear-gradient(180deg,rgba(11,11,11,0.22)_0%,rgba(11,11,11,0.75)_100%)]" />

          <div className="relative z-10 grid min-h-[92vh] gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.02fr_0.98fr] lg:px-12 lg:py-16 lg:items-end">
            <div className="space-y-7">
              <div className="inline-flex rounded-full border border-gold/30 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-goldSoft">
                Luxury hotel feedback system
              </div>

              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.32em] text-ivory/65">Refined Guest Intelligence</p>
                <h1 className="max-w-2xl text-4xl font-semibold leading-[1.03] text-ivory sm:text-5xl lg:text-6xl">
                  Discover refined hotel experiences.
                  <span className="mt-2 block text-goldSoft">Collect feedback with elegance.</span>
                </h1>
                <p className="max-w-2xl text-base leading-8 text-ivory/72 sm:text-lg">
                  Premium hotels, curated guest insights, and a polished feedback flow designed for modern hospitality teams. The page is image-led, spacious, and intentionally understated.
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
                <LuxuryButton type="button" onClick={handleLeaveFeedbackSearch} className="sm:min-w-44">
                  Leave Feedback
                </LuxuryButton>
              </div>

              {search.trim() ? (
                <Card className="max-h-64 overflow-auto border border-gold/18 bg-primary/58 p-3">
                  <p className="mb-2 text-xs uppercase tracking-[0.28em] text-goldSoft">Search results</p>
                  {filteredHotels.length === 0 ? (
                    <p className="text-sm text-ivory/65">No hotels found for this search.</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredHotels.map((hotel) => (
                        <Link
                          key={hotel._id || hotel.id || hotel.name}
                          to={`/feedback?hotelId=${hotel._id || hotel.id}`}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-ivory/85 transition hover:border-gold/35 hover:text-goldSoft"
                        >
                          <span>{hotel.name}</span>
                          <span className="text-xs text-ivory/55">
                            {hotel.city}, {hotel.state}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </Card>
              ) : null}

              <div className="flex flex-wrap gap-3">
                {['Premium curation', 'Fast feedback collection', 'Admin-ready reporting'].map((item) => (
                  <Card key={item} className="border border-gold/18 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.25em] text-goldSoft">{item}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Motion.section>

        <Motion.section {...fadeInUp} className="mt-8">
          <Card className="flex flex-col gap-4 border border-gold/20 bg-secondary/88 p-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.32em] text-goldSoft">Admin Access</p>
              <h2 className="text-2xl font-semibold text-ivory">Manage hotels and monitor guest sentiment.</h2>
              <p className="max-w-2xl text-sm leading-7 text-ivory/70">
                Login as admin to add or edit hotels, monitor recent feedback, and view rating analytics across all hospitality categories.
              </p>
            </div>
            <LuxuryButton
              as={Link}
              to="/admin-login"
              className="animate-[pulse_1.8s_ease-in-out_infinite] whitespace-nowrap"
            >
              Login as Admin
            </LuxuryButton>
          </Card>
        </Motion.section>

        {selectedHotel ? (
          <Motion.section {...fadeInUp} className="mt-24">
            <Card className="overflow-hidden border border-gold/20 bg-secondary/90 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
              <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative min-h-[360px] overflow-hidden rounded-[1.8rem]">
                  <img
                    src={selectedHotel.photoUrl || heroImage}
                    alt={selectedHotel.name}
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,11,0.08)_0%,rgba(11,11,11,0.64)_100%)]" />
                  <div className="absolute bottom-5 left-5 right-5 space-y-2">
                    <p className="text-xs uppercase tracking-[0.34em] text-goldSoft">Selected hotel</p>
                    <h2 className="text-3xl font-semibold text-ivory">{selectedHotel.name}</h2>
                    <p className="text-sm text-ivory/75">
                      {selectedHotel.city}, {selectedHotel.state}
                    </p>
                  </div>
                </div>

                <div className="space-y-5 rounded-[1.8rem] p-5 lg:p-8">
                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.32em] text-goldSoft">Review form</p>
                    <p className="text-sm leading-7 text-ivory/70">
                      Leave a review directly from the homepage for this hotel.
                    </p>
                  </div>

                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InputField
                        label="Name"
                        value={reviewForm.userName}
                        onChange={(event) => updateReviewField('userName', event.target.value)}
                        placeholder="Your name"
                        required
                      />
                      <InputField
                        label="Email (optional)"
                        type="email"
                        value={reviewForm.email}
                        onChange={(event) => updateReviewField('email', event.target.value)}
                        placeholder="guest@example.com"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <InputField
                        label="Contact number"
                        value={reviewForm.contactNumber}
                        onChange={(event) => updateReviewField('contactNumber', event.target.value)}
                        placeholder="Phone number"
                        required
                      />
                    </div>

                    <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2">
                      {[
                        ['overall', 'Overall experience'],
                        ['food', 'Food & dining'],
                        ['service', 'Service quality'],
                        ['ambience', 'Ambience & comfort'],
                      ].map(([key, label]) => (
                        <div key={key} className="space-y-2">
                          <span className="text-sm font-medium text-ivory/80">{label}</span>
                          <RatingStars value={reviewForm.ratings[key]} onChange={(value) => updateReviewRating(key, value)} />
                        </div>
                      ))}
                    </div>

                    <TextareaField
                      label="Suggestion"
                      value={reviewForm.suggestion}
                      onChange={(event) => updateReviewField('suggestion', event.target.value)}
                      placeholder="Share your experience or suggestion..."
                      maxLength={500}
                      required
                    />

                    <div className="flex justify-end">
                      <LuxuryButton type="submit" disabled={reviewLoading}>
                        {reviewLoading ? 'Submitting...' : 'Submit Review'}
                      </LuxuryButton>
                    </div>
                  </form>
                </div>
              </div>
            </Card>
          </Motion.section>
        ) : null}

        <Motion.section {...fadeInUp} className="mt-24 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <Card className="overflow-hidden border border-gold/20 bg-secondary/90 p-5">
            <div className="rounded-[1.5rem] border border-white/10 bg-primary/60 p-4">
              <img
                src={heroImage}
                alt="Luxury hotel interior detail"
                className="h-[440px] w-full rounded-[1.2rem] object-cover object-center opacity-[0.94]"
              />
            </div>
          </Card>

          <div className="space-y-5">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-goldSoft">Curated stays</p>
              <h2 className="mt-3 text-3xl font-semibold text-ivory sm:text-4xl">A gallery-style landing page with room to breathe.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-ivory/68">
              The layout flows in long, premium sections with image anchors instead of clustering all content in one area. Gold accents are concentrated on navigation and calls to action, making them feel more premium and deliberate.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Large hero imagery with subtle overlays',
                'Dedicated content sections with generous spacing',
                'More visible premium gold action buttons',
                'Editorial typography hierarchy for emphasis',
              ].map((item) => (
                <Card key={item} className="border border-gold/20 bg-white/5 p-4">
                  <p className="text-sm leading-7 text-ivory/75">{item}</p>
                </Card>
              ))}
            </div>
          </div>
        </Motion.section>

        <Motion.section {...fadeInUp} className="mt-24 space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-ivory">Available hotels</h2>
              <p className="text-sm text-ivory/60">Top 3 hotels by average overall rating.</p>
            </div>
            <Link to="/hotels" className="text-sm font-semibold text-goldSoft transition hover:text-gold">
              View all
            </Link>
          </div>

          {loading || error ? (
            <div className="space-y-4">
              <FetchingNotice message="The data is being fetched, kindly wait." />
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading hotel cards">
                {Array.from({ length: 6 }).map((_, index) => (
                  <HotelCardSkeleton key={`hotel-skeleton-${index}`} />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading hotel cards">
              {topRatedHotels.length === 0 ? (
                <Card className="col-span-full space-y-4 p-7 text-center">
                  <p className="text-xl font-semibold text-ivory">No hotels available yet.</p>
                  <p className="text-sm leading-7 text-ivory/65">
                    Ask admin to add hotels first so guests can start submitting reviews.
                  </p>
                  <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <LuxuryButton type="button" onClick={() => setSearch('')}>
                      Clear Search
                    </LuxuryButton>
                    <LuxuryButton as={Link} to="/feedback" className="border border-gold/30 bg-transparent text-gold hover:text-primary">
                      Go to Feedback
                    </LuxuryButton>
                  </div>
                </Card>
              ) : (
                topRatedHotels.map((hotel) => (
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
                ))
              )}
            </div>
          )}
        </Motion.section>

        <Motion.section {...fadeInUp} className="mt-24 space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-goldSoft">Visual gallery</p>
              <h2 className="mt-3 text-3xl font-semibold text-ivory sm:text-4xl">Three image moments that ground the landing page.</h2>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {galleryImages.map((imagePath, index) => (
              <Card key={imagePath} className={`overflow-hidden border border-gold/15 bg-secondary/85 p-4 ${index === 1 ? 'lg:translate-y-8' : ''}`}>
                <div className="relative overflow-hidden rounded-[1.4rem]">
                  <img
                    src={imagePath}
                    alt={`Luxury hotel detail ${index + 1}`}
                    className="h-[340px] w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/52 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full border border-gold/28 bg-primary/70 px-4 py-2 backdrop-blur-sm">
                    <p className="text-[0.68rem] uppercase tracking-[0.34em] text-goldSoft">{galleryCaptions[index]}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Motion.section>
      </Container>
    </main>
  )
}

export default HomePage

