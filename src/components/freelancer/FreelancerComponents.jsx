import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../ui/GlassCard'
import Badge from '../ui/Badge'
import ProgressBar from '../ui/ProgressBar'
import { useTheme } from '../../context/ThemeContext'
import { freelancers } from '../../data/index'

const freelancer = freelancers[0]

/* ─── Earnings Cards ─── */
export function EarningsCards() {
  const { isDark } = useTheme()
  const cards = [
    { label: 'THIS MONTH', value: `$${freelancer.earnings.month.toLocaleString()}`, sub: '↑ $620 vs last month', subColor: 'text-emerald-400', valueClass: 'gradient-text' },
    { label: 'IN ESCROW', value: `$${freelancer.earnings.escrow.toLocaleString()}`, sub: '3 pending releases', subColor: isDark ? 'text-slate-400' : 'text-slate-500', valueClass: 'text-amber-400' },
    { label: 'ACTIVE PROJECTS', value: '4', sub: '2 due this week', subColor: isDark ? 'text-slate-400' : 'text-slate-500', valueClass: 'text-primary' },
    { label: 'REPUTATION', value: `${freelancer.reputation}`, sub: '↑ Top 3%', subColor: 'text-emerald-400', valueClass: 'text-amber-400' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((c, i) => (
        <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
          <GlassCard hover className="p-5">
            <div className={`text-xs font-semibold mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{c.label}</div>
            <div className={`text-3xl font-bold font-display mb-1 ${c.valueClass}`}>{c.value}</div>
            <div className={`text-xs ${c.subColor}`}>{c.sub}</div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  )
}

/* ─── Active Projects List ─── */
export function ActiveProjectsList() {
  const navigate = useNavigate()
  const { isDark } = useTheme()

  const activeProjects = [
    { id: '1', title: 'E-Commerce Redesign', client: 'TechCorp Inc.', category: 'UI/UX Design', status: 'review', progress: 65, milestone: '3 of 5', due: 'Jan 28, 2025', escrow: 3200 },
    { id: '2', title: 'Landing Page Copy', client: 'Stackr.io', category: 'Copywriting', status: 'done', progress: 80, milestone: '2 of 3', due: 'Feb 5, 2025', escrow: 1400 },
  ]

  return (
    <div className="space-y-4">
      {activeProjects.map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
          <GlassCard hover className="p-5" onClick={() => navigate(`/project/${p.id}`)}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{p.client} · {p.category}</div>
              </div>
              <Badge status={p.status} />
            </div>
            <ProgressBar value={p.progress} color={p.status === 'done' ? 'emerald' : 'primary'} showLabel label={`Milestone ${p.milestone}`} />
            <div className={`flex items-center justify-between text-xs mt-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>📅 Due {p.due}</span>
              <span className="text-emerald-400 font-semibold">${p.escrow.toLocaleString()} escrowed</span>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  )
}

/* ─── Task Timeline ─── */
export function TaskTimeline() {
  const { isDark } = useTheme()

  return (
    <GlassCard className="p-5">
      <h3 className="font-semibold font-display mb-4">This Week's Tasks</h3>
      <div className="space-y-3">
        {freelancer.tasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex items-center gap-3"
          >
            <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-xs transition-all ${
              task.done
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                : 'bg-primary/10 border border-primary/30'
            }`}>
              {task.done ? '✓' : ''}
            </div>
            <div className="flex-1">
              <div className={`text-sm font-medium ${task.done ? 'line-through text-slate-500' : ''}`}>{task.title}</div>
              <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {task.due}{task.today && <span className="text-primary ml-1 font-semibold">• Today</span>}
              </div>
            </div>
            {task.today && <Badge status="pending" label="Due Today" className="text-xs" />}
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}

/* ─── Reputation Widget ─── */
export function ReputationWidget() {
  const { isDark } = useTheme()
  const score = freelancer.reputation
  const circumference = 2 * Math.PI * 42
  const offset = circumference - (score / 100) * circumference

  return (
    <GlassCard className="p-6">
      <h3 className="font-semibold font-display mb-5">Reputation Score</h3>
      <div className="flex items-center justify-center mb-5">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none"
              stroke="url(#repGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
            />
            <defs>
              <linearGradient id="repGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold gradient-text font-display">{score}</div>
            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Top 3%</div>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        {[
          { label: 'Delivery Speed', score: freelancer.scoreBreakdown.delivery },
          { label: 'Quality', score: freelancer.scoreBreakdown.quality },
          { label: 'Communication', score: freelancer.scoreBreakdown.communication },
        ].map(item => (
          <div key={item.label} className="flex justify-between items-center">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{item.label}</span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => <span key={s} className={`text-xs ${s <= item.score ? 'text-amber-400' : 'text-slate-600'}`}>★</span>)}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

/* ─── Earnings Mini Chart ─── */
export function EarningsMiniChart() {
  const { isDark } = useTheme()
  const bars = [50, 70, 60, 85, 75, 100]
  const months = ['A', 'S', 'O', 'N', 'D', 'J']

  return (
    <GlassCard className="p-5">
      <h3 className="font-semibold font-display mb-4">Earnings (6mo)</h3>
      <div className="flex items-end gap-2 h-20">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col gap-1 items-center">
            <motion.div
              className={`w-full rounded-t ${i === bars.length - 1 ? 'bg-gradient-to-t from-primary to-secondary' : 'bg-primary/30 hover:bg-primary/50 transition-colors'}`}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
              style={{ height: `${h}%`, transformOrigin: 'bottom' }}
            />
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{months[i]}</span>
          </div>
        ))}
      </div>
      <div className={`mt-3 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Best month: <span className="text-primary font-semibold">January $4,820</span>
      </div>
    </GlassCard>
  )
}
