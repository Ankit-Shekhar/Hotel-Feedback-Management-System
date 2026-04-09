import { Link } from 'react-router-dom'
import Container from './Container'
import ReviewHeavenLogo from './ReviewHeavenLogo'

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-secondary/95 py-5 text-sm text-ivory/60 backdrop-blur">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ReviewHeavenLogo className="scale-90 origin-left" />
        <p>Copyright {new Date().getFullYear()} Review Heaven</p>
        <Link
          to="/admin-login"
          className="rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-semibold text-goldSoft transition hover:bg-gold hover:text-primary"
        >
          Admin Login
        </Link>
      </Container>
    </footer>
  )
}

export default Footer

