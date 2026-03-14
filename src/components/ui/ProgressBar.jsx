import { motion } from 'framer-motion'
import { useInView } from '../../hooks/useInView'

export default function ProgressBar({ value = 0, color = 'primary', height = 'sm', showLabel = false, label = '' }) {
  const { ref, inView } = useInView()

  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' }

  const gradients = {
    primary: 'bg-gradient-to-r from-primary to-secondary',
    emerald: 'bg-gradient-to-r from-emerald-400 to-teal-400',
    accent: 'bg-gradient-to-r from-accent to-blue-400',
    amber: 'bg-gradient-to-r from-amber-400 to-orange-400',
    slate: 'bg-slate-500',
  }

  return (
    <div ref={ref}>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>{label}</span>
          <span className="font-semibold" style={{ color: color === 'primary' ? '#A5B4FC' : undefined }}>{value}%</span>
        </div>
      )}
      <div className={`${heights[height]} rounded-full bg-white/8 overflow-hidden`}>
        <motion.div
          className={`h-full rounded-full ${gradients[color] || gradients.primary}`}
          initial={{ width: 0 }}
          animate={{ width: inView ? `${value}%` : 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
        />
      </div>
    </div>
  )
}
