import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { RouteLoader } from '../components/common'
import { Footer, Navbar } from '../components/layout'
import { useAuth } from '../context/useAuth'
import { AdminLogin, DashboardPage, FeedbackPage, HomePage, NotFound } from '../pages'
import { pageTransition } from '../utils/motion'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/admin-login" replace />
}

function AppRoutes() {
  const location = useLocation()
  const [isRouteLoading, setIsRouteLoading] = useState(false)
  const previousPathRef = useRef(location.pathname)

  useEffect(() => {
    if (previousPathRef.current === location.pathname) {
      return
    }

    previousPathRef.current = location.pathname
    setIsRouteLoading(true)

    const timeoutId = window.setTimeout(() => {
      setIsRouteLoading(false)
    }, 720)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <RouteLoader isVisible={isRouteLoading} />
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} {...pageTransition}>
            <Routes location={location}>
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
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  )
}

export default AppRoutes
