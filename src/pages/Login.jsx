import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Sparkles, ArrowRight, Github, Chrome, Linkedin } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import GradientButton from '../components/ui/GradientButton'
import OTPVerification from '../components/OTPVerification'
import { supabase } from "../lib/supabase"
import { sendLoginNotification } from '../lib/sendLoginNotification'

const loginWithGoogle = async () => {
 await supabase.auth.signInWithOAuth({
   provider: "google"
 })
}

const loginWithGithub = async () => {
 await supabase.auth.signInWithOAuth({
   provider: "github"
 })
}

const loginWithLinkedin = async () => {
 await supabase.auth.signInWithOAuth({
   provider: "linkedin_oidc"
 })
}

const ROLES = [
  { id: 'employer',   label: 'Employer',   icon: '🏢', desc: 'Manage projects & freelancers' },
  { id: 'freelancer', label: 'Freelancer', icon: '💻', desc: 'Find work & build reputation' },
]

export default function Login() {
  const { isDark } = useTheme()
  const { login }  = useApp()
  const navigate   = useNavigate()
  const location   = useLocation()

  // Where the user originally tried to go (if redirected here by ProtectedRoute)
  const from = location.state?.from?.pathname || null

  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ role: 'employer', email: '', password: '', remember: false })
  const [loading, setLoading]   = useState(false)
  const [errors,  setErrors]    = useState({})
  const [socialConfirm, setSocialConfirm] = useState(null) // { provider: 'GitHub' | 'Google' | 'LinkedIn' }
  const [socialConnectValue, setSocialConnectValue] = useState('')
  const [socialConnectNotificationEmail, setSocialConnectNotificationEmail] = useState('')
  const [socialConnectError, setSocialConnectError] = useState('')
  const [showOtpStep, setShowOtpStep] = useState(false)
  const [otpEmail, setOtpEmail] = useState('')
  const [sendOtpLoading, setSendOtpLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.role)     e.role     = 'Please select a role'
    if (!form.email)    e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'At least 6 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)

    // Store the authenticated user with their chosen role
    login({ role: form.role, email: form.email, name: form.email.split('@')[0] })

    // Go where they came from, or to their role-specific dashboard
    const destination = from || (form.role === 'employer' ? '/employer' : '/freelancer')
    navigate(destination, { replace: true })
  }

  const handleSocialConfirm = (provider) => {
    setSocialConfirm({ provider })
    setSocialConnectValue('')
    setSocialConnectNotificationEmail('')
    setSocialConnectError('')
  }
  const loginWithGoogle = () => handleSocialConfirm('Google')
  const loginWithGithub = () => handleSocialConfirm('GitHub')
  const loginWithLinkedin = () => handleSocialConfirm('LinkedIn')

  const sendOtpAndShowVerification = async () => {
    if (!form.email) {
      setErrors(e => ({ ...e, email: 'Email is required' }))
      return
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setErrors(e => ({ ...e, email: 'Enter a valid email' }))
      return
    }
    setErrors(e => ({ ...e, email: undefined }))
    setSendOtpLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: { shouldCreateUser: true }
    })
    setSendOtpLoading(false)
    if (error) {
      setErrors(e => ({ ...e, email: error.message || 'Failed to send OTP' }))
      return
    }
    setOtpEmail(form.email)
    setShowOtpStep(true)
  }

  const handleOtpSuccess = async () => {
    const { data } = await supabase.auth.getUser()
    const user = data?.user
    const destination = from || (form.role === 'employer' ? '/employer' : '/freelancer')
    login({
      role: form.role,
      email: user?.email ?? otpEmail,
      name: user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? otpEmail.split('@')[0]
    })
    setShowOtpStep(false)
    setOtpEmail('')
    navigate(destination, { replace: true })
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
    const destination = from || (role === 'employer' ? '/employer' : '/freelancer')
    if (socialConfirm.provider === 'Google') {
      login({ role, email: v, name: v.split('@')[0] })
      sendLoginNotification(v, 'Google')
    } else if (socialConfirm.provider === 'GitHub') {
      const githubUrl = v.startsWith('http') ? v : `https://github.com/${v}`
      login({ role, email: `github-${v.replace(/^https?:\/\/[^/]*\/?/, '').replace(/\/$/, '')}@connected`, name: 'GitHub User', githubUrl })
      const notifyEmail = socialConnectNotificationEmail.trim()
      if (notifyEmail && /\S+@\S+\.\S+/.test(notifyEmail)) {
        sendLoginNotification(notifyEmail, 'GitHub')
      }
    } else if (socialConfirm.provider === 'LinkedIn') {
      const linkedInUrl = v.startsWith('http') ? v : `https://linkedin.com/in/${v.replace(/^\/+/, '')}`
      login({ role, email: `linkedin-${v.replace(/^https?:\/\/[^/]*\/?/, '').replace(/\/$/, '')}@connected`, name: 'LinkedIn User', linkedInUrl })
      const notifyEmail = socialConnectNotificationEmail.trim()
      if (notifyEmail && /\S+@\S+\.\S+/.test(notifyEmail)) {
        sendLoginNotification(notifyEmail, 'LinkedIn')
      }
    }
    setSocialConfirm(null)
    setSocialConnectValue('')
    setSocialConnectNotificationEmail('')
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

  if (showOtpStep) {
    return (
      <div className="relative">
        <OTPVerification email={otpEmail} onSuccess={handleOtpSuccess} />
        <button
          type="button"
          onClick={() => { setShowOtpStep(false); setOtpEmail('') }}
          className="absolute top-4 left-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium"
        >
          ← Back to login
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen flex ${isDark ? 'bg-bg-dark' : 'bg-bg-light'}`}
    >
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg,#0F172A 0%,#1E1B4B 50%,#0F172A 100%)' }}>
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(circle,#6366F1,transparent)', filter: 'blur(70px)' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle,#8B5CF6,transparent)', filter: 'blur(90px)' }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl rotate-6" />
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold font-display">WS</div>
          </div>
          <span className="text-2xl font-bold font-display text-white">Work<span className="gradient-text">Synth</span></span>
        </div>

        {/* Hero copy */}
        <div className="relative">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm text-slate-300">
              <Sparkles size={14} className="text-accent" />
              AI Powered Freelance Execution
            </div>
            <h2 className="text-4xl font-bold font-display text-white leading-tight mb-5">
              Your projects,<br /><span className="gradient-text">perfectly executed.</span>
            </h2>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              From AI milestones to smart escrow, WorkSynth handles the complexity so you can focus on what matters.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            {[{value:'$42M+',label:'Processed'},{value:'98.4%',label:'On-time'},{value:'12k+',label:'Freelancers'}].map((s,i) => (
              <motion.div key={s.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5+i*0.1}}
                className="glass rounded-2xl p-4 text-center">
                <div className="text-xl font-bold font-display gradient-text">{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8}} className="relative glass rounded-2xl p-5">
          <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(i=><span key={i} className="text-amber-400 text-xs">★</span>)}</div>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">"WorkSynth cut our project overhead by 60%. The AI features are genuinely magical."</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-xs font-bold text-white">M</div>
            <div><div className="text-sm font-semibold text-white">Marcus Chen</div><div className="text-xs text-slate-400">CTO, Buildloop</div></div>
          </div>
        </motion.div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity:0, x:30 }}
          animate={{ opacity:1, x:0 }}
          transition={{ duration:0.6, ease:[0.4,0,0.2,1] }}
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

          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display mb-2">Welcome back</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-semibold">Sign up free</Link>
            </p>
          </div>

          {/* ── Role selector ── */}
          <div className="mb-6">
            <p className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Sign in as</p>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map(role => (
                <motion.div
                  key={role.id}
                  onClick={() => { setForm(f => ({...f, role: role.id})); setErrors(e => ({...e, role: undefined})) }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all select-none ${
                    form.role === role.id
                      ? 'border-primary/60 bg-primary/8'
                      : isDark
                        ? 'glass border-white/10 hover:border-white/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="text-2xl mb-1.5">{role.icon}</div>
                  <div className="font-semibold text-sm">{role.label}</div>
                  <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{role.desc}</div>
                  {form.role === role.id && (
                    <div className="mt-2 w-full h-0.5 rounded-full bg-gradient-to-r from-primary to-secondary" />
                  )}
                </motion.div>
              ))}
            </div>
            {errors.role && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-rose-400 text-xs mt-2">{errors.role}</motion.p>}
          </div>

          {/* ── Social logins ── */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: <Github size={16} />,   label: 'GitHub' },
              { icon: <Chrome size={16} />,   label: 'Google' },
              { icon: <Linkedin size={16} />, label: 'LinkedIn' },
            ].map(btn => (
              <motion.button key={btn.label} type="button" whileHover={{y:-2}} whileTap={{scale:0.97}}
                onClick={() => handleSocialConfirm(btn.label)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  isDark ? 'glass border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/8'
                         : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm'}`}>
                {btn.icon} {btn.label}
              </motion.button>
            ))}
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <button type="button" onClick={loginWithGoogle}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                isDark ? 'glass border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/8'
                       : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm'}`}>
              Login with Google
            </button>
            <button type="button" onClick={loginWithGithub}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                isDark ? 'glass border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/8'
                       : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm'}`}>
              Login with GitHub
            </button>
            <button type="button" onClick={loginWithLinkedin}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                isDark ? 'glass border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/8'
                       : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm'}`}>
              Login with LinkedIn
            </button>
          </div>

          {/* ── Social connect dialog: ask for GitHub link / LinkedIn link / Gmail ── */}
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
                    Sign in as {ROLES.find(r => r.id === form.role)?.label}
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
                    {(socialConfirm.provider === 'GitHub' || socialConfirm.provider === 'LinkedIn') && (
                      <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Email for login notification (optional)
                        </label>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={socialConnectNotificationEmail}
                          onChange={e => setSocialConnectNotificationEmail(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border ${
                            isDark
                              ? 'bg-white/5 border-white/10 text-white placeholder-slate-600 focus:border-primary/60'
                              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary/50'
                          }`}
                        />
                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          We’ll send a short email when you sign in with {socialConfirm.provider}.
                        </p>
                      </div>
                    )}
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
                        Connect & sign in
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )
          })()}

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>or continue with email</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
          </div>

          {/* ── Email / password form ── */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email address</label>
              <input type="email" placeholder="you@company.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} className={inputClass('email')} />
              {errors.email && <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} className="text-rose-400 text-xs mt-1.5">{errors.email}</motion.p>}
              <button
                type="button"
                onClick={sendOtpAndShowVerification}
                disabled={sendOtpLoading}
                className={`mt-2 text-xs font-medium ${isDark ? 'text-primary hover:text-primary/80' : 'text-primary hover:underline'}`}
              >
                {sendOtpLoading ? 'Sending OTP…' : 'Send OTP to this email instead'}
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
                <a className="text-xs text-primary hover:underline cursor-pointer">Forgot password?</a>
              </div>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className={inputClass('password') + ' pr-11'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>
                  {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {errors.password && <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} className="text-rose-400 text-xs mt-1.5">{errors.password}</motion.p>}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <button type="button" onClick={() => setForm({...form, remember: !form.remember})}
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all border ${
                  form.remember ? 'bg-primary border-primary text-white' : isDark ? 'border-white/20 bg-white/5' : 'border-slate-300 bg-white'}`}>
                {form.remember && <span className="text-xs font-bold">✓</span>}
              </button>
              <label onClick={() => setForm({...form, remember: !form.remember})}
                className={`text-sm cursor-pointer select-none ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Remember me for 30 days
              </label>
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={!loading ? {y:-2, boxShadow:'0 12px 35px rgba(99,102,241,0.45)'} : {}}
              whileTap={!loading ? {scale:0.97} : {}}
              className="gradient-btn w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <><motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{rotate:360}} transition={{duration:0.8,repeat:Infinity,ease:'linear'}} />
                  Signing in…</>
              ) : (
                <>Sign in as {ROLES.find(r => r.id === form.role)?.label} <ArrowRight size={16}/></>
              )}
            </motion.button>
          </form>

          {/* Demo hint */}
          <div className={`mt-5 p-4 rounded-xl border text-xs ${isDark ? 'border-white/8 bg-white/3 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
            <span className="font-semibold text-primary">Demo:</span> Select a role, enter any email &amp; password (6+ chars), then sign in.
          </div>

          <p className={`text-center text-xs mt-5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            By signing in you agree to our{' '}
            <a className="text-primary hover:underline cursor-pointer">Terms</a> and{' '}
            <a className="text-primary hover:underline cursor-pointer">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
