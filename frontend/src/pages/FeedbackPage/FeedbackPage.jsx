import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { Card, InputField, LuxuryButton, RatingStars, TextareaField } from '../../components/ui'
import Container from '../../components/layout/Container'
import { useToast } from '../../context/useToast'
import { submitFeedback } from '../../services'
import { fadeInUp, hoverLift } from '../../utils/motion'

function FeedbackPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState({
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

  const ratingsComplete = Object.values(form.ratings).every((value) => value >= 1 && value <= 5)
  const canSubmit = Boolean(
    form.userName.trim() &&
      form.contactNumber.trim() &&
      form.suggestion.trim() &&
      ratingsComplete,
  )

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

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!ratingsComplete) {
      const message = 'Please provide ratings from 1 to 5 for all four categories before submitting.'
      setSubmitError(message)
      showToast({ title: 'Validation error', message, variant: 'error' })
      return
    }

    setLoading(true)
    setSubmitError('')

    try {
      await submitFeedback({
        userName: form.userName,
        email: form.email,
        contactNumber: form.contactNumber,
        contact: form.contactNumber,
        ratings: form.ratings,
        suggestion: form.suggestion,
      })

      showToast({
        title: 'Feedback submitted',
        message: 'Thank you for sharing your Rendezvous experience.',
        variant: 'success',
      })

      setForm({
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
    } catch (err) {
      const responseData = err?.response?.data
      const message =
        err?.response?.data?.message ||
        (typeof responseData === 'string' ? responseData : '') ||
        err?.message ||
        'Unable to submit feedback at the moment.'
      setSubmitError(message)
      showToast({ title: 'Submission failed', message, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-primary text-ivory">
      <Container className="py-10 sm:py-14 lg:py-16">
        <Motion.section {...fadeInUp} className="mb-8 space-y-4">
          <div className="inline-flex rounded-full border border-gold/25 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-goldSoft">
            Rendezvous feedback
          </div>
          <h1 className="text-4xl font-semibold sm:text-5xl">Tell us about your Rendezvous evening.</h1>
          <p className="max-w-3xl text-base leading-7 text-ivory/70">
            Rate your experience and leave a note to help us make every moment better.
          </p>
        </Motion.section>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Motion.aside {...hoverLift} className="space-y-4 rounded-[2rem] border border-white/10 bg-secondary/88 p-6 backdrop-blur-[1px]">
            <h2 className="text-2xl font-semibold text-ivory">Important notes</h2>
            <div className="space-y-3 text-sm leading-6 text-ivory/70">
              <p>All four rating categories are required: overall, food, service, and ambience.</p>
              <p>Here, 1 star = Poor and 5 star = Excellent.</p>
            </div>

            <Card className="overflow-hidden border border-white/10 bg-primary/40 p-3">
              <img
                src="/barNshm.png"
                alt="Rendezvous preview"
                className="h-44 w-full rounded-2xl object-cover"
              />
              <div className="mt-3 text-sm text-ivory/75">
                <p className="font-semibold text-ivory">Rendezvous</p>
              </div>
            </Card>

            {submitError ? <Card className="border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">{submitError}</Card> : null}
          </Motion.aside>

          <Motion.form
            {...fadeInUp}
            onSubmit={handleSubmit}
            className="space-y-5 rounded-[2rem] border border-gold/15 bg-secondary/90 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-[1px]"
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
                label="Email (optional)"
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="guest@example.com"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Contact number"
                value={form.contactNumber}
                onChange={(event) => updateField('contactNumber', event.target.value)}
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
                  <RatingStars value={form.ratings[key]} onChange={(value) => updateRating(key, value)} />
                </div>
              ))}
            </div>

            <TextareaField
              label="Suggestion"
              value={form.suggestion}
              onChange={(event) => updateField('suggestion', event.target.value)}
              placeholder="Share your suggestion..."
              maxLength={500}
              required
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ivory/55">
                {form.suggestion.length}/500 characters {!ratingsComplete ? '· complete all ratings' : ''}
              </p>
              <LuxuryButton type="submit" disabled={loading || !canSubmit}>
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </LuxuryButton>
            </div>
          </Motion.form>
        </div>
      </Container>
    </main>
  )
}

export default FeedbackPage
