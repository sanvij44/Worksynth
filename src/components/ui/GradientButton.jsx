import { motion } from 'framer-motion'

export default function GradientButton({ children, onClick, className = '', variant = 'gradient', size = 'md', type = 'button' }) {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  if (variant === 'outline') {
    return (
      <motion.button
        type={type}
        onClick={onClick}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className={`${sizes[size]} rounded-xl border border-white/15 hover:border-primary/50 hover:bg-white/5 transition-all font-semibold ${className}`}
      >
        {children}
      </motion.button>
    )
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: '0 12px 35px rgba(99,102,241,0.45)' }}
      whileTap={{ scale: 0.97 }}
      className={`gradient-btn ${sizes[size]} rounded-xl font-semibold text-white ${className}`}
    >
      {children}
    </motion.button>
  )
}
