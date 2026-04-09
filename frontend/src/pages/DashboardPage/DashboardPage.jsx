import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Card, InputField, LuxuryButton } from '../../components/ui'
import { DashboardChart, SkeletonBlock } from '../../components/common'
import { Sidebar, Container } from '../../components/layout'
import { useToast } from '../../context/useToast'
import { addHotel, getDashboardStats, getHotels, getRecentFeedbacks, updateHotel } from '../../services'
import { fadeInUp, hoverLift } from '../../utils/motion'

function DashboardPage() {
  const { showToast } = useToast()
  const [stats, setStats] = useState(null)
  const [recentFeedbacks, setRecentFeedbacks] = useState([])
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [addingHotel, setAddingHotel] = useState(false)
  const [error, setError] = useState('')
  const [hotelForm, setHotelForm] = useState({
    name: '',
    city: '',
    state: '',
  })
  const [hotelPhoto, setHotelPhoto] = useState(null)
  const [hotelPhotoPreview, setHotelPhotoPreview] = useState('')
  const [editHotelId, setEditHotelId] = useState('')
  const [editForm, setEditForm] = useState({ name: '', city: '', state: '' })
  const [updatingHotel, setUpdatingHotel] = useState(false)

  useEffect(() => {
    let active = true

    const loadDashboard = async () => {
      const loadStart = Date.now()

      try {
        setLoading(true)
        setError('')

        const [statsResult, recentResult, hotelsResult] = await Promise.all([
          getDashboardStats(),
          getRecentFeedbacks(10),
          getHotels(),
        ])

        if (active) {
          setStats(statsResult)
          setRecentFeedbacks(recentResult)
          setHotels(hotelsResult)
        }
      } catch (err) {
        if (active) {
          const message = err?.response?.data?.message || 'Unable to load dashboard data.'
          setError(message)
          showToast({ title: 'Dashboard load failed', message, variant: 'error' })
        }
      } finally {
        const elapsed = Date.now() - loadStart
        const minimumLoaderMs = 700
        if (elapsed < minimumLoaderMs) {
          await new Promise((resolve) => {
            window.setTimeout(resolve, minimumLoaderMs - elapsed)
          })
        }

        if (active) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [showToast])

  useEffect(() => {
    return () => {
      if (hotelPhotoPreview) {
        window.URL.revokeObjectURL(hotelPhotoPreview)
      }
    }
  }, [hotelPhotoPreview])

  useEffect(() => {
    if (!editHotelId && hotels.length > 0) {
      setEditHotelId(hotels[0]._id)
    }
  }, [editHotelId, hotels])

  useEffect(() => {
    const selectedHotel = hotels.find((hotel) => hotel._id === editHotelId)
    if (!selectedHotel) {
      return
    }

    setEditForm({
      name: selectedHotel.name || '',
      city: selectedHotel.city || '',
      state: selectedHotel.state || '',
    })
  }, [editHotelId, hotels])

  const handleHotelPhotoChange = (event) => {
    const file = event.target.files?.[0] || null

    if (hotelPhotoPreview) {
      window.URL.revokeObjectURL(hotelPhotoPreview)
    }

    setHotelPhoto(file)
    setHotelPhotoPreview(file ? window.URL.createObjectURL(file) : '')
  }

  const handleHotelSubmit = async (event) => {
    event.preventDefault()

    if (!hotelPhoto) {
      showToast({ title: 'Photo required', message: 'Please choose a hotel photo.', variant: 'error' })
      return
    }

    setAddingHotel(true)

    try {
      const payload = new FormData()
      payload.append('name', hotelForm.name)
      payload.append('city', hotelForm.city)
      payload.append('state', hotelForm.state)
      payload.append('photo', hotelPhoto)

      await addHotel(payload)

      showToast({
        title: 'Hotel added',
        message: 'The hotel is now available on the homepage list.',
        variant: 'success',
      })

      setHotelForm({ name: '', city: '', state: '' })
      setHotelPhoto(null)

      if (hotelPhotoPreview) {
        window.URL.revokeObjectURL(hotelPhotoPreview)
      }
      setHotelPhotoPreview('')

      const refreshedHotels = await getHotels()
      setHotels(refreshedHotels)
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to add hotel.'
      showToast({ title: 'Add hotel failed', message, variant: 'error' })
    } finally {
      setAddingHotel(false)
    }
  }

  const chartData = useMemo(() => {
    if (!stats?.averageRatings) {
      return []
    }

    return [
      { label: 'Overall', value: stats.averageRatings.overall || 0 },
      { label: 'Food', value: stats.averageRatings.food || 0 },
      { label: 'Service', value: stats.averageRatings.service || 0 },
      { label: 'Ambience', value: stats.averageRatings.ambience || 0 },
    ]
  }, [stats])

  const handleEditSubmit = async (event) => {
    event.preventDefault()

    if (!editHotelId) {
      showToast({ title: 'Select a hotel', message: 'Choose a hotel to edit first.', variant: 'error' })
      return
    }

    setUpdatingHotel(true)

    try {
      await updateHotel(editHotelId, {
        name: editForm.name,
        city: editForm.city,
        state: editForm.state,
      })

      showToast({ title: 'Hotel updated', message: 'Hotel details were updated successfully.', variant: 'success' })

      const refreshedHotels = await getHotels()
      setHotels(refreshedHotels)
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to update hotel.'
      showToast({ title: 'Update failed', message, variant: 'error' })
    } finally {
      setUpdatingHotel(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-132px)] bg-primary text-ivory">
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <Container className="flex-1 py-8">
          <motion.section {...fadeInUp} className="mb-8 grid gap-6 rounded-[2rem] border border-gold/15 bg-secondary/90 p-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-3">
              <div className="inline-flex rounded-full border border-gold/25 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-goldSoft">
                Add hotel
              </div>
              <h2 className="text-3xl font-semibold text-ivory">Create a hotel with photo upload</h2>
              <p className="max-w-xl text-sm leading-7 text-ivory/70">
                Add a hotel from the admin panel with its name, city, state, and image. The homepage will pick it up from the API.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {hotels.slice(0, 3).map((hotel) => (
                  <Card key={hotel._id} className="overflow-hidden border-white/10 p-3">
                    {hotel.photoUrl ? (
                      <img src={hotel.photoUrl} alt={hotel.name} className="h-28 w-full rounded-2xl object-cover" />
                    ) : (
                      <div className="flex h-28 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.18),transparent_55%)] text-xs uppercase tracking-[0.25em] text-ivory/45">
                        No photo
                      </div>
                    )}
                    <p className="mt-3 text-sm font-semibold text-ivory">{hotel.name}</p>
                    <p className="text-xs text-ivory/55">
                      {hotel.city}, {hotel.state}
                    </p>
                  </Card>
                ))}
              </div>
            </div>

            <form onSubmit={handleHotelSubmit} className="space-y-4 rounded-[1.5rem] border border-white/10 bg-primary/50 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Hotel name"
                  value={hotelForm.name}
                  onChange={(event) => setHotelForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="e.g. The Grand Aurelia"
                  required
                />
                <InputField
                  label="City"
                  value={hotelForm.city}
                  onChange={(event) => setHotelForm((current) => ({ ...current, city: event.target.value }))}
                  placeholder="e.g. Jaipur"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="State"
                  value={hotelForm.state}
                  onChange={(event) => setHotelForm((current) => ({ ...current, state: event.target.value }))}
                  placeholder="e.g. Rajasthan"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_1.1fr]">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-ivory/80">Hotel photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHotelPhotoChange}
                    className="w-full rounded-2xl border border-white/10 bg-secondary px-4 py-3 text-sm text-ivory file:mr-4 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary"
                    required
                  />
                </label>
              </div>

              {hotelPhotoPreview ? (
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <img src={hotelPhotoPreview} alt="Hotel preview" className="h-52 w-full object-cover" />
                </div>
              ) : null}

              <div className="flex justify-end">
                <LuxuryButton type="submit" disabled={addingHotel}>
                  {addingHotel ? 'Adding hotel...' : 'Add hotel'}
                </LuxuryButton>
              </div>
            </form>
          </motion.section>

          <motion.section {...fadeInUp} className="mb-8 grid gap-6 rounded-[2rem] border border-white/10 bg-secondary/90 p-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-3">
              <div className="inline-flex rounded-full border border-gold/25 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-goldSoft">
                Edit hotel
              </div>
              <h2 className="text-3xl font-semibold text-ivory">Update hotel name, city, or state</h2>
              <p className="max-w-xl text-sm leading-7 text-ivory/70">
                Select a hotel you have added and update its name, city, or state. Leave a field blank to keep it unchanged.
              </p>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 rounded-[1.5rem] border border-white/10 bg-primary/50 p-5">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-ivory/80">Select hotel</span>
                <select
                  value={editHotelId}
                  onChange={(event) => setEditHotelId(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-secondary px-4 py-3 text-sm text-ivory outline-none transition focus:border-gold focus:shadow-[0_0_0_4px_rgba(212,175,55,0.12)]"
                >
                  {hotels.map((hotel) => (
                    <option key={hotel._id} value={hotel._id} className="bg-secondary">
                      {hotel.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Hotel name"
                  value={editForm.name}
                  onChange={(event) => setEditForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Updated hotel name"
                />
                <InputField
                  label="City"
                  value={editForm.city}
                  onChange={(event) => setEditForm((current) => ({ ...current, city: event.target.value }))}
                  placeholder="Updated city"
                />
              </div>
              <InputField
                label="State"
                value={editForm.state}
                onChange={(event) => setEditForm((current) => ({ ...current, state: event.target.value }))}
                placeholder="Updated state"
              />

              <div className="flex justify-end">
                <LuxuryButton type="submit" disabled={updatingHotel}>
                  {updatingHotel ? 'Updating...' : 'Update hotel'}
                </LuxuryButton>
              </div>
            </form>
          </motion.section>

          <motion.section {...fadeInUp} className="mb-8 space-y-3">
            <div className="inline-flex rounded-full border border-gold/25 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-goldSoft">
              Admin dashboard
            </div>
            <h1 className="text-4xl font-semibold">Feedback analytics overview</h1>
            <p className="max-w-3xl text-sm leading-7 text-ivory/70">
              Track hotel volume, feedback count, and average category ratings from a refined dashboard interface.
            </p>
          </motion.section>

          {loading ? (
            <div className="space-y-8" aria-label="Loading dashboard content">
              <section className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card key={`dash-stat-skeleton-${index}`} className="space-y-3 p-5">
                    <SkeletonBlock className="h-4 w-2/5" />
                    <SkeletonBlock className="h-10 w-1/2" />
                  </Card>
                ))}
              </section>
              <Card className="space-y-4 p-5">
                <SkeletonBlock className="h-6 w-1/3" />
                <SkeletonBlock className="h-64 w-full" />
              </Card>
              <Card className="space-y-4 p-5">
                <SkeletonBlock className="h-6 w-1/3" />
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonBlock key={`recent-skeleton-${index}`} className="h-20 w-full" />
                ))}
              </Card>
            </div>
          ) : error ? (
            <Card className="border-red-400/20 bg-red-500/10 p-4 text-red-100">{error}</Card>
          ) : (
            <div className="space-y-8">
              <section className="grid gap-4 md:grid-cols-3">
                {[
                  { label: 'Total hotels', value: stats?.totalHotels || 0 },
                  { label: 'Total feedbacks', value: stats?.totalFeedbacks || 0 },
                  { label: 'Average overall', value: stats?.averageRatings?.overall || 0 },
                ].map((item) => (
                  <motion.div key={item.label} {...hoverLift}>
                    <Card className="h-full border-gold/10 p-5">
                      <p className="text-sm text-ivory/60">{item.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-ivory">{item.value}</p>
                    </Card>
                  </motion.div>
                ))}
              </section>

              <DashboardChart title="Average ratings by category" data={chartData} xKey="label" yKey="value" />

              <section className="space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-ivory">Recent feedback</h2>
                  <p className="text-sm text-ivory/60">Latest guest submissions across the system.</p>
                </div>

                <div className="grid gap-4">
                  {recentFeedbacks.length === 0 ? (
                    <Card className="space-y-4 p-6 text-center">
                      <p className="text-xl font-semibold text-ivory">No recent feedback yet.</p>
                      <p className="text-sm leading-7 text-ivory/65">
                        Once guests submit reviews, the latest entries will appear here with category ratings.
                      </p>
                      <div>
                        <Link
                          to="/feedback"
                          className="inline-flex rounded-full border border-gold/40 px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold hover:text-primary"
                        >
                          Open Feedback Form
                        </Link>
                      </div>
                    </Card>
                  ) : (
                    recentFeedbacks.map((feedback) => (
                      <Card key={feedback._id} className="border-white/10 p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-2">
                            <div>
                              <h3 className="text-lg font-semibold text-ivory">{feedback.userName}</h3>
                              <p className="text-sm text-ivory/60">
                                {feedback.hotelId?.name || 'Hotel'} · {feedback.hotelId?.city || ''} {feedback.hotelId?.state || ''}
                              </p>
                            </div>
                            <p className="max-w-3xl text-sm leading-7 text-ivory/70">{feedback.suggestion}</p>
                          </div>
                          <div className="grid gap-2 text-sm text-ivory/70 sm:text-right">
                            <p>Overall: {feedback.ratings?.overall || 0}</p>
                            <p>Food: {feedback.ratings?.food || 0}</p>
                            <p>Service: {feedback.ratings?.service || 0}</p>
                            <p>Ambience: {feedback.ratings?.ambience || 0}</p>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </section>
            </div>
          )}
        </Container>
      </div>
    </main>
  )
}

export default DashboardPage

