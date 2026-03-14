import { motion } from 'framer-motion'
import { useInView } from '../../hooks/useInView'
import GlassCard from '../ui/GlassCard'
import ProgressBar from '../ui/ProgressBar'
import { useTheme } from '../../context/ThemeContext'

const features = [
  { icon: '🧠', title: 'AI Milestones', desc: 'Automatically break projects into smart milestones with deadlines, dependencies and auto-verification built in.', metric: 'Planning accuracy', value: 96, color: 'primary' },
  { icon: '🔐', title: 'Smart Escrow', desc: 'Funds held in AI-governed escrow. Released automatically when milestones pass quality checks.', metric: 'Payment success rate', value: 99, color: 'emerald', valueLabel: '99.8%' },
  { icon: '✅', title: 'Quality Checks', desc: 'Automated code review, design critique, and deliverable scanning ensure every submission meets spec.', metric: 'Defects caught', value: 80, color: 'accent', valueLabel: '2.4k+' },
  { icon: '⭐', title: 'Reputation Score', desc: 'AI-calculated scores based on delivery speed, quality, communication and client satisfaction.', metric: 'Avg freelancer score', value: 94, color: 'amber', valueLabel: '94.2' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
}

export default function Features() {
  const { ref, inView } = useInView()
  const { isDark } = useTheme()

  return (
    <section className="py-28 px-4 sm:px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm text-primary">
            <span>⬡</span> Platform Features
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold font-display mb-5">
            Everything you need to <span className="gradient-text">execute</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            From kick-off to payment, WorkSynth's AI handles the complexity so you can focus on what matters.
          </p>
        </motion.div>

        {/* Main grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item}>
              <GlassCard hover className="p-7 h-full group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center mb-5 text-2xl group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold font-display mb-3">{f.title}</h3>
                <p className={`text-sm leading-relaxed mb-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{f.desc}</p>
                <div className={`pt-4 border-t ${isDark ? 'border-white/8' : 'border-slate-100'}`}>
                  <ProgressBar
                    value={f.value}
                    color={f.color}
                    height="sm"
                    showLabel
                    label={f.metric}
                  />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Second row */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid md:grid-cols-3 gap-6 mt-6"
        >
          {/* AI Matching */}
          <motion.div variants={item} className="md:col-span-2">
            <GlassCard hover className="p-7 h-full group flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/10 flex items-center justify-center mb-5 text-2xl group-hover:scale-110 transition-transform duration-300">🤝</div>
                <h3 className="text-lg font-bold font-display mb-3">AI Matching Engine</h3>
                <p className={`text-sm leading-relaxed max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Our model analyzes 87 signals to match your project with the most compatible freelancer — saving hours of screening.
                </p>
              </div>
              <div className="hidden md:flex flex-col gap-2 min-w-[180px] w-full md:w-auto">
                {[
                  { name: 'Alex M.', match: 98, color: 'bg-emerald-400', textColor: 'text-emerald-400' },
                  { name: 'Sam K.', match: 91, color: 'bg-primary', textColor: 'text-primary' },
                  { name: 'Priya R.', match: 87, color: 'bg-secondary', textColor: 'text-secondary' },
                ].map(m => (
                  <div key={m.name} className={`glass rounded-xl p-3 text-xs`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{m.name}</span>
                      <span className={`font-bold ${m.textColor}`}>{m.match}% match</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10">
                      <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.match}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Analytics */}
          <motion.div variants={item}>
            <GlassCard hover className="p-7 h-full group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 flex items-center justify-center mb-5 text-2xl group-hover:scale-110 transition-transform duration-300">📊</div>
              <h3 className="text-lg font-bold font-display mb-3">Live Analytics</h3>
              <p className={`text-sm leading-relaxed mb-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Real-time dashboards for spend, velocity, and team performance.
              </p>
              <div className="flex gap-1 items-end h-14">
                {[40, 65, 50, 80, 60, 100].map((h, i) => (
                  <motion.div
                    key={i}
                    className={`flex-1 rounded-t transition-all ${i === 5 ? 'bg-gradient-to-t from-primary to-secondary' : 'bg-primary/30 hover:bg-primary/60'}`}
                    style={{ height: `${h}%` }}
                    initial={{ scaleY: 0 }}
                    animate={inView ? { scaleY: 1 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                  />
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
