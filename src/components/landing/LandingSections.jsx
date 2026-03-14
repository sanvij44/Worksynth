import { motion } from 'framer-motion'
import { useInView } from '../../hooks/useInView'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../ui/GlassCard'
import GradientButton from '../ui/GradientButton'
import StarRating from '../ui/StarRating'
import { testimonials, pricingPlans } from '../../data/index'

/* ─── Stats ─── */
export function Stats() {
  const { ref, inView } = useInView()
  const { isDark } = useTheme()
  const stats = [
    { value: '$42M+', label: 'Escrow processed' },
    { value: '98.4%', label: 'On-time delivery' },
    { value: '12k+', label: 'Active freelancers' },
    { value: '4.9★', label: 'Platform rating' },
  ]

  return (
    <section ref={ref} className={`py-20 px-4 sm:px-6 border-y ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div className="text-3xl lg:text-4xl font-bold gradient-text font-display mb-2">{s.value}</div>
            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ─── Testimonials ─── */
export function Testimonials() {
  const { ref, inView } = useInView()
  const { isDark } = useTheme()

  return (
    <section ref={ref} className="py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold font-display mb-5">
            What teams are <span className="gradient-text">saying</span>
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Real stories from real users</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <GlassCard hover className={`p-7 h-full ${i === 1 ? 'border-primary/30' : ''}`}>
                <StarRating rating={t.rating} size="sm" />
                <p className={`leading-relaxed my-5 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center font-bold text-white`}>{t.avatar}</div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.role}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Pricing ─── */
export function Pricing() {
  const { ref, inView } = useInView()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  return (
    <section ref={ref} className="py-28 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm text-accent">
            <span>◎</span> Transparent Pricing
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold font-display mb-5">
            Simple, <span className="gradient-text">honest</span> pricing
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>No hidden fees. Cancel anytime.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <motion.div
                  animate={{ scale: [1, 1.05, 1], opacity: [0.85, 1, 0.85] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10"
                >
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold whitespace-nowrap">
                    ✦ MOST POPULAR
                  </div>
                </motion.div>
              )}

              <GlassCard
                hover
                className={`p-8 h-full ${plan.popular ? 'border-primary/40' : ''}`}
                style={plan.popular ? { background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.06))' } : {}}
              >
                <div className={`text-xs font-semibold mb-1 ${plan.popular ? 'text-primary' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {plan.name.toUpperCase()}
                </div>
                <div className="text-4xl font-bold font-display mb-1">
                  {plan.price === null ? 'Custom' : plan.price === 0 ? '$0' : `$${plan.price}`}
                </div>
                <div className={`text-sm mb-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{plan.period}</div>

                <ul className="space-y-3 text-sm mb-8">
                  {plan.features.map(f => (
                    <li key={f.text} className={`flex items-center gap-2 ${f.included ? isDark ? 'text-slate-300' : 'text-slate-700' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span className={f.included ? 'text-emerald-400' : isDark ? 'text-slate-600' : 'text-slate-300'}>
                        {f.included ? '✓' : '✗'}
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>

                {plan.ctaVariant === 'gradient' ? (
                  <GradientButton className="w-full justify-center" onClick={() => navigate('/signup')}>
                    {plan.cta}
                  </GradientButton>
                ) : (
                  <GradientButton className="w-full justify-center" variant="outline" onClick={() => navigate('/signup')}>
                    {plan.cta}
                  </GradientButton>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA Banner ─── */
export function CTABanner() {
  const { ref, inView } = useInView()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(139,92,246,0.14), rgba(6,182,212,0.08))',
            border: '1px solid rgba(99,102,241,0.3)'
          }}
        >
          <div className="absolute inset-0 mesh-bg pointer-events-none" />
          <div className="relative">
            <h2 className="text-4xl lg:text-5xl font-bold font-display mb-5">
              Ready to synthesize<br />
              <span className="gradient-text">your workflow?</span>
            </h2>
            <p className={`text-lg mb-10 max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Join 12,000+ professionals who ship faster and get paid smarter with WorkSynth.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <GradientButton size="lg" onClick={() => navigate('/signup')}>Start for Free →</GradientButton>
              <GradientButton size="lg" variant="outline">Schedule Demo</GradientButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
