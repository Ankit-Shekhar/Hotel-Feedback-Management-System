import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="w-full border-b border-white/10 bg-secondary/90 p-4 md:w-72 md:border-b-0 md:border-r">
      <nav className="flex flex-col gap-2 text-sm text-ivory/75">
        <Link to="/dashboard" className="rounded-2xl px-3 py-2 transition hover:bg-white/5 hover:text-gold">
          Dashboard Overview
        </Link>
        <Link to="/feedback" className="rounded-2xl px-3 py-2 transition hover:bg-white/5 hover:text-gold">
          Public Feedback Form
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar

