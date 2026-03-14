import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '', hover = false, onClick, style = {} }) {
  const Component = hover ? motion.div : 'div'
  const hoverProps = hover ? {
    whileHover: { y: -6, boxShadow: '0 24px 60px rgba(99,102,241,0.18)' },
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  } : {}

  return (
    <Component
      onClick={onClick}
      className={`glass rounded-2xl ${hover ? 'cursor-pointer' : ''} ${className}`}
      style={style}
      {...hoverProps}
    >
      {children}
    </Component>
  )
}
