import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  // auth: null | { role, name, email, githubUrl?, linkedInUrl? } (githubUrl/linkedInUrl when connected via social)
  const [user, setUser] = useState(null)

  const toggleAIPanel = () => setAiPanelOpen(prev => !prev)
  const closeAIPanel  = () => setAiPanelOpen(false)

  const login  = (userData) => setUser(userData)
  const logout = () => { setUser(null); setAiPanelOpen(false) }

  return (
    <AppContext.Provider value={{ aiPanelOpen, toggleAIPanel, closeAIPanel, user, login, logout }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
