import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '../ui/GlassCard'
import Badge from '../ui/Badge'
import GradientButton from '../ui/GradientButton'
import { useTheme } from '../../context/ThemeContext'

/* ─── Milestone Timeline ─── */
export function MilestoneTimeline({ milestones = [] }) {
  const { isDark } = useTheme()

  const defaultMilestones = [
    { id: 'm1', title: 'Research & Discovery', status: 'done', amount: 640, due: 'Jan 10–12', desc: 'User research, competitor analysis, and project brief review. Delivered stakeholder report.' },
    { id: 'm2', title: 'Information Architecture', status: 'done', amount: 640, due: 'Jan 13–16', desc: 'Sitemap, user flows, and navigation patterns defined and approved.' },
    { id: 'm3', title: 'Wireframes & Prototypes', status: 'review', amount: 640, due: 'Jan 17–23', desc: 'High-fidelity wireframes for 12 core screens. Interactive Figma prototype submitted.' },
    { id: 'm4', title: 'Visual Design', status: 'pending', amount: 640, due: 'Jan 24–26', desc: 'Final UI designs for all screens with design system documentation.' },
    { id: 'm5', title: 'Handoff & Documentation', status: 'pending', amount: 640, due: 'Jan 27–28', desc: 'Developer handoff assets, component specs, and animation guidelines.' },
  ]

  const items = milestones.length ? milestones : defaultMilestones

  return (
    <div className="space-y-2">
      {items.map((m, i) => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className={`relative ${i < items.length - 1 ? 'timeline-connector' : ''}`}
        >
          <div className="flex gap-4">
            {/* Status dot */}
            <div className="flex-shrink-0 mt-1">
              {m.status === 'done' ? (
                <motion.div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 relative"
                  style={{ background: '#059669', border: '2px solid #34D399' }}
                  whileHover={{ scale: 1.1 }}
                >✓</motion.div>
              ) : m.status === 'review' ? (
                <motion.div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 relative pulse-glow"
                  style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)', border: '2px solid #FCD34D' }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >●</motion.div>
              ) : (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs z-10 relative"
                  style={{ background: 'rgba(99,102,241,0.15)', border: '2px solid rgba(99,102,241,0.3)', color: '#A5B4FC' }}
                >{i + 1}</div>
              )}
            </div>

            {/* Card */}
            <GlassCard
              hover
              className={`flex-1 p-4 mb-4 ${m.status === 'done' ? 'border-emerald-500/20' : m.status === 'review' ? 'border-amber-500/25' : 'opacity-75'}`}
              style={m.status === 'review' ? { background: 'rgba(245,158,11,0.05)' } : {}}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-sm">{m.title}</div>
                <Badge status={m.status} />
              </div>
              <p className={`text-xs mb-3 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{m.desc}</p>
              <div className={`flex items-center justify-between text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>📅 {m.due}</span>
                <span className={m.status === 'done' ? 'text-emerald-400 font-semibold' : m.status === 'review' ? 'text-amber-400 font-semibold' : ''}>${m.amount} {m.status === 'done' ? 'released' : m.status === 'review' ? 'pending' : 'locked'}</span>
              </div>

              {/* Review actions */}
              {m.status === 'review' && (
                <div className="mt-3 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all"
                  >Approve</motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                  >Request Changes</motion.button>
                </div>
              )}
            </GlassCard>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/* ─── Submission Upload ─── */
export function SubmissionUpload() {
  const [uploaded, setUploaded] = useState(false)
  const [dragging, setDragging] = useState(false)
  const { isDark } = useTheme()

  const handleClick = () => {
    setUploaded(true)
    setTimeout(() => setUploaded(false), 3000)
  }

  return (
    <GlassCard className="p-5">
      <h3 className="font-semibold font-display text-sm mb-4">Submit Deliverable</h3>

      <AnimatePresence mode="wait">
        <motion.div
          key={uploaded ? 'uploaded' : 'empty'}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={handleClick}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragging || uploaded
              ? 'border-primary/60 bg-primary/5'
              : isDark ? 'border-white/15 hover:border-primary/40 hover:bg-white/3' : 'border-slate-300 hover:border-primary/40 hover:bg-primary/3'
          }`}
        >
          {uploaded ? (
            <>
              <div className="text-3xl mb-2">✅</div>
              <div className="text-sm font-medium text-emerald-400">File accepted!</div>
              <div className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>wireframes_v3.fig • 14.2 MB</div>
            </>
          ) : (
            <>
              <div className="text-3xl mb-2">☁️</div>
              <div className="text-sm font-medium mb-1">Drop files here</div>
              <div className={`text-xs mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>or click to browse</div>
              <div className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Figma, Sketch, PDF, ZIP — up to 50MB</div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Existing files */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">F</div>
          <span className={`flex-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>wireframes_v3_final.fig</span>
          <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>12.4 MB</span>
          <span className="text-emerald-400">✓</span>
        </div>
      </div>

      <GradientButton className="w-full mt-4 justify-center">Submit for Review</GradientButton>
    </GlassCard>
  )
}

/* ─── AI Quality Check Panel ─── */
export function AIQualityCheck() {
  const { isDark } = useTheme()
  const checks = [
    { pass: true, text: 'All screens delivered (12/12)' },
    { pass: true, text: 'Matches design brief requirements' },
    { pass: true, text: 'Accessibility score: 94/100' },
    { pass: 'warn', text: 'Mobile views need minor padding fixes' },
  ]

  return (
    <GlassCard className="p-5 border-accent/20">
      <div className="flex items-center gap-2 mb-4">
        <motion.span
          className="text-accent text-lg"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >✦</motion.span>
        <h3 className="font-semibold font-display text-sm">AI Quality Check</h3>
        <Badge status="done" label="A+" className="ml-auto text-xs" />
      </div>
      <div className="space-y-3">
        {checks.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-2 text-xs"
          >
            <span className={c.pass === true ? 'text-emerald-400' : 'text-amber-400'}>{c.pass === true ? '✓' : '!'}</span>
            <span className={c.pass === true ? isDark ? 'text-slate-300' : 'text-slate-700' : isDark ? 'text-slate-400' : 'text-slate-500'}>{c.text}</span>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}

/* ─── Activity Feed ─── */
export function ActivityFeed() {
  const { isDark } = useTheme()
  const activities = [
    { color: 'bg-amber-400', text: 'Anika submitted milestone 3', time: 'Today, 2:34 PM' },
    { color: 'bg-emerald-400', text: 'AI quality check passed (98%)', time: 'Today, 2:35 PM' },
    { color: 'bg-primary', text: 'Milestone 2 payment released', time: 'Jan 16, 11:20 AM' },
    { color: 'bg-slate-500', text: 'Project kickoff meeting held', time: 'Jan 10, 9:00 AM' },
  ]

  return (
    <GlassCard className="p-5">
      <h3 className="font-semibold font-display text-sm mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            className="flex gap-3 text-xs"
          >
            <div className={`w-1.5 h-1.5 rounded-full ${a.color} mt-1.5 flex-shrink-0`} />
            <div>
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{a.text}</span>
              <div className={`mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{a.time}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}
