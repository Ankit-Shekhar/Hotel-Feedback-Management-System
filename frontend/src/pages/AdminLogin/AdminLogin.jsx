import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, InputField, LuxuryButton } from '../../components/ui'
import Container from '../../components/layout/Container'
import { useToast } from '../../context/useToast'
import { loginAdmin } from '../../services'
import { useAuth } from '../../context/useAuth'
import { fadeInUp } from '../../utils/motion'

function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useToast()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await loginAdmin(form)
      const token = response?.token

      if (!token) {
        throw new Error('Authentication token not returned from server.')
      }

      login(token)
      showToast({ title: 'Welcome back', message: 'Admin login successful.', variant: 'success' })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Unable to sign in.'
      setError(message)
      showToast({ title: 'Login failed', message, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-primary text-ivory">
      <Container className="flex min-h-[calc(100vh-132px)] items-center justify-center py-10">
        <motion.div {...fadeInUp} className="w-full max-w-md">
          <Card className="border-gold/20 bg-secondary/95 p-6">
            <div className="mb-6 space-y-2 text-center">
              <div className="inline-flex rounded-full border border-gold/25 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.35em] text-goldSoft">
                Admin access
              </div>
              <h1 className="text-3xl font-semibold text-ivory">Sign in to dashboard</h1>
              <p className="text-sm text-ivory/65">Use your admin credentials to access analytics and hotel feedback.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Username"
                value={form.username}
                onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                placeholder="Admin username"
                autoComplete="username"
                required
              />
              <InputField
                label="Password"
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="Password"
                autoComplete="current-password"
                required
              />

              {error ? <p className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}

              <LuxuryButton type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </LuxuryButton>
            </form>
          </Card>
        </motion.div>
      </Container>
    </main>
  )
}

export default AdminLogin

