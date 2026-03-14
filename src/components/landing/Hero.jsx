import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AIOrb from './AIOrb'
import GradientButton from '../ui/GradientButton'
import { useTheme } from '../../context/ThemeContext'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1], delay },
})

const floatingCard = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay },
})

export default function Hero() {
  const navigate = useNavigate()
  const { isDark } = useTheme()

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden mesh-bg pt-16">
      {/* Background blobs */}
      <div className="absolute top-24 left-8 w-72 h-72 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #6366F1, transparent)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-24 right-8 w-96 h-96 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)', filter: 'blur(80px)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-5 pointer-events-none" style={{ background: 'radial-gradient(circle, #06B6D4, transparent)', filter: 'blur(100px)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full py-20">
        {/* Left content */}
        <div>
          <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm">
            <motion.span
              className="w-2 h-2 rounded-full bg-accent"
              animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Now in Public Beta — Join 12,000+ teams</span>
          </motion.div>

          <motion.h1 {...fadeUp(0.2)} className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display leading-[1.04] mb-6">
            Freelance Work,<br />
            <span className="gradient-text">Synthesized</span><br />
            by AI.
          </motion.h1>

          <motion.p {...fadeUp(0.3)} className={`text-lg lg:text-xl leading-relaxed mb-10 max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            WorkSynth automates milestones, escrow, quality checks and reputation — so you ship faster, get paid smarter, and scale without the chaos.
          </motion.p>

          <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-4 mb-12">
            <GradientButton size="lg" onClick={() => navigate('/signup')}>
              Start as Employer →
            </GradientButton>
            <GradientButton size="lg" variant="outline" onClick={() => navigate('/signup')}>
              Join as Freelancer
            </GradientButton>
          </motion.div>

          <motion.div {...fadeUp(0.5)} className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[
                { letter: 'A', colors: 'from-violet-400 to-purple-600' },
                { letter: 'M', colors: 'from-cyan-400 to-blue-600' },
                { letter: 'S', colors: 'from-pink-400 to-rose-600' },
                { letter: 'J', colors: 'from-amber-400 to-orange-600' },
              ].map(({ letter, colors }, i) => (
                <div key={i} className={`w-9 h-9 rounded-full border-2 ${isDark ? 'border-bg-dark' : 'border-white'} bg-gradient-to-br ${colors} flex items-center justify-center text-white text-xs font-bold`}>
                  {letter}
                </div>
              ))}
              <div className={`w-9 h-9 rounded-full border-2 ${isDark ? 'border-bg-dark' : 'border-white'} glass flex items-center justify-center text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>+9k</div>
            </div>
            <div>
              <div className="flex gap-0.5 mb-1">
                {[1,2,3,4,5].map(i => <span key={i} className="text-amber-400 text-sm">★</span>)}
              </div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Trusted by 12,000+ professionals</p>
            </div>
          </motion.div>
        </div>

        {/* Right: 3D orb + floating cards */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          className="relative h-[500px] lg:h-[580px] flex items-center justify-center"
        >
          {/* Orb canvas */}
          <div className="w-80 h-80 lg:w-[420px] lg:h-[420px] relative">
            {/* Decorative rings */}
            <div className="absolute inset-0 rounded-full border border-primary/15 animate-spin-slow" />
            <div className="absolute inset-4 rounded-full border border-secondary/10" style={{ animationDuration: '14s', animation: 'spin 14s linear infinite reverse' }} />
            {/* Ripple rings */}
            <div className="absolute inset-8 rounded-full border border-primary/10 orb-ripple" />
            <div className="absolute inset-8 rounded-full border border-primary/10 orb-ripple-delayed" />
            <AIOrb />
          </div>

          {/* Floating card: AI Milestone */}
          <motion.div
            {...floatingCard(0.6)}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute left-0 top-16 glass rounded-2xl p-4 w-48 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs">✓</div>
              <span className="text-xs font-semibold">AI Milestone</span>
            </div>
            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-2`}>Auto-verified in 2 min</div>
            <div className="h-1.5 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-emerald-400 w-4/5" />
            </div>
          </motion.div>

          {/* Floating card: Smart Escrow */}
          <motion.div
            {...floatingCard(0.8)}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            className="absolute right-0 bottom-24 glass rounded-2xl p-4 w-46 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold">Smart Escrow</span>
              <span className="badge badge-done" style={{ padding: '2px 8px', fontSize: '10px' }}>Locked</span>
            </div>
            <div className="text-2xl font-bold gradient-text font-display">$4,200</div>
            <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Released on approval</div>
          </motion.div>

          {/* Floating card: Quality Score */}
          <motion.div
            {...floatingCard(1.0)}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute right-8 top-10 glass rounded-2xl p-4 w-36 shadow-xl"
          >
            <div className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Quality Score</div>
            <div className="text-2xl font-bold text-accent font-display">98%</div>
            <div className="flex gap-0.5 mt-1">
              {[1,2,3,4,5].map(i => <span key={i} className="text-amber-400 text-xs">★</span>)}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
      >
        <span className="text-xs">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
          <motion.div
            className="w-1 h-2 rounded-full bg-primary"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
