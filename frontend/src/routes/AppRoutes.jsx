import { Navigate, Route, Routes } from 'react-router-dom'
import { Footer, Navbar } from '../components/layout'
import { useAuth } from '../context/useAuth'
import { AdminLogin, DashboardPage, FeedbackPage, HomePage, NotFound } from '../pages'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/admin-login" replace />
}

function AppRoutes() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default AppRoutes
