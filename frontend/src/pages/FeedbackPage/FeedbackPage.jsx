import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, InputField, LuxuryButton, RatingStars, TextareaField } from '../../components/ui'
import Container from '../../components/layout/Container'
import { getHotels, submitFeedback } from '../../services'
import { fadeInUp, hoverLift } from '../../utils/motion'

function FeedbackPage() {
  const [hotels, setHotels] = useState([])
  const [loadingHotels, setLoadingHotels] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    hotelId: '',
    userName: '',
    contact: '',
    suggestion: '',
    ratings: {
      overall: 0,
      food: 0,
      service: 0,
      ambience: 0,
    },
  })

  useEffect(() => {
    let active = true

    const loadHotels = async () => {
      try {
        const result = await getHotels()
        if (active) {
          setHotels(result)
          setForm((current) => ({
            ...current,
            hotelId: result?.[0]?._id || '',
          }))
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || 'Unable to load hotels for feedback.')
        }
      } finally {
        if (active) {
          setLoadingHotels(false)
        }
      }
    }

    loadHotels()

    return () => {
      active = false
    }
  }, [])

  const hotelOptions = useMemo(() => hotels, [hotels])

  const updateRating = (field, value) => {
    setForm((current) => ({
      ...current,
      ratings: {
        ...current.ratings,
        [field]: value,
      },
    }))
  }

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const updateRatings = (field, value) => updateRating(field, value)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await submitFeedback({
        hotelId: form.hotelId,
        userName: form.userName,
        contact: form.contact,
        ratings: form.ratings,
        suggestion: form.suggestion,
      })

      setSuccess('Feedback submitted successfully. If you submit again within 30 days, your latest entry is updated.')
      setForm((current) => ({
        ...current,
        userName: '',
        contact: '',
        suggestion: '',
        ratings: {
          overall: 0,
          food: 0,
          service: 0,
          ambience: 0,
        },
      }))
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to submit feedback at the moment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-primary text-ivory">
      <Container className="py-10 sm:py-14 lg:py-16">
        <motion.section {...fadeInUp} className="mb-8 space-y-4">
          <div className="inline-flex rounded-full border border-gold/25 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-goldSoft">
            Guest feedback
          </div>
          <h1 className="text-4xl font-semibold sm:text-5xl">Share a refined guest experience review.</h1>
          <p className="max-w-3xl text-base leading-7 text-ivory/70">
            Submit feedback for a selected hotel with four rating categories and a short suggestion note.
          </p>
        </motion.section>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.aside {...hoverLift} className="space-y-4 rounded-[2rem] border border-white/10 bg-secondary/90 p-6">
            <h2 className="text-2xl font-semibold text-ivory">Important notes</h2>
            <div className="space-y-3 text-sm leading-6 text-ivory/70">
              <p>Select a hotel before submitting your review.</p>
              <p>
                The same guest can update a recent submission within 30 days. After that, a new feedback entry is created.
              </p>
              <p>All four rating categories are required: overall, food, service, and ambience.</p>
            </div>

            <Card className="bg-white/5 p-4 text-sm text-ivory/75">
              {loadingHotels ? 'Loading hotel options...' : `${hotelOptions.length} hotel(s) available for feedback.`}
            </Card>

            {success ? <Card className="border-gold/20 bg-gold/10 p-4 text-sm text-ivory">{success}</Card> : null}
            {error ? <Card className="border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">{error}</Card> : null}
          </motion.aside>

          <motion.form
            {...fadeInUp}
            onSubmit={handleSubmit}
            className="space-y-5 rounded-[2rem] border border-gold/15 bg-secondary/95 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.28)]"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Name"
                value={form.userName}
                onChange={(event) => updateField('userName', event.target.value)}
                placeholder="Guest name"
                required
              />
              <InputField
                label="Contact"
                value={form.contact}
                onChange={(event) => updateField('contact', event.target.value)}
                placeholder="Phone or email"
                required
              />
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-ivory/80">Hotel</span>
              <select
                value={form.hotelId}
                onChange={(event) => updateField('hotelId', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-secondary px-4 py-3 text-sm text-ivory outline-none transition focus:border-gold focus:shadow-[0_0_0_4px_rgba(212,175,55,0.12)]"
                required
              >
                <option value="" disabled>
                  Select a hotel
                </option>
                {hotels.map((hotel) => (
                  <option key={hotel._id} value={hotel._id} className="bg-secondary">
                    {hotel.name} - {hotel.city}, {hotel.state}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2">
              {[
                ['overall', 'Overall experience'],
                ['food', 'Food & dining'],
                ['service', 'Service quality'],
                ['ambience', 'Ambience & comfort'],
              ].map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <span className="text-sm font-medium text-ivory/80">{label}</span>
                  <RatingStars value={form.ratings[key]} onChange={(value) => updateRatings(key, value)} />
                </div>
              ))}
            </div>

            <TextareaField
              label="Suggestion"
              value={form.suggestion}
              onChange={(event) => updateField('suggestion', event.target.value)}
              placeholder="Share your suggestion or compliment..."
              maxLength={500}
              required
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ivory/55">{form.suggestion.length}/500 characters</p>
              <LuxuryButton type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </LuxuryButton>
            </div>
          </motion.form>
        </div>
      </Container>
    </main>
  )
}

export default FeedbackPage

