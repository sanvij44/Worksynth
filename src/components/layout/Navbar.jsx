import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Sparkles, Menu, X, LogOut, User } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useApp } from '../../context/AppContext'

// Base public links (no Login — that lives in the Get Started / Sign In buttons)
const publicLinks = [
  { label: 'Home',       to: '/' },
  { label: 'Features',   to: '/#features' },
  { label: 'Pricing',    to: '/#pricing' },
]

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const { toggleAIPanel, user, logout } = useApp()
  const location  = useLocation()
  const navigate  = useNavigate()
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isLanding = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Authenticated nav links depend on role
  const authLinks = user
    ? user.role === 'employer'
      ? [
          { label: 'Dashboard',  to: '/employer' },
          { label: 'Projects',   to: '/project/1' },
        ]
      : [
          { label: 'Dashboard',  to: '/freelancer' },
          { label: 'Projects',   to: '/project/1' },
        ]
    : publicLinks

  const navBg = (!isLanding || scrolled)
    ? isDark
      ? 'bg-bg-dark/90 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/20'
      : 'bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-md'
    : 'bg-transparent'

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm font-display">WS</div>
          </div>
          <span className="text-xl font-bold font-display">
            Work<span className="gradient-text">Synth</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {authLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors duration-200 relative ${
                location.pathname === link.to
                  ? 'text-primary'
                  : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {link.label}
              {location.pathname === link.to && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-primary to-secondary"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isDark ? 'glass hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}
            title="Toggle theme"
          >
            {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
          </motion.button>

          {user ? (
            /* ── Authenticated state ── */
            <>
              {/* AI Assistant */}
              <motion.button
                onClick={toggleAIPanel}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isDark ? 'glass hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
              >
                <Sparkles size={14} className="text-accent" /> AI Assistant
              </motion.button>

              {/* User chip */}
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl ${isDark ? 'glass' : 'bg-slate-100'}`}>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User size={12} className="text-white" />
                </div>
                <span className={`text-xs font-medium max-w-[90px] truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {user.name}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold capitalize ${
                  user.role === 'employer'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-accent/20 text-accent'
                }`}>{user.role}</span>
              </div>

              {/* Logout */}
              <motion.button
                onClick={handleLogout}
                whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isDark ? 'glass text-slate-400 hover:text-rose-400 hover:bg-rose-500/10' : 'bg-slate-100 text-slate-600 hover:text-rose-500 hover:bg-rose-50'}`}
                title="Log out"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Log out</span>
              </motion.button>
            </>
          ) : (
            /* ── Guest state ── */
            <>
              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                className={`hidden sm:flex px-4 py-2 rounded-xl text-sm font-medium transition-all ${isDark ? 'glass hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
              >
                Sign in
              </motion.button>

              <motion.button
                onClick={() => navigate('/signup')}
                whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(99,102,241,0.4)' }}
                whileTap={{ scale: 0.97 }}
                className="gradient-btn px-5 py-2 rounded-xl text-sm font-semibold text-white"
              >
                Get Started
              </motion.button>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center glass rounded-xl"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t ${isDark ? 'border-white/8 bg-bg-dark/95' : 'border-slate-200 bg-white/95'} backdrop-blur-xl overflow-hidden`}
          >
            <div className="px-4 py-4 space-y-1">
              {authLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'text-primary bg-primary/10'
                      : isDark ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  <button
                    onClick={() => { toggleAIPanel(); setMobileOpen(false) }}
                    className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <Sparkles size={14} className="text-accent" /> AI Assistant
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut size={14} /> Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'}`}>
                    Sign in
                  </Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium gradient-btn text-white text-center">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
