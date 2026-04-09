import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../../components/ui'
import { DashboardChart, Loader } from '../../components/common'
import { Sidebar, Container } from '../../components/layout'
import { getDashboardStats, getRecentFeedbacks } from '../../services'
import { fadeInUp, hoverLift } from '../../utils/motion'

function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentFeedbacks, setRecentFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const [statsResult, recentResult] = await Promise.all([
          getDashboardStats(),
          getRecentFeedbacks(10),
        ])

        if (active) {
          setStats(statsResult)
          setRecentFeedbacks(recentResult)
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || 'Unable to load dashboard data.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])

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
            <Loader />
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
                    <Card className="p-5 text-ivory/70">No recent feedback available.</Card>
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

