import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import GlassCard from '../components/ui/GlassCard'
import GradientButton from '../components/ui/GradientButton'
import ProgressBar from '../components/ui/ProgressBar'
import Badge from '../components/ui/Badge'
import {
  EmployerStatsCards,
  ProjectsGrid,
  MilestoneProgressList,
  ProjectsTable,
} from '../components/employer/EmployerComponents'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import { freelancers } from '../data/index'
import { supabase } from '../lib/supabase'

const TABS = ['overview', 'projects', 'freelancers', 'escrow', 'analytics']

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { isDark } = useTheme()
  const { toggleAIPanel, logout } = useApp()
  const navigate = useNavigate()

  const [escrowStats, setEscrowStats] = useState({
    held: 0,
    releasedThisMonth: 0,
    pendingApproval: 0,
  })

  useEffect(() => {
    const loadEscrowStats = async () => {
      const { data, error } = await supabase
        .from('escrow_holds')
        .select('amount_paise, status, created_at')

      if (error || !data) return

      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

      let held = 0
      let releasedThisMonth = 0
      let pendingApproval = 0

      for (const row of data) {
        if (row.status === 'funded') {
          held += row.amount_paise
          pendingApproval += row.amount_paise
        }
        if (row.status === 'released') {
          if (new Date(row.created_at) >= monthStart) {
            releasedThisMonth += row.amount_paise
          }
        }
      }

      setEscrowStats({
        held: held / 100,
        releasedThisMonth: releasedThisMonth / 100,
        pendingApproval: pendingApproval / 100,
      })
    }

    loadEscrowStats()
  }, [])

  const sidebarLinks = [
    { icon: '⬡', label: 'Overview', onClick: () => setActiveTab('overview') },
    { icon: '◈', label: 'Projects', onClick: () => setActiveTab('projects') },
    { icon: '👥', label: 'Freelancers', onClick: () => setActiveTab('freelancers') },
    { icon: '🔐', label: 'Escrow', onClick: () => setActiveTab('escrow') },
    { icon: '📊', label: 'Analytics', onClick: () => setActiveTab('analytics') },
    { divider: true },
    { icon: '←', label: 'Back to Home', to: '/' },
    { icon: '🚪', label: 'Log Out', onClick: () => { logout(); navigate('/') } },
  ]

  const sidebarHeader = (
    <div className={`flex items-center gap-2.5 p-3 rounded-xl ${isDark ? '' : 'bg-primary/5 border border-primary/15'}`} style={isDark ? { background: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.08))', border: '1px solid rgba(99,102,241,0.2)' } : {}}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold font-display">T</div>
      <div>
        <div className="text-sm font-semibold">TechCorp Inc.</div>
        <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pro Plan</div>
      </div>
    </div>
  )

  const sidebarFooter = (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={14} className="text-accent" />
        <span className="text-xs font-semibold">AI Insight</span>
      </div>
      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        3 projects approaching deadline. Consider redistributing tasks for optimal delivery.
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
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-display">Employer Dashboard</h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Welcome back, TechCorp. Here's your workspace.</p>
          </div>
          <div className="flex gap-2">
            <motion.button
              onClick={toggleAIPanel}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isDark ? 'glass hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
            >
              <Sparkles size={14} className="text-accent" /> AI Tips
            </motion.button>
            <GradientButton onClick={() => navigate('/project/1')}>+ New Project</GradientButton>
          </div>
        </div>

        {/* Tab nav (mobile) */}
        <div className="flex md:hidden gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all capitalize ${activeTab === t ? 'bg-primary text-white' : isDark ? 'glass text-slate-400' : 'bg-slate-100 text-slate-600'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div>
                <EmployerStatsCards />
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold font-display">Active Projects</h2>
                  <button onClick={() => setActiveTab('projects')} className="text-primary text-sm hover:underline">View all →</button>
                </div>
                <ProjectsGrid limit={3} />
                <div className="mt-6">
                  <MilestoneProgressList />
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold font-display">All Projects</h2>
                  <GradientButton onClick={() => navigate('/project/1')}>+ Create Project</GradientButton>
                </div>
                <ProjectsTable />
              </div>
            )}

            {activeTab === 'freelancers' && (
              <div>
                <h2 className="text-xl font-bold font-display mb-6">Freelancers</h2>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {freelancers.map(f => (
                    <GlassCard key={f.id} hover className="p-5" onClick={() => navigate('/freelancer')}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${f.color} flex items-center justify-center text-lg font-bold text-white`}>{f.avatar}</div>
                        <div>
                          <div className="font-semibold">{f.name}</div>
                          <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{f.role}</div>
                        </div>
                      </div>
                      <div className={`flex items-center justify-between text-sm mb-2 ${isDark ? '' : ''}`}>
                        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Reputation</span>
                        <span className="text-amber-400 font-bold">{f.reputation}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 mb-4">
                        <div className="h-full rounded-full bg-amber-400" style={{ width: `${f.reputation}%` }} />
                      </div>
                      <div className={`flex justify-between text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        <span>{f.projectsDone} projects done</span>
                        <span className={f.status === 'available' ? 'text-emerald-400' : 'text-orange-400'}>
                          {f.status === 'available' ? 'Available' : 'Busy'}
                        </span>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'escrow' && (
              <div>
                <h2 className="text-xl font-bold font-display mb-6">Escrow Accounts</h2>
                <div className="grid md:grid-cols-3 gap-5 mb-6">
                  {[
                    { label: 'TOTAL HELD', value: escrowStats.held, color: 'text-amber-400' },
                    { label: 'RELEASED THIS MONTH', value: escrowStats.releasedThisMonth, color: 'text-emerald-400' },
                    { label: 'PENDING APPROVAL', value: escrowStats.pendingApproval, color: 'text-primary' },
                  ].map(e => (
                    <GlassCard key={e.label} className="p-5">
                      <div className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{e.label}</div>
                      <div className={`text-3xl font-bold font-display ${e.color}`}>
                        ₹{e.value.toLocaleString()}
                      </div>
                    </GlassCard>
                  ))}
                </div>
                <GlassCard className="overflow-hidden">
                  <div className={`px-5 py-4 border-b font-semibold font-display text-sm ${isDark ? 'border-white/8' : 'border-slate-100'}`}>Recent Transactions</div>
                  {[
                    { title: 'E-Commerce Design — Milestone 2', date: 'Released Jan 14', amount: '+$1,600', color: 'text-emerald-400' },
                    { title: 'API Integration — Escrow Lock', date: 'Locked Jan 12', amount: '−$5,800', color: 'text-amber-400' },
                    { title: 'Brand Kit — Final Delivery', date: 'Released Jan 10', amount: '+$2,100', color: 'text-emerald-400' },
                  ].map((tx, i) => (
                    <div key={i} className={`px-5 py-4 flex justify-between items-center transition-colors ${isDark ? 'border-b border-white/5 hover:bg-white/3' : 'border-b border-slate-50 hover:bg-slate-50'}`}>
                      <div>
                        <div className={`font-medium text-sm ${isDark ? '' : 'text-slate-800'}`}>{tx.title}</div>
                        <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{tx.date}</div>
                      </div>
                      <div className={`font-semibold ${tx.color}`}>{tx.amount}</div>
                    </div>
                  ))}
                </GlassCard>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-xl font-bold font-display mb-6">Analytics</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <GlassCard className="p-6">
                    <h3 className="font-semibold font-display mb-5">Monthly Spend</h3>
                    <div className="flex items-end gap-3 h-32">
                      {[60, 80, 50, 100].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <motion.div
                            className={`w-full rounded-t ${i === 3 ? 'bg-gradient-to-t from-primary to-secondary' : 'bg-primary/35 hover:bg-primary/55 transition-colors'}`}
                            style={{ height: `${h}%` }}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                          />
                          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{['Oct','Nov','Dec','Jan'][i]}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-2xl font-bold font-display gradient-text">
                      $24,200 <span className="text-sm text-emerald-400 font-normal">↑ 18%</span>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6">
                    <h3 className="font-semibold font-display mb-5">Delivery Performance</h3>
                    <div className="space-y-4">
                      <ProgressBar value={96} color="emerald" showLabel label="On Time" />
                      <ProgressBar value={98} color="accent" showLabel label="Quality Pass Rate" />
                      <div>
                        <div className={`flex justify-between text-xs mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          <span>Client Satisfaction</span><span className="text-amber-400 font-semibold">4.9★</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/8">
                          <motion.div className="h-full rounded-full bg-amber-400" initial={{ width: 0 }} animate={{ width: '98%' }} transition={{ duration: 1.2 }} />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </motion.div>
  )
}
