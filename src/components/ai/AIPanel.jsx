import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Send, Zap } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { aiReplies } from '../../data/index'

const quickActions = [
  { icon: '📊', text: 'Analyze project health' },
  { icon: '🔍', text: 'Review milestone quality' },
  { icon: '💡', text: 'Suggest next steps' },
  { icon: '💸', text: 'Escrow status update' },
]

export default function AIPanel() {
  const { aiPanelOpen, closeAIPanel } = useApp()
  const { isDark } = useTheme()
  const [messages, setMessages] = useState([
    {
      id: 1, from: 'ai',
      text: "Hey! I'm your WorkSynth AI assistant. I can help with project analysis, milestone tracking, quality checks, and smart recommendations. What would you like to explore?",
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [replyIndex, setReplyIndex] = useState(0)
  const [actions, setActions] = useState(quickActions)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = (text) => {
    if (!text.trim()) return
    const userMsg = { id: Date.now(), from: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      setTyping(false)
      const aiMsg = {
        id: Date.now() + 1,
        from: 'ai',
        text: aiReplies[replyIndex % aiReplies.length],
      }
      setMessages(prev => [...prev, aiMsg])
      setReplyIndex(prev => prev + 1)
    }, 1600 + Math.random() * 600)
  }

  const handleQuickAction = (action) => {
    setActions(prev => prev.filter(a => a.text !== action.text))
    sendMessage(`${action.icon} ${action.text}`)
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {aiPanelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAIPanel}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {aiPanelOpen && (
          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className={`fixed right-0 top-16 bottom-0 w-80 flex flex-col z-50 border-l ${isDark ? 'bg-card-dark/95 border-white/10' : 'bg-white/95 border-slate-200'} backdrop-blur-2xl`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Sparkles size={16} className="text-white" />
                </motion.div>
                <div>
                  <div className="font-semibold text-sm font-display">WorkSynth AI</div>
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Online</span>
                  </div>
                </div>
              </div>
              <motion.button
                onClick={closeAIPanel}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isDark ? 'glass hover:bg-white/15 text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'}`}
              >
                <X size={14} />
              </motion.button>
            </div>

            {/* Quick actions */}
            <AnimatePresence>
              {actions.length > 0 && (
                <motion.div
                  initial={{ height: 'auto' }}
                  exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
                  className={`p-3 border-b ${isDark ? 'border-white/8' : 'border-slate-100'}`}
                >
                  <div className={`text-xs font-semibold mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>QUICK ACTIONS</div>
                  <div className="space-y-1.5">
                    {actions.map(a => (
                      <motion.button
                        key={a.text}
                        layout
                        exit={{ opacity: 0, x: 20 }}
                        onClick={() => handleQuickAction(a)}
                        whileHover={{ x: 3 }}
                        className={`w-full text-left text-xs px-3 py-2.5 rounded-xl transition-all ${isDark ? 'glass hover:bg-white/8 text-slate-300' : 'bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
                      >
                        {a.icon} {a.text}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-2 ${msg.from === 'user' ? 'justify-end' : ''}`}
                  >
                    {msg.from === 'ai' && (
                      <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs mt-0.5" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}>
                        <Sparkles size={10} className="text-white" />
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${
                      msg.from === 'user'
                        ? 'bg-gradient-to-br from-primary to-secondary text-white rounded-tr-sm'
                        : isDark
                          ? 'bg-primary/10 border border-primary/20 text-slate-300 rounded-tl-sm'
                          : 'bg-primary/8 border border-primary/15 text-slate-700 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    {msg.from === 'user' && (
                      <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs bg-gradient-to-br from-violet-400 to-purple-600 mt-0.5 font-bold text-white">Y</div>
                    )}
                  </motion.div>
                ))}

                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2"
                  >
                    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}>
                      <Sparkles size={10} className="text-white" />
                    </div>
                    <div className={`rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center ${isDark ? 'bg-primary/10 border border-primary/20' : 'bg-primary/8 border border-primary/15'}`}>
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Ask me anything..."
                  className={`flex-1 text-sm px-4 py-2.5 rounded-xl outline-none transition-all ${
                    isDark
                      ? 'bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:border-primary/50'
                      : 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary/50'
                  } border`}
                />
                <motion.button
                  onClick={() => sendMessage(input)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="gradient-btn w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                >
                  <Send size={14} />
                </motion.button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
