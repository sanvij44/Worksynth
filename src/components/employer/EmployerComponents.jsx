import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../ui/GlassCard'
import Badge from '../ui/Badge'
import ProgressBar from '../ui/ProgressBar'
import { useTheme } from '../../context/ThemeContext'
import { projects, employerStats } from '../../data/projects'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

/* ─── Stats Cards ─── */
export function EmployerStatsCards() {
  const { isDark } = useTheme()
  const stats = [
    { label: 'ACTIVE PROJECTS', value: employerStats.activeProjects, sub: '↑ 2 this week', subColor: 'text-emerald-400' },
    { label: 'TOTAL SPEND', value: `$${(employerStats.totalSpend / 1000).toFixed(1)}k`, sub: `of $${employerStats.budget / 1000}k budget`, subColor: isDark ? 'text-slate-400' : 'text-slate-500' },
    { label: 'ON-TIME RATE', value: `${employerStats.onTimeRate}%`, sub: '↑ Above avg', subColor: 'text-emerald-400', valueColor: 'text-emerald-400' },
    { label: 'FREELANCERS', value: employerStats.freelancers, sub: 'Active contractors', subColor: isDark ? 'text-slate-400' : 'text-slate-500' },
  ]

  return (
    <motion.div
      variants={container} initial="hidden" animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
    >
      {stats.map(s => (
        <motion.div key={s.label} variants={item}>
          <GlassCard hover className="p-5">
            <div className={`text-xs font-semibold mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{s.label}</div>
            <div className={`text-3xl font-bold font-display mb-1 ${s.valueColor || ''}`}>{s.value}</div>
            <div className={`text-xs ${s.subColor}`}>{s.sub}</div>
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ─── Projects Grid ─── */
export function ProjectsGrid({ limit }) {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const displayProjects = limit ? projects.slice(0, limit) : projects

  return (
    <motion.div
      variants={container} initial="hidden" animate="show"
      className="grid md:grid-cols-2 xl:grid-cols-3 gap-5"
    >
      {displayProjects.map(p => (
        <motion.div key={p.id} variants={item}>
          <GlassCard hover className="p-5" onClick={() => navigate(`/project/${p.id}`)}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-semibold text-sm mb-1">{p.title}</div>
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{p.category}</div>
              </div>
              <Badge status={p.status} />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${p.freelancer.color} flex items-center justify-center text-xs font-bold text-white`}>
                {p.freelancer.avatar}
              </div>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{p.freelancer.name}</span>
            </div>

            <ProgressBar
              value={p.progress}
              color={p.status === 'done' ? 'emerald' : 'primary'}
              showLabel
              label="Progress"
            />

            <div className={`flex items-center justify-between text-xs mt-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>📅 Due {p.deadline}</span>
              <span className="text-emerald-400 font-semibold">${p.budget.toLocaleString()} escrowed</span>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ─── Milestone Progress ─── */
export function MilestoneProgressList() {
  const { isDark } = useTheme()
  const milestones = [
    { label: 'Design System Audit', value: 100, color: 'emerald', status: 'Completed' },
    { label: 'Wireframes Review', value: 75, color: 'primary', status: '75%' },
    { label: 'API Documentation', value: 45, color: 'accent', status: '45%' },
    { label: 'Frontend Integration', value: 20, color: 'slate', status: '20%' },
  ]

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold font-display">Milestone Progress</h2>
        <Badge status="done" label="All On Track" />
      </div>
      <div className="space-y-5">
        {milestones.map(m => (
          <div key={m.label}>
            <div className="flex justify-between text-sm mb-2">
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{m.label}</span>
              <span className={`font-semibold ${m.color === 'emerald' ? 'text-emerald-400' : m.color === 'accent' ? 'text-accent' : m.color === 'primary' ? 'text-primary' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>{m.status}</span>
            </div>
            <ProgressBar value={m.value} color={m.color} height="md" />
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

/* ─── Projects Table ─── */
export function ProjectsTable() {
  const navigate = useNavigate()
  const { isDark } = useTheme()

  return (
    <GlassCard className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
              {['Project', 'Freelancer', 'Status', 'Progress', 'Budget'].map(h => (
                <th key={h} className={`text-left px-5 py-4 font-semibold text-xs uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'} ${h === 'Freelancer' || h === 'Status' || h === 'Budget' ? 'hidden md:table-cell' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
            {projects.map(p => (
              <motion.tr
                key={p.id}
                className={`transition-colors cursor-pointer ${isDark ? 'hover:bg-white/3' : 'hover:bg-slate-50'}`}
                onClick={() => navigate(`/project/${p.id}`)}
                whileHover={{ x: 2 }}
              >
                <td className="px-5 py-4">
                  <div className="font-medium">{p.title}</div>
                  <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{p.category}</div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${p.freelancer.color} flex items-center justify-center text-xs text-white font-bold`}>{p.freelancer.avatar}</div>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{p.freelancer.name.split(' ')[0]} {p.freelancer.name.split(' ')[1][0]}.</span>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell"><Badge status={p.status} /></td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <div className="flex-1 h-1.5 rounded-full bg-white/10">
                      <div className={`h-full rounded-full ${p.status === 'done' ? 'bg-emerald-400' : 'bg-gradient-to-r from-primary to-secondary'}`} style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className={`text-xs w-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{p.progress}%</span>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell font-semibold text-emerald-400">${p.budget.toLocaleString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}
