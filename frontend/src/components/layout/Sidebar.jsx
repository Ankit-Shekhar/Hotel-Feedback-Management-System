import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-4">
      <nav className="flex flex-col gap-2 text-sm">
        <Link to="/dashboard" className="rounded px-3 py-2 hover:bg-slate-100">
          Dashboard
        </Link>
        <Link to="/dashboard/feedback" className="rounded px-3 py-2 hover:bg-slate-100">
          Feedback
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar
