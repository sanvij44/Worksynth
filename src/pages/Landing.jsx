import { motion } from 'framer-motion'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import { Stats, Testimonials, Pricing, CTABanner } from '../components/landing/LandingSections'
import Footer from '../components/layout/Footer'
import { useTheme } from '../context/ThemeContext'

// Logos bar data
const logos = ['Stripe', 'Notion', 'Figma', 'Vercel', 'Linear', 'Resend']

export default function Landing() {
  const { isDark } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Hero />

      {/* Logos bar */}
      <section className={`py-12 border-y ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <p className={`text-center text-sm mb-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {logos.map(logo => (
              <motion.span
                key={logo}
                className={`text-xl font-bold font-display ${isDark ? 'text-slate-600' : 'text-slate-300'} hover:text-primary transition-colors cursor-pointer`}
                whileHover={{ scale: 1.05 }}
              >
                {logo}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      <Features />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <Pricing />
      <CTABanner />
      <Footer />
    </motion.div>
  )
}
