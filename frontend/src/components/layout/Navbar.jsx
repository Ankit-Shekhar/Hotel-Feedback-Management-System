import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-slate-900">
          Hotel Feedback System
        </Link>
        <Link to="/feedback" className="text-sm text-slate-700 hover:text-teal-700">
          Give Feedback
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
