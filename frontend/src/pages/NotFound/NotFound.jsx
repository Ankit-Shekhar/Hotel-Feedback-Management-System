import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Container from '../../components/layout/Container'
import { LuxuryButton } from '../../components/ui'
import { fadeInUp } from '../../utils/motion'

function NotFound() {
  return (
    <main className="relative min-h-[calc(100vh-132px)] overflow-hidden bg-primary text-ivory">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.16),transparent_35%)]" />
      <Container className="relative flex min-h-[calc(100vh-132px)] items-center justify-center py-12">
        <Motion.section {...fadeInUp} className="w-full max-w-2xl rounded-[2rem] border border-gold/20 bg-secondary/90 p-8 text-center shadow-[0_25px_60px_rgba(0,0,0,0.36)]">
          <p className="text-xs uppercase tracking-[0.35em] text-goldSoft">Page not found</p>
          <h1 className="mt-4 text-6xl font-semibold text-ivory sm:text-7xl">404</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ivory/70 sm:text-base">
            The page you requested does not exist or may have been moved. Continue with the main Rendezvous experience.
          </p>
          <div className="mt-8">
            <LuxuryButton as={Link} to="/">
              Back to Home
            </LuxuryButton>
          </div>
        </Motion.section>
      </Container>
    </main>
  )
}

export default NotFound
