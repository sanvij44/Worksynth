import { motion } from 'framer-motion'
import { useInView } from '../../hooks/useInView'
import { useTheme } from '../../context/ThemeContext'

const steps = [
  { num: 1, icon: '📝', title: 'Post Your Project', desc: 'Describe your project. AI breaks it into milestones, sets budgets and creates the scope in seconds.' },
  { num: 2, icon: '🤖', title: 'AI Executes', desc: 'Get matched with vetted freelancers. AI monitors progress, checks quality and handles disputes automatically.' },
  { num: 3, icon: '💸', title: 'Ship & Get Paid', desc: 'Approve deliverables and funds release instantly from escrow. Both parties get reputation updates.' },
]

export default function HowItWorks() {
  const { ref, inView } = useInView()
  const { isDark } = useTheme()

  return (
    <section className="py-28 px-4 sm:px-6 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm text-secondary">
            <span>◈</span> Simple Process
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold font-display mb-5">
            How <span className="gradient-text">WorkSynth</span> works
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Three steps from idea to completion</p>
        </motion.div>

        <div className="relative grid lg:grid-cols-3 gap-8">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-14 left-[20%] right-[20%] h-px" style={{ background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #06B6D4)' }} />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="text-center"
            >
              <div className="relative w-28 h-28 mx-auto mb-8">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: `linear-gradient(135deg, rgba(99,102,241,${0.15 + i * 0.05}), rgba(6,182,212,0.08))`, border: '1px solid rgba(99,102,241,0.3)' }}
                  whileHover={{ scale: 1.05 }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-4xl">{step.icon}</div>
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-btn flex items-center justify-center text-white font-bold text-sm font-display"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {step.num}
                </motion.div>
              </div>
              <h3 className="text-xl font-bold font-display mb-3">{step.title}</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
