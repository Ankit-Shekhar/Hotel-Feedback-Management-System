import { Link } from 'react-router-dom'
import Container from './Container'
import ReviewHeavenLogo from './ReviewHeavenLogo'

function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-primary/95 py-4 backdrop-blur">
      <Container>
        <div className="flex items-center justify-between">
          <Link to="/" className="transition hover:opacity-90">
            <ReviewHeavenLogo />
          </Link>
          <Link
            to="/feedback"
            className="rounded-full border border-gold/40 bg-gold/15 px-4 py-2 text-sm font-semibold text-goldSoft transition hover:bg-gold hover:text-primary"
          >
            Give Feedback
          </Link>
        </div>
      </Container>
    </nav>
  )
}

export default Navbar

