import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from "../../context/AppContext";

/**
 * Wraps a route that requires authentication.
 * @param {string} requiredRole - 'employer' | 'freelancer' | undefined (any authenticated user)
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useApp()
  const location = useLocation()

  // Not logged in at all → send to login, remember where they tried to go
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Logged in but wrong role → send them to their own dashboard
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'employer' ? '/employer' : '/freelancer'} replace />
  }

  return children
}
