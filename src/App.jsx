import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useTheme } from './context/ThemeContext'
import Navbar from './components/layout/Navbar'
import AIPanel from './components/ai/AIPanel'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import EmployerDashboard from './pages/EmployerDashboard'
import FreelancerDashboard from './pages/FreelancerDashboard'
import ProjectDetail from './pages/ProjectDetail'

// Full-screen auth pages — hide global Navbar & AI panel
const AUTH_ROUTES = ['/login', '/signup']

export default function App() {
  const location  = useLocation()
  const { isDark } = useTheme()
  const isAuthPage = AUTH_ROUTES.includes(location.pathname)

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-bg-dark text-white' : 'bg-bg-light text-slate-900'
      }`}>
        {!isAuthPage && <Navbar />}

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public */}
            <Route path="/"       element={<Landing />} />
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected — employer only */}
            <Route path="/employer" element={
              <ProtectedRoute requiredRole="employer">
                <EmployerDashboard />
              </ProtectedRoute>
            }/>

            {/* Protected — freelancer only */}
            <Route path="/freelancer" element={
              <ProtectedRoute requiredRole="freelancer">
                <FreelancerDashboard />
              </ProtectedRoute>
            }/>

            {/* Protected — any authenticated user */}
            <Route path="/project/:id" element={
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            }/>
          </Routes>
        </AnimatePresence>

        {!isAuthPage && <AIPanel />}
      </div>
    </div>
  )
}
