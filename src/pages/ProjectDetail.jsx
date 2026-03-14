import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, CreditCard } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import GlassCard from '../components/ui/GlassCard'
import GradientButton from '../components/ui/GradientButton'
import Badge from '../components/ui/Badge'
import ProgressBar from '../components/ui/ProgressBar'
import {
  MilestoneTimeline,
  SubmissionUpload,
  AIQualityCheck,
  ActivityFeed,
} from '../components/project/ProjectComponents'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import { projects } from '../data/projects'
import { createEscrowCheckout } from '../lib/escrow'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { toggleAIPanel } = useApp()
  const [escrowLoading, setEscrowLoading] = useState(false)

  const project = projects.find(p => p.id === id) || projects[0]
  const firstPendingMilestone = project.milestones?.find(m => m.status === 'pending') || project.milestones?.[0]

  const handleFundEscrow = async () => {
    if (!firstPendingMilestone) return
    setEscrowLoading(true)
    const amountInr = firstPendingMilestone.amount || Math.round((project.budget || 0) / 5)
    const amountPaise = amountInr * 100
    const result = await createEscrowCheckout({
      amountPaise,
      projectId: project.id,
      milestoneId: firstPendingMilestone.id,
    })
    setEscrowLoading(false)
    if (result) window.location.href = `${window.location.origin}/project/${id}?escrow=success`
  }

  const sidebarLinks = [
    { icon: '📁', label: 'Overview', to: `/project/${id}` },
    { icon: '🗂', label: 'Milestones' },
    { icon: '💬', label: 'Messages', badge: '2' },
    { icon: '📎', label: 'Files' },
    { icon: '💸', label: 'Payments' },
    { divider: true },
    { icon: '←', label: 'Employer Dashboard', to: '/employer' },
  ]

  const sidebarHeader = (
    <button
      onClick={() => navigate('/employer')}
      className={`flex items-center gap-2 text-sm transition-colors w-full ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
    >
      <ArrowLeft size={14} />
      Back to Dashboard
    </button>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen pt-16"
    >
      <Sidebar links={sidebarLinks} header={sidebarHeader} />

      <main className="flex-1 md:ml-60 p-4 sm:p-6 min-w-0">
        {/* Project header card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold font-display">{project.title}</h1>
                  <Badge status={project.status} />
                </div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {project.category} · TechCorp Inc. × {project.freelancer.name}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <motion.button
                  onClick={toggleAIPanel}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isDark ? 'glass hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                >
                  <Sparkles size={14} className="text-accent" /> AI Assist
                </motion.button>
                {firstPendingMilestone && (
                  <motion.button
                    onClick={handleFundEscrow}
                    disabled={escrowLoading}
                    whileHover={!escrowLoading ? { scale: 1.02 } : {}}
                    whileTap={!escrowLoading ? { scale: 0.97 } : {}}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white transition-all"
                  >
                    <CreditCard size={14} /> {escrowLoading ? 'Opening…' : 'Fund with Razorpay'}
                  </motion.button>
                )}
                <GradientButton>Approve Milestone</GradientButton>
              </div>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { label: 'Budget', value: `$${project.budget.toLocaleString()}`, color: 'text-emerald-400' },
                { label: 'Deadline', value: project.deadline },
                { label: 'Progress', value: `${project.progress}%`, color: 'gradient-text' },
                { label: 'Quality Score', value: 'A+ (98)', color: 'text-accent' },
              ].map(m => (
                <div key={m.label}>
                  <div className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{m.label}</div>
                  <div className={`font-semibold ${m.color || ''}`}>{m.value}</div>
                </div>
              ))}
            </div>

            <ProgressBar value={project.progress} color="primary" height="md" />
          </GlassCard>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Milestone timeline — left 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <h2 className="font-bold font-display mb-5">Milestone Timeline</h2>
            <MilestoneTimeline milestones={project.milestones} />
          </motion.div>

          {/* Right panel — 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-5"
          >
            <SubmissionUpload />
            <AIQualityCheck />
            <ActivityFeed />
          </motion.div>
        </div>
      </main>
    </motion.div>
  )
}
