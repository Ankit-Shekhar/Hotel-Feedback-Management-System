import { Link } from 'react-router-dom'
import Container from './Container'

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-secondary/95 py-4 text-sm text-ivory/60 backdrop-blur">
      <Container className="flex items-center justify-between gap-4">
        <p>Copyright {new Date().getFullYear()} Hotel Feedback System</p>
        <Link to="/admin-login" className="transition hover:text-gold">
          Admin Login
        </Link>
      </Container>
    </footer>
  )
}

export default Footer

