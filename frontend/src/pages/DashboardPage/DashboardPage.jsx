import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Card } from '../../components/ui'
import { DashboardChart, FetchingNotice, SkeletonBlock } from '../../components/common'
import { Sidebar, Container } from '../../components/layout'
import { useAuth } from '../../context/useAuth'
import { useToast } from '../../context/useToast'
import { deleteAllFeedbacks, deleteFeedbacksBulk, getDashboardStats, getRecentFeedbacks } from '../../services'
import { fadeInUp, hoverLift } from '../../utils/motion'

function DashboardPage() {
  const { isSuperAdmin } = useAuth()
  const { showToast } = useToast()
  const [stats, setStats] = useState(null)
  const [recentFeedbacks, setRecentFeedbacks] = useState([])
  const [selectedFeedbackIds, setSelectedFeedbackIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const loadDashboard = useCallback(async () => {
    setLoading(true)

    const [statsResult, recentResult] = await Promise.all([
      getDashboardStats(),
      getRecentFeedbacks(10),
    ])

    setStats(statsResult)
    setRecentFeedbacks(recentResult)
    setError('')
    setLoading(false)
  }, [])

  useEffect(() => {
    let active = true
    let retryTimeoutId

    const loadDashboardWithRetry = async () => {
      try {
        await loadDashboard()
      } catch (err) {
        if (active) {
          const message = err?.response?.data?.message || 'Unable to load dashboard data.'
          setError(message)
          retryTimeoutId = window.setTimeout(loadDashboardWithRetry, 4500)
        }
      }
    }

    loadDashboardWithRetry()

    return () => {
      active = false
      if (retryTimeoutId) {
        window.clearTimeout(retryTimeoutId)
      }
    }
  }, [loadDashboard])

  useEffect(() => {
    setSelectedFeedbackIds((currentIds) =>
      currentIds.filter((id) => recentFeedbacks.some((feedback) => feedback._id === id)),
    )
  }, [recentFeedbacks])

  const allRecentSelected = recentFeedbacks.length > 0 && selectedFeedbackIds.length === recentFeedbacks.length

  const toggleFeedbackSelection = (feedbackId) => {
    setSelectedFeedbackIds((currentIds) => {
      if (currentIds.includes(feedbackId)) {
        return currentIds.filter((id) => id !== feedbackId)
      }

      return [...currentIds, feedbackId]
    })
  }

  const toggleSelectAllRecent = () => {
    if (allRecentSelected) {
      setSelectedFeedbackIds([])
      return
    }

    setSelectedFeedbackIds(recentFeedbacks.map((feedback) => feedback._id))
  }

  const handleDeleteSelected = async () => {
    if (!selectedFeedbackIds.length) {
      showToast({
        title: 'No selection',
        message: 'Select at least one feedback to delete.',
        variant: 'error',
      })
      return
    }

    setDeleting(true)

    try {
      const result = await deleteFeedbacksBulk(selectedFeedbackIds)
      setSelectedFeedbackIds([])
      await loadDashboard()
      showToast({
        title: 'Feedback removed',
        message: `${result?.deleted || 0} feedback(s) permanently deleted.`,
        variant: 'success',
      })
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to delete selected feedbacks.'
      showToast({ title: 'Delete failed', message, variant: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteAll = async () => {
    setDeleting(true)

    try {
      const result = await deleteAllFeedbacks()
      setSelectedFeedbackIds([])
      await loadDashboard()
      showToast({
        title: 'All feedback removed',
        message: `${result?.deleted || 0} feedback(s) permanently deleted.`,
        variant: 'success',
      })
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to delete all feedbacks.'
      showToast({ title: 'Delete failed', message, variant: 'error' })
    } finally {
      setDeleting(false)
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

  return (
    <main className="min-h-[calc(100vh-132px)] bg-primary text-ivory">
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <Container className="flex-1 py-8">
          <Motion.section {...fadeInUp} className="mb-8 space-y-3">
            <div className="inline-flex rounded-full border border-gold/25 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-goldSoft">
              Feedback analytics overview
            </div>
            <h1 className="text-4xl font-semibold">Rendezvous feedback intelligence</h1>
            <p className="max-w-3xl text-sm leading-7 text-ivory/70">
              Track guest sentiment trends and recent submissions from Rendezvous feedback.
            </p>
          </Motion.section>

          {loading || error ? (
            <div className="space-y-8" aria-label="Loading dashboard content">
              <FetchingNotice message="The data is being fetched, kindly wait." />
              <section className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
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
          ) : (
            <div className="space-y-8">
              <section className="grid gap-4 md:grid-cols-2">
                {[
                  { label: 'Total feedbacks', value: stats?.totalFeedbacks || 0 },
                  { label: 'Average overall', value: stats?.averageRatings?.overall || 0 },
                ].map((item) => (
                  <Motion.div key={item.label} {...hoverLift}>
                    <Card className="h-full border-gold/10 p-5">
                      <p className="text-sm text-ivory/60">{item.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-ivory">{item.value}</p>
                    </Card>
                  </Motion.div>
                ))}
              </section>

              <DashboardChart title="Average ratings by category" data={chartData} xKey="label" yKey="value" />

              <section className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-ivory">Recent feedback</h2>
                    <p className="text-sm text-ivory/60">Latest guest submissions across Rendezvous.</p>
                  </div>

                  {isSuperAdmin && recentFeedbacks.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleSelectAllRecent}
                        className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-ivory/85 transition hover:border-gold/50 hover:text-goldSoft"
                        disabled={deleting}
                      >
                        {allRecentSelected ? 'Clear Selection' : 'Select All'}
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteSelected}
                        className="rounded-full border border-red-400/35 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:border-red-400 hover:bg-red-500/15"
                        disabled={deleting || !selectedFeedbackIds.length}
                      >
                        {deleting ? 'Deleting...' : `Delete Selected (${selectedFeedbackIds.length})`}
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteAll}
                        className="rounded-full border border-red-500/45 px-3 py-1.5 text-xs font-semibold text-red-100 transition hover:border-red-500 hover:bg-red-600/20"
                        disabled={deleting}
                      >
                        {deleting ? 'Deleting...' : 'Delete All'}
                      </button>
                    </div>
                  ) : null}
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
                        {isSuperAdmin ? (
                          <div className="mb-3 flex justify-end">
                            <label className="inline-flex items-center gap-2 text-xs text-ivory/70">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-white/20 bg-transparent accent-red-500"
                                checked={selectedFeedbackIds.includes(feedback._id)}
                                onChange={() => toggleFeedbackSelection(feedback._id)}
                                disabled={deleting}
                              />
                              Select
                            </label>
                          </div>
                        ) : null}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-2">
                            <div>
                              <h3 className="text-lg font-semibold text-ivory">{feedback.userName}</h3>
                              <p className="text-sm text-ivory/60">rendezvous</p>
                              <p className="text-sm text-ivory/60">Email: {feedback.email || 'Not provided'}</p>
                              <p className="text-sm text-ivory/60">Contact: {feedback.contactNumber || feedback.contact || 'Not provided'}</p>
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
