import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Sparkles, ArrowRight, Github, Chrome, Linkedin, Check } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'

const ROLES = [
  { id: 'employer',   icon: '🏢', label: 'Employer',   desc: 'Post projects, manage freelancers, track delivery' },
  { id: 'freelancer', icon: '💻', label: 'Freelancer', desc: 'Find projects, deliver work, build reputation' },
]

const passwordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' }
  let score = 0
  if (pwd.length >= 8)          score++
  if (/[A-Z]/.test(pwd))        score++
  if (/[0-9]/.test(pwd))        score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  const map = {
    0: { label: '',       color: '' },
    1: { label: 'Weak',   color: 'bg-rose-500' },
    2: { label: 'Fair',   color: 'bg-amber-500' },
    3: { label: 'Good',   color: 'bg-primary' },
    4: { label: 'Strong', color: 'bg-emerald-500' },
  }
  return { score, ...map[score] }
}

export default function Signup() {
  const { isDark }      = useTheme()
  const { login }       = useApp()
  const navigate        = useNavigate()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState({})
  const [form, setForm] = useState({
    role: '', firstName: '', lastName: '', email: '', password: '', agree: false,
  })
  const [socialConfirm, setSocialConfirm] = useState(null) // { provider: 'GitHub' | 'Google' | 'LinkedIn' }
  const [socialConnectValue, setSocialConnectValue] = useState('')
  const [socialConnectError, setSocialConnectError] = useState('')

  const pwdStrength = passwordStrength(form.password)
  const update = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const validateStep1 = () => {
    const e = {}
    if (!form.role) e.role = 'Please select a role'
    return e
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim())  e.lastName  = 'Last name is required'
    if (!form.email)            e.email     = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password)               e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'At least 6 characters'
    if (!form.agree) e.agree = 'You must accept the terms'
    return e
  }

  const handleNext = () => {
    const errs = validateStep1()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateStep2()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    login({ role: form.role, email: form.email, name: `${form.firstName} ${form.lastName}` })
    navigate(form.role === 'employer' ? '/employer' : '/freelancer', { replace: true })
  }

  const handleSocialSignupClick = (provider) => {
    if (!form.role) { setErrors({ role: 'Please select a role first' }); return }
    setSocialConfirm({ provider })
    setSocialConnectValue('')
    setSocialConnectError('')
  }
  const getSocialPrompt = () => {
    if (!socialConfirm) return { label: '', placeholder: '' }
    if (socialConfirm.provider === 'GitHub') return { label: 'GitHub profile URL', placeholder: 'https://github.com/yourusername' }
    if (socialConfirm.provider === 'LinkedIn') return { label: 'LinkedIn profile URL', placeholder: 'https://linkedin.com/in/yourprofile' }
    if (socialConfirm.provider === 'Google') return { label: 'Google / Gmail address', placeholder: 'you@gmail.com' }
    return { label: '', placeholder: '' }
  }
  const validateSocialConnect = () => {
    const v = socialConnectValue.trim()
    if (!v) {
      setSocialConnectError('This field is required')
      return false
    }
    if (socialConfirm.provider === 'Google') {
      if (!/\S+@\S+\.\S+/.test(v)) {
        setSocialConnectError('Enter a valid email address')
        return false
      }
    } else {
      const isUrl = /^https?:\/\//i.test(v)
      const githubOk = socialConfirm.provider === 'GitHub' && (isUrl ? v.includes('github.com') : /^[a-zA-Z0-9_-]+$/.test(v))
      const linkedInOk = socialConfirm.provider === 'LinkedIn' && (isUrl ? v.includes('linkedin.com') : v.length >= 3)
      if (socialConfirm.provider === 'GitHub' && !githubOk) {
        setSocialConnectError('Enter a valid GitHub profile URL or username')
        return false
      }
      if (socialConfirm.provider === 'LinkedIn' && !linkedInOk) {
        setSocialConnectError('Enter a valid LinkedIn profile URL')
        return false
      }
    }
    setSocialConnectError('')
    return true
  }
  const handleSocialConnectSubmit = (e) => {
    e?.preventDefault()
    if (!socialConfirm) return
    if (!validateSocialConnect()) return
    const v = socialConnectValue.trim()
    const role = form.role
    const destination = role === 'employer' ? '/employer' : '/freelancer'
    if (socialConfirm.provider === 'Google') {
      login({ role, email: v, name: v.split('@')[0] })
    } else if (socialConfirm.provider === 'GitHub') {
      const githubUrl = v.startsWith('http') ? v : `https://github.com/${v}`
      login({ role, email: `github-${v.replace(/^https?:\/\/[^/]*\/?/, '').replace(/\/$/, '')}@connected`, name: 'GitHub User', githubUrl })
    } else if (socialConfirm.provider === 'LinkedIn') {
      const linkedInUrl = v.startsWith('http') ? v : `https://linkedin.com/in/${v.replace(/^\/+/, '')}`
      login({ role, email: `linkedin-${v.replace(/^https?:\/\/[^/]*\/?/, '').replace(/\/$/, '')}@connected`, name: 'LinkedIn User', linkedInUrl })
    }
    setSocialConfirm(null)
    setSocialConnectValue('')
    setSocialConnectError('')
    navigate(destination, { replace: true })
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border ${
      errors[field]
        ? 'border-rose-500/60 bg-rose-500/5'
        : isDark
          ? 'bg-white/5 border-white/10 text-white placeholder-slate-600 focus:border-primary/60 focus:bg-white/8'
          : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary/50'
    }`

  const perks = [
    'AI-powered milestone generation',
    'Smart escrow — release on approval',
    'Automated quality checks',
    'Verified reputation scores',
    'Real-time project analytics',
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen flex ${isDark ? 'bg-bg-dark' : 'bg-bg-light'}`}
    >
      {/* ── Left branding panel ── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg,#0F172A 0%,#1E1B4B 50%,#0F172A 100%)' }}
      >
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle,#6366F1,transparent)', filter: 'blur(70px)' }} />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle,#06B6D4,transparent)', filter: 'blur(80px)' }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl rotate-6" />
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold font-display">WS</div>
          </div>
          <span className="text-2xl font-bold font-display text-white">
            Work<span className="gradient-text">Synth</span>
          </span>
        </div>

        {/* Centre copy */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-4xl font-bold font-display text-white leading-tight mb-5">
              Everything you need<br />
              to <span className="gradient-text">ship great work.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
              Join 12,000+ employers and freelancers who use WorkSynth to execute projects with AI-powered precision.
            </p>
            <ul className="space-y-3">
              {perks.map((p, i) => (
                <motion.li
                  key={p}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-emerald-400" />
                  </div>
                  {p}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom avatars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="relative flex items-center gap-4"
        >
          <div className="flex -space-x-2.5">
            {['from-violet-400 to-purple-600','from-cyan-400 to-blue-600','from-amber-400 to-orange-600','from-pink-400 to-rose-600'].map((c, i) => (
              <div key={i} className={`w-9 h-9 rounded-full border-2 border-bg-dark bg-gradient-to-br ${c} flex items-center justify-center text-xs font-bold text-white`}>
                {['A','M','J','P'][i]}
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-sm">
            <span className="text-white font-semibold">12,000+</span> professionals already onboard
          </p>
        </motion.div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-10">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl rotate-6" />
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm font-display">WS</div>
            </div>
            <span className="text-xl font-bold font-display">Work<span className="gradient-text">Synth</span></span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > s ? 'bg-emerald-500 text-white'
                  : step === s ? 'bg-primary text-white'
                  : isDark ? 'bg-white/10 text-slate-500' : 'bg-slate-200 text-slate-400'
                }`}>
                  {step > s ? <Check size={13} /> : s}
                </div>
                <span className={`text-xs font-medium ${
                  step === s ? (isDark ? 'text-white' : 'text-slate-800') : (isDark ? 'text-slate-500' : 'text-slate-400')
                }`}>
                  {s === 1 ? 'Choose role' : 'Your details'}
                </span>
                {s < 2 && <div className={`w-8 h-px ${isDark ? 'bg-white/15' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display mb-2">
              {step === 1 ? 'Create your account' : 'Complete your profile'}
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-semibold">Sign in</Link>
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* ── STEP 1 ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Role cards */}
                <p className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  I want to join as…
                </p>
                <div className="space-y-3 mb-5">
                  {ROLES.map(role => (
                    <motion.div
                      key={role.id}
                      onClick={() => { update('role', role.id); setErrors({}) }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all select-none ${
                        form.role === role.id
                          ? 'border-primary/60 bg-primary/8'
                          : isDark
                            ? 'glass border-white/10 hover:border-white/20'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                          form.role === role.id ? 'bg-primary/20' : isDark ? 'bg-white/5' : 'bg-slate-100'
                        }`}>
                          {role.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{role.label}</div>
                          <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{role.desc}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          form.role === role.id ? 'border-primary bg-primary' : isDark ? 'border-white/20' : 'border-slate-300'
                        }`}>
                          {form.role === role.id && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {errors.role && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-rose-400 text-xs mb-4">{errors.role}
                  </motion.p>
                )}

                <motion.button
                  type="button"
                  onClick={handleNext}
                  whileHover={{ y: -2, boxShadow: '0 12px 35px rgba(99,102,241,0.45)' }}
                  whileTap={{ scale: 0.97 }}
                  className="gradient-btn w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight size={16} />
                </motion.button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>or sign up with</span>
                  <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                </div>

                {/* Social */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: <Github size={16} />,   label: 'GitHub' },
                    { icon: <Chrome size={16} />,   label: 'Google' },
                    { icon: <Linkedin size={16} />, label: 'LinkedIn' },
                  ].map(btn => (
                    <motion.button
                      key={btn.label}
                      type="button"
                      whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleSocialSignupClick(btn.label)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        isDark ? 'glass border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/8'
                               : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      {btn.icon} {btn.label}
                    </motion.button>
                  ))}
                </div>

                {/* Social sign-up: ask for GitHub link / LinkedIn link / Gmail and connect */}
                {socialConfirm && (() => {
                  const prompt = getSocialPrompt()
                  return (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                      onClick={() => { setSocialConfirm(null); setSocialConnectError('') }}
                    >
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={e => e.stopPropagation()}
                        className={`w-full max-w-sm rounded-2xl p-6 shadow-xl ${
                          isDark ? 'bg-slate-800/95 border border-white/10' : 'bg-white border border-slate-200'
                        }`}
                      >
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Connect with {socialConfirm.provider}
                        </p>
                        <p className="text-lg font-bold font-display mb-4">
                          Sign up as {ROLES.find(r => r.id === form.role)?.label}
                        </p>
                        <form onSubmit={handleSocialConnectSubmit} className="space-y-4">
                          <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              {prompt.label}
                            </label>
                            <input
                              type={socialConfirm.provider === 'Google' ? 'email' : 'text'}
                              placeholder={prompt.placeholder}
                              value={socialConnectValue}
                              onChange={e => { setSocialConnectValue(e.target.value); setSocialConnectError('') }}
                              className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border ${
                                socialConnectError
                                  ? 'border-rose-500/60 bg-rose-500/5'
                                  : isDark
                                    ? 'bg-white/5 border-white/10 text-white placeholder-slate-600 focus:border-primary/60'
                                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary/50'
                              }`}
                              autoFocus
                            />
                            {socialConnectError && (
                              <p className="text-rose-400 text-xs mt-1.5">{socialConnectError}</p>
                            )}
                          </div>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => { setSocialConfirm(null); setSocialConnectError('') }}
                              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                                isDark ? 'border-white/20 text-slate-300 hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              Cancel
                            </button>
                            <motion.button
                              type="submit"
                              whileHover={{ y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white gradient-btn"
                            >
                              Connect & sign up
                            </motion.button>
                          </div>
                        </form>
                      </motion.div>
                    </motion.div>
                  )
                })()}
              </motion.div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>First name</label>
                      <input type="text" placeholder="Alex" value={form.firstName}
                        onChange={e => update('firstName', e.target.value)} className={inputClass('firstName')} />
                      {errors.firstName && <p className="text-rose-400 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Last name</label>
                      <input type="text" placeholder="Johnson" value={form.lastName}
                        onChange={e => update('lastName', e.target.value)} className={inputClass('lastName')} />
                      {errors.lastName && <p className="text-rose-400 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email address</label>
                    <input type="email" placeholder="you@company.com" value={form.email}
                      onChange={e => update('email', e.target.value)} className={inputClass('email')} />
                    {errors.email && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-rose-400 text-xs mt-1.5">{errors.email}</motion.p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={form.password}
                        onChange={e => update('password', e.target.value)}
                        className={inputClass('password') + ' pr-11'}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Strength meter */}
                    {form.password && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`flex-1 h-1 rounded-full transition-all ${
                              i <= pwdStrength.score ? pwdStrength.color : isDark ? 'bg-white/10' : 'bg-slate-200'
                            }`} />
                          ))}
                        </div>
                        <p className={`text-xs ${
                          pwdStrength.score <= 1 ? 'text-rose-400'
                          : pwdStrength.score === 2 ? 'text-amber-400'
                          : pwdStrength.score === 3 ? 'text-primary'
                          : 'text-emerald-400'
                        }`}>
                          {pwdStrength.label && `${pwdStrength.label} password`}
                        </p>
                      </motion.div>
                    )}
                    {errors.password && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-rose-400 text-xs mt-1.5">{errors.password}</motion.p>
                    )}
                  </div>

                  {/* Terms */}
                  <div>
                    <div className="flex items-start gap-2.5">
                      <button type="button" onClick={() => update('agree', !form.agree)}
                        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all border ${
                          form.agree ? 'bg-primary border-primary text-white'
                          : isDark ? 'border-white/20 bg-white/5' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {form.agree && <Check size={11} />}
                      </button>
                      <label onClick={() => update('agree', !form.agree)}
                        className={`text-sm cursor-pointer select-none leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        I agree to the{' '}
                        <a className="text-primary hover:underline">Terms of Service</a> and{' '}
                        <a className="text-primary hover:underline">Privacy Policy</a>
                      </label>
                    </div>
                    {errors.agree && <p className="text-rose-400 text-xs mt-1.5 ml-7">{errors.agree}</p>}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-1">
                    <motion.button
                      type="button"
                      onClick={() => { setStep(1); setErrors({}) }}
                      whileHover={{ y: -1 }}
                      className={`flex-1 py-3.5 rounded-xl border font-semibold text-sm transition-all ${
                        isDark ? 'glass border-white/15 hover:border-white/25'
                               : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      ← Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={!loading ? { y: -2, boxShadow: '0 12px 35px rgba(99,102,241,0.45)' } : {}}
                      whileTap={!loading ? { scale: 0.97 } : {}}
                      className="flex-[2] gradient-btn py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          />
                          Creating account…
                        </>
                      ) : (
                        <>Create account <ArrowRight size={16} /></>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className={`text-center text-xs mt-6 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            Protected by 256-bit encryption · SOC 2 compliant
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
