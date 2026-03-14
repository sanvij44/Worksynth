import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const footerLinks = {
  Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
}

export default function Footer() {
  const { isDark } = useTheme()

  return (
    <footer className={`py-16 px-6 border-t ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl rotate-6" />
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm font-display">WS</div>
              </div>
              <span className="text-xl font-bold font-display">Work<span className="gradient-text">Synth</span></span>
            </div>
            <p className={`text-sm leading-relaxed max-w-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              AI Powered Freelance Execution System. The smartest way to manage freelance work at scale.
            </p>
            <div className="flex gap-3 mt-6">
              {['𝕏', 'in', '◎'].map((icon, i) => (
                <a key={i} className={`w-9 h-9 glass rounded-xl flex items-center justify-center transition-all cursor-pointer text-sm font-bold ${isDark ? 'text-slate-400 hover:text-white hover:bg-primary/20' : 'text-slate-500 hover:text-primary hover:bg-primary/10'}`}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className={`font-bold mb-4 text-sm font-display ${isDark ? '' : 'text-slate-900'}`}>{category}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link}>
                    <a className={`text-sm transition-colors cursor-pointer ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>© 2025 WorkSynth Inc. All rights reserved.</p>
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Built with AI. Powered by humans.</p>
        </div>
      </div>
    </footer>
  )
}
