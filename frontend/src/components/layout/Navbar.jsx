import { Link } from 'react-router-dom'
import Container from './Container'

function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-primary/95 py-4 backdrop-blur">
      <Container>
        <div className="flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold tracking-wide text-ivory">
            Hotel Feedback System
          </Link>
          <Link to="/feedback" className="text-sm text-ivory/75 transition hover:text-gold">
            Give Feedback
          </Link>
        </div>
      </Container>
    </nav>
  )
}

export default Navbar

