import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

export default function Sidebar({ links = [], header, footer }) {
  const location = useLocation()
  const { isDark } = useTheme()

  return (
    <aside className={`fixed left-0 top-16 bottom-0 w-60 flex-col py-6 border-r z-40 hidden md:flex ${
      isDark ? 'bg-card-dark/80 border-white/8' : 'bg-white border-slate-200'
    } backdrop-blur-xl`}>
      {header && <div className="px-4 mb-6">{header}</div>}

      <nav className="flex-1 space-y-0.5 px-2 overflow-y-auto">
        {links.map((link, i) => {
          const isActive = link.to
            ? location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to))
            : false

          if (link.divider) return (
            <div key={i} className={`my-4 border-t ${isDark ? 'border-white/8' : 'border-slate-200'}`} />
          )

          const content = (
            <div
              className={`sidebar-link ${isActive ? 'active' : ''} ${!isDark ? 'text-slate-600 hover:text-primary' : ''}`}
            >
              {link.icon && <span className="text-base w-5 flex-shrink-0">{link.icon}</span>}
              <span>{link.label}</span>
              {link.badge && (
                <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold">
                  {link.badge}
                </span>
              )}
            </div>
          )

          return link.to ? (
            <Link key={i} to={link.to}>{content}</Link>
          ) : (
            <div key={i} onClick={link.onClick}>{content}</div>
          )
        })}
      </nav>

      {footer && <div className="px-4 mt-4">{footer}</div>}
    </aside>
  )
}
