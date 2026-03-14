import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import GlassCard from '../components/ui/GlassCard'
import {
  EarningsCards,
  ActiveProjectsList,
  TaskTimeline,
  ReputationWidget,
  EarningsMiniChart,
} from '../components/freelancer/FreelancerComponents'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { freelancers } from '../data/index'

const freelancer = freelancers[0]

export default function FreelancerDashboard() {
  const { isDark } = useTheme()
  const { toggleAIPanel, logout } = useApp()
  const navigate = useNavigate()

  const sidebarLinks = [
    { icon: '⬡', label: 'Dashboard', to: '/freelancer' },
    { icon: '📋', label: 'My Projects', to: '/project/1' },
    { icon: '💸', label: 'Earnings' },
    { icon: '⭐', label: 'Reputation' },
    { icon: '🔔', label: 'Notifications', badge: '3' },
    { divider: true },
    { icon: '←', label: 'Back to Home', to: '/' },
    { icon: '🚪', label: 'Log Out', onClick: () => { logout(); navigate('/') } },
  ]

  const sidebarHeader = (
    <div className={`flex items-center gap-2.5 p-3 rounded-xl`} style={isDark ? { background: 'linear-gradient(135deg,rgba(6,182,212,0.12),rgba(99,102,241,0.08))', border: '1px solid rgba(6,182,212,0.2)' } : { background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)' }}>
      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${freelancer.color} flex items-center justify-center text-white text-sm font-bold`}>{freelancer.avatar}</div>
      <div>
        <div className="text-sm font-semibold">{freelancer.name}</div>
        <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Rep: {freelancer.reputation}</div>
      </div>
    </div>
  )

  const sidebarFooter = (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={14} className="text-accent" />
        <span className="text-xs font-semibold">AI Tip</span>
      </div>
      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Submitting milestone 3 early could boost your reputation score by ~0.8 points.
      </p>
    </GlassCard>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen pt-16"
    >
      <Sidebar links={sidebarLinks} header={sidebarHeader} footer={sidebarFooter} />

      <main className="flex-1 md:ml-60 p-4 sm:p-6 min-w-0">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-display">Freelancer Dashboard</h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Welcome back, {freelancer.name.split(' ')[0]}. You're crushing it! 🔥
            </p>
          </div>
          <motion.button
            onClick={toggleAIPanel}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isDark ? 'glass hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
          >
            <Sparkles size={14} className="text-accent" /> AI Tips
          </motion.button>
        </div>

        <EarningsCards />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: projects + tasks */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h2 className="font-bold font-display mb-4">Active Projects</h2>
              <ActiveProjectsList />
            </div>
            <TaskTimeline />
          </div>

          {/* Right: reputation + chart */}
          <div className="space-y-5">
            <ReputationWidget />
            <EarningsMiniChart />
          </div>
        </div>
      </main>
    </motion.div>
  )
}
