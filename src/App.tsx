import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { Workflows } from './components/Workflows'
import { Integrations } from './components/Integrations'
import { AIAssistant } from './components/AIAssistant'
import { Analytics } from './components/Analytics'
import { Toaster } from './components/ui/toaster'
import './App.css'

type Page = 'dashboard' | 'workflows' | 'integrations' | 'ai-assistant' | 'analytics'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading carbonN...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              carbonN
            </h1>
            <p className="text-xl text-slate-300">AI-Powered Automation & Integration Platform</p>
          </div>
          <button
            onClick={() => blink.auth.login()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'workflows':
        return <Workflows />
      case 'integrations':
        return <Integrations />
      case 'ai-assistant':
        return <AIAssistant />
      case 'analytics':
        return <Analytics />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} user={user} />
      <main className="flex-1 ml-64">
        {renderPage()}
      </main>
      <Toaster />
    </div>
  )
}

export default App