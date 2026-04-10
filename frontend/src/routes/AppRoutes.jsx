import { AnimatePresence, motion as Motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { RouteLoader } from '../components/common'
import { Footer, Navbar } from '../components/layout'
import { useAuth } from '../context/useAuth'
import { AdminLogin, DashboardPage, FeedbackPage, HomePage, HotelsPage, NotFound } from '../pages'
import { pageTransition } from '../utils/motion'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/admin-login" replace />
}

function AppRoutes() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <RouteLoader isVisible={false} />
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <Motion.div key={location.pathname} {...pageTransition}>
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/hotels" element={<HotelsPage />} />
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
          </Motion.div>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  )
}

export default AppRoutes
