import { Link } from 'react-router-dom'
import Container from './Container'
import ReviewHeavenLogo from './ReviewHeavenLogo'

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-secondary/95 py-6 text-sm text-ivory/60 backdrop-blur">
      <Container className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="flex justify-center md:justify-start">
          <ReviewHeavenLogo className="scale-90 origin-center md:origin-left" />
        </div>
        <p className="text-center">Copyright {new Date().getFullYear()} Review Heaven</p>
        <div className="flex justify-center md:justify-end">
          <Link
            to="/admin-login"
            className="rounded-full border border-gold/35 bg-gold/8 px-4 py-2 text-sm font-semibold text-goldSoft transition hover:bg-gold hover:text-primary"
          >
            Admin Login
          </Link>
        </div>
      </Container>
    </footer>
  )
}

export default Footer

