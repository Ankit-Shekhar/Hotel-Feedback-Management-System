import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold text-slate-900">404</h1>
      <p className="mt-3 text-slate-600">The page you requested could not be found.</p>
      <Link to="/" className="mt-6 rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white">
        Back to Home
      </Link>
    </main>
  )
}

export default NotFound
